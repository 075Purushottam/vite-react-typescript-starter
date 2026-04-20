
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, School, BookOpen, Clock, Award, FileCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { examService } from '../lib/supabase';
import type { Class, Board, Subject } from '../lib/supabase';
import { mockClasses, mockSubjects, mockBoards } from '../types/mockData';

interface ExamFormData {
  schoolName: string;
  examName: string;
  classId: string;
  subjectId: string;
  boardId: string;
  timeDuration: string;
  maxMarks: string;
  examInstructions: string;
}
const ExamDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExamFormData>({
    schoolName: '',
    examName: '',
    classId: '',
    subjectId: '',
    boardId: '',
    timeDuration: '',
    maxMarks: '',
    examInstructions: ''
  });

  const [classes, setClasses] = useState<Class[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [classesData, boardsData] = await Promise.all([
          examService.getClasses(),
          examService.getBoards()
        ]);
        console.log('Fetched classes:', classesData);
        console.log('Fetched boards:', boardsData);
        setClasses(classesData);
        setBoards(boardsData);
        // setClasses(mockClasses);
        // setBoards(mockBoards);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load subjects when class changes
  useEffect(() => {
    const loadSubjects = async () => {
      if (formData.classId) {
        try {
          const subjectsData = await examService.getSubjectsByClass(parseInt(formData.classId));
          setSubjects(subjectsData);
          // setSubjects(mockSubjects.filter(s => s.class_id === parseInt(formData.classId)));
        } catch (error) {
          console.error('Error loading subjects:', error);
          setSubjects([]);
        }
      } else {
        setSubjects([]);
      }
    };

    loadSubjects();
  }, [formData.classId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subject when class changes
      ...(name === 'classId' ? { subjectId: '' } : {})
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
    if (!formData.examName.trim()) newErrors.examName = 'Exam name is required';
    if (!formData.classId) newErrors.classId = 'Class selection is required';
    if (!formData.subjectId) newErrors.subjectId = 'Subject selection is required';
    if (!formData.boardId) newErrors.boardId = 'Board selection is required';
    if (!formData.timeDuration.trim()) newErrors.timeDuration = 'Time duration is required';
    if (!formData.maxMarks.trim()) newErrors.maxMarks = 'Maximum marks is required';
    if (!formData.examInstructions.trim()) newErrors.examInstructions = 'Exam instructions are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Navigate to book selection page with form data
      navigate('/book-selection', { state: { examDetails: formData } });
    }
  };

  const handleReset = () => {
    setFormData({
      schoolName: '',
      examName: '',
      classId: '',
      subjectId: '',
      boardId: '',
      timeDuration: '',
      maxMarks: '',
      examInstructions: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-200/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Education Icons */}
      <div className="absolute top-24 right-24 opacity-20">
        <School className="w-16 h-16 text-indigo-600 animate-bounce delay-300" />
      </div>
      <div className="absolute bottom-32 left-24 opacity-20">
        <BookOpen className="w-18 h-18 text-blue-600 animate-pulse delay-1500" />
      </div>
      <div className="absolute top-1/3 right-20 opacity-20">
        <FileCheck className="w-14 h-14 text-cyan-600 animate-bounce delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Details</h1>
            <p className="text-gray-600">Fill in the details to create your question paper</p>
          </div>

          {/* Form */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading form data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* School Name */}
            <div className="space-y-2">
              <label htmlFor="schoolName" className="text-sm font-medium text-gray-700 flex items-center">
                <School className="w-4 h-4 mr-2 text-indigo-500" />
                School Name
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                  errors.schoolName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter school name"
              />
              {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName}</p>}
            </div>

            {/* Exam Name */}
            <div className="space-y-2">
              <label htmlFor="examName" className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-purple-500" />
                Exam Name
              </label>
              <input
                type="text"
                id="examName"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                  errors.examName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Mid-Term Exam 2025, Unit Test 1, Final Exam"
              />
              {errors.examName && <p className="text-red-500 text-sm">{errors.examName}</p>}
            </div>

            {/* Class and Subject Row */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Class */}
              <div className="space-y-2">
                <label htmlFor="classId" className="text-sm font-medium text-gray-700 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                  Class
                </label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                    errors.classId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Class</option>
                 
                  {classes.map(classItem => (
                    <option key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-500 text-sm">{errors.classId}</p>}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subjectId" className="text-sm font-medium text-gray-700 flex items-center">
                  <FileCheck className="w-4 h-4 mr-2 text-cyan-500" />
                  Subject
                </label>
                <select
                  id="subjectId"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleInputChange}
                  disabled={!formData.classId || subjects.length === 0}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.subjectId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId}</p>}
              </div>
            </div>

            {/* Board and Time Duration Row */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Board */}
              <div className="space-y-2">
                <label htmlFor="boardId" className="text-sm font-medium text-gray-700 flex items-center">
                  <Award className="w-4 h-4 mr-2 text-purple-500" />
                  Board
                </label>
                <select
                  id="boardId"
                  name="boardId"
                  value={formData.boardId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                    errors.boardId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Board</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id.toString()}>
                      {board.name}
                    </option>
                  ))}
                </select>
                {errors.boardId && <p className="text-red-500 text-sm">{errors.boardId}</p>}
              </div>

              {/* Time Duration */}
              <div className="space-y-2">
                <label htmlFor="timeDuration" className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  Time Duration (minutes)
                </label>
                <input
                  type="number"
                  id="timeDuration"
                  name="timeDuration"
                  value={formData.timeDuration}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                    errors.timeDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 180"
                  min="1"
                />
                {errors.timeDuration && <p className="text-red-500 text-sm">{errors.timeDuration}</p>}
              </div>
            </div>

            {/* Max Marks */}
            <div className="space-y-2">
              <label htmlFor="maxMarks" className="text-sm font-medium text-gray-700 flex items-center">
                <Award className="w-4 h-4 mr-2 text-orange-500" />
                Maximum Marks
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 ${
                  errors.maxMarks ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 100"
                min="1"
              />
              {errors.maxMarks && <p className="text-red-500 text-sm">{errors.maxMarks}</p>}
            </div>

            {/* Exam Instructions */}
            <div className="space-y-2">
              <label htmlFor="examInstructions" className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-red-500" />
                Exam Instructions
              </label>
              <textarea
                id="examInstructions"
                name="examInstructions"
                value={formData.examInstructions}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 resize-y ${
                  errors.examInstructions ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter exam instructions (e.g., Read all questions carefully, attempt all questions, etc.)"
              />
              {errors.examInstructions && <p className="text-red-500 text-sm">{errors.examInstructions}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 group px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Continue / Next Step
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset Form
              </button>
            </div>
          </form>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-300 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsForm;