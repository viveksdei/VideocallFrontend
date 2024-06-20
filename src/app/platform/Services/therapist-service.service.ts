import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TherapistServiceService {
  ApiUrl = environment.SK_API;
  constructor(private http: HttpClient) { }

  getTherapistAvailabilityById(obj: any) {
    return this.http.post<any>(`${this.ApiUrl}Therapist/GetTherapistAvailabilityById`, obj)
      .pipe(catchError(this.handleError('Error while getting data', [])));
  }

  slotScheduling(data: any) {
    //return this.http.post('http://localhost:31321/api/Patient/PatientSessionSlotBooking',data);
    return this.http.post(`${this.ApiUrl}Patient/PatientSessionSlotBooking`, data);
  }


  getAllTime(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Therapist/GetAllTime?`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }

  addOrUpdateTherapistAvailability(model: any) {
    return this.http.post<any>(`${this.ApiUrl}Therapist/AddOrUpdateTherapistAvailability`, model)
      .pipe(catchError(this.handleError('Error while getting data', [])));
  }

  getAvailabilityTimeForTherapist(id: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Therapist/getAvailabilityTimeForTherapist`, id)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }


  getTherapistDataById(id: any) {
    return this.http.post(`${this.ApiUrl}Therapist/GetTherapistById`, id);
  }
  getPatientDataById(id: any) {
    return this.http.post(`${this.ApiUrl}Patient/GetPatientDetailsByID`, id);
  }
  getTherapistAvailCount(id: any) {
    return this.http.post(`${this.ApiUrl}Therapist/GetTherapistAvailablityCount`, id);
  }
  getPatientDataCount(id: any) {
    return this.http.post(`${this.ApiUrl}Therapist/GetPatientCountForTherapist`, id);
  }

  updateTherapistProfile(data: any) {
    return this.http.post(`${this.ApiUrl}Therapist/UpdateTherapistProfile`, data);
  }
  updateTherapistDocsStatus(data: any) {
    return this.http.post(`${this.ApiUrl}Therapist/UpdateTherapistDocs`, data);
  }

  UpdatePatientStatus(data: any) {
    return this.http.post(`${this.ApiUrl}Therapist/UpdatePatientStatus`, data).pipe(catchError(this.handleError('Error while putting data', [])));;
  }


  updateTherapistStatus(data:any)
  {
    return this.http.post(`${this.ApiUrl}Therapist/UpdateTherapistStatus`,data);
  }

  getTherapistBookingSlotsById(id:any) : Observable<any>{
    return this.http.get(`${this.ApiUrl}Therapist/GetTherapistBookingSlotsById?therapistId=`+id)
    .pipe(
      catchError(this.handleError('Get All Time', []))
      );
    }

    ConfirmTherapistSession(slotId:any)
    {
      return this.http.post(`${this.ApiUrl}Therapist/ConfirmSession`,slotId);
    }
getPatientAppointmentbyId(id:any,userId:any) : Observable<any>{
      return this.http.get(`${this.ApiUrl}Patient/GetPatientAppointmentSlotById?Id=${id}&userId=${userId}`)
        .pipe(
          catchError(this.handleError('Get All Time', []))
          );
        }

    getBookingForDashboardByTherapistId(id:any) : Observable<any>{
      return this.http.get(`${this.ApiUrl}Therapist/GetBookingForDashboardByTherapistId?Id=${id}`)
        .pipe(
          catchError(this.handleError('Get Close Appointment', []))
          );
        }

    getPreviousPatientByTherapistId(id:any) : Observable<any>{
      return this.http.get(`${this.ApiUrl}Therapist/GetPreviousPatientByTherapistId?Id=${id}`)
        .pipe(
          catchError(this.handleError('Get Previous Patient', []))
          );
        }

    getTherapistAvailabilityForDashboard(id:any) : Observable<any>{
      return this.http.get(`${this.ApiUrl}Therapist/GetTherapistAvailabilityForDashboard?Id=${id}`)
        .pipe(
          catchError(this.handleError('Get Availability All', []))
          );
        }

  GettokenById(data:any)
    {
          return this.http.post(`${this.ApiUrl}Therapist/GetTokenbyPatientTherapistId`,data);
    }
}
