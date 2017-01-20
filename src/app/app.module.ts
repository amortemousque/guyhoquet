import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CollaboratersComponent } from './collaboraters/collaboraters.component';
import { CollaboratersService } from './collaboraters.service';
import { AccordionModule } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DataTableModule, SharedModule} from 'primeng/primeng';

// Define the routes
const appRoutes: Routes = [
  {
    path: 'collaboraters',
    component: CollaboratersComponent
  },
  {
    path: '',
    redirectTo: 'collaboraters',
    pathMatch: 'full'
  }
  // ,
  // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    CollaboratersComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes), // Add routes to the app
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    SharedModule
  ],
  providers: [CollaboratersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
