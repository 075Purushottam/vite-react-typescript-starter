
import React, { useEffect } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).vfs;

type Question = {
  qno: number;
  question: string;
  marks: number;
  options?: string[];
  answer?: string;   // ✅ Added
};

type Section = {
  sectionTitle: string;
  questions: Question[];
};

type PaperDetails = {
  schoolName: string;
  examName: string;
  class: string;
  subject: string;
  time: string;
  maxMarks: number;
  date: string;
  rollNumber?: string;
};

type PaperData = {
  paperDetails: PaperDetails;
  sections: Section[];
};

interface Props {
  paperData: PaperData;
  // trigger?: boolean;
}

const QuestionPaperGenerator: React.FC<Props> = ({ paperData }) => {

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
    }
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
  const generatePaper = () => {
    if (!paperData) return;

    const details = paperData.paperDetails;
    const content: any[] = [...buildHeader(details)];

    paperData.sections.forEach((section) => {
      content.push({
        text: section.sectionTitle,
        style: "sectionHeader"
      });

      section.questions.forEach((q) => {
        if (q.options) {
          content.push({
            stack: [
              {
                columns: [
                  { text: `${q.qno}. ${q.question}`, width: "*" },
                  { text: `[${q.marks}]`, width: "auto", alignment: "right" }
                ]
              },
              ...q.options.map((opt, idx) => ({
                text: `   (${idx + 1}) ${opt}`,
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
  const generateAnswerSheet = () => {
    if (!paperData) return;

    const details = paperData.paperDetails;
    const content: any[] = [...buildHeader(details)];

    // Add Answer Sheet Title
    content.splice(2, 0, { text: "ANSWER SHEET", style: "sectionHeader", alignment: "center" });

    paperData.sections.forEach((section) => {
      content.push({
        text: section.sectionTitle,
        style: "sectionHeader"
      });

      section.questions.forEach((q) => {
        content.push({
          columns: [
            { text: `${q.qno}. ${q.question}`, width: "*" },
            { text: `[${q.marks}]`, width: "auto", alignment: "right" }
          ],
          margin: [0, 5]
        });

        if (q.answer) {
          content.push({
            text: `Answer: ${q.answer}`,
            style: "answerText"
          });
        }
      });
    });

    pdfMake.createPdf(getBaseDocDefinition(content)).open();
  };

  // useEffect(() => {
  //   if (trigger) generatePaper();
  // }, [trigger]);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={generatePaper}>
        Download Question Paper
      </button>

      <button onClick={generateAnswerSheet}>
        Download Answer Sheet
      </button>
    </div>
  );
};

export default QuestionPaperGenerator;
