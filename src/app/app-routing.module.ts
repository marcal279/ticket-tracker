import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TicketManagerComponent } from "./ticket-manager/ticket-manager.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { TicketDetailsComponent } from "./ticket-details/ticket-details.component";
import { ReportGeneratorComponent } from "./report-generator/report-generator.component";
import { AccountUtilitiesComponent } from "./account-utilities/account-utilities.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'sign-up', component: SignupComponent},
    {path: 'dash', component: DashboardComponent},
    {path: 'manage', component: TicketManagerComponent},
    {path: 'user', component: ProfilePageComponent},
    {path: 'ticket/:key', component: TicketDetailsComponent},
    {path: 'reports', component: ReportGeneratorComponent},
    {path: 'utilities', component: AccountUtilitiesComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }