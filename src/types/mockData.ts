import type { Class, Subject, Board, Book, Chapter } from '../lib/supabase';

export const mockClasses: Class[] = [
  { id: 1, name: 'Class 6' },
  { id: 2, name: 'Class 7' },
  { id: 3, name: 'Class 8' },
  { id: 4, name: 'Class 9' },
  { id: 5, name: 'Class 10' },
  { id: 6, name: 'Class 11 (Science)' },
  { id: 7, name: 'Class 12 (Science)' },
];

export const mockBoards: Board[] = [
  { id: 1, name: 'CBSE' },
  { id: 2, name: 'MP Board' },
];

export const mockSubjects: Subject[] = [
  // Class 6
  { id: 101, name: 'Mathematics', class_id: 1 },
  { id: 102, name: 'Science', class_id: 1 },
  { id: 103, name: 'English', class_id: 1 },
  { id: 104, name: 'Hindi', class_id: 1 },
  { id: 105, name: 'Social Science', class_id: 1 },

  // Class 7
  { id: 201, name: 'Mathematics', class_id: 2 },
  { id: 202, name: 'Science', class_id: 2 },
  { id: 203, name: 'English', class_id: 2 },
  { id: 204, name: 'Hindi', class_id: 2 },
  { id: 205, name: 'Social Science', class_id: 2 },

  // Class 8
  { id: 301, name: 'Mathematics', class_id: 3 },
  { id: 302, name: 'Science', class_id: 3 },
  { id: 303, name: 'English', class_id: 3 },
  { id: 304, name: 'Hindi', class_id: 3 },
  { id: 305, name: 'Social Science', class_id: 3 },

  // Class 9
  { id: 401, name: 'Mathematics', class_id: 4 },
  { id: 402, name: 'Science', class_id: 4 },
  { id: 403, name: 'English', class_id: 4 },
  { id: 404, name: 'Hindi', class_id: 4 },
  { id: 405, name: 'Social Science', class_id: 4 },
  { id: 406, name: 'Computer Science', class_id: 4 },

  // Class 10
  { id: 501, name: 'Mathematics', class_id: 5 },
  { id: 502, name: 'Science', class_id: 5 },
  { id: 503, name: 'English', class_id: 5 },
  { id: 504, name: 'Hindi', class_id: 5 },
  { id: 505, name: 'Social Science', class_id: 5 },
  { id: 506, name: 'Computer Science', class_id: 5 },

  // Class 11 Science
  { id: 601, name: 'Physics', class_id: 6 },
  { id: 602, name: 'Chemistry', class_id: 6 },
  { id: 603, name: 'Mathematics', class_id: 6 },
  { id: 604, name: 'Biology', class_id: 6 },
  { id: 605, name: 'English', class_id: 6 },

  // Class 12 Science
  { id: 701, name: 'Physics', class_id: 7 },
  { id: 702, name: 'Chemistry', class_id: 7 },
  { id: 703, name: 'Mathematics', class_id: 7 },
  { id: 704, name: 'Biology', class_id: 7 },
  { id: 705, name: 'English', class_id: 7 },
];

export const mockBooks: Book[] = [
  // Class 9 Maths CBSE
  { id: 1, title: 'NCERT Maths Part 1', author: 'NCERT', class_id: 1, subject_id: 1, board_id: 1 },
  { id: 2, title: 'NCERT Maths Part 2', author: 'NCERT', class_id: 1, subject_id: 1, board_id: 1 },

  // Class 9 Science CBSE
  { id: 3, title: 'NCERT Science Physics', author: 'NCERT', class_id: 1, subject_id: 2, board_id: 1 },
  { id: 4, title: 'NCERT Science Chemistry', author: 'NCERT', class_id: 1, subject_id: 2, board_id: 1 },

  // Class 10 Maths MP Board
  { id: 5, title: 'MP Board Maths Book', author: 'MP Board', class_id: 2, subject_id: 3, board_id: 2 },

  // Class 10 Science MP Board
  { id: 6, title: 'MP Board Science Book', author: 'MP Board', class_id: 2, subject_id: 4, board_id: 2 },
];

export const mockChapters: Chapter[] = [
  // Book 1
  { id: 101, name: 'Number Systems', chapter_number: 1, book_id: 1 },
  { id: 102, name: 'Polynomials', chapter_number: 2, book_id: 1 },
  { id: 103, name: 'Coordinate Geometry', chapter_number: 3, book_id: 1 },

  // Book 2
  { id: 201, name: 'Linear Equations', chapter_number: 1, book_id: 2 },
  { id: 202, name: 'Triangles', chapter_number: 2, book_id: 2 },

  // Book 3
  { id: 301, name: 'Motion', chapter_number: 1, book_id: 3 },
  { id: 302, name: 'Force and Laws', chapter_number: 2, book_id: 3 },

  // Book 4
  { id: 401, name: 'Atoms and Molecules', chapter_number: 1, book_id: 4 },
  { id: 402, name: 'Structure of Atom', chapter_number: 2, book_id: 4 },            
  // Book 5
  { id: 501, name: 'Real Numbers', chapter_number: 1, book_id: 5 },
  { id: 502, name: 'Quadratic Equations', chapter_number: 2, book_id: 5 },

  // Book 6
  { id: 601, name: 'Chemical Reactions', chapter_number: 1, book_id: 6 },
  { id: 602, name: 'Life Processes', chapter_number: 2, book_id: 6 },
];
