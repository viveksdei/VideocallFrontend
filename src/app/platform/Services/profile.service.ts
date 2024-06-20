import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  ApiUrl = environment.SK_API;
  constructor(private http: HttpClient) { }

  GetSubscriptionPlanDetailsById(id: any): Observable<any> {
    return this.http.get(`${this.ApiUrl}Profile/GetSubscriptionPlanDetailsById?Id=${id}`)
      .pipe(
        catchError(this.handleError('Get User Profile', []))
      );
  }
  GetAllSubscriptionPlanDetailsForUser(data: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Profile/GetAllSubscriptionPlanDetailsForUser`, data)
      .pipe(
        catchError(this.handleError('Get User Profile', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
  getPatientDataById(id: number) {
    return this.http.get(this.ApiUrl + 'Patient/GetPateintById?Id=' + id).pipe(
      catchError(this.handleError('Get Patient Details', []))
    );
  }

  getClosestAppointment(id: number) {
    return this.http.get(this.ApiUrl + 'Patient/GetClosestAppointmentPatientId?Id=' + id).pipe(
      catchError(this.handleError('Get Patient Closest Appointment', []))
    );
  }

  updateProfile(data: any) {
    return this.http.post(this.ApiUrl + 'Patient/PatientProfileUpdate', data);
  }
  getGenderInfo() {
    return this.http.get(this.ApiUrl + 'Master/GetAllGenderMaster')
  }
  getAllTherapist(Id: any) {
    return this.http.post(this.ApiUrl + 'Therapist/GetAllTherapist', Id)
  }
  getAllPatients() {
    return this.http.get(this.ApiUrl + 'Patient/GetAllPatients')
  }
  CallEnd(appt: any, userid: any) {
    debugger;
    // return this.http.get(this.ApiUrl + 'Patient/CallEnd')
    let params = {
      appointmentId: appt,
      userId: userid,
    };

    // Make the GET request with the params option
    return this.http.post(this.ApiUrl + 'Patient/CallEnd', params);
  }
  UpdateAppointmentStatus(data: any) {
    return this.http.post(this.ApiUrl + 'Patient/UpdateAppointmentStatusById', data).pipe(
      catchError(this.handleError('Get Patient Closest Appointment', []))
    );
  }
}

