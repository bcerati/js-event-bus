const fs = require('fs');
const path = require('path');

/**
 * Read package.json and return its content.
 *
 * @returns {Object} - Parsed JSON content of package.json.
 */
const readPackageJson = () => {
    const filePath = path.join(process.cwd(), 'package.json');
    const rawContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawContent);
};

/**
 * Write content to package.json.
 *
 * @param {Object} content - The updated package.json content.
 */
const writePackageJson = (content) => {
    const filePath = path.join(process.cwd(), 'package.json');
    const updatedContent = JSON.stringify(content, null, 2);
    fs.writeFileSync(filePath, updatedContent);
};

/**
 * Bump the version based on the flag passed.
 *
 * @param {string} currentVersion - Current version from package.json.
 * @param {string} flag - The flag that determines which part of the version to bump (major, minor, patch).
 * @returns {string} - New bumped version.
 */
const bumpVersion = (currentVersion, flag) => {
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    switch (flag) {
        case '--major':
            return `${major + 1}.0.0`;
        case '--minor':
            return `${major}.${minor + 1}.0`;
        default:
            return `${major}.${minor}.${patch + 1}`;
    }
};

// Parse command-line arguments
const flag = process.argv[2];

// Read package.json and get current version
const packageJson = readPackageJson();
const { version: currentVersion } = packageJson;

// Bump the version
const newVersion = bumpVersion(currentVersion, flag);

// Update package.json with the new version
packageJson.version = newVersion;
writePackageJson(packageJson);

// Log output
console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
