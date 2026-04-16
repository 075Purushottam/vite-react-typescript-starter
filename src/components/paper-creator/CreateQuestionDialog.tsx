import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Question } from '@/types/paper';
import { supabase } from '@/lib/supabase';


interface CreateQuestionDialogProps {
  onCreateQuestion: (question: Question) => void;
  // selectedChapters: Array<{
  //   bookName: string;
  //   chapterName: string;
  //   chapterId: string;
  // }>;
}

export const CreateQuestionDialog = ({ onCreateQuestion, }: CreateQuestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    type: 'Short Answer' as Question['type'],
    difficulty: 'Medium' as Question['difficulty'],
    marks: 1,
    chapter: '',
    answer: ''
  });
    // const [chapters, setChapters] = useState<string[]>([]);
    // const [chapters, setChapters] = useState<{
    //   chapterId: string;
    //   chapterName: string;
    // }[]>([]);
    const [chaptersLoading, setChaptersLoading] = useState(false);
    const [chaptersError, setChaptersError] = useState<string | null>(null);
  
   
  const chapters = [
    'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 
    'Probability', 'Number Theory', 'Coordinate Geometry'
  ];

  const questionTypes: Question['type'][] = [
    'MCQ', 'Short Answer', 'Long Answer', 'True False', 'Fill in the Blank', 'Match the Following'
  ];

  const difficulties: Question['difficulty'][] = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim() || !formData.chapter) {
      return;
    }

    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      question_text: formData.text.trim(),
      type: formData.type,
      difficulty: formData.difficulty,
      marks: formData.marks,
      chapter: Number(formData.chapter),
      answer: formData.answer.trim() || undefined,
      book: 0,
      subject: 0,
    };

    onCreateQuestion(newQuestion);
    
    // Reset form
    setFormData({
      text: '',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 1,
      chapter: '',
      answer: ''
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full justify-start bg-accent hover:bg-accent-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a custom question to your paper. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              placeholder="Enter your question here..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                min="1"
                max="20"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter">Chapter</Label>
              <Select 
                value={formData.chapter} 
                onValueChange={(value) => setFormData({ ...formData, chapter: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map(chapter => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: Question['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value: Question['difficulty']) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer (Optional)</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer or solution..."
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="min-h-[60px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.text.trim() || !formData.chapter}
            >
              Add to Paper
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};