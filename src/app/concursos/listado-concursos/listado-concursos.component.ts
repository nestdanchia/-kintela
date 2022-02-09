import { ParameterService } from '../../shared/parameter.service';
import { Router } from '@angular/router';
import { ConcursosService } from './../concursos.service';
import { Concurso } from './../../ofertas/models/concurso';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog-component/dialog.component';


@Component({
  selector: 'app-listado-concursos',
  templateUrl: './listado-concursos.component.html',
  styleUrls: ['./listado-concursos.component.scss']
})
export class ListadoConcursosComponent implements OnChanges, AfterViewInit, OnInit {
  @Input()
  concursos: Concurso[];

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Concurso>;

  columnsToDisplay: string[] = ['id', 'archivo', 'estado', 'organismo', 'descripcion', 'importe', 'fechaOrientativa', 'plazoEjecucion', 'estudiar', 'fechaArchivo', 'tema', 'expediente',
    'contrato', 'formaAdjudicacion', 'garantia', 'administracion', 'publicacion', 'pais', 'provincia', 'ciudad'];

  clickedRowsWhite = new Set<Concurso>();
  clickedRowsGreen = new Set<Concurso>();
  clickedRowsRed = new Set<Concurso>();

  color: string;


  constructor(private dataService: ConcursosService, private router: Router, private dialog: MatDialog, private parameterService: ParameterService) { }
  ngOnInit(): void {
    this.suscripciones();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('ngOnChanges-concursos', this.concursos);
    this.dataSource = new MatTableDataSource(this.concursos);
  }



  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Coincidencias: ', this.dataSource.data.length);
  }
  limpiarSeleccion() {
    this.clickedRowsWhite.clear();
    this.clickedRowsGreen.clear();
    this.clickedRowsRed.clear();
  }

  cambiarColor(fila) {
    this.color = 'green';

    switch (this.colorFilaSeleccionada(fila)) {
      case "white":
        this.clickedRowsGreen.add(fila);
        break;
      case "green":
        this.color = "red";
        this.clickedRowsRed.add(fila);
        break;
      case "red":
        this.color = "white";
        this.clickedRowsWhite.add(fila);
        break;

    }

    /*console.log('color', this.color);
    console.log('set white', this.clickedRowsWhite);
    console.log('set green', this.clickedRowsGreen);
    console.log('set red', this.clickedRowsRed);*/
  }

  guardar() {
    /*console.log('set white', this.clickedRowsWhite);
    console.log('set green', this.clickedRowsGreen);
    console.log('set red', this.clickedRowsRed);*/

    let concursos: Concurso[] = [];

    for (let item of this.clickedRowsWhite) {
      item.estudiar = null;
      concursos.push(item);

    }

    for (let item of this.clickedRowsGreen) {
      item.estudiar = "SI";
      concursos.push(item);
    }

    for (let item of this.clickedRowsRed) {
      item.estudiar = "NO";
      concursos.push(item)
    }

    let dialogRef = this.dialog.open(DialogComponent, {
      data: { origen: "EstudiarConcursos", data: concursos }
    })

  }

  private suscripciones() {
    this.parameterService.concursosAEstudiarActualizadosAction$
      .subscribe(data => {
        //console.log('suscrito en listado-cocursos', data);
        if (data == true) {
          this.dataSource = new MatTableDataSource(this.concursos.filter(c => c.estudiar == null));
          //console.log('concursos después de actualizar', this.concursos);
        }
      })
      , err => console.log(err);

  }

  private colorFilaSeleccionada(fila): string {
    let color: string = "white";
    for (let item of this.clickedRowsWhite) {
      if (item.id == fila.id && item.archivo == fila.archivo && item.estado == fila.estado) {
        color = "white";
        this.clickedRowsWhite.delete(fila);
      }
    }

    for (let item of this.clickedRowsGreen) {
      if (item.id == fila.id && item.archivo == fila.archivo && item.estado == fila.estado) {
        color = "green";
        this.clickedRowsGreen.delete(fila);
      }
    }

    for (let item of this.clickedRowsRed) {
      if (item.id == fila.id && item.archivo == fila.archivo && item.estado == fila.estado) {
        color = "red";
        this.clickedRowsRed.delete(fila);
      }
    }
    return color;
  }


}



