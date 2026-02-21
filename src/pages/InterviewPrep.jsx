import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import './InterviewPrep.css';

const INTERVIEW_QUESTIONS = [
    {
        id: 1,
        text: "최근 중대재해처벌법 시행 이후 중요성이 커진 '위험성 평가'의 정의와 실시 시기에 대해 설명해 보세요.",
        keywords: ['유해위험요인', '파악', '감소대책', '수립', '최초평가', '수시평가', '정기평가']
    }
];

export default function InterviewPrep() {
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState(null);

    const recognitionRef = useRef(null);
    const question = INTERVIEW_QUESTIONS[0]; // mock first question

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

    const analyzeAudio = () => {
        // Mock analysis of transcript against keywords
        const foundKw = question.keywords.filter(kw => transcript.includes(kw));
        const coverage = Math.round((foundKw.length / question.keywords.length) * 100);

        setFeedback({
            coverage,
            found: foundKw,
            missing: question.keywords.filter(kw => !transcript.includes(kw))
        });
    };

    return (
        <div className="interview-layout">
            <header className="exam-header glass-panel">
                <div className="exam-info">
                    <button className="back-btn" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>3차 면접시험 AI 시뮬레이터</h2>
                </div>
            </header>

            <main className="interview-main">
                <div className="interview-avatar glass-panel">
                    <div className="avatar-circle">
                        <Volume2 size={48} className={isRecording ? 'pulse' : ''} />
                    </div>
                    <div className="avatar-speech">
                        <h3>Q. {question.text}</h3>
                        <button className="btn-small mt-2"><Volume2 size={16} /> 질문 다시 듣기</button>
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
                        <button
                            className={`btn-record ${isRecording ? 'recording' : ''}`}
                            onClick={toggleRecording}
                        >
                            {isRecording ? <><Square size={20} /> 답변 완료</> : <><Mic size={20} /> 답변 시작하기</>}
                        </button>
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

                        <p className="mt-6 text-sm text-muted bg-mute p-3 rounded">
                            ※ 면접에서는 정확한 법적 용어 사용이 중요합니다. '유해위험요인', '수시평가' 등의 핵심 단어를 의식적으로 발음하는 연습을 권장합니다.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
