import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  currPage = 'My Profile';
  USERS: any[] = [];

  constructor( public userService: UserService ) { }

  createNewUser():User{
    return this.userService.newUserObject();
  }

  newUser!:User // = this.createNewUser();
  currUser!: User // = this.newUser;

  metadata(){
    alert(JSON.stringify(this.currUser))
  }

  addUser(){
    this.userService.createDBUser(this.currUser);
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

  ngOnInit(): void {
    this.newUser = this.createNewUser();
    this.currUser = this.newUser;
    this.retrieveUsers();
  }
}
