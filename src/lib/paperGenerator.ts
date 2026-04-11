// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

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

interface PaperDetails {
  schoolName?: string;
  examName?: string;
  class?: string;
  subject?: string;
  date?: string;
  time?: string;
  maxMarks?: number;
  instructions?: string[];
  rollNumber?: string;
}

export interface PaperData {
  paperDetails: PaperDetails;
  sections: SectionData[];
}

function buildHeader(details: PaperDetails): any[] {
  const content: any[] = [];

  if (details.schoolName) {
    content.push({
      text: details.schoolName,
      style: 'schoolName',
      alignment: 'center',
      margin: [0, 0, 0, 4],
    });
  }

  if (details.examName) {
    content.push({
      text: details.examName,
      style: 'examName',
      alignment: 'center',
      margin: [0, 0, 0, 8],
    });
  }

  const leftCol: any[] = [];
  const rightCol: any[] = [];

  if (details.class) leftCol.push({ text: [{ text: 'Class: ', bold: true }, details.class] });
  if (details.subject) leftCol.push({ text: [{ text: 'Subject: ', bold: true }, details.subject] });

  if (details.date) rightCol.push({ text: [{ text: 'Date: ', bold: true }, details.date], alignment: 'right' });
  if (details.time) rightCol.push({ text: [{ text: 'Time: ', bold: true }, details.time], alignment: 'right' });

  const totalMarks = details.maxMarks ?? 0;
  rightCol.push({ text: [{ text: 'Max Marks: ', bold: true }, String(totalMarks)], alignment: 'right' });

  if (leftCol.length || rightCol.length) {
    content.push({
      columns: [
        { width: '*', stack: leftCol, fontSize: 10 },
        { width: '*', stack: rightCol, fontSize: 10 },
      ],
      margin: [0, 4, 0, 4],
    });
  }

  if (details.rollNumber !== undefined) {
    content.push({
      text: [{ text: 'Roll Number: ', bold: true }, '__________________'],
      fontSize: 10,
      margin: [0, 4, 0, 4],
    });
  }

  content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }], margin: [0, 6, 0, 6] });

  if (details.instructions && details.instructions.length > 0) {
    content.push({
      text: 'General Instructions:',
      bold: true,
      fontSize: 10,
      margin: [0, 0, 0, 4],
    });
    content.push({
      ol: details.instructions.map(inst => ({ text: inst, fontSize: 9 })),
      margin: [12, 0, 0, 6],
    });
    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }], margin: [0, 4, 0, 8] });
  }

  return content;
}

function buildQuestionContent(q: QuestionData, includeAnswer: boolean): any[] {
  const items: any[] = [];

  if (q.isMerged) {
    const parts = q.question.split(/\n\nOR\n\n/);
    parts.forEach((part, idx) => {
      if (idx === 0) {
        items.push({
          columns: [
            { width: 28, text: `${q.qno}.`, bold: true, fontSize: 11 },
            { width: '*', text: part, fontSize: 11 },
            { width: 35, text: `[${q.marks}]`, bold: true, fontSize: 10, alignment: 'right' },
          ],
          margin: [0, 0, 0, 2],
        });
      } else {
        items.push({ text: 'OR', bold: true, alignment: 'center', fontSize: 11, margin: [0, 4, 0, 4] });
        items.push({
          columns: [
            { width: 28, text: '' },
            { width: '*', text: part, fontSize: 11 },
            { width: 35, text: '' },
          ],
          margin: [0, 0, 0, 2],
        });
      }
    });
  } else if (q.type === 'Match the Following' && q.matchPairs && q.matchPairs.length > 0) {
    items.push({
      columns: [
        { width: 28, text: `${q.qno}.`, bold: true, fontSize: 11 },
        { width: '*', text: q.question, fontSize: 11 },
        { width: 35, text: `[${q.marks}]`, bold: true, fontSize: 10, alignment: 'right' },
      ],
      margin: [0, 0, 0, 6],
    });

    const tableBody: any[][] = [];
    q.matchPairs.forEach((pair, idx) => {
      tableBody.push([
        { text: `(${String.fromCharCode(97 + idx)})`, bold: true, fontSize: 10 },
        { text: pair.left, fontSize: 10 },
        { text: `(${idx + 1})`, bold: true, fontSize: 10 },
        { text: pair.right, fontSize: 10 },
      ]);
    });

    items.push({
      margin: [28, 0, 35, 4],
      table: {
        widths: [20, '*', 20, '*'],
        body: tableBody,
      },
      layout: 'noBorders',
    });
  } else {
    items.push({
      columns: [
        { width: 28, text: `${q.qno}.`, bold: true, fontSize: 11 },
        { width: '*', text: q.question, fontSize: 11 },
        { width: 35, text: `[${q.marks}]`, bold: true, fontSize: 10, alignment: 'right' },
      ],
      margin: [0, 0, 0, 2],
    });
  }

  // MCQ options
  if (q.options && q.options.length > 0 && q.type !== 'Match the Following') {
    const optCols: any[] = q.options.map((opt, idx) => ({
      text: `(${String.fromCharCode(97 + idx)}) ${opt}`,
      fontSize: 10,
      width: '*',
    }));

    // two per row
    for (let i = 0; i < optCols.length; i += 2) {
      items.push({
        columns: [
          { width: 28, text: '' },
          optCols[i],
          optCols[i + 1] || { text: '', width: '*' },
        ],
        margin: [0, 2, 0, 2],
      });
    }
  }

  // Answer (for answer sheet)
  if (includeAnswer && q.answer) {
    items.push({
      columns: [
        { width: 28, text: '' },
        { width: '*', text: [{ text: 'Ans: ', bold: true, color: '#1a7f37' }, { text: q.answer, color: '#1a7f37' }], fontSize: 10 },
      ],
      margin: [0, 2, 0, 4],
    });
  }

  return items;
}

function buildSections(sections: SectionData[], includeAnswers: boolean): any[] {
  const content: any[] = [];

  sections.forEach((section) => {
    if (section.sectionTitle) {
      content.push({
        text: section.sectionTitle,
        bold: true,
        fontSize: 12,
        margin: [0, 8, 0, 6],
      });
    }

    section.questions.forEach((q) => {
      content.push(...buildQuestionContent(q, includeAnswers));
      content.push({ text: '', margin: [0, 0, 0, 6] }); // spacing
    });
  });

  return content;
}

function getBaseDocDefinition(content: any[]): any {
  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    content,
    styles: {
      schoolName: { fontSize: 18, bold: true },
      examName: { fontSize: 13, bold: true },
    },
    defaultStyle: {
      font: 'Roboto',
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: 'center',
      fontSize: 8,
      margin: [0, 10, 0, 0],
    }),
  };
}

export function generatePaperDocDef(paperData: PaperData): any {
  const header = buildHeader(paperData.paperDetails);
  const body = buildSections(paperData.sections, false);
  const footer = [
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5 }], margin: [0, 16, 0, 6] },
    { text: '— End of Question Paper —', alignment: 'center', italics: true, fontSize: 9, color: '#888' },
  ];
  return getBaseDocDefinition([...header, ...body, ...footer]);
}

export function generateAnswerSheetDocDef(paperData: PaperData): any {
  const details = { ...paperData.paperDetails, examName: (paperData.paperDetails.examName || '') + ' — Answer Sheet' };
  const header = buildHeader(details);
  const body = buildSections(paperData.sections, true);
  return getBaseDocDefinition([...header, ...body]);
}

export function downloadPaper(paperData: PaperData) {
  const docDef = generatePaperDocDef(paperData);
  pdfMake.createPdf(docDef).download('question-paper.pdf');
}

export function downloadAnswerSheet(paperData: PaperData) {
  const docDef = generateAnswerSheetDocDef(paperData);
  pdfMake.createPdf(docDef).download('answer-sheet.pdf');
}

export function getPaperPdfBlobUrl(paperData: PaperData): Promise<string> {
  return new Promise((resolve) => {
    const docDef = generatePaperDocDef(paperData);
    (pdfMake.createPdf(docDef) as any).getBlob((blob: Blob) => {
      resolve(URL.createObjectURL(blob));
    });
  });
}
