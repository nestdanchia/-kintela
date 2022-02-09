import { LicitacionesEnUte } from './models/licitacionesEnUte';
import { LicitacionesEnSolitario } from './models/licitacionesEnSolitario';
import { ParameterService } from '../shared/parameter.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map } from 'rxjs/operators';
import { Oferta } from './models/oferta';
import { Organismo } from './models/organismo';
import { Responsable } from './models/responsable';
import { TipoOferta } from './models/tipoOferta';
import { UTE } from '../models/ute';
import { Licitador } from '../models/licitador';

@Injectable()
export class OfertasService {
  get urlWebAPI(): string {
    return this.parameterService.urlWebAPI
  }


  constructor(private http: HttpClient, private parameterService: ParameterService) {

  }

  getOfertas(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas() la primera de todas: ', data[0])
        ),
        catchError(this.handleError)
      )
  }

  getOfertasIniciales(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas/iniciales`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }


  getOfertasUltima(): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.urlWebAPI}/ofertas/ultima`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getOfertasByYear(year: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas/year/${year}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertasByYear(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getOfertasByDescripcion(descripcion: string): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas/descripcion/${descripcion}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertasByYear(): ', data)
        ),
        catchError(this.handleError)
      )
  }


  getOfertasByOrganismo(organismoId: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas/organismo/${organismoId}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertasByOrganismo(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getOfertasByYears(years: number[]) {
    return this.http.post<Oferta[]>(`${this.urlWebAPI}/ofertas/years`, years)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertasByYears(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getInvitaciones(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.urlWebAPI}/ofertas/invitaciones`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }


  getResponsables(origen?:string): Observable<Responsable[]> {
    return this.http.get<Responsable[]>(`${this.urlWebAPI}/responsables`)
      .pipe(
        map(
          responsables =>
            responsables.map(responsable => ({
              ...responsable,
              nombreCompleto: [responsable.nombre] + ' ' + [responsable.apellido1] + ' ' + [responsable.apellido2]
            }) as Responsable
          )
        ),
        //tap(data => console.log(`getResponsables() desde ${origen}`, data)),
        catchError(this.handleError)
      )
  }

  getTiposOfertas(): Observable<TipoOferta[]> {
    return this.http.get<TipoOferta[]>(`${this.urlWebAPI}/tipoofertas`)
      .pipe(
        tap(data => console.log('OfertasService-getTipos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getOrganismos(): Observable<Organismo[]> {
    return this.http.get<Organismo[]>(`${this.urlWebAPI}/organismos`)
      .pipe(
        tap(//data=>console.log('OfertasService-getOrganismos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getOrganismoDeOferta(ofertaId: string): Observable<Organismo> {
    return this.http.get<Organismo>(`${this.urlWebAPI}/organismos/oferta/${ofertaId}`)
      .pipe(
        tap(//data=>console.log('OfertasService-getOrganismos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getLicitacionesEnSolitario(): Observable<LicitacionesEnSolitario[]> {
    return this.http.get<LicitacionesEnSolitario[]>(`${this.urlWebAPI}/licitacionesensolitario`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getLicitacionesEnUTE(): Observable<LicitacionesEnUte[]> {
    return this.http.get<LicitacionesEnUte[]>(`${this.urlWebAPI}/licitacionesenute`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getLicitadores(): Observable<Licitador[]> {
    return this.http.get<Licitador[]>(`${this.urlWebAPI}/licitadores`)
      .pipe(
        tap(//data => console.log('OfertasService-getLicitadores(): ', data)
        ),
        catchError(this.handleError)
      )
  }


  getUTEs(): Observable<UTE[]> {
    return this.http.get<UTE[]>(`${this.urlWebAPI}/utes`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getUTE(id:number):Observable<UTE> {
    return this.http.get<UTE>(`${this.urlWebAPI}/utes/${id}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  putOferta(id:string,oferta: Oferta) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.put<any>(`${this.urlWebAPI}/ofertas/${id}`, oferta, config)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }


  postOfertas(ofertas: Oferta[]) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.post<any>(`${this.urlWebAPI}/ofertas/insertar`, ofertas, config)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }



  postInvitacion(oferta:Oferta) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.post<any>(`${this.urlWebAPI}/ofertas/insertarinvitacion`, oferta, config)
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
