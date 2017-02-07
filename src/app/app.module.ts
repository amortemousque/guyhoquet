import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CollaboratersComponent } from './collaboraters/collaboraters.component';
import { CollaboratersService } from './collaboraters.service';
import { AgenciesService } from './agencies.service';
import { AccordionModule } from 'primeng/primeng';
import { MenuItem, MenuModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, FileUploadModule, DropdownModule, InputMaskModule, CalendarModule, ConfirmDialogModule, ConfirmationService, MessagesModule} from 'primeng/primeng';

import { AgenciesComponent } from './agencies/agencies.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { SettingsComponent } from './settings/settings.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

// Define the routes
const appRoutes: Routes = [
  {
    path: 'settings/:token',
    component: SettingsComponent
  },
  {
    path: 'collaboraters/:token',
    component: CollaboratersComponent
  },
  {
    path: 'agencies/:token',
    component: AgenciesComponent
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    CollaboratersComponent,
    AgenciesComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SettingsComponent,
    SideMenuComponent
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
    MessagesModule,
    FileUploadModule,
    MenuModule,
  ],
  providers: [CollaboratersService, AgenciesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
