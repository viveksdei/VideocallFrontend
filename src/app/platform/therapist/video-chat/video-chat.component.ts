import { ChangeDetectorRef, Component, ElementRef, Inject, Input, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import * as OT from "@opentok/client";
import { isPlatformBrowser } from '@angular/common';
import { OpentokService } from '../../../opentok.service';
import { TherapistServiceService } from '../../Services/therapist-service.service';
import { decryption } from '../../shared/encryptionFun';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrl: './video-chat.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VideoChatComponent {
  tokenDtail = {
    apiKey: '47863071',
    sessionID:'2_MX40Nzg2MzA3MX5-MTcxMTQ1NTc2Mjg3NH4vRTZJNDJCNG9JVVlBUnl0MTN4dEtFOWF-fn4',
    token:'T1==cGFydG5lcl9pZD00Nzg2MzA3MSZzaWc9OTkwNTdlNmM1NGRjNjA0MTEyYjk1MTgyOTZhNjE0NzZhYTY5YjMxMzpzZXNzaW9uX2lkPTJfTVg0ME56ZzJNekEzTVg1LU1UY3hNVFExTlRjMk1qZzNOSDR2UlRaSk5ESkNORzlKVlZsQlVubDBNVE40ZEV0Rk9XRi1mbjQmY3JlYXRlX3RpbWU9MTcxMTQ1NTc2NSZub25jZT0yNzg4NDYmcm9sZT1QVUJMSVNIRVImZXhwaXJlX3RpbWU9MTcxNDA0Nzc1NQ==',
    id: 1,
    appointmentId: '79',
    userId: 2
  }
  @Input() patientAppointmentDetails: any;
  @Input() patientAppointmentId: any;
  // @ViewChild("videoDiv") panelVideo!: ElementRef;
  invitationToken: string = "";
  isVideoStarted: boolean = false;

  apptId: string = "0";



  public styleVideo: object = {};
  ss: any;
  // screenSize: Array<any> = [
  //   { id: 1, size: '1:8', class: 'one-forth-width' },
  //   { id: 2, size: '1:4', class: 'half-width' },
  //   { id: 3, size: '1:2', class: '' },
  //   { id: 4, size: '1:1', class: 'video-call-fixed' },
  // ];
  screenId: any;
  title = "Video Chat";
  private publisher!: OT.Publisher;
  session!: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef!: ChangeDetectorRef;
  startTime!: Date;
  endTime!: Date;
  actualMin: any;
  otSessionId!: string ;

  constructor(
    private commonService: OpentokService,
    private userService: TherapistServiceService,
    private renderer: Renderer2,
    private ref: ChangeDetectorRef,
    private _therapist : TherapistServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.changeDetectorRef = ref;
    if (isPlatformBrowser(this.platformId)) {
      import("@opentok/client").then((OT) => {
        // Use OT here
      });
    }
  }




  ngOnInit() {
    console.log("11 oniit   called from video chat  component");
    let divVideoTool = document.getElementById("divVideoTool");
    if (divVideoTool != undefined) {
      let videoTool = document.getElementsByClassName("video-tool");
      if (videoTool != undefined && videoTool.length > 0) {
        var position = divVideoTool.getBoundingClientRect();
        videoTool[0].setAttribute("style", "left:" + position.left + "px;");
      }
    }

    if (this.patientAppointmentDetails) {
      // const userid = decryption( localStorage.getItem('userId'));
     this.loadScreen();
    }
  }

  loadScreen(){
    let obj = {
      UserId : 373
    }
    // this._therapist.GettokenById(obj)
    // .subscribe((response :any) => {
      debugger;
      // var otSession = response.responseData
      this.tokenDtail.sessionID= "2_MX40Nzg2MzA3MX5-MTcxMTQ1NTc2Mjg3NH4vRTZJNDJCNG9JVVlBUnl0MTN4dEtFOWF-fn4";
      this.tokenDtail.token="T1==cGFydG5lcl9pZD00Nzg2MzA3MSZzaWc9OTkwNTdlNmM1NGRjNjA0MTEyYjk1MTgyOTZhNjE0NzZhYTY5YjMxMzpzZXNzaW9uX2lkPTJfTVg0ME56ZzJNekEzTVg1LU1UY3hNVFExTlRjMk1qZzNOSDR2UlRaSk5ESkNORzlKVlZsQlVubDBNVE40ZEV0Rk9XRi1mbjQmY3JlYXRlX3RpbWU9MTcxMTQ1NTc2NSZub25jZT0yNzg4NDYmcm9sZT1QVUJMSVNIRVImZXhwaXJlX3RpbWU9MTcxNDA0Nzc1NQ==";
      this.tokenDtail.appointmentId="79"
      
        this.tokenDtail.userId= Number(373);

      var otSession = this.commonService.encryptValue(
        JSON.stringify(this.tokenDtail)
      );
      console.log("session="+JSON.stringify(this.tokenDtail));
      localStorage.setItem("otSession", otSession);
      this.commonService.videoSession(true);
      this.otSessionId = "2_MX40Nzg2MzA3MX5-MTcxMTQ1NTc2Mjg3NH4vRTZJNDJCNG9JVVlBUnl0MTN4dEtFOWF-fn4";
    // });
  }


  private capturedEndTime() {
    this.endTime = new Date();
    this.diff_minutes(this.endTime, this.startTime);
    this.updateCallDuration();
  }

  diff_minutes(dt2: Date, dt1: Date) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    this.actualMin = Math.abs(Math.round(diff));
  }
  updateCallDuration() {
    const OT = this.commonService.getOT();
  }



}
