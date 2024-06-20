import { Inject, Injectable } from '@angular/core';
// import { LocalStorage } from '../../local-storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly key = 'access_token';
  private readonly userType = 'user_type';
  private readonly organizationId = 'organization_id';

  // constructor( @Inject(LocalStorage) private localStorage) { }


  // Set storage services
  setAccessToken = (accessToken: string): void => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(this.key, accessToken);
  };

  setUserSession(data: any) {
    if (data == null) {
      localStorage.clear();
    } else {
      if (typeof localStorage !== 'undefined')
        localStorage.setItem('user', JSON.stringify(data));
    }
  }

  setLocalStorageData(type: string, data: any) {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(type, data);
  }
  getLocalStorageData(type: string) {
    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(type);
    return '';
  }

  setUserType = (userType: any): void => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(this.userType, userType);
  };
  setOrganizationId = (organizationId: any): void => {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(this.organizationId, organizationId);
  };



  // get storage service
  getAccessToken = (): string | null => {
    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(this.key);
    return null;
  };
  getUserType = (): any | null => {
    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(this.userType);
    return null;
  };

  getorganizationId = (): any | null => {
    if (typeof localStorage !== 'undefined')
      return localStorage.getItem(this.organizationId);
    return null
  };

  logout() {
    localStorage.clear()
    sessionStorage.clear()
  }
}
