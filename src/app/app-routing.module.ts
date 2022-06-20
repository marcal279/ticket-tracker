import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TicketManagerComponent } from "./components/ticket-manager/ticket-manager.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { TicketDetailsComponent } from "./components/ticket-details/ticket-details.component";
import { ReportGeneratorComponent } from "./components/report-generator/report-generator.component";
import { AccountUtilitiesComponent } from "./components/account-utilities/account-utilities.component";

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