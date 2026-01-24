#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function validateParity() {
  console.log('🔍 Validating i18n parity...\n');

  const enFiles = glob.sync('en/**/*.mdx', { cwd: process.cwd() })
    .map(f => f.replace('en/', ''));

  const viFiles = glob.sync('vi/**/*.mdx', { cwd: process.cwd() })
    .map(f => f.replace('vi/', ''));

  const missingVi = enFiles.filter(f => !viFiles.includes(f));
  const missingEn = viFiles.filter(f => !enFiles.includes(f));

  let hasErrors = false;

  if (missingVi.length > 0) {
    console.error('❌ Missing Vietnamese translations:');
    missingVi.forEach(f => console.error(`   - vi/${f}`));
    console.error();
    hasErrors = true;
  }

  if (missingEn.length > 0) {
    console.error('❌ Missing English translations:');
    missingEn.forEach(f => console.error(`   - en/${f}`));
    console.error();
    hasErrors = true;
  }

  if (!hasErrors) {
    console.log('✅ i18n parity check passed!');
    console.log(`   English files: ${enFiles.length}`);
    console.log(`   Vietnamese files: ${viFiles.length}`);
    return true;
  } else {
    console.error('❌ i18n parity check failed!');
    console.error(`   English files: ${enFiles.length}`);
    console.error(`   Vietnamese files: ${viFiles.length}`);
    console.error(`   Missing Vietnamese: ${missingVi.length}`);
    console.error(`   Missing English: ${missingEn.length}`);
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validateParity();
}

module.exports = { validateParity };
