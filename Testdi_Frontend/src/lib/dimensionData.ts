export interface SubDimension {
  code: string;
  name: string;
  shortDesc: string;
  meaningHigh: string;
  meaningLow: string;
  highArchetypes: string[]; // Archetypes that score High (3) in this sub-dimension
}

export interface DimensionGroup {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  iconName: string;
  subDimensions: SubDimension[];
}

export const DIMENSION_GROUPS_DATA: DimensionGroup[] = [
  {
    id: "SELF",
    title: "BẢN THÂN (Self)",
    subtitle: "Tự trọng, Tự nhận thức & Mục đích sống",
    desc: "Đo lường mức độ thấu hiểu bản ngã, sự tự tin vào giá trị cá nhân và định hướng mục tiêu trong cuộc sống của bạn.",
    iconName: "User",
    subDimensions: [
      {
        code: "S1",
        name: "S1 — Tự Trọng (Self-Esteem)",
        shortDesc: "Mức độ tin tưởng vào giá trị bản thân",
        meaningHigh: "HIGH (Cao): Tự tin vào giá trị bản thân ở hiện tại, không bị ám ảnh hay tổn thương bởi sự so sánh với người khác.",
        meaningLow: "LOW (Thấp): Thường cảm thấy bất an, hay nghi ngờ bản thân không đủ tốt khi gặp áp lực hoặc so sánh.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "OHNO", "GOGO", "FAKE", "WOCI", "THINK", "SHIT", "POOR", "MONK", "DRUNK"],
      },
      {
        code: "S2",
        name: "S2 — Tự Nhận Thức (Self-Clarity)",
        shortDesc: "Sự rõ ràng về cảm xúc và mong muốn",
        meaningHigh: "HIGH (Cao): Hiểu rõ chính xác cảm xúc, nhu cầu và nguyên nhân phía sau các phản ứng tâm lý của mình.",
        meaningLow: "LOW (Thấp): Cảm xúc dễ bị rối loạn, mông lung không biết chính xác mình đang giận hay vui vì điều gì.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "DIOR", "THANK", "OHNO", "GOGO", "SEXY", "MUMM", "OJBK", "WOCI", "THINK", "SHIT", "POOR", "MONK", "SOLO"],
      },
      {
        code: "S3",
        name: "S3 — Mục Đích Sống (Purpose)",
        shortDesc: "Định hướng giá trị & bản sắc riêng",
        meaningHigh: "HIGH (Cao): Biết rõ điều mình coi trọng, dũng cảm sống là chính mình dù có thể bị người khác phản đối.",
        meaningLow: "LOW (Thấp): Dễ nương theo kỳ vọng của người khác, chưa dám khẳng định con đường riêng của bản thân.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "DIOR", "THANK", "GOGO", "FAKE", "MUMM", "OJBK", "DRUNK"],
      },
    ],
  },
  {
    id: "EMOTIONS",
    title: "CẢM XÚC (Emotions)",
    subtitle: "Gắn kết, Chiều sâu cảm xúc & Tính độc lập",
    desc: "Đánh giá cách bạn tiếp nhận, xử lý và chia sẻ năng lượng cảm xúc với thế giới xung quanh.",
    iconName: "Heart",
    subDimensions: [
      {
        code: "E1",
        name: "E1 — Gắn Kết & Tin Tưởng (Attachment)",
        shortDesc: "Mức độ mở lòng và an tâm trong kết nối",
        meaningHigh: "HIGH (Cao): Cởi mở, dễ tin tưởng và đón nhận tình cảm của người khác một cách tự nhiên.",
        meaningLow: "LOW (Thấp): Hay bất an, nghi ngờ khi ai đó đối xử tốt bất ngờ, e ngại sự gắn kết sâu sắc.",
        highArchetypes: ["DIOR", "FAKE", "OJBK", "MALO", "POOR", "DRUNK"],
      },
      {
        code: "E2",
        name: "E2 — Chiều Sâu Cảm Xúc (Emotional Depth)",
        shortDesc: "Khả năng đồng cảm & thấu cảm tổn thương",
        meaningHigh: "HIGH (Cao): Giàu thấu cảm, sẵn sàng lắng nghe và chia sẻ trải nghiệm tâm hồn sâu sắc.",
        meaningLow: "LOW (Thấp): Giữ khoảng cách an toàn, thích sự xã giao nhẹ nhàng hơn là đào sâu tổn thương.",
        highArchetypes: ["CTRL", "DIOR", "THANK", "OHNO", "GOGO", "FAKE", "OJBK", "IMSB", "DRUNK"],
      },
      {
        code: "E3",
        name: "E3 — Tính Độc Lập Cảm Xúc (Independence)",
        shortDesc: "Khả năng tự chủ tâm trạng cá nhân",
        meaningHigh: "HIGH (Cao): Tự chủ cảm xúc, không để tâm trạng của người khác làm xáo trộn không gian riêng.",
        meaningLow: "LOW (Thấp): Dễ bị ảnh hưởng và cuốn theo năng lượng hoặc thái độ của những người xung quanh.",
        highArchetypes: ["ATMR", "THANK", "MALO", "SOLO", "DEAD", "DRUNK"],
      },
    ],
  },
  {
    id: "ATTITUDE",
    title: "THÁI ĐỘ (Attitude)",
    subtitle: "Thế giới quan, Sự linh hoạt & Ý nghĩa cuộc sống",
    desc: "Đo lường nhãn quan của bạn đối với thử thách, quy tắc ứng xử và tinh thần học hỏi phát triển.",
    iconName: "Compass",
    subDimensions: [
      {
        code: "A1",
        name: "A1 — Thế Giới Quan & Học Hỏi (Worldview)",
        shortDesc: "Thái độ đón nhận lời góp ý & sự vượt trội của người khác",
        meaningHigh: "HIGH (Cao): Coi thử thách là cơ hội, cầu tiến học hỏi từ người giỏi hơn mà không tự ti.",
        meaningLow: "LOW (Thấp): Dễ bị áp lực, nản lòng hoặc phòng thủ khi bị góp ý thẳng thắn.",
        highArchetypes: ["CTRL", "ATMR", "DIOR", "BOSS", "THANK", "GOGO", "MUMM", "OJBK", "MALO", "WOCI", "THINK", "DRUNK"],
      },
      {
        code: "A2",
        name: "A2 — Linh Hoạt Quy Tắc (Rules Flexibility)",
        shortDesc: "Mức độ tuân thủ trật tự vs Sự ngẫu hứng",
        meaningHigh: "HIGH (Cao): Yêu cầu trật tự, kỷ luật cao, mọi thứ phải nằm đúng vị trí và quy chuẩn.",
        meaningLow: "LOW (Thấp): Phóng khoáng, thích sự ngẫu hứng và bứt phá khỏi các khuôn mẫu gò bó.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "OHNO", "GOGO", "SEXY", "POOR", "DRUNK"],
      },
      {
        code: "A3",
        name: "A3 — Tìm Kiếm Ý Nghĩa (Meaning Seeking)",
        shortDesc: "Định hướng tương lai & Khả năng đầu tư dài hạn",
        meaningHigh: "HIGH (Cao): Tin vào khả năng tự quyết định tương lai, sẵn sàng đầu tư dài hạn cho bản thân.",
        meaningLow: "LOW (Thấp): Tập trung tận hưởng hiện tại, thực tế và thích kết quả nhanh chóng.",
        highArchetypes: ["DIOR", "THANK", "SEXY", "LOVR", "MUMM", "FAKE", "SHIT", "MONK", "DRUNK"],
      },
    ],
  },
  {
    id: "ACTION",
    title: "HÀNH ĐỘNG (Action)",
    subtitle: "Động lực, Cách quyết định & Khả năng thực thi",
    desc: "Khảo sát tốc độ phản ứng trước biến cố, phong cách ra quyết định và mức độ kiên trì hoàn thành mục tiêu.",
    iconName: "Zap",
    subDimensions: [
      {
        code: "AC1",
        name: "AC1 — Động Lực Hành Động (Motivation)",
        shortDesc: "Sự chủ động xông xáo trước rủi ro",
        meaningHigh: "HIGH (Cao): Lao vào hành động ngay khi gặp sự cố, chấp nhận rủi ro để bảo vệ mục tiêu.",
        meaningLow: "LOW (Thấp): Thận trọng quan sát, do dự hoặc chờ đợi sự hỗ trợ của tập thể trước khi hành động.",
        highArchetypes: ["CTRL", "BOSS", "THANK", "OHNO", "GOGO", "FAKE", "MALO", "WOCI", "THINK", "SHIT", "POOR", "MONK", "DRUNK"],
      },
      {
        code: "AC2",
        name: "AC2 — Cách Quyết Định (Decision Making)",
        shortDesc: "Tốc độ chốt lựa chọn & Sự quyết đoán",
        meaningHigh: "HIGH (Cao): Dũng cảm quyết đoán nhanh chóng, không bị sa lầy vào sự phân vân.",
        meaningLow: "LOW (Thấp): Cần nhiều thời gian suy tính, cân nhắc kỹ lưỡng mọi khía cạnh.",
        highArchetypes: ["CTRL", "ATMR", "DIOR", "BOSS", "THANK", "OHNO", "GOGO", "SEXY", "OJBK", "DRUNK"],
      },
      {
        code: "AC3",
        name: "AC3 — Khả Năng Thực Thi (Execution)",
        shortDesc: "Tính kỷ luật hoàn thành deadline",
        meaningHigh: "HIGH (Cao): Kỷ luật thực thi mạnh mẽ, luôn chủ động hoàn thành công việc trước hạn.",
        meaningLow: "LOW (Thấp): Có xu hướng trì hoãn, đợi nước đến chân mới nhảy.",
        highArchetypes: ["CTRL", "BOSS", "THANK", "GOGO", "SEXY", "LOVR", "MUMM", "FAKE", "OJBK", "DRUNK"],
      },
    ],
  },
  {
    id: "SOCIAL",
    title: "XÃ HỘI (Social)",
    subtitle: "Chủ động giao tiếp, Ranh giới & Tính chân thật",
    desc: "Đo lường năng lực thiết lập mối quan hệ, khả năng bảo vệ ranh giới cá nhân và mức độ thể hiện bản chất thật.",
    iconName: "Users",
    subDimensions: [
      {
        code: "SO1",
        name: "SO1 — Chủ Động Xã Hội (Social Proactivity)",
        shortDesc: "Mức độ kết nối & Khuấy động đám đông",
        meaningHigh: "HIGH (Cao): Hướng ngoại, chủ động làm quen và tạo năng lượng tích cực cho đám đông.",
        meaningLow: "LOW (Thấp): Hướng nội, thích quan sát từ xa, cẩn trọng khi bước vào nhóm mới.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "THANK", "OHNO", "GOGO", "LOVR", "MUMM", "FAKE", "OJBK", "DRUNK"],
      },
      {
        code: "SO2",
        name: "SO2 — Ranh Giới Cá Nhân (Boundaries)",
        shortDesc: "Khả năng bảo vệ không gian & Quyền lợi riêng",
        meaningHigh: "HIGH (Cao): Thẳng thắn thiết lập ranh giới, dám lên tiếng bảo vệ quyền lợi cá nhân.",
        meaningLow: "LOW (Thấp): Dễ nhượng bộ, ngại xung đột nên đôi khi chấp nhận chịu thiệt.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "GOGO", "OJBK", "MALO", "SOLO", "DRUNK"],
      },
      {
        code: "SO3",
        name: "SO3 — Tính Chân Thật (Authenticity)",
        shortDesc: "Sự nhất quán bản chất vs Sự linh hoạt ứng biến",
        meaningHigh: "HIGH (Cao): Sống nhất quán với bản chất thật, không diễn kịch hay thay đổi vỏ bọc.",
        meaningLow: "LOW (Thấp): Khéo léo ứng biến, linh hoạt thay đổi thái độ theo từng đối tượng.",
        highArchetypes: ["CTRL", "GOGO", "MALO", "JOKER", "ZZZZ", "SOLO", "DEAD", "DRUNK"],
      },
    ],
  },
];
