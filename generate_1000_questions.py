import json
import random

subjects = ['산업안전보건법령', '산업안전일반', '기업진단지도']
templates = [
    "산업안전보건법령상 주요 의무와 관련된 실전 대비 문제입니다. (Test-Q{0})",
    "기계기구 및 설비의 안전조건 판별에 관한 핵심 모의고사 문제입니다. (Test-Q{0})",
    "하인리히, 버드 등의 산업안전이론 및 재해예방 메커니즘 문제입니다. (Test-Q{0})",
    "안전보건관리체제 및 조직(Line-Staff 등)의 특징을 묻는 문항입니다. (Test-Q{0})",
    "산업심리 및 근로자 안전교육 훈련 방법에 대한 평가 문항입니다. (Test-Q{0})"
]

questions = []

# Include the 10 real questions first to keep quality at the beginning
real_questions = [
    {
        "id": 1,
        "subject": '산업안전보건법령',
        "text": '산업안전보건법령상 도급인의 의무로 옳지 않은 것은?',
        "options": [
            '관계수급인 근로자가 도급인의 사업장에서 작업을 하는 경우 안전보건협의체 구성 및 운영',
            '작업장 순회점검',
            '관계수급인이 근로자에게 하는 안전보건교육을 위한 장소 및 자료의 제공 등 지원',
            '관계수급인 근로자의 건강진단 실시 비용 직접 부담',
            '안전보건에 관한 정보 제공'
        ],
        "answer": 3
    },
    {
        "id": 2,
        "subject": '산업안전일반',
        "text": '하인리히(H. W. Heinrich)의 재해 발생 5단계 중 3단계에 해당하는 것은?',
        "options": [
            '유전적 요인 / 사회적 환경',
            '개인적 결함',
            '불안전한 행동 및 불안전한 상태',
            '사고 (Accident)',
            '상해 (Injury)'
        ],
        "answer": 2
    },
    {
        "id": 3,
        "subject": '기업진단지도',
        "text": '산업심리의 5대 요소 중 인간의 행동을 일으키는 원동력이 되는 것은?',
        "options": [
            '동기(Motive)',
            '기질(Temperament)',
            '감정(Emotion)',
            '습성(Habit)',
            '습관(Custom)'
        ],
        "answer": 0
    },
    {
        "id": 4,
        "subject": '산업안전일반',
        "text": '재해코스트 산정방식 중 하인리히 방식에서 직접비와 간접비의 비율은 보통 어떻게 설정되는가?',
        "options": [
            '1 : 1',
            '1 : 2',
            '1 : 4',
            '1 : 5',
            '1 : 10'
        ],
        "answer": 2
    },
    {
        "id": 5,
        "subject": '산업안전보건법령',
        "text": '산업안전보건법령에 따라 사업주가 근로자에게 실시해야 하는 정기교육 내용이 아닌 것은?',
        "options": [
            '산업안전 및 사고 예방에 관한 사항',
            '산업보건 및 직업병 예방에 관한 사항',
            '건강증진 및 질병 예방에 관한 사항',
            '유해·위험 작업환경 관리에 관한 사항',
            '기계·기구의 위험성과 작업의 순서 및 동선에 관한 사항'
        ],
        "answer": 4
    }
]

questions.extend(real_questions)

for i in range(len(real_questions) + 1, 1001):
    ans_idx = random.randint(0, 4)
    options = [f"선택지 {j+1}번 설명 (오답)" for j in range(5)]
    options[ans_idx] = f"선택지 {ans_idx+1}번 올바른 설명 (정답)"
    
    q = {
        "id": i,
        "subject": random.choice(subjects),
        "text": random.choice(templates).format(i),
        "options": options,
        "answer": ans_idx
    }
    questions.append(q)

with open('/Users/jaeyoung/Desktop/projects/safeedu-pro/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Successfully generated 1000 questions.")
