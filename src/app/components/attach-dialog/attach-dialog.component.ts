import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { DialogData } from '../../shared/interfaces/dialog-data';
import { TicketsService } from '../../shared/services/tickets/tickets.service';

@Component({
  selector: 'app-attach-dialog',
  templateUrl: './attach-dialog.component.html',
  styleUrls: ['./attach-dialog.component.css']
})
export class AttachDialogComponent implements OnInit {

  constructor(private ticketService: TicketsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private storage: AngularFireStorage,
    public matSnack:MatSnackBar) {
  }

  // upload file experiment
  // see contructor also
  selectedFiles: FileList;
  percentageUploaded: number;
  selectFile(event: any){
    this.selectedFiles = event.target.files;
  }

  // mine, everything here instead of service

  basePath = '/uploads/'

  fileUploads: {name: string, url: string}[] = []
  myUploadAllFiles(){
    if(this.selectedFiles){
      for(let i=0; i<this.selectedFiles.length;i++){
        const file = this.selectedFiles.item(i);
        if(file){
          const filePath = this.basePath + file.name;
          const storageRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, file);
          uploadTask.snapshotChanges().pipe(
            finalize( () => { 
              storageRef.getDownloadURL().subscribe(downloadURL => {
                //or urls (array) = downloadurl
                this.fileUploads.push({name: file.name, url: downloadURL});
                console.log(`Tried pushing ${downloadURL}`)
                console.log(`Finally pushed ${JSON.stringify({name: file.name, url: downloadURL})}`)
              })
             } )
          ).subscribe()
          uploadTask.percentageChanges().subscribe(percent => {this.percentageUploaded = percent});
        }
      }
    }

  }

  giveURLS(){
    alert(JSON.stringify(this.fileUploads))
  }

  attachToTicket(){
    if(this.data.ticket.zattachments) this.fileUploads.forEach((file)=>{this.data.ticket.zattachments.push(file)})
    else this.data.ticket.zattachments = this.fileUploads
    this.ticketService.updateDBTicket(this.data.ticket.key, this.data.ticket).then( () => {
      this.openSnackBar(`Added ${this.fileUploads.length} attachments to ${this.data.ticket.tid} successfully!`);
    })
    .catch(err => alert(err));
  }

  // myUploadFile(uploadFile: File): Observable<number | undefined>{   // return file upload progress
  //   const filePath = this.basePath + uploadFile.name;
  //   const storageRef = this.storage.ref(filePath);
  //   const uploadTask = this.storage.upload(filePath, uploadFile);
  //   let url;
  //   uploadTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       storageRef.getDownloadURL().subscribe(downloadURL => {
  //         console.log(`uploaded ${uploadFile.name} to ${downloadURL}`);
  //         url = downloadURL;
  //         console.log('The 2nd log: '+url);
  //       })
  //     })
  //   ).subscribe()
  //   console.log('The 3rd log: '+url);
  //   return url;
  // }

  openSnackBar(message: string, action: string = 'Close') {
    this.matSnack.open(message, action);
  }

  ngOnInit(): void {
  }

}
