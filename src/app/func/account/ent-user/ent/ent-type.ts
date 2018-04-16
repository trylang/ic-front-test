// tslint:disable-next-line:class-name
class ListDatas {
    public title?: string[];
    public industry?: any | any [];
    public region?: string [];
    public personDepartment?: string [];
    public pdzhi?: number;
    public value?: string | string[];
    public selectind?: number;
    public productSupplierCategory?: string [] | null;
    public solutionSupplierCategory?: string [] | null;
    public industryModel?: boolean;
    public productcheckedGroup?: string[];
    public solutioncheckedGroup?: string[];
    public messagebol?: boolean;
    public mainProduct?: string;
}

// tslint:disable-next-line:max-classes-per-file
// tslint:disable-next-line:class-name
class seaData {
    public rootkey?: string;
    public rootname?: string;
    public rootstyle?: string[];
    public group?: any[];
    public pdzhi?: number;
    public childtitle?: string;
    public serveUrl?: string;
    public productSupplierCategory?: string [] | null;
    public solutionSupplierCategory?: string [] | null;
}

export {seaData, ListDatas};
