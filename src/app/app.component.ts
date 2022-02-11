import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { formatDate } from "@angular/common";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
// time zone https://www.section.io/engineering-education/nodejs-date-and-time-objects-with-moment/
export interface EMPLOYEE  {

  name: string;
  sueldo: number;
  cargo: string;
  inicio: Date;
}


const juanFecha=new Date("2019-08-01T10:11:12");
//const juanFecha=moment('2014-02-27T10:00:00','D/M/YYYY').toDate()
console.log('Juan fecha',juanFecha)
// ISO 8601
const pedroFecha=new Date("2020-06-01T10:11:12");
// RFC 2822 invalid
// RFC 3339: año mes dia 
const monicaFecha=new Date("2016-08-01T10:11:12.123456-0500")

  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(MatTable,{ static: true }) tablaEmploye!: MatTable<EMPLOYEE[]>;
  modiSource:EMPLOYEE[]
 EMPLOYEE_DATA :EMPLOYEE[]=[
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
  MonicaFecha !:Date
  displayedColumns: string[] = ['name', 'sueldo', 'cargo','inicio'];
 dataSource :EMPLOYEE[]
  
  constructor(@Inject(LOCALE_ID) private locale: string, private snackbar: MatSnackBar) { 
    this.MonicaFecha=monicaFecha
  }
  ngOnInit(): void {
let dateString = 'Thu Jul 15 2016 19:31:44 GMT+0200 (CEST)';
let dateObj = new Date(dateString);
let momentObj = moment(dateObj).toDate()
//var momentString = momentObj.format('YYYY-MM-DD'); // 2016-07-15
let juanFecha=momentObj
console.log('juan Fecha',juanFecha,juanFecha)
    
this.FirstSource()
    
  }
date = new Date();
FirstSource()
{ 
  if(this.dataSource==undefined){
    this.dataSource = this.EMPLOYEE_DATA;
 
  } else{
    this.dataSource =this.modiSource
 
  }

}
changeSource(newSource){
   this.dataSource = newSource ;

}
updateFechaAval(aval: any, fechaAval:Date) {
console.log(moment(fechaAval).isValid());
console.log('aval:',aval.name)
   console.log('Locale',moment.locale());
   console.log('Fecha Ingreso',fechaAval)

   if(moment(fechaAval).isValid()){
   
   let fecha = moment(fechaAval,'D/M/YYYY').toDate()
   
    // console.log('aval con los cambios', fecha);
      this.modiSource=this.dataSource.map(obj=>obj.name==aval.name  && fechaAval !==undefined?{
       ...obj,inicio:fecha
      }:obj);
      this.changeSource(this.modiSource)
 
     
   }
   else{
    this.modiSource=this.dataSource.map(obj=>obj)
     console.log('fechaAval',fechaAval)
     let snackBar = this.snackbar.open('La Fecha del aval debe ser de tipo fecha','fecha Aval' , { duration: 3000 });
   }
   
 }
 
}
