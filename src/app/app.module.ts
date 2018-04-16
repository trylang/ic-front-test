import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';

import { MatSnackBarModule } from '@angular/material';
import { SnackBar } from './tool/snackbar';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

import { AppService } from './app.service';
import { AppComponent } from './app.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      newestOnTop: true
    })
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    Title,
    AppService,
    SnackBar,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
