import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ParkEditService {
  constructor(private http: HttpClient, private appService: AppService) {}

}
