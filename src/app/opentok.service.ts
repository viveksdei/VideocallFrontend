import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { CallInitModel } from './shared/call-ringer/Callmodel';
import utf8 from "utf8";
import base64 from "base-64";
@Injectable({
  providedIn: 'root'
})
export class OpentokService {

  session !: OT.Session;
  token !: string;

  constructor() { }

  getOT() {
    return OT;
  }

  initSession(config: any) {
    if (config.API_KEY && config.TOKEN && config.SESSION_ID) {
      this.session = this.getOT().initSession(config.API_KEY, config.SESSION_ID);
      this.token = config.TOKEN;
      return Promise.resolve(this.session);
    } else {
      return fetch('https://api.opentok.com' + '/session')
        .then((data) => data.json())
        .then((json) => {

          this.session = this.getOT().initSession(json.apiKey, json.sessionId);
          this.token = json.token;
          return this.session;
        });
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.session.connect(this.token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }

  encryptValue(value: any, isEncrypt: boolean = true): any {
    let response: any;
    if (value != null && value != "") {
      let pwd = "HCPRODUCT#!_2018@";
      let bytes: any;
      if (isEncrypt) {
        bytes = utf8.encode(value.toString());
        response = base64.encode(bytes);
        //response = CryptoJS.AES.encrypt(JSON.stringify(value), pwd);
      } else {
        bytes = base64.decode(value);
        response = utf8.decode(bytes);
        // const bytes = CryptoJS.AES.decrypt(value, pwd);
        // if (bytes.toString()) {
        //   response= JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // }
        //      response = CryptoJS.AES.decrypt(value, pwd);//.toString(CryptoJS.enc.Utf8);
      }
    }
    return response;
  }

  public currentLoginUserInfoSubject = new BehaviorSubject<any>(null);
  public currentLoginUserInfo = this.currentLoginUserInfoSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  // private callSubject = new BehaviorSubject<CallInitModel>({} as CallInitModel);
  // public call = this.callSubject.asObservable().pipe(distinctUntilChanged());
  // public CheckCallStarted(callInitModel: CallInitModel) {
  //   this.callSubject.next(callInitModel);
  // }
  private callSubject = new BehaviorSubject<CallInitModel>({} as CallInitModel);
  public call = this.callSubject.asObservable().pipe(distinctUntilChanged());

  public CheckCallStarted(callInitModel: CallInitModel) {
    this.callSubject.next(callInitModel);
  }


  private videoSessionStartedSubject = new BehaviorSubject<any>({IsStarted: false,});
  public videoSessionStarted = this.videoSessionStartedSubject.asObservable().pipe(distinctUntilChanged());
  videoSession(isStarted: boolean) {
    if (!isStarted) localStorage.removeItem("otSession");
    this.videoSessionStartedSubject.next({ IsStarted: isStarted });
  }



  public newSelectedScreenSizeSubject = new BehaviorSubject<any>(null);
  public newSelectedScreenSize = this.newSelectedScreenSizeSubject
    .asObservable().pipe(distinctUntilChanged());

  public newSelectedVideoPositionSubject = new BehaviorSubject<any>(null);
  public newSelectedVideoPosition = this.newSelectedVideoPositionSubject
    .asObservable().pipe(distinctUntilChanged());

 

}

