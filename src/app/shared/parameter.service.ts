import { Invitacion } from './../models/invitacion';
import { Avalista } from './../models/avalista';
import { EstadoAval } from './../models/estadoAval';
import { Aval } from './../models/aval';
import { TipoAval } from './../models/tipoAval';
import { Oferta } from '../ofertas/models/oferta';
import { Organismo } from '../ofertas/models/organismo';
import { Injectable } from "@angular/core";
import { Concurso } from '../ofertas/models/concurso';
import { BehaviorSubject } from 'rxjs';
import { Responsable } from '../ofertas/models/responsable';
import { Licitador } from '../models/licitador';
import { UTE } from '../models/ute';

@Injectable()
export class ParameterService {
  //urlWebAPI: string = `http://localhost:5000/api`;
  urlWebAPI = `https://boletusfulcrumapi.azurewebsites.net/api`


  organismos: Organismo[] = [];
  concursos: Concurso[] = [];
  responsables: Responsable[] = [];
  ofertas: Oferta[] = [];
  tipoAvales: TipoAval[] = [];
  estadoAvales: EstadoAval[] = [];
  avales: Aval[] = [];
  avalistas: Avalista[] = [];
  invitaciones: Invitacion[] = [];
  licitadores: Licitador[] = [];
  utes: UTE[] = [];


  private concursosAEstudiarActualizadosSubject = new BehaviorSubject<boolean>(null);
  concursosAEstudiarActualizadosAction$ = this.concursosAEstudiarActualizadosSubject.asObservable();

  private limpiarBuscadorSubject = new BehaviorSubject<boolean>(null);
  limpiarBuscadorAction$ = this.limpiarBuscadorSubject.asObservable();

  private avalAñadidoCorrectamenteSubject = new BehaviorSubject<boolean>(null);
  avalAñadidoCorrectamenteAction$ = this.avalAñadidoCorrectamenteSubject.asObservable();

  constructor() { }

  updateConcursosAEstudiar(actualizados: boolean): void {
    this.concursosAEstudiarActualizadosSubject.next(actualizados);
  }

  limpiarBuscador(limpiar: boolean): void {
    this.limpiarBuscadorSubject.next(limpiar);
  }

  avalAñadidoCorrectamente(limpiarFormulario: boolean): void {
    this.avalAñadidoCorrectamenteSubject.next(limpiarFormulario);
  }


}

