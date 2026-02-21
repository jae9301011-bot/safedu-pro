import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MockExam.css';
import { ArrowLeft, Clock, CheckCircle, Trash2, Repeat, LayoutList } from 'lucide-react';

import MOCK_QUESTIONS_DATA from '../data/questions.json';

export const MOCK_QUESTIONS = MOCK_QUESTIONS_DATA;

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
