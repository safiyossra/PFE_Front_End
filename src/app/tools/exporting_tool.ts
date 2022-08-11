// import { ExportExcel } from './export-excel';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ExportingTool {
    constructor() { }
    picture = 'assets/img/brand/logo_sidenav_brand.png';

    adress2 = 'Tanger T114 Technopark de Tanger - Maroc';
    adress1 = 'Casablanca 7, Résidence Rami, Rue Sebta, ';
    add = '2º étage, 8, Casablanca - Maroc';

    exportPdf_Parking(data, title: string) {
        const doc = new jsPDF();
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [elt.timeStart, elt.timeEnd, elt.addi, elt.da, elt.odo, elt.ft];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21)
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        // Title = "Rapport Parking [" + vehicule + "]";
        doc.text(title, 150, 50, { align: 'center' });
        // doc.text(Title, 70, 50);
        (doc as any).autoTable({
            columns: [
                { dataKey: 'DEPART', header: 'DEPART' },
                { dataKey: 'ARRIVÉ', header: 'ARRIVÉ' },
                { dataKey: 'ADRESSE', header: 'ADRESSE' },
                { dataKey: 'DURÉE (MIN)', header: 'DURÉE (MIN)' },
                { dataKey: 'Odomètre', header: 'Odomètre' },
                { dataKey: 'Fuel', header: 'Fuel' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc)
        doc.save(title);
    }

    exportPdf_Trajets(data, title?: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [
                elt.timeStart, elt.timeEnd, elt.addi, elt.addf, elt.k, elt.dc, elt.v, elt.na,
                elt.cd, elt.c, elt.cm, elt.ct, elt.odo, elt.ft
            ];
            rows.push(tmp);
        });

        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21)
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        // Title = "Rapport Trajet et Parking [" + vehicule + "]";
        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'DEPART', header: 'DEPART' },
                { dataKey: 'ARRIVÉ', header: 'ARRIVÉ' },
                { dataKey: 'ADRESSE DEPART', header: 'ADRESSE DEPART' },
                { dataKey: 'ADRESSE ARIVÉE', header: 'ADRESSE ARIVÉE' },
                { dataKey: 'KM PARCOURUE', header: 'KM PARCOURUE' },
                { dataKey: 'DURÉE DE CONDUITE (MIN)', header: 'DURÉE DE CONDUITE (MIN)' },
                { dataKey: 'MAX VITESSE (KM/H)', header: 'MAX VITESSE (KM/H)' },
                { dataKey: '# ARRETS', header: '# ARRETS' },
                { dataKey: 'CONSOM FUEL (L)', header: 'CONSOM FUEL (L)' },
                { dataKey: 'CONSOM (%)', header: 'CONSOM (%)' },
                { dataKey: 'CONSOM (MAD)', header: 'CONSOM (MAD)' },
                { dataKey: 'CONSOM THÉORIQUE (L)', header: 'CONSOM THÉORIQUE (L)' },
                { dataKey: 'Odomètre', header: 'Odomètre' },
                { dataKey: 'Fuel', header: 'Fuel' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc)
        doc.save(title);

    }

    exportPdf_Events(data, title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
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
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21)
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        // Title = "Rapport Evenements [" + vehicule + "]";
        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'DATE', header: 'DATE' },
                { dataKey: 'STATUS', header: 'STATUS' },
                { dataKey: 'LAT/LON', header: 'LAT/LON' },
                { dataKey: 'VITESSE(KM/H)', header: 'VITESSE(KM/H)' },
                { dataKey: 'KILOMÉTRAGE', header: 'KILOMÉTRAGE' },
                { dataKey: 'FUEL VOL(L)', header: 'FUEL VOL(L)' },
                { dataKey: 'CARBURANT TOTAL(L)', header: 'CARBURANT TOTAL(L)' },
                { dataKey: 'ADRESSE', header: 'ADRESSE' },
                { dataKey: 'INSERT DATE', header: 'INSERT DATE' }
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc)
        doc.save(title);
    }

    exportPdf_Carburant(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
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
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21);
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        doc.text(title, 150, 50, { align: 'center' });
        (doc as any).autoTable({
            columns: [
                { dataKey: 'DATE/HEURE', header: 'DATE/HEURE' },
                { dataKey: 'ID', header: 'ID' },
                { dataKey: 'VEHICULE', header: 'VEHICULE' },
                { dataKey: 'LATITUDE/LONGITUDE', header: 'LATITUDE/LONGITUDE' },
                { dataKey: 'CARBURANT TOTAL (L)', header: 'CARBURANT TOTAL (L)' },
                { dataKey: 'CARBURANT AVANT (L)', header: 'CARBURANT AVANT (L)' },
                { dataKey: 'CARBURANT APRÈS (L)', header: 'CARBURANT APRÈS (L)' },
                { dataKey: 'CARBURANT DIFF (L)', header: 'CARBURANT DIFF (L)' },
                { dataKey: 'ODOMÈTRE', header: 'ODOMÈTRE' },
                { dataKey: 'ADRESSE', header: 'ADRESSE' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Synthetique(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [elt.d, elt.km, elt.v, elt.c, elt.cm, elt.cd, elt.ct];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21);
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        doc.text(title, 150, 50, { align: 'center' });
        (doc as any).autoTable({
            columns: [
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
                { dataKey: 'KM PARCOURUE', header: 'KM PARCOURUE' },
                {
                    dataKey: 'VITESSE MAXIMALE (KM/H)', header: 'VITESSE MAXIMALE (KM/H)',
                },
                { dataKey: 'CONSOMMATION (L)', header: 'CONSOMMATION (L)' },
                { dataKey: 'CONSOMMATION (%)', header: 'CONSOMMATION (%)' },
                { dataKey: 'CONSOMMATION (MAD)', header: 'CONSOMMATION (MAD)' },
                {
                    dataKey: 'CONSOMMATION THÉORIQUE (L)',
                    header: 'CONSOMMATION THÉORIQUE (L)',
                },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    ///////////////// PARAMETRAGE
    exportPdf_Conducteurs(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [elt.driverID, elt.contactPhone, elt.description, elt.displayName];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });
        (doc as any).autoTable({
            columns: [
                { dataKey: 'CONDUCTEURSID', header: 'CONDUCTEURSID' },
                { dataKey: 'NUMÉRO DE TÉLÉPHONE', header: 'NUMÉRO DE TÉLÉPHONE' },
                { dataKey: 'DESCRIPTION', header: 'DESCRIPTION' },
                { dataKey: 'NOM', header: 'NOM' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Vehicules(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
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
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21);
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'DEVICE', header: 'DEVICE' },
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
                { dataKey: 'ID UNIQUE', header: 'ID UNIQUE' },
                { dataKey: 'ODOMÈTRE (KM)', header: 'ODOMÈTRE (KM)' },
                { dataKey: 'TOTAL CARBURANT (L)', header: 'TOTAL CARBURANT (L)' },
                { dataKey: 'DEVICE CODE', header: 'DEVICE CODE' },
                { dataKey: 'TEL', header: 'TEL' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Users(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
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
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 210, 17);
        doc.text(this.add, 210, 21);
        doc.text(this.adress2, 210, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'IDENTIFIANT', header: 'IDENTIFIANT' },
                { dataKey: "NOM DE L'UTILISATEUR", header: "NOM DE L'UTILISATEUR" },
                { dataKey: 'ROLE', header: 'ROLE' },
                { dataKey: 'NOM DU CONTACT', header: 'NOM DU CONTACT' },
                { dataKey: 'ADRESSE EMAIL', header: 'ADRESSE EMAIL' },
                { dataKey: 'FUSEAU HORAIRE', header: 'FUSEAU HORAIRE' },
                { dataKey: 'LAST LOGIN', header: 'LAST LOGIN' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_GroupeVehicules(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [elt.groupID, elt.displayName, elt.description, elt.nbrvehicules];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'IDENTIFIANT', header: 'IDENTIFIANT' },
                { dataKey: 'NOM', header: 'NOM' },
                { dataKey: 'DESCRIPTION', header: 'DESCRIPTION' },
                { dataKey: 'NOMBRE DE VÉHICULES', header: 'NOMBRE DE VÉHICULES' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Alerts(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [elt.ruleID, elt.description, elt.notifyEmail, elt.ruleTag];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'IDENTIFIANT', header: 'IDENTIFIANT' },
                { dataKey: 'DESCRIPTION', header: 'DESCRIPTION' },
                { dataKey: 'EMAIL', header: 'EMAIL' },
                { dataKey: 'CRON RULE', header: 'CRON RULE' },
            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);
        this.addFooters(doc)
        doc.save(title);
    }

    
    addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFont('helvetica', 'italic')
        doc.setTextColor('black');
        doc.setFontSize(8)
        var height = doc.internal.pageSize.height - 10
        var width = doc.internal.pageSize.width - 10
        for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.text(new Date().toLocaleString(), 20, height, {
                align: 'left'
            })
            doc.text('Page ' + String(i) + ' de ' + String(pageCount), width - 10, height, {
                align: 'right'
            })
        }
    }

}
