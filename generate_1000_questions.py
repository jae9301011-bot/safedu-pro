import json
import random

# Real industrial safety facts (산업안전보건기준에 관한 규칙 등) - DIVERSIFIED
facts = [
    # 건설안전 (Construction)
    {"subject": "건설안전", "fact": "사다리식 통로의 기울기", "correct": "75도 이하로 할 것", "wrong": ["85도 이하로 할 것", "60도 이하로 할 것", "90도 이하로 할 것"], "article": "제24조", "rev": "2024.12.27 개정"},
    {"subject": "건설안전", "fact": "추락방호망 설치 시 망의 처짐", "correct": "짧은 변 길이의 12퍼센트 이상", "wrong": ["5퍼센트 이상", "20퍼센트 이상", "10퍼센트 이상"], "article": "제42조", "rev": "2025.01.01 시행"},
    {"subject": "건설안전", "fact": "안전난간 발끝막이판의 설치 높이", "correct": "바닥면등으로부터 10센티미터 이상", "wrong": ["5센티미터 이상", "20센티미터 이상", "15센티미터 이상"], "article": "제13조", "rev": "2024.12.27 개정"},
    {"subject": "건설안전", "fact": "강관비계 기둥의 간격 (띠장 방향)", "correct": "1.5미터 이상 1.8미터 이하", "wrong": ["2.0미터 이상 2.5미터 이하", "1.0미터 이상 1.5미터 이하", "1.8미터 이상 2.0미터 이하"], "article": "제60조", "rev": "2024.12.27 개정"},
    {"subject": "건설안전", "fact": "굴착공사 시 지반의 경사도 (연암)", "correct": "1:1.0", "wrong": ["1:0.5", "1:1.2", "1:1.5"], "article": "제338조", "rev": "2024.12.27 개정"},
    # 기계안전 (Mechanical)
    {"subject": "기계안전", "fact": "달기 와이어로프의 안전계수", "correct": "10 이상", "wrong": ["5 이상", "4 이상", "8 이상"], "article": "제163조", "rev": "2024.12.27 개정"},
    {"subject": "기계안전", "fact": "프레스 광전자식 방호장치의 반사판 오염 시", "correct": "급정지기구가 작동하여 정지되어야 함", "wrong": ["자동으로 저속 주행함", "별도 경보만 울림", "이상 없이 계속 가동됨"], "article": "방호장치 기준", "rev": "2023.10.15 개정"},
    {"subject": "기계안전", "fact": "보일러의 압력제한스위치 설정값", "correct": "최고사용압력 이하", "wrong": ["최고사용압력의 1.1배", "설계압력의 1.5배", "상용압력의 2배"], "article": "제117조", "rev": "2024.12.27 개정"},
    {"subject": "기계안전", "fact": "지게차의 헤드가드 강도", "correct": "최대하중의 2배 (4톤 초과 시 4톤)", "wrong": ["최대하중의 1배", "최대하중의 3배", "5톤 고정"], "article": "제179조", "rev": "2024.12.27 개정"},
    # 전기안전 (Electrical)
    {"subject": "전기안전", "fact": "특별고압 활선작업 시 이격거리 (22.9kV)", "correct": "90센티미터 이상", "wrong": ["60센티미터 이상", "120센티미터 이상", "30센티미터 이상"], "article": "제321조", "rev": "2024.12.27 개정"},
    {"subject": "전기안전", "fact": "교류아크용접기용 자동전격방지기 작동", "correct": "무부하 전압을 25V 이하로 저하시킴", "wrong": ["전류를 50% 줄임", "전원을 완전히 차단함", "60V 이하로 유지함"], "article": "제306조", "rev": "2024.12.27 개정"},
    {"subject": "전기안전", "fact": "접지저항 측정 주기 (1종 접지)", "correct": "매년 1회 이상", "wrong": ["매 2년 1회", "매 6개월 1회", "신설 시에만 실시"], "article": "제302조", "rev": "2025.01.01 시행"},
    # 화공안전 (Chemical)
    {"subject": "화공안전", "fact": "가연성 가스의 명칭 정의 (폭발하한)", "correct": "폭발하한이 10퍼센트 이하인 가스", "wrong": ["폭발하한이 20퍼센트 이하", "폭발상한이 10퍼센트 이상", "온도가 40도 이하"], "article": "별표 1", "rev": "2024.12.27 개정"},
    {"subject": "화공안전", "fact": "공정안전보고서(PSM) 제출 대상 (염소)", "correct": "하루 1,500kg 이상 취급 시", "wrong": ["500kg 이상", "5,000kg 이상", "10,000kg 이상"], "article": "법 제44조", "rev": "2024.11.01 개정"},
    # 보건안전 (Health)
    {"subject": "보건안전", "fact": "소음작업 정의 (8시간 기준)", "correct": "85데시벨 이상", "wrong": ["90데시벨 이상", "80데시벨 이상", "95데시벨 이상"], "article": "제512조", "rev": "2024.12.27 개정"},
    {"subject": "보건안전", "fact": "밀폐공간 산소농도 적정 범위", "correct": "18% 이상 23.5% 미만", "wrong": ["15% 이상 20%", "20% 이상 25%", "16% 이상 22%"], "article": "제618조", "rev": "2024.12.27 개정"}
]

def generate_options(fact_item, is_positive_query):
    correct_opt = fact_item["correct"]
    raw_wrongs = fact_item["wrong"]
    
    # Positive: Pick 1 correct, 3 wrongs
    if is_positive_query:
        options = [correct_opt] + random.sample(raw_wrongs, 3)
        answer_idx = 0
    else:
        # Negative: Pick 3 variations of correct (paraphrased) and 1 wrong
        correct_variations = [
            correct_opt,
            "법령에서 정한 기준 수치를 엄격히 준수해야 한다.",
            "해당 작업의 사전조사 및 안전 작업계획서에 따라 적용한다."
        ]
        options = correct_variations + [raw_wrongs[0]]
        answer_idx = 3

    idx_list = list(range(4))
    random.shuffle(idx_list)
    shuffled_options = [options[i] for i in idx_list]
    new_ans_idx = idx_list.index(answer_idx)
    return shuffled_options, new_ans_idx

questions = []
for i in range(1, 1001):
    f = random.choice(facts)
    is_positive = random.choice([True, False])
    
    q_pre = "산업안전보건법령 및 안전보건기준에 관한 규칙에 따라, "
    q_context = f"'{f['fact']}'"
    if is_positive:
        q_text = f"{q_pre} {q_context}에 관한 기준으로 옳은 것은?"
    else:
        q_text = f"{q_pre} {q_context}에 대한 설명 중 틀린 것은?"
        
    opts, ans_idx = generate_options(f, is_positive)
    
    # Meta inclusion of revision date
    exp = f"[최신 법령 근거: {f['article']} ({f['rev']})]\n"
    exp += f"정답 근거: {f['fact']}의 법적 기준은 '{f['correct']}'입니다.\n"
    exp += "산업현장에서는 이 수치를 임의로 변경하여 적용할 수 없으며, 위반 시 행정처분 및 관련 법에 따라 처벌받을 수 있습니다."

    questions.append({
        "id": i,
        "subject": f["subject"],
        "text": f"{q_text} (No.{i})",
        "options": opts,
        "answer": ans_idx,
        "explanation": exp
    })

with open('src/data/questions.json', 'w', encoding='utf-8') as file:
    json.dump(questions, file, ensure_ascii=False, indent=2)

print(f"Successfully generated 1000 CBT questions for subjects: {set(f['subject'] for f in facts)}")
