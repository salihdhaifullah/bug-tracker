import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class BearerService implements HttpInterceptor {

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const isUserFound = sessionStorage.getItem('user');
    const token: String  = isUserFound ? JSON.parse(isUserFound).token : '';

    if (token !== '') {
      request = request.clone({
        setHeaders: {
          Authorization: `bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}