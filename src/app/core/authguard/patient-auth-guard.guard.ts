import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services';
import { StorageService } from '../services/storage.service';
import { decryption } from '../../platform/shared/encryptionFun';
import { JwtHelpersService } from '../services/jwt-helpers.service';

@Injectable({
  providedIn: 'root',

})

export class patientAuthGuardGuard implements CanActivate {
  constructor(private service: CommonService, private __jwtService: JwtHelpersService, private router: Router, private _storageService: StorageService,) { }
  data: any;
  role: any;
  canActivate(): boolean {
    this.data = this._storageService.getLocalStorageData('token');
    const tokenData = this.__jwtService.decodeToken(this.data);
    this.role = this._storageService.getLocalStorageData('role')
    console.log("CurrentTokenData", decryption(this.role))
    console.log("DeCodedToken", tokenData)
    if (tokenData) {
      if (tokenData.roleId == '3') {
        return true;
      }
      this.router.navigate(['/platform/main'])
    }
    return false;
  }
}



// if(roleId == '1'){