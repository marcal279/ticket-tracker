import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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
        empEid: 'someone'+this.randomIntBelow(100)+'@gmail.com',
        name: 'User ' + userRandomVal,
        password: 'Passw_' + userRandomVal,
        dept: this.randomDept(),
        role: '',
        mob: '',
        company: '',
        designation: '',
        supervisor: '',
        offExt: ''
      }
      userList.push(newUser);
    }
    let adminUser:User = {
      empEid: 'marc.almeida@gmail.com',
      name: 'Admin',
      password: 'openSesame',
      dept: 'Ops',
      role: '',
      mob: '',
      company: '',
      designation: '',
      supervisor: '',
      offExt: ''
    }
    userList.push(adminUser);
    return userList;
  }

  getUsers(){
    let USERS = this.generateUsers();
    const userObservable = of(USERS);
    return userObservable;
  }

  constructor(private firestoreDB: AngularFirestore) { 
  }

  newUserObject(): User{
    return {
      empEid: '',
      name: '',
      password: '',
      dept: '',
      role: '',
      mob: '',
      company: '',
      designation: '',
      supervisor: '',
      offExt: '',
    }
  }

  // C
  createDBUser(newUser: User){
    return new Promise<any>((resolve, reject) => {
      this.firestoreDB.collection('Users').doc(newUser.uid).set(newUser).then(
        (response) => {console.log(response)},
        (error) => {reject(error)},
      )
    })
  }

  // R
  readDBsingleUser(key: string){
    return this.firestoreDB.collection('Users').doc(key).valueChanges();
  }
  readDBUsers(){
    return this.firestoreDB.collection('Users').snapshotChanges()
  }

  // U
  updateDBUser(key: string, user: User){
    return this.firestoreDB.collection('Users').doc(key).update({
      name: user.name,
      dept: user.dept,
      mob: user.mob,
      company: user.company,
      designation: user.designation,
      supervisor: user.supervisor,
      offExtension: user.offExt
    });
  }

  // D
  deleteDBUser(key: string){
    return this.firestoreDB.collection('Users').doc(key).delete();
  }

}
