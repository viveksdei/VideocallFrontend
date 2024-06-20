// jwt.service.ts

import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtHelpersService {
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() {}

  decodeToken(token: string): any {
    try {
      // Decode the token
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRoleIdFromToken(token: string): string | null {
    const decodedToken = this.decodeToken(token);

    // Access a specific claim (for example, role)
    if (decodedToken && decodedToken['roleId']) {
      return decodedToken['roleId'];
    }

    return null;
  }
}
