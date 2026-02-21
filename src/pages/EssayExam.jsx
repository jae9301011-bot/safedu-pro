import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, CheckCircle, AlertTriangle } from 'lucide-react';
import './EssayExam.css';

const MOCK_SCENARIO = {
    subject: '기계안전 전공필수',
    frequency: '14회 중 12회 출제 (매우 중요)',
    question: '산업용 로봇의 작동 중 발생할 수 있는 주요 위험 요인 3가지를 설명하고, 이에 대한 방호 장치 및 안전 조치 기준을 논하시오.',
    keywords: ['협착', '충돌', '오작동', '안전매트', '광전자식 방호장치', '울타리', '비상정지장치', '안전플러그', '교시작업']
};

export default function EssayExam() {
    const navigate = useNavigate();
    const [answer, setAnswer] = useState('');
    const [isGraded, setIsGraded] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const handleGrade = () => {
        // Simple mock logic for AI keyword matching
        const foundKeywords = MOCK_SCENARIO.keywords.filter(kw => answer.includes(kw));
        const coverage = (foundKeywords.length / MOCK_SCENARIO.keywords.length) * 100;

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
            missing: MOCK_SCENARIO.keywords.filter(kw => !answer.includes(kw)),
            score,
            color,
            coverage: Math.round(coverage)
        });
        setIsGraded(true);
    };

    return (
        <div className="essay-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>2차 전공필수 (주관식 논술) 대비</h2>
                </div>
                <div className="exam-timer">지정 시간: 100분</div>
            </header>

            <main className="essay-main">
                <div className="scenario-panel glass-panel mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="badge warning">{MOCK_SCENARIO.subject}</span>
                        <span className="text-danger font-bold flex items-center gap-2"><AlertTriangle size={18} /> {MOCK_SCENARIO.frequency}</span>
                    </div>
                    <h3 className="text-xl mb-2">{MOCK_SCENARIO.question}</h3>
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
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary" onClick={handleGrade}>AI 자가 채점 및 키워드 분석</button>
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
                            <p className="text-muted text-sm bg-mute p-4 rounded">
                                산업용 로봇의 위험 요인은 근로자와의 '협착' 및 '충돌'이 핵심입니다. 방호 장치로는 광전자식 방호장치와 방호울 등을 필수적으로 명시해야 하며, 수리 및 교시 작업 시에는 반드시 전원을 차단하고 '안전플러그'를 확보하는 안전 조치 기준(안전보건규칙)을 서술해야 감점을 피할 수 있습니다.
                            </p>
                            <button className="btn-secondary mt-4 w-full" onClick={() => { setIsGraded(false); setFeedback(null); }}>답안 수정하기</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
