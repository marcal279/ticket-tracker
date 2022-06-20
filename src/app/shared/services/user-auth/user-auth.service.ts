import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from '../../interfaces/user';
import { UserService } from '../users/user.service';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  authState: any = null;

  constructor(private fireAuth: AngularFireAuth, private router: Router, private userService: UserService) {
    this.fireAuth.authState.subscribe( authState => {
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
    this.fireAuth.signInWithEmailAndPassword(email, password).then(value => {
      alert('Signed in as '+email);
      this.router.navigate(['dash']);
    }).catch(err => {
      alert('Error');
      console.log('ERROR: '+err.message);
    })
  }

  emailSignUp(newUser:User){
    this.fireAuth.createUserWithEmailAndPassword(newUser.empEid, newUser.password).then(userCredential=>{
      newUser.uid = userCredential.user?.uid;
      alert('Created user '+newUser.empEid+' via AuthService, of details '+userCredential.user?.uid);
      // insert user into db here
      this.userService.createDBUser(newUser);
      this.router.navigate(['dash']);
    }).catch(err=>{
      alert('Error');
      console.log('ERROR: '+err.message);
    })
  }

  sendMyResetPasswordEmail(email: string){
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  verifyMyPasswordResetCode(code: string){
    return this.fireAuth.verifyPasswordResetCode(code);
  }

  confirmMyPasswordReset(password: string, actionCode: string){
    return this.fireAuth.confirmPasswordReset(actionCode, password)
  }

  logout(){
    this.fireAuth.signOut().then(value => {
      this.router.navigate(['login'])
    })
  }

}
