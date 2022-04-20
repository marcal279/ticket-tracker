import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// import { User } from '../user';
// import { UserService } from '../user.service';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  unameFormControl = new FormControl('',[Validators.required]);
  passwordFormControl = new FormControl('',[Validators.required]);
  
  constructor(private authService: UserAuthService) { }

  ngOnInit(): void {
  }

  invalidID(username:string) : Boolean{
    if((username.startsWith('NXT') || username.startsWith('IMCL') || username.endsWith('@nxtdigital.in')) && username.length>5) return false;
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
}
