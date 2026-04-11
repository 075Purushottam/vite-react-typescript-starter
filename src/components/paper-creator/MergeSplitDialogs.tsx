import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Merge, ChevronDown } from 'lucide-react';

interface MergeDialogProps {
  onMerge: (headingNumber: number, questionNumber1: number, questionNumber2: number) => void;
}

interface SplitDialogProps {
  onSplit: (headingNumber: number, questionNumber: number) => void;
}

export const MergeDialog = ({ onMerge }: MergeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [headingNumber, setHeadingNumber] = useState('');
  const [questionNumber1, setQuestionNumber1] = useState('');
  const [questionNumber2, setQuestionNumber2] = useState('');

  const handleSubmit = () => {
    const heading = parseInt(headingNumber);
    const q1 = parseInt(questionNumber1);
    const q2 = parseInt(questionNumber2);

    if (heading && q1 && q2 && q1 !== q2) {
      onMerge(heading, q1, q2);
      setOpen(false);
      setHeadingNumber('');
      setQuestionNumber1('');
      setQuestionNumber2('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Merge className="h-4 w-4 mr-2" />
          Merge Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Merge Questions</DialogTitle>
          <DialogDescription>
            Merge two questions under a heading. They will be displayed with "OR" between them.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="heading" className="text-right">
              Heading No.
            </Label>
            <Input
              id="heading"
              type="number"
              min="1"
              value={headingNumber}
              onChange={(e) => setHeadingNumber(e.target.value)}
              className="col-span-3"
              placeholder="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question1" className="text-right">
              Question 1
            </Label>
            <Input
              id="question1"
              type="number"
              min="1"
              value={questionNumber1}
              onChange={(e) => setQuestionNumber1(e.target.value)}
              className="col-span-3"
              placeholder="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question2" className="text-right">
              Question 2
            </Label>
            <Input
              id="question2"
              type="number"
              min="1"
              value={questionNumber2}
              onChange={(e) => setQuestionNumber2(e.target.value)}
              className="col-span-3"
              placeholder="2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!headingNumber || !questionNumber1 || !questionNumber2 || questionNumber1 === questionNumber2}
          >
            Merge Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SplitDialog = ({ onSplit }: SplitDialogProps) => {
  const [open, setOpen] = useState(false);
  const [headingNumber, setHeadingNumber] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');

  const handleSubmit = () => {
    const heading = parseInt(headingNumber);
    const q = parseInt(questionNumber);

    if (heading && q) {
      onSplit(heading, q);
      setOpen(false);
      setHeadingNumber('');
      setQuestionNumber('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <ChevronDown className="h-4 w-4 mr-2" />
          Split Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Split Question</DialogTitle>
          <DialogDescription>
            Split a merged question back into separate questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="split-heading" className="text-right">
              Heading No.
            </Label>
            <Input
              id="split-heading"
              type="number"
              min="1"
              value={headingNumber}
              onChange={(e) => setHeadingNumber(e.target.value)}
              className="col-span-3"
              placeholder="1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="split-question" className="text-right">
              Question No.
            </Label>
            <Input
              id="split-question"
              type="number"
              min="1"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              className="col-span-3"
              placeholder="1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!headingNumber || !questionNumber}
          >
            Split Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};