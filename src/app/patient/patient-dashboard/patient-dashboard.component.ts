import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { TherapistServiceService } from '../../platform/Services/therapist-service.service';
import { DOCUMENT } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { decryption } from '../../platform/shared/encryptionFun';
import { FormControl } from '@angular/forms';
import { ScrollToBottomDirective } from '../../platform/shared/directives/scroll-to-bottom.directive';
import { ChatServiceService } from '../../platform/Services/chat-service.service';
import { environment } from '../../../environments/environment';
import { Guid } from 'guid-typescript';
import * as signalR from '@aspnet/signalr';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ProfileService } from '../../platform/Services/profile.service';

import { SlotBookingModel } from '../../core/modals/SlotBook-model';
import { CallInitModel, CallStatus } from '../../shared/call-ringer/Callmodel';
import { OpentokService } from '../../opentok.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class PatientDashboardComponent implements OnInit {

  slotBookingObj: SlotBookingModel[] = [];
  logo: string = "assets/img/logo.svg";
  profile_img: string = "assets/img/profile_img.png";
  schedule_img: string = "assets/img/schedule_img.png";
  loading = false;
  selected: Date | null | undefined;
  // selectedDate: any;
  availabilityList: any;
  userId: any;
  @ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective | any;
  users: any[] = [];
  // usersId: any;
  chatUser: any;
  chatUser1: any;
  loggedInUser: any;
  searchInput: String = '';
  firstName: any = '';
  lastName: any = '';
  email: string = '';
  existedUserImage: any[] = [];
  lastMessageValue: string = '';
  welcometab: boolean = false;
  openBox: boolean = false;
  userCtrl = new FormControl();
  // filteredName: Observable<any[]>;
  length: number = 0;
  private sub: any;
  lastMessage: boolean = false;
  countnotification: boolean = false;
  isNewUsers: boolean = false;
  sppiner: boolean = false
  messages: any[] = [];
  chatExisted: any[] = [];
  displayMessages: any[] = [];
  connectedUsers: any[] = [];
  searchResult: Array<any> = [];
  message: string = '';
  profilePic: string = '';
  profilePicNotNull: boolean = false;
  hubConnection!: signalR.HubConnection; therapyList: any;
  hideButtons:boolean=false;


  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  selectedDate = new Date();
  calendarVisible = true;
  selectedAvailability: any;
  userName: any;
  roleId: number = 0;
  patientId: any;
  therapistId: any;
  chosenPlan: any;
  therapistUserId: any;
  patientStatusId: any;
  closestAppointmentData: any;
  Dp: any;
  safeDp: any;
  patientProfilePic: any;
  currentSystemTimezone:any;
  patientprofilepic: any;
  constructor(@Inject(DOCUMENT) private document: Document,private sanitizer: DomSanitizer, private datePipe: DatePipe, private route: Router, public dialog: MatDialog, private _authService: AuthService,
    public _therapistService: TherapistServiceService,
    public _chatService: ChatServiceService,
    private _storageService: StorageService,
    private __tosterService: ToastrService,
    private _profileService: ProfileService,
    private _router: Router,
    private appService: OpentokService,
    ) { }
  ngOnInit()
   {
    this.dateSelected = this.selectedDate
    this.userId = decryption(this._storageService.getLocalStorageData('userId'))
    this.userName = decryption(this._storageService.getLocalStorageData('name'))
    // this.getAllUserExisted()
    if(this.userId)
    {
      this.GetClosestAppointment(this.userId);
    }
    this._profileService.GetSubscriptionPlanDetailsById(this.userId).subscribe((res: any) => {
    if (res) {
      this.chosenPlan = res.responseData;
    }
    })
    this._profileService.getPatientDataById(this.userId).subscribe((res: any) => {
      if (res != null) {

        this.firstName = res.responseData.firstName;
        this.lastName = res.responseData.lastName;
        this.email = res.responseData.email;
        this.therapistId = res.responseData.therapistId;
        this.therapistUserId = res.responseData.therapistUserId;
        this.patientStatusId = res.responseData.statusId;
        this.patientprofilepic = res.responseData.profileImage;
        if (!res.responseData.profileImage) {
          this.Dp = this.createInitialsImage(this.firstName, this.lastName);
          this.patientProfilePic = this.sanitizer.bypassSecurityTrustResourceUrl(this.Dp);
        }else{
debugger
          this.patientProfilePic =this.createImgPath(res.responseData.profileImage);
        }
        if (!res.responseData.profileImage) {
          this.Dp = this.createInitialsImage(this.firstName, this.lastName);
          this.safeDp = this.sanitizer.bypassSecurityTrustResourceUrl(this.Dp);
        }else{

          this.safeDp =this.createImgPath(res.responseData.profileImage);
        }
        if (
          res.profilePicLink == null ||
          res.profilePicLink == '' ||
          res.profilePicLink == undefined
        ) {
          this.profilePicNotNull = true;
        } else {
          this.profilePic = this.createImgPath(res.profilePicLink);
        }
        if (this.therapistId != 0) {
          this.getTherapistProfile();
          this.getAvailableSlot();
        }
      }
    });
    this._chatService.getUserReceivedMessages(this.userId).subscribe((item: any) => {

      if (item) {
        this.messages = item;
        this.messages.forEach((x) => {
          x.type = x.receiver === this.userId ? 'recieved' : 'sent';
        });
        if (this.messages.length > 0) {
          this.sppiner = false
        }

        if (this.users.length > 0) {
          this.openChat(this.users[0])
        }
      }
    });
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
        // this.firstName='Raja'
        // this.lastName='Ram'

        self.hubConnection
          .invoke(
            'PublishUserOnConnect',
            Number(this.userId),
            this.firstName.toString(),
            this.lastName.toString()
          )
          .then(() => console.log('User Sent Successfully'))
          .catch((err) => console.error(err));
        this.makeItOnline();
        this.hubConnection.on('BroadcastUserOnConnect', (Usrs) => {

          this.connectedUsers = Usrs;
          this.makeItOnline();
        });
        ;
        this.hubConnection.on('BroadcastUserOnDisconnect', (Usrs) => {
          this.connectedUsers = Usrs;
          this.users.forEach((item: any) => {
            item.isOnline = false;
          });
          this.makeItOnline();
        });
      })
      .catch((err) => console.log(err));

    //for Recived Message
    ;
    this.hubConnection.on('ReceiveDM', (connectionId, message) => {

      let userExist = this.chatUser;
      if (userExist === undefined || userExist === null) {
        let curentUser = this.chatUser;
        let newUser: user = {
          content: message.content,
          emailId: curentUser.email,
          firstName: curentUser.firstName,
          profilePicLink: curentUser.profilePicLink,
          isOnline: true,
          lastName: curentUser.lastName,
          messageDate: message.messageDate,
          messageId: message.id,
          notifyCount: 0,
          receiver: message.receiver,
          sender: message.sender,
          type: false,
          userId: curentUser.userId,
          isActive: true,
          usersImage: '',
        };
        this.users.push(newUser);
      }
      this.users.forEach((element: any) => {
        if (element.userId == message.sender) {
          element.notifyCount = element.notifyCount + 1;
          element.content = message.content;
          element.messageDate = message.messageDate;
        }
      });

      this.openBox = true;
      message.type = 'recieved';

      this.messages.push(message);
      if (this.chatUser !== undefined) {
        if (this.chatUser.userId == message.sender) {
          this.chatUser.notifyCount = 0;
          this.users.forEach((element: any) => {
            if (element.userId == message.sender) {
              element.notifyCount = 0;
            }
          });

          this.hubConnection
            .invoke(
              'UpdateNotificationToUser',
              message.receiver,
              message.sender
            )
            .then(() => {

              this.messages.push('Msg Deleted Successfully');
            })

            .catch((err) => console.error(err));
        }
      }
      this.users = this.users.sort((a: any, b: any) =>
        a.messageDate < b.messageDate ? 1 : -1
      );
      //let curentUser = this.users.find((x: any) => x.userId === message.sender);
      //this.chatUser = curentUser;
      // this.users.forEach((item: any) => {
      //   item['isActive'] = false;
      // });
      // var user = this.users.find((x: any) => x.userId == this.chatUser.userId);
      // user['isActive'] = true;

      this.displayMessages = this.messages.filter(
        (x) =>
          (x.receiver == this.chatUser.userId ||
            x.sender == this.chatUser.userId) &&
          (x.receiver == this.userId || x.sender == this.userId)
      );
      // this.getAllUserExisted()
    });

    //Delete Message
    this.hubConnection.on('BroadCastDeleteMessage', (connectionId, message) => {
      let deletedMessage = this.messages.find((x) => x.id === message.id);
      if (deletedMessage) {
        deletedMessage.isReceiverDeleted = message.isReceiverDeleted;
        deletedMessage.isSenderDeleted = message.isSenderDeleted;
        if (
          deletedMessage.isReceiverDeleted &&
          deletedMessage.receiver === this.chatUser.userId
        ) {
          // this.displayMessages = this.messages.filter(
          //   (x) =>
          //     (x.type === 'sent' && x.receiver === this.chatUser.id) ||
          //     (x.type === 'recieved' && x.sender === this.chatUser.id)
          // );

          this.displayMessages = this.messages.filter(
            (x) =>
              //(x.type === 'sent' && x.receiver === this.chatUser.userId) || (x.type === 'recieved' && x.sender === this.chatUser.userId)
              (x.receiver === this.chatUser.userId ||
                x.sender === this.chatUser.userId) &&
              (x.receiver === this.userId || x.sender === this.userId)
          );
        }
      }
    });
    // this.getAllUserExisted()
    this.hubConnection.on('CallInitiated', (patientid, fromcall) => {
      let User = Number(this.userId)
      if (User == patientid) {
        console.log("Calling From Someone")
        let previousCallModel: CallInitModel = new CallInitModel();
        this.appService.call.subscribe((callInitModel: CallInitModel) => {
          previousCallModel = callInitModel;
          console.log("subscribe called")

        });
        console.log(
          "Previous Call Initiated For Appointment Id : ",
          previousCallModel.AppointmentId
        );
        let callInitModel = new CallInitModel();
        callInitModel.CallStatus = CallStatus.Started;
        callInitModel.AppointmentId = 22;
        callInitModel.CallerName = fromcall;
        console.log("Call MOdel Changed : ", callInitModel);
        this.appService.CheckCallStarted(callInitModel);
      }


    });
    const currentDate = new Date();
    this.currentSystemTimezone = this.datePipe.transform(currentDate, 'short');

  }
  makeItOnline() {
    if (this.connectedUsers && this.users) {
      this.connectedUsers.forEach((item) => {
        var u = this.users.find((x: any) => x.userId == item.userId);
        if (u) {
          u.isOnline = true;
        }
      });
    }
  }
  SendDirectMessage() {

    if (this.message != '' && this.message.trim() != '') {
      let guid = Guid.create();
      var msg = {
        id: guid.toString(),
        sender: String(this.userId),
        receiver: String(this.therapistUserId),
        messageDate: new Date(),
        type: 'sent',
        content: this.message,
        isSenderSeen: false,
        isReceiverSeen: true,
        createdBy: String(this.userId)
      };
      this.messages.push(msg);
      this.lastMessage = true;

      this.displayMessages = this.messages.filter(
        (x) =>
          //(x.type === 'sent' && x.receiver === this.chatUser.userId) || (x.type === 'recieved' && x.sender === this.chatUser.userId)
          (x.receiver == this.chatUser.userId ||
            x.sender == this.chatUser.userId) &&
          (x.receiver == this.userId || x.sender == this.userId)
      );
      this.hubConnection
        .invoke('SendMessageToUser', msg)
        .then(() => console.log('Message to user Sent Successfully'))
        .catch((err) => console.error(err));
      this.lastMessageValue = this.message;
      this.message = '';
      // this.getAllUserExisted();
    }
  }

  //     getAllUserExisted(): void {
  //       this._chatService.getUserChatExisted(this.userId).subscribe(
  //         (user: any) => {

  //           if (user) {
  //             this.users = user.responseData
  //             .filter(
  //               (x: any) => x.userId == 47
  //               );
  //               if(this.users.length>0)
  //               {
  //                 this.users.forEach((item: any) => {
  //                   item['isActive'] = false;
  //                   item['msgCount'] = 0;
  //                 });
  //                 this.openChat(this.users[0])
  //               }
  //               this.makeItOnline();
  //             }
  //     }
  //   );
  // }
  deleteMessage(message: any, deleteType: any, isSender: any) {
    let deleteMessage = {
      deleteType: deleteType,
      message: message,
      deletedUserId: this.userId,
    };
    this.hubConnection
      .invoke('DeleteMessage', deleteMessage)
      .then(() => console.log('publish delete request'))
      .catch((err) => console.error(err));
    message.isSenderDeleted = isSender;
    message.isReceiverDeleted = !isSender;
  }
  createImgPath = (serverPath: string) => {
    var path = `${environment.imageUrl}/${serverPath}`;
    return path;
  };
  onPreviousDay() {
    this._addDays(-1);
  }

  onNextDay() {
    this._addDays(1);
  }

  dateSelected: any;
  // formatedDate: any;
  onSelectedChange(event: any): void {
    this.dateSelected = event;
    if (this.dateSelected) {
      this.dateSelected = this.datePipe.transform(this.dateSelected, 'yyyy-MM-dd');
    } else {
      this.dateSelected = 'undefined';
    }
    this.getAvailableSlot()
  }


  getAvailableSlot() {
    let obj = {
      userId: this.userId,
      slotDate: this.dateSelected
    }
    this._therapistService.getTherapistAvailabilityById(obj).subscribe((response: any) => {

      try {
        if (response != null && response != undefined) {
          this.availabilityList = response.responseData;
          console.log('listAval',this.availabilityList)
          if(this.availabilityList==null)
          {
            this.hideButtons=false;
            // this.hideConfirm=true;
            // this.hideCancel=true;
          }
          else{
            this.hideButtons=true;
          }
        }
      }
      catch (error) {
        console.log(error);
      }
    })
  }


  editProfile() {
    this.route.navigate(["patient/view-therapist"]);
  }

  private _addDays(days: number) {
    this.selectedDate = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate() + days
    );

    //this.calendar._goToDateInView(this.selectedDate, 'month');
  }


  getTherapistProfile() {
    this.loading = true;
    this.roleId = Number(decryption(this._storageService.getLocalStorageData('role')))
    let obj = {
      userId: this.userId,
      roleId: this.roleId
    }
    this._authService.getTherapistProfile(obj).subscribe((res) => {
      if (res) {
        if (res.statusCode === HttpStatusCode.Ok) {
          this.therapyList = res.responseData
          this.chatUser = res.responseData
          this.openChat(this.chatUser)
        } else {
          // this.__tosterService.error('Error');
        }
      }
      this.loading = false;
    });
  }

  // View Therapist Profile Modal
  viewtherapistProfile() {
    // const dialog_ref = this.dialog.open(ViewTherapistProfileComponent, {
    //   panelClass: ['view_therapist_profile', 'common_modal'],
    // })
  };

  // getPatientDataById() {

  //   this._profileService.getPatientDataById(this.userId).subscribe((res: any) => {
  //     debugger
  //     if (res) {
  //       this.patientId = res.responseData.patientId;
  //       this.therapistId = res.responseData.therapistId;
  //     }
  //     else {

  //     }

  //   })
  // }


  onSubmitSlotBook() {
    debugger
    if (this.slotBookingObj.length <= 0) { return }
    this._therapistService.slotScheduling(this.slotBookingObj).subscribe((res: any) => {
      if (res.status == 200) {
        this.__tosterService.success("Slot Booked Successfully!");
        this.getAvailableSlot();
      } else {
        this.__tosterService.error(res.message)
      }
    })

  }

  openChat(user: any) {
    if (user == null || user == undefined) {
      this.chatUser.userId = this.therapistUserId; // for development
    }
    if (user?.firstName == 'No Item found') {
      return;
    }
    this.welcometab = false;
    this.countnotification = true;
    this.users.forEach((item: any) => {
      item['isActive'] = false;
    });

    user['isActive'] = true;
    this.chatUser = user;

    this.connectedUsers.forEach((element: any) => {
      if (element.userId == user.userId) {
        this.chatUser.isOnline = true;
      }
    });

    this.displayMessages = this.messages.filter(
      (x) =>
        (x.receiver == this.chatUser.userId ||
          x.sender == this.chatUser.userId) &&
        (x.receiver == this.userId || x.sender == this.userId)
    );
    user.notifyCount = 0;

    this.hubConnection
      .invoke('UpdateNotificationToUser', this.userId.toString(), this.chatUser.userId.toString())
      .then(() => {

        this.messages.push('Msg Deleted Successfully');
      })
      .catch((err) => console.error(err));
  }
  changePlan() {
    // const dialog_ref = this.dialog.open(ChangePlanComponent, {
    //   panelClass: ['change_plan', 'common_modal'],
    // })
  };

  cancelTimeSlot() {
    this.selectedAvailability = ""
  }

  selectedSlot(event: any) {
    if (event.checked) {
      let pushData = {} as SlotBookingModel;
      pushData.SlotDate = this.dateSelected
      pushData.PatientId = this.patientId
      pushData.SlotTimeId = event.source.value
      pushData.TherapistId = this.therapistId
      pushData.CreatedBy = this.userId

      this.slotBookingObj.push(pushData)
    } else {
      this.slotBookingObj = this.slotBookingObj.filter(x => x.SlotTimeId != event.source.value);
    }
  }

  GetClosestAppointment(patientId: number)
  {
    this._profileService.getClosestAppointment(patientId).subscribe((res: any) => {
      if (res != null) 
      {
        if(res.responseData != null)
        {
          this.closestAppointmentData = res.responseData;
        }
      }
    });
  }

  logout() {
    this._storageService.logout();
    this._router.navigate(['/login'])
  }
  createInitialsImage1(firstName: string, lastName: string): string {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    var context: any
     context = canvas.getContext('2d');

    // Draw circular background
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    context.fillStyle = '#bfcfdf'; // Change color as needed
    context.fill();
    context.closePath();

    // Draw initials text
    context.font = '24px Arial';
    context.fillStyle = '#ffffff'; // Change color as needed
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, canvas.width / 2, canvas.height / 2);

    // Convert canvas to data URI
    const dataURI = canvas.toDataURL('image/png');

    return dataURI;
}
  createInitialsImage(firstName: string, lastName: string): string {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    var context: any
    context = canvas.getContext('2d');
    context.fillStyle = '#bfcfdf';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials, canvas.width / 2, canvas.height / 2);

    const dataURI = canvas.toDataURL('image/png');

    return dataURI;
  }
}

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
