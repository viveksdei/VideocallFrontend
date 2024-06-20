import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../core/services';
import { Subscription } from 'rxjs';
import { CallInitModel, CallStatus } from './Callmodel';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TherapistServiceService } from '../../platform/Services/therapist-service.service';
import { HttpStatusCode } from '@angular/common/http';
import { ProfileService } from '../../platform/Services/profile.service';
import { decryption } from '../../platform/shared/encryptionFun';
// import { EventQueueService } from '../../platform/Services/EventQueueService ';
// import { AppEventType } from '../../core/modals/enum';
import { OpentokService } from '../../opentok.service';
import OT from '@opentok/client';
import * as signalR from '@aspnet/signalr';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-call-ringer',
  templateUrl: './call-ringer.component.html',
  styleUrl: './call-ringer.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CallRingerComponent implements OnInit {
  callInitModel: CallInitModel;
  loggedInUserName: any;
  private callPicked: boolean = false;
  private subscription!: Subscription;
  oneappointmentData: any;
  sessionId: any;
  token: any;
  dataObj: any;
  UserId: any;
  PatientId: any;
  Isactive: boolean = false;
  private session!: OT.Session;
  private publisher!: OT.Publisher;
  hubConnection!: signalR.HubConnection;
  // @ViewChild('publisherContainer') publisherContainer!: ElementRef;
  // @ViewChild('subscriberContainer') subscriberContainer!: ElementRef;
  // @ViewChild('publisherDiv') publisherDiv!: ElementRef;
  // @ViewChild('subscriberDiv') subscriberDiv!: ElementRef;
  ss: any;
  slotId: any;
  constructor(private userService: TherapistServiceService,
    private toastr: ToastrService,
    private appService: OpentokService,
    private _patientService: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    // private eventQueue: EventQueueService,
    private ref: ChangeDetectorRef,
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private _storageService: StorageService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.callInitModel = new CallInitModel();
  }

  ngOnInit() {
    console.log(" 50 call button ngoninit")
    this.appService.call.subscribe((callInitModel: CallInitModel) => {

      this.callInitModel = callInitModel;
      console.log("Ringing Start", callInitModel)
    });
    this.checkLoggedInClient();


  }
  checkLoggedInClient() {
    // this.subscription = this.commonService.loginUser.subscribe(
    //   (user: any) => {

    //     if (user.data) {
    //       console.log(user.data, "data");
    //       const userRoleName =
    //         user.data.users3 && user.data.users3.userRoles.userType;
    //       if ((userRoleName || "").toUpperCase() === "CLIENT") {

    //         this.loggedInUserName = user.patientData ? user.patientData.firstName + " " + user.patientData.lastName : '';
    //       }
    //       else {
    //         this.loggedInUserName = user.data.firstName + ' ' + user.data.lastName;
    //       }

    //     }
    //   })
  }

  pickCall() {
    console.log("9 pick call  called from call button");
    this.callInitModel.CallStatus = CallStatus.Picked;
    this.appService.CheckCallStarted(this.callInitModel);
    this.reloadComponent();
    // this.commonService.userRole.subscribe((role) => {
    //   if (role.toLowerCase() == "provider") {
    //     this.reloadClient();

    //     //this.router.navigate(["/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId]);
    //   } else {


    //     this.reloadComponent();

    //   }
    // });
  }
  reloadClient() {
    // let currentUrl = "/web/waiting-room/check-in-video-call/"+this.callInitModel.AppointmentId;
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(["/web/encounter/soap"], {
    //   queryParams: {
    //     apptId: this.callInitModel.AppointmentId,
    //     encId: 0,
    //   },
    // });
  }
  reloadComponent() {
    let currentUrl = "/platform/therapist/videocall"
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  ngOnDestroy() {
    // window.location.reload();
  }

  declineCall() {
    let UserId = Number(decryption(this._storageService.getLocalStorageData('userId')))
    if(UserId>0){
      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.chatHubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    const self = this;
    this.hubConnection
      .start()
      .then(() => {
        self.hubConnection
          .invoke(
            'CallEnd',
             UserId
          )
          .then(() => {
              this.callInitModel.CallStatus = CallStatus.Declined;
              this.callInitModel.AppointmentId = 0;
              this.appService.CheckCallStarted(this.callInitModel);
          })
          .catch((err) => console.error(err));
        ;
      })
      .catch((err) => console.log(err));
    }



























    console.log("8 declient call  called from call button");
    // if (this.callInitModel.AppointmentId > 0 && Number(localStorage.getItem("UserId")) > 0) {
      console.log("inside publisher method")
      // this._patientService
      //   .CallEnd(1,2)
      //   .subscribe((res) => {
      //     console.log(res);
      //   });
      // }
    // this.callInitModel.CallStatus = CallStatus.Declined;
    // this.callInitModel.AppointmentId = 0;
    // this.appService.CheckCallStarted(this.callInitModel);

    // let videoCall =this.elRef.nativeElement.getElementsByClassName('video-call'); //document.getElementsByClassName("video-call");
    // videoCall[0].classList.add("video-call-hide");
    // let videoTool = document.getElementsByClassName("video-tool");
    // videoTool[0].classList.add("video-tool-hide");
    // this.session.on("streamDestroyed", (e) => e.preventDefault());
    // this.session.disconnect();
    // this.router.navigate(["/platform/therapist/chat"], {});
  }



































  //   ngOnInit() {
  //     this.ref.detectChanges();
  //      const apptId = this.route.snapshot.paramMap.get('id');
  //     this.slotId = Number(apptId);
  //     this.UserId = decryption(localStorage.getItem('userId'))
  //     this.getPatientProfileData(this.UserId);
  //     this.appService.call.subscribe((callInitModel: CallInitModel) => {
  //       callInitModel = callInitModel;
  //       console.log("Your are from subscriptn method",callInitModel)
  //     });
  //   this.checkLoggedInClient() ;

  //   this.eventQueue.on(AppEventType.ClickedOnNotification).subscribe(event => this.handleEvent(event.payload));


  //   }

  //   checkLoggedInClient() {
  //    debugger;
  //     // this.subscription = this.commonService.loginUser.subscribe(
  //     //   (user: any) => {

  //     //     if (user.data) {
  //     //       const userRoleName =
  //     //         user.data.users3 && user.data.users3.userRoles.userType;
  //     //       if ((userRoleName || "").toUpperCase() === "CLIENT") {

  //     //         this.loggedInUserName = user.patientData ? user.patientData.firstName + " " + user.patientData.lastName : '';
  //     //       }
  //     //       else {
  //     //         this.loggedInUserName = user.data.firstName + ' ' + user.data.lastName;
  //     //       }

  //     //   }})
  //   }

  //   pickCall() {
  //     debugger;
  //     this.callPicked = true;
  //     this.callInitModel.CallStatus = CallStatus.Picked;
  //     this.appService.CheckCallStarted(this.callInitModel);
  //     // this.commonService.userRole.subscribe((role) => {
  //     // });
  //   }

  //   declineCall() {
  //     debugger;
  //     if (this.callInitModel.AppointmentId > 0 && Number(localStorage.getItem("UserId")) > 0) {
  //  this.userService.getEndCall(this.slotId).subscribe((res) => {
  //   });
  // }

  //     this.callInitModel.CallStatus = CallStatus.Declined;
  //     this.callInitModel.AppointmentId = 0;
  //     // this.appService.CheckCallStarted(this.callInitModel);  


  //     this.callInitModel.CallStatus = CallStatus.Declined;
  //     this.callInitModel.AppointmentId = 0;
  //    // this.appService.CheckCallStarted(this.callInitModel);

  // }

  //   getPatientProfileData(id:any){
  //     debugger
  //     this._patientService.getPatientDataById(id).subscribe((res:any)=>{
  //       this.dataObj=res.data;
  //       this.PatientId = res.data.patientId
  //       this.GetAppointmentById(this.PatientId)
  //     });

  //     }
  //   GetAppointmentById(id:any){
  //     debugger
  //     this.userService.getPatientAppointmentbyPatientID(this.PatientId).subscribe((res) => {
  //       if (res) {
  //         if (res.statusCode === HttpStatusCode.Ok) {
  //           if (res.responseData) {
  //             this.oneappointmentData = res.responseData;
  //             this.sessionId = res.responseData.sessionId;
  //             this.token = res.responseData.token;
  //             this.slotId = res.responseData.slotId;
  //             this.callInitModel.CallStatus = CallStatus.Started;
  //           }
  //         } else {
  //           this.callInitModel.CallStatus = CallStatus.NoCall;
  //           this.toastr.error("Error");
  //         }
  //       } else {
  //         this.callInitModel.CallStatus = CallStatus.NoCall;
  //         this.toastr.error("Error");
  //       }
  //     });
  //   }

  //   handleEvent(event: MouseEvent) {
  //     debugger;
  //     // this.callPicked = true;
  //     // this.callInitModel.CallStatus = CallStatus.Started;
  //     // this.commonService.CheckCallStarted(this.callInitModel);
  //     // this.commonService.userRole.subscribe((role) => {
  //     // });
  //   }

}