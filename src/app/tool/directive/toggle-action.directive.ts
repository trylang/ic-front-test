import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[toggleEditAction]'
})
export class ToggleActionDirective {
  private preElement: HTMLElement;
  private canEdit: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.preElement = this.el.nativeElement.parentNode.children[1];
  }

  @HostListener('click') public onClick() {
    $(this.preElement).toggleClass('edit');
    $(this.el.nativeElement).toggleClass('active');
  }
}
