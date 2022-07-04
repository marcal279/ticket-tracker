import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { CustomMaterialModule } from '../custom-imports/custom';

// DateTime
import { DatePipe } from '@angular/common';
import { MomentDateModule } from '@angular/material-moment-adapter';

// Firebase
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; // for tickets
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';   // for users
import { AngularFireStorageModule } from '@angular/fire/compat/storage';   // for files

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SignupComponent } from './components/signup/signup.component';
import { TicketDialogComponent } from './components/ticket-dialog/ticket-dialog.component';
import { TicketManagerComponent } from './components/ticket-manager/ticket-manager.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { ReportGeneratorComponent } from './components/report-generator/report-generator.component';
import { AttachDialogComponent } from './components/attach-dialog/attach-dialog.component';
import { AccountUtilitiesComponent } from './components/account-utilities/account-utilities.component';
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";

// Routing
import { AppRoutingModule } from './app-routing.module';

// NgRx/store
import { StoreModule } from '@ngrx/store';
import { IndexReducer, UserReducer } from './shared/ngrx-state/app.reducers';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ProfilePageComponent,
    SideNavComponent,
    SignupComponent,
    TicketDialogComponent,
    TicketManagerComponent,
    TicketDetailsComponent,
    ReportGeneratorComponent,
    AttachDialogComponent,
    AccountUtilitiesComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    CustomMaterialModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    AppRoutingModule,

    StoreModule.forRoot({ userReducer: UserReducer, indexReducer: IndexReducer }), // * https://www.c-sharpcorner.com/article/state-management-in-angular-using-ngrx/

    MomentDateModule
  ],
  providers: [
    DatePipe,
    // {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, we're using moment instead of this due to this issue https://stackoverflow.com/questions/55721254/how-to-change-mat-datepicker-date-format-to-dd-mm-yyyy-in-simplest-way/58189036#:~:text=3-,This%20will%20NOT%20correctly%20parse%20any%20inputs%20the%20user%20makes%20via%20text%2C%20see%20this%20issue%20for%20more%20details%20(No%20plans%20to%20fix%20it),-%E2%80%93%C2%A0
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
