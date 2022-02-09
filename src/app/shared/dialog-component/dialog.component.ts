import { OfertasService } from './../../ofertas/ofertas.service';
import { Oferta } from './../../ofertas/models/oferta';
import { ParameterService } from '../parameter.service';
import { ConcursosService } from '../../concursos/concursos.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  texto: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private dataServiceConcursos: ConcursosService, private parameterService: ParameterService
    , private dataServiceOfertas: OfertasService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    switch (this.data.origen) {
      case "EstudiarConcursos":
        if (this.data.data.filter(d => d.estudiar == 'SI').length > 0) {
          this.texto = "¿Estás seguro de querer actualizar los siguientes concursos y crear las correspondientes Ofertas?"
        }
        else {
          this.texto = "¿Estás seguro de querer actualizar los siguientes concursos?"
        }
        break;
    }
  }


  actualizarEstudiarConcursos() {
    this.dataServiceConcursos.updateConcursosAEstudiar(this.data.data)
      .subscribe(data => {
      },
        err => console.log(err),
        () => {
          this.parameterService.updateConcursosAEstudiar(true);
          console.log('Concursos actualizados');
          if (this.data.data.filter(d => d.estudiar == 'SI').length > 0) {
            this.ConvertirEnOferta(this.data.data);
          }
          else {
            let snackBar = this.snackbar.open(`Se han actualizado los ${this.data.data.length} concursos correctamente`, '', { duration: 5000 });
          }
        }
      );
  }

  private ConvertirEnOferta(concursos: any) {
    //console.log('intenta convertir en oferta tras suscribise al actualizarEstudiarConcursos');
    let ofertas: Oferta[] = [];
    let ultimoID: number;

    this.dataServiceOfertas.getOfertasUltima()
      .subscribe(data => {
        ultimoID = +data.id;
        console.log('ultimo id de Oferta', ultimoID);
      },
        err => console.error(err),
        () => {
          let id: number = ultimoID;
          for (let concurso of concursos) {
            if (concurso.estudiar == 'SI') {
              let oferta = new Oferta();
              id = id + 1;
              oferta.id = id.toString();
              oferta.descripcion = concurso.descripcion;
              oferta.fechaPresentacionFulcrum = concurso.fechaOrientativa;
              oferta.fechaInsercion = concurso.fechaInsercion;
              oferta.pedirPliego = 'pt';
              oferta.pliegoRecibido = 'pt';
              oferta.responsableOferta = 0;
              oferta.responsableTecnico = 0;
              oferta.interesa = 'pt';
              oferta.presentada = 'pt';
              oferta.nacional = true;
              oferta.pais = 'España';
              oferta.concursoId = concurso.id;

              ofertas.push(oferta);
            }
          }

          console.debug('Ofertas a añadir', ofertas);

          this.dataServiceOfertas.postOfertas(ofertas)
            .subscribe(data => {
            },
              err => console.error(err),
              () => {
                console.log('Ofertas añadidas correctamente');
                let snackBar = this.snackbar.open(`Se han añadido las ${ofertas.length} ofertas correctamente`, '', { duration: 5000 });
              }
            );
        }
      );
  }
}

