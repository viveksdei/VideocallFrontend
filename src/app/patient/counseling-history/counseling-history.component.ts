import { Component, OnInit } from '@angular/core';
import { SOAPService } from '../../platform/Services/soap.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { decryption } from '../../platform/shared/encryptionFun';
import { StorageService } from '../../core/services/storage.service';

@Pipe({
  name: 'removeParagraphTags'
})
export class RemoveParagraphTagsPipe implements PipeTransform {
  transform(value: string): string {
    if (value != null) {
      if (value.startsWith('<p>') && value.endsWith('</p>')) {
        return value.slice(3, -4);
      }
      return value;
    }
    return '';
  }
}
@Component({
  selector: 'app-counseling-history',
  templateUrl: './counseling-history.component.html',
  styleUrl: './counseling-history.component.scss'
})
export class CounselingHistoryComponent implements OnInit {
  session: string = "assets/img/session.svg";
  calender: string = "assets/img/calender.svg";
  clock: string = "assets/img/clock.svg";
  sessionbtn: string = "assets/img/right_btn.svg";
  prev_btn: string = "assets/img/sessionbtn_prev.svg";
  next_btn: string = "assets/img/sessionbtn_next.svg";
  profile_img: string = "assets/img/profile_img.png";
  soapData: any = []
  dapData: any = []
  sessionGrp: any
  formattedDate: any;
  selectedGrpV: any
  index: any
  counselingCount:any=0
  userId: number=0;
  roleId: number=0;
  patientID: any;
  therapistId: any;
  constructor(private soapService: SOAPService,private _storageService:StorageService,    private router: Router) { }
  ngOnInit(): void {
    this.userId = Number(decryption(this._storageService.getLocalStorageData('userId')))
    this.roleId = Number(decryption(this._storageService.getLocalStorageData('role')))
    this.getUserDetailsById()
    
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

    this.counselingCount=this.sessionGrp.length
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
    debugger
    this.selectedGrpV = [];
    let obj = {
      date: item.createdDate,
      session: 'Counseling ' + session
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
    else{
      this.index=this.sessionGrp.length-1
    }


  }
  backtoDashboard(){
    this.router.navigate(["/patient/patient-dashboard"]);
  }
  getUserDetailsById() {
    debugger
    let obj = {
      userId: this.userId,
      roleId: this.roleId,
    }
    this.soapService.GetUserDetailsById(obj).subscribe((res: any) => {
      if(res.statusCode==200){
        if(this.roleId==2){
          this.therapistId=res.responseData.therapistId;
        }else{
          this.patientID=res.responseData.patientId;
          this.therapistId=res.responseData.therapistId;
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
}
