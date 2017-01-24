import { Component, OnInit } from '@angular/core';
import {NgForm } from '@angular/forms';

import { CollaboratersService } from '../collaboraters.service';
import { DataTableModule, SharedModule, InputMaskModule, CalendarModule} from 'primeng/primeng';
import { Collaborater } from '../model/collaborater';
import { ActivatedRoute } from '@angular/router';
import {ConfirmDialogModule,ConfirmationService, SelectItem} from 'primeng/primeng';

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
  titles: SelectItem[];
  gender: SelectItem[];
  errorMsgs: any = [];
  validMsgs: any = [];
  submitted: any = false;
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

    this.titles = [];
    this.titles.push({label: 'Choix', value:null});
    this.titles.push({label: 'Agent immobilier', value:1});
    this.titles.push({label: 'Assistante Commerciale  ', value:2});
    this.titles.push({label: 'Conseiller Ventes', value:3});

    this.gender = [];
    this.gender.push({label: 'Choix', value:null});
    this.gender.push({label: 'M', value: '1'});
    this.gender.push({label: 'Mme', value: '2'});

    this.route.params.subscribe(params => {
       this.token = params['token']; // (+) converts string 'id' to a number
        this.collaboratersService.getAllCollaboraters(this.token).subscribe(collaboraters => {
          this.collaboraters = collaboraters;
          console.log(this.collaboraters);
        });
       // In a real app: dispatch action to load the details here.
    });
  }

  validateList(collaboraterForm: NgForm): void {
    this.submitted = true;
    if(collaboraterForm.valid) {
      this.confirmationService.confirm({
          message: 'Etes vous sur de vouloir valider vos modifications sur votre liste de collaborateurs ?',
          accept: () => {
            this.load = true;
            this.collaboratersService.validateList(this.token, this.collaboraters).toPromise().then(result => {
              this.load = false;
              this.errorMsgs = [];
              this.validMsgs = [];
              this.validMsgs.push({severity:'success', summary:'Formulaire validé', detail:'Liste des collaborateurs à été sauvegardée'});
            });
          }
      });
    } else {
        this.validMsgs = [];
        this.errorMsgs = [];
        this.errorMsgs.push({severity:'error', summary:'Formulaire invalide', detail:'Veuillez remplir les champs manquants.'});
    }
  }

  addCollaborater(): void {
    this.collaboraters.push(<Collaborater>{});
  }

  removeCollaborater(collaborater):void {
    let index = this.collaboraters.indexOf(collaborater);
    this.collaboraters.splice(index, 1);
  }

}
