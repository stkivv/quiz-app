import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, switchMap } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private backendService: BackendService) { }

  private isRefreshing = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (req.url == environment.apiUrl + "auth/register" ||
          req.url == environment.apiUrl + "csrf") throw error;

        if (error.status === 403 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.backendService.doPost("auth/refresh", {}, "text").pipe(
            switchMap(() => {
              console.log("Token refreshed successfully");
              this.isRefreshing = false;
              return next.handle(req);
            }),
            catchError(err => {
              console.log("Error refreshing token");
              this.isRefreshing = false;
              throw err;
            })
          );
        } else if (error.status === 403 && this.isRefreshing) {
          this.router.navigate(['login']);
          throw error;
        }
        throw error;
      })
    );
  }

}
