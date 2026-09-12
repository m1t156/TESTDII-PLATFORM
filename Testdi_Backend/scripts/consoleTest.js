/**
 * SBTI Console Test - Interactive CLI with Back/Next Navigation
 * 
 * Features:
 * - Navigate back/forward between questions
 * - Review answers before submitting
 * - Manhattan distance scoring + exact matching
 * - Full result dashboard
 * 
 * Run: node scripts/consoleTest.js (or npm run test:cli)
 */
require('dotenv').config();
const readline = require('readline');
const { connectDB, disconnectDB } = require('../config/database');
const Question = require('../models/Question');
const SBTIResult = require('../models/SBTIResult');
const TestFactory = require('../services/TestFactory');
const { DIMENSION_NAMES } = require('../config/constants');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function printLine(char = '=', len = 80) {
  console.log(char.repeat(len));
}

function printHeader(text) {
  console.log('');
  printLine();
  console.log(`  ${text}`);
  printLine();
}

function clearScreen() {
  console.clear();
}

/**
 * Fisher-Yates shuffle (creates a new shuffled copy, does NOT mutate original)
 */
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function main() {
  try {
    await connectDB();

    clearScreen();
    printHeader('🧠 SBTI - Bộ Trắc Nghiệm Tính Cách v2.5');
    console.log('  Manhattan Distance + Exact Matching');
    console.log('  31 câu hỏi | 3 lựa chọn mỗi câu (shuffled)');
    console.log('');
    console.log('  📌 Hướng dẫn:');
    console.log('     0, 1, 2  → Chọn đáp án');
    console.log('     b        → Quay lại câu trước');
    console.log('     r        → Xem tất cả câu đã trả lời');
    console.log('     q        → Thoát');
    printLine();

    // Load questions from DB
    const rawQuestions = await Question.find({ testType: 'SBTI' }).sort({ order: 1 });
    if (rawQuestions.length === 0) {
      console.log('❌ Không tìm thấy câu hỏi! Chạy "npm run seed" trước.');
      process.exit(1);
    }

    // Separate main questions from bonus, shuffle main, bonus always last
    const allQuestions = rawQuestions.map(q => q.toObject());
    const mainQuestions = allQuestions.filter(q => !q.isBonus);
    const bonusQuestions = allQuestions.filter(q => q.isBonus);

    const shuffledMain = shuffleArray(mainQuestions);

    const questions = [...shuffledMain, ...bonusQuestions].map(q => ({
      ...q,
      _originalOptions: q.options,
      options: shuffleArray(q.options),
    }));

    console.log(`\n✅ Đã tải ${questions.length} câu hỏi từ database`);
    console.log(`🔀 Câu hỏi và đáp án đã được xáo trộn ngẫu nhiên\n`);

    await ask('Nhấn Enter để bắt đầu...');

    const selectedAnswers = new Array(questions.length).fill(-1);
    let currentIndex = 0;

    while (true) {
      const q = questions[currentIndex];
      const isBonus = q.isBonus;
      const dimLabel = isBonus
        ? '🎁 BONUS'
        : `📊 ${DIMENSION_NAMES[q.dimensionIndex]}`;

      clearScreen();
      printLine('-');
      const progress = `[${'█'.repeat(currentIndex + 1)}${'░'.repeat(questions.length - currentIndex - 1)}]`;
      console.log(`  CÂU ${String(currentIndex + 1).padStart(2)} / ${questions.length}  |  ${dimLabel}  [gốc #${q.order}]`);
      console.log(`  ${progress}`);
      printLine('-');
      console.log(`\n  ${q.questionText}\n`);

      q.options.forEach((opt, j) => {
        const selected = selectedAnswers[currentIndex] === j ? ' ◀ đã chọn' : '';
        console.log(`    [${j}] ${opt.text}${selected}`);
      });

      console.log('');
      if (currentIndex > 0) {
        console.log('  (b = quay lại | r = xem lại tất cả | q = thoát)');
      }
      console.log('');

      const input = await ask('  👉 Chọn: ');
      const trimmed = input.trim().toLowerCase();

      if (trimmed === 'b' && currentIndex > 0) {
        currentIndex--;
        continue;
      }

      if (trimmed === 'q') {
        console.log('\n  Thoát test.');
        rl.close();
        await disconnectDB();
        return;
      }

      if (trimmed === 'r') {
        clearScreen();
        printHeader('📋 REVIEW CÂU TRẢ LỜI');
        for (let i = 0; i < questions.length; i++) {
          const answered = selectedAnswers[i] >= 0;
          const pts = answered ? questions[i].options[selectedAnswers[i]]?.points : null;
          const status = answered ? `✅ [pts=${pts}]` : '⬜ chưa trả lời';
          const qText = questions[i].questionText.substring(0, 45) + '...';
          console.log(`  ${String(i + 1).padStart(2)}. ${status}  [gốc #${String(questions[i].order).padStart(2)}] ${qText}`);
        }
        console.log('');
        const jumpTo = await ask('  Nhập số câu muốn nhảy đến (Enter = tiếp tục): ');
        if (jumpTo.trim()) {
          const idx = parseInt(jumpTo.trim()) - 1;
          if (idx >= 0 && idx < questions.length) {
            currentIndex = idx;
          }
        }
        continue;
      }

      const score = parseInt(trimmed);
      if (isNaN(score) || score < 0 || score > 2) {
        continue;
      }

      selectedAnswers[currentIndex] = score;

      if (currentIndex < questions.length - 1) {
        currentIndex++;
      } else {
        const unanswered = selectedAnswers.findIndex(a => a < 0);
        if (unanswered >= 0) {
          console.log(`\n  ⚠️  Còn ${selectedAnswers.filter(a => a < 0).length} câu chưa trả lời!`);
          const goTo = await ask(`  Nhảy đến câu ${unanswered + 1}? (y/n): `);
          if (goTo.trim().toLowerCase() === 'y') {
            currentIndex = unanswered;
            continue;
          }
        }

        clearScreen();
        printHeader('📋 XÁC NHẬN NỘP BÀI');
        const answeredCount = selectedAnswers.filter(a => a >= 0).length;
        console.log(`\n  Đã trả lời: ${answeredCount}/${questions.length}`);
        
        for (let i = 0; i < questions.length; i++) {
          const answered = selectedAnswers[i] >= 0;
          const pts = answered ? questions[i].options[selectedAnswers[i]]?.points : null;
          const status = answered ? `[pts=${pts}]` : '[?]';
          console.log(`    Câu ${String(i + 1).padStart(2)} (gốc #${String(questions[i].order).padStart(2)}): ${status}`);
        }

        console.log('');
        const confirm = await ask('  ✅ Nộp bài? (y = nộp | b = quay lại sửa): ');
        if (confirm.trim().toLowerCase() !== 'y') {
          currentIndex = questions.length - 1;
          continue;
        }

        break;
      }
    }

    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedOptionId: q.options[selectedAnswers[i]]?.optionId,
      score: q.options[selectedAnswers[i]]?.points ?? selectedAnswers[i],
    }));

    clearScreen();
    printHeader('🔄 ĐANG TÍNH KẾT QUẢ (Manhattan Distance)...');

    const testDefinition = TestFactory.getTest('SBTI');
    const fullResult = testDefinition.calculateFullResult(answers, questions);

    const {
      userVector,
      dnaTattoo,
      mainType,
      topMatches,
      confidence,
      dimensionAnalysis,
      bonusDrink,
      method,
    } = fullResult;

    clearScreen();
    printHeader('🎯 KẾT QUẢ TÍNH CÁCH CỦA BẠN');

    console.log(`\n  ┌─────────────────────────────────────────────────┐`);
    console.log(`  │  TÍNH CÁCH CHÍNH: ${mainType.code.padEnd(6)}  (${String(mainType.score).padStart(5)}%)${' '.repeat(14)}│`);
    console.log(`  │  ${mainType.desc.substring(0, 49).padEnd(49)}│`);
    console.log(`  │  Độ tin cậy: ${confidence.padEnd(36)}│`);
    console.log(`  └─────────────────────────────────────────────────┘`);

    if (method === 'DRUNK_OVERRIDE') {
      console.log('\n  🍺🍺🍺 DRUNK OVERRIDE! Câu bonus "Thánh Say" đã kích hoạt! 🍺🍺🍺');
    } else if (method === 'HHHH_FALLBACK') {
      console.log('\n  ⚠️  HHHH FALLBACK! Không tìm thấy archetype phù hợp (< 60%).');
    }

    console.log(`\n  📐 Phương pháp: ${method} (Manhattan Distance + Exact Matching)`);
    console.log(`  📊 Distance: ${mainType.distance} | Exact matches: ${mainType.exact}/15`);

    printHeader('📊 PHÂN TÍCH THEO NHÓM CHIỀU');

    for (const [group, data] of Object.entries(dimensionAnalysis)) {
      const levels = ['L', 'M', 'H'];
      const rawStr = data.raw.map(x => levels[Math.min(2, x - 1)]).join(' ');
      const barLen = Math.round(data.score / 5);
      const bar = '█'.repeat(barLen) + '░'.repeat(20 - barLen);
      const levelIcon = data.level === 'HIGH' ? '🔴' : data.level === 'MEDIUM' ? '🟡' : '🔵';
      console.log(`  ${levelIcon} ${group.padEnd(12)} ${data.level.padEnd(8)} ${bar} ${String(data.score).padStart(5)}%  [${rawStr}]`);
    }

    printHeader('🏆 TOP 5 TÍNH CÁCH PHÙ HỢP');
    console.log('  Code     Score   Dist   Exact   Mô tả');
    printLine('-');

    topMatches.forEach((m, i) => {
      const marker = i === 0 ? '👑' : `  `;
      console.log(`  ${marker} ${m.code.padEnd(6)} ${String(m.score).padStart(5)}%  ${String(m.distance).padStart(4)}   ${String(m.exact).padStart(4)}/15  ${m.desc}`);
    });

    printHeader('🧬 DNA CỦA BẠN');

    console.log(`\n  DNA Tattoo: ${dnaTattoo}`);
    console.log(`  Vector:     [${userVector.join(', ')}]`);

    const levels = ['L', 'M', 'H'];
    const dimLabels = DIMENSION_NAMES.map((name, i) => {
      const level = levels[Math.min(2, userVector[i] - 1)];
      return `${name.padEnd(22)} = ${userVector[i]} (${level})`;
    });
    console.log('\n  Chi tiết 15 chiều:');
    dimLabels.forEach(l => console.log(`    ${l}`));

    const drinkLabels = { 1: 'Thánh Say', 2: 'Xã giao', 3: 'Không uống' };
    console.log(`\n  🍺 Bonus (uống rượu): ${drinkLabels[bonusDrink] || 'N/A'}`);

    console.log('');
    printLine();
    const saveChoice = await ask('  💾 Lưu kết quả vào database? (y/n): ');

    if (saveChoice.trim().toLowerCase() === 'y') {
      const PersonalityArchetype = require('../models/PersonalityArchetype');
      const Character = require('../models/Character');

      const archetype = await PersonalityArchetype.findOne({
        testType: 'SBTI',
        archetypeCode: mainType.code,
      });

      let character = null;
      if (archetype?.characterId) {
        character = await Character.findById(archetype.characterId);
      }

      const sbtiResult = new SBTIResult({
        guestId: `CONSOLE_TEST_${Date.now()}`,
        dnaTattoo,
        userVector,
        mainType: {
          type: mainType.type,
          code: mainType.code,
          score: mainType.score,
          distance: mainType.distance,
          exact: mainType.exact,
          desc: mainType.desc,
        },
        topMatches: topMatches.map(m => ({
          type: m.type,
          code: m.code,
          score: m.score,
          distance: m.distance,
          exact: m.exact,
          desc: m.desc,
        })),
        confidence,
        dimensionAnalysis,
        bonusDrink,
        personalityArchetypeId: archetype?._id,
        characterId: character?._id,
        answers: answers.map(a => ({
          questionId: a.questionId,
          selectedOptionId: a.selectedOptionId,
          score: a.score,
        })),
        matchSimilarityScore: parseFloat((mainType.score / 100).toFixed(3)),
      });

      await sbtiResult.save();
      console.log(`\n  ✅ Đã lưu! Result ID: ${sbtiResult._id}`);
    }

    printHeader('✨ TEST HOÀN TẤT!');

    rl.close();
    await disconnectDB();
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    console.error(error.stack);
    rl.close();
    await disconnectDB();
    process.exit(1);
  }
}

main();
