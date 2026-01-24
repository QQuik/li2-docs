#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const templates = {
  featureGuide: {
    en: `---
title: "[Feature Name]"
description: "One-sentence description of what this feature does and why users need it"
sidebarTitle: "[Short Title]"
icon: "icon-name"
---

# [Feature Name]

<Info>
**What you'll learn**: Summary of what this page covers
</Info>

## Overview

Brief introduction to the feature (2-3 sentences). What problem does it solve?

## Key Concepts

<CardGroup cols={2}>
  <Card title="Concept 1" icon="icon">
    Brief explanation
  </Card>
  <Card title="Concept 2" icon="icon">
    Brief explanation
  </Card>
</CardGroup>

## How to Use [Feature]

<Steps>
  <Step title="Step 1">
    Detailed instructions with screenshots
  </Step>
  <Step title="Step 2">
    More instructions
  </Step>
</Steps>

## Use Cases

<AccordionGroup>
  <Accordion title="Use Case 1">
    Explanation
  </Accordion>
  <Accordion title="Use Case 2">
    Explanation
  </Accordion>
</AccordionGroup>

## Best Practices

<Tip>Best practice tip</Tip>

## Related Features

<CardGroup cols={2}>
  <Card title="Related Feature" href="/path">
    Description
  </Card>
</CardGroup>
`,
    vi: `---
title: "[Tên Tính Năng]"
description: "Mô tả ngắn gọn về tính năng này"
sidebarTitle: "[Tiêu Đề Ngắn]"
icon: "icon-name"
---

# [Tên Tính Năng]

<Info>
**Bạn sẽ học**: Tóm tắt nội dung trang này
</Info>

## Tổng Quan

Giới thiệu ngắn gọn về tính năng (2-3 câu). Tính năng này giải quyết vấn đề gì?

## Các Khái Niệm Chính

<CardGroup cols={2}>
  <Card title="Khái Niệm 1" icon="icon">
    Giải thích ngắn gọn
  </Card>
  <Card title="Khái Niệm 2" icon="icon">
    Giải thích ngắn gọn
  </Card>
</CardGroup>

## Cách Sử Dụng

<Steps>
  <Step title="Bước 1">
    Hướng dẫn chi tiết với ảnh chụp màn hình
  </Step>
  <Step title="Bước 2">
    Hướng dẫn tiếp theo
  </Step>
</Steps>

## Các Trường Hợp Sử Dụng

<AccordionGroup>
  <Accordion title="Trường Hợp 1">
    Giải thích
  </Accordion>
  <Accordion title="Trường Hợp 2">
    Giải thích
  </Accordion>
</AccordionGroup>

## Lưu Ý Quan Trọng

<Tip>Mẹo hay nhất</Tip>

## Tính Năng Liên Quan

<CardGroup cols={2}>
  <Card title="Tính Năng Liên Quan" href="/path">
    Mô tả
  </Card>
</CardGroup>
`
  },
  quickStart: {
    en: `---
title: "[Tutorial Title]"
description: "One-sentence description"
sidebarTitle: "[Short Title]"
---

# [Tutorial Title]

<Note>
**Time to complete**: ~5 minutes
</Note>

## What You'll Build

Brief description of end result

## Prerequisites

- Requirement 1
- Requirement 2

## Step-by-Step Guide

<Steps>
  <Step title="Step 1: [Action]">
    Detailed instructions with screenshot
    ![Alt text](/shared/images/screenshots/en/filename.png)
  </Step>
  <Step title="Step 2: [Action]">
    More instructions
  </Step>
</Steps>

## Next Steps

<CardGroup cols={2}>
  <Card title="Next Tutorial" href="/path">
    Description
  </Card>
</CardGroup>
`,
    vi: `---
title: "[Tiêu Đề Hướng Dẫn]"
description: "Mô tả ngắn gọn"
sidebarTitle: "[Tiêu Đề Ngắn]"
---

# [Tiêu Đề Hướng Dẫn]

<Note>
**Thời gian hoàn thành**: ~5 phút
</Note>

## Bạn Sẽ Tạo Được Gì

Mô tả ngắn gọn về kết quả cuối cùng

## Yêu Cầu

- Yêu cầu 1
- Yêu cầu 2

## Hướng Dẫn Từng Bước

<Steps>
  <Step title="Bước 1: [Hành Động]">
    Hướng dẫn chi tiết với ảnh chụp màn hình
    ![Chú thích](/shared/images/screenshots/vi/filename.png)
  </Step>
  <Step title="Bước 2: [Hành Động]">
    Hướng dẫn tiếp theo
  </Step>
</Steps>

## Bước Tiếp Theo

<CardGroup cols={2}>
  <Card title="Hướng Dẫn Tiếp Theo" href="/path">
    Mô tả
  </Card>
</CardGroup>
`
  }
};

function createPage(section, name, template = 'featureGuide') {
  const enPath = path.join(process.cwd(), `en/${section}/${name}.mdx`);
  const viPath = path.join(process.cwd(), `vi/${section}/${name}.mdx`);

  // Check if template exists
  if (!templates[template]) {
    console.error(`❌ Template '${template}' not found!`);
    console.log(`Available templates: ${Object.keys(templates).join(', ')}`);
    process.exit(1);
  }

  // Check if files already exist
  if (fs.existsSync(enPath) || fs.existsSync(viPath)) {
    console.error(`❌ Files already exist!`);
    if (fs.existsSync(enPath)) console.error(`   - ${enPath}`);
    if (fs.existsSync(viPath)) console.error(`   - ${viPath}`);
    process.exit(1);
  }

  // Create directories
  fs.ensureDirSync(path.dirname(enPath));
  fs.ensureDirSync(path.dirname(viPath));

  // Write files
  fs.writeFileSync(enPath, templates[template].en);
  fs.writeFileSync(viPath, templates[template].vi);

  console.log('✅ Created bilingual page pair:');
  console.log(`   EN: ${enPath}`);
  console.log(`   VI: ${viPath}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Fill in the content for both languages`);
  console.log(`   2. Add to docs.json:`);
  console.log(`      - en/${section}/${name}`);
  console.log(`      - vi/${section}/${name}`);
  console.log(`   3. Capture screenshots for both languages`);
}

// Parse command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node create-new-page.js <section> <name> [template]');
    console.log('\nExamples:');
    console.log('  node create-new-page.js getting-started dashboard');
    console.log('  node create-new-page.js core-features/touchpoints creating quickStart');
    console.log('\nAvailable templates:');
    Object.keys(templates).forEach(t => console.log(`  - ${t}`));
    process.exit(1);
  }

  const [section, name, template] = args;
  createPage(section, name, template || 'featureGuide');
}

module.exports = { createPage, templates };
