import { Component, OnInit } from '@angular/core';
import { CollaboratersService } from '../collaboraters.service';
import { DataTableModule, SharedModule, InputMaskModule, CalendarModule} from 'primeng/primeng';
import { Collaborater } from '../model/collaborater';
import { ActivatedRoute } from '@angular/router';
import {ConfirmDialogModule,ConfirmationService} from 'primeng/primeng';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-collaboraters',
  templateUrl: './collaboraters.component.html',
  styleUrls: ['./collaboraters.component.scss'],
  providers: [ConfirmationService]
})
export class CollaboratersComponent implements OnInit {
  token: string;
  load: boolean = false;
  collaboraters: Collaborater[];
  fr: any;
  constructor(private collaboratersService: CollaboratersService, private route: ActivatedRoute, private confirmationService: ConfirmationService) { }

  ngOnInit() {
      this.fr = {
        firstDayOfWeek: 0,
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeurdi", "Vendredi", "Samedi"],
        dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
        monthNames: [ "Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","September","Octobre","November","December" ],
        monthNamesShort: [ "Jan", "Fev", "Mar", "Avr", "Mai", "Jun","Jui", "Aou", "Sep", "Oct", "Nov", "Dec" ]
    };
    this.route.params.subscribe(params => {
       this.token = params['token']; // (+) converts string 'id' to a number
        this.collaboratersService.getAllCollaboraters(this.token).subscribe(collaboraters => {
          this.collaboraters = collaboraters;
        });
       // In a real app: dispatch action to load the details here.
    });

  }

  // onEditComplete(event: any): void {
  //   this.collaboratersService.updateCollaborater(event.data).toPromise().then(result => {
  //   });
  //   console.log(event.data);
  //   console.log("I'm here updating taxvalue");
  // }

  validateList(): void {
     this.confirmationService.confirm({
          message: 'Etes vous sur de vouloir valider vos modifications sur votre liste de collaborateurs ?',
          accept: () => {
            this.load = true;
            this.collaboratersService.validateList(this.token, this.collaboraters).toPromise().then(result => {
              this.load = false;
            });
          }
      });
  }

  addCollaborater(): void {
    this.collaboraters.push(<Collaborater>{});
  }

  removeCollaborater(collaborater):void {
    let index = this.collaboraters.indexOf(collaborater);
    this.collaboraters.splice(index, 1);
  }

}
