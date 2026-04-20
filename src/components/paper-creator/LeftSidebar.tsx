import { Filter, Save, Heading as HeadingIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import type { Filter as FilterType, Question } from '@/types/paper';
import { useState, useEffect } from 'react';
import { CreateQuestionDialog } from './CreateQuestionDialog';
import { MergeDialog, SplitDialog } from './MergeSplitDialogs';
import { MatchFollowingDialog } from './MatchFollowingDialog';
// import { supabase } from '@/lib/supabase';
// import { mockBoards, mockClasses, mockSubjects, mockBooks, mockChapters } from '@/types/mockData';

interface LeftSidebarProps {
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  onSavePaper: () => void;
  onAddHeading: (text: string, alignment: 'left' | 'center') => void;
  onCreateQuestion: (question: Question) => void;
  onMergeQuestions: (headingNumber: number, questionNumber1: number, questionNumber2: number) => void;
  onSplitQuestion: (headingNumber: number, questionNumber: number) => void;
  selectedChapters: Array<{
    bookName: string;
    chapterName: string;
    chapterId: string;
    bookId: string;
  }>;
}

export const LeftSidebar = ({ filters, setFilters, onSavePaper, onAddHeading, onCreateQuestion, onMergeQuestions, onSplitQuestion, selectedChapters }: LeftSidebarProps) => {
  const [headingText, setHeadingText] = useState('');
  // const [chapters, setChapters] = useState<string[]>([]);
  const [chapters, setChapters] = useState<{
  chapterId: string;
  chapterName: string;
}[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);

  useEffect(()=>{
    console.log("Selected Chapters in left side: ",selectedChapters);
  }, [selectedChapters])

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setChaptersLoading(true);
      setChaptersError(null);
      // const { data, error } = await supabase
      //   .from('questionservice_chapter')
      //   .select('*');
      const data = selectedChapters;
      if (!isMounted) return;
      // if (error) {
      //   setChaptersError('Failed to load chapters');
      //   setChapters([]);
      // } else if (data) {
        // const names = data.map((row: any) => row.chapterName);
        // setChapters(names.filter(Boolean));
            const formatted = data && data.length > 0 ? data.map((row: any) => ({
              chapterId: row.chapterId,
              chapterName: row.chapterName,
            })) : [];

            setChapters(formatted);

      // }
      setChaptersLoading(false);
    })();
    return () => { isMounted = false; };
  }, [selectedChapters]);

  // const questionTypes = [
  //   'MCQ', 'Short Answer', 'Long Answer', 'True False', 'Fill in the Blank', 'Match the Following'
  // ];

  const questionType = [
    { value: 'mcq', label: 'Multiple Choice Question' },
    { value: 'short', label: 'Short Answer' },
    { value: 'long', label: 'Long Answer' }, 
    { value: 'true_false', label: 'True False' },
    { value: 'fill_blank', label: 'Fill in the Blank' },
    { value: 'match', label: 'Match the Following' }  
  ]

  // const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }  
  ]
  return (
    <div className="w-80 bg-filter-bg border-r border-border flex flex-col h-full">
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {/* Filter Box */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <Filter className="h-4 w-4 mr-2 text-primary" />
              Filter Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chapter
              </label>
              <Select 
                value={filters.chapter} 
                onValueChange={(value) => setFilters({ ...filters, chapter: value })}
              >
                <SelectTrigger className="bg-card border-border/60">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chaptersLoading && (
                    <div className="px-2 py-1 text-sm text-muted-foreground">Loading...</div>
                  )}
                  {chaptersError && !chaptersLoading && (
                    <div className="px-2 py-1 text-sm text-destructive">{chaptersError}</div>
                  )}
                  {!chaptersLoading && !chaptersError && chapters.map((chapter) => (
                    <SelectItem key={chapter.chapterId} value={chapter.chapterId}>
                      {chapter.chapterName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Question Type
              </label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger className="bg-card border-border/60">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {questionType.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Difficulty
              </label>
              <Select 
                value={filters.difficulty} 
                onValueChange={(value) => setFilters({ ...filters, difficulty: value })}
              >
                <SelectTrigger className="bg-card border-border/60">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => setFilters({ chapter: '', type: '', difficulty: '' })}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        <Separator className="bg-border/60" />

        {/* Add Heading Section */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <HeadingIcon className="h-4 w-4 mr-2 text-primary" />
              Add Heading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Enter heading text..."
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              className="bg-card border-border/60"
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (headingText.trim()) {
                    onAddHeading(headingText.trim(), 'left');
                    setHeadingText('');
                  }
                }}
                disabled={!headingText.trim()}
              >
                Add to Left
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (headingText.trim()) {
                    onAddHeading(headingText.trim(), 'center');
                    setHeadingText('');
                  }
                }}
                disabled={!headingText.trim()}
              >
                Add to Center
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add New Question Section */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add New Question</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateQuestionDialog onCreateQuestion={onCreateQuestion} />
          </CardContent>
           <CardContent>
            <MatchFollowingDialog onCreateQuestion={onCreateQuestion} onAddHeading={onAddHeading} />
          </CardContent>
        </Card>

        

        {/* Merge and Split Section */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Merge & Split</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <MergeDialog onMerge={onMergeQuestions} />
            <SplitDialog onSplit={onSplitQuestion} />
          </CardContent>
        </Card>
      </div>

      {/* Save Paper Section - Fixed at bottom */}
      {/* <div className="p-6 border-t border-border bg-card">
        <Button className="w-full bg-success hover:bg-success/90 text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Paper
        </Button>
      </div> */}
        <div className="p-6 border-t border-border bg-card">
            <Button
               onClick={() => {
          console.log("Button Clicked");
          onSavePaper();
        }}
              className="w-full bg-success hover:bg-success/90 text-white"
            >
               <Save className="h-4 w-4 mr-2" />
              Save Paper
            </Button>
          </div>
    </div>
  );
};