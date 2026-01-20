import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import '../../providers/app_provider.dart';

class PreviewBookScreen extends StatefulWidget {
  final Map<String, dynamic>? extra; // expect 'showRefill' logic
  const PreviewBookScreen({super.key, this.extra});

  @override
  State<PreviewBookScreen> createState() => _PreviewBookScreenState();
}

class _PreviewBookScreenState extends State<PreviewBookScreen> {
  late List<String> _images;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<AppProvider>(context, listen: false);
    _images = List.from(provider.generatedImages);

    // Check refill logic from extra
    // if (widget.extra?['showRefill'] == true) ... show dialog or snackbar
  }

  Future<void> _remixPage(int index) async {
    final provider = Provider.of<AppProvider>(context, listen: false);
    if (!provider.canRemix) {
      context.push('/billing');
      return;
    }

    if (provider.credits < 1) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Not enough credits for a Remix!")),
      );
      context.push('/billing');
      return;
    }

    setState(() => _isSaving = true); // Using as general loading

    try {
      // Atomic Credit Deduction
      final userRef = FirebaseFirestore.instance
          .collection('users')
          .doc(provider.user!.uid);
      final success = await FirebaseFirestore.instance.runTransaction((
        transaction,
      ) async {
        final snapshot = await transaction.get(userRef);
        if (!snapshot.exists) return false;

        final currentCredits = snapshot.data()?['credits'] ?? 0;
        if (currentCredits < 1) return false;

        transaction.update(userRef, {'credits': currentCredits - 1});
        return true;
      });

      if (!success) {
        throw Exception("Insufficient credits for a Remix.");
      }

      // Mock Remix Generation (In real app, this would trigger a Cloud Function or API)
      await Future.delayed(const Duration(seconds: 3));

      // Update the image list
      setState(() {
        _images[index] =
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCHY9zyoGojgs8BmYDronLjg-Dwr_ggGeee2vKsKBPJATY4Ya9btXBl6UYXvWNRE1tk6Vbyzqtt3BMS0U8CwtuxWQ35JO9nYhpZlwbRjJo4EMpq94I37Z_PAyS56It6wXJJm6Elba-o1SyDDy9i1fTteJWD16d4a0o1YfnCsRCw8oDaR1taeWKhwD5QERa0OR8_gQhhKMZLdH3eUiZ28IgkebOjZc6z0CfLnTh2fOEoaSAYx25NFa_JJo8simEeqwTcIKwtlUcEkg0";
      });

      provider.setGeneratedImages(_images);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Magic Remix complete! ✨")),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("Remix failed: $e")));
      }
    } finally {
      setState(() => _isSaving = false);
    }
  }

  Future<void> _saveBook() async {
    setState(() => _isSaving = true);
    final provider = Provider.of<AppProvider>(context, listen: false);

    // Mock saving Logic - provider handles it
    // We assume images are valid URLs or Base64 (from mock in progress screen)
    // The simple 'saveBook' just adds to local list.

    // We need to construct a SavedBook. But provider.saveBook takes title/pages/theme.
    // We prompt for a title maybe? Or just auto-generate.

    // Let's prompt for title
    final titleController = TextEditingController(
      text: "${provider.childName}'s ${provider.theme} Adventure",
    );

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text("Name your book"),
        content: TextField(
          controller: titleController,
          decoration: const InputDecoration(hintText: "Enter title"),
        ),
        actions: [
          TextButton(
            onPressed: () {
              titleController.text = "Untitled Adventure";
              Navigator.pop(ctx);
            },
            child: const Text("Skip"),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Save"),
          ),
        ],
      ),
    );

    final title = titleController.text;

    // Convert first image to valid cover URL/Path (in Mock, it's URL, in real might be base64)
    // The provider saveBook accepts imageUrl and pages.
    provider.saveBook(
      title: title,
      imageUrl: _images.isNotEmpty ? _images.first : '',
      pages: _images,
      theme: provider.theme,
    );

    setState(() => _isSaving = false);
    if (!mounted) return;
    context.go('/saved'); // Route to Success Screen
  }

  Future<void> _exportPdf() async {
    final provider = Provider.of<AppProvider>(context, listen: false);
    if (!provider.canExportPdf) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Upgrade to remove watermark and export!"),
        ),
      );
      return;
    }

    final pdf = pw.Document();
    // ...

    for (var imgUrl in _images) {
      Uint8List? imageBytes;
      if (imgUrl.startsWith('http')) {
        final resp = await http.get(Uri.parse(imgUrl));
        if (resp.statusCode == 200) imageBytes = resp.bodyBytes;
      } else if (imgUrl.startsWith('data:image')) {
        // base64
        final base64Str = imgUrl.split(',').last;
        imageBytes = base64Decode(base64Str);
      }

      if (imageBytes != null) {
        final image = pw.MemoryImage(imageBytes);
        pdf.addPage(
          pw.Page(
            pageFormat: PdfPageFormat.a4,
            build: (pw.Context context) {
              return pw.Center(child: pw.Image(image));
            },
          ),
        );
      }
    }

    try {
      await Printing.layoutPdf(
        onLayout: (PdfPageFormat format) async => pdf.save(),
      );
      if (!mounted) return;
      context.go('/pdf-ready');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error exporting PDF: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 4.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => context.go('/home'),
                    icon: const Icon(Icons.close),
                  ), // Or back to new/chat? Usually close to home if done.
                  Expanded(
                    child: Text(
                      'Preview Book',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      final provider = Provider.of<AppProvider>(
                        context,
                        listen: false,
                      );
                      if (provider.canExportPdf) {
                        _exportPdf();
                      } else {
                        showDialog(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text("Premium Feature"),
                            content: const Text(
                              "PDF Export is available for Paid Users. Unlock now to print your creations!",
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx),
                                child: const Text("Later"),
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  Navigator.pop(ctx);
                                  context.push('/billing');
                                },
                                child: const Text("Unlock"),
                              ),
                            ],
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.picture_as_pdf, color: Colors.blue),
                    label: const Text(
                      "Export",
                      style: TextStyle(
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
              ),
            ),

            Expanded(
              child: PageView.builder(
                itemCount: _images.length,
                controller: PageController(viewportFraction: 0.85),
                itemBuilder: (context, index) {
                  final img = _images[index];
                  final provider = Provider.of<AppProvider>(context);
                  return Column(
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 16,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Stack(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: img.startsWith('http')
                                    ? Image.network(img, fit: BoxFit.contain)
                                    : Image.memory(
                                        base64Decode(img.split(',').last),
                                        fit: BoxFit.contain,
                                      ), // Handle base64
                              ),
                              if (!provider.isPaidUser)
                                Center(
                                  child: Opacity(
                                    opacity: 0.3,
                                    child: Transform.rotate(
                                      angle: -0.5,
                                      child: Text(
                                        'DREAMCOLOR PREVIEW',
                                        style: GoogleFonts.outfit(
                                          fontSize: 32,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                      if (provider.isPaidUser)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: TextButton.icon(
                            onPressed: _isSaving
                                ? null
                                : () => _remixPage(index),
                            icon: const Icon(Icons.refresh, size: 20),
                            label: const Text("Remix this page (1 Credit)"),
                            style: TextButton.styleFrom(
                              foregroundColor: Theme.of(
                                context,
                              ).colorScheme.primary,
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(24.0),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _isSaving ? null : _saveBook,
                  icon: const Icon(Icons.bookmark),
                  label: Text(_isSaving ? "Saving..." : "Save to Gallery"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
