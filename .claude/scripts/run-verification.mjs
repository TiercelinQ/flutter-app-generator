// Role: run the executable verification ladder (verification.md section A) and summarize the result.
// Inputs: <root> [--release | --appbundle]
//   Commands: flutter pub get, dart run build_runner build --delete-conflicting-outputs, flutter analyze,
//   dart run custom_lint, flutter test (only if test/ contains *_test.dart files), then flutter build apk --debug
//   (or --release with --release, flutter build appbundle with --appbundle).
//   Stops at the first failing command.
// Outputs: stdout = command / status / duration table, then the first diagnostic lines of the failure.
// Exit codes: 0 all green, 1 a command failed, 4 invalid argument.
// Command replaced: /flutter-run-tests, step 1 (interpreting a failure stays with the model).
// Example: node .claude/scripts/run-verification.mjs C:\projects\MyApp --release

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const release = args.includes("--release");
const bundle = args.includes("--appbundle");
const root = args.find((a) => !a.startsWith("--"));
if (!root || !existsSync(join(root, "pubspec.yaml")) || (release && bundle)) {
  console.error("Usage: run-verification.mjs <root> [--release | --appbundle] (pubspec.yaml required)");
  process.exit(4);
}

function hasTests(dir) {
  if (!existsSync(dir)) return false;
  return readdirSync(dir).some((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? hasTests(p) : e.endsWith("_test.dart");
  });
}

const steps = [
  { label: "flutter pub get", cmd: "flutter", argv: ["pub", "get"] },
  { label: "build_runner build", cmd: "dart", argv: ["run", "build_runner", "build", "--delete-conflicting-outputs"] },
  { label: "flutter analyze", cmd: "flutter", argv: ["analyze"] },
  { label: "custom_lint", cmd: "dart", argv: ["run", "custom_lint"] },
];
if (hasTests(join(root, "test"))) steps.push({ label: "flutter test", cmd: "flutter", argv: ["test"] });
if (bundle) steps.push({ label: "flutter build appbundle", cmd: "flutter", argv: ["build", "appbundle"] });
else steps.push({ label: `flutter build apk --${release ? "release" : "debug"}`, cmd: "flutter", argv: ["build", "apk", release ? "--release" : "--debug"] });

const rows = [];
let failure = null;
for (const s of steps) {
  if (failure) {
    rows.push([s.label, "not run", "-"]);
    continue;
  }
  const t0 = Date.now();
  const opts = { cwd: root, encoding: "utf8", timeout: 30 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 };
  // Windows: flutter and dart are .bat files, hence the single command line passed to the shell.
  const r =
    process.platform === "win32"
      ? spawnSync([s.cmd, ...s.argv].join(" "), { ...opts, shell: true })
      : spawnSync(s.cmd, s.argv, opts);
  const secs = ((Date.now() - t0) / 1000).toFixed(1) + " s";
  if (r.status === 0) rows.push([s.label, "OK", secs]);
  else {
    rows.push([s.label, `FAILED (code ${r.status ?? r.signal ?? "?"})`, secs]);
    failure = { label: s.label, output: `${r.stdout ?? ""}\n${r.stderr ?? ""}`.trim() };
  }
}

console.log("| Command | Status | Duration |\n|---|---|---|");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
if (failure) {
  const diag = failure.output
    .split(/\r?\n/)
    .filter((l) => /\b(error|warning|info)\b\s*[•-]|error:|Exception|FAILED|Some tests failed/i.test(l))
    .slice(0, 15);
  console.log(`\nFirst diagnostics from "${failure.label}":`);
  console.log((diag.length ? diag : failure.output.split(/\r?\n/).slice(-15)).join("\n"));
  process.exit(1);
}
