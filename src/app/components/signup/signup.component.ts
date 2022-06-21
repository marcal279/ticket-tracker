import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin/admin.service';

import { User } from '../../shared/interfaces/user';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';
import { UserService } from '../../shared/services/users/user.service';

import {allowedDomains} from '../../shared/parameters/tickets.parameters';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    public userService: UserService, 
    public matSnack: MatSnackBar, 
    private authService: UserAuthService,
    private adminService: AdminService
    ) { }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  newUser !: User;

  passwordVal = ''; passwHide = true;
  passwordMatchVal = '';

  tempAllowedEmails = ['david.middlename.allen@gmail.com']
  isValidEmail(emailID:string) : Boolean{
    if(this.isAllowedDomain(emailID.slice(emailID.indexOf('@')+1)) || this.tempAllowedEmails.indexOf(emailID)>-1) return true;
    return false;
  }

  domainList: any;
  readDomains(){
    this.adminService.getDomainList().subscribe((observer)=>{
      this.domainList = observer;
      // console.log('DOMAINS: '); console.log(this.domainList);
    })
  }

  allowedDomainsHardcoded = [...allowedDomains]
  isAllowedDomain(domain:string){
    if(this.allowedDomainsHardcoded.indexOf(domain)>-1) return true;
    return false


    //!! commented code doesnt work because no permission to read 
    // if(this.domainList){
    //   if(this.domainList.allowedDomainList.indexOf(domain)>-1) return true;
    //   else return false;
    // }
    // else return setTimeout(this.isAllowedDomain(domain),1000)
  }

  isValidPhNumber(mob: string): Boolean{
    if(mob.match(/[0-9]{10}/)) return true
    return false
  }

  checkPasswordValid(){
    if(this.passwordVal.length>=4 && this.passwordVal.match(/[a-zA-Z]+[!@#$%^&-_.a-zA-Z]*[0-9]+[a-zA-Z]*$/)) return true;
    return false;
  }

  checkPasswordMatch(){
    if(this.passwordVal === this.passwordMatchVal && this.passwordMatchVal != '') return true;
    return false;
  }

  signUp(){
    if(this.checkPasswordValid() && this.checkPasswordMatch()){ 
      this.newUser.password = this.passwordVal;
      this.authService.emailSignUp(this.newUser);
      // this.openSnackBar(`Created user ${this.newUser.name}`);
    }
    else this.openSnackBar("Please check password field values")
  }

  ngOnInit(): void {
    this.newUser = this.userService.newUserObject();
    // this.readDomains()  no permission to do this coz of firebase rules
  }

}
