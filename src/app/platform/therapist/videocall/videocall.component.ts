import { Component } from '@angular/core';
import { NewSessionNoteComponent } from '../new-session-note/new-session-note.component';
import { MatDialog } from '@angular/material/dialog';
import { PreviousSessionNoteComponent } from '../previous-session-note/previous-session-note.component';
import { OpentokService } from '../../../opentok.service';
import { ActivatedRoute } from '@angular/router';
import { CallInitModel, CallStatus } from '../../../shared/call-ringer/Callmodel';
import { decryption } from '../../shared/encryptionFun';
import { StorageService } from '../../../core/services/storage.service';
import { TherapistServiceService } from '../../Services/therapist-service.service';

@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrl: './videocall.component.scss'
})
export class VideocallComponent {
  appointmentId: any;
  encounterId: any;
  patientAppointmentDetails: any;
  patientAppointment: any;
  staffDetails: any;
  userId: number = 0;

  constructor(
    private appService: OpentokService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _storageService: StorageService,
    private _therapistService: TherapistServiceService
  ) {
    this.appointmentId = 0;
    this.encounterId = 0;
    this.patientAppointmentDetails = null;
    this.staffDetails = null;
    this.patientAppointment = null;
  }

  newSession(): void {
    const dialogRef = this.dialog.open(NewSessionNoteComponent, {
      panelClass: ['new_session', 'common_modal'],
      height: '100vh',
      position: {
        right: '0px',
      },
    });
  }

  previousSession(): void {
    const dialogRef = this.dialog.open(PreviousSessionNoteComponent, {
      panelClass: ['previous_session', 'common_modal'],
      height: '100vh',
      position: {
        right: '0px',
      },
    });
  }
  ngOnInit() {
    this.activateRoute.snapshot.url[0] && this.activateRoute.snapshot.url[0].path == "videocall"
    console.log("13 oninit   called from video call component  ");
    let fullName = "";
    fullName = "HCL"
    this.userId = 373


    if (this.userId > 0) {
        this.getPatientAppointmentDetails();
    }

    if (this.userId > 0) {
      console.log("10 call initiate  called from video call");
      console.log("call initiated from here")
      console.log("appointmentid=" + this.appointmentId)
    }
    let callInitModel: CallInitModel = new CallInitModel();
    callInitModel.AppointmentId = this.appointmentId;
    callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(callInitModel);
  }
  getPatientAppointmentDetails() {
    // this.getTokenById();
    this.patientAppointmentDetails = [];
    
  }

getTokenById(){
    let obj ={
      UserId : String(373),
    } 
    this._therapistService.GettokenById(obj).subscribe((res:any)=>{

  if(res.responseData != null ){
    this.patientAppointmentDetails = res.responseData;
  }
})
  }
}
