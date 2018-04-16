import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './add-ent.component.html',
  // styleUrls: ['./name.component.css']
})
export class AddEntComponent implements OnInit {
  public ent: string;
  public parkName: string;

  constructor(
    public dialogRef: MatDialogRef<AddEntComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  public ngOnInit() {
    this.parkName = this.data || null;
  }

  public onApply() {
    this.dialogRef.close({
      success: true,
      data: this.ent && this.ent.split(/\n+/g).filter((e) => !/^\s+$/.test(e)) || null
    });
  }
}
