import { Component, ElementRef, Input, Output, SimpleChange, EventEmitter } from '@angular/core';

@Component({
  selector: 'ark-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() public pageLinkSize: number = 5;
  @Output() public onPageChange: EventEmitter<any> = new EventEmitter();
  @Input() public style: any;
  @Input() public styleClass: string;
  @Input() public rowsPerPageOptions: number[];
  @Input() public alwaysShow: boolean = false;

  public pageLinks: number[];
  private totalRecordsTmp: number = 0;
  private firstTmp: number = 0;
  private rowsTmp: number = 0;

  @Input()
  get totalRecords(): number {
    return this.totalRecordsTmp;
  }

  set totalRecords(val: number) {
    this.totalRecordsTmp = val;
    this.updatePageLinks();
  }

  @Input()
  get first(): number {
    return this.firstTmp;
  }

  set first(val: number) {
    this.firstTmp = val;
    this.updatePageLinks();
  }

  @Input()
  get rows(): number {
    return this.rowsTmp;
  }

  set rows(val: number) {
    this.rowsTmp = val;
    this.updatePageLinks();
  }

  @Input()
  get currentPage() {
    return this.firstTmp / this.rows + 1;
  }

  set currentPage(page: number) {
    this.firstTmp = (page - 1) * this.rows;
    this.updatePageLinks();
  }

  public isFirstPage() {
    return this.getPage() === 0;
  }

  public isLastPage() {
    return this.getPage() === this.getPageCount() - 1;
  }

  public changePage(p: number, event: MouseEvent) {
    const pc = this.getPageCount();

    if (p >= 0 && p < pc) {
      this.first = this.rows * p;
      const state = {
        page: p,
        first: this.first,
        rows: this.rows,
        pageCount: pc
      };
      this.updatePageLinks();

      this.onPageChange.emit(state);
    }

    if (event) {
      event.preventDefault();
    }
  }

  public getPage(): number {
    return Math.floor(this.first / this.rows);
  }

  public changePageToFirst(event: MouseEvent) {
    this.changePage(0, event);
  }

  public changePageToPrev(event: MouseEvent) {
    this.changePage(this.getPage() - 1, event);
  }

  public changePageToNext(event: MouseEvent) {
    this.changePage(this.getPage() + 1, event);
  }

  public changePageToLast(event: MouseEvent) {
    this.changePage(this.getPageCount() - 1, event);
  }

  public onRppChange(event: any) {
    this.rows = this.rowsPerPageOptions[event.target.selectedIndex];
    this.changePageToFirst(event);
  }

  private getPageCount() {
    return Math.ceil(this.totalRecords / this.rows) || 1;
  }

  private calculatePageLinkBoundaries() {
    const numberOfPages = this.getPageCount();
    const  visiblePages = Math.min(this.pageLinkSize, numberOfPages);

    // calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2));
    const end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    // check when approaching to last page
    const delta = this.pageLinkSize - (end - start + 1);
    start = Math.max(0, start - delta);

    return [start, end];
  }

  private updatePageLinks() {
    this.pageLinks = [];
    const boundaries = this.calculatePageLinkBoundaries();
    const start = boundaries[0];
    const end = boundaries[1];

    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }

}
