import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
  }

  departments: String[] = ['Finance','Ops','Legal','Logistics'];
  randomDept(){
    return this.departments[this.randomIntBelow(this.departments.length)].toString();
  }
  
  generateUsers(): User[]{
    let userList = [];
    for(let i =0; i<=1;i++){
      let userRandomVal = this.randomIntBelow(20);
      let newUser: User = {
        name: 'User '+ userRandomVal,
        empID: (Math.random()<0.5?'NXT':'IMCL') + (this.randomIntBelow(2000)+1),
        email: 'fname.lname'+userRandomVal+'@nxtdigital.in',
        password: 'Passw_'+userRandomVal,
        picture: null,
        dept: this.randomDept(),
      }
      userList.push(newUser);
    }
    let adminUser:User = {
      name: 'admin',
      empID: 'NXT12345678',
      email: 'marc@nxtdigital.in',
      password: 'openSesame',
      picture: null,
      dept: 'Ops',
    }
    userList.push(adminUser);
    return userList;
  }

  getUsers(){
    let USERS = this.generateUsers();
    const userObservable = of(USERS);
    return userObservable;
  }
}
