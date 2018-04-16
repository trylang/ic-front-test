import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ent',
  templateUrl: './ent.component.html',
  styleUrls: ['../ent-reset.component.scss', './ent.component.scss']
})
export class EntComponent {
  constructor(private titleService: Title) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('企业信息' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
  }
}
