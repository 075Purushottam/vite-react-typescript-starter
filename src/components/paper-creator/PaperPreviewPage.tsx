
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, FileDown, Printer } from 'lucide-react';
import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

interface MatchPair {
  left: string;
  right: string;
}

interface QuestionData {
  qno: number;
  question: string;
  marks: number;
  options?: string[];
  answer?: string;
  type?: string;
  matchPairs?: MatchPair[];
  isMerged?: boolean;
}

interface SectionData {
  sectionTitle: string;
  questions: QuestionData[];
}
// type Section = {
//   sectionTitle: string;
//   questions: Question[];
// };

interface PaperDetails {
  schoolName?: string;
  examName?: string;
  class?: string;
  subject?: string;
  date?: string;
  time?: string;
  maxMarks?: number;
  instructions?: string[];
}

interface PaperData {
  paperDetails: PaperDetails;
  sections: SectionData[];
}

interface PaperPreviewPageProps {
  paperData?: PaperData; // Make it optional since we'll get it from state
}

const PaperPreviewPage = ({ paperData: propPaperData }: PaperPreviewPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const paperRef = useRef<HTMLDivElement>(null);
  const navigationState = location.state;
  const from = navigationState?.from;
  console.log("Paper Preview Page From :", from);
  
  // Get paperData from navigation state or props
  const paperData = location.state?.paperData || propPaperData;
  console.log("Paper data in preview page:", paperData);
  const generatePDF = useCallback(async (includeAnswers: boolean) => {
    if (!paperRef.current) return;
    const canvas = await html2canvas(paperRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position -= pdf.internal.pageSize.getHeight();
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    const fileName = includeAnswers ? 'answer-sheet.pdf' : 'question-paper.pdf';
    pdf.save(fileName);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const styleMap: Record<string, string> = {
    header: "text-center font-bold text-xl mb-1",
    subheader: "text-center font-bold text-lg mb-2.5",
    sectionHeader: "font-bold text-base mt-2.5 mb-1 flex w-full items-start",
    answerText: "italic text-green-600 ml-5 mt-0.5 mb-1"
  };

  const renderPaperContent = (paperData: PaperData) => {
    const details = paperData.paperDetails;
    const elements: JSX.Element[] = [];

    // Header
    const headerItems = buildHeader(details);
    headerItems.forEach((item, idx) => {
      if (item.text) {
        elements.push(
          <div key={`header-${idx}`} className={styleMap[item.style!] || ""}>
            {item.text}
          </div>
        );
      } else if (item.columns) {
        elements.push(
          <div key={`header-${idx}`} className="flex justify-between text-sm">
            {item.columns.map((col, cidx) => (
              <div key={cidx} className={col.alignment === 'right' ? 'text-right' : 'text-left'}>
                {col.text}
              </div>
            ))}
          </div>
        );
      } else if (item.canvas) {
        elements.push(<hr key={`header-${idx}`} className="my-2.5 border-t" />);
      }
    });

    // Sections
    paperData.sections.forEach((sectionData, sidx) => {
      const questionType = sectionData.questions[0]?.type;
      console.log(`Section ${sidx + 1} question type:`, questionType ,typeof questionType,sectionData.questions.length,typeof sectionData.questions.length);
        const hasSingleMatchQuestion =
        sectionData.questions.length === 1 && questionType!== undefined &&
        [
          "Match the Following",
          "Match the following",
          // add more types here if needed
        ].includes(questionType);
        // const hasSingleMatchQuestion =
        // sectionData.questions.length === 1 && questionType === "Match the Following";
        if (hasSingleMatchQuestion) {
          console.log(`Section ${sidx + 1} has a single question of type "${questionType}" with marks:`, sectionData.questions[0].marks);
        }
      elements.push(
        <div key={`section-${sidx}`} className={styleMap.sectionHeader}>
          <span>{sidx + 1}. {sectionData.sectionTitle}</span>
          {hasSingleMatchQuestion && (
            <span className="ml-auto">
              [{sectionData.questions[0].marks}]
            </span>
          )}
        </div>
      );
      
      sectionData.questions.forEach((q, qidx) => {
        if (q.type === 'Match the Following' || q.type === 'Match the following') {
          // Parse match question from stored text format
          console.log("Parsing match question:", q.question);
          const pairs = q.question.split('\n').map(line => {
            const match = line.match(/^\((\w)\)(.+?)\s*\((\d+)\)(.+)$/);
            if (match) {
              return { left: match[2].trim(), right: match[4].trim() };
            }
            return null;
          }).filter(Boolean);

          elements.push(
            <div key={`q-${sidx}-${qidx}`} className="my-1.5">
              {/* <div className="flex justify-between mb-3">
                <div className="flex-1">{q.qno}. {sectionData.sectionTitle}</div>
                <div className="ml-2">[{q.marks}]</div>
              </div> */}
              <div className="grid grid-cols-2 gap-x-20 gap-y-2 pl-5">
                {pairs.map((pair: any, index: number) => (
                  <>
                    <div key={`left-${index}`} className="mb-2">
                      <span className="font-medium">({String.fromCharCode(97 + index)})</span> {pair.left}
                    </div>
                    <div key={`right-${index}`} className="mb-2">
                      <span className="font-medium">({index + 1})</span> {pair.right}
                    </div>
                  </>
                ))}
              </div>
            </div>
          );
        } else if (q.options) {
          elements.push(
            <div key={`q-${sidx}-${qidx}`} className="my-1.5">
              <div className="flex justify-between">
                <div className="flex-1">{q.qno}. {q.question}</div>
                <div className="ml-2">[{q.marks}]</div>
              </div>
              <div className="grid grid-cols-2 gap-x-6-gap-y-1 mt-2">
                {Object.entries(q.options).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          elements.push(
            <div key={`q-${sidx}-${qidx}`} className="flex justify-between my-1.5">
              <div className="flex-1">{q.qno}. {q.question}</div>
              <div className="ml-2">[{q.marks}]</div>
            </div>
          );
        }
      });
    });

    return elements;
  };

  if (!paperData) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">No Paper Data</h2>
          <p className="text-muted-foreground">No paper data found. Please go back and create a paper first.</p>
          <Button onClick={() => navigate(from)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
        </div>
      </div>
    );
  }

  const { paperDetails, sections } = paperData;
  const totalMarks = paperDetails.maxMarks ?? sections.reduce(
    (sum: number, s: any) => sum + s.questions.reduce((qs: number, q: any) => qs + q.marks, 0), 0
  );

  return (
    <div className="flex flex-col h-screen bg-muted/30 print:bg-white">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(from)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>

          <h1 className="text-lg font-semibold text-foreground">Paper Preview</h1>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={() => generatePaper(paperData)}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => generateAnswerSheet(paperData)}>
              <FileDown className="h-4 w-4 mr-2" />
              Answer Sheet PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Paper Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
          <div
            ref={paperRef}
            className="bg-card rounded-lg shadow-lg border border-border p-10 print:shadow-none print:border-none print:rounded-none"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            {renderPaperContent(paperData)}

            {/* Footer */}
            <div className="mt-10 pt-4 border-t border-foreground/10 text-center">
              <p className="text-sm text-muted-foreground italic">— End of Question Paper —</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PaperPreviewPage;


  const buildHeader = (details: PaperDetails) => ([
    { text: details.schoolName, style: "header" },
    { text: details.examName, style: "subheader" },
    { text: `${details.class} - ${details.subject}`, style: "subheader" },
    {
      columns: [
        { text: `Time: ${details.time}`, alignment: "left" },
        { text: `Date: ${details.date}`, alignment: "right" }
      ]
    },
    {
      columns: [
        { text: `Max Marks: ${details.maxMarks}`, alignment: "left" },
        { text: `Roll no: __________`, alignment: "right" }
      ],
      margin: [0, 0, 0, 10]
    },
    {
      canvas: [{ type: "line", x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 }],
      margin: [0, 10, 0, 10]
    },
    ...(details.instructions && details.instructions.length > 0
      ? [
          { text: "Instructions:", style: "sectionHeader" },
          ...details.instructions.map((i: string) => ({ text: i, style: "" }))
        ]
      : []),
      {
      canvas: [{ type: "line", x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 }],
      margin: [0, 10, 0, 10]
      },
  ]);

  const getBaseDocDefinition = (content: any[]) => ({
    content,
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 13,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10]
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      answerText: {
        italics: true,
        color: "green",
        margin: [20, 2, 0, 5]
      }
    },
    pageMargins: [40, 40, 40, 40]
  });

  // ================================
  // 📄 Question Paper
  // ================================
  const generatePaper = (paperData: any) => {
    if (!paperData) return;

    const details = paperData.paperDetails;
    const content: any[] = [...buildHeader(details)];

    paperData.sections.forEach((sectionData: any,sidx: any) => {
      const questionType = sectionData.questions[0]?.type;
        const hasSingleMatchQuestion =
        sectionData.questions.length === 1 && questionType!== undefined &&
        [
          "Match the Following",
          "Match the following",
        ].includes(questionType);
        content.push({
      columns: [
        {
          text: `${sidx + 1}. ${sectionData.sectionTitle}`,
          style: "sectionHeader",
        },
        hasSingleMatchQuestion
          ? {
              text: `[${sectionData.questions[0].marks}]`,
              alignment: "right",
              width: 30,
              margin: [0, 2, 0, 0],
            }
          : { text: "" },
      ],
    });
      // content.push(
      //   <div key={`section-${sidx}`} className={styleMap.sectionHeader}>
      //     <span>{sidx + 1}. {sectionData.sectionTitle}</span>
      //     {hasSingleMatchQuestion && (
      //       <span className="ml-auto">
      //         [{sectionData.questions[0].marks}]
      //       </span>
      //     )}
      //   </div>
      //   // <div className="ml-2">[{sectionData.questions[0]?.marks}]</div>
      // );
      // content.push({
      //   text: sectionData.sectionTitle,
      //   style: "sectionHeader"
      // });
      

      sectionData.questions.forEach((q: any) => {
        if (q.type === 'Match the Following' || q.type === 'Match the following') {
          // Parse match question from stored text format
          const pairs = q.question.split('\n').map((line: string) => {
            const match = line.match(/^\((\w)\)(.+?)\s*\((\d+)\)(.+)$/);
            if (match) {
              return { left: match[2].trim(), right: match[4].trim() };
            }
            return null;
          }).filter(Boolean);

          // content.push({
          //   columns: [
          //     { text: `${q.qno}. ${sectionData.sectionTitle}`, width: "*" },
          //     { text: `[${q.marks}]`, width: "auto", alignment: "right" }
          //   ],
          //   margin: [0, 5]
          // });

          content.push({
            columns: [
              {
                width: "*",
                stack: pairs.map((pair: any, index: number) => ({
                  text: `(${String.fromCharCode(97 + index)}) ${pair.left}`,
                  margin: [0, 3, 0, 3]
                }))
              },
              {
                width: "*",
                stack: pairs.map((pair: any, index: number) => ({
                  text: `(${index + 1}) ${pair.right}`,
                  margin: [0, 3, 0, 3]
                }))
              }
            ],
            columnGap: 40,
            margin: [20, 5, 0, 5]
          });
        } else if (q.options) {
          content.push({
            stack: [
              {
                columns: [
                  { text: `${q.qno}. ${q.question}`, width: "*" },
                  { text: `[${q.marks}]`, width: "auto", alignment: "right" }
                ]
              },
              ...Object.entries(q.options).map(([key,value]) => ({
                text: `   (${key}) ${value}`,
                margin: [15, 0, 0, 0]
              }))
            ],
            margin: [0, 5]
          });
        } else {
          content.push({
            columns: [
              { text: `${q.qno}. ${q.question}`, width: "*" },
              { text: `[${q.marks}]`, width: "auto", alignment: "right" }
            ],
            margin: [0, 5]
          });
        }
      });
    });

    pdfMake.createPdf(getBaseDocDefinition(content)).open();
  };

  // ================================
  // 🟢 Answer Sheet Generator
  // ================================
  const generateAnswerSheet = (paperData: any) => {
    if (!paperData) return;

    const details = paperData.paperDetails;
    const content: any[] = [...buildHeader(details)];

    // Add Answer Sheet Title
    content.splice(2, 0, { text: "ANSWER SHEET", style: "sectionHeader", alignment: "center" });

    paperData.sections.forEach((sectionData: any,sidx: any) => {
    const questionType = sectionData.questions[0]?.type;
        const hasSingleMatchQuestion =
        sectionData.questions.length === 1 && questionType!== undefined &&
        [
          "Match the Following",
          "Match the following",
        ].includes(questionType);
        content.push({
      columns: [
        {
          text: `${sidx + 1}. ${sectionData.sectionTitle}`,
          style: "sectionHeader",
        },
        hasSingleMatchQuestion
          ? {
              text: `[${sectionData.questions[0].marks}]`,
              alignment: "right",
              width: 30,
              margin: [0, 2, 0, 0],
            }
          : { text: "" },
      ],
    }); 

      sectionData.questions.forEach((q: any) => {
       const getAnswerText = (answer?: {text:string} | string) =>{
        if(!answer) return '';

        if(typeof answer === 'string'){
          try{
            const parsed = JSON.parse(answer);
            return parsed.text || answer;
          } catch{
            return answer;
          }
        }

        return answer.text || '';
      };
        if (q.type === 'Match the Following' || q.type === 'Match the following') {
          // Parse match question from stored text format
          const pairs = q.question.split('\n').map((line: string) => {
            const match = line.match(/^\((\w)\)(.+?)\s*\((\d+)\)(.+)$/);
            if (match) {
              return { left: match[2].trim(), right: match[4].trim() };
            }
            return null;
          }).filter(Boolean);

          // content.push({
          //   columns: [
          //     { text: `${q.qno}. ${q.answer}`, width: "*" },
          //     { text: `[${q.marks}]`, width: "auto", alignment: "right" }
          //   ],
          //   margin: [0, 5]
          // });

          if (getAnswerText(q.answer)) {
            // For match questions, show left items paired with correct answers
            const answerLines = (typeof q.answer === 'object' && q.answer.answer ? q.answer.answer : q.answer).split('\n');
            
            content.push({
              columns: [
                {
                  width: "*",
                  stack: pairs.map((pair: any, index: number) => ({
                    text: `(${String.fromCharCode(97 + index)}) ${pair.left}`,
                    margin: [0, 3, 0, 3]
                  }))
                },
                {
                  width: "*",
                  stack: answerLines.map((line: string) => ({
                    text: `Answer: ${line}`,
                    margin: [0, 3, 0, 3],
                    style: "answerText"
                  }))
                }
              ],
              columnGap: 40,
              margin: [20, 5, 0, 5]
            });
          }
        } else {
          content.push({
            columns: [
              { text: `${q.qno}. ${q.question}`, width: "*" },
              { text: `[${q.marks}]`, width: "auto", alignment: "right" }
            ],
            margin: [0, 5]
          });

          if (q.answer) {
            content.push({
              text: `Answer: ${getAnswerText(q.answer)}`,
              style: "answerText"
            });
          }
        }
      });
    });

    pdfMake.createPdf(getBaseDocDefinition(content)).open();
  };
