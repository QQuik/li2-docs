#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

// Mapping of old paths to new paths in vi/ structure
const migrationMap = {
  // Getting Started
  'creating-account.mdx': 'vi/getting-started/account-setup.mdx',
  'account-setup.mdx': 'vi/getting-started/account-setup-detailed.mdx',
  'features-overview.mdx': 'vi/getting-started/overview.mdx',

  // Core Features - Touch-Points (Short Links)
  'short-link/overview.mdx': 'vi/core-features/touchpoints/short-links.mdx',
  'short-link/create-shortlink.mdx': 'vi/core-features/touchpoints/creating-links.mdx',
  'short-link/custom-back-half.mdx': 'vi/core-features/touchpoints/custom-back-half.mdx',
  'short-link/custom-domains.mdx': 'vi/core-features/touchpoints/custom-domains.mdx',
  'short-link/delete-disable-links.mdx': 'vi/core-features/touchpoints/delete-disable.mdx',
  'short-link/destination-url.mdx': 'vi/core-features/touchpoints/destination-url.mdx',

  // Core Features - Touch-Points (QR Codes)
  'qr-codes/generating-qr-codes.mdx': 'vi/core-features/touchpoints/qr-codes.mdx',
  'qr-codes/customizing-qr-codes.mdx': 'vi/core-features/touchpoints/qr-customization.mdx',
  'qr-codes/downloading-qr-codes.mdx': 'vi/core-features/touchpoints/qr-download.mdx',
  'qr-codes/redirect-qr-codes.mdx': 'vi/core-features/touchpoints/qr-redirect.mdx',

  // Core Features - Touch-Points (General & Advanced)
  'touchpoints/managing-touchpoints.mdx': 'vi/core-features/touchpoints/managing.mdx',
  'advanced/nfc-tags.mdx': 'vi/core-features/touchpoints/nfc-tags.mdx',
  'advanced/wifi-sharing.mdx': 'vi/core-features/touchpoints/wifi-sharing.mdx',

  // Core Features - Tags
  'organization/tags.mdx': 'vi/core-features/tags/overview.mdx',
  'organization/create-tag.mdx': 'vi/core-features/tags/creating.mdx',

  // Analytics
  'analytics/overview.mdx': 'vi/analytics/overview.mdx',
  'analytics/channel-specific-analytics.mdx': 'vi/analytics/channel-analytics.mdx',
  'analytics/reports.mdx': 'vi/analytics/reports.mdx',
  'analytics/utm-parameters.mdx': 'vi/analytics/utm-parameters.mdx',
  'analytics/an.mdx': 'vi/analytics/dashboard.mdx',

  // Settings
  'settings/profile.mdx': 'vi/settings/profile.mdx',

  // Social Media (future phase but migrate anyway)
  'social-media/overview.mdx': 'vi/social-media/overview.mdx',
  'social-media/meta-tags.mdx': 'vi/social-media/meta-tags.mdx',

  // Integrations (future phase)
  'integrations/overview.mdx': 'vi/integrations/overview.mdx',
  'integrations/parcelvoy.mdx': 'vi/integrations/parcelvoy.mdx',
  'integrations/mautic.mdx': 'vi/integrations/mautic.mdx',
  'integrations/hubspot.mdx': 'vi/integrations/hubspot.mdx',
  'integrations/journey-entrance-setup.mdx': 'vi/integrations/journey-entrance.mdx',

  // Advanced Features (future phase)
  'advanced/bulk-operations.mdx': 'vi/advanced/bulk-operations.mdx',
  'advanced/webhooks.mdx': 'vi/advanced/webhooks.mdx',

  // AI Features (future phase)
  'ai/overview.mdx': 'vi/ai/overview.mdx',
  'ai/automated-campaigns.mdx': 'vi/ai/automated-campaigns.mdx',
  'ai/link-optimization.mdx': 'vi/ai/link-optimization.mdx',
  'ai/smart-suggestions.mdx': 'vi/ai/smart-suggestions.mdx',

  // AI Tools (future phase)
  'ai-tools/claude-code.mdx': 'vi/ai-tools/claude-code.mdx',
  'ai-tools/cursor.mdx': 'vi/ai-tools/cursor.mdx',
  'ai-tools/windsurf.mdx': 'vi/ai-tools/windsurf.mdx',

  // API Documentation (skip per plan, but keep for reference)
  'api/introduction.mdx': 'vi/api/introduction.mdx',
  'api/authentication.mdx': 'vi/api/authentication.mdx',
  'api/analytics.mdx': 'vi/api/analytics.mdx',
  'api/touchpoints.mdx': 'vi/api/touchpoints.mdx',
  'api/webhooks.mdx': 'vi/api/webhooks.mdx',

  // API Reference (placeholder content, skip)
  // 'api-reference/**' will be skipped

  // Development docs (not for users)
  // 'development.mdx' will be skipped

  // Essentials (Mintlify docs, skip)
  // 'essentials/**' will be skipped

  // Snippets (Mintlify feature demo, skip)
  // 'snippets/**' will be skipped
};

async function migrate() {
  console.log('🚀 Starting content migration...\n');

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const [oldPath, newPath] of Object.entries(migrationMap)) {
    const oldFullPath = path.join(process.cwd(), oldPath);
    const newFullPath = path.join(process.cwd(), newPath);

    // Check if source file exists
    if (!fs.existsSync(oldFullPath)) {
      console.warn(`⚠️  Source file not found: ${oldPath}`);
      skippedCount++;
      continue;
    }

    try {
      // Read content
      const content = fs.readFileSync(oldFullPath, 'utf8');
      const { data: frontmatter, content: body } = matter(content);

      // Update image paths in content
      let updatedBody = body;

      // Update image paths: /images/ → /shared/images/screenshots/vi/
      updatedBody = updatedBody.replace(
        /\/images\//g,
        '/shared/images/screenshots/vi/'
      );

      // Update internal links to new structure
      // This is a basic implementation - may need refinement
      updatedBody = updatedBody.replace(
        /\(\/([\w-]+)\)/g,
        (match, p1) => {
          // Try to find mapping for this link
          const linkedFile = `${p1}.mdx`;
          if (migrationMap[linkedFile]) {
            const newLink = migrationMap[linkedFile].replace('vi/', '/').replace('.mdx', '');
            return `(${newLink})`;
          }
          return match;
        }
      );

      // Update href attributes in MDX components
      updatedBody = updatedBody.replace(
        /href=["']\/([^"']+)["']/g,
        (match, p1) => {
          // Try to find mapping for this link
          const linkedFile = `${p1}.mdx`;
          if (migrationMap[linkedFile]) {
            const newLink = migrationMap[linkedFile].replace('vi/', '/').replace('.mdx', '');
            return `href="${newLink}"`;
          }
          return match;
        }
      );

      // Reconstruct file with updated content
      const newContent = matter.stringify(updatedBody, frontmatter);

      // Ensure directory exists
      fs.ensureDirSync(path.dirname(newFullPath));

      // Write new file
      fs.writeFileSync(newFullPath, newContent);

      console.log(`✓ Migrated: ${oldPath} → ${newPath}`);
      successCount++;

    } catch (error) {
      console.error(`✗ Error migrating ${oldPath}:`, error.message);
      errorCount++;
    }
  }

  // Create additional required directories for future content
  const additionalDirs = [
    'vi/settings',
    'vi/social-media',
    'vi/integrations',
    'vi/advanced',
    'vi/ai',
    'vi/ai-tools',
    'vi/api'
  ];

  for (const dir of additionalDirs) {
    fs.ensureDirSync(path.join(process.cwd(), dir));
  }

  console.log('\n=== Migration Summary ===');
  console.log(`✓ Successfully migrated: ${successCount} files`);
  console.log(`✗ Errors: ${errorCount} files`);
  console.log(`⚠️  Skipped: ${skippedCount} files`);
  console.log('\n✨ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run validate:i18n');
  console.log('2. Update docs.json with new navigation');
  console.log('3. Start creating English content');
}

// Run migration if called directly
if (require.main === module) {
  migrate().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { migrate, migrationMap };
