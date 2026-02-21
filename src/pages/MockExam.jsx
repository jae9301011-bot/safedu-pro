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
        return { currentQIndex: 0, selectedAnswers: {}, evaluatedQuestions: {}, filterStates: {}, shuffledOrder: null };
    };

    const initialState = getInitialState();

    const [currentQIndex, setCurrentQIndex] = useState(initialState.currentQIndex);
    const [selectedAnswers, setSelectedAnswers] = useState(initialState.selectedAnswers);
    const [evaluatedQuestions, setEvaluatedQuestions] = useState(initialState.evaluatedQuestions || {});
    const [filterStates, setFilterStates] = useState(initialState.filterStates);

    const [allQuestions, setAllQuestions] = useState([]);

    useEffect(() => {
        const storedCustomMaterial = localStorage.getItem(`${currentUser}_customLearningMaterial`);
        let customQuestions = [];
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                customQuestions = parsed.map((item, index) => ({
                    id: `custom_${index}`,
                    subject: item.subject || '커스텀 문제',
                    text: item.text || item.question || '내용 없음',
                    options: item.options ? (Array.isArray(item.options) ? item.options : item.options.split('|')) : ['O', 'X', '보기없음', '보기없음'],
                    answer: item.answer !== undefined ? parseInt(item.answer, 10) : 0,
                    explanation: item.explanation || item.officialStandard || "해설이 제공되지 않은 커스텀 문제입니다.",
                    isCustom: true
                }));
            } catch (e) {
                console.error("Error parsing custom materials", e);
            }
        }

        let combined = [...MOCK_QUESTIONS, ...customQuestions];

        // Use saved shuffled order if it exists and matches the current questions length
        const savedOrder = initialState.shuffledOrder;
        if (savedOrder && savedOrder.length === combined.length && combined.every(q => savedOrder.includes(q.id))) {
            combined.sort((a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id));
        } else {
            // New random shuffle
            combined.sort(() => Math.random() - 0.5);
            const newOrder = combined.map(q => q.id);
            localStorage.setItem(storageKey, JSON.stringify({ ...initialState, shuffledOrder: newOrder }));
        }

        setAllQuestions(combined);
    }, [currentUser]); // Run once on mount

    useEffect(() => {
        if (allQuestions.length === 0) return;
        const currentOrder = allQuestions.map(q => q.id);
        const stateToSave = { currentQIndex, selectedAnswers, evaluatedQuestions, filterStates, shuffledOrder: currentOrder };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [currentQIndex, selectedAnswers, evaluatedQuestions, filterStates, storageKey, allQuestions]);

    if (allQuestions.length === 0) return <div className="p-8 text-center">문제를 불러오는 중입니다...</div>;

    const question = allQuestions[currentQIndex];
    if (!question) return null;

    const isLast = currentQIndex === allQuestions.length - 1;
    const isEvaluated = evaluatedQuestions[question.id] === true;

    const handleSelect = (idx) => {
        if (isEvaluated) return;
        setSelectedAnswers(prev => ({ ...prev, [question.id]: idx }));
    };

    const handleCheckAnswer = () => {
        if (selectedAnswers[question.id] === undefined) {
            alert("정답을 선택해주세요.");
            return;
        }
        setEvaluatedQuestions(prev => ({ ...prev, [question.id]: true }));
    };

    const handleNext = () => {
        if (!isLast) setCurrentQIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
    };

    const handleSetFilter = (qId, state) => {
        setFilterStates(prev => ({ ...prev, [qId]: state }));
    };

    return (
        <div className="exam-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>2025 1차 공통필수 모의고사 (CBT)</h2>
                </div>
            </header>

            <main className="exam-main">
                <div className="question-panel glass-panel">
                    <div className="q-meta">
                        <span className="q-subject">{question.subject} {question.isCustom && '(사용자 추가)'}</span>
                        <span className="q-num">문제 {currentQIndex + 1} / {allQuestions.length}</span>
                    </div>

                    <h3 className="q-text">{question.text}</h3>

                    <div className="q-options">
                        {question.options.map((opt, idx) => {
                            const isSelected = selectedAnswers[question.id] === idx;
                            const isCorrectAns = question.answer === idx;
                            const isWrongSelected = isSelected && !isCorrectAns;

                            let classes = `q-option ${isSelected ? 'selected' : ''}`;
                            if (isEvaluated) {
                                if (isCorrectAns) classes += ' correct';
                                if (isWrongSelected) classes += ' wrong';
                            }

                            return (
                                <button
                                    key={idx}
                                    className={classes}
                                    onClick={() => handleSelect(idx)}
                                    disabled={isEvaluated}
                                >
                                    <span className="opt-num">{idx + 1}</span>
                                    <span className="opt-text">{opt}</span>
                                </button>
                            );
                        })}
                    </div>

                    {isEvaluated && (
                        <div className="review-actions fade-in mt-6">
                            <div className="explanation">
                                <h4>📝 정답 및 채점 완료</h4>
                                <p className="mb-2"><strong>정답:</strong> {question.answer + 1}번</p>
                                <p>{question.explanation || "이 문제에 대한 추가 해설 데이터가 존재하지 않습니다."}</p>
                            </div>

                            <div className="smart-filter-pad mt-4">
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

                    <div className="q-navigator mt-6 flex justify-between">
                        <button className="btn-secondary" onClick={handlePrev} disabled={currentQIndex === 0}>이전 문제</button>

                        {!isEvaluated ? (
                            <button className="btn-primary" onClick={handleCheckAnswer}>정답 확인 (채점)</button>
                        ) : (
                            <button className="btn-primary" onClick={handleNext} disabled={isLast}>다음 문제 ({currentQIndex + 1}/{allQuestions.length})</button>
                        )}
                    </div>
                </div>

                <aside className="omr-panel glass-panel hidden md:block">
                    <h3>답안 현황</h3>
                    <div className="omr-grid">
                        {allQuestions.map((q, idx) => (
                            <div key={q.id} className="omr-row" onClick={() => setCurrentQIndex(idx)} style={{ cursor: 'pointer' }}>
                                <span className={`omr-num ${idx === currentQIndex ? 'font-bold text-primary' : ''}`}>{idx + 1}</span>
                                {[0, 1, 2, 3, 4].map(opt => (
                                    <span key={opt} className={`omr-marker ${selectedAnswers[q.id] === opt ? 'marked' : ''}`}>
                                        {opt + 1}
                                    </span>
                                ))}
                                {evaluatedQuestions[q.id] && (
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
