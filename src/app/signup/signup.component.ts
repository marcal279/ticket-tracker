import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user';
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

  constructor(public userService: UserService, public matSnack: MatSnackBar) { }

  newUser !: User;

  passwordVal = '';
  passwordMatchVal = '';

  checkPasswordValid(){
    if(this.passwordVal.length>=4 && !this.passwordVal.includes(' ') && this.passwordVal.match(/^[a-zA-Z]\w$/)) return true;
    return false;
  }

  checkPasswordMatch(){
    // add password valid ticks pls
    if(this.passwordVal === this.passwordMatchVal) return true;
    return false;
  }

  signUp(){
    if(this.checkPasswordMatch()){ 
      this.newUser.password = this.passwordVal;
      this.userService.createDBUser(this.newUser); 
      this.openSnackBar(`Created user ${this.newUser.name}`)
    }
    else this.openSnackBar("Passwords don't match, please try again")
  }

  ngOnInit(): void {
    this.newUser = this.userService.newUserObject();
  }

}
