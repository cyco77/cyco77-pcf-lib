import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const rootPackagePath = path.join(rootDir, "package.json");
const solutionXmlPath = path.join(rootDir, "Solution", "src", "Other", "Solution.xml");
const componentsDir = path.join(rootDir, "components");

const mode = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!mode || !["patch", "minor", "major"].includes(mode)) {
  throw new Error("Usage: node ./scripts/bump-version.mjs <patch|minor|major> [--dry-run]");
}

const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));
const nextVersion = bumpVersion(rootPackage.version, mode);

updatePackageJson(rootPackagePath, nextVersion, dryRun);
updateSolutionXml(solutionXmlPath, nextVersion, dryRun);

if (fs.existsSync(componentsDir)) {
  for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const componentRoot = path.join(componentsDir, entry.name);
    const componentPackagePath = path.join(componentRoot, "package.json");
    const manifestPath = path.join(componentRoot, entry.name, "ControlManifest.Input.xml");

    if (fs.existsSync(componentPackagePath)) {
      updatePackageJson(componentPackagePath, nextVersion, dryRun);
    }

    if (fs.existsSync(manifestPath)) {
      updateManifestXml(manifestPath, nextVersion, dryRun);
    }
  }
}

process.stdout.write(`${dryRun ? "Would bump" : "Bumped"} version to ${nextVersion}\n`);

function bumpVersion(version, releaseType) {
  const parts = version.split(".").map((part) => Number.parseInt(part, 10));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part) || part < 0)) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  const [major, minor, patch] = parts;

  if (releaseType === "major") {
    return `${major + 1}.0.0`;
  }

  if (releaseType === "minor") {
    return `${major}.${minor + 1}.0`;
  }

  return `${major}.${minor}.${patch + 1}`;
}

function updatePackageJson(filePath, version, isDryRun) {
  const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
  packageJson.version = version;

  if (!isDryRun) {
    fs.writeFileSync(filePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }
}

function updateSolutionXml(filePath, version, isDryRun) {
  replaceVersionInFile(filePath, /<Version>[\s\S]*?<\/Version>/, `<Version>${version}</Version>`, isDryRun);
}

function updateManifestXml(filePath, version, isDryRun) {
  replaceVersionInFile(filePath, /(<control[^>]*\sversion=")([^"]+)(")/, `$1${version}$3`, isDryRun);
}

function replaceVersionInFile(filePath, pattern, replacement, isDryRun) {
  const content = fs.readFileSync(filePath, "utf8");
  const updatedContent = content.replace(pattern, replacement);

  if (content === updatedContent) {
    throw new Error(`Version pattern not found in ${filePath}`);
  }

  if (!isDryRun) {
    fs.writeFileSync(filePath, updatedContent);
  }
}
