import { Invitacion } from './../models/invitacion';
import { ParameterService } from './../shared/parameter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class InvitacionesService{
  get urlWebAPI(): string {
    return this.parameterService.urlWebAPI
  }

  constructor (private http:HttpClient, private parameterService:ParameterService){}

  getInvitaciones(): Observable<Invitacion[]> {
    return this.http.get<Invitacion[]>(`${this.urlWebAPI}/invitaciones`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getInvitacionByOferta(ofertaId:string): Observable<Invitacion> {
    return this.http.get<Invitacion>(`${this.urlWebAPI}/invitaciones/oferta/${ofertaId}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  postInvitacion(invitacion: Invitacion) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.post<any>(`${this.urlWebAPI}/ofertas/insertarinvitacion`, invitacion, config)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  putInvitacion(id:number,invitacion: Invitacion) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.put<any>(`${this.urlWebAPI}/invitaciones/${id}`, invitacion, config)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  private handleError(err: any) {
    //En el mundo real podriamos usar una infraestructura de logging remota en vez de logear simplemente en la consola
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      //se trata de un error del lado cliente o de red
      errorMessage = `Ha ocurrido un error: ${err.status}`
    } else {
      //El servidor devolvio un codigo de respuesta insatisfactorio
      errorMessage = `El servidor devolvió un código de error ${err.status}`
    };

    console.error(err);
    return throwError(errorMessage);
  }

}
