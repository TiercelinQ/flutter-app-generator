# Règles de gestion des erreurs

## Convention de remontée Data → Application → Presentation

- **Data (repositories)** : lèvent des exceptions métier explicites (classes héritant d'`Exception`, définies dans `lib/data/exceptions.dart`).
- **Application (controllers)** : interceptent via `try/catch`, ne propagent jamais d'exception métier vers la presentation. Déclenchent le toast via `toastControllerProvider`. Pour l'état asynchrone : `AsyncValue.guard` réservé aux erreurs inattendues — les erreurs métier sont interceptées avant.
- **Presentation** : affiche les toasts via `ToastOverlay` (piloté par `toastControllerProvider`). Ne gère aucune logique d'erreur. `.when(error: …)` des `AsyncValue` : affichage d'un état d'erreur de zone (message + bouton réessayer), pas de logique.

## Contrat de toast

```dart
// lib/application/toast_controller.dart
enum ToastType { success, info, warning, danger }

class ToastData {
  final ToastType type;
  final String message;
  final String? description;
  const ToastData(this.type, this.message, {this.description});
}

@riverpod
class ToastController extends _$ToastController {
  @override
  List<ToastData> build() => [];
  void show(ToastData toast) { /* file d'attente */ }
  void dismiss(ToastData toast) { /* retrait */ }
}
```

## Exemple complet

```dart
// lib/data/exceptions.dart
class RecordNotFoundException implements Exception {
  final String message;
  const RecordNotFoundException(this.message);
}
class DatabaseException implements Exception {
  final String message;
  const DatabaseException(this.message);
}

// lib/application/record_controller.dart
Future<void> save(Record record) async {
  try {
    await ref.read(recordRepositoryProvider).save(record);
    ref.read(toastControllerProvider.notifier)
       .show(ToastData(ToastType.success, t.recordSaved));
    ref.invalidateSelf();
  } on RecordNotFoundException catch (e) {
    ref.read(toastControllerProvider.notifier)
       .show(ToastData(ToastType.danger, e.message));
  } on DatabaseException catch (e) {
    ref.read(toastControllerProvider.notifier)
       .show(ToastData(ToastType.danger, 'Erreur base de données', description: e.message));
  }
}
```

## Règles

- Zéro `SnackBar`, zéro `AlertDialog` brut, zéro bandeau inline pour les erreurs métier — **toasts uniquement** (types, durées, anatomie : `layout.md §6`).
- Confirmations destructives (suppression…) : `AppDialog` stylé (`layout.md §8`), bouton Valider en variante danger.
- Gestion d'erreurs sur toutes les opérations critiques : SQLite, shared_preferences, parsing JSON/Delta, I/O.
- Erreurs inattendues : `FlutterError.onError` + `PlatformDispatcher.instance.onError` dans `main.dart` → log + toast `danger` persistant générique. L'application ne crashe pas silencieusement.
- Messages d'erreur visibles : passent par i18n si activée.
