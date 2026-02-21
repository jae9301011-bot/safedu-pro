import React, { useState, useEffect } from 'react';
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
        officialStandard: `제69조(시스템 비계의 구조) 사업주는 시스템 비계를 조립하여 사용하는 경우에 다음 각 호의 기준을 준수하여야 한다.
1. 수직재·수평재 및 가새재를 견고하게 연결하는 구조가 되도록 할 것
2. 비계 밑단의 수직재와 받침철물은 밀착되도록 설치하고, 수직재와 받침철물의 연결부의 겹침길이는 비계받침철물 전체길이의 3분의 1 이상이 되도록 할 것
3. 수평재는 수직재와 직각으로 설치하여야 하며, 체결 후 흔들림이 없도록 견고하게 설치할 것
4. 수직재와 수직재의 연결철물은 이탈되지 않도록 견고한 구조로 할 것
5. 벽이음재를 설치하는 경우 수직재와 수평재의 교차부에서 견고하게 설치할 것`,
        officialStandardDate: '[시행 2025. 12. 1.] 고용노동부령 제410호 (최신 개정 반영)'
    },
    {
        id: 2,
        subject: '건설안전 전공필수',
        frequency: '14회 중 8회 출제 (중요)',
        question: '굴착기(백호)를 사용한 굴착 작업 시 발생할 수 있는 주요 재해유형 3가지와 안전대책을 설명하시오.',
        keywords: ['협착', '충돌', '전도', '작업계획서', '신호수', '유도자', '백미러', '전조등', '승차석 외 탑승금지', '버킷', '지반침하'],
        officialStandard: `제200조(접촉의 방지) ① 사업주는 차량계 하역운반기계등을 사용하여 작업을 하는 경우에는 하역 또는 운반 중인 화물이나 그 차량계 하역운반기계등에 접촉되어 근로자가 위험해질 우려가 있는 장소에 근로자를 출입시켜서는 아니 된다. 다만, 제39조에 따른 작업지휘자 또는 유도자를 배치하고 그 차량계 하역운반기계등을 유도하게 하는 경우에는 그러하지 아니하다.
② 차량계 하역운반기계등의 운전자는 제1항 단서의 작업지휘자나 유도자가 유도하는 대로 따라야 한다.`,
        officialStandardDate: '[시행 2025. 12. 1.] 고용노동부령 제410호'
    }
];

export default function EssayExam() {
    const navigate = useNavigate();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [customQuestions, setCustomQuestions] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isGraded, setIsGraded] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser') || 'default';
        const storedCustomMaterial = localStorage.getItem(`${user}_customEssayMaterial`);
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                const adapted = parsed.map((item, index) => ({
                    id: `custom_essay_${index}`,
                    subject: item.subject || '사용자 커스텀 논술',
                    frequency: item.frequency || '직접 업로드 문제',
                    question: item.question || item.text || '내용 없음',
                    keywords: item.keywords ? (Array.isArray(item.keywords) ? item.keywords : item.keywords.split(',').map(k => k.trim())) : [],
                    officialStandard: item.officialStandard || '내부 채점 기준',
                    officialStandardDate: item.officialStandardDate || '해당없음',
                    isCustom: true
                }));
                setCustomQuestions(adapted);
            } catch (e) {
                console.error("Error parsing custom essay materials", e);
            }
        }
    }, []);

    const allQuestions = [...MOCK_SCENARIOS, ...customQuestions];
    const scenario = allQuestions[currentQIndex];
    if (!scenario) return null; // safety check

    const isLast = currentQIndex === allQuestions.length - 1;

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
                        <span className={`badge ${scenario.isCustom ? 'success' : 'warning'}`}>{scenario.subject} (문제 {currentQIndex + 1}/{allQuestions.length}) {scenario.isCustom && '⭐ 신규 업로드'}</span>
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
                                <p className="text-sm font-bold whitespace-pre-wrap">{scenario.officialStandard}</p>
                                <p className="text-xs text-danger font-bold mt-2">※ 기준 법령: {scenario.officialStandardDate}</p>
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
