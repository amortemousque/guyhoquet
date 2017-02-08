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

  exportCollaboraters(token) {
    return this.http.get('http://localhost:8000/api/downloadCollaborators/' + token);
                      //  .map(res => <Collaborater> res.json());
  }

  getAllCollaboraters(token) {
    return this.http.get('http://localhost:8000/api/collaborators/'+ token)
                     .map(res => <Collaborater[]> res.json());
  }


  extractData(res: Response) {
    var data = res.json() || [];
    data.forEach((d) => {
      d.birthDate = new Date(d.birthDate);
    });
    return data;
  }

  validateList(token, collaboraters) {
       return this.http.put('http://localhost:8000/api/validateList/' + token, collaboraters)
                        .map(res => <Collaborater> res.json())
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any


  }
}
