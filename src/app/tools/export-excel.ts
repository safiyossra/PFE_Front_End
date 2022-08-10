import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Injectable({
  providedIn: 'root',
})
export class ExportExcel {
  constructor() { }

  ExportParking(data: any, title?: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt: any) => {
      const tmp = [elt.timeStart, elt.timeEnd, elt.addi, elt.da];
      dataForExcel.push(tmp);
    });
    // if (vehicule) Title = 'Rapport Parking -[' + vehicule + ']';
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: ['DEPART', 'ARRIVÉ', 'ADRESSE', 'DURÉE (MIN)'],
    };
    this.exportExcel(reportData);
  }

  ExportTrajet(data: any, title?: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt: any) => {
      const tmp = [
        elt.timeStart,
        elt.timeEnd,
        elt.addi,
        elt.addf,
        elt.k,
        elt.dc,
        elt.v,
        elt.na,
        elt.cd,
        elt.c,
        elt.cm,
        elt.ct,
      ];
      dataForExcel.push(tmp);
    });

    // if (vehicule) Title = 'Rapport Trajet avec Parking[' + vehicule + ']';
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'DEPART',
        'ARRIVÉ',
        'ADRESSE DEPART',
        'ADRESSE ARIVÉE',
        'KM PARCOURUE',
        'DURÉE DE CONDUITE (MIN)',
        'MAX VITESSE (KM/H)',
        '# ARRETS',
        'CONSOM FUEL (L)',
        'CONSOM (%)',
        'CONSOM (MAD)',
        'CONSOM THÉORIQUE (L)',
      ],
    };
    this.exportExcel(reportData);
  }

  ExportEvents(data: any, title?: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [
        elt.timestamp,
        elt.status,
        elt.latlon,
        elt.speedKPH,
        elt.odometerKM,
        elt.fuelLevel,
        elt.fuelTotal,
        elt.address,
        elt.creationTime,
      ];
      dataForExcel.push(tmp);
    });
    // if (vehicule) Title = 'Rapport Events -[' + vehicule + ']';
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'DATE',
        'STATUS',
        'LAT/LON',
        'VITESSE(KM/H)',
        'KILOMÉTRAGE',
        'FUEL VOL(L)',
        'CARBURANT TOTAL(L)',
        'ADRESSE',
        'INSERT DATE',
      ],
    };
    this.exportExcel(reportData);
  }



  exportExcel(excelData: { title: any; data: any; headers: any; }) {
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('RAPPORT');

    //add rows and formatting

    worksheet.mergeCells('D8', 'I10');
    let titleRow = worksheet.getCell('D8');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '366DAD' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    //Company

    worksheet.mergeCells('A5:D6');
    let Company = 'Sendatrack.com';
    let CompanyCell = worksheet.getCell('A6');
    CompanyCell.value = Company;
    CompanyCell.font = {
      name: 'Calibri',
      size: 14,
      bold: true,
      color: { argb: '033A7A' }
    }
    CompanyCell.alignment = { vertical: 'middle', horizontal: 'left' }

    //Adress
    worksheet.mergeCells('H1:K3');
    let adress1 = '7, Résidence Rami, Rue Sebta, 2º étage, 8, Casablanca – Maroc';

    //let date =d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear() +':'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    let Adress1Cell = worksheet.getCell('H1');
    Adress1Cell.value = adress1;
    Adress1Cell.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
      color: { argb: '033A7A' }
    }
    Adress1Cell.alignment = { vertical: 'middle', horizontal: 'left' }
    worksheet.mergeCells('H4:K6');

    let adress2 = 'T114 Technopark de Tanger – Maroc';
    let Adress2Cell = worksheet.getCell('H4');
    Adress2Cell.value = adress2;
    Adress2Cell.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
      color: { argb: '033A7A' }
    }
    Adress2Cell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Logo image
    let myLogoImage = workbook.addImage({

      base64: 'assets/img/brand/logo_sidenav_brand.png',
      extension: 'png'
    });
    worksheet.mergeCells('A1:D4');
    worksheet.addImage(myLogoImage, 'A1:D4');


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

    data.forEach((elt: any) => {
      let row = worksheet.addRow(elt);
    });


    //Footer
    worksheet.addRow([]);
    worksheet.addRow([]);
    let footerRow = worksheet.addRow([' Details: ' + Date()]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E6DD8D' }
    };

    worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`)

    //saving and exporting the excel file
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');

    })


  }
}
