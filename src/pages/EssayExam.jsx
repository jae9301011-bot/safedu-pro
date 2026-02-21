import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';
import './EssayExam.css';

const MOCK_SCENARIOS = [
    {
        id: 1,
        subject: '건설안전 전공필수',
        frequency: '14회 중 11회 출제 (매우 중요)',
        question: '건설현장에서 시스템 비계 조립 시 준수해야 할 기준 및 안전 조치 사항 5가지를 설명하시오.',
        keywords: ['수직재', '수평재', '가새재', '밑받침철물', '벽이음', '침하 방지', '하중 한도', '작업발판'],
        officialStandard: '산업안전보건기준에 관한 규칙 제69조 (시스템 비계의 구조) 등 관련 조항',
        officialStandardDate: '[시행 2025. 1. 1.] 고용노동부령 제410호 (최신 개정 반영)'
    },
    {
        id: 2,
        subject: '건설안전 전공필수',
        frequency: '14회 중 8회 출제 (중요)',
        question: '굴착기(백호)를 사용한 굴착 작업 시 발생할 수 있는 주요 재해유형 3가지와 안전대책을 설명하시오.',
        keywords: ['협착', '충돌', '전도', '작업계획서', '신호수', '유도자', '백미러', '전조등', '승차석 외 탑승금지', '버킷', '지반침하'],
        officialStandard: '산업안전보건기준에 관한 규칙 제200조 (접촉 방지) 등 굴착기계 관련 규정',
        officialStandardDate: '[시행 2025. 1. 1.] 고용노동부령 제410호'
    }
];

export default function EssayExam() {
    const navigate = useNavigate();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isGraded, setIsGraded] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const scenario = MOCK_SCENARIOS[currentQIndex];
    const isLast = currentQIndex === MOCK_SCENARIOS.length - 1;

    const handleGrade = (submittedAnswer = answer) => {
        // Simple mock logic for AI keyword matching
        const foundKeywords = scenario.keywords.filter(kw => submittedAnswer.includes(kw));
        const coverage = (foundKeywords.length / scenario.keywords.length) * 100;

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
            missing: scenario.keywords.filter(kw => !submittedAnswer.includes(kw)),
            score,
            color,
            coverage: Math.round(coverage)
        });
        setIsGraded(true);
    };

    const handleNext = () => {
        if (!isLast) {
            setCurrentQIndex(prev => prev + 1);
            setAnswer('');
            setIsGraded(false);
            setFeedback(null);
        } else {
            alert('모든 모의고사를 완료했습니다! 대시보드로 이동합니다.');
            navigate('/dashboard');
        }
    };

    return (
        <div className="essay-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>2차 전공필수 (건설안전 주관식 논술) 대비</h2>
                </div>
                <div className="exam-timer">지정 시간: 100분</div>
            </header>

            <main className="essay-main">
                <div className="scenario-panel glass-panel mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="badge warning">{scenario.subject} (문제 {currentQIndex + 1}/{MOCK_SCENARIOS.length})</span>
                        <span className="text-danger font-bold flex items-center gap-2"><AlertTriangle size={18} /> {scenario.frequency}</span>
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
                            <button className="btn-primary" onClick={() => handleGrade(answer)}>AI 자가 채점 및 키워드 분석</button>
                        </div>
                    )}
                </div>

                {isGraded && feedback && (
                    <div className="feedback-panel glass-panel mt-4 fade-in">
                        <div className="feedback-header pb-4 border-b mb-4 flex justify-between items-center">
                            <h3>🤖 AI 분석 리포트</h3>
                            <div className="score-badge" style={{ backgroundColor: `${feedback.color}20`, color: feedback.color, border: `1px solid ${feedback.color}` }}>
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
                            <h4 className="mb-2">💡 AI 총평 가이드</h4>
                            <p className="text-muted text-sm bg-mute p-4 rounded mb-4">
                                시스템 비계 조립의 핵심은 구조적 안정성을 확보하기 위한 '수직재', '수평재', '가새재'의 견고한 연결과 지반의 '침하 방지' 조치(밑받침철물)입니다. 또한 건물과 고정하는 '벽이음'을 규정에 따라 설치하여 넘어짐을 방지하는 안전보건규칙 기준을 서술해야 합니다.
                            </p>

                            <div className="official-standard bg-mute p-4 rounded border-l-4">
                                <h4 className="flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-success" /> 정답 채점 기준 (관련 법령)</h4>
                                <p className="text-sm font-bold">{scenario.officialStandard}</p>
                                <p className="text-xs text-danger font-bold mt-1">※ 기준 법령: {scenario.officialStandardDate}</p>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="btn-secondary flex-1" onClick={() => { setIsGraded(false); setFeedback(null); }}>답안 수정하기</button>
                                <button className="btn-primary flex-1" onClick={handleNext}>{isLast ? '결과 완료' : '다음 문제로 넘어갈래요'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
