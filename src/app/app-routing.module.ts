import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TicketManagerComponent } from "./ticket-manager/ticket-manager.component";
import { ProfilePageComponent } from "./profile-page/profile-page.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'sign-up', component: SignupComponent},
    {path: 'dash', component: DashboardComponent},
    {path: 'manage', component: TicketManagerComponent},
    {path: 'user', component: ProfilePageComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }