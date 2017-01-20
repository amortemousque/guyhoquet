import { Component, OnInit } from '@angular/core';
import { CollaboratersService } from '../collaboraters.service';
import { DataTableModule, SharedModule, InputMaskModule, CalendarModule} from 'primeng/primeng';
import { Collaborater } from '../model/collaborater';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-collaboraters',
  templateUrl: './collaboraters.component.html',
  styleUrls: ['./collaboraters.component.scss']
})
export class CollaboratersComponent implements OnInit {
  token: string;
  collaboraters: Collaborater[];

  constructor(private collaboratersService: CollaboratersService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.token = params['token']; // (+) converts string 'id' to a number
        this.collaboratersService.getAllCollaboraters(this.token).subscribe(collaboraters => {
          this.collaboraters = collaboraters;
        });
       // In a real app: dispatch action to load the details here.
    });

  }

  onEditComplete(event: any): void {
    this.collaboratersService.updateCollaborater(event.data).toPromise().then(result => {
    });
    console.log(event.data);
    console.log("I'm here updating taxvalue");
  }

}
