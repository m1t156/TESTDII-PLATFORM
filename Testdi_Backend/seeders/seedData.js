require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/database');
const Question = require('../models/Question');
const Character = require('../models/Character');
const PersonalityArchetype = require('../models/PersonalityArchetype');
const User = require('../models/User');
const sbtiQuestionsData = require('./sbtiQuestionsData');
const { ARCHETYPES } = require('../config/constants');

async function seedDatabase() {
  try {
    await connectDB();
    console.log('📝 Starting database seeding...');

    // Clear existing data
    await Question.deleteMany({});
    await Character.deleteMany({});
    await PersonalityArchetype.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ====================== Seed SBTI Questions ======================
    const questions = await Question.insertMany(sbtiQuestionsData);
    console.log(`✅ Seeded ${questions.length} SBTI questions`);

    // ====================== Seed Characters (27 for SBTI) ======================
    // Each archetype maps 1-to-1 with a character
    // Images will be uploaded later by the user
    const archetypeEntries = Object.entries(ARCHETYPES);
    const characters = [];

    for (let i = 0; i < archetypeEntries.length; i++) {
      const [code, archData] = archetypeEntries[i];
      characters.push({
        personalityType: code,
        name: archData.desc.split(' - ')[0] || code, // e.g., "The Controller"
        description: archData.desc,
        baseImage: `/characters/${code}.png`,
        unlockedImage: `/characters/${code}.png`,
        basePalettes: [
          {
            name: 'Default',
            colors: {
              primary: '#6366F1',
              secondary: '#8B5CF6',
              accent: '#EC4899',
              background: '#0F172A',
            },
          },
        ],
      });
    }

    const savedCharacters = await Character.insertMany(characters);
    console.log(`✅ Seeded ${savedCharacters.length} characters`);

    // Build a map: archetypeCode → characterId
    const characterMap = {};
    savedCharacters.forEach(char => {
      characterMap[char.personalityType] = char._id;
    });

    // ====================== Seed Personality Archetypes (27 for SBTI) ======================
    const archetypes = [];

    for (const [code, archData] of archetypeEntries) {
      // Convert numeric vector [1,2,3,...] to DNA string "LMH..."
      // Scale: 1→L, 2→M, 3→H
      const levelChars = ['L', 'M', 'H'];
      const dnaTattoo = archData.vector.map(v => levelChars[v - 1]).join('');

      archetypes.push({
        testType: 'SBTI',
        archetypeName: archData.desc.split(' - ')[1]?.trim() || code,
        archetypeCode: code,
        dnaTattoo,
        description: archData.desc,
        characterId: characterMap[code],
        traits: [], // To be filled with real trait data later
      });
    }

    await PersonalityArchetype.insertMany(archetypes);
    console.log(`✅ Seeded ${archetypes.length} personality archetypes`);

    // ====================== Seed Admin Account ======================
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@testdi.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    // Only create admin if not exists (safe for re-runs)
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = new User({
        email: adminEmail,
        username: 'Admin',
        password: adminPassword,
        role: 'admin',
        loginMethod: 'local',
        isGuest: false,
      });
      await adminUser.save();
      console.log(`✅ Seeded admin account: ${adminEmail}`);
    } else {
      // Ensure existing user is admin
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
      console.log(`ℹ️  Admin account already exists: ${adminEmail}`);
    }

    // ====================== Summary ======================
    console.log('\n📊 Seeding Summary:');
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Characters: ${savedCharacters.length}`);
    console.log(`   Archetypes: ${archetypes.length}`);
    console.log(`   Admin: ${adminEmail}`);
    console.log('\n🎉 Database seeding completed successfully!');
    
    await disconnectDB();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
