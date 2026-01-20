import 'package:go_router/go_router.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/auth/billing_screen.dart';
import 'screens/dashboard/home_screen.dart';
import 'screens/dashboard/gallery_screen.dart';
import 'screens/dashboard/presets_screen.dart';
import 'screens/dashboard/settings_screen.dart';
import 'screens/creation/new_adventure_screen.dart';
import 'screens/creation/chat_screen.dart';
import 'screens/creation/generation_progress_screen.dart';
import 'screens/creation/preview_book_screen.dart';
import 'screens/success/success_screens.dart';
import 'screens/support/support_screens.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (context, state) => const OnboardingScreen()),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    GoRoute(
      path: '/forgot-password',
      builder: (context, state) => const ForgotPasswordScreen(),
    ),
    GoRoute(
      path: '/billing',
      builder: (context, state) => const BillingScreen(),
    ),

    GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
    GoRoute(
      path: '/gallery',
      builder: (context, state) => const GalleryScreen(),
    ),
    GoRoute(
      path: '/presets',
      builder: (context, state) => const PresetsScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),

    GoRoute(
      path: '/new',
      builder: (context, state) => const NewAdventureScreen(),
    ),
    GoRoute(path: '/chat', builder: (context, state) => const ChatScreen()),
    GoRoute(
      path: '/generating',
      builder: (context, state) => const GenerationProgressScreen(),
    ),
    GoRoute(
      path: '/preview',
      builder: (context, state) =>
          PreviewBookScreen(extra: state.extra as Map<String, dynamic>?),
    ),

    GoRoute(
      path: '/saved',
      builder: (context, state) => const BookSavedScreen(),
    ),
    GoRoute(
      path: '/pdf-ready',
      builder: (context, state) => const PdfExportedScreen(),
    ),

    GoRoute(path: '/about', builder: (context, state) => const AboutScreen()),
    GoRoute(path: '/help', builder: (context, state) => const HelpScreen()),
    GoRoute(
      path: '/subscription',
      builder: (context, state) => const SubscriptionScreen(),
    ),
    GoRoute(
      path: '/legal',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        return LegalScreen(initialTab: extra?['tab'] ?? 'privacy');
      },
    ),
  ],
);
