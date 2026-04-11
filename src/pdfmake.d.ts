declare module "pdfmake/build/pdfmake" {
  const pdfMake: any;
  export default pdfMake;

    export function createPdf(docDefinition: { content: any[]; styles: { header: { fontSize: number; bold: boolean; alignment: string; margin: number[]; }; subheader: { fontSize: number; bold: boolean; alignment: string; margin: number[]; }; sectionHeader: { fontSize: number; bold: boolean; margin: number[]; }; }; pageMargins: number[]; }) {
        throw new Error("Function not implemented.");
    }
}

declare module "pdfmake/build/vfs_fonts" {
  export const pdfMake: any;
}
