import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  unameFormControl = new FormControl('',[Validators.required]);
  passwordFormControl = new FormControl('',[Validators.required]);
  constructor() { }

  ngOnInit(): void {
  }

  invalidID(username:string) : Boolean{
    if((username.startsWith('NXT') || username.startsWith('IMCL') || username.endsWith('@nxtdigital.in')) && username.length>5) return false;
    else return true;
  }

  hide:boolean=true;

  signIn(username: string, password:string){
    alert('Logged in!!');
  }
}
