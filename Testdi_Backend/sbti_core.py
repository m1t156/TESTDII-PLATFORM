"""
SBTI Hybrid - Personality Archetype Matching
============================================
Design: Entertainment-first personality typing using curated archetypes + ranked matching
Approach: Normalized dimension scoring → Simple euclidean similarity (honest, fast, validated)

NOT statistical inference. Think: Spotify Discover Weekly, not psychological assessment.
"""

import numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import json

# ============================================================================
# DIMENSION DEFINITIONS
# ============================================================================

DIMENSION_NAMES = [
    "S1_SelfEsteem", "S2_SelfClarity", "S3_Purpose",
    "E1_Attachment", "E2_EmotionalDepth", "E3_Independence",
    "A1_Worldview", "A2_RulesFlex", "A3_Meaning",
    "Ac1_Motivation", "Ac2_Decision", "Ac3_Execution",
    "So1_SocialProactivity", "So2_Boundaries", "So3_Authenticity"
]

DIMENSION_GROUPS = {
    "Bản Thân": [0, 1, 2],           # Self
    "Cảm Xúc": [3, 4, 5],           # Emotion
    "Thái Độ": [6, 7, 8],           # Worldview
    "Hành Động": [9, 10, 11],       # Action
    "Xã Hội": [12, 13, 14]          # Social
}

# ============================================================================
# ARCHETYPES: 27 Curated Personality Types (from Demo.ipynb)
# ============================================================================
# Vectors use 1/2/3 scale (L/M/H) to match reference engine.mjs
# Original Demo.ipynb uses 0/1/2, converted here by adding 1 to each value

ARCHETYPES = {
    "CTRL":  {"vector": [3,3,3,2,3,2,3,3,2,3,3,3,3,2,3], "desc": "The Controller - Trùm Kiếm Soát"},
    "ATMR":  {"vector": [3,3,3,2,2,3,3,3,2,2,3,2,3,2,1], "desc": "ATM-er - Cây ATM Biết đi"},
    "DIOR":  {"vector": [2,3,2,3,3,2,3,2,3,2,3,2,1,2,1], "desc": "Dior-s - Kẻ Thất Bại"},
    "BOSS":  {"vector": [3,3,3,2,3,2,3,3,2,3,3,3,3,2,1], "desc": "The Boss - Thủ Lĩnh"},
    "THANK": {"vector": [2,3,2,2,3,3,3,2,3,3,3,2,3,2,1], "desc": "THAN-K - Người Biết Ơn"},
    "OHNO":  {"vector": [3,3,1,1,3,2,1,3,2,3,3,2,3,2,1], "desc": "OH-NO - Người OH-NO"},
    "GOGO":  {"vector": [3,3,2,2,3,2,3,3,2,3,3,3,3,2,3], "desc": "GOGO - Người Go-Go"},
    "SEXY":  {"vector": [2,3,2,2,2,1,2,3,3,2,3,3,2,1,2], "desc": "SEXY - Người Hấp Dẫn"},
    "LOVR":  {"vector": [2,1,2,1,2,1,3,1,2,3,1,3,3,1,2], "desc": "LOVE-R - Người Lãng Mạn"},
    "MUMM":  {"vector": [2,3,2,3,2,1,3,2,3,1,3,3,3,1,1], "desc": "MUM - Mẹ"},
    "FAKE":  {"vector": [3,1,2,3,3,1,2,1,3,3,1,3,3,1,2], "desc": "FAKE - Người Giả"},
    "OJBK":  {"vector": [2,3,2,3,3,3,3,2,1,1,3,3,3,3,1], "desc": "OJBK - Người Tùy Tiện"},
    "MALO":  {"vector": [2,1,2,3,2,3,3,1,2,3,1,2,1,3,2], "desc": "MALO - Khi Nho"},
    "JOKER": {"vector": [1,1,2,1,2,1,1,3,1,1,1,1,3,1,3], "desc": "JOKE-R - Người Hề"},
    "WOCI":  {"vector": [3,3,1,2,3,2,3,3,2,3,2,3,1,2,2], "desc": "WOC! - Người WOC!"},
    "THINK": {"vector": [3,3,1,2,3,2,3,1,2,3,2,3,1,2,2], "desc": "THIN-K - Người Suy Tư"},
    "SHIT":  {"vector": [3,3,1,2,1,2,1,3,3,3,2,3,1,2,2], "desc": "SHIT - Người Hận Thù"},
    "ZZZZ":  {"vector": [2,2,1,3,1,2,1,3,1,3,3,1,1,2,3], "desc": "ZZZZ - Người Ma"},
    "POOR":  {"vector": [3,3,1,3,1,2,1,3,2,3,3,3,1,2,1], "desc": "POOR - Người Nghèo"},
    "MONK":  {"vector": [3,3,1,1,1,2,1,1,3,3,3,1,1,2,3], "desc": "MONK - Nhà Sư"},
    "IMSB":  {"vector": [1,1,2,1,3,3,1,1,1,1,1,1,3,1,3], "desc": "IMSB - Người Ngu"},
    "SOLO":  {"vector": [1,3,1,1,1,3,1,2,1,1,3,1,1,3,3], "desc": "SOLO - Người Cô Đơn"},
    "FUCK":  {"vector": [2,1,1,1,2,1,1,1,3,3,1,1,3,1,2], "desc": "FUCK - Người Hoang Dã"},
    "DEAD":  {"vector": [1,1,1,1,1,3,1,3,1,1,1,1,1,2,3], "desc": "DEAD - Kẻ Chết"},
    "IMFW":  {"vector": [1,1,2,1,2,1,1,2,1,1,1,1,3,1,1], "desc": "IMFW - Người Vô Dụng"},
    "DRUNK": {"vector": [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], "desc": "DRUNK - Người Say Xỉn (Hidden)"},
    "HHHH":  {"vector": [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], "desc": "HHHH - Người Giả Chết (Fallback)"},
}


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class TestResult:
    """Immutable result container"""
    main_type: str
    score: float
    user_vector: np.ndarray
    top_matches: List[Dict]
    dimension_analysis: Dict
    confidence: str  # "HIGH", "MEDIUM", "LOW"
    method: str
    timestamp: str


# ============================================================================
# SBTI TEST ENGINE
# ============================================================================

class SBTITest:
    """Core personality test with questionnaire"""

    def __init__(self):
        self.questions = self._load_questions()

    def _load_questions(self) -> List[Dict]:
        """All 30 test questions (unchanged from original)"""
        return [
            {"dim":0, "q":"Trong chuyện tình cảm, tôi thường cảm thấy mình không đủ tốt so với những người yêu cũ của người ấy.", "opts":["Đúng vậy, tôi hay bị ám ảnh bởi điều đó.", "Thỉnh thoảng tôi mới nghĩ vậy khi mọi thứ không suôn sẻ.", "Không, tôi tin vào giá trị của mình ở hiện tại."]},
            {"dim":0, "q":"Người yêu bạn rủ bạn về ra mắt gia đình, nhưng bạn biết gia đình họ có điều kiện và rất khó tính.", "opts":["Tôi tự tin mình sẽ ghi điểm.", "Tôi lo một chút, chuẩn bị trước vài thứ để tự tin hơn.", "Sợ mình không đủ tốt, kiểu gì cũng bị chê."]},
            {"dim":1, "q":"Tôi là ai? Tôi thích gì? Tôi giỏi gì? Tôi muốn gì? Đừng hỏi tôi. Mỗi sáng thức dậy, tôi mất 10 phút để nhớ ra hôm nay mình nên vui hay buồn. Cảm xúc của tôi như một cái remote bị loạn kênh — đang khóc vì một con chó bị lạc, rồi lại cười phá lên vì video làm từ AI 'chủ cây xăng và cục lửa bé bỏng ngốk nghếch'. Người yêu cũ còn bảo tôi khó hiểu. Tôi bảo: 'Ừ, tao còn chả hiểu nổi tao mà.'", "opts":["Ủa, sao giống mình thế...", "Mình đang đọc cái * thế này ... ?", "Tôi có như này đâu !?"]},
            {"dim":1, "q":"Bạn và người yêu đang cãi nhau. Giữa lúc căng thẳng, bạn có biết chính xác mình đang giận vì điều gì không?", "opts":["Biết vì sao mình giận và nói rõ", "Tôi cần vài phút im lặng để tự hỏi", "Chỉ thấy khó chịu và muốn người kia im mồm luôn"]},
            {"dim":2, "q":"Nếu ai cũng biết 'kệ' nhau để sống thoải mái, mục tiêu lớn nhất của bạn là gì?", "opts":["Có lẽ cứ sống theo cách người khác mong đợi.", "Chưa dám khẳng định điều gì là quan trọng nhất với mình.", "Tôi biết rõ mình coi trọng điều gì, và tôi sẽ sống hết mình vì điều đó."]},
            {"dim":2, "q":"Tôi thà bị ghét vì là chính mình, còn hơn được yêu quý vì là bản sao của ai khác.", "opts":["Đồng ý", "Trung lập", "Không đồng ý"]},
            {"dim":3, "q":"Tôi thường cảm thấy bất an và nghi ngờ khi ai đó đối xử tốt với mình một cách bất ngờ.", "opts":["Đồng ý", "Trung lập", "Không đồng ý"]},
            {"dim":3, "q":"Trong các lần làm bài tập nhóm, khi gặp bất đồng quan điểm thì bạn sẽ làm gì?", "opts":["Cãi thắng bằng được!", "Bảo vệ luận điểm của mình và không làm quá mọi chuyện.", "Thôi im lặng cho yên, sợ cãi nhau xong nghỉ chơi luôn thì sao?!"]},
            {"dim":4, "q":"Bạn mới quen một người. Họ tâm sự với bạn về một tổn thương sâu sắc trong quá khứ.", "opts":["Gì vậy ta, mới quen á má!", "Bạn lắng nghe chăm chú, an ủi họ nhưng vẫn giữ khoảng cách.", "Đồng cảm và chia sẻ ngay những trải nghiệm tương tự của bản thân."]},
            {"dim":4, "q":"Tôi thấy khó mở lòng và thường mất nhiều thời gian mới thực sự tin tưởng ai đó.", "opts":["Đồng ý.", "Trung lập.", "Không đồng ý."]},
            {"dim":5, "q":"Người yêu bạn hào hứng muốn kể cho bạn nghe về một ngày dài của họ. Bạn sẽ?", "opts":["Dừng việc đang làm, tập trung lắng nghe.", "Vừa nghe vừa làm việc của mình, thỉnh thoảng gật gù.", "Từ chối khéo vì đang bận việc riêng."]},
            {"dim":5, "q":"Khi mới chuyển lớp, đã có một người bạn ra bắt chuyện với tôi một cách rất thân thiện.", "opts":["Nói chuyện lại như người nhà.", "Chào hỏi xã giao.", "Im lặng nào, thầy đang mewing !!"]},
            {"dim":6, "q":"Bạn thấy một người cùng tuổi bạn có kỹ năng tốt hơn, đang kiếm tiền / làm việc tốt hơn bạn:", "opts":["Bạn nghĩ họ có nền tảng hoặc xuất phát điểm tốt hơn nên mình có cố cũng khó theo kịp", "Bạn nghĩ mỗi người có hoàn cảnh và hướng đi khác nhau", "Tìm hiểu xem họ có bí quyết hay cách làm gì khác mình"]},
            {"dim":6, "q":"Bạn đăng một thứ bạn làm (vẽ tranh, blog, video…), và có người vào góp ý khá thẳng:", "opts":["Tiếp thu ý kiến và cân nhắc chỉnh sửa", "Đọc xong để đó, không suy nghĩ nhiều.", "Thấy khó chịu và muốn gỡ bài xuống."]},
            {"dim":7, "q":"Cách bạn sắp xếp không gian sống hoặc phòng riêng của mình:", "opts":["Sống trong sự hỗn độn có chủ đích", "Tổng quan gọn gàng, nhưng đôi khi có những góc bừa bộn riêng", "Mọi thứ phải nằm đúng vị trí của nó"]},
            {"dim":7, "q":"Sắp tới bạn có một chuyến du lịch nhưng bạn chưa có lịch trình cụ thể.", "opts":["Đã lên chi tiết từng khung giờ", "Lên vài điểm chính muốn đến, còn lại tùy hứng", "Đi rồi tính, tới đâu hay tới đó mới vui."]},
            {"dim":8, "q":"Nếu có một nút bấm cho phép bạn xem trước tương lai nhưng không thể thay đổi, bạn sẽ làm gì?", "opts":["Bấm luôn, xem khi nào trúng số", "Suy nghĩ một hồi...", "Không bấm, vì tương lai là của mình là tự viết"]},
            {"dim":8, "q":"Bạn bất ngờ nhận được một khoản tiền từ trên trời rơi xuống. Phản ứng đầu tiên của bạn là gì?", "opts":["Tận dụng làm đòn bẩy. Đầu tư ngay vào một khóa học", "Cất đi trước rồi tính sau", "Chốt ngay cho bản thân một món đồ mình đã tia lâu nay"]},
            {"dim":9, "q":"Bạn đang đi trên phố thì thấy một chiếc xe hơi đang lao xuống dốc, phía dưới là một em bé đang chơi.", "opts":["Hét lên, hy vọng có người khác đến cứu.", "Vừa chạy vừa tính toán cách đẩy em bé ra", "Lao ngay vào, chấp nhận rủi ro"]},
            {"dim":9, "q":"Một con quỷ xuất hiện trước mặt bạn và thì thầm: 'Cho tao một phần cơ thể của mày, tao sẽ cho mày sức mạnh để trả thù tất cả những ai đã giẫm đạp lên mày.'", "opts":["Điên à? Mất một phần cơ thể thì còn gì là mình nữa.", "Từ từ, để coi nó lấy phần nào đã. Với lại trả thù ai đây nhỉ?.", "Lấy đi! Chỉ cần tao mạnh hơn tất cả!"]},
            {"dim":10,"q":"Bạn bỗng nhận ra bài test này đang đo lường chính sự do dự của bạn. Bạn càng do dự, điểm càng thấp. Bạn sẽ:", "opts":["Biết rồi, chọn luôn!", "Hay thật đấy. Để tao cân nhắc thêm một chút...", "Chết rồi. Giờ biết chọn sao đây?!"]},
            {"dim":10,"q":"Bạn và nhóm bạn bị kẹt trong một tòa nhà đầy zombie. Có 3 lối thoát: cửa chính (ồn ào, dễ thấy), tầng hầm (tối, không biết có gì), và mái nhà (phải leo cao, nguy hiểm). Bạn phải quyết định ngay.", "opts":["Đứng im, chờ xem ai trong nhóm quyết định trước", "Đánh giá nhanh tình hình", "Hô to 'Lên mái nhà!' và lao đi trước."]},
            {"dim":11,"q":"23h đêm, tự dưng đứa bạn nhắc mai là hạn deadline quan trọng. Bạn làm gì?", "opts":["Hoảng loạn, tìm cách gia hạn deadline.", "Cà phê, bật nhạc lofi, ngồi vào bàn và làm tới sáng", "Bình tĩnh, vì đã làm xong từ tuần trước"]},
            {"dim":11,"q":"Tôi thường trì hoãn những việc quan trọng cho đến khi không thể trì hoãn được nữa.", "opts":["Không đồng ý", "Trung lập", "Đồng ý"]},
            {"dim":12,"q":"Khi tham gia 1 nhóm mới hoặc gặp người lạ, bạn sẽ:", "opts":["E ngại, thường đứng ngoài quan sát.", "Tùy người. Hợp thì chơi.", "Bạn của bạn cũng là bạn tôi!"]},
            {"dim":12,"q":"Trong một nhóm chat đông người đang tranh luận sôi nổi, vai trò của bạn là gì?", "opts":["Để chế độ im lặng", "Thỉnh thoảng vào thả icon", "Chiến thần spam tin nhắn"]},
            {"dim":13,"q":"Một người bạn tự ý lấy đồ của bạn mà không xin phép, bạn sẽ:", "opts":["Thấy khó chịu trong lòng, nhưng vẫn im lặng", "Nhắc nhở họ khéo và xin lại đồ.", "Tỏ thái độ gay gắt, giật lại đồ"]},
            {"dim":13,"q":"Người yêu bạn yêu cầu bạn hạn chế chơi với bạn thân khác giới. Bạn sẽ:", "opts":["Khẳng định rằng bạn bè và tình yêu là hai phạm trù riêng", "Cố gắng giải thích...", "Đồng ý ngay vì không muốn người yêu buồn lòng."]},
            {"dim":14,"q":"Khi ở cạnh người khác, bạn thể hiện bản thân thế nào?", "opts":["Khéo léo thay đổi cách nói chuyện theo từng hoàn cảnh", "Có lúc thẳng thắn, có lúc tiết chế", "Thể hiện đúng con người thật"]},
            {"dim":14,"q":"Tôi có thể dễ dàng thay đổi giọng điệu, cách nói và thậm chí cả vốn từ tùy theo người tôi đang trò chuyện.", "opts":["Không đồng ý", "Trung lập", "Đồng ý"]},
            {"dim":-1, "q":"Câu hỏi bonus: Thói quen uống rượu / say xỉn của bạn?", "opts":["0 → Thánh Say - Uống vào là thăng hoa cực độ", "1 → Xã giao - Uống có chừng mực", "2 → Không uống hoặc rất ít"]}
        ]

    @staticmethod
    def sum_to_level(score: int) -> str:
        """Convert summed score (0-4) to level code (L/M/H)
        With 2 questions per dimension, max sum = 2+2 = 4
        Thresholds:
          0-1: L (Low)
          2-3: M (Medium)
          4:   H (High)
        """
        if score <= 1:
            return 'L'
        elif score <= 3:
            return 'M'
        else:  # 4
            return 'H'

    @staticmethod
    def level_to_num(level: str) -> int:
        """Convert level code to numeric value for matching"""
        return {'L': 1, 'M': 2, 'H': 3}[level]

    def take_test(self, interactive: bool = True) -> Tuple[np.ndarray, int]:
        """
        Run test interactively or with predefined answers
        Returns: (user_vector, bonus_drink)
        Reference: engine.mjs scoring pipeline (sum → level → numeric)
        """
        dim_scores = [0] * 15  # Sum scores per dimension (0-6 range)
        bonus_drink = 1

        for i, q in enumerate(self.questions):
            if interactive:
                print("\n" + "="*90)
                print(f"QUESTION {i+1:2d} / {len(self.questions)}")
                print("="*90)
                print(q['q'] + "\n")
                for j, opt in enumerate(q['opts']):
                    print(f"   {j} - {opt}")
                print("-"*90)

                while True:
                    try:
                        ans = int(input("Choose (0/1/2): ").strip())
                        if 0 <= ans <= 2:
                            break
                        print("   Choose 0, 1, or 2 only.")
                    except:
                        print("   Please enter a valid number.")
            else:
                ans = 1  # Default neutral if non-interactive

            if q['dim'] >= 0:
                score = ans  # No reverse flag needed - option order handles reversal
                dim_scores[q['dim']] += score  # Sum, not append
            else:
                bonus_drink = ans

        # Convert summed scores to levels, then to numeric values (1, 2, 3)
        user_vector = []
        for score_sum in dim_scores:
            level = self.sum_to_level(score_sum)
            user_vector.append(self.level_to_num(level))

        return np.array(user_vector, dtype=int), bonus_drink


# ============================================================================
# MATCHING ENGINE
# ============================================================================

class ArchetypeMatching:
    """Personality archetype matching (aligned with engine.mjs)"""

    def __init__(self):
        self.names = list(ARCHETYPES.keys())
        self.vectors = np.array([ARCHETYPES[n]["vector"] for n in self.names])

    def match(self, user_vector: np.ndarray) -> List[Dict]:
        """
        Matching using Manhattan distance + exact match counting.
        Reference: engine.mjs scoring pipeline:
          - Calculate absolute differences (L1/Manhattan distance)
          - Count exact matches (difference == 0)
          - Linear similarity: max(0, round((1 - distance/30) * 100))
          - Sort by: distance, then exact matches, then similarity
        """
        results = []
        user = np.array(user_vector, dtype=int)

        for name in self.names:
            arch_vector = np.array(ARCHETYPES[name]["vector"], dtype=int)

            # Manhattan distance (sum of absolute differences)
            diff = np.abs(user - arch_vector)
            distance = int(np.sum(diff))  # Total differences (0-30 max for 15 dims × 2 max)
            exact = int(np.sum(diff == 0))  # Count exact dimension matches

            # Linear similarity: closer = higher (max distance = 30 for 15 dims)
            similarity = max(0, round((1 - distance / 30) * 100))

            results.append({
                "type": name,
                "code": name,
                "score": similarity,
                "distance": distance,
                "exact": exact,
                "desc": ARCHETYPES[name]["desc"]
            })

        # Three-level sort (reference: engine.mjs)
        return sorted(results, key=lambda x: (x["distance"], -x["exact"], -x["score"]))

    def get_confidence(self, top_score: float, second_score: float) -> str:
        """Determine confidence level based on score gap"""
        gap = top_score - second_score
        if gap > 15:
            return "HIGH"
        elif gap > 5:
            return "MEDIUM"
        else:
            return "LOW"


# ============================================================================
# ANALYSIS & INTERPRETATION
# ============================================================================

class DimensionAnalysis:
    """Dimension breakdown and interpretation"""

    @staticmethod
    def analyze(scores: np.ndarray) -> Dict:
        """Analyze dimension scores by group (using L/M/H levels)"""
        analysis = {}
        for group_name, indices in DIMENSION_GROUPS.items():
            group_scores = scores[list(indices)]
            avg = np.mean(group_scores)

            # With 1/2/3 scale: 1-1.33=LOW, 1.33-2.33=MEDIUM, 2.33-3=HIGH
            if avg >= 2.33:
                level = "HIGH"
                emoji = "🔥"
            elif avg >= 1.33:
                level = "MEDIUM"
                emoji = "⚖️"
            else:
                level = "LOW"
                emoji = "🌱"

            analysis[group_name] = {
                "level": level,
                "score": round((avg - 1) * 50, 1),  # Map 1-3 scale to 0-100
                "emoji": emoji,
                "raw": [int(x) for x in group_scores]  # Now integers 1/2/3
            }
        return analysis

    @staticmethod
    def get_level_codes(scores: np.ndarray) -> str:
        """Convert numeric scores (1/2/3) to L/M/H letter codes"""
        codes = []
        for score in scores:
            if score >= 2.33:
                codes.append('H')
            elif score >= 1.33:
                codes.append('M')
            else:
                codes.append('L')
        return "".join(codes)


# ============================================================================
# RESULT FORMATTER
# ============================================================================

class ResultFormatter:
    """Format and display results"""

    @staticmethod
    def display(result: TestResult):
        """Pretty-print test results"""
        print("\n" + "="*90)
        print("YOUR MAIN TYPE")
        print("="*90)
        main_arch = ARCHETYPES[result.main_type]
        print(f"\n{result.main_type} ({result.score:.1f}%)")
        print(main_arch["desc"])
        print(f"Confidence: {result.confidence}")
        print(f"Method: {result.method}\n")

        print("DIMENSION BREAKDOWN")
        print("="*90)
        for group, data in result.dimension_analysis.items():
            # Convert 1/2/3 values to L/M/H display
            raw_str = " ".join('LMH'[min(2, x-1)] for x in data['raw'])
            print(f"{group:12} {data['level']:8} ({data['score']:5.1f}%) - {raw_str}")

        print("\nTOP 5 MATCHES")
        print("="*90)
        for i, r in enumerate(result.top_matches[:5], 1):
            marker = "[1]" if i == 1 else f"[{i}]"
            print(f"{marker} {r['code']:6} {r['score']:6.1f}% (dist={r['distance']:2d}, exact={r['exact']:2d}) - {r['desc']}")

        print("\nYOUR DNA (L=Low, M=Medium, H=High):")
        level_codes = DimensionAnalysis.get_level_codes(result.user_vector)
        dim_names_short = [n.split('_')[0] for n in DIMENSION_NAMES]
        print("   " + level_codes)
        print("   " + " ".join(dim_names_short))

    @staticmethod
    def to_json(result: TestResult) -> Dict:
        """Convert result to JSON-serializable dict"""
        # Serialize top matches (remove numpy types if any)
        top_matches_clean = [
            {k: (int(v) if isinstance(v, np.integer) else v) for k, v in m.items()}
            for m in result.top_matches[:5]
        ]
        return {
            "timestamp": result.timestamp,
            "main_type": result.main_type,
            "score": float(result.score),
            "confidence": result.confidence,
            "method": result.method,
            "user_vector": [int(x) for x in result.user_vector.tolist()],
            "dimension_analysis": {
                k: {**v, "raw": [int(x) for x in v["raw"]]} for k, v in result.dimension_analysis.items()
            },
            "top_matches": top_matches_clean,
            "dna": DimensionAnalysis.get_level_codes(result.user_vector)
        }


# ============================================================================
# MAIN RUNNER
# ============================================================================

def run_sbti(interactive: bool = True) -> TestResult:
    """Run complete SBTI test and return result"""

    # Step 1: Test (sum → level → numeric)
    print("=== SBTI Method (Reference Engine) ===")
    test = SBTITest()
    user_vector, bonus_drink = test.take_test(interactive=interactive)

    # Step 2: Match (Manhattan distance + exact matching)
    print("\n" + "="*90)
    print("ANALYZING YOUR RESULTS...")
    print("="*90)
    matcher = ArchetypeMatching()
    matches = matcher.match(user_vector)

    # Step 3: Get top result
    top = matches[0]
    second = matches[1]
    confidence = matcher.get_confidence(top["score"], second["score"])

    # Step 4: Analyze dimensions
    analysis = DimensionAnalysis.analyze(user_vector)

    # Step 5: Package result
    result = TestResult(
        main_type=top["type"],
        score=top["score"],
        user_vector=user_vector,
        top_matches=matches,
        dimension_analysis=analysis,
        confidence=confidence,
        method="Manhattan Distance + Exact Matching",
        timestamp=datetime.now().isoformat()
    )

    return result


if __name__ == "__main__":
    result = run_sbti(interactive=False)

    # Display results
    ResultFormatter.display(result)

    # Save to JSON
    result_dict = ResultFormatter.to_json(result)
    with open("sbti_result.json", "w", encoding="utf-8") as f:
        json.dump(result_dict, f, ensure_ascii=False, indent=2)
    print("\n💾 Results saved to sbti_result.json")
    print("✅ Test completed!")
