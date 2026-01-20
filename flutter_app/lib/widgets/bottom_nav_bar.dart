import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BottomNavBar extends StatelessWidget {
  final String currentPath;
  const BottomNavBar({super.key, required this.currentPath});

  @override
  Widget build(BuildContext context) {
    int selectedIndex = 0;
    if (currentPath.startsWith('/home')) {
      selectedIndex = 0;
    } else if (currentPath.startsWith('/gallery')) {
      selectedIndex = 1;
    } else if (currentPath.startsWith('/presets')) {
      selectedIndex = 2;
    }

    return NavigationBar(
      selectedIndex: selectedIndex,
      onDestinationSelected: (index) {
        if (index == 0) {
          context.go('/home');
        }
        if (index == 1) {
          context.go('/gallery');
        }
        if (index == 2) {
          context.go('/presets');
        }
      },
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home),
          label: 'Home',
        ),
        NavigationDestination(
          icon: Icon(Icons.photo_library_outlined),
          selectedIcon: Icon(Icons.photo_library),
          label: 'Gallery',
        ),
        NavigationDestination(
          icon: Icon(Icons.palette_outlined),
          selectedIcon: Icon(Icons.palette),
          label: 'Presets',
        ),
      ],
    );
  }
}
