import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
    BookOpen,
    Target,
    BrainCircuit,
    AlertTriangle,
    UserCircle,
    UploadCloud,
    FileCheck
} from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [track, setTrack] = useState('basic-track');
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: string }
    const [username, setUsername] = useState('수험생');

    useEffect(() => {
        const user = localStorage.getItem('currentUser') || '수험생';
        setUsername(user);
        const savedUserTrack = localStorage.getItem(`${user}_userTrack`) || 'basic-track';
        const savedProfile = JSON.parse(localStorage.getItem(`${user}_userProfile`) || '{}');
        setTrack(savedUserTrack);
        setProfile(savedProfile);
    }, []);

    const handleCBTNavigate = () => navigate('/exam/cbt');

    // --- File Upload Handlers ---
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
            setUploadStatus({ type: 'error', message: 'JSON 또는 CSV 파일만 업로드 가능합니다.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let parsedData = [];

                if (file.name.endsWith('.json')) {
                    parsedData = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    // Simple CSV parser for demo purposes
                    const lines = content.split('\\n');
                    const headers = lines[0].split(',');
                    for (let i = 1; i < lines.length; i++) {
                        if (!lines[i].trim()) continue;
                        const obj = {};
                        const currentline = lines[i].split(',');
                        for (let j = 0; j < headers.length; j++) {
                            obj[headers[j].trim()] = currentline[j]?.trim();
                        }
                        parsedData.push(obj);
                    }
                }

                if (parsedData.length > 0) {
                    // Store custom data in localStorage to be accessed by MockExam / StudyNote
                    const user = localStorage.getItem('currentUser') || 'default';
                    let existingCustom = [];
                    try {
                        const stored = localStorage.getItem(`${user}_customLearningMaterial`);
                        if (stored) existingCustom = JSON.parse(stored);
                    } catch (e) { }

                    const newData = [...existingCustom, ...parsedData];
                    localStorage.setItem(`${user}_customLearningMaterial`, JSON.stringify(newData));
                    setUploadStatus({ type: 'success', message: `성공! ${parsedData.length}개의 항목이 추가되었습니다.` });

                    setTimeout(() => setUploadStatus(null), 3000); // Clear after 3 seconds
                } else {
                    throw new Error("데이터가 비어있습니다.");
                }

            } catch (err) {
                console.error("File parsing error:", err);
                setUploadStatus({ type: 'error', message: '파일 파싱 실패. 형식을 확인해주세요.' });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar glass-panel">
                <div className="brand">
                    <BookOpen className="brand-logo" />
                    <h2>SafeEdu</h2>
                </div>
                <nav className="nav-menu">
                    <button className="nav-item active"><Target size={20} /> <span>대시보드</span></button>
                    <button className="nav-item" onClick={handleCBTNavigate}><BrainCircuit size={20} /> <span>1차 CBT 기출</span></button>
                    <button className="nav-item" onClick={() => navigate('/exam/essay')}><BookOpen size={20} /> <span>2차 논술 대비</span></button>
                    <button className="nav-item" onClick={() => navigate('/exam/interview')}><BookOpen size={20} /> <span>3차 면접 대비</span></button>
                    <button className="nav-item" onClick={() => navigate('/study/note')}><BookOpen size={20} /> <span>나만의 오답노트</span></button>
                    <button className="nav-item warning" onClick={() => navigate('/gamification/gravity')}><AlertTriangle size={20} /> <span>안티그래비티 존 (Game)</span></button>
                </nav>
                <div className="user-profile">
                    <UserCircle size={32} />
                    <div className="user-info">
                        <span className="user-name">{username}님</span>
                        <span className={`track-badge ${track}`}>{track === 'fast-track' ? '숙련자 코스' : '초심자 코스'}</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="dashboard-header fade-in">
                    <div>
                        <h1>환영합니다! 오늘 학습을 시작해볼까요?</h1>
                        <p className="subtitle">
                            {track === 'fast-track'
                                ? '보유 자격에 따른 면제 과목(1차 등)이 반영된 단기 합격 위주 최적화 플랜이 설정되었습니다.'
                                : '초심자를 위한 폭넓고 얕은 범위부터 차근차근 시작하는 정석 플랜이 설정되었습니다.'}
                        </p>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Ebbinghaus Forgetting Curve Widget */}
                    <section className="dashboard-card ebbinghaus-card fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="card-header">
                            <h3>🧠 망각곡선 기반 복습 알림</h3>
                            <span className="badge urgent">3건 대기</span>
                        </div>
                        <div className="card-body">
                            <p className="text-sm var-text-muted mb-4">어제 공부한 법령의 40%가 날아가기 직전입니다! 서둘러 복습하세요.</p>
                            <div className="review-items">
                                <div className="review-item">
                                    <div className="review-progress" style={{ width: '90%' }}></div>
                                    <div className="review-content">
                                        <span>산업안전보건법 제 38조 (위험조치)</span>
                                        <button className="btn-small outline" onClick={handleCBTNavigate}>복습하기</button>
                                    </div>
                                </div>
                                <div className="review-item">
                                    <div className="review-progress warning" style={{ width: '40%' }}></div>
                                    <div className="review-content">
                                        <span>타워크레인 붕괴 원인 (14회 기출)</span>
                                        <button className="btn-small outline" onClick={handleCBTNavigate}>복습하기</button>
                                    </div>
                                </div>
                                <div className="review-item">
                                    <div className="review-progress danger" style={{ width: '20%' }}></div>
                                    <div className="review-content">
                                        <span>위험성 평가 절차 5단계</span>
                                        <button className="btn-small outline" onClick={handleCBTNavigate}>복습하기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Track Specific Recommended Activity */}
                    <section className="dashboard-card action-card fade-in" style={{ animationDelay: '0.2s' }}>
                        {track === 'fast-track' ? (
                            <>
                                <div className="card-header">
                                    <h3>⚡ 단기합격 Fast-Track</h3>
                                </div>
                                <div className="card-body centered">
                                    <div className="stat-circle">
                                        <span className="stat-val">320</span>
                                        <span className="stat-label">누적 오답수</span>
                                    </div>
                                    <p>아는 문제는 과감히 버리고, 자주 틀리는 문제만 집중 공략하세요!</p>
                                    <button className="btn-primary full-width mt-4" onClick={handleCBTNavigate}>오답 집중 격파하기</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="card-header">
                                    <h3>📝 서브노트 작성 Basic-Track</h3>
                                </div>
                                <div className="card-body centered">
                                    <div className="stat-circle">
                                        <span className="stat-val">12</span>
                                        <span className="stat-label">작성 완료 노트</span>
                                    </div>
                                    <p>'먹보의 법칙' : 얇고 넓게 1차 객관식을 접하며 핵심 키워드 위주로 나만의 노트를 구성하세요.</p>
                                    <button className="btn-primary full-width mt-4" onClick={() => navigate('/study/note')}>새 서브노트 작성</button>
                                </div>
                            </>
                        )}
                    </section>

                    {/* File Upload Widget */}
                    <section className="dashboard-card upload-card fade-in" style={{ animationDelay: '0.25s' }}>
                        <div className="card-header">
                            <h3>📁 개인 자료 업로드 (JSON/CSV)</h3>
                        </div>
                        <div className="card-body">
                            <div
                                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload').click()}
                            >
                                <UploadCloud size={40} className="upload-icon" />
                                <p>파일을 여기로 드래그 하거나 클릭하여 업로드</p>
                                <span className="text-sm var-text-muted">내 모의고사 기출문제 또는 최신 법령 데이터</span>
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".json,.csv"
                                    onChange={handleFileInput}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {uploadStatus && (
                                <div className={`upload-feedback fade-in ${uploadStatus.type}`}>
                                    {uploadStatus.type === 'success' ? <FileCheck size={16} /> : <AlertTriangle size={16} />}
                                    <span>{uploadStatus.message}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Quick CBT Stats */}
                    <section className="dashboard-card cbt-stats-card fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="card-header">
                            <h3>📊 1차 CBT 성취도 (가상)</h3>
                        </div>
                        <div className="card-body">
                            <div className="bar-chart-row">
                                <span className="label">산업안전보건법령</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '75%', background: 'var(--color-primary)' }}></div></div>
                                <span className="val">75점</span>
                            </div>
                            <div className="bar-chart-row">
                                <span className="label">산업안전일반</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '82%', background: 'var(--color-success)' }}></div></div>
                                <span className="val">82점</span>
                            </div>
                            <div className="bar-chart-row">
                                <span className="label">기업진단지도</span>
                                <div className="bar-bg"><div className="bar-fill" style={{ width: '55%', background: 'var(--color-danger)' }}></div></div>
                                <span className="val warning-text">55점 (과락 주의)</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
