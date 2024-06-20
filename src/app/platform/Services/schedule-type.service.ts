import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { urlConstant } from '../shared/constants/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class ScheduleTypeService {
  ApiUrl = environment.SK_API;
  constructor(private http: HttpClient) { }

  addEditScheduleType(data: any): Observable<any> {
    return this.http.post(this.ApiUrl + urlConstant.addEditScheduleType, data)
      .pipe(
        catchError(this.handleError('Add or update Schedule Type', []))
      );
  }
  deleteScheduleTypeById(data: any): Observable<any> {
    return this.http.post(this.ApiUrl + urlConstant.deleteScheduleTypeById, data)
      .pipe(
        catchError(this.handleError('Delete Schedule Type', []))
      );
  }
  getAllScheduleType(id: any): Observable<any> {
    return this.http.get(this.ApiUrl + urlConstant.getAllScheduleType + "?id=" + id)
      .pipe(
        catchError(this.handleError('Delete Schedule Type', []))
      );
  }
  UpdateActiveScheduleType(data: any): Observable<any> {
    return this.http.post(this.ApiUrl + urlConstant.updateActiveScheduleType, data)
      .pipe(
        catchError(this.handleError('Delete Schedule Type', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
