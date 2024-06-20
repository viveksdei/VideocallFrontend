import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SOAPService } from '../../Services/soap.service';
import { Pipe, PipeTransform } from '@angular/core';
import { decryption } from '../../shared/encryptionFun';
import { StorageService } from '../../../core/services/storage.service';
import { TherapistServiceService } from '../../Services/therapist-service.service';

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
  selector: 'app-previous-session-note',
  templateUrl: './previous-session-note.component.html',
  styleUrl: './previous-session-note.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PreviousSessionNoteComponent implements OnInit {
  session: string = "assets/img/session.svg";
  calender: string = "assets/img/calender.svg";
  clock: string = "assets/img/clock.svg";
  sessionbtn: string = "assets/img/right_btn.svg";
  issession = false
  soapData: any = []
  dapData: any = []
  sessionGrp: any
  formattedDate: any;
  selectedGrpV: any
  sppiner = false
  userId: any;
  constructor(private soapService: SOAPService, private _storage: StorageService, private _therapist: TherapistServiceService) {
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

    this.sessionGrp.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);

      return dateB.getTime() - dateA.getTime();
    });

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

}




