import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'park-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  public tableData: any = null;
  @Output() public onPageNumber: EventEmitter<any> = new EventEmitter();
  @Output() public onModelChange: EventEmitter<any> = new EventEmitter();

  @Input()
  set data(val: any) {
    this.tableData = val;
  }

  private size: string;
  private totalRecords: number = 100;
  private currentPage: number;

  public modelChange(param: any) {
    this.onModelChange.emit(param);
  }

 /**
  * 分页控制
  * @param {*} paginator
  * @memberof SolutionSearchComponent
  */
  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.onPageNumber.emit(page);
  }

}
