import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  ApiUrl = environment.SK_API;

  constructor(private http: HttpClient) { }

  getUserByUserId(id: any): Observable<any> {
    return this.http.get(`${this.ApiUrl}Users/GetUserByUserId?Id=${id}`)
      .pipe(
        catchError(this.handleError('Get User Profile', []))
      );
  }
  getAllUser(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Users/GetAllUsers?`)
      .pipe(
        catchError(this.handleError('Get All User', []))
      );
  }
  getAllAssignedPatients(userId: any): Observable<any> {
    return this.http.get(`${this.ApiUrl}Therapist/GetAssignedPatientsById?userId=` + userId)
      .pipe(
        catchError(this.handleError('Get All User', []))
      );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
