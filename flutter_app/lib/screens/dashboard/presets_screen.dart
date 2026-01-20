import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../providers/app_provider.dart';
import '../../widgets/bottom_nav_bar.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PresetsScreen extends StatelessWidget {
  const PresetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Watch provider
    final appProvider = Provider.of<AppProvider>(context);
    final presets = appProvider.presets;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Text(
                    'My Presets',
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () {
                      final freeCheck = appProvider.checkFreeLimit();
                      if (appProvider.credits > 0 ||
                          freeCheck['allowed'] == true ||
                          appProvider.isPaidUser) {
                        context.push('/new');
                      } else {
                        // Show snackbar explanation
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              "Daily limit reached! Wait ${freeCheck['waitTimeStr']} or upgrade.",
                            ),
                            action: SnackBarAction(
                              label: 'Upgrade',
                              onPressed: () => context.push('/billing'),
                            ),
                          ),
                        );
                        context.push('/billing');
                      }
                    },
                    icon: const Icon(Icons.add),
                    style: IconButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            ),

            if (presets.isEmpty)
              // Loading or Empty State
              Expanded(
                child: Center(
                  child: appProvider.presets.isEmpty
                      ? const CircularProgressIndicator()
                      : const Text("No presets found"),
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: presets.length,
                  itemBuilder: (context, index) {
                    final item = presets[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Theme.of(context).cardColor,
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 30,
                                backgroundColor: Colors.grey.shade200,
                                backgroundImage: item.thumbnailUrl.isNotEmpty
                                    ? CachedNetworkImageProvider(
                                        item.thumbnailUrl,
                                      )
                                    : null,
                                child: item.thumbnailUrl.isEmpty
                                    ? const Icon(Icons.image)
                                    : null,
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.title,
                                      style: GoogleFonts.outfit(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      item.description,
                                      style: GoogleFonts.outfit(
                                        fontSize: 12,
                                        color: Theme.of(context)
                                            .colorScheme
                                            .onSurface
                                            .withValues(alpha: 0.6),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton.icon(
                              onPressed: () {
                                final freeCheck = appProvider.checkFreeLimit();
                                if (appProvider.credits > 0 ||
                                    freeCheck['allowed'] == true ||
                                    appProvider.isPaidUser) {
                                  // Proceed
                                  appProvider.resetAdventure();
                                  appProvider.setTheme(item.theme);
                                  context.push('/new');
                                } else {
                                  // Credit Gate
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text("Insufficient credits!"),
                                    ),
                                  );
                                  context.push('/billing');
                                }
                              },
                              icon: const Icon(Icons.auto_awesome),
                              label: const Text('Start (1 Credit)'),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomNavBar(currentPath: '/presets'),
    );
  }
}
