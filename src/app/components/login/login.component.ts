import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

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


  invalidID(username:string) : Boolean{
    if((username.match(/^(NXT|IMCL)[0-9]+/) || username.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/)) && username.length>=5) return false;
    else return true;
  }

  hide:boolean=true;

  checkPasswordValid(){
    if(this.passwordFormControl.value.length>=4 && this.passwordFormControl.value.match(/[a-zA-Z]+[!@#$%^&-_.a-zA-Z]*[0-9]+[a-zA-Z]*$/)) return true;
    return false;
  }

  signIn(username: string, password:string){
    this.authService.login(this.unameFormControl.value, this.passwordFormControl.value);
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