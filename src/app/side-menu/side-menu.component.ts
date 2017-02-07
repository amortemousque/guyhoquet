import { Component, OnInit } from '@angular/core';
import {MenuModule, MenuItem} from 'primeng/primeng';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  private _opened: boolean = false;

  constructor() { }

  ngOnInit() {

  }


  private _toggleSidebar() {
    this._opened = !this._opened;
  }

}
