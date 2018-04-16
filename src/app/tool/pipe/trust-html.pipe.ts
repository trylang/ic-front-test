import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trustHtml'})
export class TrustHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}

  public transform(value: string): any {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
