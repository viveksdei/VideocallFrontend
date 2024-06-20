import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';


@Injectable({
  providedIn: 'root',

})

export class authGuard implements CanActivate {
  constructor(private service: CommonService, private router: Router, private _storageService: StorageService,) { }
  data: any;

  canActivate(): boolean {
    this.data = this._storageService.getLocalStorageData('token');
    
    if (this.data != null) {

      return true; 
    }

    this.router.navigate(['/login'])
    return false; 
  }

}