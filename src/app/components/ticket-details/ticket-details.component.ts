import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TicketsService } from '../../shared/services/tickets/tickets.service';
import { Ticket } from '../../shared/interfaces/ticket';
import { map, Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { AttachDialogComponent } from '../attach-dialog/attach-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Store } from '@ngrx/store';
import { User } from '../../shared/interfaces/user';
import { UserAction } from '../../shared/ngrx-state/app.actions';
import { UserAuthService } from '../../shared/services/user-auth/user-auth.service';
import { UserService } from '../../shared/services/users/user.service';
import { AdminService } from 'src/app/shared/services/admin/admin.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  currPage = 'Ticket Details';
  allTickets: Ticket[] = [];

  isLoading = true;
  
  currTicket: Ticket;

  // mat-table variables
  attachmentDataSource = new MatTableDataSource<any>();
  displayedColumns = ['srNo', 'name', 'actions'];

  lastUpdater = ''

  constructor(private ticketService: TicketsService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    public matSnack: MatSnackBar,
    private storage: AngularFireStorage,
    private store: Store<{userReducer: {currUser: User}}>,
    private authService: UserAuthService,
    private userService: UserService,
    private adminService: AdminService){
  
  }

  ngrxUserObservable: Observable<{currUser: User}>;
  currUser: User;
  ngrxGetUser(){
    this.ngrxUserObservable = this.store.select('userReducer');
    this.ngrxUserObservable.subscribe(observer => {
      // this.ngrxCurrUser = ngrxUser.currUser;
      // console.log(this.ngrxCurrUser);
      this.currUser = observer.currUser;
      // console.log(this.currUser);
    })
  }

  retrieveTickets(){
    this.ticketService.readDBTicket().snapshotChanges().pipe(
      map(changes =>changes.map( (c: { payload: { key: any; val: () => any; }; })=>
      ({ key: c.payload.key, ...c.payload.val() }) )
      )
    ).subscribe(observer => {
      this.allTickets = observer;
      // this.isLoading = false;
    })
  }

  updateHistory: { updater: string, updateDate: Date, commitMessage ?: string }[] = []

  getTicket(){
    let key =  String(this.route.snapshot.paramMap.get('key'));
    console.log(`Key from route = ${key}`)
    this.currTicket = this.getSingleTicket(key);

    this.updateHistory = [...this.currTicket.updateHistory].reverse();
    // this.updateHistory.sort((a,b) => {
    //   return (new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime())
    // });
  }

  printUpdateHistory(hist: Object[]){
    hist.forEach(el=>{
      console.log(JSON.stringify(el))
    })
  }

  getSingleTicket(key: String): Ticket{
    if(this.allTickets[0]){
      let singleTicket = this.allTickets.filter((ticket) => { 
        if(ticket.key == key) return ticket;
        else return null;
      })
      this.attachmentDataSource.data = singleTicket[0].zattachments;
      this.lastUpdater = [...singleTicket[0].updateHistory].slice(-1)[0].updater || 'Anonymous'
      return singleTicket[0];
    }
    else{
      alert('Please refresh page if not loaded in 10 seconds')
      return this.ticketService.newTicketObject()
      // return this.getSingleTicket(key);
    }
  }

  showTicket(){
    console.log('All Tickets[0] = '+JSON.stringify(this.allTickets[0]))
    alert(JSON.stringify(this.currTicket))
  }


  statusIsNew(status: string): boolean{
    if(status.endsWith('New')) return true; // handles AAPending and Pending
    return false;
  }
  statusIsClosed(status: string){
    if(status.endsWith('Closed')) return true;
    return false;
  }
  statusIsHold(status: string){
    if(status.endsWith('Hold')) return true;
    return false;
  }
  statusIsProcessing(status: string){
    if(!this.statusIsClosed(status) && !this.statusIsNew(status) && !this.statusIsHold(status)) return true;
    return false;
  }
  lastIcon: string = 'tick';
  giveIcon(status: string){
    return this.statusIsClosed(status)? 'done' : ( this.statusIsNew(status) ? 'schedule' : ( this.statusIsHold(status) ? 'pause_circle' : 'construction' ) )
  }

  isOverdue(element: Ticket){
    let expected = new Date(element.expectedDate).getTime();
    let today = new Date().getTime();
    if(expected < today && !this.statusIsClosed(element.status)) return true;
    return false;
  }


  getPrioritySymbol(){
    switch(this.currTicket.priority){
      case 'High': return 'expand_less'     // its not a mistake, its really expand_less only
      case 'Medium': return 'minimize'
      case 'Low': return 'expand_more'
      default: return ''
    }
  }


  attachFile(ticket: Ticket){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;  // doesn't automatically set focus to first text box
    dialogConfig.width = '45rem';
    dialogConfig.data = {
      ticket: ticket,
    };

    const dialogRef = this.dialog.open(AttachDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(resultObserver => {
      if(resultObserver) this.getTicket();
    })
  }

  deleteFile(attachment: {name: string, url: string}){
    if(confirm(`Are you sure you want to delete ${attachment.name}?`)){
      // delete from storage, returns promise
      this.storage.storage.refFromURL(attachment.url).delete().then(()=>{
        alert(`Successfully deleted file ${attachment.name} from storage`);
        
        //delete from ticket zattachments, update ticket, also returns promise
        let attachmentIndex = this.currTicket.zattachments.indexOf(attachment);
        this.currTicket.zattachments.splice(attachmentIndex,1);
        this.ticketService.updateDBTicket(this.currTicket.key, this.currTicket).then(()=>{
          this.getTicket();   // refresh ticket displayed once ticket updated
        }).catch(err => alert(err));

      }).catch(err=>{alert(err)});
    }
  }


  currUID: string;
  getAuthUser(){
    // console.log('getting AuthUser at '+(new Date()).toLocaleTimeString())
    this.currUID = this.authService.currentUserUID();
    if(this.currUID){
      // console.log('uid = '+this.currUID)
      this.userService.readDBsingleUser(this.currUID).subscribe((response) => {this.currUser = response as User});
      // console.log('User details from dashboard: ',this.currUser)
      sessionStorage.setItem('initialized', '1');
      // this.isAuthenticated = true;
      // console.log('Authenticated here')
    }
    else {alert('ERROR: User not signed in, please sign in again')}
  }
  ngrxStoreUser(){
    this.store.dispatch(new UserAction(this.currUser))
  }


  updateTicket(ticket: Ticket){
    if(!this.currUser.empEid){
      alert('Fetching user details, please try again in 5 seconds');
      this.getAuthUser();
      this.ngrxStoreUser();
    }

    else{
      let allowUpdate = false;
      if(this.statusIsClosed(ticket.status)){
        if( confirm(`Ticket ${ticket.tid} has been closed. Are you sure you want to update it?`) ) allowUpdate = true;
      }
      else allowUpdate = true;
      
      if(allowUpdate){
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;  // doesn't automatically set focus to first text box
        dialogConfig.width = '46rem';
        dialogConfig.data = {
          ticketDialogTitle: 'Update',
          ticket: ticket,
          // currEmail: this.currTicket.empEid wrongity wrong wrong, needs the person signed in, not the one who created the ticket
          currEmail: this.currUser.empEid,
        };

        const dialogRef = this.dialog.open(TicketDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(resultObserver => {
          if(resultObserver) this.getTicket();
        })
      }
    }
  }

  adminList: any;
  readAdmins(){
    this.adminService.getAdminList().subscribe((observer)=>{
      this.adminList = observer;
      // console.log('ADMINS: '); console.log(this.adminList);
    })
  }
  isAdmin(email:string){
    if(this.adminList){
      if(this.adminList.adminList.indexOf(email)>-1) return true;
      else return false;
    }
    else return setTimeout(this.isAdmin(email),1000)
  }

  deleteTicket(ticket: any){
    if( confirm(`Are you sure you want to delete Ticket ${ticket.tid}?`) ){
      this.ticketService.deleteDBTicket(ticket.key).then(()=>{
        this.openSnackBar("Successfully deleted ticket "+ticket.key);
        this.location.back();
      }).catch(err=>alert("ERROR: "+err))
    }
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }


  findEmphasisPoint(commitMessage: string){
    if(commitMessage.startsWith('Imported')) return -2
    if(commitMessage.toLowerCase().indexOf('pm') > -1) return commitMessage.toLowerCase().indexOf('pm') + 2;
    return commitMessage.toLowerCase().indexOf('am') + 2;
  }

  is2049(date: Date): boolean{
    return (new Date(date)).getTime() == (new Date(2049,0,1)).getTime()
  }


  ngOnInit(): void {
    this.retrieveTickets();
    this.ngrxGetUser();
    this.readAdmins();

    setTimeout(()=>{this.getTicket()}, 2000);
  }

  // todo ngOnDestroy to set lastViewed 
}