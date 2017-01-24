import { Component, OnInit } from '@angular/core';
import { ManagersService } from '../managers.service';
import { DataTableModule, SharedModule, InputMaskModule, CalendarModule, ConfirmationService} from 'primeng/primeng';
import { Manager } from '../model/manager';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/toPromise';
@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.scss'],
    providers: [ConfirmationService]

})
export class ManagersComponent implements OnInit {

  token: string;
  managers: Manager[];

  constructor(private managersService: ManagersService, private route: ActivatedRoute, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.token = params['token']; // (+) converts string 'id' to a number
        this.managersService.getAllManagers(this.token).subscribe(managers => {
          this.managers = managers;
        });
       // In a real app: dispatch action to load the details here.
    });
  }

  sendMail(manager) {
      console.log(manager);
      this.confirmationService.confirm({
          message: 'Etes vous de vouloir envoyer un email avec un nouveau token ?',
          accept: () => {
            this.managersService.sendMail(manager.id).subscribe(result => {
            });
          }
      });
  }
  sendMails() {
      this.confirmationService.confirm({
          message: 'Etes vous de vouloir envoyer les mails aux manageurs n\'ayant pas validés leur liste de collaborateurs ?',
          accept: () => {
            this.managersService.sendMails().subscribe(result => {
            });
          }
      });
  }
}
