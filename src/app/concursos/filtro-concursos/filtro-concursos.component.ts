import { ParameterService } from '../../shared/parameter.service';
import { Concurso } from './../../ofertas/models/concurso';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Organismo } from '../../ofertas/models/organismo';
import { OfertasService } from '../../ofertas/ofertas.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConcursosService } from '../concursos.service';
import { Location } from '@angular/common';

interface Opcion {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-filtro-concursos',
  templateUrl: './filtro-concursos.component.html',
  styleUrls: ['./filtro-concursos.component.scss']
})
export class FiltroConcursosComponent implements OnInit {
  get organismos():Organismo[]{
    return this.parameterService.organismos
  }

  set organismos(value: Organismo[]){
    this.parameterService.organismos=value
  }

  private now: Date = new Date();
  actualYear: number = this.now.getFullYear();
  yearSelected: number = this.actualYear;
  years: string[] = ["Todos", (this.actualYear - 2).toString(), (this.actualYear - 1).toString(), this.actualYear.toString()];

  form: FormGroup;
  formularioOriginal = {
    años: [[this.actualYear.toString()]],
    descripcion: '',
    organismoId: 0,
    estudiar:'pt'
  }

  opciones: Opcion[] = [
    { value: 'Sí', viewValue: 'Sí' },
    { value: 'No', viewValue: 'No' },
    { value: 'pt', viewValue: 'Pendiente' },
    { value: 'all', viewValue: 'Todas' }
  ];



  organismos$=this.organismos.length==0
    ? this.dataServiceOfertas.getOrganismos()
    : of(this.organismos);

  concursos$=this.dataServiceConcursos.getConcursos();


  dataSource:Concurso[]=[];
  dataSourceOriginal:Concurso[]=[];
  allConcursos:Concurso[]=[];

  concursosConPropiedadesMapadas$ = forkJoin([
      this.concursos$,
      this.organismos$,
    ])
      .pipe(
        map(([concursos, organismos]) =>
          concursos.map(concurso => ({
            ...concurso,
            descripcionCorta:concurso.descripcion.substr(0,100),
            organismoNombre: organismos.find(o => o.id == concurso.organismoId)?.nombre,
            añoPresentacion: new Date(concurso.fechaOrientativa).getFullYear()
          }) as Concurso))
      );

  constructor(private location: Location,private formBuilder: FormBuilder, private dataServiceConcursos: ConcursosService,
    private dataServiceOfertas: OfertasService, private parameterService:ParameterService) { }

  ngOnInit(): void {
    this.concursosConPropiedadesMapadas$
    .subscribe(data=>{
      this.allConcursos=data;
      //console.debug('All Concursos', this.allConcursos);
      this.dataSource=data.filter(c=>c.estudiar==null);
      this.dataSourceOriginal=this.dataSource;
      //console.debug('Concursos sin Tratar', this.dataSource);
    })
    ,err=>console.error(err)
    ,()=>{}

    if (this.organismos.length==0){
      this.organismos$
      .subscribe(data=>{
        let organismoTodos:Organismo={id:0, nombre:"Todos"}
        this.organismos=data;
        this.organismos.push(organismoTodos);
        //console.log ('Concursos-recalculate organismos', this.organismos)
      })
      ,err=>console.error(err)
      ,()=>{}
    }


    this.form = this.formBuilder.group(this.formularioOriginal);

    this.form.valueChanges
      .subscribe(valores => {
        this.dataSource=this.dataSourceOriginal;
        this.buscarConcursos(valores);
        this.escribirParametrosBusquedaEnURL();
      });




  }

  limpiar() {
    this.form.patchValue(this.formularioOriginal);
  }



  private buscarConcursos(valores: any) {
    if (valores.años) {
      valores.años=="Todos"
      ? this.dataSource=this.allConcursos
      : valores.años.length==1
        ? this.dataSource=this.allConcursos.filter(concurso=>concurso.añoPresentacion==valores.años)
        : valores.años.length>1
          ? this.dataSource=this.allConcursos.filter(concurso=>this.compararAños(concurso, valores.años))
          : this.dataSource=[]

    }

    if (valores.descripcion) {
      var filterBy=valores.descripcion.toLocaleLowerCase();
      this.dataSource = this.dataSource.filter(c => c.descripcion.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    if (valores.organismoId !== 0) {
      this.dataSource = this.dataSource.filter(c =>c.organismoId==valores.organismoId);
    }

    /*if (valores.estudiar) {
      valores.estudiar=='all'
        ? valores.años=="Todos"
            ? this.dataSource=this.allConcursos
            : this.dataSource=this.dataSourceOriginal
        : valores.estudiar=='pt'
          ? this.dataSource = this.dataSource.filter(c => c.estudiar==null)
          : this.dataSource = this.dataSource.filter(c => c.estudiar?.toLocaleLowerCase()==valores.estudiar.toLocaleLowerCase())
    }*/

    if (valores.estudiar) {
      valores.estudiar=='all'
        ? this.dataSource=this.dataSource.filter(c => c.estudiar==null || c.estudiar?.toLocaleLowerCase()=="sí" || c.estudiar?.toLocaleLowerCase()=="no")
        : valores.estudiar=='pt'
          ? this.dataSource = this.dataSource.filter(c => c.estudiar==null)
          : this.dataSource = this.dataSource.filter(c => c.estudiar?.toLocaleLowerCase()==valores.estudiar.toLocaleLowerCase())
    }

    console.log('datasource filtrado', this.dataSource);

  }

  private compararAños(concurso:Concurso, años:string[]):boolean{
    let resultado:boolean;

    años.includes(concurso.añoPresentacion.toString()) ? resultado=true: resultado=false

    return resultado;
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

}
