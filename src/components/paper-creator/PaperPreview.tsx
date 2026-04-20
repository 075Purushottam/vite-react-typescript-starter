import { useEffect } from "react";
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, FileText } from 'lucide-react';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { isQuestion, isHeading } from '@/types/paper';
import type { Heading, PaperItem, Question } from '@/types/paper';
import { useState } from 'react';
import { examService } from '../../lib/supabase'

interface PaperPreviewProps {
  items: PaperItem[];
  onRemoveItem: (itemId: string) => void;
  setPaperData: (data: any) => void;
  onUpdateItem?: (itemId: string, updates: Partial<PaperItem>) => void;
  examDetails: {
    schoolName: string;
    classId: string;
    subjectId: string;
    boardId: string;
    examName: string;
    timeDuration: string;
    examInstructions: string;
  };
}

interface SortableItemProps {
  item: PaperItem;
  index: number;
  questionNumber: number;
  sectionNumber: number;
  onRemove: (itemId: string) => void;
  onUpdate?: (itemId: string, updates: Partial<PaperItem>) => void;
}

const SortableItem = ({ item, index: _index, questionNumber, sectionNumber, onRemove, onUpdate }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [marksValue, setMarksValue] = useState(() => isQuestion(item) ? String(item.marks) : '0');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEditStart = (currentText: string) => {
    setEditValue(currentText);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (onUpdate && editValue.trim()) {
      onUpdate(item.id, { text: editValue.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleMarksChange = (value: string) => {
    setMarksValue(value);
  };

  const handleMarksBlur = () => {
    const parsed = Number(marksValue);
    if (isQuestion(item) && onUpdate && marksValue !== '' && !Number.isNaN(parsed)) {
      onUpdate(item.id, { marks: parsed });
    } else if (isQuestion(item)) {
      setMarksValue(String(item.marks));
    } else {
      setMarksValue('0');
    }
  };

  if (isHeading(item)) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center py-2 px-2 rounded ${isDragging ? 'opacity-50' : ''}`}
        {...(!isEditing ? { ...attributes, ...listeners } : {})}
      >
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => {
                // prevent drag start while interacting with input
                e.stopPropagation();
              }}
              className={`font-semibold ${item.alignment === 'center' ? 'text-center' : 'text-left'
                }`}
              autoFocus
            />
          ) : (
            <h3
              className={`font-semibold text-foreground cursor-text ${item.alignment === 'center' ? 'text-center' : 'text-left'
                }`}
              onPointerDown={(e) => {
                // prevent dnd from capturing pointerdown so click can enter edit mode
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditStart(item.text);
              }}
            >
              {sectionNumber}. {item.text}
            </h3>
          )}
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            onPointerDown={(e) => {
              // prevent drag when clicking delete
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center py-1 px-2 rounded ${isDragging ? 'opacity-50' : ''}`}
      title={`Type: ${item.type || 'Unknown'}${item.difficulty ? ` | Difficulty: ${item.difficulty}` : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start flex-1">
        {item.isMerged ? (
          <div className="text-foreground leading-relaxed flex-1">
            {item.question_text.split(/\n\nOR\n\n/).map((part, index) => (
              <div key={index}>
                <div className="flex items-start">
                  {index === 0 && (
                    <span className="font-medium text-foreground mr-2 whitespace-nowrap">{questionNumber}.</span>
                  )}
                  <p className={index === 0 ? 'flex-1' : 'ml-6'}>{part}</p>
                </div>
                {index < item.question_text.split(/\n\nOR\n\n/).length - 1 && (
                  <div className="text-center my-2 font-medium">OR</div>
                )}
              </div>
            ))}
          </div>
        ) :
          (
            <>
              <span className="font-medium text-foreground mr-2 whitespace-nowrap">{questionNumber}.</span>
              {item.type === 'Match the Following' && item.matchPairs ? (
                <div className="text-foreground leading-relaxed flex-1">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      {item.matchPairs.map((pair, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <span className="font-medium mr-2">({String.fromCharCode(97 + index)})</span>
                          <span>{pair.left}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {item.matchPairs.map((pair, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <span className="font-medium mr-2">({index + 1})</span>
                          <span>{pair.right}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed flex-1">
                  {item.question_text}
                  {item.options && (
                    <div className="grid grid-cols-2 gap-x-6-gap-y-1 mt-2">
                      {Object.entries(item.options).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </div>
                  )}
                </p>
              )}
            </>
          )}
        <div className="flex items-center ml-4">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">[</span>
          <Input
            type="number"
            min={0}
            value={marksValue}
            onChange={(e) => handleMarksChange(e.target.value)}
            onBlur={handleMarksBlur}
            // className="no-spinner w-auto min-w-0 max-w-6 h-6 px-0 py-0 text-sm font-medium text-foreground bg-transparent !border-none !rounded-none !shadow-none focus:bg-transparent focus:border-none focus:ring-0 focus-visible:outline-none !outline-none"
            className="no-spinner w-auto h-5 border-0 outline-none rounded-none bg-transparent p-0 m-0 focus:outline-0 focus:ring-0 text-center"
            style={{width: `${Math.max(2, marksValue.length)}ch`}}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">]</span>
        </div>
      </div>
    </div>
  );
};

export const PaperPreview = ({ items, onRemoveItem, onUpdateItem, setPaperData, examDetails }: PaperPreviewProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'paper-dropzone',
  });


  const questions = items.filter(isQuestion);
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  // Calculate question and section numbers (questions reset under each heading)
  let questionCounter = 0;
  let sectionCounter = 0;
  const itemsWithNumbers: (Question | Heading)[] = items.map(item => {
    if (isHeading(item)) {
      sectionCounter++;
      questionCounter = 0; // reset questions count for each new heading
      return { ...item, sectionNumber: sectionCounter };
    }
    if (isQuestion(item)) {
      questionCounter++;
      return { ...item, questionNumber: questionCounter };
    }
    return item;
  });

  useEffect(() => {
    // Build sections from items
    const sections: any[] = [];
    let currentSection: any = null;

    itemsWithNumbers.forEach((item: any) => {
      // console.log("Processing item:", item);
      if (isHeading(item)) {
        currentSection = {
          sectionTitle: item.text,
          questions: []
        };
        sections.push(currentSection);
      }

      if (isQuestion(item) && currentSection) {
        currentSection.questions.push({
          question_id: item.id,
          qno: item.questionNumber,
          question: item.question_text,
          marks: item.marks,
          options: item.options || undefined,
          type: item.type || undefined,
          answer: typeof item.answer === 'string' ? item.answer : item.answer?.text
        });
      }
    });

    const formattedPaperData = {

      paperDetails: {
        schoolName: paperInfo.school,
        examName: paperInfo.title,
        class: className,
        subject: subjectName,
        time: paperInfo.duration,
        date: new Date().toLocaleDateString(),
        maxMarks: totalMarks,
        board_id: paperInfo.board_id,
        class_id: paperInfo.class_id,
        subject_id: paperInfo.subject_id,
        instructions: paperInfo.instructions
      },
      sections
    };

    setPaperData(formattedPaperData);

  }, [items]);


  const loadClassAndSubjectNames = async (
    classId: number,
    subjectId: number
  ) => {
    try {
      const className = await examService.getClassName(classId);
      const subjectName = await examService.getSubjectName(subjectId);

      return {
        className,
        subjectName,
      };
    } catch (error) {
      console.error("Error loading names:", error);
      return {
        className: "",
        subjectName: "",
      };
    }
  };

  console.log("Exam Details in preview part", examDetails)
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    if (!examDetails.classId || !examDetails.subjectId) {
      console.warn("Missing classId or subjectId in examDetails:", examDetails);
      return;
    }
    console.log("Fetching names with classId:", examDetails.classId, "subjectId:", examDetails.subjectId);
    const fetchNames = async () => {
      const classId = Number(examDetails.classId);
      const subjectId = Number(examDetails.subjectId);

      const { className, subjectName } =
        await loadClassAndSubjectNames(classId, subjectId);

      setClassName(className);
      setSubjectName(subjectName);
    };

    fetchNames();
  }, [examDetails]);


  const paperInfo = {
    school: examDetails.schoolName,
    title: examDetails.examName,
    class: className,
    subject: subjectName,
    board_id: examDetails.boardId,
    class_id: examDetails.classId, // Assuming school_id is same as classId for now, adjust if needed
    subject_id: examDetails.subjectId, // Assuming subject_id is same as subjectId for now, adjust if needed
    totalMarks: items.reduce((sum, item) =>
      'marks' in item ? sum + item.marks : sum, 0
    ),
    duration: examDetails.timeDuration, // You might want to add this to examDetails
    // instructions: [
    //   'All questions are compulsory.',
    //   'Use of calculators is not permitted.',
    //   'Show all working clearly.',
    //   'Marks are indicated against each question.'
    // ],
    instructions: examDetails.examInstructions ? examDetails.examInstructions.split('\n') : []
  };

  return (
    <div className="w-[600px] bg-paper-bg border-l border-border flex flex-col">
      {/* Paper Header */}
      <div className="p-6 bg-white border-b-2 border-foreground/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground">
            <div>Duration: {paperInfo.duration} min</div>
            <div>Total Marks: {totalMarks}</div>
          </div>

          <div className="text-center flex-1">
            <h2 className="text-lg font-bold text-foreground">{paperInfo.school}</h2>
            <h1 className="text-xl font-bold text-foreground">{paperInfo.title}</h1>
            <h1 className="text-xl font-bold text-foreground">{paperInfo.subject}</h1>
            <p className="text-base font-semibold text-foreground">{paperInfo.class}</p>
          </div>

          <div className="text-sm text-foreground text-right">
            <div>Roll No: _______</div>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <h3 className="font-semibold text-foreground mb-2">Instructions:</h3>
        <ul className="text-sm text-foreground space-y-1">
          {paperInfo.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">{index + 1}.</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Paper Content */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={`min-h-full transition-colors ${isOver ? 'bg-dropzone/50' : ''
            }`}
        >
          <div className="p-6 space-y-6">
            {/* Items Section */}
            {items.length > 0 ? (
              <div className="space-y-1">
                {itemsWithNumbers.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    questionNumber={isQuestion(item) ? (item as any).questionNumber : 0}
                    sectionNumber={isHeading(item) ? (item as any).sectionNumber : 0}
                    onRemove={onRemoveItem}
                    onUpdate={onUpdateItem}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-lg border-2 border-dashed transition-colors ${isOver ? 'border-primary bg-dropzone/20' : 'border-border bg-muted/20'
                }`}>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {isOver ? 'Drop Question Here' : 'No Questions Added Yet'}
                </h3>
                <p className="text-muted-foreground">
                  {isOver ? 'Release to add this question to your paper' : 'Drag questions from the library to build your paper'}
                </p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};