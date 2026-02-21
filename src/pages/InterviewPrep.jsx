import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import './InterviewPrep.css';

const INTERVIEW_QUESTIONS = [
    {
        id: 1,
        text: "건설현장에서 타워크레인 설치 및 해체 작업 시 발생할 수 있는 주요 재해 유형과 예방 대책(안전보건규칙)을 설명해 보세요.",
        keywords: ['붕괴', '추락', '낙하', '작업계획서', '신호수', '풍속', '작업지휘자'],
        officialStandard: `제142조(타워크레인의 작업제한) 사업주는 타워크레인을 설치·수리·점검 또는 해체하는 작업을 하는 경우에 순간풍속이 초당 10미터를 초과하는 경우에는 그 작업을 중지하여야 한다.
제38조(사전조사 및 작업계획서의 작성 등) 제1항제11호 근로자의 추락위험, 소형장비의 낙하위험, 작업반경 내 근로자 충돌위험을 예방하기 위한 안전조치 계획서 작성.`,
        officialStandardDate: '[시행 2025. 12. 1.] 고용노동부령 최신 개정안 적용'
    },
    {
        id: 2,
        text: "거푸집 동바리 조립 시 발생할 수 있는 붕괴 사고의 주요 원인과 이를 예방하기 위한 안전 조치 기준을 3가지 이상 제시해 주세요.",
        keywords: ['조립도', '구조검토', '수평연결재', '가새', '지반 침하', '깔판', '콘크리트 타설', '편심'],
        officialStandard: `제332조(거푸집동바리등의 안전조치) ① 사업주는 거푸집동바리등을 조립하는 경우에는 그 구조를 검토한 후 조립도를 작성하고, 그 조립도에 따라 조립하도록 하여야 한다.
② 사업주는 동바리로 사용하는 파이프 서포트, 강관, 통나무 등의 지주(이하 "동바리"라 한다)에 대하여는 다음 각 호의 사항을 준수하여야 한다.
1. 지반의 침하를 방지하기 위하여 깔판·깔목 등을 사용하거나 콘크리트를 타설하는 등의 조치를 할 것
2. 동바리의 상하 고정 및 미끄러짐 방지 조치를 하고, 붕괴의 위험이 없도록 할 것`,
        officialStandardDate: '[시행 2025. 12. 1.] 고용노동부령 기준'
    }
];

export default function InterviewPrep() {
    const navigate = useNavigate();
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [customQuestions, setCustomQuestions] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);

    const recognitionRef = useRef(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser') || 'default';
        const storedCustomMaterial = localStorage.getItem(`${user}_customInterviewMaterial`);
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                const adapted = parsed.map((item, index) => ({
                    id: `custom_int_${index}`,
                    text: item.question || item.text || '내용 없음',
                    keywords: item.keywords ? (Array.isArray(item.keywords) ? item.keywords : item.keywords.split(',').map(k => k.trim())) : [],
                    officialStandard: item.officialStandard || '내부 채점 기준',
                    officialStandardDate: item.officialStandardDate || '해당없음',
                    isCustom: true
                }));
                setCustomQuestions(adapted);
            } catch (e) {
                console.error("Error parsing custom interview materials", e);
            }
        }
    }, []);

    const allQuestions = [...INTERVIEW_QUESTIONS, ...customQuestions];
    const question = allQuestions[currentQIndex];
    if (!question) return null; // safety check

    const isLast = currentQIndex === allQuestions.length - 1;

    useEffect(() => {
        // Initialize Web Speech API if supported
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'ko-KR';

            recognitionRef.current.onresult = (event) => {
                let finalStr = '';
                let interimStr = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalStr += event.results[i][0].transcript;
                    } else {
                        interimStr += event.results[i][0].transcript;
                    }
                }
                setTranscript(prev => prev + finalStr + (interimStr ? ' ' + interimStr : ''));
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                if (event.error === 'not-allowed') {
                    alert('마이크 접근 권한이 필요합니다.');
                    setIsRecording(false);
                }
            };

            recognitionRef.current.onend = () => {
                // Auto-restart if we are still supposed to be recording but it stopped (common API behaviour)
                if (isRecording) {
                    try { recognitionRef.current.start(); } catch (e) { }
                }
            };
        } else {
            alert('현재 브라우저에서는 음성 인식 기능을 지원하지 않습니다. Chrome 브라우저를 권장합니다.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            analyzeAudio();
        } else {
            setTranscript('');
            setFeedback(null);
            setIsRecording(true);
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const analyzeAudio = (forcedTranscript) => {
        const textToAnalyze = forcedTranscript !== undefined ? forcedTranscript : transcript;
        // Mock analysis of transcript against keywords
        const foundKw = question.keywords.filter(kw => textToAnalyze.includes(kw));
        const coverage = Math.round((foundKw.length / question.keywords.length) * 100);

        setFeedback({
            coverage,
            found: foundKw,
            missing: question.keywords.filter(kw => !textToAnalyze.includes(kw))
        });
    };

    const handleNext = () => {
        if (!isLast) {
            setCurrentQIndex(prev => prev + 1);
            setTranscript('');
            setFeedback(null);
        } else {
            alert('모든 면접 질문을 완료했습니다! 대시보드로 이동합니다.');
            navigate('/dashboard');
        }
    };

    return (
        <div className="interview-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>3차 면접시험 AI 시뮬레이터 (건설안전)</h2>
                </div>
            </header>

            <main className="interview-main">
                <div className="interview-avatar glass-panel">
                    <div className="avatar-circle">
                        <Volume2 size={48} className={isRecording ? 'pulse' : ''} />
                    </div>
                    <div className="avatar-speech">
                        <span className={`badge ${question.isCustom ? 'success' : 'warning'} mb-2 inline-block`}>질문 {currentQIndex + 1}/{allQuestions.length} {question.isCustom && '⭐ 신규 업로드'}</span>
                        <h3>Q. {question.text}</h3>
                        <button className="btn-small mt-2" onClick={() => { }}><Volume2 size={16} /> 질문 다시 듣기</button>
                    </div>
                </div>

                <div className="interview-recorder glass-panel mt-4">
                    <div className="mic-status flex justify-between items-center mb-4 border-b pb-4">
                        <div>
                            <h4 className="flex items-center gap-2">
                                <Mic className={isRecording ? 'text-danger fade-pulse' : 'text-muted'} />
                                {isRecording ? '답변을 듣고 있습니다...' : '마이크 대기 중'}
                            </h4>
                        </div>
                        <div className="flex gap-2">
                            {!isRecording && !feedback && (
                                <button className="btn-small text-muted outline" onClick={() => analyzeAudio('')}>
                                    모르겠습니다 (답변 포기)
                                </button>
                            )}
                            <button
                                className={`btn-record ${isRecording ? 'recording' : ''}`}
                                onClick={toggleRecording}
                            >
                                {isRecording ? <><Square size={20} /> 답변 완료</> : <><Mic size={20} /> 답변 시작하기</>}
                            </button>
                        </div>
                    </div>

                    <div className="transcript-box">
                        {transcript || <span className="text-muted">이곳에 음성 인식 결과가 실시간으로 표시됩니다.</span>}
                    </div>
                </div>

                {feedback && (
                    <div className="interview-feedback glass-panel mt-4 fade-in border-t-brand">
                        <h3 className="mb-4">📊 모의 면접 평가 결과</h3>
                        <div className="coverage-bar-wrap mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">키워드 적중률</span>
                                <span className="font-bold text-primary">{feedback.coverage}%</span>
                            </div>
                            <div className="bar-bg w-full"><div className="bar-fill bg-primary dropdown-anim" style={{ width: `${feedback.coverage}%` }}></div></div>
                        </div>

                        <div className="keywords-grid">
                            <div className="kw-box success-box">
                                <h4><CheckCircle size={18} /> 발성된 키워드</h4>
                                <div className="tags mt-2">
                                    {feedback.found.map(kw => <span key={kw} className="tag tag-success">{kw}</span>)}
                                    {feedback.found.length === 0 && <span className="text-muted">없음</span>}
                                </div>
                            </div>
                            <div className="kw-box warning-box">
                                <h4><AlertCircle size={18} /> 보완 필요 키워드</h4>
                                <div className="tags mt-2">
                                    {feedback.missing.map(kw => <span key={kw} className="tag tag-warning">{kw}</span>)}
                                    {feedback.missing.length === 0 && <span className="text-muted">완벽합니다!</span>}
                                </div>
                            </div>
                        </div>

                        <div className="official-standard mt-6 bg-mute p-4 rounded border-l-4">
                            <h4 className="flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-success" /> 정답 채점 기준 (관련 법령)</h4>
                            <p className="text-sm font-bold whitespace-pre-wrap">{question.officialStandard}</p>
                            <p className="text-xs text-danger font-bold mt-2">※ 기준 법령: {question.officialStandardDate}</p>
                        </div>

                        <p className="mt-6 text-sm text-muted bg-mute p-3 rounded">
                            ※ 건설 면접에서는 명확한 재해 유형과 법적 관리 감독 절차를 연관 지어 답변하는 것이 중요합니다.
                        </p>

                        <div className="flex gap-2 mt-6">
                            <button className="btn-secondary flex-1" onClick={() => { setFeedback(null); setTranscript(''); }}>다시 답변하기</button>
                            <button className="btn-primary flex-1" onClick={handleNext}>{isLast ? '결과 완료' : '다음 질문으로 넘어가기'}</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
