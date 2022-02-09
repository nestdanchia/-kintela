import { UTE } from './../../models/ute';
import { LicitacionesEnUte } from './../models/licitacionesEnUte';
import { Invitacion } from './../../models/invitacion';
import { Concurso } from './../models/concurso';
import { InvitacionesService } from './../../invitaciones/invitaciones.service';
import { ConcursosService } from './../../concursos/concursos.service';
import { Organismo } from './../models/organismo';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { OfertasService } from '../ofertas.service';
import { map } from 'rxjs/operators';
import { Oferta } from '../models/oferta';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Responsable } from '../models/responsable';
import { ParameterService } from '../../shared/parameter.service';
import { Licitador } from '../../models/licitador';

interface Opcion {
  value: string;
  viewValue: string;
}

interface Origen {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filtro-ofertas',
  templateUrl: './filtro-ofertas.component.html',
  styleUrls: ['./filtro-ofertas.component.scss']
})
export class FiltroOfertasComponent implements OnInit {
  get ofertas(): Oferta[] {
    return this.parameterService.ofertas
  }

  set ofertas(value: Oferta[]) {
    this.parameterService.ofertas = value
  }

  get organismos(): Organismo[] {
    return this.parameterService.organismos
  }

  set organismos(value: Organismo[]) {
    this.parameterService.organismos = value
  }

  get concursos(): Concurso[] {
    return this.parameterService.concursos
  }

  set concursos(value: Concurso[]) {
    this.parameterService.concursos = value
  }

  get responsables(): Responsable[] {
    return this.parameterService.responsables
  }

  set responsables(value: Responsable[]) {
    this.parameterService.responsables = value
  }

  get invitaciones(): Invitacion[] {
    return this.parameterService.invitaciones
  }

  set invitaciones(value: Invitacion[]) {
    this.parameterService.invitaciones = value
  }

  get licitadores(): Licitador[] {
    return this.parameterService.licitadores
  }

  set licitadores(value: Licitador[]) {
    this.parameterService.licitadores = value
  }

  get utes(): UTE[] {
    return this.parameterService.utes
  }

  set utes(value: UTE[]) {
    this.parameterService.utes = value
  }

  dataSource: Oferta[] = [];
  dataSourceOriginal: Oferta[] = [];

  private now: Date = new Date();
  actualYear: number = this.now.getFullYear();
  yearSelected: number = this.actualYear;

  years: string[] = ["Todos", (this.actualYear - 2).toString(), (this.actualYear - 1).toString(), this.actualYear.toString()];

  opciones: Opcion[] = [
    { value: 'Sí', viewValue: 'Sí' },
    { value: 'No', viewValue: 'No' },
    { value: 'pt', viewValue: 'Pendiente' },
    { value: 'all', viewValue: 'Todas' }
  ];

  origenes: Origen[] = [
    { value: 'Concurso', viewValue: 'Concurso' },
    { value: 'Invitación', viewValue: 'Invitación' },
    { value: 'all', viewValue: 'Todos' }
  ];

  form: FormGroup;

  formularioOriginal = {
    //años: [[this.actualYear.toString()]],
    años: [["2022", "2021"]],
    fechaPresentada: '',
    descripcion: '',
    organismoId: 0,
    presentada: '',
    adjudicada: '',
    responsableOferta: '',
    responsableTecnico: '',
    invitaciones: false,
    origen: '',
  }

  organismos$ = this.organismos.length == 0
    ? this.dataService.getOrganismos()
    : of(this.organismos);

  concursos$ = this.concursos.length == 0
    ? this.dataServiceConcursos.getConcursos()
    : of(this.concursos);

  ofertas$ = this.ofertas.length == 0
    ? this.dataService.getOfertas()
    : of(this.ofertas);

  responsables$ = this.responsables.length == 0
    ? this.dataService.getResponsables("ofertas")
    : of(this.responsables);

  invitaciones$ = this.invitaciones.length == 0
    ? this.dataServiceInvitaciones.getInvitaciones()
    : of(this.invitaciones);

  licitadores$ = this.licitadores.length == 0
    ? this.dataService.getLicitadores()
    : of(this.licitadores);

  utes$ = this.utes.length == 0
    ? this.dataService.getUTEs()
    : of(this.utes);


  licitacionesEnSolitario$ = this.dataService.getLicitacionesEnSolitario();

  licitacionesEnUte: LicitacionesEnUte[] = [];
  licitacionesEnUTE$ = this.dataService.getLicitacionesEnUTE()
    .subscribe(
      data => {
        this.licitacionesEnUte = data
      }
      , err => console.error(err)
      , () => { }
    );

  allOfertasConPropiedadesMapadas$ = forkJoin([
    this.ofertas$,
    this.concursos$,
    this.organismos$,
    this.responsables$,
    this.invitaciones$,
    this.licitacionesEnSolitario$
  ])
    .pipe(
      map(([ofertas, concursos, organismos, responsables, invitaciones, licitacionesEnSolitario]) =>
        ofertas.map(oferta => ({
          ...oferta,
          añoPresentada: new Date(oferta.fechaPresentacionFulcrum).getFullYear(),
          organismoId: concursos.find(c => c.id == oferta.concursoId)?.organismoId,
          organismoNombre: oferta.origen == "Concurso"
            ? organismos.find(o => o.id == concursos.find(c => c.ofertaId == oferta.id)?.organismoId)?.nombre
            : organismos.find(o => o.id == invitaciones.find(i => i.ofertaId == oferta.id)?.organismoId)?.nombre,
          presupuesto: oferta.origen == "Concurso"
            ? concursos.find(c => c.ofertaId == oferta.id)?.importe
            : invitaciones.find(i => i.ofertaId == oferta.id)?.importe,
          responsableOfertaNombre: responsables.find(r => r.id == oferta.responsableOferta)?.nombreCompleto,
          responsableTecnicoNombre: responsables.find(r => r.id == oferta.responsableTecnico)?.nombreCompleto,
          concurso: concursos.find(c => c.ofertaId == oferta.id),
          invitacion: invitaciones.find(i => i.ofertaId == oferta.id),
          adjudicatarioEnSolitario: licitacionesEnSolitario.find(ls => ls.ofertaId == oferta.id && ls.adjudicado == true)?.licitadorId,
          licitacionesEnUte: this.licitacionesEnUte.filter(l => l.ofertaId == oferta.id),
          adjudicada: this.getAdjudicada(oferta.id,
            this.licitacionesEnUte.filter(l => l.ofertaId == oferta.id),
            licitacionesEnSolitario.find(ls => ls.ofertaId == oferta.id && ls.adjudicado == true)?.licitadorId),
        }) as Oferta))
    );

  constructor(private formBuilder: FormBuilder, private location: Location, private dataService: OfertasService, private dataServiceConcursos: ConcursosService,
    private activatedRoute: ActivatedRoute, private parameterService: ParameterService, private dataServiceInvitaciones: InvitacionesService) { }

  ngOnInit(): void {
    this.allOfertasConPropiedadesMapadas$
      .subscribe(
        data => {
          this.ofertas = data;
          this.dataSource = data.filter(d => d.añoPresentada == this.actualYear || d.añoPresentada == this.actualYear - 1).slice(0, 100);
          //this.dataSource = data.filter(d => d.añoPresentada == this.actualYear || d.añoPresentada == this.actualYear - 1);
          this.dataSourceOriginal = this.dataSource;
        }
        , err => console.error(err)
        , () => {
          console.log('ofertas', this.ofertas.length);

          console.log('dataSource con las 100 primeras', this.dataSource);
        }
      );

    this.licitadores$
      .subscribe(
        data => {
          this.licitadores = data;
        }
        , err => console.error(err)
        , () => {
          //console.log('licitadores', this.licitadores);
        }
      );

    this.utes$
      .subscribe(
        data => {
          this.utes = data;
        }
        , err => console.error(err)
        , () => {
          //console.log('licitadores', this.licitadores);
        }
      );

    this.inicializarFormulario();


    this.agregarOpcionTodos();
  }

  private getAdjudicada(ofertaId: string, utes: LicitacionesEnUte[], adjudicatarioEnSolitario: number): string {
    let resultado: string = "";

    adjudicatarioEnSolitario != undefined
      ? resultado = this.licitadores.find(l => l.id == adjudicatarioEnSolitario)?.nombre
      : utes.length == 0
        ? resultado = "pendiente"
        : resultado = this.montarUTEs(utes)

    return resultado;

  }

  montarUTEs(licitacionesEnUte: LicitacionesEnUte[]): string {
    let licitadoresIdsConcatenados: string = "";
    let licitadoresIds: string[] = [];
    let resultado: string = "UTE: ";

    for (let licitacionEnUte of licitacionesEnUte) {
      licitadoresIdsConcatenados = this.utes.find(u => u.id == licitacionEnUte.uteId).licitadoresId
    }

    licitadoresIds = licitadoresIdsConcatenados.split(",");

    for (let licitadorId of licitadoresIds) {
      resultado += this.licitadores.find(l => l.id == +licitadorId).nombre + " - "
    }


    return resultado.substring(0, resultado.length - 3);
  }


  inicializarFormulario() {
    this.form = this.formBuilder.group(this.formularioOriginal);

    this.form.valueChanges
      .subscribe(
        valores => {
          this.dataSource = this.dataSourceOriginal;
          this.buscarOfertas(valores);
          //this.escribirParametrosBusquedaEnURL();
        }
        , err => console.error(err)
        , () => {
          /*console.log('finaliza el filtradpo de ofertas');
          this.comprobarAñosSeleccionados();*/
        }
      );
  }

  agregarOpcionTodos() {
    this.organismos$
      .subscribe(
        data => {
          let organismoTodos: Organismo = { id: 0, nombre: "Todos" }
          this.organismos = data;
          this.organismos.push(organismoTodos);
          this.organismos$ = of(this.organismos)
        }
        , err => console.error(err)
        , () => {
        }
      );


    this.responsables$
      .subscribe(
        data => {
          let responsableTodos: Responsable = { id: 0, codigoSAP: '', nombre: "Todos", apellido1: '', apellido2: '', nombreCompleto: 'Todos' }
          this.responsables = data;
          this.responsables.push(responsableTodos);
          this.responsables$ = of(this.responsables);
        }
        , err => console.error(err)
        , () => {
        }
      );
  }

  private comprobarAñosSeleccionados() {
    let añosSeleccionados: string[] = this.form.controls.años.value;

    if (añosSeleccionados.findIndex(a => a == 'Todos') == 0) {
      this.form.controls.años.patchValue(this.years);
    }
    else {

    }
  }

  limpiar() {
    this.form.patchValue(this.formularioOriginal);
  }

  private compararAños(oferta: Oferta, años: string[]): boolean {
    let resultado: boolean;

    años.includes(oferta.añoPresentada.toString()) ? resultado = true : resultado = false

    return resultado;
  }


  private leerValoresURL() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        var objeto: any = {};

        if (params.year) {
          objeto.year = params.year;
        }

        if (params.fechaPresentada) {
          objeto.fechaPresentada = params.fechaPresentada;
        }

        if (params.descripcion) {
          objeto.descripcion = params.descripcion;
        }

        if (params.organismoId) {
          objeto.organismoId = +params.organismoId;
        }

        if (params.presentada) {
          objeto.presentada = params.presentada;
        }

        if (params.adjudicada) {
          objeto.adjudicada = params.adjudicada;
        }

        this.form.patchValue(objeto);
      });
  }


  private escribirParametrosBusquedaEnURL() {
    var queryStrings = [];

    var valoresFormulario = this.form.value;

    if (valoresFormulario.años) {
      queryStrings.push(`year=${valoresFormulario.años}`);
    }

    if (valoresFormulario.descripcion) {
      queryStrings.push(`descripcion=${valoresFormulario.descripcion}`);
    }

    if (valoresFormulario.organismoId !== '0') {
      queryStrings.push(`organismoId=${valoresFormulario.organismoId}`);
    }

    if (valoresFormulario.presentada) {
      queryStrings.push(`presentada=${valoresFormulario.presentada}`);
    }

    if (valoresFormulario.adjudicada) {
      queryStrings.push(`adjudicada=${valoresFormulario.adjudicada}`);
    }

    this.location.replaceState('ofertas/buscar', queryStrings.join('&'));

  }


  private buscarOfertas(valores: any) {
    if (valores.años) {
      valores.años == "Todos"
        ? this.dataSource = this.ofertas
        : valores.años.length == 1
          ? this.dataSource = this.ofertas.filter(oferta => oferta.añoPresentada == valores.años)
          : valores.años.length > 1
            ? this.dataSource = this.ofertas.filter(oferta => this.compararAños(oferta, valores.años))
            : this.dataSource = []

    }

    if (valores.descripcion) {
      var filterBy = valores.descripcion.toLocaleLowerCase();
      this.dataSource = this.dataSource.filter(oferta => oferta.descripcion.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    if (valores.organismoId !== 0) {
      this.dataSource = this.dataSource.filter(oferta => oferta.organismoId == valores.organismoId);
    }

    if (valores.presentada) {
      valores.presentada == 'all'
        ? valores.años == "Todos"
          ? this.dataSource = this.ofertas
          : this.dataSource = this.dataSourceOriginal
        : this.dataSource = this.dataSource.filter(oferta => oferta.presentada == valores.presentada);
    }

    if (valores.responsableOferta) {
      valores.responsableOferta == 0
        ? valores.años == "Todos"
          ? this.dataSource = this.ofertas
          : this.dataSource = this.dataSourceOriginal
        : this.dataSource = this.dataSource.filter(oferta => oferta.responsableOferta == valores.responsableOferta);
    }

    if (valores.responsableTecnico) {
      valores.responsableTecnico == 0
        ? valores.años == "Todos"
          ? this.dataSource = this.ofertas
          : this.dataSource = this.dataSourceOriginal
        : this.dataSource = this.dataSource.filter(oferta => oferta.responsableTecnico == valores.responsableTecnico);
    }

    if (valores.origen) {
      valores.origen == "Concurso"
        ? this.dataSource = this.dataSource.filter(oferta => oferta.origen == "Concurso")
        : valores.origen == "Invitación"
          ? this.dataSource = this.dataSource.filter(oferta => oferta.origen == "Invitación")
          : this.dataSource = this.dataSource
    }

    /*valores.adjudicada
    ? this.dataSource = this.dataSource.filter(oferta => oferta.adjudicadaEnSolitario == "Sí")
    : this.dataSource = this.dataSourceOriginal*/

  }

}



