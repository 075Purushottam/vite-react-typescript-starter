export type NavigationPage = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'exam-form' 
  | 'book-selection' 
  | 'profile'
  | 'paper-creator'
  | 'paper-preview';

export interface ExamDetails {
  class: string;
  subject: string;
  board: string;
  examName: string;
}

export interface ChapterDetails {
  bookName: string;
  chapterName: string;
  chapterId: string;
}

export interface NavigationData {
  examDetails?: ExamDetails;
  selectedChapters?: ChapterDetails[];
}