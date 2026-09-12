import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

// Load SANITY_AUTH_TOKEN from process.env or .env.local
let token = process.env.SANITY_AUTH_TOKEN;

if (!token && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/SANITY_AUTH_TOKEN\s*=\s*([^\r\n]+)/);
  if (match) {
    token = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

if (!token) {
  console.error('❌ Error: SANITY_AUTH_TOKEN not found!');
  console.error('Please provide your Sanity write token either:');
  console.error('  1. In .env.local as: SANITY_AUTH_TOKEN=sk...');
  console.error('  2. Or run: $env:SANITY_AUTH_TOKEN="sk..."; node scripts/upload-staff-to-sanity.mjs');
  process.exit(1);
}

const client = createClient({
  projectId: '1yighcjz',
  dataset: 'production',
  apiVersion: '2024-04-10',
  token: token,
  useCdn: false,
});

async function uploadStaffImages() {
  console.log('🚀 Connecting to Sanity project 1yighcjz (production)...');
  
  // Verify token works
  try {
    const user = await client.users.getById('me');
    console.log(`✅ Authenticated successfully!`);
  } catch (err) {
    // Some tokens don't support users.getById('me'), test with a light query
    try {
      await client.fetch('*[_type == "teacher"][0...1]');
      console.log(`✅ Authenticated successfully with token!`);
    } catch (authErr) {
      console.error('❌ Authentication failed:', authErr.message);
      process.exit(1);
    }
  }

  const teachers = await client.fetch('*[_type == "teacher"] | order(priority desc)');
  console.log(`📋 Found ${teachers.length} teacher records in Sanity.`);

  const staffDir = path.join(process.cwd(), 'public', 'images', 'staff');
  if (!fs.existsSync(staffDir)) {
    console.error(`❌ Staff directory not found: ${staffDir}`);
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < teachers.length; i++) {
    const t = teachers[i];
    const slug = (t.name || '').toLowerCase().replace(/[^a-z]/g, '') + '.jpg';
    const filePath = path.join(staffDir, slug);

    console.log(`\n[${i + 1}/${teachers.length}] Processing: "${t.name}" (${t.role})`);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ No local file found matching: ${slug}. Skipping.`);
      skipCount++;
      continue;
    }

    try {
      console.log(`  📤 Uploading image asset: ${slug}...`);
      const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: slug,
        contentType: 'image/jpeg',
      });
      console.log(`  ✅ Asset uploaded (ID: ${asset._id})`);

      console.log(`  🔗 Patching teacher document (${t._id})...`);
      await client
        .patch(t._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();

      console.log(`  🎉 Successfully linked photo to ${t.name}!`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed for ${t.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log(`🏁 Finished!`);
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ⏭️ Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log('========================================\n');
}

uploadStaffImages().catch(console.error);
