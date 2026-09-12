/**
 * SBTI Questions Data - From sbti_core_rev1905.py
 * 
 * Structure: 31 questions (30 main + 1 bonus)
 * - 15 dimensions, 2 questions per dimension
 * - Each question has 3 options scoring 1, 2, 3 (L → M → H)
 * - All questions are forward-scored (no reverse)
 * - Options are shuffled at API level to prevent gaming
 * - Bonus question (dim -1) tracks drinking habit, doesn't affect vector
 */

const sbtiQuestionsData = [
  // ====================== SELF (Bản Thân) ======================
  // S1 - SelfEsteem (dim 0)
  {
    testType: 'SBTI',
    questionText: 'Trong chuyện tình cảm, tôi thường cảm thấy mình không đủ tốt so với những người yêu cũ của người ấy.',
    dimension: 'SELF',
    measure: 'S1',
    dimensionIndex: 0,

    order: 1,
    isBonus: false,
    options: [
      { text: 'Đúng vậy, tôi hay bị ám ảnh bởi điều đó.', points: 1 },
      { text: 'Thỉnh thoảng tôi mới nghĩ vậy khi mọi thứ không suôn sẻ.', points: 2 },
      { text: 'Không, tôi tin vào giá trị của mình ở hiện tại.', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Người yêu bạn rủ bạn về ra mắt gia đình, nhưng bạn biết gia đình họ có điều kiện và rất khó tính.',
    dimension: 'SELF',
    measure: 'S1',
    dimensionIndex: 0,

    order: 2,
    isBonus: false,
    options: [
      { text: 'Sợ mình không đủ tốt, kiểu gì cũng bị chê.', points: 1 },
      { text: 'Tôi lo một chút, chuẩn bị trước vài thứ để tự tin hơn.', points: 2 },
      { text: 'Tôi tự tin mình sẽ ghi điểm.', points: 3 },
    ],
  },

  // S2 - SelfClarity (dim 1)
  {
    testType: 'SBTI',
    questionText: "Tôi là ai? Tôi thích gì? Tôi giỏi gì? Tôi muốn gì? Đừng hỏi tôi. Mỗi sáng thức dậy, tôi mất 10 phút để nhớ ra hôm nay mình nên vui hay buồn. Cảm xúc của tôi như một cái remote bị loạn kênh — đang khóc vì một con chó bị lạc, rồi lại cười phá lên vì video làm từ AI 'chủ cây xăng và cục lửa bé bỏng ngốk nghếch'. Người yêu cũ còn bảo tôi khó hiểu. Tôi bảo: 'Ừ, tao còn chả hiểu nổi tao mà.'",
    dimension: 'SELF',
    measure: 'S2',
    dimensionIndex: 1,

    order: 3,
    isBonus: false,
    options: [
      { text: 'Ủa, sao giống mình thế...', points: 1 },
      { text: 'Mình đang đọc cái * thế này ... ?', points: 2 },
      { text: 'Tôi có như này đâu !?', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Bạn và người yêu đang cãi nhau. Giữa lúc căng thẳng, bạn có biết chính xác mình đang giận vì điều gì không?',
    dimension: 'SELF',
    measure: 'S2',
    dimensionIndex: 1,

    order: 4,
    isBonus: false,
    options: [
      { text: 'Chỉ thấy khó chịu và muốn người kia im mồm luôn', points: 1 },
      { text: 'Tôi cần vài phút im lặng để tự hỏi', points: 2 },
      { text: 'Biết vì sao mình giận và nói rõ', points: 3 },
    ],
  },

  // S3 - Purpose (dim 2)
  {
    testType: 'SBTI',
    questionText: "Nếu ai cũng biết 'kệ' nhau để sống thoải mái, mục tiêu lớn nhất của bạn là gì?",
    dimension: 'SELF',
    measure: 'S3',
    dimensionIndex: 2,

    order: 5,
    isBonus: false,
    options: [
      { text: 'Có lẽ cứ sống theo cách người khác mong đợi.', points: 1 },
      { text: 'Chưa dám khẳng định điều gì là quan trọng nhất với mình.', points: 2 },
      { text: 'Tôi biết rõ mình coi trọng điều gì, và tôi sẽ sống hết mình vì điều đó.', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Tôi thà bị ghét vì là chính mình, còn hơn được yêu quý vì là bản sao của ai khác.',
    dimension: 'SELF',
    measure: 'S3',
    dimensionIndex: 2,

    order: 6,
    isBonus: false,
    options: [
      { text: 'Không đồng ý', points: 1 },
      { text: 'Trung lập', points: 2 },
      { text: 'Đồng ý', points: 3 },
    ],
  },

  // ====================== EMOTIONS (Cảm Xúc) ======================
  // E1 - Attachment (dim 3)
  {
    testType: 'SBTI',
    questionText: 'Tôi thường cảm thấy bất an và nghi ngờ khi ai đó đối xử tốt với mình một cách bất ngờ.',
    dimension: 'EMOTIONS',
    measure: 'E1',
    dimensionIndex: 3,

    order: 7,
    isBonus: false,
    options: [
      { text: 'Đồng ý', points: 1 },
      { text: 'Trung lập', points: 2 },
      { text: 'Không đồng ý', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Trong các lần làm bài tập nhóm, khi gặp bất đồng quan điểm thì bạn sẽ làm gì?',
    dimension: 'EMOTIONS',
    measure: 'E1',
    dimensionIndex: 3,

    order: 8,
    isBonus: false,
    options: [
      { text: 'Thôi im lặng cho yên, sợ cãi nhau xong nghỉ chơi luôn thì sao?!', points: 1 },
      { text: 'Bảo vệ luận điểm của mình và không làm quá mọi chuyện.', points: 2 },
      { text: 'Cãi thắng bằng được!', points: 3 },
    ],
  },

  // E2 - EmotionalDepth (dim 4)
  {
    testType: 'SBTI',
    questionText: 'Bạn mới quen một người. Họ tâm sự với bạn về một tổn thương sâu sắc trong quá khứ.',
    dimension: 'EMOTIONS',
    measure: 'E2',
    dimensionIndex: 4,

    order: 9,
    isBonus: false,
    options: [
      { text: 'Gì vậy ta, mới quen á má!', points: 1 },
      { text: 'Bạn lắng nghe chăm chú, an ủi họ nhưng vẫn giữ khoảng cách.', points: 2 },
      { text: 'Đồng cảm và chia sẻ ngay những trải nghiệm tương tự của bản thân.', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Tôi thấy khó mở lòng và thường mất nhiều thời gian mới thực sự tin tưởng ai đó.',
    dimension: 'EMOTIONS',
    measure: 'E2',
    dimensionIndex: 4,

    order: 10,
    isBonus: false,
    options: [
      { text: 'Không đồng ý.', points: 1 },
      { text: 'Trung lập.', points: 2 },
      { text: 'Đồng ý.', points: 3 },
    ],
  },

  // E3 - Independence (dim 5)
  {
    testType: 'SBTI',
    questionText: 'Người yêu bạn hào hứng muốn kể cho bạn nghe về một ngày dài của họ. Bạn sẽ?',
    dimension: 'EMOTIONS',
    measure: 'E3',
    dimensionIndex: 5,

    order: 11,
    isBonus: false,
    options: [
      { text: 'Dừng việc đang làm, tập trung lắng nghe.', points: 1 },
      { text: 'Vừa nghe vừa làm việc của mình, thỉnh thoảng gật gù.', points: 2 },
      { text: 'Từ chối khéo vì đang bận việc riêng.', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Khi mới chuyển lớp, đã có một người bạn ra bắt chuyện với tôi một cách rất thân thiện.',
    dimension: 'EMOTIONS',
    measure: 'E3',
    dimensionIndex: 5,

    order: 12,
    isBonus: false,
    options: [
      { text: 'Nói chuyện lại như người nhà.', points: 1 },
      { text: 'Chào hỏi xã giao.', points: 2 },
      { text: 'Im lặng nào, thầy đang mewing !!', points: 3 },
    ],
  },

  // ====================== ATTITUDE (Thái Độ) ======================
  // A1 - Worldview (dim 6)
  {
    testType: 'SBTI',
    questionText: 'Bạn thấy một người cùng tuổi bạn có kỹ năng tốt hơn, đang kiếm tiền / làm việc tốt hơn bạn:',
    dimension: 'ATTITUDE',
    measure: 'A1',
    dimensionIndex: 6,

    order: 13,
    isBonus: false,
    options: [
      { text: 'Bạn nghĩ họ có nền tảng hoặc xuất phát điểm tốt hơn nên mình có cố cũng khó theo kịp', points: 1 },
      { text: 'Bạn nghĩ mỗi người có hoàn cảnh và hướng đi khác nhau', points: 2 },
      { text: 'Tìm hiểu xem họ có bí quyết hay cách làm gì khác mình', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Bạn đăng một thứ bạn làm (vẽ tranh, blog, video…), và có người vào góp ý khá thẳng:',
    dimension: 'ATTITUDE',
    measure: 'A1',
    dimensionIndex: 6,

    order: 14,
    isBonus: false,
    options: [
      { text: 'Thấy khó chịu và muốn gỡ bài xuống.', points: 1 },
      { text: 'Đọc xong để đó, không suy nghĩ nhiều.', points: 2 },
      { text: 'Tiếp thu ý kiến và cân nhắc chỉnh sửa', points: 3 },
    ],
  },

  // A2 - RulesFlex (dim 7)
  {
    testType: 'SBTI',
    questionText: 'Cách bạn sắp xếp không gian sống hoặc phòng riêng của mình:',
    dimension: 'ATTITUDE',
    measure: 'A2',
    dimensionIndex: 7,

    order: 15,
    isBonus: false,
    options: [
      { text: 'Sống trong sự hỗn độn có chủ đích', points: 1 },
      { text: 'Tổng quan gọn gàng, nhưng đôi khi có những góc bừa bộn riêng', points: 2 },
      { text: 'Mọi thứ phải nằm đúng vị trí của nó', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Sắp tới bạn có một chuyến du lịch nhưng bạn chưa có lịch trình cụ thể.',
    dimension: 'ATTITUDE',
    measure: 'A2',
    dimensionIndex: 7,

    order: 16,
    isBonus: false,
    options: [
      { text: 'Đi rồi tính, tới đâu hay tới đó mới vui.', points: 1 },
      { text: 'Lên vài điểm chính muốn đến, còn lại tùy hứng', points: 2 },
      { text: 'Đã lên chi tiết từng khung giờ', points: 3 },
    ],
  },

  // A3 - Meaning (dim 8)
  {
    testType: 'SBTI',
    questionText: 'Nếu có một nút bấm cho phép bạn xem trước tương lai nhưng không thể thay đổi, bạn sẽ làm gì?',
    dimension: 'ATTITUDE',
    measure: 'A3',
    dimensionIndex: 8,

    order: 17,
    isBonus: false,
    options: [
      { text: 'Bấm luôn, xem khi nào trúng số', points: 1 },
      { text: 'Suy nghĩ một hồi...', points: 2 },
      { text: 'Không bấm, vì tương lai là của mình là tự viết', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Bạn bất ngờ nhận được một khoản tiền từ trên trời rơi xuống. Phản ứng đầu tiên của bạn là gì?',
    dimension: 'ATTITUDE',
    measure: 'A3',
    dimensionIndex: 8,

    order: 18,
    isBonus: false,
    options: [
      { text: 'Chốt ngay cho bản thân một món đồ mình đã tia lâu nay', points: 1 },
      { text: 'Cất đi trước rồi tính sau', points: 2 },
      { text: 'Tận dụng làm đòn bẩy. Đầu tư ngay vào một khóa học', points: 3 },
    ],
  },

  // ====================== ACTION (Hành Động) ======================
  // AC1 - Motivation (dim 9)
  {
    testType: 'SBTI',
    questionText: 'Bạn đang đi trên phố thì thấy một chiếc xe hơi đang lao xuống dốc, phía dưới là một em bé đang chơi.',
    dimension: 'ACTION',
    measure: 'AC1',
    dimensionIndex: 9,

    order: 19,
    isBonus: false,
    options: [
      { text: 'Hét lên, hy vọng có người khác đến cứu.', points: 1 },
      { text: 'Vừa chạy vừa tính toán cách đẩy em bé ra', points: 2 },
      { text: 'Lao ngay vào, chấp nhận rủi ro', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: "Một con quỷ xuất hiện trước mặt bạn và thì thầm: 'Cho tao một phần cơ thể của mày, tao sẽ cho mày sức mạnh để trả thù tất cả những ai đã giẫm đạp lên mày.'",
    dimension: 'ACTION',
    measure: 'AC1',
    dimensionIndex: 9,

    order: 20,
    isBonus: false,
    options: [
      { text: 'Điên à? Mất một phần cơ thể thì còn gì là mình nữa.', points: 1 },
      { text: 'Từ từ, để coi nó lấy phần nào đã. Với lại trả thù ai đây nhỉ?.', points: 2 },
      { text: 'Lấy đi! Chỉ cần tao mạnh hơn tất cả!', points: 3 },
    ],
  },

  // AC2 - Decision (dim 10)
  {
    testType: 'SBTI',
    questionText: 'Bạn bỗng nhận ra bài test này đang đo lường chính sự do dự của bạn. Bạn càng do dự, điểm càng thấp. Bạn sẽ:',
    dimension: 'ACTION',
    measure: 'AC2',
    dimensionIndex: 10,

    order: 21,
    isBonus: false,
    options: [
      { text: 'Chết rồi. Giờ biết chọn sao đây?!', points: 1 },
      { text: 'Hay thật đấy. Để tao cân nhắc thêm một chút...', points: 2 },
      { text: 'Biết rồi, chọn luôn!', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: "Bạn và nhóm bạn bị kẹt trong một tòa nhà đầy zombie. Có 3 lối thoát: cửa chính (ồn ào, dễ thấy), tầng hầm (tối, không biết có gì), và mái nhà (phải leo cao, nguy hiểm). Bạn phải quyết định ngay.",
    dimension: 'ACTION',
    measure: 'AC2',
    dimensionIndex: 10,

    order: 22,
    isBonus: false,
    options: [
      { text: 'Đứng im, chờ xem ai trong nhóm quyết định trước', points: 1 },
      { text: 'Đánh giá nhanh tình hình', points: 2 },
      { text: "Hô to 'Lên mái nhà!' và lao đi trước.", points: 3 },
    ],
  },

  // AC3 - Execution (dim 11)
  {
    testType: 'SBTI',
    questionText: '23h đêm, tự dưng đứa bạn nhắc mai là hạn deadline quan trọng. Bạn làm gì?',
    dimension: 'ACTION',
    measure: 'AC3',
    dimensionIndex: 11,

    order: 23,
    isBonus: false,
    options: [
      { text: 'Hoảng loạn, tìm cách gia hạn deadline.', points: 1 },
      { text: 'Cà phê, bật nhạc lofi, ngồi vào bàn và làm tới sáng', points: 2 },
      { text: 'Bình tĩnh, vì đã làm xong từ tuần trước', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Tôi thường trì hoãn những việc quan trọng cho đến khi không thể trì hoãn được nữa.',
    dimension: 'ACTION',
    measure: 'AC3',
    dimensionIndex: 11,

    order: 24,
    isBonus: false,
    options: [
      { text: 'Đồng ý', points: 1 },
      { text: 'Trung lập', points: 2 },
      { text: 'Không đồng ý', points: 3 },
    ],
  },

  // ====================== SOCIAL (Xã Hội) ======================
  // SO1 - SocialProactivity (dim 12)
  {
    testType: 'SBTI',
    questionText: 'Khi tham gia 1 nhóm mới hoặc gặp người lạ, bạn sẽ:',
    dimension: 'SOCIAL',
    measure: 'SO1',
    dimensionIndex: 12,

    order: 25,
    isBonus: false,
    options: [
      { text: 'E ngại, thường đứng ngoài quan sát.', points: 1 },
      { text: 'Tùy người. Hợp thì chơi.', points: 2 },
      { text: 'Bạn của bạn cũng là bạn tôi!', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Trong một nhóm chat đông người đang tranh luận sôi nổi, vai trò của bạn là gì?',
    dimension: 'SOCIAL',
    measure: 'SO1',
    dimensionIndex: 12,

    order: 26,
    isBonus: false,
    options: [
      { text: 'Để chế độ im lặng', points: 1 },
      { text: 'Thỉnh thoảng vào thả icon', points: 2 },
      { text: 'Chiến thần spam tin nhắn', points: 3 },
    ],
  },

  // SO2 - Boundaries (dim 13)
  {
    testType: 'SBTI',
    questionText: 'Một người bạn tự ý lấy đồ của bạn mà không xin phép, bạn sẽ:',
    dimension: 'SOCIAL',
    measure: 'SO2',
    dimensionIndex: 13,

    order: 27,
    isBonus: false,
    options: [
      { text: 'Thấy khó chịu trong lòng, nhưng vẫn im lặng', points: 1 },
      { text: 'Nhắc nhở họ khéo và xin lại đồ.', points: 2 },
      { text: 'Tỏ thái độ gay gắt, giật lại đồ', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Người yêu bạn yêu cầu bạn hạn chế chơi với bạn thân khác giới. Bạn sẽ:',
    dimension: 'SOCIAL',
    measure: 'SO2',
    dimensionIndex: 13,

    order: 28,
    isBonus: false,
    options: [
      { text: 'Đồng ý ngay vì không muốn người yêu buồn lòng.', points: 1 },
      { text: 'Cố gắng giải thích...', points: 2 },
      { text: 'Khẳng định rằng bạn bè và tình yêu là hai phạm trù riêng', points: 3 },
    ],
  },

  // SO3 - Authenticity (dim 14)
  {
    testType: 'SBTI',
    questionText: 'Khi ở cạnh người khác, bạn thể hiện bản thân thế nào?',
    dimension: 'SOCIAL',
    measure: 'SO3',
    dimensionIndex: 14,

    order: 29,
    isBonus: false,
    options: [
      { text: 'Khéo léo thay đổi cách nói chuyện theo từng hoàn cảnh', points: 1 },
      { text: 'Có lúc thẳng thắn, có lúc tiết chế', points: 2 },
      { text: 'Thể hiện đúng con người thật', points: 3 },
    ],
  },
  {
    testType: 'SBTI',
    questionText: 'Tôi có thể dễ dàng thay đổi giọng điệu, cách nói và thậm chí cả vốn từ tùy theo người tôi đang trò chuyện.',
    dimension: 'SOCIAL',
    measure: 'SO3',
    dimensionIndex: 14,

    order: 30,
    isBonus: false,
    options: [
      { text: 'Đồng ý', points: 1 },
      { text: 'Trung lập', points: 2 },
      { text: 'Không đồng ý', points: 3 },
    ],
  },

  // ====================== BONUS ======================
  {
    testType: 'SBTI',
    questionText: 'Câu hỏi bonus: Thói quen uống rượu / say xỉn của bạn?',
    dimension: 'SELF', // placeholder dimension, not used in scoring
    measure: 'S1',     // placeholder measure, not used in scoring
    dimensionIndex: -1, // -1 means bonus, not part of 15-dim vector

    order: 31,
    isBonus: true,
    options: [
      { text: '0 → Thánh Say - Uống vào là thăng hoa cực độ', points: 1 },
      { text: '1 → Xã giao - Uống có chừng mực', points: 2 },
      { text: '2 → Không uống hoặc rất ít', points: 3 },
    ],
  },
];

module.exports = sbtiQuestionsData;
