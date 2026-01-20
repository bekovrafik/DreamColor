import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../providers/app_provider.dart';
import '../../widgets/bottom_nav_bar.dart';

class PresetsScreen extends StatelessWidget {
  const PresetsScreen({super.key});

  final List<Map<String, dynamic>> presets = const [
    {
      "title": "Chloe's Dinosaurs",
      "theme": "Dinosaurs",
      "desc": "Theme: Prehistoric • Style: Cartoon",
      "img":
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCB6i7GmEcPa4EHt6InnI1E5DBtd7txHkDxXCrp-zehcGE06J9XWrxQHTDk5kkJfUsW_g5Xfe7PKP-H--a46EcTvOjSGdID_d-wU6U_rYbzp3S4jXNdg9x92k3c8pGJp32SiVoZkYEoLGOZyAMovUJgZFvsV3EWbbpMwSHEOWYqHH6Lvh-4hn5qljrj0eVlI-RCzzGZ7lG0rjkpe6skbi7U3X54WUpBcwSWpmjRClEDOILnsy1EivGndWqXsjJJyY0pfdL78fYokhs",
      "active": true,
    },
    {
      "title": "Max's Space Adventure",
      "theme": "Space",
      "desc": "Theme: Space • Style: Line Art",
      "img":
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAMlJCU23uVoa0bo3te_1ij-oZhHm9G4DJNoEzuIvg9yispGm8B7sYn5yjvQSWKN0fi0x6qdXDUCguPXNfsAbtYIUHM96i5AKjnpts4qnaisf_H2do4HQgzeQXFrJSFqSVZOCyUmBceR6Lol7S_y29bumFG_bIqEkPFR_g6jXj57AM2vBQY3nysD1fcFWhYqRmUpKohNXjXncu8mP-Geq_Eitc6w9AS30lmLZ8eZOYmqS7NVaA4MdkVbUSLwJs-jNcpxoYZ_ZroG-s",
    },
    {
      "title": "Sophie's Garden",
      "theme": "Nature",
      "desc": "Theme: Nature • Style: Fantasy",
      "img":
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBejSO-mY1mE1HKfo9QvR7D8Ycc30ohEpIZ4gDP4F-TpYCVkpUFK1E1FSFHBC0X2pfHynbV75ViQ-xhBtw0N9ahdjpnlWUC2spEwiK7JPsBwQ8OI-uNP5Yii7Hj9KWAVDt3hHpTA-CKMKA2Ye6y1T0gHL5wpQX3NuDgEFtw8CpB_Dm5g-KcW3CncnUkvSMmHnFYc17lwIfxaJmmbxwGawUgxZtiaDc982s0tjInBpudAfuFZ8PaZO-Koq_IKnpG9yd6E-TRAQAr5UY",
    },
    {
      "title": "Puppy Patrol",
      "theme": "Animals",
      "desc": "Theme: Animals • Style: Simple",
      "img":
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBVBi8b6Dy70TTME04rkw58o24B5avSdETX5oo67kZZncWVDw4ERTZCb1XNmLq0Wt_mssG7d5k72ffcmEd_H1RjZoJgo0DD6jqkNFvnTZFREdKNMLHa4mR47nc1NaDIpZnzwYQSNgYqIG-TPXAUPX9aDQ9pAaYg1jgYXncCUkBLFRSlX6hd7wAP9vq_IJTzXcZq2TYnUgJfWFvFuPM-vLlmxf5s6Nb1HAR51zklIGB_PRpBEokz9LskG2OYYtqovGpjGrD-90srifI",
    },
  ];

  @override
  Widget build(BuildContext context) {
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
                    onPressed: () => context.push('/new'),
                    icon: const Icon(Icons.add),
                    style: IconButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
            ),

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
                              backgroundImage: NetworkImage(item['img']),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['title'],
                                    style: GoogleFonts.outfit(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['desc'],
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
                              // Assuming logic to start new adventure with theme
                              final provider = Provider.of<AppProvider>(
                                context,
                                listen: false,
                              );
                              provider.resetAdventure();
                              provider.setTheme(item['theme']);
                              context.push('/new');
                            },
                            icon: Icon(
                              item['active'] == true
                                  ? Icons.auto_awesome
                                  : Icons.play_arrow,
                            ),
                            label: Text(
                              item['active'] == true ? 'Generate' : 'Start',
                            ),
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
