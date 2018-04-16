import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TrimHTML'})
export class TrimHTMLPipe implements PipeTransform  {
  public transform(value: string): string {
    const tmp = `<div>${value}</div>`;
    return value ? $(tmp).text() : '';
  }
}
