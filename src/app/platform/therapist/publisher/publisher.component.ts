import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OpentokService } from '../../../opentok.service';
import { NewSessionNoteComponent } from '../new-session-note/new-session-note.component';
import { PreviousSessionNoteComponent } from '../previous-session-note/previous-session-note.component';
import { ProfileService } from '../../Services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { TherapistServiceService } from '../../Services/therapist-service.service';
import { StorageService } from '../../../core/services/storage.service';
import { decryption } from '../../shared/encryptionFun';


@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrl: './publisher.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PublisherComponent implements AfterViewInit, OnDestroy {
  @ViewChild("publisherDiv") publisherDiv!: ElementRef;
  @Input() session!: OT.Session;
  @Input() patientAppointmentId!: string;
  @Input() otSessionId!: string;
  publisher!: OT.Publisher;
  publishing!: Boolean;
  isScreenShare!: boolean;
  isVideo: boolean = true;
  userRole: any;
  isVideoBtn: boolean = false;
  isFullScreen: boolean = false;
  isProvider: boolean = false;
  isPatient: boolean = false;
  ismute = true;
  isvideomute = true;
  screenSize: Array<any> = [
    { id: 1, size: "1:8", class: "one-forth-width" },
    { id: 2, size: "1:4", class: "half-width" },
    { id: 3, size: "1:2", class: "" },
    { id: 4, size: "1:1", class: "video-call-fixed" },
  ];
  screenId: any;
  isVideoRecord: boolean = false;
  archiveId: string = "";
  userId: any;
  roleId :any;

  constructor(
    private opentokService: OpentokService,
    //private commonService: CommonService,
    private router: Router, private _toastr: ToastrService,
    public dialog: MatDialog, private _profile: ProfileService,
    private _therapist: TherapistServiceService, private _storage: StorageService
  ) {
    this.publishing = false;
    this.userId = decryption(_storage.getLocalStorageData('userId'))
    this.roleId = Number(decryption(_storage.getLocalStorageData('role')))

    this.screenId = this.screenSize[2];
    console.log(this.screenId);
    this.archiveId = "";
  }

  ngOnInit() {
    console.log("14 oninit   called from publisher  ");
    // this.appService.videoRecordingStarted.subscribe(
    //   (videoRecordModel: VideoRecordModel) => {
    //     this.isVideoRecord = videoRecordModel.isRecording;
    //     this.archiveId = "";
    //     if (videoRecordModel.isRecording)
    //       this.archiveId = videoRecordModel.archiveId;
    //   }
    // );

    this.opentokService.newSelectedScreenSize.subscribe(s => {
      if (s) {
        const size = this.screenSize.find(x => x.size == s);
        const eventSize = { value: size }
        // this.setScreenSize(eventSize);
      }
    })


  };


  ngAfterViewInit() {
    this.startVideoCall();
  }

  cycleVideo() {
    this.publisher && this.publisher.cycleVideo();
  }

  toggleVideo(video: boolean) {
    this.isVideoBtn = false;
    if (video == true) {
      this.publisher.publishVideo(false);
      this.publisher.publishAudio(true);
      this.isVideo = false;
    } else {
      this.publisher.publishVideo(true);
      this.publisher.publishAudio(true);
      this.isVideo = true;
    }
  }
  toggleFullScreen(isFullScreen: boolean) {
    this.isFullScreen = !isFullScreen;
    let videoTool = document.getElementsByClassName("video-call");
    videoTool[0].classList.toggle("video-call-fixed");
  }
  toggleScreen() {
    if (this.isScreenShare) this.startVideoCall();
    else this.screenshare();
    this.isScreenShare = !this.isScreenShare;
  }
  screenshare() {
    const OT = this.opentokService.getOT();
    OT.checkScreenSharingCapability((response) => {
      if (!response.supported || response.extensionRegistered === false) {
        alert("This browser does not support screen sharing.");
      } else if (response.extensionInstalled === false) {
        alert(
          "Please install the screen sharing extension and load your app over https."
        );
      } else {
        this.publisher = OT.initPublisher(this.publisherDiv.nativeElement, {
          width: "70px",
          height: "50px",
          showControls: true,
          videoSource: "window",
        });
        if (this.session) {
          if (this.session["isConnected"]()) {

            this.publish();
          }
          this.session.on("sessionConnected", () => this.publish());
        }
      }
    });
  }
  endCall() {
    console.log("15 endcall   called from publisher  ");
    // let callInitModel: CallInitModel = new CallInitModel();
    // callInitModel.AppointmentId = 0;
    // callInitModel.CallStatus = CallStatus.Over;
    // this.appService.CheckCallStarted(callInitModel);
    let videoCall = document.getElementsByClassName("video-call");
    videoCall[0].classList.add("video-call-hide");
    let videoTool = document.getElementsByClassName("video-tool");
    videoTool[0].classList.add("video-tool-hide");
    // var apptId = 0;
    // this.activatedRoute.queryParams.subscribe((param) => {
    //   apptId = param["apptId"];
    // });
    localStorage.removeItem("otSession");
    //this.commonService.isPatient.subscribe((isPatient) => {
    // if (isPatient) {
    console.log("16 ispatient condition in endcall   called from publisher  ");
    this.session.on("streamDestroyed", (e) => e.preventDefault());
    this.session.disconnect();
    let slotId: number = 0;
    let tempData = {
      userId: this.userId
    }
    this._therapist.GettokenById(tempData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        slotId = res.responseData.slotId;
        if (slotId != 0) {
          let obj = {
            slotId: slotId,
          }
          this._profile.UpdateAppointmentStatus(obj).subscribe((res: any) => {
            if (res) {
              if (res.statusCode == 200) {
                this._toastr.success("Session Complete !!")
              }
            }
          })
        }
      }
    })
    this.router.navigate(["/platform/therapist/chat"], {
      // queryParams: {
      //   apptId: apptId,
      // },
    });


    // } else {
    //   console.log("17 ispatient false in endcall   called from publisher  ");
    //   this.session.on("streamDestroyed", (e) => e.preventDefault());
    //   this.session.disconnect();

    // }

    // });

    // if (this.patientAppointmentId > 0 && Number(localStorage.getItem("UserId")) > 0) {
    //   this.appService
    //     .getEndCall(this.patientAppointmentId, Number(localStorage.getItem("UserId")))
    //     .subscribe((res) => {
    //     });

    //  }

  }

  startVideoCall() {
    console.log("18 start video call  is called from publisher  ");
    const OT = this.opentokService.getOT();
    this.publisher = OT.initPublisher(
      this.publisherDiv.nativeElement,
      {
        name: "OpenTok",
        style: {},
        insertMode: "append",
        width: "70px",
        height: "50px",
        showControls: true,
      },
      (err) => {
        err && console.log("ppppp", err.message);
      }
    );

    if (this.session) {
      if (this.session["isConnected"]()) {
        this.publish();
      }
      this.session.on("sessionConnected", () => this.publish());
      this.session.on("sessionDisconnected", function (event) { });
    }
  }

  publish() {
    console.log("19 publish  is called from publisher  ");
    this.session.unpublish(this.publisher);
    this.session.publish(this.publisher, (err) => {
      if (err) {
        console.log("p1", err.message);

      } else {
        this.publishing = true;
      }
    });
  }
  addNewCaller() {
    // let dbModal;
    // dbModal = this.dialogModal.open(AddNewCallerComponent, {
    //   data: {
    //     appointmentId: this.patientAppointmentId,
    //     sessionId: this.otSessionId,
    //   },
    // });
    // dbModal.afterClosed().subscribe((result: string) => {
    //   if (result == "save") {
    //   }
    // });
  }
  startChat() {
    // var chatInitModel = new ChatInitModel();
    // var response = JSON.parse(
    //   this.commonService.encryptValue(localStorage.getItem("otSession"), false)
    // );

    // if (!localStorage.getItem("access_token")) {
    //   chatInitModel.isActive = true;
    //   chatInitModel.AppointmentId = response.appointmentId;
    //   chatInitModel.UserId = response.userId;
    //   chatInitModel.UserRole = "Invited";
    // } else {
    //   chatInitModel.isActive = true;
    //   chatInitModel.AppointmentId = response.appointmentId;
    //   chatInitModel.UserId = Number(localStorage.getItem("UserId"));
    //   chatInitModel.UserRole = localStorage.getItem("UserRole");


    // }
    // this.appService.CheckChatActivated(chatInitModel);

    // this.textChatService.setAppointmentDetail(
    //   chatInitModel.AppointmentId,
    //   chatInitModel.UserRole
    // );
    // this.textChatService.setRoomDetail(
    //   chatInitModel.UserId,
    //   chatInitModel.AppointmentId
    // );
  }
  // setScreenSize(event: any) {
  //   this.screenId = event.value;
  //   let videoTool = document.getElementsByClassName("video-tool");
  //   if (videoTool != undefined && videoTool.length > 0) {
  //     videoTool[0].classList.remove("video-call-fixed");
  //     videoTool[0].classList.remove("half-width");
  //     videoTool[0].classList.remove("one-forth-width");
  //     var className = this.screenId.class;
  //     console.log(className);
  //     videoTool[0].classList.add(className);
  //   }
  // }
  startStopCallRecording() {
    // this.isVideoRecord = !this.isVideoRecord;
    // if (this.isVideoRecord) {
    //   var response = JSON.parse(
    //     this.commonService.encryptValue(
    //       localStorage.getItem("otSession"),
    //       false
    //     )
    //   );
    //   this.otSessionId = response.id;
    //   const config = {
    //     API_KEY: +response.apiKey,
    //     TOKEN: response.token,
    //     SESSION_ID: response.sessionID,
    //     SAMPLE_SERVER_BASE_URL: "",
    //   };
    //   this.appService
    //     .startVideoRecording(response.sessionID)
    //     .subscribe((response) => {
    //       console.log(response);
    //     });
    // } else if (this.archiveId != "") {
    //   this.appService
    //     .stopVideoRecording(this.archiveId, this.patientAppointmentId)
    //     .subscribe((response) => {
    //       console.log(response);
    //     });
    // }
  }

  ngOnDestroy() {
    this.session.disconnect();
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
  Muted() {
    this.ismute = false

    this.publisher.publishAudio(false);

  }

  UnMuted() {
    this.ismute = true
    this.publisher.publishAudio(true);
  }

  stopVideoSharing() {
    this.isvideomute = false
    this.publisher.publishVideo(false);
  }

  // Function to start video sharing again if needed
  startVideoSharing() {
    this.isvideomute = true
    this.publisher.publishVideo(true);
  }






}
