import React from "react";
import FileSaver from "file-saver";

import * as XLSX from "xlsx";

export interface ExportProp<T> {
  csvData: T[];
  fileName: string;
  exportType: string;
}
export const Export = <T,>({
  csvData,
  fileName,
  exportType,
}: ExportProp<T>) => {
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

  return (
    <button onClick={() => exportTo(csvData, fileName)}>Export {exportType.toUpperCase()}</button>
  );
};
