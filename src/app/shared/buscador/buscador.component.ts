import { ParameterService } from './../parameter.service';
import { Invitacion } from '../../models/invitacion';
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.scss']
})
export class BuscadorComponent implements OnInit, OnChanges {

  @Input()
  modelo: any;

  @Input()
  origen:string;

  @Output()
  elementoSeleccionado: EventEmitter<any>=new EventEmitter<any>();

  @ViewChild(MatSort) sort: MatSort;

  filtro:string;

  dataSource: MatTableDataSource<Invitacion>;

  columnsToDisplay: string[] = ['select', 'nombre'];

  clickedRows = new Set<Invitacion>();

  selection = new SelectionModel<Invitacion>(false, []);

  constructor(private parameterService:ParameterService ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.modelo);
  }


  ngOnInit(): void {
    this.suscripciones();
  }

  private suscripciones(){
    this.parameterService.limpiarBuscadorAction$
      .subscribe(
        data=>{
          if(data==true){
            this.clickedRows.clear();
            this.selection.clear();
            this.dataSource.filter="";
            this.filtro="";
          }
        })
      ,err=>console.error(err);
  }


  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Coincidencias: ', this.dataSource.data.length);
  }

  seleccionar(fila) {
    this.clickedRows.clear();
    this.clickedRows.add(fila);
    console.log('organismo seleccionado en el buscador', fila)
    this.elementoSeleccionado.emit(fila);

  }


}
