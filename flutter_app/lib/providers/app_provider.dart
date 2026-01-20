import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:uuid/uuid.dart';
import '../models/book.dart';
import '../models/preset.dart';
import '../models/chat_message.dart';
import '../services/purchase_service.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

class AppProvider with ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  SharedPreferences? _prefs;

  User? _user;
  StreamSubscription<User?>? _authSubscription;
  StreamSubscription<DocumentSnapshot>? _userDataSubscription;
  StreamSubscription<QuerySnapshot>? _booksSubscription;

  // State
  String _childName = '';
  // Default values
  bool _darkMode = false;
  int _credits = 0;
  bool _isPaidUser = false;
  int _lastFreeGenerationTime = 0;
  String _theme = '';
  List<String> _generatedImages = [];
  String? _uploadedImage;
  List<ChatMessage> _chatHistory = [];
  List<SavedBook> _savedBooks = [];
  List<Preset> _presets = [];
  bool _isLoading = true;

  // Getters
  User? get user => _user;
  bool get isAuthenticated => _user != null;
  String get childName => _childName;
  bool get darkMode => _darkMode;
  int get credits => _credits;
  bool get isPaidUser => _isPaidUser;
  String get theme => _theme;
  List<String> get generatedImages => _generatedImages;
  String? get uploadedImage => _uploadedImage;
  List<ChatMessage> get chatHistory => _chatHistory;
  List<SavedBook> get savedBooks => _savedBooks;
  List<Preset> get presets => _presets;
  bool get isLoading => _isLoading;

  // Permission Getters
  bool get canExportPdf => _isPaidUser;
  bool get canUploadPhotos => _isPaidUser;
  bool get canAccessAllThemes => _isPaidUser;
  bool get canRemix => _isPaidUser;

  AppProvider() {
    _init();
  }

  Future<void> _init() async {
    _prefs = await SharedPreferences.getInstance();

    // Load local prefs for simple settings like Theme which might be device specific
    _darkMode = _prefs?.getString('dreamcolor_theme') == 'dark';

    // Global Data Fetch
    fetchPresets();

    _authSubscription = _auth.authStateChanges().listen((user) {
      _user = user;
      _isLoading = false;
      if (user != null) {
        _subscribeToUserData(user.uid);
        _subscribeToUserBooks(user.uid);
        PurchaseService().init();
        _setupPurchaseListener();
      } else {
        _clearUserData();
      }
      notifyListeners();
    });
  }

  void _subscribeToUserData(String uid) {
    _userDataSubscription?.cancel();
    _userDataSubscription = _firestore
        .collection('users')
        .doc(uid)
        .snapshots()
        .listen((snapshot) {
          if (snapshot.exists) {
            final data = snapshot.data() as Map<String, dynamic>;
            _childName = data['childName'] ?? '';
            _credits = data['credits'] ?? 0;
            _isPaidUser =
                data['isPaidUser'] ?? false; // Now managed by app logic
            _lastFreeGenerationTime = data['lastFreeGenerationTime'] ?? 0;
            notifyListeners();
          }
        });
  }

  void _subscribeToUserBooks(String uid) {
    _booksSubscription?.cancel();
    _booksSubscription = _firestore
        .collection('users')
        .doc(uid)
        .collection('books')
        .orderBy('date', descending: true)
        .snapshots()
        .listen((snapshot) {
          _savedBooks = snapshot.docs
              .map((doc) {
                final data = doc.data();
                // Ensure ID matches doc ID if needed, or trust data
                return SavedBook.fromJson({...data, 'id': doc.id});
              })
              .where((book) => !book.isDeleted)
              .toList(); // Client-side soft delete filter
          notifyListeners();
        });
  }

  void _clearUserData() {
    _userDataSubscription?.cancel();
    _booksSubscription?.cancel();
    _childName = '';
    _credits = 0;
    _isPaidUser = false;
    _savedBooks = [];
    _chatHistory = [];
    _generatedImages = [];
    notifyListeners();
  }

  // --- Auth Actions ---

  Future<void> register(String email, String password, String childName) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      // Create User Doc
      if (cred.user != null) {
        await _firestore.collection('users').doc(cred.user!.uid).set({
          'childName': childName,
          'email': email,
          'credits': 0,
          'isPaidUser': false,
          'createdAt': FieldValue.serverTimestamp(),
          'lastFreeGenerationTime': 0,
        });
      }
    } catch (e) {
      // Re-throw to be handled by UI
      rethrow;
    }
  }

  Future<void> login(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await _auth.signOut();
    await GoogleSignIn().signOut();
  }

  Future<void> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return;

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final cred = await _auth.signInWithCredential(credential);

      // If new user, create doc
      if (cred.additionalUserInfo?.isNewUser ?? false) {
        await _firestore.collection('users').doc(cred.user!.uid).set({
          'childName': googleUser.displayName ?? '',
          'email': googleUser.email,
          'credits': 0,
          'isPaidUser': false,
          'createdAt': FieldValue.serverTimestamp(),
          'lastFreeGenerationTime': 0,
        });
      }
    } catch (e) {
      rethrow;
    }
  }

  // --- Logic ---

  // Note: setChildName etc now update Firestore
  Future<void> setChildName(String name) async {
    if (_user == null) return;
    await _firestore.collection('users').doc(_user!.uid).set({
      'childName': name,
    }, SetOptions(merge: true));
    // Local update happens via stream
  }

  Future<void> fetchPresets() async {
    try {
      final snapshot = await _firestore.collection('presets').get();
      _presets = snapshot.docs
          .map(
            (doc) => Preset.fromMap(doc.id, doc.data()),
          ) // data() returns Map<String, dynamic>
          .toList();
      notifyListeners();
    } catch (e) {
      debugPrint("Error fetching presets: $e");
    }
  }

  Future<void> toggleDarkMode() async {
    _darkMode = !_darkMode;
    await _prefs?.setString('dreamcolor_theme', _darkMode ? 'dark' : 'light');
    notifyListeners();
  }

  // RevenueCat Listener
  void _setupPurchaseListener() {
    Purchases.addCustomerInfoUpdateListener((customerInfo) {
      _handleCustomerInfo(customerInfo);
    });
  }

  void _handleCustomerInfo(CustomerInfo customerInfo) async {
    // Check for 'premium_access' entitlement
    final EntitlementInfo? entitlement =
        customerInfo.entitlements.all['premium_access'];

    if (entitlement != null && entitlement.isActive) {
      if (!_isPaidUser) {
        // Update Firestore only if state changes
        if (_user != null) {
          await _firestore.collection('users').doc(_user!.uid).set({
            'isPaidUser': true,
          }, SetOptions(merge: true));
        }
      }
    }
  }

  // Initiate Purchase (Credits handled by Webhook)
  Future<void> buyCredits(Package package) async {
    try {
      await PurchaseService().purchasePackage(package);
      // No client-side credit increment!
      // Webhook -> Cloud Function -> Firestore
    } catch (e) {
      rethrow;
    }
  }

  Future<String?> reserveCreditsAndCreateDraft(
    List<String> scenes,
    String theme,
  ) async {
    if (_user == null) return null;

    final userRef = _firestore.collection('users').doc(_user!.uid);
    final draftRef = userRef.collection('drafts').doc();

    try {
      return await _firestore.runTransaction((transaction) async {
        final userSnapshot = await transaction.get(userRef);
        if (!userSnapshot.exists) throw Exception("User does not exist");

        final currentCredits = userSnapshot.data()?['credits'] ?? 0;
        if (currentCredits < 6) {
          throw Exception("Insufficient credits");
        }

        // Deduct 6 credits
        transaction.update(userRef, {'credits': currentCredits - 6});

        // Create Draft
        transaction.set(draftRef, {
          'status': 'pending',
          'theme': theme,
          'scenes': scenes,
          'pages': [],
          'createdAt': FieldValue.serverTimestamp(),
          'errorCount': 0,
        });

        return draftRef.id;
      });
    } catch (e) {
      debugPrint("Transaction failed: $e");
      return null;
    }
  }

  bool deductCredits(int amount) {
    if (_user == null) return false;
    if (_credits >= amount) {
      _firestore.collection('users').doc(_user!.uid).update({
        'credits': FieldValue.increment(-amount),
      });
      return true;
    }
    return false;
  }

  Future<void> recordFreeGeneration() async {
    if (_user == null) return;
    final now = DateTime.now().millisecondsSinceEpoch;
    await _firestore.collection('users').doc(_user!.uid).set({
      'lastFreeGenerationTime': now,
    }, SetOptions(merge: true));
  }

  Map<String, dynamic> checkFreeLimit() {
    final now = DateTime.now().millisecondsSinceEpoch;
    final hours24 = 24 * 60 * 60 * 1000;
    final diff = now - _lastFreeGenerationTime;

    if (diff > hours24) {
      return {'allowed': true};
    } else {
      final remaining = hours24 - diff;
      final hours = (remaining / (1000 * 60 * 60)).floor();
      final minutes = ((remaining % (1000 * 60 * 60)) / (1000 * 60)).floor();
      return {'allowed': false, 'waitTimeStr': '${hours}h ${minutes}m'};
    }
  }

  // --- Local Session State (Chat, etc) ---

  void setTheme(String theme) {
    _theme = theme;
    notifyListeners();
  }

  void setGeneratedImages(List<String> images) {
    _generatedImages = images;
    notifyListeners();
  }

  void setUploadedImage(String? image) {
    _uploadedImage = image;
    notifyListeners();
  }

  void addChatMessage(String role, String text) {
    _chatHistory.add(ChatMessage(role: role, text: text));
    notifyListeners();
  }

  void clearChat() {
    _chatHistory.clear();
    notifyListeners();
  }

  void resetAdventure() {
    _theme = '';
    _uploadedImage = null;
    _generatedImages = [];
    _chatHistory = [];
    notifyListeners();
  }

  void loadBook(SavedBook book) {
    _theme = book.theme;
    _generatedImages = book.pages.isNotEmpty ? book.pages : [book.imageUrl];
    _uploadedImage = null;
    _chatHistory = [];
    notifyListeners();
  }

  // --- Book Management ---

  Future<void> saveBook({
    required String title,
    required String imageUrl,
    required List<String> pages,
    required String theme,
    String? storagePath,
  }) async {
    if (_user == null) return;

    final newBook = SavedBook(
      id: const Uuid()
          .v4(), // We can let Firestore generate ID or use UUID. UUID is consistent with model.
      title: title,
      date: DateTime.now().toIso8601String(),
      imageUrl: imageUrl,
      pages: pages,
      theme: theme,
      storagePath: storagePath,
    );

    // We used to insert to list locally, now we write to Firestore
    await _firestore
        .collection('users')
        .doc(_user!.uid)
        .collection('books')
        .add(newBook.toJson());
    // Stream updates the UI
  }

  Future<void> deleteBook(String id) async {
    if (_user == null) return;

    // Soft delete: update isDeleted to true
    await _firestore
        .collection('users')
        .doc(_user!.uid)
        .collection('books')
        .doc(id)
        .update({'isDeleted': true});
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    _userDataSubscription?.cancel();
    _booksSubscription?.cancel();
    super.dispose();
  }
}
