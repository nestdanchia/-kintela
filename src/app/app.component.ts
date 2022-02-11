import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { formatDate } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
// var a = moment.parseFormat('Friday 2018 27 april 10:28:10');
// https://isolution.pro/es/t/momentjs/momentjs-quick-guide/momentjs-guia-rapida
// time zone https://www.section.io/engineering-education/nodejs-date-and-time-objects-with-moment/
export interface EMPLOYEE {

  name: string;
  sueldo: number;
  cargo: string;
  inicio: Date;
}


const juanFecha = new Date("2019-08-01T10:11:12");
//const juanFecha=moment('2014-02-27T10:00:00','D/M/YYYY').toDate()-->invalid date
console.log('Juan fecha', juanFecha)

const pedroFecha = new Date("2020-06-01T10:11:12");


const monicaFecha = new Date("2016-08-01T10:11:12.123456-0500")



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(MatTable, { static: true }) tablaEmploye!: MatTable<EMPLOYEE[]>;
  modiSource: EMPLOYEE[]
  EMPLOYEE_DATA: EMPLOYEE[] = [
    {
      name: "Juan",
      sueldo: 1000,
      cargo: 'Gerente Sistemas',
      inicio: juanFecha
    },
    {
      name: "Pedro",
      sueldo: 200,
      cargo: 'Empleado',
      inicio: pedroFecha
    },
    {
      name: "Monica",
      sueldo: 500,
      cargo: 'Jefa Sistemas',
      inicio: monicaFecha
    },
  ]
  MonicaFecha !: Date
  displayedColumns: string[] = ['name', 'sueldo', 'cargo', 'inicio'];
  dataSource: EMPLOYEE[]

  constructor(@Inject(LOCALE_ID) private locale: string, private snackbar: MatSnackBar) {
    this.MonicaFecha = monicaFecha
  }
  ngOnInit(): void {
    let dateString = 'Thu Jul 15 2016 19:31:44 GMT+0200 (CEST)';
    let dateObj = new Date(dateString);
    let momentObj = moment(dateObj).toDate()
  
    let juanFecha = momentObj
    console.log('juan Fecha', juanFecha, juanFecha)

    this.FirstSource()

  }
  date = new Date();
  FirstSource() {
    if (this.dataSource == undefined) {
      this.dataSource = this.EMPLOYEE_DATA;

    } else {
      this.dataSource = this.modiSource

    }

  }
  changeSource(newSource) {
    this.dataSource = newSource;

  }
   UpdateFecha (objeto: any, fechaIngreso: string) {

      //let tolocal = moment(fechaIngreso).toISOString()
      // if (moment(tolocal, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').isValid())
       //console.log('Locale:', moment(tolocal).isValid(), 'moment(tolocal):', moment(tolocal));
       // console.log('objeto:',objeto);
       console.log('fechaIngreso:',moment(fechaIngreso) )
       //fechaIngreso: 1/6/2020
       //let fecha = moment(tolocal, 'D/M/YYYY').format('D/M/YYYY');
      //console.log('fecha:',fecha)-->invalid date

    if (moment(fechaIngreso,'D/M/YYYY').isValid()) {
 
      
      this.modiSource = this.dataSource.map(obj => 
        obj.name == objeto.name && fechaIngreso !== undefined ? {
        ...obj, inicio: moment(fechaIngreso,'D/M/YYYY').toDate()
      } : obj);
      this.changeSource(this.modiSource)

       console.log('this modiSource:',this.modiSource)
    }

    else {
      this.modiSource = this.dataSource.map(obj => obj)
      console.log('fechaIngreso', fechaIngreso)
      let snackBar = this.snackbar.open('La Fecha del Ingreso debe ser de tipo fecha', 'fecha Aval', { duration: 3000 });
    }

  }

}


 //Date Tue Jan 08 2019 00:00:00 GMT-0300 (hora estándar de Argentina)
​



     


/*

// Formato RFC2822
//const juanFecha=new Date("Thu, 01 Feb 2018 18:30:00 GMT");
const juanFecha=moment(new Date("2016-03-01T18:30:00.000Z"),'YYYY MM DD  HH:mm:ss ZZ').toDate();
//const juanFecha=moment('2014-02-27T10:00:00','D/M/YYYY').toDate()2016-08-01T10:11:12.123456-0500
console.log('Juan fecha',juanFecha)
// ISO 8601 año-mes-día horas-minutos-segundos
//// Formato iso:
const pedroFecha=moment(new Date("2019-04-01T18:30:00.000Z"),'YYYY MM DD  HH:mm:ss ZZ').toDate();
// RFC 2822 invalid
// formato ISO 
const monicaFecha=moment(new Date("2018-02-01T18:30:00.000Z"),'YYYY MM DD  HH:mm:ss ZZ').toDate();


*/