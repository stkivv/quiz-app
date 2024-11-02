import { Injectable } from "@angular/core";
import { BackendService } from "./backend.service";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private backendService: BackendService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.backendService.doPost("auth/refresh", {}).pipe(
            switchMap(() => next.handle(req)) // Retry original request after token refresh
          );
        }
        return throwError(() => error);
      })
    );
  }
}
