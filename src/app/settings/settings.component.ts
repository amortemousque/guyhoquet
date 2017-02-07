import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenciesService } from '../agencies.service';
import { Agency } from '../model/agency';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  token: string;
  agency: Agency;

  constructor(private agenciesService: AgenciesService, private router: Router, private route: ActivatedRoute) {



  }

  ngOnInit() {
      this.route.params.subscribe(params => {
        this.token = params['token']; // (+) converts string 'id' to a number
        this.agenciesService.getAgency(this.token).subscribe(agency => {
          if(agency.id !== undefined) {
            this.agency = agency;
          } else {
            this.router.navigate(['/page-not-found']);
          }
        });
    });
  }

}
