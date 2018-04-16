import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  templateUrl: './email-page.component.html',
  styles: [`
  .container {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    min-height: 400px;
  }
  `]
})
export class EmailPageComponent implements OnInit {

  public msg: string;

  constructor(private router: Router,  private activeRoute: ActivatedRoute ) {}
  public ngOnInit() {
    this.msg = this.activeRoute.snapshot.queryParams['msg'];
  }
}
