// import { ExportExcel } from './export-excel';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ExportingTool {
    constructor() { }

    exportPdf_Parking(data, title: string) {
        const doc = new jsPDF();
        const rows: any = [];
        data.forEach((elt) => {
            const tmp = [elt.timeStart, elt.timeEnd, elt.addi, elt.da];
            rows.push(tmp);
        });
        doc.setFontSize(14);
        doc.setDrawColor('blue');
        let adress2 = 'Tanger T114 Technopark de Tanger – Maroc';
        let adress1 = 'Casablanca 7, Résidence Rami, Rue Sebta, ';
        let add = '2º étage, 8, Casablanca – Maroc';
        doc.addImage('assets/img/brand/logo_sidenav_brand.png', 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(adress1, 130, 17);
        doc.text(add, 130, 21)
        doc.text(adress2, 130, 25);
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
            rows.push(tmp);
        });

        doc.setFontSize(14);
        doc.setDrawColor('blue');
        let adress2 = 'Tanger T114 Technopark de Tanger - Maroc';
        let adress1 = 'Casablanca 7, Résidence Rami, Rue Sebta, ';
        let add = '2º étage, 8, Casablanca - Maroc';
        doc.addImage('assets/img/brand/logo_sidenav_brand.png', 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(adress1, 210, 17);
        doc.text(add, 210, 21)
        doc.text(adress2, 210, 25);
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
        let adress2 = 'Tanger T114 Technopark de Tanger – Maroc';
        let adress1 = 'Casablanca 7, Résidence Rami, Rue Sebta, ';
        let add = '2º étage, 8, Casablanca – Maroc';
        doc.addImage('assets/img/brand/logo_sidenav_brand.png', 'png', 10, 4, 30, 30);
        doc.setFontSize(12);
        doc.setTextColor('#033A7A');
        doc.text('Sendatrack.com', 10, 32);
        doc.setFontSize(10);
        doc.text(adress1, 210, 17);
        doc.text(add, 210, 21)
        doc.text(adress2, 210, 25);
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
