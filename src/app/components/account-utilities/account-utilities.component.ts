import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';

@Component({
  selector: 'app-account-utilities',
  templateUrl: './account-utilities.component.html',
  styleUrls: ['./account-utilities.component.css']
})
export class AccountUtilitiesComponent implements OnInit {

  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private fireAuth: UserAuthService
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
        () => { alert('Password has been successfully reset'); this.router.navigate(['../']) } // todo check this url too pls 
      ).catch(err => alert(err))
    }
    else{ alert('Passwords are invalid or do not match, please try again') }
  }

  ngOnInit(): void {
    console.log(`Trying mine:: Mode: ${this.activatedRoute.snapshot.paramMap.get('mode')}, Action Code: ${this.activatedRoute.snapshot.paramMap.get('oobCode')}`);

    this.activatedRoute.queryParams.subscribe( (params) => {
      if(!params) alert('No params found');
      else{ 
        this.currMode = params['mode']; this.actionCode = params['oobCode']; 
        switch(params['mode']){
          case 'resetPassword':
            this.fireAuth.verifyMyPasswordResetCode(params['oobCode']).then(
              () => { this.actionCodeValid = true; }
            ).catch((err)=>{
              console.log(err);
              alert('Error with action code, please try password reset process again');
              this.router.navigate(['../']) // todo check this path is correct pls 
            })
            break;
          case 'verifyEmail':
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

}
