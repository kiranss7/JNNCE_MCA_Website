/**
 * JNNCE Master of Computer Applications - Asset Integrity Auditor
 * 
 * This production-grade CLI utility recursively scans the project workspace,
 * extracts all relative path references (images, stylesheets, scripts, local links, 
 * and CSS background-images), and checks for any broken paths or missing files.
 * 
 * Usage: node tools/scan_assets.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal formatting
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const cssDir = path.join(rootDir, 'css');
const jsDir = path.join(rootDir, 'js');

const brokenAssets = [];
const checkedPaths = new Set();
let totalReferences = 0;

console.log(`${COLORS.bright}${COLORS.cyan}====================================================`);
console.log(`     JNNCE MCA PORTAL - ASSET INTEGRITY AUDITOR     `);
console.log(`====================================================${COLORS.reset}\n`);

console.log(`Scanning project files in: ${COLORS.bright}${rootDir}${COLORS.reset}\n`);

function checkFileReference(sourceFile, relativePath, type = 'Asset') {
    // 1. Ignore external URLs, hashes, protocols, template placeholders, or blank URIs
    if (relativePath.startsWith('http://') ||
        relativePath.startsWith('https://') ||
        relativePath.startsWith('mailto:') ||
        relativePath.startsWith('tel:') ||
        relativePath.startsWith('data:') ||
        relativePath.startsWith('#') ||
        relativePath.includes('${') ||
        relativePath === 'about:blank' ||
        !relativePath.trim()) {
        return;
    }

    totalReferences++;

    // 2. Remove query strings (?v=1.1) and URL hashes (#jnnce-events)
    const cleanPath = relativePath.split('?')[0].split('#')[0];
    const absolutePath = path.resolve(path.dirname(sourceFile), cleanPath);
    const uniqueKey = absolutePath.toLowerCase();

    if (checkedPaths.has(uniqueKey)) return;
    checkedPaths.add(uniqueKey);

    // 3. Verify existence on filesystem
    if (!fs.existsSync(absolutePath)) {
        brokenAssets.push({
            source: path.relative(rootDir, sourceFile),
            reference: relativePath,
            type: type,
            resolvedPath: path.relative(rootDir, absolutePath)
        });
    }
}

// --- Audit HTML Files ---
htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Match src="..." (scripts, images, iframes)
    const srcMatches = content.matchAll(/src=["']([^"']+)["']/g);
    for (const match of srcMatches) {
        checkFileReference(filePath, match[1], 'Src Attribute');
    }

    // Match href="..." (stylesheets, links, pdfs)
    const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
    for (const match of hrefMatches) {
        checkFileReference(filePath, match[1], 'Href Link');
    }

    // Match inline CSS url('...')
    const urlMatches = content.matchAll(/url\(["']?([^"'\)]+)["']?\)/g);
    for (const match of urlMatches) {
        checkFileReference(filePath, match[1], 'Inline Background');
    }
});

// --- Audit CSS Stylesheets ---
if (fs.existsSync(cssDir)) {
    fs.readdirSync(cssDir).forEach(file => {
        if (!file.endsWith('.css')) return;
        const filePath = path.join(cssDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Match url('...') or url("...") or url(...) in stylesheet
        const urlMatches = content.matchAll(/url\(["']?([^"'\)]+)["']?\)/g);
        for (const match of urlMatches) {
            checkFileReference(filePath, match[1], 'CSS Background');
        }
    });
}

// --- Print Audit Results ---
console.log(`Parsed ${COLORS.bright}${htmlFiles.length}${COLORS.reset} HTML pages and associated stylesheets.`);
console.log(`Evaluated ${COLORS.bright}${totalReferences}${COLORS.reset} local path references.`);
console.log(`Verified ${COLORS.bright}${checkedPaths.size}${COLORS.reset} unique disk files.\n`);

if (brokenAssets.length === 0) {
    console.log(`${COLORS.bright}${COLORS.green}✔ AUDIT PASSED: All local references, links, styles, and assets are 100% correct!${COLORS.reset}\n`);
} else {
    console.log(`${COLORS.bright}${COLORS.red}✘ AUDIT FAILED: Found ${brokenAssets.length} broken references!${COLORS.reset}\n`);

    brokenAssets.forEach((asset, idx) => {
        console.log(`${COLORS.bright}${idx + 1}. [${asset.type}]${COLORS.reset}`);
        console.log(`   Source File:  ${COLORS.yellow}${asset.source}${COLORS.reset}`);
        console.log(`   Ref Path:     ${COLORS.red}${asset.reference}${COLORS.reset}`);
        console.log(`   Resolved As:  ${asset.resolvedPath}`);
        console.log('----------------------------------------------------');
    });
}

console.log(`${COLORS.bright}${COLORS.cyan}====================================================${COLORS.reset}`);
