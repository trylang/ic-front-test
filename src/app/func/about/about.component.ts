import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';

@Component({
  selector: 'ark-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  private showType: string;
  private showTitle: string;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const Titles = {
      'us': '关于我们',
      'contact': '联系方式',
      'agreement': '用户协议',
      'declaration': '隐私声明',
      'sources': '数据来源',
      'friendlink': '友情链接'
    };
    const title = this.titleService.getTitle();
    this.route.queryParams.subscribe((params: Params) => {
      this.showType = params['type'] ? params['type'] : 'us';
      this.showTitle = Titles[params['type'] ? params['type'] : 'us'];
      this.titleService.setTitle(this.showTitle +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    });
  }

  public ngOnInit() { }

}
