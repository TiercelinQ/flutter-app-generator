# Automated tests rules — Flutter/Dart

## Activation

Conditional — enabled if Phase 1 tests = `Yes`.

If enabled:
- `test/` folder mandatory in the architectural contract (Phase 4).
- Dedicated extra batch in Phase 5 (Small: 4 batches · Medium/Large: 5 batches).
- Dev dependencies added (`mocktail`; `flutter_test` and `integration_test` ship with the SDK).

If disabled:
- No `test/` folder, no extra batch. Batch count unchanged (Small: 3 · Medium/Large: 4).

---

## Non-negotiable stack

- `flutter_test` (SDK) — unit + widget tests.
- `mocktail` — mocking (no codegen, unlike mockito).
- `ProviderContainer` + provider overrides (Riverpod) for controller/state tests.
- `integration_test` (SDK) — optional, only if explicitly requested.

`flutter test` runs the suite.

---

## What to test, per layer

| Layer                          | Target              | What to test                                                        |
| ------------------------------ | ------------------- | ------------------------------------------------------------------- |
| `lib/core/utils/`              | 100% lines          | all branches of the pure functions                                  |
| `lib/data/models/`             | Serialization       | `fromMap`/`toMap` round-trip, equality, edge cases                  |
| `lib/data/repositories/`       | Business logic      | named exceptions raised; SQLite via in-memory/temp DB               |
| `lib/application/`             | Controllers         | `ProviderContainer` + overrides; state transitions; error → toast   |
| `lib/presentation/`            | Widget smoke        | screen pumps without error; key widgets/finders present             |

---

## Conventions

- File naming: `[name]_test.dart` mirroring `lib/` under `test/`.
- Test names: explicit French behavior — always French, independent of the user's interface language — e.g. `email_invalide_leve_validation_exception`.
- No `expect(true, isTrue)`, no empty test, no unjustified `dynamic`.
- No real network, no production DB — use `sqflite_common_ffi` in-memory or a temp file; mock repositories with `mocktail`.
- No arbitrary `Future.delayed` — use `tester.pump`/`pumpAndSettle` or `fakeAsync`.

---

## Controller test pattern (mandatory)

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

class MockRecordRepository extends Mock implements RecordRepository {}

void main() {
  test('save déclenche un toast danger sur RecordNotFoundException', () async {
    final repo = MockRecordRepository();
    when(() => repo.save(any())).thenThrow(const RecordNotFoundException('absent'));
    final container = ProviderContainer(overrides: [
      recordRepositoryProvider.overrideWithValue(repo),
    ]);
    addTearDown(container.dispose);

    await container.read(recordControllerProvider.notifier).save(testRecord);

    expect(container.read(toastControllerProvider).last.type, ToastType.danger);
  });
}
```

## Controller test pattern — native design system (if `designSystem: native`)

The pattern above assumes the default `framework` mode (`toastControllerProvider`). When `designSystem: native` (Phase 1), there is **no `toastControllerProvider`**: feedback surfaces as a `SnackBar` / `MaterialBanner` through the global `ScaffoldMessengerKey` in `presentation/messenger.dart` (`@rules/native-design.md §6`). A bare `ProviderContainer` cannot observe it (the key has no mounted `ScaffoldMessengerState`), so assert at the **widget level** — mount the messenger key, drive the controller through the mounted scope, then find the surface:

```dart
class MockRecordRepository extends Mock implements RecordRepository {}

testWidgets('save affiche un MaterialBanner danger sur RecordNotFoundException (mode natif)', (tester) async {
  final repo = MockRecordRepository();
  when(() => repo.save(any())).thenThrow(const RecordNotFoundException('absent'));

  await tester.pumpWidget(ProviderScope(
    overrides: [recordRepositoryProvider.overrideWithValue(repo)],
    // messengerKey (GlobalKey<ScaffoldMessengerState>) exported by presentation/messenger.dart —
    // it drives SnackBar/MaterialBanner without a BuildContext (native-design.md §6).
    child: MaterialApp(scaffoldMessengerKey: messengerKey, home: const Scaffold()),
  ));

  final container = ProviderScope.containerOf(tester.element(find.byType(Scaffold)));
  await container.read(recordControllerProvider.notifier).save(testRecord);
  await tester.pump();   // let the messenger present the surface (no arbitrary delay)

  expect(find.byType(MaterialBanner), findsOneWidget);   // danger → MaterialBanner
  // success / info / warning → assert find.byType(SnackBar) instead
});
```

## Widget smoke test pattern (mandatory)

```dart
testWidgets('RecordScreen se rend sans erreur', (tester) async {
  await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: RecordScreen())));
  expect(find.byType(RecordScreen), findsOneWidget);
  expect(find.byKey(const Key('saveButton')), findsOneWidget);
});
```

---

## Anti-patterns — what NOT to do

- **Do not** write `expect(true, isTrue)`, an empty test, or a skipped test left behind.
- **Do not** hit the network or a production DB — in-memory/temp DB + `mocktail`.
- **Do not** use arbitrary `Future.delayed` waits — `pump`/`pumpAndSettle`/`fakeAsync`.
- **Do not** test a controller without overriding its repository provider.
- **Do not** go beyond smoke for screens (pump + key finders).
- **Do not** create a test suite when Phase 1 tests = No (and `/flutter-run-tests` never scaffolds one unasked).

## Integrity verification

Detailed in `@rules/verification.md`. Key points: each source module has a matching `_test.dart` (Phase 4 mapping); `flutter test` exit 0; `mocktail` in `dev_dependencies`.
