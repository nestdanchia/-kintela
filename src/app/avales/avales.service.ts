import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Aval } from "../models/aval";
import { Avalista } from "../models/avalista";
import { EstadoAval } from "../models/estadoAval";
import { TipoAval } from "../models/tipoAval";
import { ParameterService } from "../shared/parameter.service";

@Injectable()
export class AvalesService {
  get urlWebAPI(): string {
    return this.parameterService.urlWebAPI
  }
  constructor(private http: HttpClient, private parameterService: ParameterService) { }

  getAvales(): Observable<Aval[]> {
    return this.http.get<Aval[]>(`${this.urlWebAPI}/avales`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getAvalesByOferta(descripcion: string): Observable<Aval[]> {
    return this.http.get<Aval[]>(`${this.urlWebAPI}/avales/ofertas/${descripcion}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertasByYear(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getTipoAvales(): Observable<TipoAval[]> {
    return this.http.get<TipoAval[]>(`${this.urlWebAPI}/tipoavales`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getEstadoAvales(): Observable<EstadoAval[]> {
    return this.http.get<EstadoAval[]>(`${this.urlWebAPI}/estadoavales`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getAvalistas(): Observable<Avalista[]> {
    return this.http.get<Avalista[]>(`${this.urlWebAPI}/avalistas`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  postAval(aval: Aval) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.post<any>(`${this.urlWebAPI}/avales`, aval, config)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  putAval(id:string,aval: Aval) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.put<any>(`${this.urlWebAPI}/avales/${id}`, aval, config)
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

    //console.error(err);

    //return throwError(errorMessage);
    return throwError(err);
  }

}

