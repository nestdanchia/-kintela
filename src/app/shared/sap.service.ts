import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Proyecto } from "../models/proyecto";

@Injectable()
export class SAPService {
  urlSapApiWeb: string = `https://fysegplannerapi.azurewebsites.net/api`;

  constructor(private http: HttpClient) { }

  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.urlSapApiWeb}/proyectos`)
      .pipe(
        tap(//data => console.log('OfertasService-getOfertas(): ', data)
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
