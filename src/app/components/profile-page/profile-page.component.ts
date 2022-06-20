import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../shared/interfaces/user';
import { UserAction } from '../../shared/ngrx-state/app.actions';
import { StateDataService } from '../../shared/services/state-data/state-data.service';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';
import { UserService } from '../../shared/services/users/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  currPage = 'My Profile';
  USERS: any[] = [];

  userUID = '';
  currUser!: User;


  constructor( public userService: UserService, private authService: UserAuthService,
    private stateData: StateDataService,
    private store: Store<{userReducer: {currUser: User}}> )
  {  }


  metadata(){
    alert(JSON.stringify(this.currUser));
    // alert(this.currUser.key)
  }

  currUserDetails(){
    alert(this.userUID)
  }

  addUser(){
    // this.userService.createDBUser(this.currUser);
    alert('no')
  }

  updateUser(){
    this.userService.updateDBUser(this.userUID, this.currUser).then( () => {
      alert('Updated profile for '+this.currUser.name+' successfully!')
    })
    .catch(err => alert(err));
  }

  retrieveUsers(){
    this.userService.readDBUsers().subscribe(observer => {
      this.USERS = observer.map((e)=>{
        return{
          key: e.payload.doc.id,
          ...(e.payload.doc.data() as User)
        }
      })
    })
  }

  logout(){
    this.authService.logout();
    sessionStorage.removeItem('initialized')
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

  rxjsGetCurrentUser(){
    this.stateData.currentUser.forEach((user)=> {
      // alert('rxjs sends '+JSON.stringify(user));
      this.currUser = user;
   })
  }

  ngrxUserObservable: Observable<{currUser: User}>;
  // ngrxCurrUser: User;
  ngrxGetUser(){
    this.ngrxUserObservable = this.store.select('userReducer');
    this.ngrxUserObservable.subscribe(observer => {
      // this.ngrxCurrUser = ngrxUser.currUser;
      // console.log(this.ngrxCurrUser);
      this.currUser = observer.currUser;
      console.log(this.currUser);
    })
  }

  currUID: string;
  getAuthUser(){
    // console.log('getting AuthUser at '+(new Date()).toLocaleTimeString())
    this.currUID = this.authService.currentUserUID();
    if(this.currUID){
      // console.log('uid = '+this.currUID)
      this.userService.readDBsingleUser(this.currUID).subscribe((response) => {this.currUser = response as User});
      // console.log('User details from dashboard: ',this.currUser)
      sessionStorage.setItem('initialized', '1');
      // this.isAuthenticated = true;
      // console.log('Authenticated here')
    }
    else {alert('ERROR: User not signed in, please sign in again')}
  }
  ngrxStoreUser(){
    this.store.dispatch(new UserAction(this.currUser))
  }

  ngOnInit(): void {
    // this.userUID = this.authService.currentUserUID();
    // this.userService.readDBsingleUser(this.userUID).subscribe(observer => {this.currUser = observer as User});
    this.retrieveUsers();
    this.ngrxGetUser();

    // if(!this.currUser){
    //   this.getAuthUser();
    //   this.ngrxStoreUser();
    // }
  }
}