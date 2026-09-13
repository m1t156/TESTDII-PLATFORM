const mongoose = require('mongoose');

let mongod = null;

const syncArchetypes = async () => {
  try {
    const PersonalityArchetype = require('../models/PersonalityArchetype');
    const Character = require('../models/Character');
    const { ARCHETYPES } = require('../config/constants');

    for (const [code, archData] of Object.entries(ARCHETYPES)) {
      const charName = archData.desc.split(' — ')[0] || archData.desc.split(' - ')[0] || code;
      const archName = archData.desc.split(' — ')[1] || archData.desc.split(' - ')[1] || code;

      await Character.updateOne(
        { personalityType: code },
        { $set: { name: charName, description: archData.desc } }
      );

      await PersonalityArchetype.updateOne(
        { archetypeCode: code },
        { $set: { archetypeName: archName, description: archData.desc } }
      );
    }
    console.log('🔄 Synced 27 archetype descriptions with database');
  } catch (err) {
    console.error('Failed to sync archetype descriptions:', err.message);
  }
};

const seedIfEmpty = async () => {
  try {
    const Question = require('../models/Question');
    const count = await Question.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Running automatic seed...');
      const sbtiQuestionsData = require('../seeders/sbtiQuestionsData');
      const PersonalityArchetype = require('../models/PersonalityArchetype');
      const Character = require('../models/Character');
      const { ARCHETYPES } = require('../config/constants');

      await Question.insertMany(sbtiQuestionsData);
      
      const archetypeEntries = Object.entries(ARCHETYPES);
      const characters = [];
      for (const [code, archData] of archetypeEntries) {
        characters.push({
          personalityType: code,
          name: archData.desc.split(' — ')[0] || archData.desc.split(' - ')[0] || code,
          description: archData.desc,
          baseImage: `/characters/${code}.png`,
          unlockedImage: `/characters/${code}.png`,
        });
      }
      const savedChars = await Character.insertMany(characters);
      const charMap = {};
      savedChars.forEach(c => charMap[c.personalityType] = c._id);

      const archetypes = [];
      const levelChars = ['L', 'M', 'H'];
      for (const [code, archData] of archetypeEntries) {
        const dnaTattoo = archData.vector.map(v => levelChars[v - 1]).join('');
        archetypes.push({
          testType: 'SBTI',
          archetypeName: archData.desc.split(' — ')[1]?.trim() || archData.desc.split(' - ')[1]?.trim() || code,
          archetypeCode: code,
          dnaTattoo,
          description: archData.desc,
          characterId: charMap[code],
        });
      }
      await PersonalityArchetype.insertMany(archetypes);
      console.log('✅ Auto-seed completed successfully!');
    } else {
      await syncArchetypes();
    }
  } catch (err) {
    console.error('Auto-seed failed:', err.message);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL || 'mongodb://127.0.0.1:27017/testdi_db';

  try {
    // Attempt connecting to local / cloud MongoDB with short timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ MongoDB Service connected: ${mongoose.connection.host}`);
    await seedIfEmpty();
    return mongoose.connection;
  } catch (error) {
    console.log(`ℹ️  Không tìm thấy dịch vụ MongoDB chạy tại ${mongoUri}. Đang tự động kích hoạt In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB connected: ${uri}`);
      await seedIfEmpty();
      return mongoose.connection;
    } catch (memError) {
      console.error('Failed to start In-Memory MongoDB:', memError);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
