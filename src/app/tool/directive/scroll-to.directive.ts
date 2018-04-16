import {Directive, Input, ElementRef, Renderer, HostListener} from '@angular/core';

@Directive({
  selector: '[scrollTo]'
})
export class ScollToDirective {

  private defaultPx = 10;

  @Input('scrollTo')
  private srcollToPx: number;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
  }

  @HostListener('click')
  public onClick() {
    const srcollToPx = this.srcollToPx || this.defaultPx;
    window.scrollTo(0, srcollToPx);
  }
}
