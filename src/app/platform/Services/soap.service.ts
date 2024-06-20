import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { urlConstant } from '../../platform/shared/constants/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class SOAPService {
  ApiUrl=environment.SK_API;
  constructor(private http:HttpClient) { }

  debugger
  addEditSoap(data:any) : Observable<any>{
    return this.http.post(this.ApiUrl+urlConstant.addEditSoap,data)
    .pipe(
      catchError(this.handleError('Add or update Soap', []))
    );
  }

  addEditDap(data:any) : Observable<any>{
    return this.http.post(this.ApiUrl+urlConstant.addEditDap,data)
    .pipe(
      catchError(this.handleError('Add or update Dap', []))
    );
  }

  getSOAPByPatientId(PatientId:any) : Observable<any>{
    return this.http.get(this.ApiUrl+urlConstant.getSOAP +"?patientId=" +PatientId)
    .pipe(
      catchError(this.handleError('Get SOAP DAP', []))
    );
  }
  GetUserDetailsById(data:any) : Observable<any>{
    return this.http.post(this.ApiUrl+urlConstant.getUserData,data)
    .pipe(
      catchError(this.handleError('Get SOAP DAP', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
