# Error handling rules

> **Mode.** The escalation `data → application → presentation` is identical in both design-system modes — only the **UI sink** differs. In `designSystem: framework` (default), `application` triggers a **custom toast** via `toastControllerProvider` (this file). In `designSystem: native`, it surfaces a **`SnackBar`** (success/info/warning) or a **`MaterialBanner`** (persistent danger) via the global `ScaffoldMessengerState` helper (`presentation/messenger.dart`), and destructive confirmations use a native `AlertDialog` — see `rules/native-design.md §6`. Everywhere below, read "toast" as "the mode's feedback surface".

## Data → Application → Presentation escalation convention

- **Data (repositories)**: raise explicit business exceptions (classes extending `Exception`, defined in `lib/data/exceptions.dart`).
- **Application (controllers)**: intercept via `try/catch`, never propagate a business exception to the presentation. Trigger the toast via `toastControllerProvider`. For async state: `AsyncValue.guard` reserved for unexpected errors — business errors are intercepted beforehand.
- **Presentation**: shows toasts via `ToastOverlay` (driven by `toastControllerProvider`). Handles no error logic. `AsyncValue` `.when(error: …)`: shows a zone error state (message + retry button), no logic.

## Toast contract

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
  void show(ToastData toast) { /* queue */ }
  void dismiss(ToastData toast) { /* removal */ }
}
```

## Full example

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
       .show(ToastData(ToastType.danger, t.databaseError, description: e.message));
  }
}
```

> **i18n-consistent.** With i18n enabled, every user-facing toast **message** is a localization key — `t.recordSaved`, `t.databaseError` (`t` = `AppLocalizations.of(context)`, `rules/config.md`); the `description` carries the untranslated technical detail (`e.message`). With i18n **off**, the message reads from the centralized `AppStrings.*` in `core/strings.dart` (`rules/architecture.md`) — never a bare FR literal (`'Erreur base de données'`) in the controller. `e.message` is used as the message only for an exception that already carries a user-ready, localized string.

## Rules

- Zero `SnackBar`, zero raw `AlertDialog`, zero inline banner for business errors — **toasts only** (types, durations, anatomy: `layout.md §6`).
- Destructive confirmations (deletion…): styled `AppDialog` (`layout.md §8`), Confirm button in danger variant.
- Error handling on all critical operations: SQLite, shared_preferences, JSON/Delta parsing, I/O.
- Unexpected errors: `FlutterError.onError` + `PlatformDispatcher.instance.onError` in `main.dart` → log + generic persistent `danger` toast. The app does not crash silently.
- Visible error messages: go through i18n if enabled.

## Anti-patterns — what NOT to do

- **Do not** show a native `ScaffoldMessenger.of(context).showSnackBar(...)`, a raw `AlertDialog`, or an inline error banner. Toast or `AppDialog` only.
- **Do not** let a business exception reach `presentation`. It is caught in `application` and turned into a toast.
- **Do not** swallow an exception silently (`catch (_) {}`) — either handle it into a toast or let `AsyncValue.guard` surface it.
- **Do not** put a `try/catch` that triggers a toast inside a widget. Error-to-toast mapping is an `application` responsibility.
- **Do not** throw a bare `Exception('...')` from a repository — define a named business exception in `exceptions.dart`.
- **Do not** build the user-facing message in `data`. The repository raises a typed exception; the controller decides the toast wording (via i18n).
