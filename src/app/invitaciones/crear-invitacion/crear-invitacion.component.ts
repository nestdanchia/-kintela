import { OfertasService } from './../../ofertas/ofertas.service';
import { Component, OnInit } from '@angular/core';
import { Invitacion } from '../../models/invitacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Oferta } from '../../ofertas/models/oferta';

@Component({
  selector: 'app-crear-invitacion',
  templateUrl: './crear-invitacion.component.html',
  styleUrls: ['./crear-invitacion.component.scss']
})
export class CrearInvitacionComponent implements OnInit {

  constructor(private dataService:OfertasService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
  }

  guardarCambios(datosFormulario: any) {
    console.log('datos formulario',datosFormulario);

    let ultimoID: number;

    this.dataService.getOfertasUltima()
    .subscribe(data=>{
      ultimoID = +data.id;
      },
      err=>console.error(err),
      ()=>{
        let id: number = ultimoID;

        let invitacion=new Invitacion();
        invitacion.descripcion=datosFormulario.descripcion;
        invitacion.plazo=datosFormulario.plazo;
        invitacion.clasificacion=datosFormulario.clasificacion;
        invitacion.expediente=datosFormulario.expediente;
        invitacion.fechaPresentacion=datosFormulario.fechaPresentacion;
        invitacion.importe=+datosFormulario.presupuesto;
        invitacion.organismoId=datosFormulario.organismo.id;

        let oferta = new Oferta();
        id = id + 1;
        oferta.id = id.toString();
        oferta.descripcion = invitacion.descripcion;
        oferta.fechaPresentacionFulcrum = invitacion.fechaPresentacion;
        oferta.fechaInsercion = new Date();
        oferta.pedirPliego = 'pt';
        oferta.pliegoRecibido = 'pt';
        oferta.responsableOferta = 0;
        oferta.responsableTecnico = 0;
        oferta.interesa = 'pt';
        oferta.presentada = 'pt';
        oferta.nacional = true;
        oferta.pais = 'España';
        oferta.invitacion=invitacion;
        oferta.origen="Invitación";

        console.log('Oferta a añadir', oferta);

        this.dataService.postInvitacion(oferta)
          .subscribe(data => {
          },
            err => console.error(err),
            () => {
              console.log('Invitación añadida correctamente');
              let snackBar = this.snackbar.open(`Se ha añadido la invitación correctamente`, '', { duration: 5000 });

            }
          );
      }
    );


  }

}
