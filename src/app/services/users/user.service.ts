import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  randomIntBelow(ceiling: number){
    return Math.floor(Math.random()*ceiling);
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
    return this.firestoreDB.collection('Users').snapshotChanges(); 
  }
  //* SnapshotChanges explanation: 
  //* 1. https://github.com/angular/angularfire/blob/master/docs/firestore/collections.md#streaming-collection-data
  //* 2. https://stackoverflow.com/questions/48608769/what-is-snapshotchanges-in-firestore#:~:text=It%20is%20current,data%20from%20it.


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
