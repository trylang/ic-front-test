import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trustDate' })
export class TrustDatePipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }

  public transform(value: string, YYpdzhi?: number): any {
    let yyyy = '';
    let MM = '';
    let dd = '';
    const values = value as string;
    if (values) {
      yyyy = values.slice(0, YYpdzhi) + '年';
      if (values.length >= YYpdzhi + 2) {
        MM = values.slice(YYpdzhi, YYpdzhi + 2) + '月';
      }
      if (values.length >= YYpdzhi + 4) {
        dd = values.slice(YYpdzhi + 2, YYpdzhi + 4) + '日';
      }
      return yyyy + MM + dd;
    }
  }
}
