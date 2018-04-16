import { Directive, ElementRef, Renderer2, HostListener, AfterViewChecked, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[moreBtn]'
})
export class MoreBtnDirective implements AfterViewChecked, OnChanges {
    @Input() public dataListenter: string[];
    private preElement: HTMLElement;
    private childElement: HTMLElement;
    private preElementChild: HTMLElement;
    private isShowBtn: boolean = false;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        // Add style and class for moreBtn
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
        this.renderer.addClass(this.el.nativeElement, 'animated');
        this.renderer.addClass(this.el.nativeElement, 'fadeIn');


        // Add child content for moreBtn
        const text = this.renderer.createText('更多 ');
        const icon = this.renderer.createElement('i');
        this.renderer.addClass(icon, 'fa');
        this.renderer.addClass(icon, 'fa-chevron-down');
        this.renderer.setAttribute(icon, 'aria-hidden', 'true');
        this.renderer.appendChild(this.el.nativeElement, text);
        this.renderer.appendChild(this.el.nativeElement, icon);

        // init preElement, preElementChild, childElement
        this.preElement = this.el.nativeElement.parentNode.children[1];
        this.preElementChild = this.preElement.children[0] as HTMLElement;
        this.childElement = this.el.nativeElement.children[0];
    }

    // Listener for moreBtn click event
    @HostListener('click') public onClick() {
        $(this.preElement).toggleClass('ark-agglist');

        if ($(this.preElement).hasClass('ark-agglist')) {
            this.renderer.setStyle(this.childElement, 'transform', 'rotate(0deg');
        } else {
            this.renderer.setStyle(this.childElement, 'transform', 'rotate(-180deg');
        }
    }

    // important: To listent listValue change,and do rerender dom again.
    public ngOnChanges() {
        setTimeout(() => {
            // console.warn(this.dataListenter);
        });
    }

    // Listen for view checked
    public ngAfterViewChecked() {
        // > 34 show moreBtn
        if (this.preElementChild.clientHeight > 34) {
            if (!this.isShowBtn) {
                this.renderer.setStyle(this.el.nativeElement, 'display', 'block');

                this.renderer.setStyle(this.childElement, 'transform', 'rotate(0deg)');
                this.renderer.addClass(this.preElement, 'ark-agglist');
                this.isShowBtn = true;
            }
        } else {
            // Otherwise hide moreBtn if this.isShowBtn is true.
            if (this.isShowBtn) {
                this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
                this.renderer.removeClass(this.preElement, 'ark-agglist');
                this.isShowBtn = false;
            }
        }
    }

}
