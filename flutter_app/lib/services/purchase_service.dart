import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:purchases_flutter/purchases_flutter.dart';

class PurchaseService with ChangeNotifier {
  static final PurchaseService _instance = PurchaseService._internal();

  factory PurchaseService() => _instance;

  PurchaseService._internal();

  List<Package> _packages = [];

  // Product IDs (Constants to match RevenueCat Package Identifiers if possible, or just for UI mapping)
  // Ideally, configure RevenueCat packages to have identifiers that help us map, or we just trust the Offering order.
  // For now, let's assume the Offering has these packages.
  static const String productExplorerPack = 'explorer_pack';
  static const String productSingleAdventure = 'single_adventure';
  static const String productPartyMaster = 'party_master';

  List<Package> get packages => _packages;

  Future<void> init() async {
    await Purchases.setLogLevel(LogLevel.debug);

    String? apiKey;
    if (Platform.isAndroid) {
      apiKey = dotenv.env['REVENUECAT_ANDROID_KEY'];
    } else if (Platform.isIOS) {
      apiKey = dotenv.env['REVENUECAT_IOS_KEY'];
    }

    if (apiKey != null) {
      PurchasesConfiguration configuration = PurchasesConfiguration(apiKey);
      await Purchases.configure(configuration);
      await _fetchOfferings();
    }
  }

  Future<void> _fetchOfferings() async {
    try {
      Offerings offerings = await Purchases.getOfferings();
      if (offerings.current != null &&
          offerings.current!.availablePackages.isNotEmpty) {
        _packages = offerings.current!.availablePackages;
        notifyListeners();
      }
    } catch (e) {
      debugPrint("Error fetching offerings: $e");
    }
  }

  Future<CustomerInfo> purchasePackage(Package package) async {
    try {
      CustomerInfo customerInfo = await Purchases.purchasePackage(package);
      return customerInfo;
    } catch (e) {
      debugPrint("Purchase error: $e");
      rethrow;
    }
  }
}
