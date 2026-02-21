import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MockExam.css';
import { ArrowLeft, Clock, CheckCircle, Trash2, Repeat, LayoutList } from 'lucide-react';

export const MOCK_QUESTIONS = [
    {
        id: 1,
        subject: '산업안전보건법령',
        text: '산업안전보건법령상 도급인의 의무로 옳지 않은 것은?',
        options: [
            '관계수급인 근로자가 도급인의 사업장에서 작업을 하는 경우 안전보건협의체 구성 및 운영',
            '작업장 순회점검',
            '관계수급인이 근로자에게 하는 안전보건교육을 위한 장소 및 자료의 제공 등 지원',
            '관계수급인 근로자의 건강진단 실시 비용 직접 부담',
            '안전보건에 관한 정보 제공'
        ],
        answer: 3
    },
    {
        id: 2,
        subject: '산업안전일반',
        text: '하인리히(H. W. Heinrich)의 재해 발생 5단계 중 3단계에 해당하는 것은?',
        options: [
            '유전적 요인 / 사회적 환경',
            '개인적 결함',
            '불안전한 행동 및 불안전한 상태',
            '사고 (Accident)',
            '상해 (Injury)'
        ],
        answer: 2
    },
    {
        id: 3,
        subject: '기업진단지도',
        text: '산업심리의 5대 요소 중 인간의 행동을 일으키는 원동력이 되는 것은?',
        options: [
            '동기(Motive)',
            '기질(Temperament)',
            '감정(Emotion)',
            '습성(Habit)',
            '습관(Custom)'
        ],
        answer: 0
    },
    {
        id: 4,
        subject: '산업안전일반',
        text: '재해코스트 산정방식 중 하인리히 방식에서 직접비와 간접비의 비율은 보통 어떻게 설정되는가?',
        options: [
            '1 : 1',
            '1 : 2',
            '1 : 4',
            '1 : 5',
            '1 : 10'
        ],
        answer: 2
    },
    {
        id: 5,
        subject: '산업안전보건법령',
        text: '산업안전보건법령에 따라 사업주가 근로자에게 실시해야 하는 정기교육 내용이 아닌 것은?',
        options: [
            '산업안전 및 사고 예방에 관한 사항',
            '산업보건 및 직업병 예방에 관한 사항',
            '건강증진 및 질병 예방에 관한 사항',
            '유해·위험 작업환경 관리에 관한 사항',
            '기계·기구의 위험성과 작업의 순서 및 동선에 관한 사항'
        ],
        answer: 4
    },
    {
        id: 6,
        subject: '기업진단지도',
        text: '동기부여 이론 중 허즈버그(Herzberg)의 2요인 이론에서 동기요인(위생요인이 아닌)에 해당하는 것은?',
        options: [
            '급여',
            '작업조건',
            '직업의 안정성',
            '책임감',
            '대인관계'
        ],
        answer: 3
    },
    {
        id: 7,
        subject: '산업안전일반',
        text: '버드(Frank Bird)의 신도미노 이론 5단계 중 "근본원인(기본원인)"에 해당하는 단계는?',
        options: [
            '제1단계(통제부족)',
            '제2단계(기본원인)',
            '제3단계(직접원인)',
            '제4단계(사고)',
            '제5단계(상해/손상)'
        ],
        answer: 1
    },
    {
        id: 8,
        subject: '산업안전보건법령',
        text: '산업안전보건법령상 안전보건관리책임자의 직무 범주에 속하지 않는 것은?',
        options: [
            '산업재해 예방계획의 수립에 관한 사항',
            '안전보건관리규정의 작성 및 변경에 관한 사항',
            '안전보건교육 등에 관한 사항',
            '작업환경측정 등 작업환경의 점검 및 개선에 관한 사항',
            '안전인증대상 기계등의 제조에 관한 사항'
        ],
        answer: 4
    },
    {
        id: 9,
        subject: '기업진단지도',
        text: '안전보건관리조직의 형태 중 라인-스태프(Line-Staff)형 조직의 특징으로 가장 거리가 먼 것은?',
        options: [
            '100명 미만의 소규모 사업장에 적합하다.',
            '안전보건 지침 및 제반 사항이 스태프에서 계획되고 명령은 라인을 통해 하달된다.',
            '안전지식과 기술축적이 용이하다.',
            '지시와 명령이 일원화되어 있어 혼란을 방지할 수 있다.',
            '라인(Line)과 스태프(Staff) 간의 마찰이 발생할 수 있다.'
        ],
        answer: 0
    },
    {
        id: 10,
        subject: '산업안전일반',
        text: '피로의 측정방법 중 생리학적 척도를 이용한 측정 방법에 해당하지 않는 것은?',
        options: [
            '플리커(Flicker) 검사',
            '뇌파(EEG) 검사',
            '근전도(EMG) 검사',
            '연속반응 시간검사',
            '심전도(ECG) 검사'
        ],
        answer: 3
    }
];

export default function MockExam() {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('currentUser') || 'default';
    const storageKey = `${currentUser}_cbtExamState`;

    const getInitialState = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return { currentQIndex: 0, selectedAnswers: {}, submitted: false, filterStates: {} };
    };

    const initialState = getInitialState();

    const [currentQIndex, setCurrentQIndex] = useState(initialState.currentQIndex);
    const [selectedAnswers, setSelectedAnswers] = useState(initialState.selectedAnswers);
    const [submitted, setSubmitted] = useState(initialState.submitted);
    // 3-tier filter state for smart note: 'discard', 'review', 'keep'
    const [filterStates, setFilterStates] = useState(initialState.filterStates);

    useEffect(() => {
        const stateToSave = { currentQIndex, selectedAnswers, submitted, filterStates };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [currentQIndex, selectedAnswers, submitted, filterStates, storageKey]);

    const [customQuestions, setCustomQuestions] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('currentUser') || 'default';
        const storedCustomMaterial = localStorage.getItem(`${user}_customLearningMaterial`);
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                // Ensure it has basic structure or adapt it
                const adapted = parsed.map((item, index) => ({
                    id: `custom_${index}`,
                    subject: item.subject || '커스텀 문제',
                    text: item.text || item.question || '내용 없음',
                    options: item.options ? (Array.isArray(item.options) ? item.options : item.options.split('|')) : ['O', 'X', '보기없음', '보기없음'],
                    answer: item.answer !== undefined ? parseInt(item.answer, 10) : 0,
                    isCustom: true
                }));
                setCustomQuestions(adapted);
            } catch (e) {
                console.error("Error parsing custom materials", e);
            }
        }
    }, []);

    const allQuestions = [...MOCK_QUESTIONS, ...customQuestions];
    const question = allQuestions[currentQIndex];
    const isLast = currentQIndex === allQuestions.length - 1;

    const handleSelect = (idx) => {
        if (submitted) return;
        setSelectedAnswers(prev => ({ ...prev, [question.id]: idx }));
    };

    const handleNext = () => {
        if (!isLast) setCurrentQIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleSetFilter = (qId, state) => {
        setFilterStates(prev => ({ ...prev, [qId]: state }));
    };

    return (
        <div className="exam-layout">
            {/* Exam Header (Q-Net Style Mockup) */}
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>2025 1차 공통필수 모의고사 (CBT)</h2>
                </div>
                <div className="exam-timer">
                    <Clock /> <span>01:15:30 남음</span>
                </div>
            </header>

            <main className="exam-main">
                <div className="question-panel glass-panel">
                    <div className="q-meta">
                        <span className="q-subject">{question?.subject} {question?.isCustom && '(사용자 추가)'}</span>
                        <span className="q-num">문제 {currentQIndex + 1} / {allQuestions.length}</span>
                    </div>

                    <h3 className="q-text">{question?.text}</h3>

                    <div className="q-options">
                        {question?.options.map((opt, idx) => (
                            <button
                                key={idx}
                                className={`q-option ${selectedAnswers[question.id] === idx ? 'selected' : ''} ${submitted && question.answer === idx ? 'correct' : ''} ${submitted && selectedAnswers[question.id] === idx && question.answer !== idx ? 'wrong' : ''}`}
                                onClick={() => handleSelect(idx)}
                            >
                                <span className="opt-num">{idx + 1}</span>
                                <span className="opt-text">{opt}</span>
                            </button>
                        ))}
                    </div>

                    {/* Post-submission Review Actions */}
                    {submitted && (
                        <div className="review-actions fade-in">
                            <div className="explanation">
                                <h4>📝 해설 및 최신 2025 법령 업데이트</h4>
                                <p>도급인은 안전보건에 관한 필수 비용을 지원해야 하나, 관계수급인 근로자의 '일반 건강진단 비용' 자체를 법적으로 직접 부담할 의무는 없습니다 (산업안전보건법 제62조 참조).</p>
                                <p className="highlight">※ 2025년 12월 1일 개정 알림: 50인 미만 사업장 유해위험방지계획서 제출 대상이 일부 확대되었습니다.</p>
                            </div>

                            <div className="smart-filter-pad">
                                <p>💡 이 문제를 나만의 오답노트에서 어떻게 관리하시겠습니까?</p>
                                <div className="filter-buttons">
                                    <button
                                        className={`filter-btn discard ${filterStates[question.id] === 'discard' ? 'active' : ''}`}
                                        onClick={() => handleSetFilter(question.id, 'discard')}
                                    >
                                        <Trash2 size={18} /> <span>완벽히 앎 (버리기)</span>
                                    </button>
                                    <button
                                        className={`filter-btn review ${filterStates[question.id] === 'review' ? 'active' : ''}`}
                                        onClick={() => handleSetFilter(question.id, 'review')}
                                    >
                                        <Repeat size={18} /> <span>자주 틀림 (반복 학습)</span>
                                    </button>
                                    <button
                                        className={`filter-btn keep ${filterStates[question.id] === 'keep' ? 'active' : ''}`}
                                        onClick={() => handleSetFilter(question.id, 'keep')}
                                    >
                                        <LayoutList size={18} /> <span>일반 소장</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="q-navigator">
                        <button className="btn-secondary" onClick={handlePrev} disabled={currentQIndex === 0}>이전 문제</button>
                        {!submitted ? (
                            isLast ? <button className="btn-primary" onClick={handleSubmit}>답안 제출</button> : <button className="btn-primary" onClick={handleNext}>다음 문제</button>
                        ) : (
                            <button className="btn-primary" onClick={handleNext} disabled={isLast}>다음 해설장</button>
                        )}
                    </div>
                </div>

                {/* OMR Card Sidebar Mockup */}
                <aside className="omr-panel glass-panel">
                    <h3>답안 표기란</h3>
                    <div className="omr-grid">
                        {allQuestions.map((q, idx) => (
                            <div key={q.id} className="omr-row">
                                <span className="omr-num">{idx + 1}</span>
                                {[0, 1, 2, 3, 4].map(opt => (
                                    <span key={opt} className={`omr-marker ${selectedAnswers[q.id] === opt ? 'marked' : ''}`}>
                                        {opt + 1}
                                    </span>
                                ))}
                                {submitted && (
                                    <span className="omr-result">
                                        {selectedAnswers[q.id] === q.answer ? <CheckCircle color="var(--color-success)" size={16} /> : '❌'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
}
