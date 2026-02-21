import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, ArrowRight } from 'lucide-react';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        // Save current user to local storage for namespacing other data
        localStorage.setItem('currentUser', username.trim());

        // Check if user has an existing track setup
        const existingTrack = localStorage.getItem(`${username.trim()}_userTrack`);

        if (existingTrack) {
            navigate('/dashboard');
        } else {
            navigate('/onboarding');
        }
    };

    return (
        <div className="login-layout">
            <div className="login-panel glass-panel">
                <div className="login-header">
                    <BookOpen className="brand-logo mb-4" size={48} />
                    <h2>SafeEdu Pro</h2>
                    <p className="text-muted mt-2">산업안전지도사 스마트 패스메이커</p>
                </div>

                <form className="login-form mt-8" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>아이디 (학습자명)</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label>비밀번호</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                placeholder="비밀번호를 입력하세요 (제한 없음)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-muted mt-2">※ 데모 버전: 원하는 정보를 자유롭게 입력하여 사용할 수 있습니다.</p>
                    </div>

                    <button type="submit" className="btn-primary full-width mt-8 flex justify-center items-center gap-2">
                        로그인 및 학습 시작하기 <ArrowRight size={18} />
                    </button>
                </form>
            </div>

            <div className="login-background-elements">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
            </div>
        </div>
    );
}
