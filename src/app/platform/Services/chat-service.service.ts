import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../core/modals/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { message } from '../../core/modals/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { Observable, Subject, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  ApiUrl = environment.SK_API;

  private usersUrl = environment.SK_API + '/api/'
  private allUser = environment.SK_API + '/api/Message/ChatExisted'

  userStatus = new Subject()
  constructor(private http: HttpClient) { }

  getUserReceivedMessages(id: any) {
    return this.http.get(this.ApiUrl + 'Chat/GetAllMessageByUser?userid=' + id);
  }
  getUserChatExisted(UserId: any): Observable<any> {
    return this.http.get(`${this.ApiUrl}Chat/ChatExisted?UserId=${UserId}`)
      .pipe(
        catchError(this.handleError('Get All User', []))
      );
  }


  /* getUserChatExisted(UserId : any){
    return this.http.get(`${this.allUser}${'?UserId=' + UserId}`)
    .pipe(
      catchError(this.handleError('Get All User', []))
    );
  } */
  deleteMessage(message: any) {
    return this.http.post(this.usersUrl + '/message', message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  getChatUserDetails(UserId: any): Observable<any> {
    console.log('UserDetailsUserID', UserId)
    return this.http.get(`${this.ApiUrl}Chat/GetChatUserDetails?UserId=${UserId}`)
      .pipe(
        catchError(this.handleError('Get All User', []))
      );
  }
}
