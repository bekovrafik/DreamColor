import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/app_provider.dart';
import 'router.dart';
import 'services/purchase_service.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  await dotenv.load(fileName: ".env");
  await PurchaseService().init();

  runApp(
    MultiProvider(
      providers: [ChangeNotifierProvider(create: (_) => AppProvider())],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);

    return MaterialApp.router(
      title: 'DreamColor',
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF6F5F8), // background-light
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF460DF2), // primary
          primary: const Color(0xFF460DF2),
          surface: const Color(0xFFFFFFFF), // surface-light
          onSurface: const Color(0xFF1E293B), // slate-900 (approx)
          onSurfaceVariant: const Color(0xFF64748B), // slate-500
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: GoogleFonts.outfit().fontFamily,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF460DF2),
            foregroundColor: Colors.white,
          ),
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF141022), // background-dark
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF460DF2), // primary
          primary: const Color(0xFF460DF2),
          surface: const Color(0xFF1E1A2E), // surface-dark
          onSurface: const Color(0xFFFFFFFF),
          onSurfaceVariant: const Color(0xFF94A3B8), // slate-400
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
        fontFamily: GoogleFonts.outfit().fontFamily,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF460DF2),
            foregroundColor: Colors.white,
          ),
        ),
      ),
      themeMode: appProvider.darkMode ? ThemeMode.dark : ThemeMode.light,
      routerConfig: createRouter(appProvider),
    );
  }
}
