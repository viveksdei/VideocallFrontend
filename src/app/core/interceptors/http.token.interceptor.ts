import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if sessionStorage is available
    if (typeof sessionStorage !== 'undefined') {
      const authToken = sessionStorage.getItem('access_token');
      if (authToken) {
        // Clone the request and attach the token
        const authReq = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + authToken
          }
        });
        return next.handle(authReq).pipe(
          catchError(error => {
            // Handle error, e.g., unauthorized access
            if (error.status === 401) {
              // Redirect to login page or perform any other action
              this.router.navigate(['/login']);
            }
            throw error;
          })
        );
      }
    }

    return next.handle(req);
  }
}
