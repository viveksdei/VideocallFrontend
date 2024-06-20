import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ApiUrl = environment.SK_API; //Access API path from environment.ts file;
  constructor(private http: HttpClient) { }

  /*service method is use for login --Author: Gaurav */
  loginService(loginDetails: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Auth/Login`, loginDetails).pipe(
      catchError(this.handleError('Log In', []))
    )
  }
  /*service method is use for SignUp --Author: Gaurav */
  SignUp(registrationPropOwner: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Patient/PatientRegistration`, registrationPropOwner).pipe(
      catchError(this.handleError('Sign Up', []))
    )
  }

  /*service method is use for SignUp therapist --Author: Gaurav */
  TherapistSignUp(signUpPropOwner: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Therapist/TherapistRegistration`, signUpPropOwner).pipe(
      catchError(this.handleError('Sign Up', []))
    )
  }
  /*service method is use for Uploade therapist related docs --Author: Gaurav */
  UploadProfileService(dataObj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Therapist/UploadDocs`, dataObj).pipe(
      catchError(this.handleError('Update Agency details Service', []))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
  changePassword(data: any) {
    return this.http.post(`${this.ApiUrl}Auth/ChangePassword`, data)
  }

  getTherapistProfile(obj: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Therapist/GetTherapistById`, obj).pipe(
      catchError(this.handleError('Error while getting data', []))
    )
  }

  forgotPassword(data: any) {
    return this.http.post(`${this.ApiUrl}Auth/ForgotPassword`, data)
  }
  sendOtp(data: any) {
    return this.http.post(`${this.ApiUrl}Auth/SendOtp`, data)
  }

  getmatchedTherapist(id: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Therapist/GetmatchedTherapist`, id).pipe(
      catchError(this.handleError('Error while getting data', []))
    )
  }

  checkUniqueEmail(Email: any): Observable<any> {
    return this.http.post(`${this.ApiUrl}Patient/CheckUserExistorNot`, Email).pipe(
      catchError(this.handleError('check unique email', []))
    )
  }
}
