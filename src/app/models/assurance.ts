export class Assurance {
    assuranceID: any
    designation: any
    etapes: IItemEtape[]

}

interface IItemEtape {
    etapeID: number;
    designation: string;
}