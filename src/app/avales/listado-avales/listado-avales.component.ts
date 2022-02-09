import { TipoAval } from './../../models/tipoAval';
import { AvalesService } from './../avales.service';
import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Aval } from '../../models/aval';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate } from "@angular/common";
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado-avales',
  templateUrl: './listado-avales.component.html',
  styleUrls: ['./listado-avales.component.scss']
})
export class ListadoAvalesComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  avales: Aval[];

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Aval>;

  columnsToDisplay: string[] = ['fechaAval', 'numero', 'importe', 'tipoAval', 'estadoAval','avalista','responsable', 'fechaSolicitud', 'fechaAnulacion',
   'ofertaId','proyectoId','clienteNombre','observaciones'];

  constructor(@Inject(LOCALE_ID) private locale: string, private dataServiceAvales:AvalesService, private snackbar: MatSnackBar) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.avales);
  }
  ngAfterViewInit(): void {
    this.dataSource.sort=this.sort;
  }

  ngOnInit(): void {
    console.log(moment().format('HH:mm:ss')); // 16:13:11
    console.log( moment.utc().format('HH:mm:ss') )
  }

  limpiar(){}

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log('Coincidencias: ', this.dataSource.data.length);
  }

  updateFechaAval(aval: any, fechaAval:Date) {
   const flag=true
    
    if(moment.isDate(fechaAval)){
      aval.fecha = formatDate(fechaAval, 'dd-MM-yyyy', this.locale);
      console.log('aval con los cambios', aval);
      this.dataServiceAvales.putAval(aval.id, aval)
      .subscribe(
        data => {

        }
        , err => console.error(err)
        , () => { }
      );
    }
    else{
      console.log('fechaAval',fechaAval)
      let snackBar = this.snackbar.open('La Fecha del aval debe ser de tipo fecha','fecha Aval' , { duration: 3000 });
    }
  }

  updateImporte(aval: Aval, importe: string) {
    if (importe == null) { return; };

    if (isNaN(+importe)) {
      let snackBar = this.snackbar.open(`El Importe debe ser un valor numérico`, '', { duration: 3000 });
      return;
    }

    aval.importe = +importe;

    this.dataServiceAvales.putAval(aval.id, aval)
      .subscribe(
        data => {

        }
        , err => console.error(err)
        , () => { }
      );
  }

  updateTipo(aval: Aval, tipo: TipoAval) {
    if (tipo == null) { return; };

    aval.tipoAval = aval.tipoAval;

    this.dataServiceAvales.putAval(aval.id, aval)
      .subscribe(
        data => {

        }
        , err => console.error(err)
        , () => { }
      );
  }

}


