#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findOrphanedFiles() {
  console.log('🔍 Searching for orphaned files...\n');

  // Read docs.json
  const docsJsonPath = path.join(process.cwd(), 'docs.json');

  if (!fs.existsSync(docsJsonPath)) {
    console.error('❌ docs.json not found!');
    process.exit(1);
  }

  const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

  // Extract all page references from docs.json
  const referencedPages = new Set();

  function extractPages(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(extractPages);
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.pages) {
        obj.pages.forEach(page => {
          if (typeof page === 'string') {
            referencedPages.add(`${page}.mdx`);
          }
        });
      }
      Object.values(obj).forEach(extractPages);
    }
  }

  extractPages(docsJson);

  // Find all .mdx files in en/ and vi/
  const enFiles = glob.sync('en/**/*.mdx', { cwd: process.cwd() });
  const viFiles = glob.sync('vi/**/*.mdx', { cwd: process.cwd() });
  const allFiles = [...enFiles, ...viFiles];

  // Find orphaned files
  const orphanedFiles = allFiles.filter(file => !referencedPages.has(file));

  if (orphanedFiles.length > 0) {
    console.warn('⚠️  Found orphaned files (not referenced in docs.json):');
    orphanedFiles.forEach(file => console.warn(`   - ${file}`));
    console.warn(`\nTotal: ${orphanedFiles.length} orphaned files`);
    console.warn('\nNote: These files exist but are not in docs.json navigation.');
    console.warn('This may be intentional (drafts, templates) or an oversight.');
  } else {
    console.log('✅ No orphaned files found!');
    console.log(`   All ${allFiles.length} files are referenced in docs.json`);
  }

  return orphanedFiles;
}

// Run if called directly
if (require.main === module) {
  findOrphanedFiles();
}

module.exports = { findOrphanedFiles };
