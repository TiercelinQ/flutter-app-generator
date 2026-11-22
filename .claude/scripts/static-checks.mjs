// Role: static integrity checks of verification.md section B by pattern search, instead of model reading.
// Inputs: <root> (root of the generated Flutter app)
// Outputs: stdout = one "[point] file:line: message" line per finding, then a total; "OK" if none.
//   Points: 2 layer imports · 4 TODO · 6/8 framework-mode only: SnackBar/AlertDialog, literal colors outside
//   tokens.dart, BoxShadow, withOpacity, MaterialStateProperty · 7 interpolated SQL · committed .g.dart ·
//   15 versions (pubspec x.y.z, config.dart, changelog) · 16 .gitignore.
//   The design system mode is read from docs/specs/04-architect.md or 01-scoping.md ("designSystem: native|framework").
// Exit codes: 0 no finding, 1 at least one finding, 4 invalid argument.
// Documented exceptions (Colors.transparent, commented ignores) stay to be judged by the model.
// Command replaced: /flutter-p5-development, /flutter-add-feature, /flutter-fix-issue, section B.
// Example: node .claude/scripts/static-checks.mjs C:\projects\MyApp

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";

const root = process.argv[2];
if (!root || !existsSync(root)) {
  console.error("Usage: static-checks.mjs <root>");
  process.exit(4);
}

const findings = [];
const add = (point, file, line, msg) => findings.push(`[${point}] ${file}${line ? ":" + line : ""}: ${msg}`);
const rel = (f) => relative(root, f).split("\\").join("/");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if ([".dart_tool", "build", ".git", "node_modules"].includes(e)) continue;
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

let mode = "framework";
for (const spec of ["04-architect.md", "01-scoping.md"]) {
  const p = join(root, "docs", "specs", spec);
  const m = existsSync(p) ? readFileSync(p, "utf8").match(/designSystem:\s*`?(framework|native)/) : null;
  if (m) {
    mode = m[1];
    break;
  }
}

const dart = walk(join(root, "lib")).concat(walk(join(root, "test"))).filter((f) => f.endsWith(".dart") && !f.endsWith(".g.dart"));
const inLayer = (f, layer) => rel(f).startsWith(`lib/${layer}/`);
const rules = [
  { point: "4", re: /\/\/\s*TODO/, msg: "// TODO is forbidden" },
  { point: "2", re: /import\s+['"][^'"]*\bdata\//, msg: "presentation must not import data", only: (f) => inLayer(f, "presentation") },
  { point: "2", re: /import\s+['"][^'"]*\bpresentation\//, msg: "data/application must not import presentation", only: (f) => inLayer(f, "data") || inLayer(f, "application") },
  { point: "3", re: /import\s+['"]package:flutter\/(material|widgets|cupertino)\.dart/, msg: "UI import in data/application", only: (f) => inLayer(f, "data") || inLayer(f, "application") },
  { point: "7", re: /\b(rawQuery|rawInsert|rawUpdate|rawDelete|execute)\(\s*['"][^'"]*\$/, msg: "interpolated SQL, use ? and whereArgs" },
  { point: "7", re: /\b(where|having):\s*['"][^'"]*\$/, msg: "interpolated SQL in where, use ? and whereArgs" },
];
if (mode === "framework") {
  rules.push(
    { point: "8", re: /\bSnackBar\(|\bAlertDialog\(/, msg: "SnackBar/raw AlertDialog is forbidden in framework mode (custom toasts only)", only: (f) => inLayer(f, "presentation") },
    { point: "6", re: /\bColor\(0x|\bColors\.(?!transparent\b)\w+/, msg: "literal color outside tokens.dart", only: (f) => inLayer(f, "presentation") && !f.endsWith("tokens.dart") },
    { point: "6", re: /\bBoxShadow\(/, msg: "BoxShadow is forbidden (depth by stroke)" },
    { point: "6", re: /\.withOpacity\(|\bMaterialStateProperty\b/, msg: "deprecated API: use withValues(alpha:) / WidgetStateProperty" },
  );
}
for (const f of dart) {
  const lines = readFileSync(f, "utf8").split(/\r?\n/);
  for (const r of rules) {
    if (r.only && !r.only(f)) continue;
    lines.forEach((l, i) => {
      if (r.re.test(l)) add(r.point, rel(f), i + 1, r.msg);
    });
  }
}

// Generated files must not be committed
if (existsSync(join(root, ".git"))) {
  const g = spawnSync("git", ["ls-files", "*.g.dart"], { cwd: root, encoding: "utf8" });
  for (const f of (g.stdout ?? "").split(/\r?\n/).filter(Boolean)) add("10", f, 0, ".g.dart is committed (generated files are never delivered)");
}

// Point 15: the three versions must be equal (x.y.z, no +N)
const ver = {};
try {
  ver["pubspec.yaml"] = readFileSync(join(root, "pubspec.yaml"), "utf8").match(/^version:\s*(\d+\.\d+\.\d+)\+\d+/m)?.[1];
  ver["config.dart appVersion"] = readFileSync(join(root, "lib/core/config.dart"), "utf8").match(/appVersion\s*=\s*["']([^"']+)/)?.[1];
  ver["CHANGELOG top"] = readFileSync(join(root, "docs/release/CHANGELOG.md"), "utf8").match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
} catch {
  add("15", "docs/release/CHANGELOG.md", 0, "version file or changelog is unreadable");
}
if (Object.values(ver).some((v) => v === undefined) || new Set(Object.values(ver)).size > 1)
  add("15", "(versions)", 0, `versions differ or are missing (pubspec needs x.y.z+N): ${JSON.stringify(ver)}`);

// Point 16: .gitignore (the framework block is appended to the one flutter create generated)
const gi = join(root, ".gitignore");
if (!existsSync(gi)) add("16", ".gitignore", 0, "file is missing");
else {
  const set = new Set(readFileSync(gi, "utf8").split(/\r?\n/).map((l) => l.trim()));
  for (const need of ["*.jks", "key.properties", "*.db", "tasks/", ".claude/settings.local.json", ".claude/agent-memory/"])
    if (!set.has(need)) add("16", ".gitignore", 0, `missing entry: ${need}`);
  for (const bad of ["test/", "tool/", ".claude/settings.json", "docs/release/CHANGELOG.md", "CLAUDE.md"])
    if (set.has(bad)) add("16", ".gitignore", 0, `must not ignore: ${bad}`);
}

console.log(findings.length ? `${findings.join("\n")}\n\n${findings.length} finding(s).` : "OK: no finding.");
process.exit(findings.length ? 1 : 0);
