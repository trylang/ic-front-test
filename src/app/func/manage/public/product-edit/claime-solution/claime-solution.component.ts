import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SnackBar } from '../../../../../tool/snackbar';
import { ClaimeSolutionService } from './claime-solution.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './claime-solution.component.html',
  providers: [ClaimeSolutionService]
  // styleUrls: ['./name.component.css']
})
export class ClaimeSolutionComponent implements OnInit {
  public solutions: any[];
  public totalRecords: number;
  public keyword: string;
  private solutionResults: Array<{ name: string; md5: string }> = [];

  constructor(
    private snackbar: SnackBar,
    private claimeSolutionService: ClaimeSolutionService,
    public dialogRef: MatDialogRef<ClaimeSolutionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<{ name: string; md5: string }>
  ) {}

  public ngOnInit() {
    if (this.data) {
      this.solutionResults = _.cloneDeep(this.data);
    }
  }

  public toggleClaime(md5: string, name: string): void {
    if (
      this.solutionResults.some((e: any) => {
        return e.md5 === md5;
      })
    ) {
      this.solutionResults = this.solutionResults.filter((e: any) => e.md5 !== md5);
    } else {
      this.solutionResults.push({
        md5,
        name
      });
    }

    this.solutions.forEach((e: any) => {
      if (e.md5 === md5) {
        e.isClaimed = !e.isClaimed;
      }
    });
  }

  public onApply() {
    const result = this.solutionResults.map((e) => {
      return {
        name: this.strip(e.name),
        md5: e.md5
      };
    });
    this.dialogRef.close(result);
  }

  private strip(html: string) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  public onSearch(name: string) {
    this.keyword = name;
    this.getAllSolutions(1, name);
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.getAllSolutions(page, this.keyword);
  }

  private getAllSolutions(page: number = 1, name?: string) {
    this.claimeSolutionService.getAllSolutions(page, name).subscribe((data: any) => {
      if ('2000' === data.code) {
        data.data.resultList.forEach((e: any) => {
          e.isClaimed = this.solutionResults.length > 0 && this.solutionResults.some((f: any) => f.md5 === e.md5) ? true : false;
        });
        this.solutions = data.data.resultList;
        this.totalRecords = data.data.size;
      }
    });
  }
}
