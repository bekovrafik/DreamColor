import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

class PurchaseService with ChangeNotifier {
  static final PurchaseService _instance = PurchaseService._internal();

  factory PurchaseService() => _instance;

  PurchaseService._internal();

  final InAppPurchase _iap = InAppPurchase.instance;
  bool _available = false;
  List<ProductDetails> _products = [];

  // Product IDs
  static const String productExplorerPack = 'explorer_pack';
  static const String productSingleAdventure = 'single_adventure';

  static const List<String> _kProductIds = <String>[
    productExplorerPack,
    productSingleAdventure,
  ];

  /// Stream of purchase updates
  late StreamSubscription<List<PurchaseDetails>> _subscription;
  Function(PurchaseDetails)? _onPurchaseCompleted;

  bool get isAvailable => _available;
  List<ProductDetails> get products => _products;

  Future<void> init({Function(PurchaseDetails)? onPurchaseCompleted}) async {
    _onPurchaseCompleted = onPurchaseCompleted;
    final Stream<List<PurchaseDetails>> purchaseUpdated = _iap.purchaseStream;
    _subscription = purchaseUpdated.listen(
      (List<PurchaseDetails> purchaseDetailsList) {
        _listenToPurchaseUpdated(purchaseDetailsList);
      },
      onDone: () {
        _subscription.cancel();
      },
      onError: (Object error) {
        // handle error
      },
    );
    await _initStore();
  }

  Future<void> _initStore() async {
    _available = await _iap.isAvailable();
    if (_available) {
      await _fetchProducts();
    }
    notifyListeners();
  }

  Future<void> _fetchProducts() async {
    final ProductDetailsResponse response = await _iap.queryProductDetails(
      _kProductIds.toSet(),
    );
    if (response.error == null) {
      _products = response.productDetails;
      notifyListeners();
    }
  }

  Future<void> _listenToPurchaseUpdated(
    List<PurchaseDetails> purchaseDetailsList,
  ) async {
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // Show pending UI if needed
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          // Handle error
        } else if (purchaseDetails.status == PurchaseStatus.purchased ||
            purchaseDetails.status == PurchaseStatus.restored) {
          if (_onPurchaseCompleted != null) {
            _onPurchaseCompleted!(purchaseDetails);
          }
        }

        if (purchaseDetails.pendingCompletePurchase) {
          await _iap.completePurchase(purchaseDetails);
        }
      }
    }
  }

  /// Purchase a consumable
  Future<void> buyConsumable(ProductDetails productDetails) async {
    final PurchaseParam purchaseParam = PurchaseParam(
      productDetails: productDetails,
    );

    // For consumable, we assume verification happens in listener
    // Note: 'autoConsume' logic differs by platform, sticking to standard flow
    if (_kProductIds.contains(productDetails.id)) {
      await _iap.buyConsumable(purchaseParam: purchaseParam);
    }
  }

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
