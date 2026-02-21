import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, Trash2, LayoutList } from 'lucide-react';
import './StudyNote.css';

const MOCK_NOTES = [
    {
        id: 1,
        subject: '산업안전보건법령',
        text: '도급인의 의무 중 관계수급인 근로자 지원 사항 확인',
        type: 'review', // discard, review, keep
        reason: '자주 틀리는 사항 - 건강진단 실시 비용 부담의 주체 혼동',
        date: '2025-02-21'
    },
    {
        id: 2,
        subject: '산업안전일반',
        text: '재해 발생 메커니즘 5단계 암기',
        type: 'review',
        reason: '하인리히 3단계(불안전한 상태/행동)와 4단계(사고) 구분 실수',
        date: '2025-02-20'
    },
    {
        id: 3,
        subject: '기업진단지도',
        text: '테일러 시스템 목적',
        type: 'discard',
        reason: '완벽하게 이해함',
        date: '2025-02-18'
    }
];

export default function StudyNote() {
    const navigate = useNavigate();

    return (
        <div className="note-layout container py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <button className="back-btn mb-2" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>나만의 스마트 오답 노트</h2>
                    <p className="text-muted">3단계 필터링(버리기/반복학습/일반보관)을 통해 학습량을 최적화하세요.</p>
                </div>
                <div className="filter-summary glass-panel p-4 flex gap-4">
                    <div className="stat discard"><Trash2 /> 버림: 1</div>
                    <div className="stat review"><Repeat /> 반복: 2</div>
                    <div className="stat keep"><LayoutList /> 보관: 0</div>
                </div>
            </header>

            <div className="notes-grid">
                {/* Focus on review items first */}
                {MOCK_NOTES.filter(n => n.type === 'review').map(note => (
                    <div key={note.id} className="note-card glass-panel review">
                        <div className="card-header border-b pb-2 mb-4">
                            <span className="badge warning">반복 집중</span>
                            <span className="text-sm text-muted">{note.date}</span>
                        </div>
                        <h4 className="mb-2 text-primary">{note.subject}</h4>
                        <p className="text-main mb-4">{note.text}</p>
                        <div className="bg-mute p-3 rounded text-sm mb-4">
                            <strong>원인: </strong> {note.reason}
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-small outline flex-1">다시 풀기</button>
                            <button className="btn-small text-danger">완벽히 앎 (버리기)</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
