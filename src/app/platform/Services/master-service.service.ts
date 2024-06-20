import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'  
})
export class MasterServiceService {
  ApiUrl = environment.SK_API;
  constructor(private http: HttpClient) { }

  getAllReligion(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/GetAllReligionMaster`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }
  
  getAllIssue(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/GetAllIssueMaster`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }

  getAllGender(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/GetAllGenderMaster`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getCountryMaster(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/GetCountryMaster`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }

  getTimeZoneMaster(): Observable<any> {
    return this.http.get(`${this.ApiUrl}Master/GetTimezoneMaster`)
      .pipe(
        catchError(this.handleError('Get All Time', []))
      );
  }


}
