
import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ExamDetailsForm from './components/ExamDetailsForm';
import BookSelection from './components/BookSelection';
import Profile from './components/Profile';
import { PaperCreator } from './components/PaperCreator';
import PaperPreviewPage from './components/paper-creator/PaperPreviewPage';

// Navigation wrapper component that provides navigation context
const AppContent = () => {
  // State management for persistence across page refreshes
  const [examDetails] = useState<any>(() => {
    const saved = localStorage.getItem('examDetails');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedChapters] = useState<any>(() => {
    const saved = localStorage.getItem('selectedChapters');
    return saved ? JSON.parse(saved) : [];
  });
  const [previewPaper] = useState<any>(() => {
    const saved = localStorage.getItem('previewPaper');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state to localStorage
  React.useEffect(() => {
    if(examDetails) {
      localStorage.setItem('examDetails', JSON.stringify(examDetails));
      console.log("Exam Details saved to localStorage in App.tsx:", examDetails);
    }
  }, [examDetails]);

  React.useEffect(() => {
    if(selectedChapters) {
      localStorage.setItem('selectedChapters', JSON.stringify(selectedChapters));
    }
  }, [selectedChapters]);

  React.useEffect(() => {
    if(previewPaper) {
      localStorage.setItem('previewPaper', JSON.stringify(previewPaper));
    }
  }, [previewPaper]);

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
          <Footer />
        </div>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/exam-form" element={<ExamDetailsForm />} />
      <Route path="/book-selection" element={<BookSelection />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/paper-creator" element={<PaperCreator />} />
      <Route path="/paper-preview" element={
        <PaperPreviewPage />
      } />
    </Routes>
  );
};

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;