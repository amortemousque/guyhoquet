import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Manager } from './model/manager';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ManagersService {

  constructor(private http: Http) { }

  getAllManagers(token) {
    return this.http.get('/api/managers/'+ token)
                        .map(res => <Manager[]> res.json());
  }

  getManager(token) {
    return this.http.get('/api/manager/'+ token)
                        .map(res => <Manager> res.json());
  }

  sendMail(id) {
    return this.http.get('/api/sendMail/'+ id);
  }

  sendMails() {
    return this.http.get('/api/sendMails/');
  }
}
