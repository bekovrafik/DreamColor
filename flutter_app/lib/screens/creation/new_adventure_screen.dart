import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:convert';
import 'dart:io';
import '../../providers/app_provider.dart';

class NewAdventureScreen extends StatefulWidget {
  const NewAdventureScreen({super.key});

  @override
  State<NewAdventureScreen> createState() => _NewAdventureScreenState();
}

class _NewAdventureScreenState extends State<NewAdventureScreen> {
  final List<String> _themes = [
    'Space',
    'Jungle',
    'Princess',
    'Dinosaurs',
    'Underwater',
  ];
  bool _showLimitModal = false;
  String _limitWaitTime = '';

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<AppProvider>(context, listen: false);
    // Reset state logic could go here or in provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Safe to reset if needed, but provider might preserve if coming from presets
      if (!provider.isPaidUser && provider.theme.isEmpty) {
        provider.setTheme('Space');
      }
    });
  }

  Future<void> _pickImage() async {
    final provider = Provider.of<AppProvider>(context, listen: false);
    if (!provider.isPaidUser) {
      context.push('/subscription');
      return;
    }

    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      final bytes = await File(image.path).readAsBytes();
      final base64Image = "data:image/png;base64,${base64Encode(bytes)}";
      provider.setUploadedImage(base64Image);
    }
  }

  void _handleStart() {
    final provider = Provider.of<AppProvider>(context, listen: false);

    if (provider.uploadedImage != null) {
      if (!provider.isPaidUser || provider.credits < 6) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "You need at least 6 credits for a custom photo adventure!",
            ),
          ),
        );
        context.push('/subscription');
        return;
      }
    }

    if (provider.credits >= 6) {
      context.push('/chat');
    } else {
      if (provider.credits > 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("You need 6 credits for a full book!")),
        );
        context.push('/subscription');
        return;
      }

      // Free limit check
      final check = provider.checkFreeLimit();
      if (!check['allowed']) {
        setState(() {
          _limitWaitTime = check['waitTimeStr'] ?? 'tomorrow';
          _showLimitModal = true;
        });
        return;
      }
      context.push('/chat');
    }
  }

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);

    return Scaffold(
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 4.0,
                    vertical: 8.0,
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () => context.go('/home'),
                        icon: const Icon(Icons.arrow_back),
                      ),
                      Expanded(
                        child: Text(
                          'New Adventure',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 48), // Balance
                    ],
                  ),
                ),

                // Progress
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24.0,
                    vertical: 8.0,
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'STEP 1 OF 3',
                            style: GoogleFonts.outfit(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Theme.of(
                                context,
                              ).colorScheme.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${appProvider.credits} Credits',
                              style: GoogleFonts.outfit(
                                fontSize: 10,
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: 0.33,
                          minHeight: 8,
                          backgroundColor: Colors.grey[300],
                        ),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(24),
                    children: [
                      Text(
                        "Let's make something",
                        style: GoogleFonts.outfit(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                        ),
                      ),
                      Text(
                        "special",
                        style: GoogleFonts.outfit(
                          fontSize: 32,
                          fontWeight: FontWeight.w800,
                          color: Theme.of(context).colorScheme.primary,
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Child Name
                      Text(
                        "Child's Name",
                        style: GoogleFonts.outfit(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: TextEditingController(
                          text: appProvider.childName,
                        ), // Note: this controller creates issue if typing fast, better to use state controller and update provider on change or check editing
                        onChanged: (val) => appProvider.setChildName(val),
                        decoration: InputDecoration(
                          hintText: "e.g. Leo, Maya...",
                          hintStyle: TextStyle(
                            color:
                                Theme.of(context).brightness == Brightness.dark
                                ? Colors.grey.shade400
                                : Colors.grey.shade600,
                          ),
                          filled: true,
                          fillColor: Theme.of(context).cardColor,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 16,
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Themes
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Pick a magical theme",
                            style: GoogleFonts.outfit(
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          if (!appProvider.isPaidUser)
                            GestureDetector(
                              onTap: () => context.push('/subscription'),
                              child: Text(
                                "Unlock All",
                                style: GoogleFonts.outfit(
                                  color: Theme.of(context).colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _themes.map((t) {
                            final isLocked =
                                !appProvider.isPaidUser && t != 'Space';
                            final isSelected = appProvider.theme == t;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: InputChip(
                                label: Text(t),
                                selected: isSelected,
                                onSelected: isLocked
                                    ? null
                                    : (val) => appProvider.setTheme(t),
                                disabledColor: Colors.grey.withValues(
                                  alpha: 0.1,
                                ),
                                selectedColor: Theme.of(
                                  context,
                                ).colorScheme.primary,
                                labelStyle: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : (isLocked
                                            ? Colors.grey
                                            : Theme.of(
                                                context,
                                              ).colorScheme.onSurface),
                                  fontWeight: FontWeight.bold,
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                deleteIcon: isLocked
                                    ? const Icon(Icons.lock, size: 14)
                                    : null,
                                onDeleted: isLocked ? () {} : null,
                                shape: StadiumBorder(
                                  side: BorderSide(
                                    color: isSelected
                                        ? Colors.transparent
                                        : Colors.grey.withValues(alpha: 0.2),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        enabled: appProvider.isPaidUser,
                        onChanged: (val) => appProvider.setTheme(val),
                        decoration: InputDecoration(
                          hintText: appProvider.isPaidUser
                              ? "Or type your own theme..."
                              : "Custom themes locked (Premium)",
                          filled: true,
                          fillColor: Theme.of(context).cardColor.withValues(
                            alpha: appProvider.isPaidUser ? 1 : 0.6,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 14,
                          ),
                          prefixIcon: const Icon(
                            Icons.edit,
                            size: 20,
                            color: Colors.grey,
                          ),
                          suffixIcon: !appProvider.isPaidUser
                              ? const Icon(
                                  Icons.lock,
                                  size: 20,
                                  color: Colors.grey,
                                )
                              : null,
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Photo Upload
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            appProvider.uploadedImage != null
                                ? "Image Uploaded!"
                                : "Personalize with AI",
                            style: GoogleFonts.outfit(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              "OPTIONAL",
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      GestureDetector(
                        onTap: _pickImage,
                        child: Container(
                          height: 160,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Theme.of(context).cardColor,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: appProvider.uploadedImage != null
                                  ? Theme.of(context).colorScheme.primary
                                  : Colors.grey.withValues(alpha: 0.3),
                              width: 2,
                              style: appProvider.uploadedImage != null
                                  ? BorderStyle.solid
                                  : BorderStyle.none,
                            ), // Dashed border needs custom painter, using none for simplicity or dotted pkg
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              if (appProvider.uploadedImage != null)
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(22),
                                  child: Image.memory(
                                    base64Decode(
                                      appProvider.uploadedImage!.split(',')[1],
                                    ),
                                    width: double.infinity,
                                    height: double.infinity,
                                    fit: BoxFit.cover,
                                    color: Colors.white.withValues(alpha: 0.4),
                                    colorBlendMode: BlendMode.dstATop,
                                  ),
                                ),

                              Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  if (appProvider.uploadedImage != null)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 16,
                                        vertical: 8,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(20),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withValues(
                                              alpha: 0.1,
                                            ),
                                            blurRadius: 4,
                                          ),
                                        ],
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.check_circle,
                                            color: Theme.of(
                                              context,
                                            ).colorScheme.primary,
                                            size: 20,
                                          ),
                                          const SizedBox(width: 8),
                                          const Text(
                                            "Change Photo",
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    )
                                  else ...[
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Theme.of(context)
                                            .colorScheme
                                            .primary
                                            .withValues(alpha: 0.1),
                                        shape: BoxShape.circle,
                                      ),
                                      child: Icon(
                                        Icons.add_a_photo,
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.primary,
                                        size: 28,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    const Text(
                                      "Upload a photo",
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      !appProvider.isPaidUser
                                          ? "Unlock to turn photos into coloring pages!"
                                          : "We'll turn it into a coloring page!",
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                              if (!appProvider.isPaidUser &&
                                  appProvider.uploadedImage == null)
                                const Positioned(
                                  top: 12,
                                  right: 12,
                                  child: Icon(Icons.lock, color: Colors.grey),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Bottom Button
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                  child: SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed:
                          (appProvider.childName.isNotEmpty &&
                              appProvider.theme.isNotEmpty)
                          ? _handleStart
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 4,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            appProvider.uploadedImage != null
                                ? "Plan with Photo"
                                : "Create Magic",
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            appProvider.uploadedImage != null
                                ? Icons.chat_bubble
                                : Icons.auto_awesome,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          if (_showLimitModal)
            Container(
              color: Colors.black54,
              child: Center(
                child: Container(
                  margin: const EdgeInsets.all(24),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Theme.of(context).scaffoldBackgroundColor,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.timelapse, size: 48, color: Colors.blue),
                      const SizedBox(height: 16),
                      Text(
                        "Pencils need a rest! ✏️",
                        style: GoogleFonts.outfit(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Your daily magic spark is used! I have to rest for $_limitWaitTime, or you can unlock 6 credits right now.",
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.grey),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () => context.push('/subscription'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(
                            context,
                          ).colorScheme.primary,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                        ),
                        child: const Text("Unlock 6 Credits - \$2.99"),
                      ),
                      TextButton(
                        onPressed: () =>
                            setState(() => _showLimitModal = false),
                        child: const Text(
                          "I'll wait",
                          style: TextStyle(color: Colors.grey),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
