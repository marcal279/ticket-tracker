import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { allowedDomains, adminList } from 'src/app/shared/parameters/tickets.parameters';

import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  unameFormControl = new FormControl('',[Validators.required]);
  passwordFormControl = new FormControl('',[Validators.required]);
  
  
  constructor(private authService: UserAuthService) { }

  isAdmin(username:string){
    let admins = [...adminList]
    if(admins.indexOf(username)>-1) return true;
    return false;
  }

  allowedDomainsHardcoded = [...allowedDomains]
  isAllowedDomain(domain:string){
    if(this.allowedDomainsHardcoded.indexOf(domain)>-1) return true;
    return false
  }

  isValidID(emailID:string) : Boolean{
    if((this.isAdmin(emailID) || this.isAllowedDomain(emailID.slice(emailID.indexOf('@')+1)) )) return true;
    // if( (this.isAdmin(emailID) || emailID.endsWith('@nxtdigital.in')) ) return true;
    return false;
  }

  hide:boolean=true;

  isValidPassword(){
    if(this.passwordFormControl.value.length>=4 && this.passwordFormControl.value.match(/[a-zA-Z]+[!@#$%^&-_.a-zA-Z]*[0-9]+[a-zA-Z]*$/)) return true;
    return false;
  }

  signIn(username: string, password:string){
    if(this.isValidID(username) && this.isValidPassword()) this.authService.login(this.unameFormControl.value, this.passwordFormControl.value);
    else{
      if(!this.isValidID(username)) alert('Invalid User ID, access denied')
    }
  }

  resetPassword(email:string){
    if(!email) alert('Please type in your registered email ID in the Email field')
    else{
      this.authService.sendMyResetPasswordEmail(email).then(
        () => alert('An email for resetting password has been sent to your email ID'),
        (rejectedReason) => alert('Request rejected: ERROR: '+rejectedReason)).catch((err)=>{
          console.log('Error in resetting password: '+err)
        })
    }
  }

  ngOnInit(): void {
  }

}
