import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Shuffle } from 'lucide-react';
import type { Question } from '@/types/paper';

interface MatchPair {
  left: string;
  right: string;
}

interface MatchFollowingDialogProps {
  onCreateQuestion: (question: Question) => void;
}

const chapters = [
  'Mathematics',
  'Science', 
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology'
];

const difficulties = ['Easy', 'Medium', 'Hard'] as const;

export function MatchFollowingDialog({ onCreateQuestion }: MatchFollowingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1);
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [pairs, setPairs] = useState<MatchPair[]>([
    { left: '', right: '' },
    { left: '', right: '' }
  ]);

  const addPair = () => {
    setPairs([...pairs, { left: '', right: '' }]);
  };

  const removePair = (index: number) => {
    if (pairs.length > 2) {
      setPairs(pairs.filter((_, i) => i !== index));
    }
  };

  const updatePair = (index: number, field: 'left' | 'right', value: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const shuffleRightSide = (originalPairs: MatchPair[]): MatchPair[] => {
    const rightItems = [...originalPairs.map(p => p.right)];
    
    // Fisher-Yates shuffle algorithm
    for (let i = rightItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
    }

    return originalPairs.map((pair, index) => ({
      left: pair.left,
      right: rightItems[index]
    }));
  };

  const handleSubmit = () => {
    if (!questionText.trim() || !chapter || pairs.some(p => !p.left.trim() || !p.right.trim())) {
      return;
    }

    // Shuffle the right side items
    const shuffledPairs = shuffleRightSide(pairs);

    const question: Question = {
      id: `match-${Date.now()}`,
      question_text: questionText.trim(),
      type: 'Match the Following',
      difficulty: difficulty,
      marks: marks,
      book: 0, // Placeholder, should be set based on actual book selection
      subject: 0, // Placeholder, should be set based on actual subject selection
      chapter: Number(chapter),
      matchPairs: shuffledPairs
    };

    onCreateQuestion(question);
    
    // Reset form
    setQuestionText('');
    setMarks(1);
    setChapter('');
    setDifficulty('Easy');
    setPairs([{ left: '', right: '' }, { left: '', right: '' }]);
    setIsOpen(false);
  };

  const getLetterLabel = (index: number) => String.fromCharCode(97 + index); // a, b, c, d...
  const getNumberLabel = (index: number) => (index + 1).toString(); // 1, 2, 3, 4...

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {/* <Plus className="h-4 w-4 mr-2" /> */}
          Match the Following
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Match the Following Question</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="questionText">Question Text</Label>
              <Textarea
                id="questionText"
                placeholder="Enter the main question text (e.g., 'Match the following fruits with their types:')"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="marks">Marks</Label>
                <Input
                  id="marks"
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label htmlFor="chapter">Chapter</Label>
                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((ch) => (
                      <SelectItem key={ch} value={ch}>{ch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold">Match Pairs</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Enter correct matching pairs. The right side will be shuffled when added to paper.
            </p>
            
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">({getLetterLabel(index)})</span>
                    <Input
                      placeholder="Left item"
                      value={pair.left}
                      onChange={(e) => updatePair(index, 'left', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  
                  <span className="text-lg">→</span>
                  
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-medium">({getNumberLabel(index)})</span>
                    <Input
                      placeholder="Right item"
                      value={pair.right}
                      onChange={(e) => updatePair(index, 'right', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  
                  {pairs.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePair(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={addPair}
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pair
            </Button>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!questionText.trim() || !chapter || pairs.some(p => !p.left.trim() || !p.right.trim())}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle and Add to Paper
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};