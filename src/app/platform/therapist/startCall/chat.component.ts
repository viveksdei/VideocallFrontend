import {  Component,  OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChatServiceService } from '../../Services/chat-service.service';
import { OrderByPipe } from '../../shared/pipes/order-by.pipe';
import { ScrollToBottomDirective } from '../../shared/directives/scroll-to-bottom.directive';
import { environment } from '../../../../environments/environment';
import * as signalR from '@aspnet/signalr';
import { decryption } from '../../shared/encryptionFun';
import { ToastrService } from 'ngx-toastr';
import { CallInitModel, CallStatus } from '../../../shared/call-ringer/Callmodel';
import { OpentokService } from '../../../opentok.service';
import { Router } from '@angular/router';

export interface user {
  content: string;
  emailId: string;
  firstName: string;
  profilePicLink: string;
  isActive: boolean;
  isOnline: boolean;
  lastName: string;
  messageDate: string;
  messageId: string;
  notifyCount: number;
  receiver: string;
  sender: string;
  type: boolean;
  userId: string;
  usersImage: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [OrderByPipe],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {

  @ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective | any;

  chatUser: any;
  hubConnection!: signalR.HubConnection;
  userId: any = '';
  constructor(
    public _chatService: ChatServiceService, 
    private _toaster: ToastrService, private appService: OpentokService, private route: Router) {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      this.userId = localStorage.getItem('userId');
    }
  }


  ngOnInit(): void {
    this.userId = decryption(this.userId);//currentUser.usersId;
  }

  startVideoCall() {
    let userid = Number(decryption(this.userId));
    this.secondconnect(375, 373);
  }


  secondconnect(patientid: number, fromcall: any) {
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
            'CallInitiate',
            patientid,
            fromcall
          )
          .then(() => console.log('rama rama'))
          .catch((err) => console.error(err));

        ;
      })
      .catch((err) => console.log(err));

    //for Recived call
    this.hubConnection.on('CallInitiated', (sessionid, token, patientid, fromcall) => {
      let previousCallModel: CallInitModel = new CallInitModel();
      this.appService.call.subscribe((callInitModel: CallInitModel) => {
        previousCallModel = callInitModel;

      });
      console.log(
        "Previous Call Initiated For Appointment Id : ",
        previousCallModel.AppointmentId
      );
      this.route.navigate(['/videocall'])

      let callInitModel = new CallInitModel();
      callInitModel.CallStatus = CallStatus.Picked;//CallStatus.Started;
      callInitModel.AppointmentId = 79;
      callInitModel.CallerName = "Ram Calling";
      console.log("Call MOdel Changed : ", callInitModel);
      this.appService.CheckCallStarted(callInitModel);
    });

    this.hubConnection.on('CallEnded', (UserResult) => {
      if (Number(this.userId) == UserResult) {
        this._toaster.success("Call Rejected By Patient");
        localStorage.removeItem("otSession");
        this.route.navigate(["/platform/therapist/chat"], {
        });
      }
    });
  }
}
