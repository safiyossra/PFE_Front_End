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
      const tmp = [elt.timeStart, elt.timeEnd, elt.addi, elt.da, elt.odo, elt.ft];
      dataForExcel.push(tmp);
    });
    // if (vehicule) Title = 'Rapport Parking -[' + vehicule + ']';
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: ['DEPART', 'ARRIVÉ', 'ADRESSE', 'DURÉE (MIN)',
        'Odomètre',
        'Fuel',],
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
        elt.ct, elt.odo, elt.ft
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
        'Odomètre',
        'Fuel',
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

  ExportCarburant(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [
        elt.timestamp,
        elt.deviceID,
        elt.device,
        elt.latlng,
        elt.fuelTotal,
        elt.fuelstart,
        elt.fuelLevel,
        elt.deltaFuelLevel,
        elt.odometerKM,
        elt.address,
      ];
      dataForExcel.push(tmp);
    });

    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'DATE/HEURE',
        'ID',
        'VEHICULE',
        'LATITUDE/LONGITUDE',
        'CARBURANT TOTAL (L)',
        'CARBURANT AVANT (L)',
        'CARBURANT APRÈS (L)',
        'CARBURANT DIFF (L)',
        'ODOMÈTRE',
        'ADRESSE',
      ],
    };
    this.exportExcel(reportData);
  }

  Export_Synthetique(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [elt.d, elt.km, elt.v, elt.c, elt.cm, elt.cd, elt.ct];
      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'VÉHICULE',
        'KM PARCOURUE',
        'VITESSE MAXIMALE (KM/H)',
        'CONSOMMATION (L)',
        'CONSOMMATION (%)',
        'CONSOMMATION (MAD)',
        'CONSOMMATION THÉORIQUE (L)',
      ],
    };
    this.exportExcel(reportData);
  }

  ////////////PARAMETRAGE
  ExportConducteurs(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [elt.driverID, elt.contactPhone, elt.description, elt.displayName];
      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: ['CONDUCTEURSID', 'NUMÉRO DE TÉLÉPHONE', 'DESCRIPTION', 'NOM'],
    };
    this.exportExcel(reportData);
  }

  Export_Vehicules(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [
        elt.deviceID,
        elt.description,
        elt.uniqueID,
        elt.lastOdometerKM,
        elt.fuel,
        elt.deviceCode,
        elt.simPhoneNumber,
      ];
      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'DEVICE',
        'VÉHICULE',
        'ID UNIQUE',
        'ODOMÈTRE (KM)',
        'TOTAL CARBURANT (L)',
        'DEVICE CODE',
        'TEL',
      ],
    };
    this.exportExcel(reportData);
  }

  Export_Users(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [
        elt.userID,
        elt.description,
        elt.roleID,
        elt.contactName,
        elt.notifyEmail,
        elt.timeZone,
        elt.lastLoginTime,
      ];
      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: [
        'IDENTIFIANT',
        "NOM DE L'UTILISATEUR",
        'ROLE',
        'NOM DU CONTACT',
        'ADRESSE EMAIL',
        'FUSEAU HORAIRE',
        'LAST LOGIN',
      ],
    };
    this.exportExcel(reportData);
  }

  Export_GroupVehicules(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [elt.groupID, elt.displayName, elt.description, elt.nbrvehicules];

      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: ['IDENTIFIANT', 'NOM', 'DESCRIPTION', 'NOMBRE DE VÉHICULES'],
    };
    this.exportExcel(reportData);
  }

  Export_Alerts(data: any[], title: string) {
    var dataForExcel: Object[] = [];
    data.forEach((elt) => {
      const tmp = [elt.ruleID, elt.description, elt.notifyEmail, elt.ruleTag];

      dataForExcel.push(tmp);
    });
    let reportData = {
      title: title,
      data: dataForExcel,
      headers: ['IDENTIFIANT', 'DESCRIPTION', 'EMAIL', 'CRON RULE'],
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

    // worksheet.mergeCells('D8', 'I10');
    // let titleRow = worksheet.getCell('D8');
    // titleRow.value = title;
    // titleRow.font = {
    //   name: 'Calibri',
    //   size: 16,
    //   underline: 'single',
    //   bold: true,
    //   color: { argb: '366DAD' }
    // }
    // titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    //Company

    // worksheet.mergeCells('A5:D6');
    // let Company = 'Sendatrack.com';
    // let CompanyCell = worksheet.getCell('A6');
    // CompanyCell.value = Company;
    // CompanyCell.font = {
    //   name: 'Calibri',
    //   size: 14,
    //   bold: true,
    //   color: { argb: '033A7A' }
    // }
    // CompanyCell.alignment = { vertical: 'middle', horizontal: 'left' }

    //Adress
    // worksheet.mergeCells('H1:K3');
    // let adress1 = '7, Résidence Rami, Rue Sebta, 2º étage, 8, Casablanca – Maroc';

    //let date =d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear() +':'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    // let Adress1Cell = worksheet.getCell('H1');
    // Adress1Cell.value = adress1;
    // Adress1Cell.font = {
    //   name: 'Calibri',
    //   size: 10,
    //   bold: true,
    //   color: { argb: '033A7A' }
    // }
    // Adress1Cell.alignment = { vertical: 'middle', horizontal: 'left' }
    // worksheet.mergeCells('H4:K6');

    // let adress2 = 'T114 Technopark de Tanger – Maroc';
    // let Adress2Cell = worksheet.getCell('H4');
    // Adress2Cell.value = adress2;
    // Adress2Cell.font = {
    //   name: 'Calibri',
    //   size: 10,
    //   bold: true,
    //   color: { argb: '033A7A' }
    // }
    // Adress2Cell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Logo image
    // let myLogoImage = workbook.addImage({
    //   filename: 'assets/img/brand/logo_sidenav_brand.png',
    //   extension: 'png'
    // });
    // worksheet.mergeCells('A1:D4');
    // worksheet.addImage(myLogoImage, 'A1:D4');

    // worksheet.addRow([]);
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
      worksheet.addRow(elt);
    });

    //Footer
    // worksheet.addRow([]);
    // worksheet.addRow([]);
    let footerRow = worksheet.addRow([' Details: ' + Date()]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4167B8' }
    };
    footerRow.getCell(1).font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12
    };

    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`)

    //saving and exporting the excel file
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');

    })


  }
}
