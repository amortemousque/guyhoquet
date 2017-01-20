import { Component, OnInit } from '@angular/core';
import { CollaboratersService } from '../collaboraters.service';
import { DataTableModule, SharedModule} from 'primeng/primeng';
import { Collaborater } from '../model/collaborater';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-collaboraters',
  templateUrl: './collaboraters.component.html',
  styleUrls: ['./collaboraters.component.scss']
})
export class CollaboratersComponent implements OnInit {
  collaboraters: Collaborater[];
  constructor(private collaboratersService: CollaboratersService) { }

  ngOnInit() {
      this.collaboratersService.getAllCollaboraters().toPromise().then(collaboraters => {
        this.collaboraters = collaboraters
      });
  }

}
