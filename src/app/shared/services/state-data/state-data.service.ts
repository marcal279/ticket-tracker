import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class StateDataService{

  private userSource = new BehaviorSubject(this.userService.newUserObject())
  currentUser = this.userSource.asObservable();

  constructor(private userService: UserService) { }

  setUser(currUser: User){
    this.userSource.next(currUser)
  }
  
}
