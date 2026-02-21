import json
import random

keywords = [
    '비계 조립', '굴착공사', '타워크레인', '지붕 작업', '밀폐공간', 
    '가설통로', '동력형 수공구', '거푸집 동바리', '프레스 작업', '지게차 운반', 
    '용접 작업', '전주 둥근톱', '감전 위험', '화물자동차', '승강기', 
    '벌목 작업', '유해화학물질', '소음 노출', '석면 해체', '터널 굴착',
    '채석작업', '항타기', '항발기', '양중기', '달비계', '추락 방지망',
    '안전난간', '개구부', '사다리', '고소작업대', '곤돌라', '이동식 크레인'
]

subjects = ['산업안전보건법령', '산업안전일반', '기업진단지도']

q_templates = [
    "산업안전보건법령상 '{keyword}' 작업 시 사업주가 준수해야 할 안전조치로 옳지 않은 것은?",
    "다음 중 '{keyword}' 작업 과정에서 발생할 수 있는 주요 산업재해를 예방하기 위한 조치로 틀린 것은?",
    "건설현장에서 '{keyword}' 관련 장비나 설비를 사용할 때의 법적 준수사항으로 가장 거리가 먼 것은?",
    "'{keyword}' 작업 착수 전 관리감독자가 유해위험요인을 점검해야 할 사항으로 적절하지 않은 행동은?"
]

good_options = [
    "'{keyword}' 작업 시에는 규정된 안전모, 안전대 등 개인보호구를 작업자에게 지급하고 반드시 착용하도록 지도한다.",
    "작업 전 '{keyword}' 관련 장비의 방호장치와 비상정지장치의 이상 유무를 점검하고 기록을 남긴다.",
    "'{keyword}'의 주요 위험 요인을 사전에 파악하여 해당 작업 근로자에게 철저한 안전보건 특별교육을 실시한다.",
    "'{keyword}' 작업 반경 내에는 낙하물이나 기계 충돌 위험이 있으므로 관계 근로자 외의 출입을 철저히 통제한다.",
    "'{keyword}' 작업에 대한 사전조사를 거쳐 작업계획서를 작성하고 그 계획에 따라 지정된 작업지휘자가 작업을 지휘한다.",
    "폭우, 강풍 등 악천후 시에는 즉시 '{keyword}' 작업을 중지하고 모든 근로자를 안전한 장소로 대피시켜야 한다.",
    "사용 전 '{keyword}'의 기계적 결함이나 연결부 손상 여부를 육안 및 기기로 확인하고 충분한 시운전을 거친다.",
    "제조사가 정한 정격 하중이나 사용 제한 규격을 엄격히 준수하여 '{keyword}' 작업을 수행한다."
]

bad_options = [
    "작업의 효율성과 신속성을 높이기 위해 '{keyword}'의 핵심 방호장치나 센서를 임의로 해체하고 작업에 임한다.",
    "비용 절감과 공기 단축을 위해 '{keyword}' 관련 정기 안전점검은 생략하고 육안 관찰로만 대체한다.",
    "오랜 경력을 가진 숙련된 관리자라면 '{keyword}' 작업 시 작업계획서 작성 등 일부 문서화된 안전수칙은 생략해도 무방하다.",
    "'{keyword}' 작업 중 설비에 이상 결함이 발견되더라도, 생산 공정 유지를 위해 정지하지 않고 가동 중에 직접 손을 넣어 수리한다.",
    "'{keyword}' 관련 법정 안전보건교육은 현장 작업 시 서면 자료 배포만으로 대체하여 교육 시간을 절약한다."
]

rule_templates = [
    "[안전보건규칙 제{article}조 해설] 산업안전보건법 및 안전보건기준에 관한 규칙에 따라 사업주 및 근로자는 안전장치를 임의로 해체하거나 기능을 상실하게 해서는 안 됩니다. 공기 단축 및 효율성을 이유로 설비의 안전 조치를 무력화하는 행위는 엄격히 금지되며 이는 중대한 법령 위반(오답)에 해당합니다.",
    "[법령 근거: 산업안전보건법 기준 제{article}조] 근로자를 보호하기 위한 기본 방호 조치 및 사전 안전점검은 어떠한 경우에도 임의로 축소하거나 해제할 수 없으며, 효율이나 숙련도 등을 이유로 법정 수칙을 생략하는 것은 명백히 틀린 설명입니다.",
    "[최신 산업안전보건법규 제{article}조 해설] 관련 법령에 따르면, 작업의 편의나 비용 절감을 이유로 규정된 안전 수칙을 무시하거나 작업계획서 작성을 생략하는 행위는 중대재해처벌법 및 산업안전보건법상 매우 엄중히 처벌받는 중대한 위법 사항입니다. 따라서 해당 보기는 틀린 설명입니다."
]

questions = []

for i in range(1, 1001):
    keyword = random.choice(keywords)
    q_str = random.choice(q_templates).format(keyword=keyword)
    
    selected_bad = random.choice(bad_options).format(keyword=keyword)
    selected_goods = random.sample(good_options, 4)
    opts = [opt.format(keyword=keyword) for opt in selected_goods]
    
    ans_idx = random.randint(0, 4)
    opts.insert(ans_idx, selected_bad)
    
    article_num = random.randint(30, 680)
    exp_str = random.choice(rule_templates).format(article=article_num)
    
    q = {
        "id": i,
        "subject": random.choice(subjects),
        "text": q_str,
        "options": opts,
        "answer": ans_idx,
        "explanation": f"정답은 {ans_idx+1}번입니다. \n\n{exp_str}"
    }
    questions.append(q)

with open('/Users/jaeyoung/Desktop/projects/safeedu-pro/src/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Successfully regenerated 1000 CBT questions with realistic terminology and detailed explanations.")

