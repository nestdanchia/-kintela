import { isDate } from 'moment';
import { ParameterService } from '../../shared/parameter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Responsable } from '../../ofertas/models/responsable';
import { Organismo } from '../../ofertas/models/organismo';
import { InvitacionesService } from './../../invitaciones/invitaciones.service';
import { Oferta } from './../models/oferta';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, Output, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Invitacion } from '../../models/invitacion';
import { ConcursosService } from '../../concursos/concursos.service';
import { Concurso } from '../models/concurso';
import { formatDate } from '@angular/common';
import { OfertasService } from '../ofertas.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listado-ofertas',
  templateUrl: './listado-ofertas.component.html',
  styleUrls: ['./listado-ofertas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListadoOfertasComponent implements OnChanges, AfterViewInit, OnInit {
  @Input()
  ofertas: Oferta[];

  @Input()
  origen: string;

  @Output()
  ofertaSeleccionada: EventEmitter<Oferta> = new EventEmitter<Oferta>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  columnsToDisplay: string[];

  expandedElement: Oferta | null;

  dataSource: MatTableDataSource<Oferta>;

  selection = new SelectionModel<Oferta>(false, []);

  clickedRows = new Set<Oferta>();
  filtro: string;

  licitadoresEnUte: string;
  

  constructor(private dataServiceInvitaciones: InvitacionesService, private dataServiceConcursos: ConcursosService, private dataServiceOfertas: OfertasService,
    @Inject(LOCALE_ID) private locale: string, private snackBar: MatSnackBar, private parameterService: ParameterService) { }

  ngOnInit(): void {
    this.suscripciones();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.suscripciones;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('ngOnChanges-this.ofertas',this.ofertas);
    this.origen == 'ofertas'
      ? this.columnsToDisplay = ['id', 'idPresentada', 'adjudicada', 'descripcion', 'organismo', 'fechaPresentacion', 'presupuesto', 'responsableOferta',
        'responsableTecnico', 'origen']
      : this.columnsToDisplay = ['select', 'id', 'fechaPresentacion', 'idPresentada', 'descripcion'];
    this.dataSource = new MatTableDataSource(this.ofertas);
  }

  mostrarUTES(oferta: Oferta): string {
    //bucle infinito
    /*for(let licitadorEnUte of oferta.licitacionesEnUte){
      this.dataServiceOfertas.getUTE(licitadorEnUte.uteId)
      .subscribe(
        data=>{
          this.licitadoresEnUte=data.licitadoresId
        }
        ,err=>console.error(err)
        ,()=>{}
      );
    }*/
    return this.licitadoresEnUte;
  }

  private suscripciones() {
    this.parameterService.avalAñadidoCorrectamenteAction$
      .subscribe(
        data => {
          if (data == true) {
            this.clickedRows.clear();
            this.selection.clear();
            this.dataSource.filter = "";
            this.filtro = ""
          }
        })
      , err => console.error(err);
  }

  seleccionar(fila) {
    //console.log('Oferta seleccionada', fila);
    this.clickedRows.clear();
    this.clickedRows.add(fila);

    this.ofertaSeleccionada.emit(fila);
  }


  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Coincidencias: ', this.dataSource.data.length);
  }

  update(el: Element, value: string) {
    if (value == null) { return; }
    console.log('element', el);
    console.log('value', value);
  }

  updateInvitacion(ofertaId: string, organismoId?: number, descripcion?: string, presupuesto?: number) {
    let invitacion: Invitacion;

    this.dataServiceInvitaciones.getInvitacionByOferta(ofertaId)
      .subscribe(
        data => {
          invitacion = data;
          organismoId == undefined ? invitacion.organismoId = invitacion.organismoId : invitacion.organismoId = organismoId;
          descripcion == undefined ? invitacion.descripcion = invitacion.descripcion : invitacion.descripcion = descripcion;
          presupuesto == undefined ? invitacion.importe = invitacion.importe : invitacion.importe = presupuesto;
        }
        , err => console.error(err)
        , () => {
          this.dataServiceInvitaciones.putInvitacion(invitacion.id, invitacion)
            .subscribe(
              data => {

              }
              , err => console.error(err)
              , () => {

              }
            );
        }
      );
  }

  updateConcurso(ofertaId: string, organismoId?: number, descripcion?: string, presupuesto?: number) {
    let concurso: Concurso;

    this.dataServiceConcursos.getConcursoByOferta(ofertaId)
      .subscribe(
        data => {
          concurso = data;
          organismoId == undefined ? concurso.organismoId = concurso.organismoId : concurso.organismoId = organismoId;
          descripcion == undefined ? concurso.descripcion = concurso.descripcion : concurso.descripcion = descripcion;
          presupuesto == undefined ? concurso.importe = concurso.importe : concurso.importe = presupuesto;
        }
        , err => console.error(err)
        , () => {
          this.dataServiceConcursos.putConcursoById(concurso.id, concurso)
            .subscribe(
              data => {

              }
              , err => console.error(err)
              , () => {

              }
            );
        }
      );
  }


  updateOrganismo(oferta: Oferta, organismo: Organismo) {
    if (organismo == null) { return; };
    oferta.organismoNombre = organismo.nombre;

    if (oferta.origen == "Invitación") {
      this.updateInvitacion(oferta.id, organismo.id);
    }
    else {
      this.updateConcurso(oferta.id, organismo.id);
    }

  }

  updateDescripcion(oferta: Oferta, descripcion: string) {
    if (descripcion == null) { return; };
    oferta.descripcion = descripcion;

    if (oferta.origen == "Invitación") {
      this.updateInvitacion(oferta.id, undefined, descripcion);
    }
    else {
      this.updateConcurso(oferta.id, undefined, descripcion);
    }

  }

  updatePresupuesto(oferta: Oferta, presupuesto: string) {
    if (presupuesto == null) { return; };

    if (isNaN(+presupuesto)) {
      let snackBar = this.snackBar.open(`El Presupuesto debe ser un valor numérico`, '', { duration: 5000 });
      return;
    }

    oferta.presupuesto = +presupuesto;

    if (oferta.origen == "Invitación") {
      this.updateInvitacion(oferta.id, undefined, undefined, +presupuesto);
    }
    else {
      this.updateConcurso(oferta.id, undefined, undefined, +presupuesto);
    }

  }

  updateFechaPresentacion(oferta: any, fechaPresentacion: Date) {
    if (fechaPresentacion == null) { return; };

    if (isDate(fechaPresentacion)) {
      oferta.fechaPresentacionFulcrum = formatDate(fechaPresentacion, 'dd-MM-yyyy', this.locale);

      this.dataServiceOfertas.putOferta(oferta.id, oferta)
        .subscribe(
          data => {

          }
          , err => console.error(err)
          , () => { }
        );
    }
    else {
      let snackBar = this.snackBar.open('El valor debe ser del tipo fecha', '', { duration: 3000 });
    }


  }

  updateResponsableOferta(oferta: Oferta, responsable: Responsable) {
    if (responsable == null) { return; };

    oferta.responsableOfertaNombre = responsable.nombreCompleto;
    oferta.responsableOferta = responsable.id;

    this.dataServiceOfertas.putOferta(oferta.id, oferta)
      .subscribe(
        data => {

        }
        , err => console.error(err)
        , () => { }
      );

  }

  updateResponsableTecnico(oferta: Oferta, responsable: Responsable) {
    if (responsable == null) { return; };

    oferta.responsableTecnicoNombre = responsable.nombreCompleto;
    oferta.responsableTecnico = responsable.id;

    this.dataServiceOfertas.putOferta(oferta.id, oferta)
      .subscribe(
        data => {

        }
        , err => console.error(err)
        , () => { }
      );

  }

}

