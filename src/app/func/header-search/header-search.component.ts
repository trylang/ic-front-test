import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'ark-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss']
})
export class HeaderSearchComponent {
  public placeholder: string = '';
  public placeholderTmp: string = '';
  public typeList: Array<{ routerLink: string; placeholder: string; title: string; }>;
  private keywords: string;
  private stateURL: string;
  private searchTerms = new Subject<string>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.keywords = this.route.snapshot.queryParams['key'];
    this.stateURL = this.router.routerState.snapshot.url;

    this.searchTerms
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((key: string) => {
        this.redirectToTarget(key);
      });

    this.typeList = [{
      title: '方案',
      routerLink: '/solution/search',
      placeholder: '智慧工厂'
    }, {
      title: '产品',
      routerLink: '/product/search',
      placeholder: '数控机床'
    }, {
      title: '供应商',
      routerLink: '/company/search',
      placeholder: '机器人'
    }, {
      title: '专利',
      routerLink: '/patents/search',
      placeholder: '工业机器人'
    }, {
      title: '园区',
      routerLink: '/park/search',
      placeholder: '工业'
    }, {
      title: '标准',
      routerLink: '/standard/search',
      placeholder: '机器人'
    }, {
      title: '政策',
      routerLink: '/policy/search',
      placeholder: '智能制造'
    }];

    for (const item of this.typeList) {
      if (this.stateURL.indexOf(item.routerLink) >  -1) {
        this.placeholder = item.placeholder;
      }
    }
  }

  public onSearch() {
    if (!this.filterSpace(this.keywords)) {
      this.keywords = null;
    }
    this.redirectToTarget(this.keywords);
  }

  public onChange() {
    if (this.filterSpace(this.keywords)) {
      this.searchTerms.next(this.keywords);
    }
  }

  public onFocusIn() {
    this.placeholderTmp =  this.placeholder;
    this.placeholder = '';
  }

  public onFocusOut() {
    this.placeholder = this.placeholderTmp;
  }

  // 过滤空格查询
  private filterSpace(key: string): boolean {
    return !/^\s+$/.test(key);
  }

  private redirectToTarget(key: string) {
    if (key) {
      this.router.navigate(['./'], {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams: {
          key,
          page: 1
        }
      });
    } else {
      this.router.navigate(['./'], {
        relativeTo: this.route
      });
    }
  }
}
