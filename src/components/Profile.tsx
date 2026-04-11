import React, { useState, useEffect } from 'react';
import { examService } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

import { 
  User, 
  Mail, 
  Crown, 
  Calendar, 
  FileText, 
  Edit, 
  Eye, 
  Search, 
  Filter, 
  Upload,
  ArrowLeft,
  BookOpen,
  School,
  Award,
  Clock,
  MoreVertical
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile' | 'paper-creator') => void;
  navigationState?: any; // Optional state to pass when navigating to profile (e.g., { from: 'home' })
}

interface Paper {
  id: string;
  title: string;
  examName: string;
  class: string;
  subject: string;
  board: string;
  createdDate: string;
  createdTime: string;
  maxMarks: number;
  duration: number;
}

const Profile = ({ onNavigate, navigationState }: ProfileProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [papers, setPapers] = useState<Paper []>([]);
  const [user, setUser] = useState(getCurrentUser());
  const from = navigationState;
  console.log("From :",from);
  const handleBack = () => {
  if (from === 'paper-creator') {
      onNavigate('paper-creator');
    } else {
      onNavigate('home');
    }
  };
  // Mock user data
  const userData = {
    name: user?.name || 'Guest User',
    email: user?.email || 'guest@example.com',
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    plan: 'Pro Plan',
    planColor: 'from-blue-600 to-purple-600',
    renewalDate: '2025-03-15'
  };

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const data = await examService.fetchMyPapers();
        console.log("Fetched papers from backend:", data);
        // 🔥 Map backend fields to frontend format
        const formattedPapers: Paper[] = (data as any).results.map((paper: any) => ({
          id: paper.id,
          title: paper.title,
          examName: paper.exam_name,
          class: paper.class_name,
          subject: paper.subject,
          board: paper.board,
          createdDate: paper.created_at.split("T")[0],
          createdTime: new Date(paper.created_at).toLocaleTimeString(),
          maxMarks: paper.max_marks,
          duration: paper.duration
        }));

        setPapers(formattedPapers);
      } catch (error) {
        console.error("Error loading papers:", error);
      }
    };

    loadPapers();
  }, []);

  // Mock papers data
  // const [papers] = useState<Paper[]>([
  //   {
  //     id: '1',
  //     title: 'Mathematics Midterm Examination',
  //     examName: 'Mid-Term Exam 2025',
  //     class: '10',
  //     subject: 'Mathematics',
  //     board: 'CBSE',
  //     createdDate: '2025-01-15',
  //     createdTime: '10:30 AM',
  //     maxMarks: 100,
  //     duration: 180
  //   },
  //   {
  //     id: '2',
  //     title: 'Science Unit Test - Physics',
  //     examName: 'Unit Test 3',
  //     class: '12',
  //     subject: 'Physics',
  //     board: 'CBSE',
  //     createdDate: '2025-01-12',
  //     createdTime: '2:15 PM',
  //     maxMarks: 50,
  //     duration: 120
  //   },
  //   {
  //     id: '3',
  //     title: 'English Literature Assessment',
  //     examName: 'Monthly Assessment',
  //     class: '11',
  //     subject: 'English',
  //     board: 'MP Board',
  //     createdDate: '2025-01-10',
  //     createdTime: '9:45 AM',
  //     maxMarks: 80,
  //     duration: 150
  //   },
  //   {
  //     id: '4',
  //     title: 'Chemistry Practical Exam',
  //     examName: 'Practical Examination',
  //     class: '12',
  //     subject: 'Chemistry',
  //     board: 'CBSE',
  //     createdDate: '2025-01-08',
  //     createdTime: '11:20 AM',
  //     maxMarks: 30,
  //     duration: 90
  //   },
  //   {
  //     id: '5',
  //     title: 'History Chapter Test',
  //     examName: 'Chapter Test',
  //     class: '9',
  //     subject: 'Social Science',
  //     board: 'MP Board',
  //     createdDate: '2025-01-05',
  //     createdTime: '3:30 PM',
  //     maxMarks: 40,
  //     duration: 60
  //   }
  // ]);

  // Filter papers based on search and filter
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.examName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         paper.class === filterBy || 
                         paper.subject.toLowerCase() === filterBy.toLowerCase() ||
                         paper.board.toLowerCase() === filterBy.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {from === 'paper-creator' ? 'Paper Creator' : 'Home'}
        </button>

        {/* Profile Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300 shadow-lg"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
              
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  {userData.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Member since Jan 2024
                </div>
              </div>

              {/* Subscription Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 bg-gradient-to-r ${userData.planColor} rounded-lg flex items-center justify-center mr-4`}>
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{userData.plan}</h3>
                      <p className="text-sm text-gray-600">Renews on {formatDate(userData.renewalDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                      Manage Plan
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Papers Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Your Saved Papers</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{filteredPapers.length} papers found</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search papers by title, subject, or exam name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="all">All Papers</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="cbse">CBSE</option>
                <option value="mp board">MP Board</option>
              </select>
            </div>
          </div>

          {/* Papers Grid */}
          {filteredPapers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{paper.examName}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Paper Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <School className="w-4 h-4 mr-2 text-blue-500" />
                        Class {paper.class} • {paper.subject}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 text-purple-500" />
                        {paper.board} • {paper.maxMarks} marks
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                        {paper.duration} minutes
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created on {formatDate(paper.createdDate)} at {paper.createdTime}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group">
                        <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        View
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center group">
                        <Edit className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Create your first question paper to get started.'}
              </p>
              <button
                onClick={() => onNavigate('exam-form')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Create New Paper
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal (Simple placeholder) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Profile Picture</h3>
            <p className="text-gray-600 mb-6">Choose a new profile picture to upload.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;