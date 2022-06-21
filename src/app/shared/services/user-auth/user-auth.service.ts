import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from '../../interfaces/user';
import { UserService } from '../users/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  authState: any = null;

  constructor(
    private firebase: AngularFireAuth, 
    private router: Router, 
    private userService: UserService, 
    public matSnack: MatSnackBar,) {
    this.firebase.authState.subscribe( authState => {
      this.authState = authState;
    });
  }

  get isAuthenticated(): boolean {
    return this.authState !== null;
  }

  currentUserUID(): any{
    // alert(this.isAuthenticated ? this.authState.uid : null)
    return this.isAuthenticated ? this.authState.uid : null
  }

  login(email: string, password: string){
    this.firebase.signInWithEmailAndPassword(email, password).then(user => {      
      this.openSnackBar('Signed in as '+email);
      this.router.navigate(['dash']);
    }).catch(err => {
      alert('Error');
      console.log('ERROR: '+err.message);
    })
  }


  emailSignUp(newUser:User){
    this.firebase.createUserWithEmailAndPassword(newUser.empEid, newUser.password).then(userCredential=>{
      newUser.uid = userCredential.user?.uid;
      this.userService.createDBUser(newUser); // * insert user into db
      this.verifyEmail();
      this.router.navigate(['verify-email']);

      // !!deprecated this.router.navigate(['../'])
      // // this.router.navigate(['dash'])
    }).catch(err=>{
      alert('Error in sending email');
      console.log('ERROR: '+err.message);
    })
  }

  // getFireAuthUserObject(){
  //   return this.fireAuth.currentUser
  // }

  verifyEmail(){
    this.firebase.currentUser.then((user:any) => {
      user.sendEmailVerification().then(()=>{
        alert('Sent verification email to provided ID')
      }).catch(err=>{alert('ERROR: '+err)})
    })
  }

  // setEmailVerified(){
  //   this.firebase.auth().applyActionCode()
  // }


  sendMyResetPasswordEmail(email: string){
    return this.firebase.sendPasswordResetEmail(email);
  }

  verifyMyPasswordResetCode(code: string){
    return this.firebase.verifyPasswordResetCode(code);
  }

  confirmMyPasswordReset(password: string, actionCode: string){
    return this.firebase.confirmPasswordReset(actionCode, password)
  }

  logout(){
    this.firebase.signOut().then(value => {
      this.router.navigate(['login'])
    })
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

}
