import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CollaboratersComponent } from './collaboraters/collaboraters.component';
import { CollaboratersService } from './collaboraters.service';
import { ManagersService } from './managers.service';
import { AccordionModule } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DataTableModule, SharedModule, DropdownModule, InputMaskModule, CalendarModule, ConfirmDialogModule, ConfirmationService, MessagesModule} from 'primeng/primeng';
import { ManagersComponent } from './managers/managers.component';

// Define the routes
const appRoutes: Routes = [
  {
    path: 'collaboraters/:token',
    component: CollaboratersComponent
  },
  {
    path: 'managers/:token',
    component: ManagersComponent
  },
  {
    path: '',
    redirectTo: 'collaboraters/',
    pathMatch: 'full'
  }
  // ,
  // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    CollaboratersComponent,
    ManagersComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes), // Add routes to the app
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    SharedModule,
    InputMaskModule,
    CalendarModule,
    ConfirmDialogModule,
    DropdownModule,
    MessagesModule
  ],
  providers: [CollaboratersService, ManagersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
