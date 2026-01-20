import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../providers/app_provider.dart';

class GenerationProgressScreen extends StatefulWidget {
  final Map<String, dynamic>? extra; // Expect { 'draftId': String }
  const GenerationProgressScreen({super.key, this.extra});

  @override
  State<GenerationProgressScreen> createState() =>
      _GenerationProgressScreenState();
}

class _GenerationProgressScreenState extends State<GenerationProgressScreen> {
  double _progress = 0.0;
  String? _error;
  String _statusText = "Preparing your brushes...";
  StreamSubscription<DocumentSnapshot>? _draftSubscription;
  String? _draftId;

  @override
  void initState() {
    super.initState();
    _draftId = widget.extra?['draftId'];
    if (_draftId != null) {
      _subscribeToDraft();
    } else {
      setState(() {
        _error = "No generation draft found.";
      });
    }
  }

  void _subscribeToDraft() {
    final provider = Provider.of<AppProvider>(context, listen: false);
    final user = provider.user;
    if (user == null) return;

    _draftSubscription = FirebaseFirestore.instance
        .collection('users')
        .doc(user.uid)
        .collection('drafts')
        .doc(_draftId)
        .snapshots()
        .listen(
          (snapshot) {
            if (!mounted) return;
            if (!snapshot.exists) {
              setState(() => _error = "Draft lost in the magic cloud.");
              return;
            }

            final data = snapshot.data() as Map<String, dynamic>;
            final status = data['status'] ?? 'pending';
            final List<dynamic> pages = data['pages'] ?? [];
            final List<dynamic> scenes = data['scenes'] ?? [];
            final sceneCount = scenes.isNotEmpty ? scenes.length : 6;

            setState(() {
              _progress = pages.length / sceneCount;
              _statusText = _getStatusText(status, pages.length, sceneCount);
            });

            if (status == 'completed' || pages.length == sceneCount) {
              _finishGeneration(pages.cast<String>());
            } else if (status == 'failed') {
              setState(
                () => _error =
                    "Magic generation failed. Credits have been refunded.",
              );
            }
          },
          onError: (e) {
            setState(() => _error = "Stream error: $e");
          },
        );
  }

  String _getStatusText(String status, int count, int total) {
    if (status == 'pending') return "Preparing your brushes...";
    if (status == 'processing' || count < total) {
      return "Painting page ${count + 1} of $total...";
    }
    return "Finishing touches...";
  }

  void _finishGeneration(List<String> images) {
    final provider = Provider.of<AppProvider>(context, listen: false);
    provider.setGeneratedImages(images);
    _draftSubscription?.cancel();

    if (mounted) {
      context.go('/preview', extra: {'showRefill': provider.credits == 0});
    }
  }

  @override
  void dispose() {
    _draftSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (_error != null)
                Column(
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 48,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _error!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.red),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => context.go('/home'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text("Go Home"),
                    ),
                  ],
                )
              else ...[
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 120,
                      height: 120,
                      child: CircularProgressIndicator(
                        value: _progress,
                        strokeWidth: 8,
                        backgroundColor:
                            Theme.of(context).brightness == Brightness.dark
                            ? Colors.grey[800]
                            : Colors.grey[200],
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.auto_awesome,
                      size: 48,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                Text(
                  "Creating Magic",
                  style: GoogleFonts.outfit(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _statusText,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Theme.of(
                      context,
                    ).colorScheme.onSurface.withValues(alpha: 0.6),
                    fontSize: 16,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
