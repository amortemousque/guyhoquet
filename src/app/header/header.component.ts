import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() public title: string;
  @Input() public nav: any = null;
  private isLarge:boolean = true;


  constructor() { }

  ngOnInit() {
    this.onResize({target: { outerWidth: screen.width }});
  }

  toggleSideNav() {
    this.nav.toggle();
  }

  onResize(event) {
    if(this.nav != null) {
        if(event.target.outerWidth < 1024) {
          this.nav.mode = "over";
          this.nav.close();
          this.isLarge = false;
        } else {
          this.nav.mode = "side";
          this.nav.open();
          this.isLarge = true;
        }
    }
  }
}
