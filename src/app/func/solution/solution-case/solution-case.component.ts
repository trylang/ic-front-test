import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';

import { SolutionService } from '../service/solution.service';
import { Cases } from '../model/case-model';

@Component({
  selector: 'app-solution-case',
  templateUrl: './solution-case.component.html',
  styleUrls: ['./solution-case.component.scss']
})
export class SolutionCaseComponent implements OnInit, AfterViewInit {

  public cases: any[];
  public case: Cases;
  private selItem: number = 0;

  constructor(
    private location: Location,
    private titleService: Title,
    private solutionService: SolutionService,
    private activeRoute: ActivatedRoute
  ) {
    this.case = new Cases();
  }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      (params) => {
        this.getCaseDetail(params['md5']);
        this.getCaseRelate(params['md5']);
      }
    );
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  // 返回上一级
  public goBack() {
    this.location.back();
  }

  private onItemClick(type: number) {
    this.selItem = type;
  }

  private getCaseDetail(md5: string) {
    this.solutionService.getCase(md5).subscribe((res) => {
      if ('2000' === res.code) {
        this.case = res['data'];

        const title = this.titleService.getTitle();
        this.titleService.setTitle(this.case.name + '_案例详情' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }


  private getCaseRelate(md5: string) {
    this.solutionService.getCaseRelate(md5).subscribe((res) => {
      if ('2000' === res.code) {
        this.cases = res['data'];
      }
    });
  }

}
