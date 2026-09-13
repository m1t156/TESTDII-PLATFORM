export interface SubDimension {
  code: string;
  name: string;
  shortDesc: string;
  detailedDefinition: string;
  exampleScenario: string;
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
    subtitle: "Tự trọng, Tự nhận thức & Định hướng Mục tiêu",
    desc: "Khía cạnh Bản Thân đo lường mức độ vững chắc của cái tôi, khả năng tự thấu hiểu tâm lý cá nhân và lòng dũng cảm sống đúng với bản sắc riêng mà không bị lung lay bởi ngoại cảnh.",
    iconName: "User",
    subDimensions: [
      {
        code: "S1",
        name: "S1 — Tự Trọng (Self-Esteem)",
        shortDesc: "Mức độ tin tưởng vào giá trị cốt lõi của bản thân",
        detailedDefinition: "S1 đánh giá sự kiên định của niềm tin cá nhân vào giá trị bản thân. Người có S1 cao luôn tự tin ở hiện tại, không dễ bị lung lay hay cảm thấy tự ti khi đứng trước những người thành công hơn.",
        exampleScenario: "Khi gặp người yêu cũ của đối phương vừa đẹp vừa giàu, người có S1 cao sẽ mỉm cười tự tin 'mình có nét quyến rũ riêng', còn S1 thấp sẽ dễ rơi vào trạng thái overthinking lo sợ mình không đủ tốt.",
        meaningHigh: "HIGH (Cao): Tự tin tuyệt đối vào giá trị bản thân ở hiện tại, không bị ám ảnh hay tổn thương bởi sự so sánh áp lực đồng lứa.",
        meaningLow: "LOW (Thấp): Thường cảm thấy bất an, hay hoài nghi năng lực của chính mình khi gặp áp lực hoặc bị so sánh với người khác.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "OHNO", "GOGO", "FAKE", "WOCI", "THINK", "SHIT", "POOR", "MONK", "DRUNK"],
      },
      {
        code: "S2",
        name: "S2 — Tự Nhận Thức (Self-Clarity)",
        shortDesc: "Sự rõ ràng về cảm xúc, nhu cầu & động lực nội tâm",
        detailedDefinition: "S2 phản ánh khả năng 'đọc vị' chính mình. Người có S2 cao biết rõ tại sao mình vui, buồn, giận hay lo lắng, trong khi S2 thấp thường cảm thấy tâm trạng mình như một chiếc remote bị loạn kênh.",
        exampleScenario: "Giữa cuộc cãi nhau căng thẳng, người có S2 cao dừng lại 3 giây và biết rõ: 'Mình đang giận vì đối phương không tôn trọng ý kiến mình', trong khi S2 thấp chỉ thấy bực bội chung chung và muốn nổi điên.",
        meaningHigh: "HIGH (Cao): Hiểu rõ chính xác cảm xúc, nhu cầu nội tâm và nguyên nhân phía sau mọi phản ứng tâm lý của mình.",
        meaningLow: "LOW (Thấp): Cảm xúc dễ bị rối loạn, mông lung không biết chính xác mình thực sự mong muốn điều gì.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "DIOR", "THANK", "OHNO", "GOGO", "SEXY", "MUMM", "OJBK", "WOCI", "THINK", "SHIT", "POOR", "MONK", "SOLO"],
      },
      {
        code: "S3",
        name: "S3 — Mục Đích Sống (Purpose)",
        shortDesc: "Tầm nhìn giá trị & Sự dũng cảm khẳng định bản sắc",
        detailedDefinition: "S3 đo lường mức độ cam kết với hệ giá trị riêng. Người có S3 cao thà bị ghét vì là chính mình còn hơn được yêu quý vì là bản sao của người khác.",
        exampleScenario: "Khi cả hội rủ nhau làm một ngành nghề thời thượng nhưng bạn biết rõ mình đam mê nghệ thuật, người S3 cao sẵn sàng chọn con đường riêng, còn S3 thấp dễ nương theo lựa chọn an toàn của số đông.",
        meaningHigh: "HIGH (Cao): Định hình rõ ràng điều mình coi trọng, dũng cảm sống hết mình vì mục tiêu dù có bị phản đối.",
        meaningLow: "LOW (Thấp): Dễ nương theo kỳ vọng của người khác, chưa dám bứt phá để khẳng định con đường riêng.",
        highArchetypes: ["BOSS", "CTRL", "ATMR", "DIOR", "THANK", "GOGO", "FAKE", "MUMM", "OJBK", "DRUNK"],
      },
    ],
  },
  {
    id: "EMOTIONS",
    title: "CẢM XÚC (Emotions)",
    subtitle: "Gắn kết, Chiều sâu tâm hồn & Tính tự chủ cảm xúc",
    desc: "Khía cạnh Cảm Xúc khảo sát cách bạn tiếp nhận, xử lý và chia sẻ nguồn năng lượng tâm hồn với những người xung quanh trong các mối quan hệ tình cảm lẫn xã hội.",
    iconName: "Heart",
    subDimensions: [
      {
        code: "E1",
        name: "E1 — Gắn Kết & Tin Tưởng (Attachment)",
        shortDesc: "Mức độ cởi mở & sự an tâm khi xây dựng kết nối",
        detailedDefinition: "E1 phản ánh kiểu gắn kết tâm lý. Người có E1 cao dễ dàng đặt niềm tin và đón nhận tình cảm chân thành, trong khi E1 thấp hay bật chế độ phòng thủ nghi ngờ khi ai đó đối xử quá tốt.",
        exampleScenario: "Được một người mới quen tặng quà bất ngờ, người E1 cao vui vẻ đón nhận và cảm ơn, còn người E1 thấp lập tức hoài nghi: 'Ủa người này đang có mục đích gì phía sau đây ta?'.",
        meaningHigh: "HIGH (Cao): Cởi mở, dễ tin tưởng và sẵn sàng mở lòng đón nhận tình cảm chân thành của người khác.",
        meaningLow: "LOW (Thấp): Bất an nghi ngờ khi ai đó đối xử tốt bất ngờ, e ngại sự gắn kết sâu sắc vì sợ tổn thương.",
        highArchetypes: ["DIOR", "FAKE", "OJBK", "MALO", "POOR", "DRUNK"],
      },
      {
        code: "E2",
        name: "E2 — Chiều Sâu Cảm Xúc (Emotional Depth)",
        shortDesc: "Khả năng đồng cảm & thấu cảm tâm hồn người khác",
        detailedDefinition: "E2 đo lường mức độ tinh tế trong việc cảm nhận nỗi đau hay niềm vui của người khác. Người E2 cao có tâm hồn nhạy cảm, dễ rưng rưng trước những câu chuyện xúc động.",
        exampleScenario: "Khi bạn thân tâm sự về một tổn thương quá quá, người E2 cao sẽ lắng nghe chăm chú và khóc cùng bạn, còn người E2 thấp sẽ đưa ra lời khuyên thực tế ngắn gọn.",
        meaningHigh: "HIGH (Cao): Giàu thấu cảm, sẵn sàng lắng nghe và chia sẻ những trải nghiệm tâm hồn sâu sắc nhất.",
        meaningLow: "LOW (Thấp): Giữ khoảng cách an toàn, ưu tiên sự xã giao nhẹ nhàng hơn là đào sâu vào tổn thương.",
        highArchetypes: ["CTRL", "DIOR", "THANK", "OHNO", "GOGO", "FAKE", "OJBK", "IMSB", "DRUNK"],
      },
      {
        code: "E3",
        name: "E3 — Tính Độc Lập Cảm Xúc (Independence)",
        shortDesc: "Khả năng tự chủ & bảo vệ năng lượng tâm trí cá nhân",
        detailedDefinition: "E3 đánh giá mức độ tự chủ tâm trạng. Người có E3 cao giữ được sự bình tĩnh độc lập, không để cảm xúc tiêu cực của người xung quanh lây lan sang mình.",
        exampleScenario: "Đang ngồi trong phòng làm việc mà đồng nghiệp xung quanh hoảng loạn than vắn thở dài, người E3 cao vẫn tập trung giữ vững năng lượng tích cực của mình.",
        meaningHigh: "HIGH (Cao): Tự chủ cảm xúc tuyệt vời, giữ vững không gian tâm trí riêng trước mọi biến động xung quanh.",
        meaningLow: "LOW (Thấp): Dễ bị cuốn theo và chịu ảnh hưởng trực tiếp bởi tâm trạng tiêu cực của người khác.",
        highArchetypes: ["ATMR", "THANK", "MALO", "SOLO", "DEAD", "DRUNK"],
      },
    ],
  },
  {
    id: "ATTITUDE",
    title: "THÁI ĐỘ (Attitude)",
    subtitle: "Thế giới quan, Sự linh hoạt & Tìm kiếm ý nghĩa",
    desc: "Khía cạnh Thái Độ đo lường nhãn quan phản ứng trước thử thách, mức độ tuân thủ quy tắc ứng xử và tinh thần chủ động đầu tư cho sự phát triển dài hạn.",
    iconName: "Compass",
    subDimensions: [
      {
        code: "A1",
        name: "A1 — Thế Giới Quan & Học Hỏi (Worldview)",
        shortDesc: "Thái độ đón nhận lời góp ý & sự vượt trội của người khác",
        detailedDefinition: "A1 thể hiện tư duy cầu tiến (Growth Mindset). Người có A1 cao coi lời chê hay sự giỏi giang của người khác là bài học quý giá, trong khi A1 thấp dễ cảm thấy bị tự ti hoặc phòng thủ.",
        exampleScenario: "Đăng một bài vẽ lên mạng và bị góp ý nét vẽ chưa chuẩn, người A1 cao thả tim cảm ơn và sửa lại, còn A1 thấp sẽ thấy khó chịu và muốn xóa bài ngay.",
        meaningHigh: "HIGH (Cao): Coi thử thách và lời góp ý là cơ hội phát triển, chủ động học hỏi từ những người giỏi hơn.",
        meaningLow: "LOW (Thấp): Dễ bị áp lực, chạnh lòng hoặc bật chế độ phòng thủ khi bị góp ý thẳng thắn.",
        highArchetypes: ["CTRL", "ATMR", "DIOR", "BOSS", "THANK", "GOGO", "MUMM", "OJBK", "MALO", "WOCI", "THINK", "DRUNK"],
      },
      {
        code: "A2",
        name: "A2 — Linh Hoạt Quy Tắc (Rules Flexibility)",
        shortDesc: "Mức độ tuân thủ trật tự vs Sự phóng khoáng ngẫu hứng",
        detailedDefinition: "A2 phân định giữa người thích trật tự khuôn khổ và người thích bứt phá ngẫu hứng. Người A2 cao yêu cầu sự chuẩn chỉnh kỷ luật, trong khi A2 thấp mê sự tự do phi quy tắc.",
        exampleScenario: "Sắp xếp phòng ngủ, người A2 cao muốn mọi cuốn sách phải thẳng hàng theo kích thước, còn người A2 thấp thấy sự bừa bộn có chủ đích mới là nghệ thuật!",
        meaningHigh: "HIGH (Cao): Yêu cầu trật tự, kỷ luật cao, mọi thứ phải nằm đúng quy chuẩn và kế hoạch.",
        meaningLow: "LOW (Thấp): Phóng khoáng, thích ngẫu hứng và dũng cảm bứt phá khỏi các khuôn mẫu gò bó.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "OHNO", "GOGO", "SEXY", "POOR", "DRUNK"],
      },
      {
        code: "A3",
        name: "A3 — Tìm Kiếm Ý Nghĩa (Meaning Seeking)",
        shortDesc: "Định hướng tương lai & Khả năng đầu tư dài hạn",
        detailedDefinition: "A3 đo lường tầm nhìn sứ mệnh. Người A3 cao luôn suy nghĩ cho tương lai 5-10 năm tới và sẵn sàng đầu tư công sức dài hạn, người A3 thấp thích tận hưởng niềm vui hiện tại.",
        exampleScenario: "Bất ngờ nhận được khoản tiền thưởng lớn, người A3 cao trích ngay 50% đăng ký khóa học nâng cao kỹ năng, còn người A3 thấp chốt đơn ngay chiếc tai nghe xịn xò để chill!",
        meaningHigh: "HIGH (Cao): Tin vào khả năng tự làm chủ tương lai, sẵn sàng đầu tư dài hạn cho sự phát triển bản thân.",
        meaningLow: "LOW (Thấp): Thực tế, tập trung tận hưởng niềm vui hiện tại và thích những kết quả nhanh chóng.",
        highArchetypes: ["DIOR", "THANK", "SEXY", "LOVR", "MUMM", "FAKE", "SHIT", "MONK", "DRUNK"],
      },
    ],
  },
  {
    id: "ACTION",
    title: "HÀNH ĐỘNG (Action)",
    subtitle: "Động lực bứt phá, Tốc độ quyết định & Tính thực thi",
    desc: "Khía cạnh Hành Động phản ánh tốc độ phản ứng trước cơ hội và sự cố, phong cách đưa ra lựa chọn và độ lì lợm hoàn thành mục tiêu đến cùng.",
    iconName: "Zap",
    subDimensions: [
      {
        code: "AC1",
        name: "AC1 — Động Lực Hành Động (Motivation)",
        shortDesc: "Sự chủ động xông xáo trước thử thách & rủi ro",
        detailedDefinition: "AC1 đánh giá bản năng phản ứng. Người có AC1 cao lập tức lao vào hành động ngay khi gặp sự cố, trong khi AC1 thấp sẽ đứng lại quan sát và tính toán rủi ro kỹ lưỡng.",
        exampleScenario: "Thấy một dự án mới có nguy cơ thất bại nhưng phần thưởng cực lớn, người AC1 cao đăng ký tham gia ngay, còn AC1 thấp sẽ chờ xem có ai làm trước không.",
        meaningHigh: "HIGH (Cao): Chủ động xông xáo, dũng cảm chấp nhận rủi ro để tiên phong chinh phục mục tiêu.",
        meaningLow: "LOW (Thấp): Thận trọng quan sát, tính toán kỹ lưỡng hoặc chờ đợi sự hỗ trợ trước khi bắt đầu.",
        highArchetypes: ["CTRL", "BOSS", "THANK", "OHNO", "GOGO", "FAKE", "MALO", "WOCI", "THINK", "SHIT", "POOR", "MONK", "DRUNK"],
      },
      {
        code: "AC2",
        name: "AC2 — Cách Quyết Định (Decision Making)",
        shortDesc: "Tốc độ chốt lựa chọn & Khả năng dứt quát",
        detailedDefinition: "AC2 khảo sát sự quyết đoán. Người AC2 cao chốt lựa chọn nhanh như chớp và không hối tiếc, người AC2 thấp cần cân đo đếm từng phương án.",
        exampleScenario: "Vào quán ăn nhìn menu 20 món, người AC2 cao chốt món trong 10 giây, còn AC2 thấp phân vân 15 phút vẫn chưa biết nên ăn cơm hay phở!",
        meaningHigh: "HIGH (Cao): Dứt quát, quyết đoán nhanh chóng, không bị sa lầy vào sự phân vân do dự.",
        meaningLow: "LOW (Thấp): Cần nhiều thời gian suy tính, cân nhắc tỉ mỉ mọi khía cạnh trước khi chốt.",
        highArchetypes: ["CTRL", "ATMR", "DIOR", "BOSS", "THANK", "OHNO", "GOGO", "SEXY", "OJBK", "DRUNK"],
      },
      {
        code: "AC3",
        name: "AC3 — Khả Năng Thực Thi (Execution)",
        shortDesc: "Tính kỷ luật hoàn thành deadline & Độ kiên trì",
        detailedDefinition: "AC3 đo lường mức độ chống trì hoãn. Người AC3 cao luôn hoàn thành công việc sớm hơn hạn định, người AC3 thấp là 'chiến thần 23h59' nước đến chân mới nhảy.",
        exampleScenario: "Hạn nộp bài là 12h đêm, người AC3 cao nộp bài từ tuần trước và đang thong thả xem phim, người AC3 thấp bật cà phê ngồi gõ máy tính thần tốc lúc 23h50!",
        meaningHigh: "HIGH (Cao): Kỷ luật thực thi mạnh mẽ, luôn chủ động hoàn thành mọi mục tiêu đúng hoặc trước hạn.",
        meaningLow: "LOW (Thấp): Có xu hướng trì hoãn, đợi áp lực thời gian sát nút mới bùng nổ năng lượng.",
        highArchetypes: ["CTRL", "BOSS", "THANK", "GOGO", "SEXY", "LOVR", "MUMM", "FAKE", "OJBK", "DRUNK"],
      },
    ],
  },
  {
    id: "SOCIAL",
    title: "XÃ HỘI (Social)",
    subtitle: "Chủ động kết nối, Ranh giới cá nhân & Tính chân thật",
    desc: "Khía cạnh Xã Hội đánh giá năng lực thiết lập mạng lưới quan hệ, sự kiên quyết bảo vệ không gian riêng và mức độ thể hiện bản chất thật trước đám đông.",
    iconName: "Users",
    subDimensions: [
      {
        code: "SO1",
        name: "SO1 — Chủ Động Xã Hội (Social Proactivity)",
        shortDesc: "Mức độ kết nối & Khuấy động không khí đám đông",
        detailedDefinition: "SO1 thể hiện năng lượng hướng ngoại. Người SO1 cao là chiếc 'loa phát thanh' làm quen khắp nơi, người SO1 thấp thích quan sát lặng lẽ từ xa.",
        exampleScenario: "Tham gia buổi tiệc lớp mới, người SO1 cao chủ động cầm ly nước đi làm quen 10 người, còn người SO1 thấp tìm một góc bấm điện thoại quan sát.",
        meaningHigh: "HIGH (Cao): Hướng ngoại, chủ động kết nối và lan tỏa năng lượng tích cực cho đám đông.",
        meaningLow: "LOW (Thấp): Hướng nội, thích quan sát lặng lẽ, cẩn trọng khi bước vào môi trường xa lạ.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "THANK", "OHNO", "GOGO", "LOVR", "MUMM", "FAKE", "OJBK", "DRUNK"],
      },
      {
        code: "SO2",
        name: "SO2 — Ranh Giới Cá Nhân (Boundaries)",
        shortDesc: "Khả năng bảo vệ không gian & Quyền lợi riêng",
        detailedDefinition: "SO2 đo lường sự kiên quyết vạch ranh giới. Người SO2 cao sẵn sàng lên tiếng 'KHÔNG' khi bị xâm phạm quyền lợi, người SO2 thấp dễ nhượng bộ vì sợ mất lòng.",
        exampleScenario: "Mượn đồ mà không xin phép, người SO2 cao thẳng thắn đòi lại và nhắc nhở, người SO2 thấp im lặng khó chịu trong lòng nhưng không dám nói.",
        meaningHigh: "HIGH (Cao): Thiết lập ranh giới rõ ràng, dũng cảm lên tiếng bảo vệ quyền lợi và không gian cá nhân.",
        meaningLow: "LOW (Thấp): Dễ nhượng bộ, e ngại xung đột nên đôi khi chấp nhận chịu thiệt về mình.",
        highArchetypes: ["CTRL", "ATMR", "BOSS", "GOGO", "OJBK", "MALO", "SOLO", "DRUNK"],
      },
      {
        code: "SO3",
        name: "SO3 — Tính Chân Thật (Authenticity)",
        shortDesc: "Sự nhất quán bản sắc vs Sự khéo léo ứng biến",
        detailedDefinition: "SO3 phân định giữa tính thẳng thắn bẩm sinh và sự linh hoạt tắc kè hoa. Người SO3 cao luôn nhất quán 1 bản mặt, người SO3 thấp khéo léo đổi 'mặt nạ' theo từng đối tượng.",
        exampleScenario: "Gặp sếp khó tính, người SO3 cao vẫn giữ nguyên phong cách thẳng thắn thường ngày, người SO3 thấp nhanh chóng điều chỉnh giọng điệu vô cùng khéo léo.",
        meaningHigh: "HIGH (Cao): Sống nhất quán với bản chất thật, không diễn kịch hay thay đổi vỏ bọc.",
        meaningLow: "LOW (Thấp): Khéo léo ứng biến, linh hoạt thay đổi thái độ và phong cách theo từng đối tượng.",
        highArchetypes: ["CTRL", "GOGO", "MALO", "JOKER", "ZZZZ", "SOLO", "DEAD", "DRUNK"],
      },
    ],
  },
];
