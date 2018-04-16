import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './macro.component.html',
  styleUrls: ['../macro-common.component.css', './macro.component.scss']
})
export class MacroComponent {
  constructor(private titleService: Title) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('宏观分析' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }
}

