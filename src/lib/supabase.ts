import { createClient } from '@supabase/supabase-js';

import { normalizeArrayResponse } from '@/types/api';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database entities
export interface Class {
  id: number
  name: string
}

export interface Board {
  id: number
  name: string
}

export interface Subject {
  id: number
  name: string
  class_id: number
}

export interface Book {
  id: number
  title: string
  author?: string
  class_id: number
  subject_id: number
  board_id: number
}

export interface Chapter {
  id: number
  name: string
  chapter_number: number
  book_id: number
}

// Database service functions
const BASE_API_URL = 'https://questions-backend-production-d886.up.railway.app/api/v1' // Replace with your actual backend API URL
export const examService = {
  // Fetch all classes
  async getClasses(): Promise<Class[]> {
   
    const res = await fetch(`${BASE_API_URL}/classes/`)
    
    if (!res.ok) {
      console.error('Error fetching classes:', res.status, res.statusText)
      return []
    }
    return normalizeArrayResponse(await res.json()) || []
    // return res.json() || []
  },

  // Fetch all boards
  async getBoards(): Promise<Board[]> {
    
      const res = await fetch(`${BASE_API_URL}/boards/`)
    
    if (!res.ok) {
      console.error('Error fetching boards:', res.status, res.statusText)
      return []
    }
    
    return normalizeArrayResponse(await res.json()) || []
    // return res.json() || []
  },

  // Fetch subjects by class_id
  async getSubjectsByClass(classId: number): Promise<Subject[]> {
   
    const res = await fetch(`${BASE_API_URL}/subjects/by-class/${classId}/`)
    
    if (!res.ok) {
      console.error('Error fetching subjects:', res.status, res.statusText)
      return []
    }
    const data = await res.json();

    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      class_id: s.school_class,
    }));

    // return await res.json()
  },

  // Fetch books by class_id, subject_id, and board_id
  async getBooks(classId: number, subjectId: number, boardId: number): Promise<Book[]> {
  
    const res = await fetch(`${BASE_API_URL}/books/by-filters/?class_id=${classId}&subject_id=${subjectId}&board_id=${boardId}`)
    if (!res.ok) {
      console.error('Error fetching books:', res.status, res.statusText)
      return []
    }
    
    // Map school_class_id to class_id for consistency
    const data = await res.json();

    return data.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      class_id: book.school_class,
      subject_id: book.subject,
      board_id: book.board,
    }));
  },

  // Fetch chapters by book_id
  async getChaptersByBook(bookId: number): Promise<Chapter[]> {
   
    
    const res = await fetch(`${BASE_API_URL}/chapters/by-book/?book_id=${bookId}`)
    
    if (!res.ok) {
      console.error('Error fetching chapters:', res.status, res.statusText)
      return []
    }
    
    const data = await res.json();
    return data || []
  },

  // Get class name by ID
  async getClassName(classId: number): Promise<string> {
   
    const res = await fetch(`${BASE_API_URL}/classes/name/?class_id=${classId}`)
    if (!res.ok) {
      console.error('Error fetching class name:', res.status, res.statusText)
      return 'Unknown Class'
    }
    
    const data = await res.json();
   
    return data?.name || 'Unknown Class'
  },

  // Get subject name by ID
  async getSubjectName(subjectId: number): Promise<string> {
   
    
    const res = await fetch(`${BASE_API_URL}/subjects/name/?subject_id=${subjectId}`)
    if (!res.ok) {
      console.error('Error fetching subject name:', res.status, res.statusText)
      return 'Unknown Subject'
    }
    
    const data = await res.json();
    // const datanew = normalizeArrayResponse(data);
    return data?.name || 'Unknown Subject'
  },

  // Get board name by ID
  async getBoardName(boardId: number): Promise<string> {
    
    
    const res = await fetch(`${BASE_API_URL}/boards/name/?board_id=${boardId}`)
    if (!res.ok) {
      console.error('Error fetching board name:', res.status, res.statusText)
      return 'Unknown Board'
    }
    
    const data = await res.json();
    // const datanew = normalizeArrayResponse(data); 
    return data?.name || 'Unknown Board'
  },

   async fetchMyPapers(): Promise<any[]> {
    // Implement fetching papers created by the logged-in user
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return [];
    }

    const res = await fetch(`${BASE_API_URL}/my-papers/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error('Error fetching my papers:', res.status, res.statusText);
      return [];
    }

    return await res.json() || [];
  },

    async savePaper(paperData: any) {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/api/v1/papers/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(paperData),
      });

      const data = await response.json();
      return data;

    } catch (error) {
      return {
        success: false,
        message: "Server error while saving paper"
      };
    }
  }
  
}