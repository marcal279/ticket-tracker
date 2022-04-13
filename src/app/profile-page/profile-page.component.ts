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

  tempUserKey = 'Xr9rFqEdAykJbcN1FiwH';

  constructor( public userService: UserService ) { }

  createNewUser():User{
    return this.userService.newUserObject();
  }

  newUser!:User // = this.createNewUser();
  currUser!: any;

  metadata(){
    alert(JSON.stringify(this.currUser));
    // alert(this.currUser.key)
  }

  addUser(){
    this.userService.createDBUser(this.currUser);
  }

  updateUser(){
    this.userService.updateDBUser(this.tempUserKey, this.currUser).then( () => {
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

  ngOnInit(): void {
    this.newUser = this.createNewUser();
    this.userService.readDBsingleUser(this.tempUserKey).subscribe(observer => {this.currUser = observer as User});
    this.retrieveUsers();
  }
}
