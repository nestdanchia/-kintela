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

const juanFecha=new Date("2016-09-01T10:10:12");
console.log('Juan fecha',juanFecha)
// ISO 8601
const pedroFecha=new Date("2018-08-01T10:11:12");
// RFC 2822 invalid
// RFC 3339:
const monicaFecha=new Date("2016-09-01T10:11:12.123456-0500")

  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
    
  displayedColumns: string[] = ['name', 'sueldo', 'cargo','inicio'];
 dataSource :EMPLOYEE[]
  
  constructor(@Inject(LOCALE_ID) private locale: string, private snackbar: MatSnackBar) { }
  ngOnInit(): void {

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
   console.log('Locale',moment.locale())
   if(moment(fechaAval).isValid()){
  // let fecha = formatDate(fechaAval, 'dd-MM-yyyy', this.locale);
   // fecha es de tipo string
    // console.log('aval con los cambios', fecha);
      this.modiSource=this.dataSource.map(obj=>obj.name==aval.name?{
       ...obj,inicio:fechaAval
      }:obj);
      this.changeSource(this.modiSource)
     console.log(this.modiSource)
     
   }
   else{
     console.log('fechaAval',fechaAval)
     let snackBar = this.snackbar.open('La Fecha del aval debe ser de tipo fecha','fecha Aval' , { duration: 3000 });
   }
   
 }
 
}
