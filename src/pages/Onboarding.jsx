import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { Briefcase, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        experience: '',
        certifications: []
    });

    const handleCerficationToggle = (cert) => {
        setProfile(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    const calculatePath = () => {
        // Basic logic mapping user to track
        const isAdvanced = profile.experience === '3+ years' || profile.certifications.length > 0;

        // In a real app we would save this to context/state management
        const user = localStorage.getItem('currentUser') || 'default';
        if (isAdvanced) {
            localStorage.setItem(`${user}_userTrack`, 'fast-track');
        } else {
            localStorage.setItem(`${user}_userTrack`, 'basic-track');
        }
        localStorage.setItem(`${user}_userProfile`, JSON.stringify(profile));

        navigate('/dashboard');
    };

    return (
        <div className="onboarding-container">
            <div className="onboarding-glass-card">
                <div className="onboarding-header">
                    <ShieldCheck className="brand-icon" size={48} />
                    <h1>SafeEdu Pro</h1>
                    <p className="subtitle">산업안전지도사 스마트 패스메이커</p>
                </div>

                {step === 1 && (
                    <div className="step-content fade-in">
                        <h2>환영합니다! 지원자님의 현재 상황을 알려주세요.</h2>
                        <p className="step-desc">최적의 맞춤형 학습 로드맵(Fast-Track / Basic-Track)을 설계해 드립니다.</p>

                        <div className="options-grid">
                            <button
                                className={`option-card ${profile.experience === 'starter' ? 'selected' : ''}`}
                                onClick={() => setProfile({ ...profile, experience: 'starter' })}
                            >
                                <GraduationCap size={32} />
                                <h3>초심자 (입문)</h3>
                                <p>관련 지식이 처음이거나 체계적인 기본기 학습이 필요합니다.</p>
                            </button>

                            <button
                                className={`option-card ${profile.experience === '3+ years' ? 'selected' : ''}`}
                                onClick={() => setProfile({ ...profile, experience: '3+ years' })}
                            >
                                <Briefcase size={32} />
                                <h3>실무 경력자 (3년 이상)</h3>
                                <p>관련 분야 실무 경력이 있어 일부 과목 면제 대상이 될 수 있습니다.</p>
                            </button>
                        </div>

                        <button
                            className="btn-primary mt-8"
                            onClick={() => setStep(2)}
                            disabled={!profile.experience}
                        >
                            다음 단계 <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content fade-in">
                        <h2>보유하신 자격증이 있나요?</h2>
                        <p className="step-desc">해당되는 자격증을 모두 선택해주세요. 1·2차 시험 일부 과목이 자동 면제 처리됩니다.</p>

                        <div className="checkbox-list">
                            {[
                                { id: 'pe', label: '기술사 (기계, 건설 등 관련 종목)', desc: '1차 일부 및 2차 전공필수 면제 가능' },
                                { id: 'cpla', label: '공인노무사', desc: '1차 기업진단지도 과목 등 면제 가능' },
                                { id: 'phd', label: '관련 전공 박사 학위', desc: '면제 요건 충족 시 적용' }
                            ].map(cert => (
                                <label key={cert.id} className={`cert-checkbox ${profile.certifications.includes(cert.id) ? 'checked' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={profile.certifications.includes(cert.id)}
                                        onChange={() => handleCerficationToggle(cert.id)}
                                    />
                                    <div className="cert-info">
                                        <h4>{cert.label}</h4>
                                        <span>{cert.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="action-buttons mt-8">
                            <button className="btn-secondary" onClick={() => setStep(1)}>이전</button>
                            <button className="btn-primary bounce" onClick={calculatePath}>
                                나만의 로드맵 생성하기 <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative background elements */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
        </div>
    );
}
