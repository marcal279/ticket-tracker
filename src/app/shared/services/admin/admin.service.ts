import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {arrayUnion, arrayRemove} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  //* for admin functions

  constructor( private firestore: AngularFirestore) { }

  //* CRUD Admin accounts
  addAdmin(empEid: string){
    return this.firestore.collection('adminCentre').doc('admins').update({
      "adminList": arrayUnion(empEid) // adds empEid to adminList array
    }).catch(err=>{console.log('ERROR IN ADMIN WRITE: '+err)})
  }

  getAdminList(){
    return this.firestore.collection('adminCentre').doc('admins').valueChanges();
  }

  removeAdmin(empEid: string){
    return this.firestore.collection('adminCentre').doc('admins').update({
      "adminList": arrayRemove(empEid)
    })
  }

  //* CRUD allowed Domains
  //!! problem because no permission to read coz of firebase rules 
  addDomain(domain: string){
    return this.firestore.collection('adminCentre').doc('allowedDomains').update({
      "allowedDomainList": arrayUnion(domain) // adds domain to allowedDomainList array
    }).catch(err=>{console.log('ERROR IN DOMAIN WRITE: '+err)})
  }

  getDomainList(){
    return this.firestore.collection('adminCentre').doc('allowedDomains').valueChanges();
  }

  removeDomain(domain: string){
    return this.firestore.collection('adminCentre').doc('allowedDomains').update({
      "allowedDomainList": arrayRemove(domain)
    })
  }

}
