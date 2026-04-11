
import React from 'react';
import { useState, useEffect } from 'react';
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
import type { NavigationPage, NavigationData } from './types/navigation';
import { set } from 'react-hook-form';

interface ExamDetails {
  schoolName: string;
  examName: string;
  classId: string;
  subjectId: string;
  boardId: string;
  timeDuration: string;
  maxMarks: string;
  examInstructions: string;
}

interface SelectedChapter {
  id: string;
  name: string;
  bookName: string;
  bookId: number;
  selected: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile' | 'paper-creator' | 'paper-preview' >('home');
  const [examDetails, setExamDetails] = useState<any>(() => {
    const saved = localStorage.getItem('examDetails');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedChapters, setSelectedChapters] = useState<any>(() => {
    const saved = localStorage.getItem('selectedChapters');
    return saved ? JSON.parse(saved) : [];
  });
  const [previewPaper, setPreviewPaper] = useState<any>(() => {
    const saved = localStorage.getItem('previewPaper');
    return saved ? JSON.parse(saved) : null;
  });
  const [navigationState, setNavigationState] = useState<any>(null);


  const handleNavigation = (page: any, data?: any) => {
    setCurrentPage(page);
    console.log("Navigation State in App.tsx after setting:", data);
    
    if (data) {
      if (data?.from){
        setNavigationState(data.from);
      }
      if (data?.examDetails) {
        setExamDetails(data.examDetails);
      }
      if (data?.selectedChapters) {
        setSelectedChapters(data.selectedChapters);
      }
      if (data?.paperData) {
        setPreviewPaper(data.paperData);
      }
      // if (!data.examDetails && !data.selectedChapters && !data.paperData) {
      //   setExamDetails(data);
      //   setSelectedChapters([]);
      //   setPreviewPaper(null);
      // }
      // if(!data.from) {
      //   setNavigationState(data?.from);
      // }
    }

    useEffect(() => {
      if(examDetails) {
        localStorage.setItem('examDetails', JSON.stringify(examDetails));
        console.log("Exam Details saved to localStorage in App.tsx:", examDetails);
      }
    }, [examDetails]);

    useEffect(() => {
      if(selectedChapters) {
        localStorage.setItem('selectedChapters', JSON.stringify(selectedChapters));
      }
    }, [selectedChapters]);

    useEffect(() => {
      if(previewPaper) {
        localStorage.setItem('previewPaper', JSON.stringify(previewPaper));
      }
    }, [previewPaper]); 

  };
  
  if (currentPage === 'login') {
    return <Login onNavigate={handleNavigation} />;
  }

  if (currentPage === 'signup') {
    return <SignUp onNavigate={handleNavigation} />;
  }

  if (currentPage === 'exam-form') {
    return <ExamDetailsForm onNavigate={handleNavigation} />;
  }

  if (currentPage === 'book-selection') {
    console.log('Exam Details in App.tsx:', examDetails);
    return <BookSelection onNavigate={handleNavigation} examDetails={examDetails} />;
  }

  if (currentPage === 'profile') {
    console.log('Navigation State in App.tsx while in profile page:', navigationState);
    return <Profile onNavigate={handleNavigation} navigationState={navigationState} />;
  }

  if (currentPage === 'paper-creator') {
    console.log('Exam Details in App.tsx when route to PaperCreator:', examDetails);
    return <PaperCreator onNavigate={handleNavigation} examDetails={examDetails} selectedChapters={selectedChapters} />;
  }

  if (currentPage === 'paper-preview') {
    return <PaperPreviewPage onNavigate={handleNavigation} paperData={previewPaper}  />;
  }

  
  return (
    <div className="min-h-screen">
      <Navbar onNavigate={handleNavigation} />
      <Hero onNavigate={handleNavigation} />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

export default App;