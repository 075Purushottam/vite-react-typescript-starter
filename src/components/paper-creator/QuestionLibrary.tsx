import { useDraggable, useDroppable } from '@dnd-kit/core';
import { GripVertical, BookOpen, Clock, Award, Bot, Library } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Filter, Question } from '@/types/paper';
// import { MatchFollowingDialog } from './MatchFollowingDialog';

interface QuestionLibraryProps {
  searchQuery: string;
  filters: Filter;
  questions: QuestionCardProps[];
  activeIds: string[];
  showChatBot?: boolean;
  onToggleChatBot?: () => void;
  onCreateQuestion?: (question: Question) => void;
}

interface QuestionCardProps {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  marks: number;
  chapter: string;
}

const DraggableQuestion = ({ id, text, type, difficulty, marks, chapter }: QuestionCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md border-border/60 
        ${isDragging ? 'shadow-lg' : 'hover:bg-question-hover/50'}`}
      {...listeners}
      {...attributes}
    >
      <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
            <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>
          <CardTitle className="text-sm text-foreground leading-relaxed">
            {text}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {chapter}
            </span>
            <span className="flex items-center">
              <Award className="h-3 w-3 mr-1" />
              {marks} marks
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const QuestionLibrary = ({ searchQuery, filters, questions, activeIds, showChatBot, onToggleChatBot, onCreateQuestion }: QuestionLibraryProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'question-library',
  });
  // Filter questions based on search query and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === '' ||
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    console.log("Question chapter:", question.chapter);
    console.log("Filters chapter:", filters.chapter);

    const matchesChapter = filters.chapter === '' || question.chapter === filters.chapter;
    const matchesType = filters.type === '' || question.type === filters.type;
    const matchesDifficulty = filters.difficulty === '' || question.difficulty === filters.difficulty;
    console.log("Matches Difficulty:", matchesDifficulty);
    return matchesSearch && matchesChapter && matchesType && matchesDifficulty;
  });
 console.log("Filtered Questions:", filteredQuestions);
 console.log("Active IDs:", activeIds);
 console.log("Available Questions:", filteredQuestions.filter(q => !activeIds.includes(q.id)));
  const availableQuestions = filteredQuestions.filter(q => !activeIds.includes(q.id));

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-background border-r border-border flex flex-col transition-colors ${isOver ? 'bg-primary/5' : ''
        }`}
    >
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Question Library</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {availableQuestions.length} questions
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleChatBot}
              className="h-7 px-2"
            >
              <Bot className="h-3 w-3 mr-1" />
              AI
            </Button>
          </div>
        </div>


        {isOver && (
          <div className="mt-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium text-center">
              Drop here to remove from paper
            </p>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          key={`${filters.chapter}-${filters.type}-${filters.difficulty}-${searchQuery}`}
          className="p-6 space-y-4"
        >
          {availableQuestions.length > 0 ? (
            availableQuestions.map((question) => (
              <DraggableQuestion key={question.id} {...question} />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Questions Found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find questions.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {availableQuestions.length > 0 ? (
            availableQuestions.map((question) => (
              <DraggableQuestion key={question.id} {...question} />
            ))
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Questions Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find questions.
              </p>
            </div>
          )}
        </div>
      </ScrollArea> */}
    </div>
  );
};