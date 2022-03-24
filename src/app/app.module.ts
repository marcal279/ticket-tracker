import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'src/custom/custom';
import { DashboardComponent } from './dashboard/dashboard.component';

// DateTime
import { DatePipe } from '@angular/common';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { CreateTicketDialogComponent } from './create-ticket-dialog/create-ticket-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SideNavComponent,
    TicketManagerComponent,
    CreateTicketDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
