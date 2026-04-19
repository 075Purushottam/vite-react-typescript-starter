import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  School,
  Award
} from 'lucide-react';
import { examService } from '../lib/supabase';
import type { Book, Chapter } from '../lib/supabase';
import { mockBoards, mockClasses, mockSubjects,mockBooks, mockChapters } from '../types/mockData';

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

interface BookChapter {
  id: string;
  name: string;
  selected: boolean;
}

interface BookWithChapters {
  id: string;
  name: string;
  chapters: BookChapter[];
  expanded: boolean;
  allSelected: boolean;
}

const BookSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examDetails = location.state?.examDetails;
  const [books, setBooks] = useState<BookWithChapters[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayNames, setDisplayNames] = useState({
    className: '',
    subjectName: '',
    boardName: ''
  });

  useEffect(()=>{
    console.log('Exam Details in BookSelection:', examDetails); 
  })

  // Redirect if no exam details
  useEffect(() => {
    if (!examDetails) {
      navigate('/exam-form');
      return;
    }
  }, [examDetails, navigate]);

  // Load books and display names
  useEffect(() => {
    const loadData = async () => {
      if (!examDetails) return;

      setLoading(true);
      try {
        const classId = parseInt(examDetails.classId);
        const subjectId = parseInt(examDetails.subjectId);
        const boardId = parseInt(examDetails.boardId);

        // Load books and display names in parallel
        const [booksData, className, subjectName, boardName] = await Promise.all([
          examService.getBooks(classId, subjectId, boardId),
          examService.getClassName(classId),
          examService.getSubjectName(subjectId),
          examService.getBoardName(boardId)
        ]);
        // const className = mockClasses.find(c => c.id === classId)?.name || '';
        // const subjectName = mockSubjects.find(s => s.id === subjectId)?.name || '';
        // const boardName = mockBoards.find(b => b.id === boardId)?.name || '';


        setDisplayNames({ className, subjectName, boardName });

        // Load chapters for each book
        const booksWithChapters = await Promise.all(
          booksData.map(async (book) => {
            const chapters = await examService.getChaptersByBook(book.id);
            return {
              id: book.id.toString(),
              name: book.title,
              expanded: false,
              allSelected: false,
              chapters: chapters.map(chapter => ({
                id: chapter.id.toString(),
                name: chapter.name,
                selected: false
              }))
            };
          })
        );

        // const booksWithChapters = await Promise.all(
        //   mockBooks.map(async (book) => {
        //     const chapters = mockChapters.filter(c => c.book_id === book.id);
        //     return {
        //       id: book.id.toString(),
        //       name: book.title,
        //       expanded: false,
        //       allSelected: false,
        //       chapters: chapters.map(chapter => ({
        //         id: chapter.id.toString(),
        //         name: chapter.name,
        //         selected: false
        //       }))
        //     };
        //   })
        // );
        setBooks(booksWithChapters);
      } catch (error) {
        console.error('Error loading books and chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [examDetails]);

  const toggleBookExpansion = (bookId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === bookId
          ? { ...book, expanded: !book.expanded }
          : book
      )
    );
  };

  const toggleChapterSelection = (bookId: string, chapterId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          const updatedChapters = book.chapters.map(chapter =>
            chapter.id === chapterId
              ? { ...chapter, selected: !chapter.selected }
              : chapter
          );
          const allSelected = updatedChapters.every(chapter => chapter.selected);
          return { ...book, chapters: updatedChapters, allSelected };
        }
        return book;
      })
    );
  };

  const toggleAllChapters = (bookId: string) => {
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book.id === bookId) {
          const newAllSelected = !book.allSelected;
          const updatedChapters = book.chapters.map(chapter => ({
            ...chapter,
            selected: newAllSelected
          }));
          return { ...book, chapters: updatedChapters, allSelected: newAllSelected };
        }
        return book;
      })
    );
  };

  const getSelectedCount = () => {
    return books.reduce((total, book) => {
      return total + book.chapters.filter(chapter => chapter.selected).length;
    }, 0);
  };

  const handleCreatePaper = () => {
    const selectedChapters = books.flatMap(book => 
      book.chapters.filter(chapter => chapter.selected)
        .map(chapter => ({
          ...chapter,
          bookName: book.name,
          bookId: parseInt(book.id)
        }))
    );
    
    if (selectedChapters.length === 0) {
      alert('Please select at least one chapter to continue.');
      return;
    }
    
    console.log('Selected chapters:', selectedChapters);

    // Navigate to PaperCreator with both exam details and selected chapters
    navigate('/paper-creator', {
      state: {
        examDetails: examDetails,
        selectedChapters: selectedChapters
      }
    });
  };

  if (!examDetails) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Education Icons */}
      <div className="absolute top-24 right-24 opacity-20">
        <BookOpen className="w-16 h-16 text-emerald-600 animate-bounce delay-300" />
      </div>
      <div className="absolute bottom-32 left-24 opacity-20">
        <FileText className="w-18 h-18 text-blue-600 animate-pulse delay-1500" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Select Books & Chapters</h1>
          <p className="text-gray-600 mb-6">Choose the books and chapters you want to include in your question paper.</p>
          
          {/* Exam Details Summary */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-white/20 inline-block">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <School className="w-4 h-4 mr-2 text-emerald-500" />
                {displayNames.className}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                {displayNames.subjectName}
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-purple-500" />
                {displayNames.boardName}
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8 border border-white/20 mb-8">
          
          {/* Selection Summary */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Books</h2>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-emerald-600">{getSelectedCount()}</span> chapters selected
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading books and chapters...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-600 mb-6">
                No books are available for the selected class, subject, and board combination.
              </p>
              <button
                onClick={() => navigate('/exam-form')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-300"
              >
                Change Selection
              </button>
            </div>
          ) : (
            /* Books List */
            <div className="space-y-4">
              {books.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Book Header */}
                <div
                  onClick={() => toggleBookExpansion(book.id)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 cursor-pointer hover:from-gray-100 hover:to-blue-100 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{book.name}</h3>
                      <p className="text-sm text-gray-600">
                        {book.chapters.filter(c => c.selected).length} of {book.chapters.length} chapters selected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {book.expanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-300" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-300" />
                    )}
                  </div>
                </div>

                {/* Chapters List */}
                {book.expanded && (
                  <div className="p-4 bg-white border-t border-gray-100">
                    {/* Select All Checkbox */}
                    <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={book.allSelected}
                            onChange={() => toggleAllChapters(book.id)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                            book.allSelected 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'border-gray-300 hover:border-emerald-400'
                          }`}>
                            {book.allSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className="ml-3 font-medium text-gray-900">Select All Chapters</span>
                      </label>
                    </div>

                    {/* Individual Chapters */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {book.chapters.map((chapter) => (
                        <label
                          key={chapter.id}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-300"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={chapter.selected}
                              onChange={() => toggleChapterSelection(book.id, chapter.id)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                              chapter.selected 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}>
                              {chapter.selected && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                          </div>
                          <span className="ml-3 text-sm text-gray-700">{chapter.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/exam-form')}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Exam Details
          </button>
          
          <button
            onClick={handleCreatePaper}
            className="flex-1 group px-6 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
          >
            Create Paper / Go to Tool
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSelection;
