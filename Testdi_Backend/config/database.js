const mongoose = require('mongoose');

let mongod = null;

// Theo dõi trạng thái kết nối MongoDB để dễ debug trên Render
mongoose.connection.on('connected', () => {
  console.log(`✅ MongoDB connected successfully to: ${mongoose.connection.host || 'cluster'}`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

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
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER;

  const mongooseOptions = {
    serverSelectionTimeoutMS: 15000, // Tăng thời gian chờ lên 15 giây để tránh timeout trên Cloud
    connectTimeoutMS: 15000,
  };

  try {
    console.log(`⏳ Đang kết nối tới MongoDB...`);
    await mongoose.connect(mongoUri, mongooseOptions);
    await seedIfEmpty();
    return mongoose.connection;
  } catch (error) {
    const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
    console.error(`❌ Kết nối MongoDB thất bại (${maskedUri}):`, error.message);

    // Môi trường Production / Render: KHÔNG fallback sang MongoMemoryServer vì sẽ gây crash/OOM
    if (isProduction) {
      console.error('🚨 [Production / Render] Không thể kết nối MongoDB Atlas. Vui lòng kiểm tra IP Whitelist (0.0.0.0/0) và chuỗi MONGODB_URI.');
      throw error;
    }

    // Môi trường Local Development: Thử dùng MongoMemoryServer nếu có cài đặt
    console.log(`ℹ️ Đang kích hoạt In-Memory MongoDB dự phòng cho Local Development...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB connected: ${uri}`);
      await seedIfEmpty();
      return mongoose.connection;
    } catch (memError) {
      console.error('Failed to start In-Memory MongoDB:', memError.message);
      throw error;
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
