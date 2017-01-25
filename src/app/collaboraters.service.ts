import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Collaborater } from './model/collaborater';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CollaboratersService {

  constructor(private http: Http) { }

  getAllCollaboraters(token) {
    return this.http.get('/api/collaboraters/'+ token)
                        // .map(res => <Collaborater[]> res.json());
                    .map(res => {return this.extractData(res);});
  }


  extractData(res: Response) {
    var data = res.json() || [];
    data.forEach((d) => {
      d.birthDate = new Date(d.birthDate);
    });
    return data;
  }

  validateList(token, collaboraters) {
       return this.http.put('/api/validateList/' + token, collaboraters)
                        .map(res => <Collaborater> res.json())
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any


  }
}
