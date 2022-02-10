import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import * as moment from 'moment';
import { formatDate } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

export interface EMPLOYEE  {

  name: string;
  sueldo: number;
  cargo: string;
  inicio: Date;
}
const juanFecha=new Date("December 17, 1995 03:24:00");
const pedroFecha=new Date("December 17, 1995 03:24:00");
const monicaFecha=new Date("December 17, 1995 03:24:00")
const  EMPLOYEE_DATA :EMPLOYEE[]=[
  {
    name: "Juan",
    sueldo: 1000,
    cargo: 'Gerente Sistemas',
    inicio: juanFecha
  },
  {
    name: "Pedro",
    sueldo:200,
    cargo: 'Empleado',
    inicio: pedroFecha
  },
  {
    name: "Monica",
    sueldo: 500,
    cargo: 'Jefa Sistemas',
    inicio:monicaFecha
  },
]
  
  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'sueldo', 'cargo','inicio'];
  dataSource = EMPLOYEE_DATA ;
  
  constructor(@Inject(LOCALE_ID) private locale: string, private snackbar: MatSnackBar) { }
  ngOnInit(): void {
    const today = moment();
console.log(today.format());
    console.log(moment().format('HH:mm:ss')); // 16:13:11
    console.log( moment.utc().format('HH:mm:ss') )
 const formato=moment().format('YYYY-MM-DD');
console.log(formato);
console.log(moment("2020-01-01", "YYYY-MM-DD").isValid()); // true
console.log(moment("not-a-date", "YYYY-MM-DD").isValid()); // false

    
  }
date = new Date()
updateFechaAval(aval: any, fechaAval:Date) {
console.log(moment(fechaAval).isValid())
   console.log('Locale',moment.locale())
   if(moment(fechaAval).isValid()){
     aval.fecha = formatDate(fechaAval, 'dd-MM-yyyy', this.locale);
     console.log('aval con los cambios', aval.fecha);
     
   }
   else{
     console.log('fechaAval',fechaAval)
     let snackBar = this.snackbar.open('La Fecha del aval debe ser de tipo fecha','fecha Aval' , { duration: 3000 });
   }
 }

}
