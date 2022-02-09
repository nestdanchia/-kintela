import { Oferta } from '../models/oferta';
import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-oferta',
  templateUrl: './crear-oferta.component.html',
  styleUrls: ['./crear-oferta.component.scss']
})
export class CrearOfertaComponent  {

  constructor() { }


  guardarCambios(oferta: Oferta) {
    console.log(oferta);
  }

}
