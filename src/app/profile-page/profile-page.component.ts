import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserAuthService } from '../user-auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  currPage = 'My Profile';
  USERS: any[] = [];

  userUID = '';

  constructor( public userService: UserService, private authService: UserAuthService ) { }

  currUser!: any;

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
  }

  ngOnInit(): void {
    this.userUID = this.authService.currentUserUID();
    this.userService.readDBsingleUser(this.userUID).subscribe(observer => {this.currUser = observer as User});
    this.retrieveUsers();
  }
}