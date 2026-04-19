import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TopNavigation } from './paper-creator/TopNavigation';
import { LeftSidebar } from './paper-creator/LeftSidebar';
import { QuestionLibrary } from './paper-creator/QuestionLibrary';
import { PaperPreview } from './paper-creator/PaperPreview';
// import QuestionPaperGenerator from './paper-creator/QuestionPaperGenerator';
import { ChatBot } from './paper-creator/ChatBot';
import { isQuestion, isHeading } from '@/types/paper';
import type { Question, PaperItem, Heading } from '@/types/paper';
import { examService, supabase } from "@/lib/supabase";
import { Book } from 'lucide-react';
import PaperPreviewPage from './paper-creator/PaperPreviewPage';

const STORAGE_KEY = "paperCreatorState";

const savePaperCreatorState = (state: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving paper creator state:", error);
  }
};

const loadPaperCreatorState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Error loading paper creator state:", error);
    return null;
  }
};

export const PaperCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examDetails = location.state?.examDetails;
  const selectedChapters = location.state?.selectedChapters;

  const savedState = loadPaperCreatorState();

  // State for selectedChapters with localStorage fallback
  const [selectedChaptersState, setSelectedChaptersState] = useState(() => {
    const saved = localStorage.getItem('selectedChapters');
    return saved ? JSON.parse(saved) : null;
  });

  // Determine which selectedChapters to use
  const finalSelectedChapters = selectedChapters || selectedChaptersState || [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [paperItems, setPaperItems] = useState<PaperItem[]>(() => savedState?.paperItems || []);
  const [searchQuery, setSearchQuery] = useState(() => savedState?.searchQuery || '');
  const [selectedFilters, setSelectedFilters] = useState(() =>
    savedState?.selectedFilters || {
      chapter: '',
      difficulty: '',
      type: '',
    });
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => savedState?.customQuestions || []);
  const [showChatBot, setShowChatBot] = useState(false);
  const [paperData, setPaperData] = useState<any>(() => savedState?.paperData || null);
  // const [generateTrigger, setGenerateTrigger] = useState(false);


  const [questions, setQuestions] = useState<Question[]>(() => savedState?.questions || []);
  // const [postgres_questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [examDetailsState, setExamDetailsState] = useState(() => {
    const saved = localStorage.getItem('examDetails');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (examDetails) {
      setExamDetailsState(examDetails);
      localStorage.setItem('examDetails', JSON.stringify(examDetails));
      console.log("Exam Details saved to localStorage in PaperCreator.tsx:", examDetails);
    }
  }, [examDetails]);

  useEffect(() => {
    if (selectedChapters) {
      setSelectedChaptersState(selectedChapters);
      localStorage.setItem('selectedChapters', JSON.stringify(selectedChapters));
      console.log("Selected Chapters saved to localStorage in PaperCreator.tsx:", selectedChapters);
    }
  }, [selectedChapters]);
  // const navigate = useNavigate();

  useEffect(() => {
    savePaperCreatorState({
      paperItems,
      questions,
      customQuestions,
      paperData,
      selectedFilters,
      searchQuery,
    });
  }, [
    paperItems,
    questions,
    customQuestions,
    paperData,
    selectedFilters,
    searchQuery,
  ]);
  const handleSavePaper = async () => {
    if (!paperData) {
      console.error("No paper data to save");
      return;
    } else {
      const isConfirmed = window.confirm("Are you sure you want to save this paper?");

      if (!isConfirmed) return;

      try {
        console.log("Saving paper data: ", paperData);
        const response = await examService.savePaper(paperData);

        if (response.success) {
          alert("Paper saved successfully!");
          // localStorage.removeItem("paperCreatorState");
          navigate('/paper-preview', { state: { paperData: paperData } }); // Pass paperData to preview page
        } else {
          alert(response.message || "Failed to save paper");
        }

      } catch (error) {
        console.error("Error saving paper:", error);
      }
    }
    // setGenerateTrigger(true);

    // reset trigger after generation
    // setTimeout(() => setGenerateTrigger(false), 500);
  };


  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      console.log("Selected Chapters:", finalSelectedChapters);
      const chapterIds = finalSelectedChapters?.map((ch: any) => ch.id) || [];

      const params = new URLSearchParams();
      chapterIds.forEach((id: string) => params.append("chapter_ids", id));

      const res = await fetch(
        `http://localhost:8000/api/v1/questions/by-chapters/?${params.toString()}`
      );

      const data = await res.json();
      console.log("Fetched questions:", data);
      setQuestions(data);

      setLoading(false);
    }

    if (finalSelectedChapters && finalSelectedChapters.length > 0) {
      fetchQuestions();
    }
  }, [finalSelectedChapters]);


  const allQuestions = [...questions, ...customQuestions];
  console.log("All Questions:", allQuestions);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIndex = paperItems.findIndex(item => item.id === activeId);
    const overIndex = paperItems.findIndex(item => item.id === overId);

    const questionId = activeId;
    const foundQuestion = allQuestions.find(q => q.id === questionId);

    if (activeIndex !== -1 && overIndex !== -1) {
      setPaperItems(arrayMove(paperItems, activeIndex, overIndex));
    }
    else if (foundQuestion && !paperItems.find(item => item.id === questionId)) {
      console.log("Adding question to paper: ", foundQuestion);
      if (overIndex !== -1) {
        setPaperItems(prev => {
          const next = [...prev];
          next.splice(overIndex + 1, 0, foundQuestion);
          return next;
        });
      } else if (overId === 'paper-dropzone') {
        setPaperItems(prev => [...prev, foundQuestion]);
      }
    }
    else if (overId === 'question-library' && activeIndex !== -1) {
      setPaperItems(prev => prev.filter(item => item.id !== activeId));
    }

    setActiveId(null);
  };

  const handleRemoveItem = (itemId: string) => {
    setPaperItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateItem = (itemId: string, updates: Partial<PaperItem>) => {
    setPaperItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const handleAddHeading = (text: string, alignment: 'left' | 'center') => {
    const newHeading: Heading = {
      id: `heading-${Date.now()}`,
      text,
      alignment
    };
    setPaperItems(prev => [...prev, newHeading]);
  };

  const handleCreateQuestion = (question: Question) => {
    setCustomQuestions(prev => [...prev, question]);
    setPaperItems(prev => [...prev, question]);
  };

  const handleToggleChatBot = () => {
    setShowChatBot(prev => !prev);
  };

  const handleMergeQuestions = (headingNumber: number, questionNumber1: number, questionNumber2: number) => {
    let currentHeading = 0;
    let questionsInCurrentHeading = 0;
    let targetQuestions: { item: PaperItem, index: number }[] = [];

    for (let i = 0; i < paperItems.length; i++) {
      const item = paperItems[i];
      if (isHeading(item)) {
        currentHeading++;
        questionsInCurrentHeading = 0;
      } else if (isQuestion(item)) {
        questionsInCurrentHeading++;
        if (currentHeading === headingNumber &&
          (questionsInCurrentHeading === questionNumber1 || questionsInCurrentHeading === questionNumber2)) {
          targetQuestions.push({ item, index: i });
        }
      }
    }

    if (targetQuestions.length === 2) {
      const [q1, q2] = targetQuestions;
      const mergedId = `merged-${Date.now()}`;

      const mergedQuestion: Question = {
        ...q1.item as Question,
        id: mergedId,
        question_text: `${(q1.item as Question).question_text}\n\nOR\n\n${(q2.item as Question).question_text}`,
        marks: (q1.item as Question).marks + (q2.item as Question).marks,
        isMerged: true,
        mergedWith: (q2.item as Question).id,
        originalId: (q1.item as Question).id
      };

      setPaperItems(prev => {
        const newItems = [...prev];
        newItems[q1.index] = mergedQuestion;
        newItems.splice(q2.index, 1);
        return newItems;
      });
    }
  };

  const handleSplitQuestion = (headingNumber: number, questionNumber: number) => {
    let currentHeading = 0;
    let questionsInCurrentHeading = 0;
    let targetIndex = -1;

    for (let i = 0; i < paperItems.length; i++) {
      const item = paperItems[i];
      if (isHeading(item)) {
        currentHeading++;
        questionsInCurrentHeading = 0;
      } else if (isQuestion(item)) {
        questionsInCurrentHeading++;
        if (currentHeading === headingNumber && questionsInCurrentHeading === questionNumber) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex !== -1) {
      const mergedQuestion = paperItems[targetIndex] as Question;
      if (mergedQuestion.isMerged) {
        const parts = mergedQuestion.question_text.split(/\n\nOR\n\n/);
        if (parts.length === 2) {
          const originalMarks = Math.ceil(mergedQuestion.marks / 2);

          const question1: Question = {
            id: mergedQuestion.originalId || `q1-${Date.now()}`,
            question_text: parts[0],
            type: mergedQuestion.type,
            difficulty: mergedQuestion.difficulty,
            marks: originalMarks,
            chapter: mergedQuestion.chapter,
            options: mergedQuestion.options,
            answer: mergedQuestion.answer,
            book: 0,
            subject: 0
          };

          const question2: Question = {
            id: mergedQuestion.mergedWith || `q2-${Date.now()}`,
            question_text: parts[1],
            type: mergedQuestion.type,
            difficulty: mergedQuestion.difficulty,
            marks: mergedQuestion.marks - originalMarks,
            chapter: mergedQuestion.chapter,
            options: mergedQuestion.options,
            answer: mergedQuestion.answer,
            book: 0,
            subject: 0
          };

          setPaperItems(prev => {
            const newItems = [...prev];
            newItems.splice(targetIndex, 1, question1, question2);
            return newItems;
          });
        }
      }
    }
  };

  const totalMarks = paperItems.filter(isQuestion).reduce((sum, q) => sum + q.marks, 0);
  const totalQuestions = paperItems.filter(isQuestion).length;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex flex-col h-screen bg-background">
        <TopNavigation
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalQuestions={totalQuestions}
          totalMarks={totalMarks}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar
            filters={selectedFilters}
            setFilters={setSelectedFilters}
            onAddHeading={handleAddHeading}
            onCreateQuestion={handleCreateQuestion}
            onMergeQuestions={handleMergeQuestions}
            onSplitQuestion={handleSplitQuestion}
            selectedChapters={finalSelectedChapters?.map((ch: any) => ({
              bookName: ch.bookName,
              chapterName: ch.name,
              chapterId: ch.id,
              bookId: ch.bookId.toString()
            })) || []}
            onSavePaper={handleSavePaper}
          />

          {showChatBot ? (
            <ChatBot onGenerateQuestion={handleCreateQuestion} onToggleChatBot={handleToggleChatBot} />
          ) : (
            <QuestionLibrary
              searchQuery={searchQuery}
              filters={selectedFilters}
              questions={allQuestions.map(q => ({
                id: q.id,
                text: q.question_text || q.question_text || '',
                type: q.type,
                difficulty: q.difficulty,
                marks: q.marks,
                chapter: typeof q.chapter === 'number' ? String(q.chapter) : q.chapter
              }))}
              activeIds={paperItems.map(item => item.id)}
              showChatBot={showChatBot}
              onToggleChatBot={handleToggleChatBot}
              onCreateQuestion={handleCreateQuestion}
            />
          )}

          <SortableContext items={paperItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
            <PaperPreview
              items={paperItems}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
              examDetails={examDetails || examDetailsState}
              setPaperData={setPaperData}
            />
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-4 bg-card border border-border rounded-lg shadow-lg opacity-75">
            <p className="font-medium">Item {activeId}</p>
            <p className="text-sm text-muted-foreground">Dragging...</p>
          </div>
        ) : null}
      </DragOverlay>
    
    </DndContext>
  );
};


