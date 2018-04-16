import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgPathPrePipe } from './img-path-pre.pipe';
import { TrustHtmlPipe } from './trust-html.pipe';
import { TrustURLPipe } from './trust-url.pipe';
import { TrustStylePipe } from './trust-style.pipe';
import { TrustDatePipe } from './trust-data.pipe';
import { TrimHTMLPipe } from './trim-html.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ImgPathPrePipe,
    TrustHtmlPipe,
    TrustURLPipe,
    TrustStylePipe,
    TrustDatePipe,
    TrimHTMLPipe
  ],
  exports: [
    ImgPathPrePipe,
    TrustHtmlPipe,
    TrustURLPipe,
    TrustStylePipe,
    TrustDatePipe,
    TrimHTMLPipe
  ]
})
export class ArkPipeModule { }
