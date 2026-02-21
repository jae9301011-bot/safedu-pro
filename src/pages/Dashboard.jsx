import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
    BookOpen,
    Target,
    BrainCircuit,
    AlertTriangle,
    UserCircle
} from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [track, setTrack] = useState('basic-track');

    useEffect(() => {
        const savedUserTrack = localStorage.getItem('userTrack') || 'basic-track';
        const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        setTrack(savedUserTrack);
        setProfile(savedProfile);
    }, []);

    const handleCBTNavigate = () => navigate('/exam/cbt');

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
                        <span className="user-name">수험생님</span>
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
                                        <button className="btn-small outline">복습하기</button>
                                    </div>
                                </div>
                                <div className="review-item">
                                    <div className="review-progress warning" style={{ width: '40%' }}></div>
                                    <div className="review-content">
                                        <span>타워크레인 붕괴 원인 (14회 기출)</span>
                                        <button className="btn-small outline">복습하기</button>
                                    </div>
                                </div>
                                <div className="review-item">
                                    <div className="review-progress danger" style={{ width: '20%' }}></div>
                                    <div className="review-content">
                                        <span>위험성 평가 절차 5단계</span>
                                        <button className="btn-small outline">복습하기</button>
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
                                    <button className="btn-primary full-width mt-4">새 서브노트 작성</button>
                                </div>
                            </>
                        )}
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
