import FileSaver from "file-saver";

import * as XLSX from "xlsx";

export const enum TypeFile {
  csv = "csv",
  xlsx = "xlsx",
}
export interface ExportProp<T> {
  csvData: T[];
  fileName: string;
  exportType: TypeFile;
}
export function export_data<T>(
  csvData: T[],
  fileName: string,
  exportType: TypeFile,
) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const fileExtension = `.${exportType}`;
  const exportTo = (csvData: T[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(csvData);

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

    const excelBuffer = XLSX.write(wb, {
      bookType: `${exportType == "csv" ? "csv" : "xlsx"}`,
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, fileName + fileExtension);
  };
  exportTo(csvData, fileName);
}
