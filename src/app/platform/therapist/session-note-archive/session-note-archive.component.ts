import { Component } from '@angular/core';
import { SOAPService } from '../../Services/soap.service';
import { StorageService } from '../../../core/services/storage.service';
import { decryption } from '../../shared/encryptionFun';
import { TherapistServiceService } from '../../Services/therapist-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ChatServiceService } from '../../Services/chat-service.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-session-note-archive',
  templateUrl: './session-note-archive.component.html',
  styleUrl: './session-note-archive.component.scss'
})
export class SessionNoteArchiveComponent {

  session: string = "assets/img/session.svg";
  calender: string = "assets/img/calender.svg";
  clock: string = "assets/img/clock.svg";
  sessionbtn: string = "assets/img/right_btn.svg";
  profileImage: string = "assets/img/profile_img.png";
  prev_btn: string = "assets/img/sessionbtn_prev.svg";
  next_btn: string = "assets/img/sessionbtn_next.svg";
  issession = false
  soapData: any = []
  dapData: any = []
  sessionGrp: any
  formattedDate: any;
  selectedGrpV: any
  sppiner = false
  userId: any;
  index: any
  counselingCount: any = 0
  roleId: number = 0;
  patientID: any;
  therapistId: any;
  activeUser: any;
  closestAppointmentData: any;
  isUserActive: boolean = false;
  relation: any;
  Dp: any;
  safeDp: any;
  activeUserId: any;

  constructor(private _location: Location,private _chat:ChatServiceService,
    private _route:Router,private sanitizer: DomSanitizer, private soapService: SOAPService, private _storage: StorageService, private _therapist: TherapistServiceService) {
  }
  ngOnInit(): void {
    this.sppiner = true;
    this.userId = decryption(this._storage.getLocalStorageData('userId'))
    let patientId = decryption(this._storage.getLocalStorageData('previousSessionId'))
    if (patientId) {
      this.soapService.getSOAPByPatientId(patientId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.sppiner = false

          this.grpData(res.responseData.soapNotesDtos, res.responseData.dAPNotesDtos);
        }
        else {
          this.sppiner = false

          this.soapData = []
          this.dapData = []
        }
      })
    }
      this.activeUserId = Number(decryption(this._storage.getLocalStorageData('activeUser')));
      this.getChatUserDetailsById(this.activeUserId)
  }

  grpData(soapData: any, dapData: any) {
    this.sessionGrp = [];
    const mergedData = [...soapData, ...dapData];

    mergedData.sort((a, b) => {
      return a.createdDate.localeCompare(b.createdDate);
    });

    const groupedData = mergedData.reduce((acc, item) => {
      const dateString = item.createdDate;

      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(item);
      return acc;
    }, {});

    this.sessionGrp = Object.keys(groupedData).map(key => {
      return {
        createdDate: this.formatDate(new Date(key)),
        items: groupedData[key]
      };
    });

    this.counselingCount = this.sessionGrp.length
    this.sessionGrp.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);

      return dateB.getTime() - dateA.getTime();
    });
    this.selectedGrp(this.sessionGrp[0], 1)
  }



  private formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }


  selectedGrp(item, session) {
    this.selectedGrpV = [];
    let obj = {
      date: item.createdDate,
      session: 'Session ' + session
    }
    this.selectedGrpV = obj;
    this.GetData(item.createdDate)
  }

  GetData(date) {
    this.soapData = []
    this.dapData = []
    let DataPerDate = this.sessionGrp.filter(x => x.createdDate == date)
    DataPerDate.forEach(element => {
      let soaps = element.items.filter(obj => obj.hasOwnProperty('soapNoteId'));
      let dap = element.items.filter(obj => obj.hasOwnProperty('dapNoteId'));
      if (soaps) {
        this.soapData.push(soaps)
      }
      if (dap) {
        this.dapData.push(dap)
      }
    });

  }
  prevRecord() {
    this.index--;
    if (this.index >= 0) {
      this.selectedGrp(this.sessionGrp[this.index], this.index + 1)
    }
    else {
      this.index = 0;
    }

  }
  nextRecord() {
    this.index++
    if (this.index < this.sessionGrp.length) {
      this.selectedGrp(this.sessionGrp[this.index], this.index + 1)
    }
    else {
      this.index = this.sessionGrp.length - 1
    }


  }

  getUserDetailsById() {
    debugger
    let obj = {
      userId: this.userId,
      roleId: this.roleId,
    }
    this.soapService.GetUserDetailsById(obj).subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (this.roleId == 2) {
          this.therapistId = res.responseData.therapistId;
        } else {
          this.patientID = res.responseData.patientId;
          this.therapistId = res.responseData.therapistId;
        }
        this.getSoapPreviousDetails()
      }

    })

  }
  getSoapPreviousDetails() {
    debugger
    this.soapService.getSOAPByPatientId(this.patientID).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.index = 0;
        this.grpData(res.responseData.soapNotesDtos, res.responseData.dAPNotesDtos);
      }
      else {

        this.soapData = []
        this.dapData = []
      }
    })
  }
  GetClosestAppointment(userId: any) {
    this._therapist.getBookingForDashboardByTherapistId(userId).subscribe((res: any) => {
      if (res != null) {
        if (res.responseData != null) {
          this.closestAppointmentData = res.responseData;
        }
      }
    });
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
  backTo() {
    this._route.navigate(['/platform/therapist/chat']);
    }
    getChatUserDetailsById(activeUserId: any) {
      this._chat.getChatUserDetails(activeUserId).subscribe(
        (user: any) => {
          console.log("active-------", user.data);
          this.activeUser = user.data;
          this.profileImage = this.createImgPath(this.activeUser.profileImage);
          this.Dp = this.createInitialsImage1(this.activeUser.firstName, this.activeUser.lastName);
          this.safeDp = this.sanitizer.bypassSecurityTrustResourceUrl(this.Dp);  
          this.relation = user.data.religionType.trim();
          this.isUserActive = !!this.activeUser;
        });
    }
    createImgPath = (serverPath: string) => {
      var path = `${environment.imageUrl}/${serverPath}`;
      return path;
    };
}
