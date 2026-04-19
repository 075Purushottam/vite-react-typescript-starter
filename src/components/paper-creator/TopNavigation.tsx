import { Search, User, FileText, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface TopNavigationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalQuestions: number;
  totalMarks: number;
}

export const TopNavigation = ({
  searchQuery,
  setSearchQuery,
  totalQuestions,
  totalMarks
}: TopNavigationProps) => {
  const navigate = useNavigate();
    const [user, setUser] = useState(getCurrentUser());
    const [isToolInfoOpen, setIsToolInfoOpen] = useState(false);
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
    <>
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
          <button onClick={() => navigate('/profile', { state: { from: 'paper-creator' } })}>
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </button>
         
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

        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setIsToolInfoOpen(true)}>
          <Info className="h-4 w-4 mr-2" />
          Tool Information
        </Button>
      </div>
    </header>

    <Dialog open={isToolInfoOpen} onOpenChange={setIsToolInfoOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tool Information</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <p>• For each section, please create a heading first. Never start dragging questions directly without a heading/section title.</p>
          <p>• While creating "Match the Following" questions, please be cautious with the pairing to ensure accuracy.</p>
          <p>• For custom questions, we never store them in our database. They are only visible in your created paper.</p>
          <p>• Use the search bar to quickly find questions from your library by keywords or tags.</p>
          <p>• Preview your paper before finalizing to check formatting and ensure all questions are properly included.</p>
          <p>• Save your work frequently to avoid losing progress during paper creation.</p>
          <p>• Utilize different question types (MCQ, Short Answer, Essay) to create balanced assessments.</p>
          <p>• Check total marks and question count in the navigation bar to maintain paper structure.</p>
          <p>• Export your paper as PDF for printing or sharing with colleagues and students.</p>
          <p>• Remember, all data is processed locally for privacy and security.</p>
        </div>
      </DialogContent>
    </Dialog>
  </>
  );
};