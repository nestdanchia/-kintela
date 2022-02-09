import { ParameterService } from '../shared/parameter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Concurso } from '../ofertas/models/concurso';

@Injectable()
export class ConcursosService {
  get urlWebAPI(): string {
    return this.parameterService.urlWebAPI
  }


  constructor(private http: HttpClient, private parameterService: ParameterService) { }

  getConcursosSinTratar(): Observable<Concurso[]> {
    return this.http.get<Concurso[]>(`${this.urlWebAPI}/concursos/sintratar`)
      .pipe(
        tap(//data=>console.log('OfertasService-getOrganismos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getConcursos(): Observable<Concurso[]> {
    return this.http.get<Concurso[]>(`${this.urlWebAPI}/concursos`)
      .pipe(
        tap(//data=>console.log('ConcursosService-getConcursos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getConcursoByOferta(ofertaId:string): Observable<Concurso> {
    return this.http.get<Concurso>(`${this.urlWebAPI}/concursos/oferta/${ofertaId}`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  getConcursosEstudiar(estudiar: string): Observable<Concurso[]> {
    return this.http.get<Concurso[]>(`${this.urlWebAPI}/concursos/estudiar/${estudiar}`)
      .pipe(
        tap(//data=>console.log('OfertasService-getOrganismos(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  updateConcursosAEstudiar(concursos: Concurso[]): Observable<number> {
    return this.http.put<number>(`${this.urlWebAPI}/concursos/estudiar`, concursos)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  putConcurso(concurso: Concurso): Observable<number> {
    return this.http.put<number>(`${this.urlWebAPI}/concursos/estudiar`, concurso)
      .pipe(
        tap(//data => console.log('ConcursosService-updateConcursosAEstudiar(): ', data)
        ),
        catchError(this.handleError)
      )
  }

  putConcursoById(id:number,concurso: Concurso) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

    return this.http.put<any>(`${this.urlWebAPI}/concursos/${id}`, concurso, config)
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


