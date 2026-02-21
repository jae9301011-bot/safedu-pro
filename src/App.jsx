import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import MockExam from './pages/MockExam';
import EssayExam from './pages/EssayExam';
import InterviewPrep from './pages/InterviewPrep';
import StudyNote from './pages/StudyNote';
import GravityModes from './pages/gamification/GravityModes';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam/cbt" element={<MockExam />} />
        <Route path="/exam/essay" element={<EssayExam />} />
        <Route path="/exam/interview" element={<InterviewPrep />} />
        <Route path="/study/note" element={<StudyNote />} />
        <Route path="/gamification/gravity" element={<GravityModes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
