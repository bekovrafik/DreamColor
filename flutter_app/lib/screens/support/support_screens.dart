import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../providers/app_provider.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../services/purchase_service.dart';

// SHARED WIDGETS
class SupportTopBar extends StatelessWidget {
  final String title;
  const SupportTopBar({super.key, required this.title});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 8.0),
      child: Row(
        children: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.arrow_back),
          ),
          Expanded(
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.onSurface,
              ),
            ),
          ),
          const SizedBox(width: 48), // Balance
        ],
      ),
    );
  }
}

// ABOUT SCREEN
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Actions only valid if packages are added, using placeholder for now
    void handleShare() {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Sharing coming soon!')));
    }

    void handleRate() {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Rating coming soon!')));
    }

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const SupportTopBar(title: 'About DreamColor'),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Hero Section
                  Container(
                    height: 220,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      image: const DecorationImage(
                        image: NetworkImage(
                          "https://lh3.googleusercontent.com/aida-public/AB6AXuCr3oX05EUYLbiYyaakon2vsa-O1iVEdEsRbwHGZXQAQThoaPvlEF3HhMzH_AbONYigsr9nWeEp_v_btQ5rKZs7zuXvifRIQ5QDC9mkJ4qHiux_h8xARw6wE9devSCg7RTYuKhLqTnNewgJY1CuWGnX-ogCYHvcVixPFKQUDTvISlg98xfeFZaDCFIA4GtxSCK3VJCpubpu7iCfT4XmDukj5gAZSNe20p5FJC1AdKSlhGU8sFWPFBdLc6xUr3T48EqXnDcWTqNds4J0",
                        ),
                        fit: BoxFit.cover,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24),
                            gradient: LinearGradient(
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                              colors: [
                                Colors.black.withValues(alpha: 0.8),
                                Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 20,
                          left: 20,
                          right: 20,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Dream. Color. Play.",
                                style: GoogleFonts.comicNeue(
                                  color: Colors.white,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                "Sparking creativity, one page at a time.",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Description
                  Text(
                    "DreamColor was born from a simple idea: What if children could color their own memories?\n\nWe use cutting-edge AI to instantly transform photos and wild ideas into beautiful, print-ready coloring pages. We believe every child is an artist, and the best stories are the ones they imagine themselves.",
                    style: GoogleFonts.outfit(
                      height: 1.6,
                      fontSize: 16,
                      color: Theme.of(
                        context,
                      ).colorScheme.onSurface.withValues(alpha: 0.8),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // How It Works
                  Text(
                    "How Magic Happens",
                    style: GoogleFonts.comicNeue(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildStepCard(
                    context,
                    icon: Icons.add_a_photo,
                    color: Theme.of(context).colorScheme.primary,
                    title: "1. Snap & Upload",
                    desc: "Upload a photo or describe a scene.",
                  ),
                  const SizedBox(height: 12),
                  _buildStepCard(
                    context,
                    icon: Icons.auto_awesome,
                    color: Colors.purple,
                    title: "2. AI Draws It",
                    desc: "Our engine creates bold, clean lines.",
                  ),
                  const SizedBox(height: 12),
                  _buildStepCard(
                    context,
                    icon: Icons.print,
                    color: Colors.green,
                    title: "3. Print & Color",
                    desc: "Export PDF and bring it to life!",
                  ),

                  const SizedBox(height: 32),

                  // Actions
                  ElevatedButton.icon(
                    onPressed: handleShare,
                    icon: const Icon(Icons.share, color: Colors.white),
                    label: const Text("Share App"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          Theme.of(context).brightness == Brightness.dark
                          ? Colors.white
                          : const Color(0xFF0F172A),
                      foregroundColor:
                          Theme.of(context).brightness == Brightness.dark
                          ? Colors.black
                          : Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      textStyle: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: handleRate,
                    icon: const Icon(
                      Icons.star,
                      color: Color(0xFFEAB308),
                    ), // Yellow
                    label: Text(
                      "Rate Us 5 Stars",
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      textStyle: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                      side: BorderSide(
                        color: Colors.grey.withValues(alpha: 0.3),
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Footer
                  Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _footerLink(
                            context,
                            "Terms",
                            () =>
                                context.push('/legal', extra: {'tab': 'terms'}),
                          ),
                          const SizedBox(width: 24),
                          _footerLink(
                            context,
                            "Privacy",
                            () => context.push(
                              '/legal',
                              extra: {'tab': 'privacy'},
                            ),
                          ),
                          const SizedBox(width: 24),
                          _footerLink(
                            context,
                            "Support",
                            () => context.push('/help'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Version 1.0.2 • Made with ❤️ in California",
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomNavBar(
        currentPath:
            '/about', // Changed from /home to match logic if needed, or keep home
      ),
    );
  }

  Widget _buildStepCard(
    BuildContext context, {
    required IconData icon,
    required Color color,
    required String title,
    required String desc,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  desc,
                  style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _footerLink(BuildContext context, String text, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Text(
        text,
        style: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Colors.grey,
        ),
      ),
    );
  }
}

// HELP SCREEN
class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  String _search = '';

  final List<Map<String, dynamic>> _articles = [
    {
      'id': 'print',
      'title': 'How do I print?',
      'icon': Icons.print,
      'content':
          'To print your coloring page, tap the "Export Book PDF" button in the Preview screen. This creates a high-quality PDF.',
    },
    {
      'id': 'upload',
      'title': 'Can I upload photos?',
      'icon': Icons.add_a_photo,
      'content':
          'Yes! When starting a New Adventure, tap the "Upload a photo" card.',
    },
    {
      'id': 'subscription',
      'title': 'Subscription help',
      'icon': Icons.card_membership,
      'content':
          'You can manage subscriptions in your App Store or Google Play Store settings.',
    },
    {
      'id': 'safety',
      'title': 'Is it safe for kids?',
      'icon': Icons.security,
      'content':
          'DreamColor is built with safety first. We do not store your personal photos permanently.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _articles
        .where(
          (a) => a['title'].toString().toLowerCase().contains(
            _search.toLowerCase(),
          ),
        )
        .toList();

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const SupportTopBar(title: 'Help Center'),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                onChanged: (val) => setState(() => _search = val),
                decoration: InputDecoration(
                  hintText: "Search for answers...",
                  prefixIcon: const Icon(Icons.search),
                  filled: true,
                  fillColor: Theme.of(context).cardColor,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  if (_search.isEmpty) ...[
                    Text(
                      "Quick Actions",
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildActionCard(
                            Icons.play_circle,
                            "Tutorials",
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildActionCard(
                            Icons.support_agent,
                            "Contact Us",
                            Colors.orange,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _buildActionCard(
                      Icons.bug_report,
                      "Report a Bug",
                      Colors.red,
                    ),
                    const SizedBox(height: 24),
                    Text(
                      "Common Questions",
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  ...filtered.map(
                    (item) => Card(
                      elevation: 0,
                      color: Theme.of(context).cardColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ExpansionTile(
                        leading: CircleAvatar(
                          backgroundColor: Theme.of(
                            context,
                          ).colorScheme.primary.withValues(alpha: 0.1),
                          child: Icon(
                            item['icon'],
                            color: Theme.of(context).colorScheme.primary,
                            size: 20,
                          ),
                        ),
                        title: Text(
                          item['title'],
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                            child: Text(
                              item['content'],
                              style: TextStyle(
                                color: Theme.of(
                                  context,
                                ).colorScheme.onSurface.withValues(alpha: 0.6),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomNavBar(currentPath: '/home'),
    );
  }

  Widget _buildActionCard(IconData icon, String title, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(color: color, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

// SUBSCRIPTION SCREEN
class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  bool _isLoading = true;
  List<ProductDetails> _products = [];

  @override
  void initState() {
    super.initState();
    _initStore();
  }

  Future<void> _initStore() async {
    final service = PurchaseService();
    // Re-trigger init to ensure connection
    // Note: service.products might already be populated if previously fetched
    if (service.products.isEmpty) {
      await service.init();
    }

    if (mounted) {
      setState(() {
        _products = service.products;
        _isLoading = false;
      });
    }
  }

  Future<void> _buyProduct(ProductDetails? product) async {
    if (product == null) return;
    setState(() => _isLoading = true);
    try {
      await PurchaseService().buyConsumable(product);
      // Success is handled by stream in AppProvider
      // We can pop or show success via listener, but for now we wait a bit or just let the stream handle it.
      // Ideally we listen to a stream here to know when to stop loading, but simple approach:
      // Just delay enabling UI or rely on AppProvider update.
      // For UX, better to stop loading after initiating buy (system UI takes over)
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Purchase failed: $e")));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final hasProducts = _products.isNotEmpty;

    ProductDetails? partyProduct;
    ProductDetails? singleProduct;

    if (hasProducts) {
      partyProduct = _products.firstWhere(
        (p) => p.id == PurchaseService.productExplorerPack,
        orElse: () => _products.first,
      );
      singleProduct = _products.firstWhere(
        (p) => p.id == PurchaseService.productSingleAdventure,
        orElse: () => _products.last,
      );
    }

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Custom Header
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
                    child: Column(
                      children: [
                        Text(
                          "Get Credits",
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Consumer<AppProvider>(
                          builder: (ctx, app, _) => Text(
                            "Balance: ${app.credits}",
                            style: TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                children: [
                  Text(
                    "Unlock Creativity",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.comicNeue(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Choose the plan that fits your family best",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 32),

                  if (!hasProducts)
                    const Center(
                      child: Text("Connecting to Store... (Check Product IDs)"),
                    ),

                  if (hasProducts) ...[
                    // Party Pack
                    _buildPackageCard(
                      context,
                      title: "Explorer Pack",
                      subtitle: "5 Full Books (30 Credits)",
                      features: [
                        "30 Credits (5 Books + Covers)",
                        "Upload Own Photos",
                        "All Themes Unlocked",
                        "Export High-Quality PDFs",
                      ],
                      price: partyProduct?.price ?? "\$29.99",
                      isPopular: true,
                      mainColor: Theme.of(context).colorScheme.primary,
                      onTap: () => _buyProduct(partyProduct),
                    ),
                    const SizedBox(height: 16),

                    // Single Pack
                    _buildPackageCard(
                      context,
                      title: "Single Adventure",
                      subtitle: "1 Full Book (6 Credits)",
                      features: [
                        "6 Credits (5 Pages + Cover)",
                        "Personalized Cover",
                        "Unlock Photo Upload",
                        "Print-Ready PDF",
                      ],
                      price: singleProduct?.price ?? "\$2.99",
                      isPopular: false,
                      mainColor: Theme.of(context).cardColor,
                      isSecondary: true,
                      onTap: () => _buyProduct(singleProduct),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Free Tier Info (Static)
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor.withValues(alpha: 0.5),
                      border: Border.all(
                        color: Colors.grey.withValues(alpha: 0.2),
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Free Starter",
                          style: GoogleFonts.comicNeue(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          "Try out the magic daily",
                          style: TextStyle(color: Colors.grey),
                        ),
                        const SizedBox(height: 16),
                        _buildFeatureRow("1 Page every 24 Hours", context),
                        _buildFeatureRow("Space Theme Only", context),
                        _buildFeatureRow("Web Preview Only", context),
                        _buildFeatureRow("No Photo Uploads", context),
                        const SizedBox(height: 16),
                        Center(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: Colors.grey.withAlpha(50),
                              ),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text(
                              "Active (When 0 Credits)",
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),
                  TextButton(
                    onPressed: () async {
                      try {
                        await InAppPurchase.instance.restorePurchases();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text("Restoring purchases..."),
                            ),
                          );
                        }
                      } catch (e) {
                        // ignore
                      }
                    },
                    child: const Text("Restore Purchases"),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPackageCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required List<String> features,
    required String price,
    required bool isPopular,
    required Color mainColor,
    required VoidCallback onTap,
    bool isSecondary = false,
  }) {
    final borderColor = isPopular
        ? mainColor
        : Colors.grey.withValues(alpha: 0.2);
    // If dark mode, adjust basic white to card color or similar
    final realBg =
        Theme.of(context).brightness == Brightness.dark && !isSecondary
        ? Colors.grey[800]!
        : (isSecondary ? Theme.of(context).cardColor : Colors.white);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: realBg,
          border: Border.all(color: borderColor, width: isPopular ? 2 : 1),
          borderRadius: BorderRadius.circular(24),
          boxShadow: isPopular
              ? [
                  BoxShadow(
                    color: mainColor.withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isPopular)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: mainColor,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  "MOST POPULAR",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.comicNeue(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: isPopular
                            ? mainColor
                            : Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            ...features.map((f) => _buildFeatureRow(f, context)),
            const SizedBox(height: 24),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: isPopular
                    ? mainColor
                    : Theme.of(context).scaffoldBackgroundColor,
                borderRadius: BorderRadius.circular(30),
                border: isPopular
                    ? null
                    : Border.all(color: Colors.grey.withValues(alpha: 0.2)),
              ),
              alignment: Alignment.center,
              child: Text(
                "Get Credits - $price",
                style: TextStyle(
                  color: isPopular
                      ? Colors.white
                      : Theme.of(context).colorScheme.onSurface,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureRow(String text, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Icon(
            Icons.check_circle,
            size: 16,
            color: Theme.of(context).colorScheme.primary,
          ),
          const SizedBox(width: 8),
          Text(text, style: const TextStyle(fontSize: 14)),
        ],
      ),
    );
  }
}

// LEGAL SCREEN
class LegalScreen extends StatefulWidget {
  final String initialTab;
  const LegalScreen({super.key, this.initialTab = 'privacy'});

  @override
  State<LegalScreen> createState() => _LegalScreenState();
}

class _LegalScreenState extends State<LegalScreen> {
  late String _currentTab;

  @override
  void initState() {
    super.initState();
    _currentTab = widget.initialTab;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const SupportTopBar(title: 'Legal'),

            // Custom Tab Toggle
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark
                    ? Colors.white.withValues(alpha: 0.05)
                    : Colors.grey.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Row(
                children: [
                  Expanded(child: _buildTabButton('Privacy Policy', 'privacy')),
                  Expanded(child: _buildTabButton('Terms of Service', 'terms')),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (_currentTab == 'privacy')
                    _buildPrivacyContent()
                  else
                    _buildTermsContent(),

                  const SizedBox(height: 24),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        Text(
                          "Have Questions?",
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "If you have any questions about our practices, please contact us.",
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                  'Support email: support@dreamcolor.app',
                                ),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(
                              context,
                            ).colorScheme.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: const Text("Email Support"),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomNavBar(
        currentPath: '/legal',
      ), // Matches React path logic if routed
    );
  }

  Widget _buildTabButton(String label, String value) {
    final bool isSelected = _currentTab == value;
    return GestureDetector(
      onTap: () => setState(() => _currentTab = value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 12),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected
              ? Theme.of(context).colorScheme.primary
              : Colors.transparent,
          borderRadius: BorderRadius.circular(40),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ]
              : [],
        ),
        child: Text(
          label,
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w600,
            fontSize: 14,
            color: isSelected
                ? Colors.white
                : Theme.of(
                    context,
                  ).colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }

  Widget _buildPrivacyContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader("Privacy Policy"),
        const Text(
          "Last Updated: Jan 2025",
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        RichText(
          text: TextSpan(
            style: TextStyle(
              fontSize: 16,
              height: 1.5,
              color: Theme.of(context).colorScheme.onSurface,
            ),
            children: [
              const TextSpan(text: "Welcome to "),
              TextSpan(
                text: "DreamColor",
                style: GoogleFonts.comicNeue(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const TextSpan(
                text:
                    "! We are committed to protecting your privacy and ensuring you and your children have a magical and safe experience.",
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        _buildInfoCard(
          "1. Data Collection",
          "We collect minimal data to provide our services:\n\n"
              "• Photos: Images you upload are processed securely in the cloud to generate coloring pages and are strictly deleted immediately after processing. We do NOT store your personal photos.\n"
              "• Generated Content: The coloring pages created are stored on your device and in your private cloud gallery associated with your account.\n"
              "• Device Info: Anonymous usage data and crash reports to help us improve the app.",
        ),
        const SizedBox(height: 16),
        _buildInfoCard(
          "2. Children's Privacy",
          "DreamColor is designed for families. We adhere to COPPA and GDPR-K guidelines. We do not knowingly collect personal information from children under 13 without parental consent. All account creation and billing must be performed by an adult.",
        ),
        const SizedBox(height: 16),
        _buildInfoCard(
          "3. Data Deletion",
          "You have the right to request deletion of all your data. You can do this by deleting your account in Settings or contacting support@dreamcolor.app.",
        ),
      ],
    );
  }

  Widget _buildTermsContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader("Terms of Service"),
        const Text(
          "Last Updated: Jan 2025",
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 12),
        const Text(
          "By using DreamColor, you agree to the following terms. Please read them carefully.",
          style: TextStyle(fontSize: 16, height: 1.5),
        ),
        const SizedBox(height: 24),
        _buildInfoCard(
          "1. Subscription Terms",
          "• Payment: Payment will be charged to your iTunes/Google Play Account at confirmation of purchase.\n"
              "• Auto-Renewal: Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.\n"
              "• Account Charged: Account will be charged for renewal within 24-hours prior to the end of the current period.\n"
              "• Cancellation: Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase.",
        ),
        const SizedBox(height: 16),
        _buildInfoCard(
          "2. Usage Rights",
          "You retain ownership of the original photos you upload. By using the app, you grant DreamColor a temporary license to process these photos to create coloring pages. The generated coloring pages are yours to use for personal, non-commercial purposes.",
        ),
        const SizedBox(height: 16),
        _buildInfoCard(
          "3. Prohibited Content",
          "You agree not to upload content that is illegal, offensive, or violates the rights of others. We reserve the right to ban users who violate this policy.",
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: GoogleFonts.outfit(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: Theme.of(context).colorScheme.onSurface,
      ),
    );
  }

  Widget _buildInfoCard(String title, String content) {
    // Handling bolding for bullet points manually is hard in simple string,
    // so simply bolding title card style
    return Container(
      padding: const EdgeInsets.all(20),
      width: double.infinity,
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 4),
        ],
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.outfit(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Theme.of(
                context,
              ).colorScheme.onSurface.withValues(alpha: 0.7),
            ),
          ),
        ],
      ),
    );
  }
}
