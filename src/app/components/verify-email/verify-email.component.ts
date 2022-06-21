import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from 'src/app/shared/services/user-auth/user-auth.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private router: Router,
    public userAuthService: UserAuthService,
  ) { }

  goToLogin(){
    this.router.navigate(['../'])
  }

  ngOnInit(): void {
  }

}
