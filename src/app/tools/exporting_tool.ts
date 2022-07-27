import * as XLSX from 'xlsx'
import { ExportExcel } from './export-excel';

import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ExportingTool {
    constructor(private ete: ExportExcel) { }
    ///////////Excel from Json file
    ExcelWithJson(jsonData, title = "Rapport") {
        var dataForExcel: Object[] = [];
        jsonData.forEach((row: any) => {
            dataForExcel.push(Object.values(row));
        });
        let reportData = {
            title: title,
            data: dataForExcel,
            headers: Object.keys(jsonData[0]),
        };
        this.ete.exportExcel(reportData);
    }

    ///////Excel from a material table
    exportexcel(table_id, title): void {
        let element = document.getElementById(table_id); //we use the div id to select the table that we want to export
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, title + ".xlsx");
    }
}
