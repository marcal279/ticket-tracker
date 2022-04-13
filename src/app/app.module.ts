import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from 'src/custom/custom';

// DateTime
import { DatePipe } from '@angular/common';

// Components
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

// Firebase
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; // for tickets
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SideNavComponent,
    TicketManagerComponent,
    TicketDialogComponent,
    ProfilePageComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
