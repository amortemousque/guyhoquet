import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Collaborater } from './model/collaborater';
import 'rxjs/add/operator/map';

@Injectable()
export class CollaboratersService {

  constructor(private http: Http) { }

  getAllCollaboraters() {
    return this.http.get('http://localhost:3000/api/collaboraters')
                    .map(res => <Collaborater[]> res.json());
  }

}
