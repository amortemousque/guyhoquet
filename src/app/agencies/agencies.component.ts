import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../agencies.service';
import { CollaboratersService } from '../collaboraters.service';

import { DataTableModule, SharedModule, InputMaskModule, CalendarModule, ConfirmationService} from 'primeng/primeng';
import { Agency } from '../model/agency';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';


import 'rxjs/add/operator/toPromise';
@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss'],
  providers: [ConfirmationService]

})
export class AgenciesComponent implements OnInit {

  token: string;
  agencies: Agency[];

  constructor(private agenciesService: AgenciesService, private collaboratersService: CollaboratersService, private route: ActivatedRoute, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.token = params['token']; // (+) converts string 'id' to a number
        this.agenciesService.getAllAgencies(this.token).subscribe(agencies => {
          this.agencies = agencies;
        });
       // In a real app: dispatch action to load the details here.
    });
  }

  exportCollaboraters() {
      this.collaboratersService.exportCollaboraters(this.token).subscribe(response => {
       // console.log(result._body);
        let blob = new Blob([response.text()], { type: 'text/csv' });
        FileSaver.saveAs(blob, "collaborateurs.csv");
      });
  }

  sendMail(agency) {
      console.log(agency);
      this.confirmationService.confirm({
          message: 'Etes vous de vouloir envoyer un email avec un nouveau token ?',
          accept: () => {
            this.agenciesService.sendMail(agency.id).subscribe(result => {
            });
          }
      });
  }
  sendMails() {
      this.confirmationService.confirm({
          message: 'Etes vous de vouloir envoyer les mails aux manageurs n\'ayant pas validés leur liste de collaborateurs ?',
          accept: () => {
            this.agenciesService.sendMails().subscribe(result => {
            });
          }
      });
  }
}
