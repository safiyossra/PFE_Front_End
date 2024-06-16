// import { ExportExcel } from './export-excel';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
            const tmp = [elt.timeStart, elt.timeEnd, elt.addi, elt.da, elt.odo, elt.ft,elt.driverID];
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
                { dataKey: 'Conducteur', header: 'Conducteur' },
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
                elt.cd, elt.c, elt.cm, elt.ct, elt.odo, elt.ft,elt.driverID
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
                { dataKey: 'DURÉE (MIN)', header: 'DURÉE (MIN)' },
                { dataKey: 'MAX VITESSE (KM/H)', header: 'MAX VITESSE (KM/H)' },
                { dataKey: '# ARRETS', header: '# ARRETS' },
                { dataKey: 'CONSOM (L)', header: 'CONSOM (L)' },
                { dataKey: 'CONSOM (%)', header: 'CONSOM (%)' },
                { dataKey: 'CONSOM (MAD)', header: 'CONSOM (MAD)' },
                { dataKey: 'CONSOM THÉORIQUE (L)', header: 'CONSOM THÉORIQUE (L)' },
                { dataKey: 'Odomètre', header: 'Odomètre' },
                { dataKey: 'Fuel', header: 'Fuel' },
                { dataKey: 'Conducteur', header: 'Conducteur' },
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

    exportPdf_TrajetsEco(data, title?: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        // ["Accélération", "Freinage", "Virage"];

        data.forEach((elt) => {
            const tmp = [
                elt.timeStart, elt.timeEnd, elt.addi, elt.addf, elt.k, elt.dc,elt.eco,elt.acc,elt.br,elt.cor, elt.v, elt.na,
                elt.da, elt.c, elt.cm,elt.t,elt.device
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
                { dataKey: 'DURÉE (MIN)', header: 'DURÉE (MIN)' },
                { dataKey: 'ECO-INDEX', header: 'ECO-INDEX' },
                { dataKey: 'Accélération', header: 'Accélération' },
                { dataKey: 'Freinage', header: 'Freinage' },
                { dataKey: 'Virage', header: 'Virage' },
                { dataKey: 'MAX VITESSE (KM/H)', header: 'MAX VITESSE (KM/H)' },
                { dataKey: '# ARRETS', header: '# ARRETS' },
                { dataKey: 'DURÉE ARRETS', header: 'DURÉE ARRETS' },
                { dataKey: 'CONSOM (L)', header: 'CONSOM (L)' },
                { dataKey: 'CONSOM (%)', header: 'CONSOM (%)' },
                { dataKey: 'MAX TEMP(°C)', header: 'MAX TEMP(°C)' },
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
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
    exportPdf_Synthetiques(data, title?: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [
                elt.d, elt.km, elt.v, elt.c, elt.cm, elt.cd, elt.ct
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
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
                { dataKey: 'KM PARCOURUE', header: 'KM PARCOURUE' },
                { dataKey: 'MAX VITESSE (KM/H)', header: 'MAX VITESSE (KM/H)' },
                { dataKey: 'CONSOM (L)', header: 'CONSOM (L)' },
                { dataKey: 'CONSOM (%)', header: 'CONSOM (%)' },
                { dataKey: 'CONSOM (MAD)', header: 'CONSOM (MAD)' },
                { dataKey: 'CONSOM THÉORIQUE (L)', header: 'CONSOM THÉORIQUE (L)' }
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
                elt.driverID,
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
                { dataKey: 'Conducteur', header: 'Conducteur' }
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

    //////Maintenance
    exportPdf_Consommation(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [
                elt.id,
                elt.driverName,
                elt.deviceName,
                elt.fournisseur,
                elt.numCarte,
                elt.numBon,
                elt.qte,
                elt.pleinOn,
                elt.montant,
                elt.montantTTC,
                elt.kmPrecedent,
                elt.kmEncours,
                elt.consoM,
                elt.dateFill,
                elt.observation,
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
                { dataKey: 'ID', header: 'ID' },
                { dataKey: 'CHAUFFEUR', header: 'CHAUFFEUR' },
                { dataKey: 'VEHICULE', header: 'VEHICULE' },
                { dataKey: 'FOURNISSEUR', header: 'FOURNISSEUR' },
                { dataKey: 'N CARTE', header: 'N CARTE' },
                { dataKey: 'N BON', header: 'N BON' },
                { dataKey: 'QTE', header: 'QTE' },
                { dataKey: 'PLEIN', header: 'PLEIN' },
                { dataKey: 'MONTANT', header: 'MONTANT' },
                { dataKey: 'MONTANT TTC', header: 'MONTANT TTC' },
                { dataKey: 'KM PRECEDENT', header: 'KM PRECEDENT' },
                { dataKey: 'KM ENCOURS', header: 'KM ENCOURS' },
                { dataKey: 'CONSOMMATION MOY', header: 'CONSOMMATION MOY' },
                { dataKey: 'DATE', header: 'DATE' },
                { dataKey: 'OBSERVATION', header: 'OBSERVATION' },
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
        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Entretien(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [
                elt.deviceID,
                elt.operation,
                elt.typeDeclenchement,
                elt.value,
                elt.status,
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
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
                { dataKey: "TYPE D'OPÉRATION", header: "TYPE D'OPÉRATION" },
                { dataKey: 'DÉCLENCHEMENT', header: 'DÉCLENCHEMENT' },
                { dataKey: 'VALEUR', header: 'VALEUR' },
                { dataKey: 'STATUS', header: 'STATUS' },
                { dataKey: 'DATE DE CRÉATION', header: 'DATE DE CRÉATION' },
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

    exportPdf_Pneu(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [
                elt.deviceName,
                elt.NumSerie,
                elt.EtatPneu,
                elt.KmAcquisition,
                elt.DateDebut,
                elt.DateFin,
                elt.PositionPneu,
                elt.Fournisseurs,
                elt.ModelePneu,
                elt.Montant
            ];
            rows.push(tmp);
        });
        doc.setFontSize(9);
        doc.setDrawColor('blue');

        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(9);

        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 8, 32); //10
        doc.setFontSize(8);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        // console.log("title ", title);

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'Véhicule', header: 'Véhicule' },
                { dataKey: "N° série", header: "N° série" },
                { dataKey: 'Etat Pneu', header: 'Etat Pneu' },
                { dataKey: 'Km Acquisition', header: 'Km Acquisition' },
                { dataKey: 'Date debut', header: 'Date debut' },
                { dataKey: 'Date fin', header: 'Date fin' },
                { dataKey: 'Position Pneu', header: 'Position Pneu' },
                { dataKey: 'Fournisseurs', header: 'Fournisseurs' },
                { dataKey: 'Modele Pneu', header: 'Modele Pneu' },
                { dataKey: 'Montant', header: 'Montant' },


            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            styles: {
                fontSize: 10,
                font: 'PTSans'
            },
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);

        this.addFooters(doc);
        doc.save(title);
    }
    
    // added function 
    exportPdf_Accident(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [
                elt.date,
                elt.deviceName,
                elt.driverName,
                elt.lieu,
                elt.degatType,
                elt.etapeAssuranceName,
                elt.typeAssurance,
                elt.statut,

            ];
            rows.push(tmp);
        });
        doc.setFontSize(9);
        doc.setDrawColor('blue');

        doc.addImage(this.picture, 'png', 10, 4, 30, 30);
        doc.setFontSize(9);

        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 8, 32); //10
        doc.setFontSize(8);
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');
        // console.log("title ", title);

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'Date', header: 'Date' },
                { dataKey: "Véhicule", header: "Véhicule" },
                { dataKey: 'Conducteur', header: 'Conducteur' },
                { dataKey: 'Lieu', header: 'Lieu' },
                { dataKey: 'Type Dégât', header: 'Type Dégât' },
                { dataKey: `Etat d'avancement`, header: `Etat d'avancement` },
                { dataKey: 'Type Assurance', header: 'Type Assurance' },
                { dataKey: 'Statut', header: 'Statut' },

            ],
            body: rows,
            theme: 'grid',
            rowPageBreak: 'auto',
            //specifies where to start drowing the table
            startY: 60,
            styles: {
                fontSize: 10,
                font: 'PTSans'
            },
            showHead: 'firstPage',
            headStyles: { fillColor: [5, 97, 203] },
            columnStyles: { text: { cellWidth: 'wrap' } },
        });
        doc.setFontSize(10);

        this.addFooters(doc);
        doc.save(title);
    }

    exportPdf_Notifications(data: any[], title: string) {
        const doc = new jsPDF();
        const rows: any = [];

        data.forEach((elt) => {
            const tmp = [
                elt.timestamp,
                elt.description,
                elt.subject,
                elt.message
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
        doc.text(this.adress1, 130, 17);
        doc.text(this.add, 130, 21);
        doc.text(this.adress2, 130, 25);
        doc.setFontSize(18);
        doc.setTextColor('#366DAD');

        doc.text(title, 150, 50, { align: 'center' });

        (doc as any).autoTable({
            columns: [
                { dataKey: 'DATE', header: 'DATE' },
                { dataKey: 'VÉHICULE', header: 'VÉHICULE' },
                { dataKey: 'DESCRIPTION', header: 'DESCRIPTION' },
                { dataKey: 'MESSAGE', header: 'MESSAGE' },
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

    async convetToPDF(ElementId: string, title: string) {
        const printElement: any = document.getElementById(ElementId);
        const test: any = window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        const convertedCanvas = await html2canvas(printElement, {
            allowTaint: false,
            removeContainer: true,
            backgroundColor: null,
            imageTimeout: 15000,
            // logging: true,
            scale: 1,
            scrollY: test,
            useCORS: true
        });
        const contentDataURL = convertedCanvas.toDataURL("image/png");
        // const imgWidth = 205;
        // const imgHeight = (convertedCanvas.height * imgWidth) / convertedCanvas.width;
        const shouldCompress = false
        let pdf = new jsPDF("l", "mm", "a4", shouldCompress);
        pdf.setFontSize(14);
        pdf.setDrawColor('blue');
        pdf.addImage(this.picture, 'png', 10, 4, 30, 30);
        pdf.setFontSize(12);
        pdf.setTextColor('#033A7A');
        pdf.text('Sendatrack.com', 10, 32);
        pdf.setFontSize(10);
        pdf.text(this.adress1, 210, 17, { align: 'left' });
        pdf.text(this.add, 210, 21, { align: 'left' });
        pdf.text(this.adress2, 210, 25, { align: 'left' });
        pdf.setFontSize(18);
        pdf.setTextColor('#366DAD');
        pdf.text(title, 150, 45, { align: 'center' });
        pdf.addImage(contentDataURL, "PNG", 10, 55, 280, 140 );
        this.addFooters(pdf);
        pdf.save(title + '.pdf');
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


    exportPdf_Passager(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [
                elt.lastName,
                elt.FirstName,
                elt.address,
                elt.tel,
                elt.cin,
                elt.city,
                elt.country,
                elt.code,
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
                { dataKey: "NOM DE PASSAGER", header: "NOM DE PASSAGER" },
                { dataKey: 'PRENOM DE PASSAGER', header: 'PRENOM DE PASSAGER' },
                { dataKey: 'ADRESSE ', header: 'ADRESSE ' },
                { dataKey: 'TELEPHONE', header: ' TELEPHONE' },
                { dataKey: 'CIN ', header: 'CIN' },
                { dataKey: 'VILLE', header: 'VILLE' },   
                { dataKey: 'PAYS', header: 'PAYS' },
                { dataKey: 'CODE', header: 'CODE' },
                { dataKey: 'CLIENT', header: 'CLIENT' },
          
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
    exportPdf_Stock(data: any[], title: string) {
        const doc = new jsPDF('l');
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [
                
                elt.DateMvt,
                elt.Reference,
                elt.Price,
                elt.observation,
                elt.Designation,
                elt.Kilometrage,
                elt.Qte,
                elt.NumBon,
                elt.id_Vehicule,
                elt.id_TypePanne,
                elt.login,
                elt.TypeMvt
            
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
                
                { dataKey: 'Date de Mouvement', header: 'Date de Mouvement' },
                { dataKey: 'Référence', header: 'Référence' },
                { dataKey: 'Prix', header: ' Prix' },
                { dataKey: ' Designation', header: ' Designation' },        
                { dataKey: 'Observation', header: 'Observation' },
                { dataKey: 'kilométrage', header: 'kilométrage' },   
                { dataKey: 'Quantité', header: 'Quantité' },
                { dataKey: 'Document', header: 'Document' },
                { dataKey: 'Véhicule', header: 'Véhicule' },
                { dataKey: 'Type de Panne', header: 'Type de Panne' },
                { dataKey: 'Login', header: 'Login' },
                {dataKey: 'Type de Mouvement', header: 'Type de Mouvement' },
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
}
