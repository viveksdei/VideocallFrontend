import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OpentokService } from './opentok.service';
import { MediaMatcher } from '@angular/cdk/layout';
import * as OT from "@opentok/client";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild("videoDiv") panelVideo!: ElementRef;
  mobileQuery!: MediaQueryList;
  title = 'videocall';
  loader: any;
  tokenDtail = {
    apiKey: '47863071',
    sessionID: '2_MX40Nzg2MzA3MX5-MTcxMTQ1NTc2Mjg3NH4vRTZJNDJCNG9JVVlBUnl0MTN4dEtFOWF-fn4',
    token: 'T1==cGFydG5lcl9pZD00Nzg2MzA3MSZzaWc9OTkwNTdlNmM1NGRjNjA0MTEyYjk1MTgyOTZhNjE0NzZhYTY5YjMxMzpzZXNzaW9uX2lkPTJfTVg0ME56ZzJNekEzTVg1LU1UY3hNVFExTlRjMk1qZzNOSDR2UlRaSk5ESkNORzlKVlZsQlVubDBNVE40ZEV0Rk9XRi1mbjQmY3JlYXRlX3RpbWU9MTcxMTQ1NTc2NSZub25jZT0yNzg4NDYmcm9sZT1QVUJMSVNIRVImZXhwaXJlX3RpbWU9MTcxNDA0Nzc1NQ==',
    id: 1,
    appointmentId: '22',
    userId: 2
  }
  invitationToken: string = "";
  isVideoStarted: boolean = false;
  otSessionId!: string;
  apptId: string = "0";
  session!: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef!: ChangeDetectorRef;
  startTime!: Date;
  endTime!: Date;
  actualMin: any;
  private _mobileQueryListener: () => void;
  public styleVideo: object = {};
  constructor(
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private commonService: OpentokService,
    private opentokService: OpentokService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    console.warn('okok');
    // broadCastChannel.onmessage = (event) => {
    //   if(event.data === 'SoltId') {
    //     let currentUrl = "patient/patient-dashboard/";
    //     this.router.navigate([currentUrl]);
    //   }
    // }
  }

  ngOnInit() {

    this.ngxLoader.start();
    this.ngxLoader.stop();

    //this.incoingCall();

    // this.activatedRoute.queryParams.subscribe((param) => {
    //   if (
    //     param["token"] != null &&
    //     param["token"] != undefined &&
    //     param["token"] != ""
    //   ) {
    //     this.invitationToken = param["token"];
    //     if (!localStorage.getItem("otSession")) this.checkOTSession();
    //   }
    // });

    this.commonService.videoSessionStarted.subscribe((res) => {
      var a = res;
      if (
        localStorage.getItem("otSession") &&
        localStorage.getItem("otSession") != ""
      )
        this.checkOTSession();
    });

   function myFunction(this: any) {

    if (
      localStorage.getItem("otSession") &&
      localStorage.getItem("otSession") !== ""
    ) {
      console.log("Ramara aa");
      let videoTool = document.getElementsByClassName("video-tool");
      if (videoTool !== undefined && videoTool.length > 0) {
        if (videoTool[0].classList.contains("video-tool-hide")) {
          this.checkOTSession();
        }
      } else {
        this.checkOTSession();
      }
    } else {
      this.isVideoStarted = false;
    }

    setTimeout(myFunction.bind(this), 1000);
    }
    myFunction.bind(this)();







    // // setInterval(() => {
    //   console.log("Ramara aa")
    // if (
    //   localStorage.getItem("userId") &&
    //   localStorage.getItem("userId") != ""
    // ) {
    //   debugger;
    //   let videoTool = document.getElementsByClassName("video-tool");
    //   if (videoTool != undefined && videoTool.length > 0) {
    //     if (videoTool[0].classList.contains("video-tool-hide")) {
    //       this.checkOTSession();
    //     }
    //   } else this.checkOTSession();

    // } else {
    //   this.isVideoStarted = false;
    // }
    // //},1000)



    this.commonService.newSelectedVideoPosition.subscribe((s: string) => {
      if (s) {
        const [a, b] = s.split(",");
        const event = { x: a, y: b };
        this.onDragVideo(event, false);
        this.commonService.newSelectedVideoPositionSubject.next(null);
      }
    });


  }

  onDragVideo(event: any, iserUserDrag = true) {
    let top;
    let left
    if (iserUserDrag) {
      top = this.panelVideo.nativeElement.style.top,
        left = this.panelVideo.nativeElement.style.left;
      (top = (parseInt(top) || 0) + event.y),
        (left = (parseInt(left) || 0) + event.x);
    }
    else {
      top = event.y,
        left = event.x;
    }
    this.renderer.setStyle(this.panelVideo.nativeElement, "left", `${left}px`);
  }

  checkOTSession() {
    console.log("22 checkotsesson  is called from app.component  ");
    if (!localStorage.getItem("otSession")) {
      if (
        1
      ) {
        //if (localStorage.getItem("inv_token")) {
        console.log("invitationtoken=" + this.invitationToken)
        // this.homeService
        //   .getOTSessionDetail(this.invitationToken)
        //   .subscribe((response: any) => {
        //var data = response;
        if (this.tokenDtail) {
          let videoTool = document.getElementsByClassName("video-tool");
          if (videoTool != undefined && videoTool.length > 0)
            videoTool[0].classList.remove("video-tool-hide");
          let videoCall = document.getElementsByClassName("video-call");
          if (videoCall != undefined && videoCall.length > 0)
            videoCall[0].classList.remove("video-call-hide");
          var otSession = this.commonService.encryptValue(
            JSON.stringify(this.tokenDtail)
          );
          localStorage.setItem("otSession", otSession);
          this.otSessionId = this.tokenDtail.sessionID;
          console.log("apikey=" + this.tokenDtail.apiKey)
          console.log("token=" + this.tokenDtail.token)
          console.log("session=" + this.tokenDtail.sessionID)

          const config = {
            API_KEY: +this.tokenDtail.apiKey,
            TOKEN: this.tokenDtail.token,
            SESSION_ID: this.tokenDtail.sessionID,
            SAMPLE_SERVER_BASE_URL: "",
          };
          this.apptId = this.tokenDtail.appointmentId
          this.getSession(config);
        } else {
          console.log("wrong1")
          // this.notifierService.notify(
          //   "error",
          //   "Token is not valid or expired"
          // );
        }
        // });
        //}
      }
    } else {
      let videoTool = document.getElementsByClassName("video-tool");
      if (videoTool != undefined && videoTool.length > 0)
        videoTool[0].classList.remove("video-tool-hide");
      let videoCall = document.getElementsByClassName("video-call");
      if (videoCall != undefined && videoCall.length > 0)
        videoCall[0].classList.remove("video-call-hide");
      var response = JSON.parse(
        this.commonService.encryptValue(
          localStorage.getItem("otSession"),
          false
        )
      );
      this.otSessionId = response.sessionID;
      const config = {
        API_KEY: +response.apiKey,
        TOKEN: response.token,
        SESSION_ID: response.sessionID,
        SAMPLE_SERVER_BASE_URL: "",
      };
      this.apptId = response.appointmentId;
      this.getSession(config);
    }
  }

  getSession(config: any) {
    console.log("21 getsession  is called from app.component.ts  ");
    this.commonService
      .initSession(config)
      .then((session: OT.Session) => {
        debugger;
        console.log("001 session", session);
        this.session = session;
        this.isVideoStarted = true;
        this.streams = Array<OT.Stream>();
        this.session.on("streamCreated", (event) => {
          this.startTime = new Date();
          this.streams.push(event.stream);
          this.changeDetectorRef.detectChanges();
          console.log("log stream", this.streams)
        });
        this.session.on("streamDestroyed", (event) => {
          this.capturedEndTime();
          if (event.reason === "networkDisconnected") {
            event.preventDefault();
            var subscribers = session.getSubscribersForStream(event.stream);
            if (subscribers.length > 0 && subscribers[0].id != undefined) {
              var subscriber = document.getElementById(subscribers[0].id);
              // Display error message inside the Subscriber
              if (subscriber) {
                subscriber.innerHTML =
                  "Lost connection. This could be due to your internet connection " +
                  "or because the other party lost their connection.";
                event.preventDefault(); // Prevent the Subscriber from being removed
              }

            }
          }
          const idx = this.streams.indexOf(event.stream);
          if (idx > -1) {
            this.streams.splice(idx, 1);
            this.changeDetectorRef.detectChanges();
            console.log("stream splice", this.streams)
          }
        });
        this.session.on("sessionDisconnected", (event) => {
          this.capturedEndTime();
        });
        this.session.on("archiveStarted", (event) => {
          console.log("Archive Started : " + event.id);
          // let videoRecordModel: VideoRecordModel = new VideoRecordModel();
          // videoRecordModel.isRecording = true;
          // videoRecordModel.archiveId = event.id;
          // this.appService.CheckVideoRecordStatus(videoRecordModel);
          // this.notifierService.notify("success", "Recording Started");
        });
        this.session.on("archiveStopped", (event) => {
          console.log("Archive Stopped : " + event.id);
          // let videoRecordModel: VideoRecordModel = new VideoRecordModel();
          // videoRecordModel.isRecording = false;
          // videoRecordModel.archiveId = event.id;
          // this.appService.CheckVideoRecordStatus(videoRecordModel);
          // this.notifierService.notify("success", "Recording Stopped");
        });
      })
      // .then(() => this.opentokService.connect())
      .then(() => {
        // Write your code here
        this.session.on("streamCreated", (event) => {
          this.startTime = new Date();
          this.streams.push(event.stream);
          this.changeDetectorRef.detectChanges();
          console.log("log stream", this.streams)
        });
        // Assuming opentokService.connect() returns a Promise
        return this.opentokService.connect();
    })
      .catch((err) => {
        console.error("error from app.componenet opentok", err);
        // alert(
        //   "Unable to connect. Make sure you have updated the config.ts file with your OpenTok details."
        // );
      });
  }
  private capturedEndTime() {
    this.startTime = new Date();
    var minutesToAdd = 10;
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
    this.endTime = futureDate;
    this.diff_minutes(this.endTime, this.startTime);
    this.updateCallDuration();
  }

  diff_minutes(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    this.actualMin = Math.abs(Math.round(diff));
  }
  updateCallDuration() {
    const OT = this.opentokService.getOT();
  }
  toggleActivation(i) {
    var activeSub = document.getElementsByClassName("sub-active");
    activeSub[0].classList.add("sub-not-active");
    activeSub[0].classList.remove("sub-active");

    var subscriber = document.getElementsByClassName("app-subscriber");
    subscriber[i].classList.add("sub-active");
    subscriber[i].classList.remove("sub-not-active");
  }


  
}
