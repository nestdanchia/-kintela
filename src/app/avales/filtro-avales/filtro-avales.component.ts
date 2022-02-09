import { Oferta } from './../../ofertas/models/oferta';
import { Cliente } from './../../models/cliente';
import { TipoAval } from './../../models/tipoAval';
import { OfertasService } from './../../ofertas/ofertas.service';
import { Responsable } from './../../ofertas/models/responsable';
import { SAPService } from '../../shared/sap.service';
import { AvalesService } from './../avales.service';
import { ParameterService } from './../../shared/parameter.service';
import { Aval } from '../../models/aval';
import { Component, OnInit } from "@angular/core";
import { EstadoAval } from '../../models/estadoAval';
import { Avalista } from '../../models/avalista';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Proyecto } from '../../models/proyecto';

@Component({
  selector: 'app-filtro-avales',
  templateUrl: './filtro-avales.component.html',
  styleUrls: ['./filtro-avales.component.scss']
})
export class FiltroAvalesComponent implements OnInit {
  dataSource: Aval[] = [];
  dataSourceOriginal: Aval[] = [];

  get avales(): Aval[] {
    return this.parameterService.avales
  }

  set avales(value: Aval[]) {
    this.parameterService.avales = value
  }

  get tipoAvales(): TipoAval[] {
    return this.parameterService.tipoAvales
  }

  set tipoAvales(value: TipoAval[]) {
    this.parameterService.tipoAvales = value
  }

  get estadoAvales(): EstadoAval[] {
    return this.parameterService.estadoAvales
  }

  set estadoAvales(value: EstadoAval[]) {
    this.parameterService.estadoAvales = value
  }

  get avalistas(): Avalista[] {
    return this.parameterService.avalistas
  }

  set avalistas(value: Avalista[]) {
    this.parameterService.avalistas = value
  }

  get responsables(): Responsable[] {
    return this.parameterService.responsables
  }

  set responsables(value: Responsable[]) {
    this.parameterService.responsables = value
  }

  get ofertas(): Oferta[] {
    return this.parameterService.ofertas
  }

  set ofertas(value: Oferta[]) {
    this.parameterService.ofertas = value
  }


  avales$ = this.avales.length == 0
  ? this.dataServiceAvales.getAvales()
  : of(this.avales)

  tipoAvales$ = this.tipoAvales.length == 0
  ? this.dataServiceAvales.getTipoAvales()
  : of(this.tipoAvales)

  estadoAvales$ = this.estadoAvales.length == 0
  ? this.dataServiceAvales.getEstadoAvales()
  : of(this.estadoAvales)

  avalistas$ = this.avalistas.length == 0
  ? this.dataServiceAvales.getAvalistas()
  : of(this.avalistas)

  responsables$ = this.responsables.length == 0
  ? this.dataServiceOfertas.getResponsables("avales")
  : of(this.responsables)

  oferta$ = this.ofertas.length == 0
  ? this.dataServiceOfertas.getOfertas()
  : of(this.ofertas)

  proyectos$=this.dataServiceSAP.getProyectos()


  avalesConPropiedadesMapeadas$ = forkJoin([
    this.avales$,
    this.tipoAvales$,
    this.estadoAvales$,
    this.avalistas$,
    this.responsables$,
    this.proyectos$
  ])
  .pipe(
    map(([avales, tipoAvales, estadoAvales, avalistas, responsables, proyectos]) =>
      avales.map(aval => ({
        ...aval,
        tipoAval: tipoAvales.find(t => t.id == aval.tipoAvalId)!.nombre,
        estadoAval: estadoAvales.find(t => t.id == aval.estadoAvalId)!.nombre,
        avalista: avalistas.find(t => t.id == aval.avalistaId)!.nombre,
        responsableNombre:responsables.find(r => r.id == aval.responsableId)!.nombreCompleto,
        clienteId:proyectos.find(p=>p.id==aval.proyectoId)?.clienteId,
        clienteNombre:proyectos.find(p=>p.id==aval.proyectoId)?.clienteNombre,
        proyectoDescripcion:proyectos.find(p=>p.id==aval.proyectoId)?.descripcion,
        //ofertaDescripcion:ofertas.find(o=>o.id==aval.ofertaId)?.descripcion,
      }) as Aval))
  );

  form: FormGroup;

  formularioOriginal = {
    oferta:'',
    contrato:'',
    fechaAvalDesde:'',
    fechaAvalHasta:'',
    fechaSolicitudDesde:'',
    fechaSolicitudHasta:'',
    fechaAnulacionDesde:'',
    fechaAnulacionHasta:'',
    tipoAval:'',
    estadoAval:'',
    avalista:'',
    cliente:'',
    responsable:''
  }

  proyectos:Proyecto[]=[];
  proyectosConAval:Proyecto[]=[];
  avalesFiltrados:Aval[]=[];
  avalesIniciales:Aval[]=[];
  clientes:Cliente[]=[];
  clientes$!:Observable<Cliente[]>;


  constructor( private parameterService:ParameterService, private dataServiceAvales:AvalesService, private formBuilder: FormBuilder,
    private dataServiceSAP:SAPService, private dataServiceOfertas:OfertasService,  private snackbar: MatSnackBar){}

  ngOnInit(): void {
    this.avalesConPropiedadesMapeadas$
    .subscribe(
      data=>{
        this.dataSource=data;
        this.dataSourceOriginal=this.dataSource;
      }
      ,err=>console.error(err)
      ,()=>{
        console.log('avales iniciales', this.dataSourceOriginal);
        this.rellenarClientes();
      }
    );

    this.inicializarFormulario();

    this.agregarOpcionTodos();

  }

  private agregarOpcionTodos(){
    if(this.responsables.length==0){
      this.responsables$
      .subscribe(
        data => {
          let responsableTodos: Responsable = { id: 0, codigoSAP: '', nombre: "Todos", apellido1: '', apellido2: '', nombreCompleto: 'Todos' }
          this.responsables = data;
          this.responsables.push(responsableTodos);
          this.responsables$=of(this.responsables);
        }
        , err => console.error(err)
        , () => {
        }
      );
    }

    if(this.avalistas.length==0){
      this.avalistas$
      .subscribe(
        data => {
          let avalistaTodos:Avalista ={id:0, nombre:"Todos"}
          this.avalistas = data;
          this.avalistas.push(avalistaTodos);
          this.avalistas$=of(this.avalistas);
        }
        , err => console.error(err)
        , () => {
        }
      );
    }

    if(this.estadoAvales.length==0){
      this.estadoAvales$
      .subscribe(
        data => {
          let estadoAvalTodos:EstadoAval ={id:0, nombre:"Todos"}
          this.estadoAvales = data;
          this.estadoAvales.push(estadoAvalTodos);
          this.estadoAvales$=of(this.estadoAvales);
        }
        , err => console.error(err)
        , () => {
        }
      );
    }

    if(this.tipoAvales.length==0){
      this.tipoAvales$
      .subscribe(
        data => {
          let tipoAvalTodos:TipoAval ={id:0, nombre:"Todos"}
          this.tipoAvales = data;
          this.tipoAvales.push(tipoAvalTodos);
          this.tipoAvales$=of(this.tipoAvales);
        }
        , err => console.error(err)
        , () => {
        }
      );
    }
  }

  private rellenarClientes(){
    this.proyectos$
      .subscribe(
        data=>{
          this.proyectos=data;
        }
        ,err=>console.error(err)
        ,()=>{
          // console.log('proyectos facturables abiertos y cerrados', this.proyectos)
          let proyecto:Proyecto;
          for(let aval of this.dataSource.filter(a=>a.proyectoId!=undefined && a.proyectoId.trim()!='')){
            proyecto=this.proyectos.find(p => p.id == aval.proyectoId)!;
            this.proyectosConAval.push(proyecto);
            //console.log(`proyecto del aval ${aval.proyectoId} proyecto entontrado ${proyecto.prjCode}`);
          }

          //console.log('proyectos facturables abiertos y cerrados con aval asociado', this.proyectosConAval)

          for(let proyecto of this.proyectosConAval){
            let cliente:Cliente={id:proyecto.clienteId, nombre:proyecto.clienteNombre}
            this.clientes.push(cliente);
          }

          let clienteTodos:Cliente={id:"0", nombre:"Todos"}

          this.clientes.push(clienteTodos);

          let hash = {};
          this.clientes = this.clientes.filter(o => hash[o.nombre] ? false : hash[o.nombre] = true);

          this.clientes.sort(function (a, b) {
            if (a.nombre > b.nombre) {
              return 1;
            }
            if (a.nombre < b.nombre) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          //console.log('clientes de proyectos con aval asociado', this.clientes)

          this.clientes$=of(this.clientes);

        }
      );
  }


  private inicializarFormulario(){
    this.form = this.formBuilder.group(this.formularioOriginal);

    this.form.valueChanges
    .subscribe(
      valores => {
        this.dataSource = this.dataSourceOriginal;
        this.buscar(valores);
        //this.escribirParametrosBusquedaEnURL();
        }
    );
  }

  private buscar(valores: any) {
    if (valores.oferta) {
      this.buscarAvalesByOferta(valores.oferta);
    }

    if (valores.contrato) {
      this.buscarAvalesByContrato(valores.contrato);
    }

    //Filtros Fechas
    if(valores.fechaAvalDesde){
      if(valores.fechaAvalHasta){
        this.validarFechas(valores.fechaAvalDesde, valores.fechaAvalHasta)
        ? this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaAvalDesde && new Date(a.fecha)<=valores.fechaAvalHasta)
        : this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)<=valores.fechaAvalHasta)
      }
      else{
        this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaAvalDesde);
      }
    }

    if(valores.fechaSolicitudDesde){
      if(valores.fechaSolicitudHasta){
        this.validarFechas(valores.fechaSolicitudDesde, valores.fechaSolicitudHasta)
        ? this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaSolicitudDesde && new Date(a.fecha)<=valores.fechaSolicitudHasta)
        : this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)<=valores.fechaSolicitudHasta)
      }
      else{
        this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaSolicitudDesde);
      }
    }

    if(valores.fechaAnulacionDesde){
      if(valores.fechaAnulacionHasta){
        this.validarFechas(valores.fechaAnulacionDesde, valores.fechaAnulacionHasta)
        ? this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaAnulacionDesde && new Date(a.fecha)<=valores.fechaAnulacionHasta)
        : this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)<=valores.fechaAnulacionHasta)
      }
      else{
        this.dataSource=this.dataSource.filter(a=>new Date(a.fecha)>=valores.fechaAnulacionDesde);
      }
    }

    //Filtros Otros
    if(valores.tipoAval){
      valores.tipoAval==0
      ? this.dataSource=this.dataSourceOriginal
      : this.dataSource=this.dataSource.filter(a=>a.tipoAvalId==valores.tipoAval)
    }

    if(valores.estadoAval){
      valores.estadoAval==0
      ? this.dataSource=this.dataSourceOriginal
      : this.dataSource=this.dataSource.filter(a=>a.estadoAvalId==valores.estadoAval)
    }

    if(valores.avalista){
      valores.avalista==0
      ? this.dataSource=this.dataSourceOriginal
      : this.dataSource=this.dataSource.filter(a=>a.avalistaId==valores.avalista)
    }

    if(valores.responsable){
      valores.responsable==0
      ? this.dataSource=this.dataSourceOriginal
      : this.dataSource=this.dataSource.filter(a=>a.responsableId==valores.responsable)
    }

    if(valores.cliente){
      valores.cliente=="Todos"
      ? this.dataSource=this.dataSourceOriginal
      : this.dataSource=this.dataSource.filter(a=>a.clienteNombre==valores.cliente)
    }
  }

  private validarFechas(fechaDesde:Date, fechaHasta:Date):boolean{
    if(fechaDesde>fechaHasta){
      let snackBar = this.snackbar.open(`La fecha desde no puede ser mayor que la fecha Hasta`, '', { duration: 5000 });
      return false;
    }
    return true

  }

  private buscarAvalesByContrato(filtro:string){
    let proyectosConAvalFiltradosByTexto:Proyecto[]=[];

    proyectosConAvalFiltradosByTexto=this.proyectosConAval.filter(p=>p.descripcion.toLocaleLowerCase().indexOf(filtro.toLocaleLowerCase())!==-1);

    console.log('proyectos con aval filtrados por texto',proyectosConAvalFiltradosByTexto);

    let avalesDeproyectosFiltrados:Aval[]=[];
    let avalAsociado:Aval;

    for (let proyecto of proyectosConAvalFiltradosByTexto){
      avalAsociado=this.dataSourceOriginal.find(a=>a.proyectoId==proyecto.id);
      if(avalAsociado!=undefined){
        avalAsociado.proyectoDescripcion=proyecto.descripcion;
        avalesDeproyectosFiltrados.push(avalAsociado)
      }
    }
    console.log('avales de proyectos filtrados por texto',avalesDeproyectosFiltrados);

    this.añadirPropiedadesMapeadasAvalesDeContratos(avalesDeproyectosFiltrados);

  }

  private buscarAvalesByOferta(filtro:string){
    var filterBy = filtro.toLocaleLowerCase();

    this.dataServiceAvales.getAvalesByOferta(filterBy)
    .subscribe(
      data=>{
        this.avalesFiltrados=data;
      }
      ,err=>console.error(err)
      ,()=>{
        //console.log('avales filtrados por Oferta', this.avalesFiltrados);
        this.añadirPropiedadesMapeadas(this.avalesFiltrados, filtro);
      }
    );
  }

  private añadirPropiedadesMapeadas(avales:Aval[], filtro:string){
    let avalesConPropiedadesMapeadas$ = forkJoin([
      of(avales),
      this.tipoAvales$,
      this.estadoAvales$,
      this.avalistas$,
      this.responsables$,
      this.proyectos$
    ])
      .pipe(
        map(([avales, tipoAvales, estadoAvales, avalistas, responsables, proyectos]) =>
          avales.map(aval => ({
            ...aval,
            tipoAval: tipoAvales.find(t => t.id == aval.tipoAvalId).nombre,
            estadoAval: estadoAvales.find(t => t.id == aval.estadoAvalId).nombre,
            avalista: avalistas.find(t => t.id == aval.avalistaId).nombre,
            responsableNombre:responsables.find(r => r.id == aval.responsableId).nombreCompleto,
            clienteId:proyectos.find(p=>p.id==aval.proyectoId)?.clienteId,
            clienteNombre:proyectos.find(p=>p.id==aval.proyectoId)?.clienteNombre
          }) as Aval))
      );

      avalesConPropiedadesMapeadas$
      .subscribe(
        data => {
          this.dataSource = data;
        }
        , err => console.log(err)
        , () => {
          console.log('dataSource tras filtrar por oferta', this.dataSource);
        }
      );

  }

  private añadirPropiedadesMapeadasAvalesDeContratos(avales:Aval[]){
    let avalesConPropiedadesMapeadas$ = forkJoin([
      of(avales),
      this.tipoAvales$,
      this.estadoAvales$,
      this.avalistas$,
      this.responsables$,
      this.proyectos$
    ])
      .pipe(
        map(([avales, tipoAvales, estadoAvales, avalistas, responsables, proyectos]) =>
          avales.map(aval => ({
            ...aval,
            tipoAval: tipoAvales.find(t => t.id == aval.tipoAvalId).nombre,
            estadoAval: estadoAvales.find(t => t.id == aval.estadoAvalId).nombre,
            avalista: avalistas.find(t => t.id == aval.avalistaId).nombre,
            responsableNombre:responsables.find(r => r.id == aval.responsableId).nombreCompleto,
            clienteId:proyectos.find(p=>p.id==aval.proyectoId)?.clienteId,
            clienteNombre:proyectos.find(p=>p.id==aval.proyectoId)?.clienteNombre
          }) as Aval))
      );

      avalesConPropiedadesMapeadas$
      .subscribe(
        data => {
          this.dataSource=data;
        }
        , err => console.log(err)
        , () => {
          console.log('dataSource tras filtrar por proyecto', this.dataSource);
        }
      );

  }

  limpiar() {
    this.form.patchValue(this.formularioOriginal);
  }
}
