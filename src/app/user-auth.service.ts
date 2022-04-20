import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/switchMap';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string){
    this.fireAuth.signInWithEmailAndPassword(email, password).then(value => {
      alert('Signed in as '+email);
      this.router.navigate(['dash']);
    }).catch(err => {
      alert('Error');
      console.log('ERROR: '+err.message);
    })
  }

  emailSignUp(email: string, password: string){
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(value=>{
      alert('Created user '+email+' via AuthService');
      this.router.navigate(['dash']);
    }).catch(err=>{
      alert('Error');
      console.log('ERROR: '+err.message);
    })
  }

  logout(){
    this.fireAuth.signOut().then(value => {
      this.router.navigate(['login'])
    })
  }

}
