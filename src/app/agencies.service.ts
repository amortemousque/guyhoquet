import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Agency } from './model/agency';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AgenciesService {

  constructor(private http: Http) { }

  getAllAgencies(token) {
    return this.http.get('http://localhost:8000/api/agencies/' + token)
                        .map(res => <Agency[]> res.json());
  }

  getAgency(token) {
    return this.http.get('http://localhost:8000/api/agency/' + token)
                        .map(res => <Agency> res.json());
  }



  sendMail(id) {
    return this.http.get('http://localhost:8000/api/sendMail/' + id);
  }

  sendMails() {
    return this.http.get('http://localhost:8000/api/sendMails/');
  }
}
