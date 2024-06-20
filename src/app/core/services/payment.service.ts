import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  ApiUrl=environment.SK_API;
  constructor(private http:HttpClient) { }

  CreateStripePayment(data:any){
    return this.http.post<any>(`${this.ApiUrl}Payment/CreateStripeSession`,data)
        .pipe(catchError(this.handleError('Error while getting data', [])));
  }
  UpdatePaymentStatus(data:any){
    return this.http.post<any>(`${this.ApiUrl}Payment/UpdatePaymentStatus`,data)
        .pipe(catchError(this.handleError('Error while getting data', [])));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
