import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ClaimeEntService } from './claime-ent.service';

@Component({
  // selector: 'ark-ent-claime-dialog',
  templateUrl: './claime-ent.component.html',
  // styleUrls: ['./name.component.css']
  providers: [ ClaimeEntService ]
})
export class ClaimeEntComponent implements OnInit {
  public ents: any[];
  public totalRecords: number;
  public keyword: string;

  constructor(
    public dialogRef: MatDialogRef<ClaimeEntComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private claimeEntService: ClaimeEntService
  ) {}

  public ngOnInit() {
    this.listCompanies(1);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onClaime(md5: string, name: string): void {
    this.dialogRef.close({md5, name});
  }

  public onSearch(name: string) {
    // TODO: page should recall 1
    this.keyword = name;
    this.listCompanies(1, name);
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.listCompanies(page, this.keyword);
  }

  private listCompanies(page: number = 1, name?: string) {
    this.claimeEntService.listCompanies(page, name).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.ents = data.data;
        this.totalRecords = data.size;
      }
    });
  }
}
