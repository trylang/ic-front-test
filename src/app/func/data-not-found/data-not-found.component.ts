import { Component, OnChanges, OnInit, Input, Renderer2, ElementRef } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ark-no-data',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.scss']
})
export class DataNotFoundComponent implements OnChanges, OnInit {
  // 分为 “搜索页" 和 “详情页面” 两种类型的提示信息
  public showView: boolean = false; // Weather show data-not-found content.
  private mainText: string;
  private supText: string;
  private initedText: (key?: string) => void;
  @Input() private showType: string; // Now the value can be 'search', 'detail'.
  @Input() private searchKey: string; // If showType is 'search', then you should give search keyword.
  @Input() private hideSign: string | boolean = true; // 判断是否显示 data-not-found content.默认隐藏。
  @Input() private bgc: string; // 背景色，默认#fff。value can be: #fff, white, rgb(255,255,255), rgba() ...

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  public ngOnChanges() {
    if (this.hideSign !== undefined) {
      if (!this.hideSign || this.hideSign === 'false') {
        // show
        this.showView = true;
        _.delay(() => {
          this.initedText(this.searchKey);
        }, 200);
      } else {
        // hide
        this.showView = false;
      }
    }
  }

  public ngOnInit() {
    // 设置背景色
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inherit');
    if (this.bgc) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.bgc);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#fff');
    }
    this.initedText = this.initText();
  }

  private initText(): any {
    if (this.showType === 'search') {
      return function(key: string) {
        const keyword = key && key !== 'null' && key !== 'undefined' ? ` "${key}" ` : '';
        this.mainText = `很抱歉，没有找到${keyword}相关结果`;
        this.supText = '请修改或者尝试其它搜索词';
      };
    } else if (this.showType === 'detail') {
      return function() {
        this.mainText = '暂无数据';
        this.supText = null;
      };
    } else {
      console.error('ark-no-data 使用错误，请查看使用说明!');
    }
  }
}
