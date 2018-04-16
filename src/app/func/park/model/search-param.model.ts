export class SearchParam {
    public province: string;
    public level: string;
    public industries: string;
    public tenements: string;
    public key: string;
    public sort: number;
    public page: number;
    public option: number;

    constructor() {
        this.province = null;
        this.level = null;
        this.industries = null;
        this.tenements = null;
        this.key = null;
        this.sort = -1;
        this.page = 1;
        this.option = 1;
    }
}
