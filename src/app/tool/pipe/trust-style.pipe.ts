import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trustStyle'})
export class TrustStylePipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}

  public transform(value: string): any {
    return this.sanitized.bypassSecurityTrustStyle(value);
  }
}
