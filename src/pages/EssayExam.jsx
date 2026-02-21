import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';
import './EssayExam.css';

import ESSAY_QUESTIONS_DATA from '../data/essay_questions.json';

export default function EssayExam() {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('currentUser') || 'default';
    const storageKey = `${currentUser} _essayExamState`;

    const getInitialState = () => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return { currentQIndex: 0, answers: {}, evaluatedQuestions: {}, shuffledOrder: null };
    };

    const initialState = getInitialState();

    const [currentQIndex, setCurrentQIndex] = useState(initialState.currentQIndex);
    const [answers, setAnswers] = useState(initialState.answers);
    const [evaluatedQuestions, setEvaluatedQuestions] = useState(initialState.evaluatedQuestions || {});

    const [allQuestions, setAllQuestions] = useState([]);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const storedCustomMaterial = localStorage.getItem(`${currentUser} _customEssayMaterial`);
        let customQuestions = [];
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                customQuestions = parsed.map((item, index) => ({
                    id: `custom_essay_${index} `,
                    subject: item.subject || '사용자 커스텀 논술',
                    frequency: item.frequency || '직접 업로드 문제',
                    question: item.question || item.text || '내용 없음',
                    keywords: item.keywords ? (Array.isArray(item.keywords) ? item.keywords : item.keywords.split(',').map(k => k.trim())) : [],
                    officialStandard: item.officialStandard || '내부 채점 기준',
                    officialStandardDate: item.officialStandardDate || '해당없음',
                    isCustom: true
                }));
            } catch (e) {
                console.error("Error parsing custom essay materials", e);
            }
        }

        let combined = [...ESSAY_QUESTIONS_DATA, ...customQuestions];

        const savedOrder = initialState.shuffledOrder;
        if (savedOrder && savedOrder.length === combined.length && combined.every(q => savedOrder.includes(q.id))) {
            combined.sort((a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id));
        } else {
            combined.sort(() => Math.random() - 0.5);
            const newOrder = combined.map(q => q.id);
            localStorage.setItem(storageKey, JSON.stringify({ ...initialState, shuffledOrder: newOrder }));
        }

        setAllQuestions(combined);
    }, [currentUser]);

    useEffect(() => {
        if (allQuestions.length === 0) return;
        const currentOrder = allQuestions.map(q => q.id);
        const stateToSave = { currentQIndex, answers, evaluatedQuestions, shuffledOrder: currentOrder };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));

        // Restore local answer text box and feedback if it was evaluated
        const qId = allQuestions[currentQIndex]?.id;
        if (qId) {
            setAnswer(answers[qId] || '');
            if (evaluatedQuestions[qId]) {
                generateMockFeedback(answers[qId] || '', allQuestions[currentQIndex]);
            } else {
                setFeedback(null);
            }
        }
    }, [currentQIndex, answers, evaluatedQuestions, storageKey, allQuestions]);

    if (allQuestions.length === 0) return <div className="p-8 text-center">논술 문항을 불러오는 중입니다...</div>;

    const scenario = allQuestions[currentQIndex];
    if (!scenario) return null;

    const isLast = currentQIndex === allQuestions.length - 1;
    const isGraded = evaluatedQuestions[scenario.id] === true;

    const generateMockFeedback = (submittedAnswer, currentScenario) => {
        const foundKeywords = currentScenario.keywords.filter(kw => submittedAnswer.includes(kw));
        const coverage = currentScenario.keywords.length > 0 ? (foundKeywords.length / currentScenario.keywords.length) * 100 : 100;

        let score = 'Needs Work';
        let color = 'var(--color-danger)';
        if (coverage > 70) {
            score = 'Excellent';
            color = 'var(--color-success)';
        } else if (coverage > 40) {
            score = 'Good';
            color = 'var(--color-warning)';
        }

        setFeedback({
            found: foundKeywords,
            missing: currentScenario.keywords.filter(kw => !submittedAnswer.includes(kw)),
            score,
            color,
            coverage: Math.round(coverage)
        });
    };

    const handleGrade = (submittedAnswer = answer) => {
        setAnswers(prev => ({ ...prev, [scenario.id]: submittedAnswer }));
        setEvaluatedQuestions(prev => ({ ...prev, [scenario.id]: true }));
    };

    const handleNext = () => {
        if (!isLast) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            alert('모든 논술 모의고사를 완료했습니다! 대시보드로 이동합니다.');
            navigate('/dashboard');
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
    };

    return (
        <div className="essay-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>2차 전공필수 (건설안전 주관식 논술) 대비</h2>
                </div>
            </header>

            <main className="essay-main">
                <div className="scenario-panel glass-panel mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className={`badge ${scenario.isCustom ? 'success' : 'warning'} `}>{scenario.subject} (문제 {currentQIndex + 1}/{allQuestions.length}) {scenario.isCustom && '⭐ 신규 업로드'}</span>
                        <span className="text-danger font-bold flex items-center gap-2"><AlertTriangle size={18} /> {scenario.frequency || "모의고사"}</span>
                    </div>
                    <h3 className="text-xl mb-2">{scenario.question}</h3>
                    <p className="text-muted text-sm">💡 답안에 핵심 법적 근거 및 필수 키워드가 포함되어야 고득점이 가능합니다.</p>
                </div>

                <div className="editor-panel glass-panel">
                    <h4 className="flex items-center gap-2 mb-4"><Edit3 size={18} /> 답안 작성란</h4>
                    <textarea
                        className="essay-textarea"
                        placeholder="이곳에 논술 답안을 작성하세요. (실제 시험의 답안지 1~2장 분량)"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={isGraded}
                    ></textarea>

                    {!isGraded && (
                        <div className="flex justify-between items-center mt-4">
                            <button className="btn-small text-muted outline" onClick={() => handleGrade('')}>모르겠습니다 (오답 제출)</button>
                            <button className="btn-primary" onClick={() => handleGrade(answer)}>AI 자가 채점 및 해설 보기</button>
                        </div>
                    )}
                </div>

                {isGraded && feedback && (
                    <div className="feedback-panel glass-panel mt-4 fade-in">
                        <div className="feedback-header pb-4 border-b mb-4 flex justify-between items-center">
                            <h3>🤖 AI 분석 리포트</h3>
                            <div className="score-badge" style={{ backgroundColor: `${feedback.color} 20`, color: feedback.color, border: `1px solid ${feedback.color} ` }}>
                                {feedback.score} (키워드 매칭: {feedback.coverage}%)
                            </div>
                        </div>

                        <div className="keywords-grid">
                            <div>
                                <h4 className="text-success flex items-center gap-2 mb-2"><CheckCircle size={18} /> 포함된 핵심 키워드 ({feedback.found.length})</h4>
                                <div className="tags">
                                    {feedback.found.map(kw => <span key={kw} className="tag tag-success">{kw}</span>)}
                                    {feedback.found.length === 0 && <span className="text-muted text-sm">포함된 키워드가 없습니다.</span>}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-danger flex items-center gap-2 mb-2"><AlertTriangle size={18} /> 누락된 핵심 키워드 ({feedback.missing.length})</h4>
                                <div className="tags">
                                    {feedback.missing.map(kw => <span key={kw} className="tag tag-danger">{kw}</span>)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t">
                            <h4 className="mb-2">💡 답안 및 해설 가이드</h4>

                            <div className="official-standard bg-mute p-4 rounded border-l-4">
                                <h4 className="flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-success" /> 정답 채점 기준 (관련 법령 등)</h4>
                                <p className="text-sm font-bold whitespace-pre-wrap">{scenario.officialStandard}</p>
                                {scenario.officialStandardDate && scenario.officialStandardDate !== '해당없음' && (
                                    <p className="text-xs text-danger font-bold mt-2">※ 기준 법령: {scenario.officialStandardDate}</p>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="btn-secondary flex-1" onClick={() => {
                                    setEvaluatedQuestions(prev => ({ ...prev, [scenario.id]: false }));
                                    setFeedback(null);
                                }}>답안 다시 작성하기 (수정)</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="q-navigator mt-6 flex justify-between">
                    <button className="btn-secondary" onClick={handlePrev} disabled={currentQIndex === 0}>이전 문제</button>
                    {isGraded && (
                        <button className="btn-primary" onClick={handleNext}>{isLast ? '결과 완료' : `다음 문제(${currentQIndex + 1}/${allQuestions.length})`}</button >
                    )}
                </div >
            </main >
        </div >
    );
}
