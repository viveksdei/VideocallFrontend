import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { SOAPService } from '../../Services/soap.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TherapistServiceService } from '../../Services/therapist-service.service';
import { StorageService } from '../../../core/services/storage.service';
import { decryption } from '../../shared/encryptionFun';
@Component({
  selector: 'app-new-session-note',
  templateUrl: './new-session-note.component.html',
  styleUrl: './new-session-note.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NewSessionNoteComponent implements OnInit, OnDestroy {
  SoapForm !: FormGroup;
  SOAP_SubNote = '';
  SOAP_ObjNote = '';
  SOAP_AssessmentNote = '';
  SOAP_PlanNote = '';
  DAP_DataNote = '';
  DAP_AssNote = '';
  DAP_PlaNote = '';
  patientID = '';
  therapistID = '';
  abouteditor: Editor | any;
  objeditor: Editor | any;
  dapabouteditor: Editor | any;
  dapassessmenteditor: Editor | any;
  dapplaneditor: Editor | any;
  assessmenteditor: Editor | any;
  planeditor: Editor | any;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    ['link',],
  ];
  userId: any;
  soapData: any=[];
  dapData: any=[];
  sessionGrp:any;
  sessionNo:number=1;


  constructor(private soapService: SOAPService, private _storage: StorageService, private _fb: FormBuilder, private _toaster: ToastrService, private _therapist: TherapistServiceService) {

  }

  ngOnInit(): void {
    this.userId = decryption(this._storage.getLocalStorageData('userId'))
    this.abouteditor = new Editor();
    this.assessmenteditor = new Editor();
    this.planeditor = new Editor();
    this.objeditor = new Editor();
    this.dapabouteditor = new Editor();
    this.dapassessmenteditor = new Editor();
    this.dapplaneditor = new Editor();
    let patientId = decryption(this._storage.getLocalStorageData('previousSessionId'))
    if (patientId) {
      this.soapService.getSOAPByPatientId(patientId).subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.grpData(res.responseData.soapNotesDtos, res.responseData.dAPNotesDtos);
        }
        else {
          this.soapData = []
          this.dapData = []
        }
        this.sessionNo=(this.sessionGrp.length!=0)?(this.sessionGrp.length +1):1
      })
    }
    this.SoapForm = this._fb.group({

    })
    this.getTokenById()

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
  getTokenById() {
    let obj = {
      UserId: String(this.userId),
    }
    this._therapist.GettokenById(obj).subscribe((res: any) => {
      this.patientID = res.responseData.patientId,
        this.therapistID = res.responseData.therapistId
    })

  }

  ngOnDestroy(): void {
    this.abouteditor.destroy();
    this.assessmenteditor.destroy();
    this.planeditor.destroy();
  }

  onSubmit(type: string): void {
    if (type === 'DAP') {
      const DAP_dataset = {
        DapNoteId: 0,
        OrganizationId: 1,
        TherapistId: this.therapistID,
        PatientId: this.patientID,
        Data: this.DAP_DataNote,
        Assessment: this.DAP_AssNote,
        Plans: this.DAP_PlaNote,
      }
      this.soapService.addEditDap(DAP_dataset).subscribe(
        (res: any) => {
          // Swal.fire('Success', 'Dap note added/updated successfully.', 'success');
          this._toaster.success("Dap note added/updated successfully")

          this.resetForm();

        },
        (error: any) => {
          // Swal.fire('Error', 'Failed to add/update Dap note.', 'error');
          this._toaster.error("error")
        });
    }
    else {
      debugger
      const SOAP_dataset = {
        SoapNoteId: 0,
        OrganizationId: 1,
        TherapistId: this.therapistID,
        PatientId: this.patientID,
        Subjective: this.SOAP_SubNote,
        Objective: this.SOAP_ObjNote,
        Assessment: this.SOAP_AssessmentNote,
        Plans: this.SOAP_PlanNote,
      }
      this.soapService.addEditSoap(SOAP_dataset).subscribe(
        (res: any) => {
          // Swal.fire('Success', 'Soap note added/updated successfully.', 'success');
          this._toaster.success("Soap note added/updated successfully")

          this.resetForm();
        },
        (error: any) => {
          // Swal.fire('Error', 'Failed to add/update Soap note.', 'error');
          this._toaster.error("Error")
        });

    }
  }
  resetForm(): void {

    this.DAP_DataNote = '';
    this.DAP_AssNote = '';
    this.DAP_PlaNote = '';
    this.SOAP_SubNote = '';
    this.SOAP_ObjNote = '';
    this.SOAP_AssessmentNote = '';
    this.SOAP_PlanNote = '';
  }


}
