import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Repeat, Trash2, LayoutList } from 'lucide-react';
import { MOCK_QUESTIONS } from './MockExam';
import './StudyNote.css';

export default function StudyNote() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [stats, setStats] = useState({ discard: 0, review: 0, keep: 0 });

    const loadNotes = () => {
        const user = localStorage.getItem('currentUser') || 'default';
        const savedState = localStorage.getItem(`${user}_cbtExamState`);
        const storedCustomMaterial = localStorage.getItem(`${user}_customLearningMaterial`);

        let filterStates = {};
        if (savedState) {
            try { filterStates = JSON.parse(savedState).filterStates || {}; } catch (e) { }
        }

        let customQuestions = [];
        if (storedCustomMaterial) {
            try {
                const parsed = JSON.parse(storedCustomMaterial);
                customQuestions = parsed.map((item, index) => ({
                    id: `custom_${index}`,
                    subject: item.subject || '커스텀 문제',
                    text: item.text || item.question || '내용 없음',
                }));
            } catch (e) { }
        }

        const allQuestions = [...MOCK_QUESTIONS, ...customQuestions];
        const displayNotes = [];
        const newStats = { discard: 0, review: 0, keep: 0 };

        allQuestions.forEach(q => {
            const state = filterStates[q.id];
            if (state) {
                newStats[state] = (newStats[state] || 0) + 1;
                displayNotes.push({
                    id: q.id,
                    subject: q.subject || '산업안전보건법령',
                    text: q.question || q.text,
                    type: state,
                    reason: '사용자 지정 노트 (CBT 연동)',
                    date: new Date().toISOString().split('T')[0]
                });
            }
        });

        setNotes(displayNotes.reverse()); // Show newest first
        setStats(newStats);
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleUpdateState = (id, newState) => {
        const user = localStorage.getItem('currentUser') || 'default';
        const savedState = localStorage.getItem(`${user}_cbtExamState`);
        let parsed = { filterStates: {} };
        if (savedState) {
            try { parsed = JSON.parse(savedState); } catch (e) { }
        }

        parsed.filterStates = { ...parsed.filterStates, [id]: newState };
        localStorage.setItem(`${user}_cbtExamState`, JSON.stringify(parsed));
        loadNotes();
    };

    return (
        <div className="note-layout container py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <button className="back-btn mb-2" onClick={() => navigate('/dashboard')}><ArrowLeft /> 대시보드</button>
                    <h2>나만의 스마트 오답 노트</h2>
                    <p className="text-muted">3단계 필터링(버리기/반복학습/일반보관)을 통해 학습량을 최적화하세요.</p>
                </div>
                <div className="filter-summary glass-panel p-4 flex gap-4">
                    <div className="stat discard"><Trash2 /> 버림: {stats.discard}</div>
                    <div className="stat review"><Repeat /> 반복: {stats.review}</div>
                    <div className="stat keep"><LayoutList /> 보관: {stats.keep}</div>
                </div>
            </header>

            <div className="notes-grid">
                {notes.filter(n => n.type === 'review').map(note => (
                    <div key={note.id} className="note-card glass-panel review">
                        <div className="card-header border-b pb-2 mb-4">
                            <span className="badge warning">반복 집중</span>
                            <span className="text-sm text-muted">{note.date}</span>
                        </div>
                        <h4 className="mb-2 text-primary">{note.subject}</h4>
                        <p className="text-main mb-4">{note.text}</p>
                        <div className="bg-mute p-3 rounded text-sm mb-4">
                            <strong>메모: </strong> {note.reason}
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-small outline flex-1" onClick={() => navigate('/cbt')}>다시 풀기</button>
                            <button className="btn-small text-danger" onClick={() => handleUpdateState(note.id, 'discard')}>완벽히 앎 (버리기)</button>
                        </div>
                    </div>
                ))}

                {notes.filter(n => n.type === 'review').length === 0 && (
                    <div className="empty-state p-8 text-center text-muted col-span-2">
                        <p>현재 반복 학습이 필요한 오답 노트가 없습니다.</p>
                        <p className="text-sm mt-2">CBT 모의고사를 풀고 틀린 문제를 추가해보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
