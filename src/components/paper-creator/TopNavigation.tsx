import { Search, User, FileText, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';

interface TopNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalQuestions: number;
  totalMarks: number;
  onNavigate: (page: 'home' | 'login' | 'signup' | 'exam-form' | 'book-selection' | 'profile', state?: any) => void;
}

export const TopNavigation = ({ 
  searchQuery, 
  setSearchQuery, 
  totalQuestions, 
  totalMarks,
  onNavigate
}: TopNavigationProps) => {
    const [user, setUser] = useState(getCurrentUser());
    useEffect(() => {
        const checkAuthStatus = () => {
          setUser(getCurrentUser());
        };
    
        checkAuthStatus();
    
        // Listen for storage changes (login/logout in other tabs)
        window.addEventListener('storage', checkAuthStatus);
        return () => window.removeEventListener('storage', checkAuthStatus);
      }, []);
  
  return (
    <header className="bg-card border-b border-border shadow-sm">
      {/* Top Layer */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PaperCraft</h1>
            <p className="text-xs text-muted-foreground">Question Paper Creator</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions across your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/60 focus:bg-card"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-3">
          <button onClick={() => onNavigate('profile', {from: 'paper-creator'})}>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </button>
         
          {/* <button 
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                    isScrolled ? 'border-gray-300' : 'border-white/30'
                  }`}>
                    <img
                      src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button> */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">Mathematics Dept.</p>
          </div>
        </div>
      </div>

      {/* Bottom Layer */}
      <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-t border-border/60">
        <div className="flex items-center space-x-4">
          <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create New Paper
          </Button>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-secondary-accent/20 text-secondary-foreground">
              Questions: {totalQuestions}
            </Badge>
            <Badge variant="outline" className="border-success text-success">
              Total Marks: {totalMarks}
            </Badge>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4 mr-2" />
          Tool Information
        </Button>
      </div>
    </header>
  );
};