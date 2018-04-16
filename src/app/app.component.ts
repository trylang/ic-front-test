import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, Route, RouterState, ActivatedRoute, NavigationEnd, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import '../asset/scss/ark.scss';

@Component({
  selector: 'ic-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private  activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    // this.router.events
    // .filter((event) => event instanceof NavigationEnd)
    // .map((event) => this.activatedRoute)
    // .subscribe((event) => {
    //   // do relative router action.
    //   // console.warn(event);
    //   // console.warn(event.component);
    // });
  }

  // TODO:
  // public onActivate(e: any, outlet: any) {
  //   console.warn('666');
  //   outlet.scrollTop = 0;
  //   window.scroll(0, 0);
  // }
}
