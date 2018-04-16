import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {

  constructor() {}

  public ngOnInit() { }

  private experienceList: any = [{
    img: `src/asset/image/experience/air.png`,
    title: '中央空调设备服务解决方案',
    desc: '中央空调设备服务解决方案中央空调设备服务解决方案中央空调设备服务解决方案中央空调设备服务解决方案中央空调设备服务解决方案',
    url: ''
  }, {
    img: `src/asset/image/experience/discrete.png`,
    title: '离散智能制造解决方案',
    desc: '离散智能制造解决方案离散智能制造解决方案离散智能制造解决方案离散智能制造解决方案离散智能制造解决方案离散智能制造解决方案',
    url: ''
  }, {
    img: `src/asset/image/experience/process.png`,
    title: '流程智能制造解决方案',
    desc: '流程智能制造解决方案流程智能制造解决方案流程智能制造解决方案流程智能制造解决方案流程智能制造解决方案流程智能制造解决方案',
    url: ''
  }];

}
