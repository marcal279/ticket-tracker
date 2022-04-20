import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user';
import { UserAuthService } from '../user-auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  constructor(public userService: UserService, public matSnack: MatSnackBar, private authService: UserAuthService) { }

  newUser !: User;

  passwordVal = ''; passwHide = true;
  passwordMatchVal = '';

  tempValidCheck(){
    alert(this.checkPasswordValid())
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
      // this.newUser.empEid += '@nxtdigital.in';
      this.newUser.password = this.passwordVal;
      // this.userService.createDBUser(this.newUser);
      this.authService.emailSignUp(this.newUser.empEid, this.newUser.password);
      this.openSnackBar(`Created user ${this.newUser.name}`)
    }
    else this.openSnackBar("Please check password field values")
  }

  ngOnInit(): void {
    this.newUser = this.userService.newUserObject();
  }


}
