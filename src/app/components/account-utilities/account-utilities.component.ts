import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/users/user.service';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';

@Component({
  selector: 'app-account-utilities',
  templateUrl: './account-utilities.component.html',
  styleUrls: ['./account-utilities.component.css']
})

// !! deprecated

export class AccountUtilitiesComponent implements OnInit {

  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private fireAuth: UserAuthService,
    public userService: UserService
  ) {  }

  possibleModes = [ 
    {mode: 'resetPassword', title: 'Reset Password'},
    {mode: 'verifyEmail', title: 'Verify your Email'},
    {mode: 'recoverEmail', title: 'Recover your Email'}
  ];

  currMode = '';
  actionCode = '';
  actionCodeValid: boolean = false;
  passwHide: boolean = false;

  passwordVal = '';
  passwordMatchVal = '';

  // verified = false;

  currUID = '';
  currUser: User;
  getAuthUser(){
    console.log('getting AuthUser at '+(new Date()).toLocaleTimeString())
    this.currUID = this.fireAuth.currentUserUID();
    if(this.currUID){
      // console.log('uid = '+this.currUID)
      this.userService.readDBsingleUser(this.currUID).subscribe((response) => {this.currUser = response as User});
      // console.log('User details from dashboard: ',this.currUser)
      sessionStorage.setItem('initialized', '1');
      // this.isAuthenticated = true;
      // console.log('Authenticated here')
    }
    else setTimeout(()=>{this.getAuthUser()}, 500)
  }

  checkPasswordValid(){
    if(this.passwordVal.length>=4 && this.passwordVal.match(/[a-zA-Z]+[!@#$%^&-_.a-zA-Z]*[0-9]+[a-zA-Z]*$/)) return true;
    return false;
  }
  checkPasswordMatch(){
    if(this.passwordVal === this.passwordMatchVal && this.passwordMatchVal != '') return true;
    return false;
  }

  returnTitle(mode: string){
    let title = '';
    this.possibleModes.forEach((element)=>{
      if( element.mode == mode) title = element.title; // only doing this coz compiler is being a prick
    })
    return title || 'Title Error 404';
  }

  resetPassword(){
    if(this.checkPasswordValid() && this.checkPasswordMatch()){
      this.fireAuth.confirmMyPasswordReset(this.passwordVal, this.actionCode).then(
        () => { alert('Password has been successfully reset'); this.router.navigate(['../']) }
      ).catch(err => alert(err))
    }
    else{ alert('Passwords are invalid or do not match, please try again') }
  }

  resendVerificationEmail(){
    this.fireAuth.verifyEmail();
  }

  ngOnInit(): void {
    console.log(`Trying mine:: Mode: ${this.activatedRoute.snapshot.paramMap.get('mode')}, Action Code: ${this.activatedRoute.snapshot.paramMap.get('oobCode')}`);

    this.activatedRoute.queryParams.subscribe( (params) => {
      if(!params) alert('No params found');
      else{
        // this.currUID = params['uid'];
        this.currMode = params['mode']; this.actionCode = params['oobCode']; 
        switch(params['mode']){
          case 'resetPassword':
            this.fireAuth.verifyMyPasswordResetCode(params['oobCode']).then(
              () => { this.actionCodeValid = true; }
            ).catch((err)=>{
              console.log(err);
              alert('Error with action code, please try password reset process again');
              this.router.navigate(['../'])
            })
            break;
          case 'verifyEmail':
            this.fireAuth.authState.applyActionCode(this.actionCode).then(()=>{
              alert('verified email ✔✔'); 
              this.router.navigate(['../'])
            }).catch(err=>{alert('ERROR: '+err)})
            break;
          case 'recoverEmail':
            break;
          default:
            alert(`Mode doesn't match any of the available cases`) 
            break;
        }
      }
    })
  }

  ngOnDestroy(){
    // if(this.currUser) alert('yes got user')
    // else alert('no not got user')
    // // this.currUser.emailVerified = true;
    // // this.userService.updateDBUser(this.currUID, this.currUser);
  }

  update(){
    // this.currUser.emailVerified = true;
    // this.userService.updateDBUser(this.currUID, this.currUser);
    alert('Open code line 123 in ts file')
  }
}
