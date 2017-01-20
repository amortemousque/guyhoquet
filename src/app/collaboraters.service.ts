import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Collaborater } from './model/collaborater';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class CollaboratersService {

  constructor(private http: Http) { }

  getAllCollaboraters(token) {
    return this.http.get('http://localhost:3000/api/collaboraters/'+ token)
                        // .map(res => <Collaborater[]> res.json());

                    .map(res => {return this.extractData(res);});
  }

  updateCollaborater(collaborater) {
    console.log(collaborater);
  //  collaborater.birthDate =  collaborater.birthDate.toLocaleDateString();
    console.log(collaborater);

    return this.http.put('http://localhost:3000/api/collaboraters/' + collaborater.id, collaborater)
                        .map(res => <Collaborater> res.json())
                        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

  }

  // parseDate(input) {
  //   var parts = input.split('-');
  //   return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
  // }

  extractData(res: Response) {
    var data = res.json() || [];
    data.forEach((d) => {
      d.birthDate = new Date(d.birthDate);
    });
    return data;
  }
}
