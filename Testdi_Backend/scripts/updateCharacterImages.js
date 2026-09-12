/**
 * Update Character Images in Database
 * 
 * Standalone script to scan uploads/characters and update MongoDB with character image paths.
 * 
 * Usage:
 *   node scripts/updateCharacterImages.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, disconnectDB } = require('../config/database');
const Character = require('../models/Character');

const IMAGE_MAPPING = {
  'ATMR': 'ATM-er.png',
  'BOSS': 'BOSS.png',
  'CTRL': 'CTRL.png',
  'DEAD': 'DEAD.png',
  'DRUNK': 'DRUNK.png',
  'DIOR': 'Dior.png',
  'FAKE': 'FAKE.png',
  'FUCK': 'FUCK.png',
  'GOGO': 'GOGO.png',
  'HHHH': 'HHHH.png',
  'IMFW': 'IMFW.png',
  'IMSB': 'IMSB.png',
  'JOKER': 'JOKE-R.png',
  'LOVR': 'LOVE-R.png',
  'MALO': 'MALO.png',
  'MONK': 'MONK.png',
  'MUMM': 'MUM.png',
  'OHNO': 'OH-NO.png',
  'OJBK': 'OJBK.png',
  'POOR': 'POOR.png',
  'SEXY': 'SEXY.png',
  'SHIT': 'SHIT.png',
  'SOLO': 'SOLO.png',
  'THANK': 'THAN-K.png',
  'THINK': 'THIN-K.png',
  'WOCI': 'WOC.png',
  'ZZZZ': 'ZZZZ.png'
};

async function updateCharacterImages() {
  try {
    await connectDB();
    console.log('🔄 Connected to database.');

    const uploadDir = path.join(__dirname, '..', 'uploads', 'characters');
    console.log(`📁 Scanning character images directory: ${uploadDir}`);

    if (!fs.existsSync(uploadDir)) {
      console.error('❌ Error: uploads/characters directory does not exist!');
      await disconnectDB();
      return;
    }

    const filesInDir = fs.readdirSync(uploadDir);
    console.log(`📊 Found ${filesInDir.length} files in uploads/characters.`);

    let updatedCount = 0;
    let missingFiles = [];

    for (const [personalityType, filename] of Object.entries(IMAGE_MAPPING)) {
      const filePath = path.join(uploadDir, filename);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Warning: Expected file not found for ${personalityType} at: ${filename}`);
        missingFiles.push(filename);
        continue;
      }

      // Format URL path the same way as upload middleware does
      const imageUrl = `/uploads/characters/${filename}`;

      // Update the character in the database
      const result = await Character.findOneAndUpdate(
        { personalityType },
        { 
          baseImage: imageUrl,
          unlockedImage: imageUrl,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (result) {
        console.log(`✅ Updated ${personalityType}: name="${result.name}", image="${imageUrl}"`);
        updatedCount++;
      } else {
        console.warn(`❌ Character not found in DB for personalityType: ${personalityType}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total Archetypes configured: ${Object.keys(IMAGE_MAPPING).length}`);
    console.log(`   Successfully updated in DB: ${updatedCount}`);
    if (missingFiles.length > 0) {
      console.log(`   Missing files: ${missingFiles.join(', ')}`);
    }

    await disconnectDB();
    console.log('🔌 Database disconnected.');
  } catch (error) {
    console.error('❌ An error occurred during the update process:', error);
    process.exit(1);
  }
}

updateCharacterImages();
