#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateDocsReferences() {
  console.log('🔍 Validating docs.json references...\n');

  // Read docs.json
  const docsJsonPath = path.join(process.cwd(), 'docs.json');

  if (!fs.existsSync(docsJsonPath)) {
    console.error('❌ docs.json not found!');
    process.exit(1);
  }

  const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

  // Extract all page references from docs.json
  const pageReferences = [];

  function extractPages(obj, context = '') {
    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => extractPages(item, `${context}[${idx}]`));
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.pages) {
        obj.pages.forEach((page, idx) => {
          if (typeof page === 'string') {
            pageReferences.push({
              page,
              context: `${context}.pages[${idx}]`
            });
          }
        });
      }
      Object.entries(obj).forEach(([key, value]) => {
        extractPages(value, `${context}.${key}`);
      });
    }
  }

  extractPages(docsJson, 'docs.json');

  console.log(`Found ${pageReferences.length} page references in docs.json\n`);

  // Check if each referenced file exists
  const missingFiles = [];

  for (const { page, context } of pageReferences) {
    const filePath = path.join(process.cwd(), `${page}.mdx`);

    if (!fs.existsSync(filePath)) {
      missingFiles.push({ page: `${page}.mdx`, context });
    }
  }

  if (missingFiles.length > 0) {
    console.error('❌ Missing files referenced in docs.json:');
    missingFiles.forEach(({ page, context }) => {
      console.error(`   - ${page}`);
      console.error(`     Referenced at: ${context}`);
    });
    console.error(`\nTotal: ${missingFiles.length} missing files`);
    process.exit(1);
  } else {
    console.log('✅ All docs.json references are valid!');
    console.log(`   Validated ${pageReferences.length} page references`);
  }

  return true;
}

// Run if called directly
if (require.main === module) {
  validateDocsReferences();
}

module.exports = { validateDocsReferences };
