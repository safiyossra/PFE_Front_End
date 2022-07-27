import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
// import * as Excel from 'exceljs/dist/exceljs.min.js'
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class ExportExcel {

  constructor() { }

  exportExcel(excelData) {
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Rapport en details');

    //add rows and formatting

    worksheet.mergeCells('C1', 'E4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    //Date
    worksheet.mergeCells('F1:G4');
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear() + ':' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 10,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Logo image
    let myLogoImage = workbook.addImage({
      filename: '/src/assets/img/brand/senda-track-logo.png',
      extension: 'png',
    });
    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    /////////

    worksheet.addRow([]);
    //add header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }

      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })
    //Add data with conditional formatting
    data.forEach(elt => {
      let row = worksheet.addRow(elt);
    });


    //Footer
    let footerRow = worksheet.addRow(['Rapport en detail relise le' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    worksheet.mergeCells(`A${footerRow.number}:D${footerRow.number}`)

    //saving and exporting the excel file
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');

    })


  }
}
