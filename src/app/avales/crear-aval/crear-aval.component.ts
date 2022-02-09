import { ParameterService } from '../../shared/parameter.service';
import { AvalesService } from './../avales.service';
import { Aval } from './../../models/aval';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-aval',
  templateUrl: './crear-aval.component.html',
  styleUrls: ['./crear-aval.component.scss']
})
export class CrearAvalComponent {
  constructor(private router: Router, private dataServiceAvales: AvalesService, private snackbar: MatSnackBar, private parameterService: ParameterService) { }


  guardarCambios(datosFormulario: any) {
    console.log('datos formulario', datosFormulario);

    let aval = new Aval()



    aval.id = datosFormulario.numero;
    aval.tipoAvalId = datosFormulario.tipo;
    aval.avalistaId = datosFormulario.avalista;
    aval.estadoAvalId = datosFormulario.estado;
    aval.fecha = datosFormulario.fechaAval;
    aval.fechaAnulacion = datosFormulario.fechaAnulacion;
    aval.fechaRecepcion = datosFormulario.fechaRecepcion;
    aval.fechaSolicitud = datosFormulario.fechaSolicitud;
    aval.fechaSolicitudDevolucion = datosFormulario.fechaSolicitudDevolucion;
    aval.importe = datosFormulario.importe;
    aval.ofertaId = datosFormulario.oferta.id;
    aval.observaciones = datosFormulario.observaciones;

    this.dataServiceAvales.postAval(aval)
      .subscribe(data => {
        //console.log(data);
        this.parameterService.avalAñadidoCorrectamente(true);
      },
        err => {
          console.error(err);
          this.parameterService.avalAñadidoCorrectamente(false);
          if (err.status == 409) {
            let snackBar = this.snackbar.open(`Ya existe un aval con el número ${datosFormulario.numero}`, '', { duration: 5000 });
          }
          else {
            let snackBar = this.snackbar.open(`Se ha producido un error al intentar añadir el aval`, '', { duration: 5000 });
          }

        },
        () => {
          console.log('Aval añadido correctamente');
          let snackBar = this.snackbar.open(`Se ha añadido el aval correctamente`, '', { duration: 5000 });
        }
      );
  }
}
