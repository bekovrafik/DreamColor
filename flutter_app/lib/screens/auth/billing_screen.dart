import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../services/purchase_service.dart';

class BillingScreen extends StatelessWidget {
  const BillingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => context.pop(),
                    icon: const Icon(Icons.arrow_back),
                  ),
                  Expanded(
                    child: Text(
                      'Choose Your Plan',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(24.0),
                children: [
                  _buildPlanCard(
                    context,
                    title: 'Single Adventure',
                    price: r'$2.99',
                    credits: '6 Credits',
                    description: 'Perfect for 1 Full Book',
                    features: [
                      'Photo Uploads',
                      'Print-Ready PDF Export',
                      'Access to all Themes',
                      'Unlimited Gallery Space',
                    ],
                    onPressed: () =>
                        _handlePurchase(context, 'single_adventure'),
                  ),
                  const SizedBox(height: 24),
                  _buildPlanCard(
                    context,
                    title: 'Explorer Pack',
                    price: r'$29.99',
                    credits: '30 Credits',
                    description: 'Perfect for 5 Full Books',
                    features: [
                      'Everything in Single Adventure',
                      'Marked as "Most Popular"',
                      'Best Value per Credit',
                    ],
                    isPopular: true,
                    onPressed: () => _handlePurchase(context, 'explorer_pack'),
                  ),
                  const SizedBox(height: 32),
                  const PlanComparisonTable(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handlePurchase(BuildContext context, String productId) async {
    final purchaseService = PurchaseService();
    final products = purchaseService.products;
    final product = products.isNotEmpty
        ? products.firstWhere(
            (p) => p.id == productId,
            orElse: () => throw Exception('Product not found'),
          )
        : null;

    try {
      if (product != null) {
        await purchaseService.buyConsumable(product);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Connecting to store... Please try again.'),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Purchase failed: $e')));
      }
    }
  }

  Widget _buildPlanCard(
    BuildContext context, {
    required String title,
    required String price,
    required String credits,
    required String description,
    required List<String> features,
    required VoidCallback onPressed,
    bool isPopular = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(24),
        border: isPopular
            ? Border.all(color: Theme.of(context).colorScheme.primary, width: 2)
            : Border.all(color: Colors.grey.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (isPopular)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 4),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(22),
                  topRight: Radius.circular(22),
                ),
              ),
              child: Text(
                'MOST POPULAR',
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.outfit(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      price,
                      style: GoogleFonts.outfit(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  credits,
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Theme.of(context).colorScheme.secondary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey),
                ),
                const Divider(height: 32),
                ...features.map(
                  (f) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Row(
                      children: [
                        Icon(
                          Icons.check_circle,
                          size: 20,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            f,
                            style: GoogleFonts.outfit(fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: onPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(26),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'Get Started',
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class PlanComparisonTable extends StatelessWidget {
  const PlanComparisonTable({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Compare Plans',
          style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        _buildRow('Daily Limit', '1 Page', 'Unlimited'),
        _buildRow('Themes', 'Space Only', 'All Themes'),
        _buildRow('Photo Upload', 'Locked', 'Unlocked'),
        _buildRow('PDF Export', 'Locked', 'Unlocked'),
      ],
    );
  }

  Widget _buildRow(String feature, String free, String paid) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              feature,
              style: GoogleFonts.outfit(fontWeight: FontWeight.w500),
            ),
          ),
          Expanded(
            child: Text(
              free,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
          Expanded(
            child: Text(
              paid,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.blue,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
