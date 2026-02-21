import json
import random

subjects = ['산업안전보건법령', '산업안전일반', '기업진단지도', '안전보건관리', '위험성평가']
templates = [
    "다음 상황에서 발생할 수 있는 주요 위험 요인과 그에 대한 예방 대책을 서술하시오. (Essay-Q{0})",
    "산업안전보건법상 사업주의 의무 중 {0}와 관련된 항목을 3가지 이상 나열하고 설명하시오.",
    "작업장 내에서 빈번하게 발생하는 재해 유형 중 하나를 선택하고, 그 원인과 대책을 서술하시오. (Essay-Q{0})",
    "근로자 건강장해 예방을 위한 보건 조치 사항에 대하여 논하시오. (Essay-Q{0})",
    "안전보건관리체제 구축의 필요성과 각 구성원의 역할에 대해 서술하시오. (Essay-Q{0})"
]

keywords_pool = [
    ["위험성평가", "안전보건교육", "보호구"],
    ["사업주 의무", "관리감독자", "산업안전보건위원회"],
    ["추락", "협착", "방호장치", "작업지휘자"],
    ["건강진단", "국소배기장치", "작업환경측정", "직업병"],
    ["안전보건관리책임자", "안전관리자", "보건관리자", "도급인"]
]

questions = []

# Existing real questions (mock)
real_questions = [
    {
        "id": 1,
        "type": "essay",
        "subject": "산업안전보건법령",
        "question": "크레인 등 양중기를 사용하여 작업할 때 발생할 수 있는 주요 재해 유형과 안전 대책을 서술하시오.",
        "keywords": ["낙하", "추락", "붕괴", "정격하중", "신호수", "와이어로프"],
        "officialStandard": "제146조(크레인 작업 시의 조치) 사업주는 크레인을 사용하여 작업을 하는 경우 다음 각 호의 조치를 해야 한다.\n1. 인양할 하중을 보조할 수 있는 충분한 강도의 와이어로프 등을 사용할 것\n2. 인양물의 낙하를 방지하기 위한 조치를 할 것\n3. 조종자와 근로자 간의 신호방법을 정하고 신호수를 배치할 것"
    },
    {
        "id": 2,
        "type": "essay",
        "subject": "산업안전일반",
        "question": "밀폐공간 작업 시 근로자의 질식 재해를 예방하기 위한 핵심 안전 수칙 3가지를 설명하시오.",
        "keywords": ["산소농도", "유해가스", "환기", "보호구", "감시인", "밀폐공간"],
        "officialStandard": "제619조(밀폐공간 작업 프로그램의 수립·시행 등) 사업주는 밀폐공간에서 근로자에게 작업을 하도록 하는 경우 다음 각 호의 내용이 포함된 밀폐공간 작업 프로그램을 수립하여 시행해야 한다.\n1. 작업 시작 전 공기 상태 측정 및 평가\n2. 응급조치 등 안전보건 교육 및 훈련\n3. 공기호흡기 등 환기장치 설치 및 조치"
    },
    {
        "id": 3,
        "type": "essay",
        "subject": "기업진단지도",
        "question": "하인리히의 도미노 이론을 바탕으로 산업재해 예방의 기본 원리를 설명하시오.",
        "keywords": ["유전적 요인", "개인적 결함", "불안전한 행동", "불안전한 상태", "사고", "재해", "연쇄반응", "제거"],
        "officialStandard": "하인리히 도미노 이론: 재해는 1. 유전적 요인 및 사회적 환경 2. 개인적 결함 3. 불안전한 행동 및 상태 4. 사고 5. 재해의 5단계 연쇄반응으로 일어나며, 이 중 3단계인 불안전한 행동 및 상태를 제거하면 4단계, 5단계인 사고와 재해를 예방할 수 있다는 이론이다."
    }
]

questions.extend(real_questions)

for i in range(len(real_questions) + 1, 1001):
    kw_idx = random.randint(0, len(keywords_pool)-1)
    kws = keywords_pool[kw_idx]
    
    q = {
        "id": i,
        "type": "essay",
        "subject": random.choice(subjects),
        "question": random.choice(templates).format(i),
        "keywords": kws,
        "officialStandard": f"관련 법령 및 해설 (Essay-Q{i})\n이 내용은 {kws[0]} 등과 관련된 산업안전보건 기준에 관한 규칙을 바탕으로 채점됩니다."
    }
    questions.append(q)

with open('/Users/jaeyoung/Desktop/projects/safeedu-pro/src/data/essay_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Successfully generated 1000 essay questions.")
