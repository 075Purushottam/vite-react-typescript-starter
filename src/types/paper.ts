// export interface Question {
//   id: string;
//   text: string;
//   type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'True False' | 'Fill in the Blank' | 'Match the Following';
//   difficulty: 'Easy' | 'Medium' | 'Hard';
//   marks: number;
//   chapter: string;
//   options?: string[];
//   answer?: string;
//   matchPairs?: { left: string; right: string; }[];
//   isMerged?: boolean;
//   mergedWith?: string;
//   originalId?: string;
// }
export interface Question {
  id: string;
  question_text: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'True False' | 'Fill in the Blank' | 'Match the Following'  ;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  chapter: number;
  book: number;
  subject: number;
  options?: string[];
  answer?: { text: string; } | string;  
  matchPairs?: { left: string; right: string; }[];
  isMerged?: boolean;
  mergedWith?: string;
  originalId?: string;
  questionNumber?: number; // This will be added when we prepare the paper for preview
}

export interface Heading {
  id: string;
  text: string;
  alignment: 'left' | 'center';
}

export interface QuestionWithNumber extends Question {
  questionNumber: number;
}

// export type PaperItem = QuestionWithNumber | Heading;
export type PaperItem = Question | Heading;


export function isQuestion(item: PaperItem): item is QuestionWithNumber {
  return 'marks' in item;
}

export function isHeading(item: PaperItem): item is Heading {
  return 'alignment' in item;
}

export interface PaperInfo {
  title: string;
  subject: string;
  class: string;
  duration: number;
  totalMarks: number;
  instructions: string[];
}

export interface Filter {
  chapter: string;
  difficulty: string;
  type: string;
}


