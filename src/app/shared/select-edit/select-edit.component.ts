import { ParameterService } from '../parameter.service';
import { Component, Input } from "@angular/core";
import { SatPopover } from "@ncstate/sat-popover";
import { Organismo } from "../../ofertas/models/organismo";
import { Responsable } from '../..//ofertas/models/responsable';

@Component({
  selector: 'select-edit',
  styleUrls: ['select-edit.component.scss'],
  templateUrl: 'select-edit.component.html'
})
export class SelectEditComponent {
  @Input()
  value:string;

  @Input()
  origen:string;

  get organismos(): Organismo[] {
    return this.parameterService.organismos
  }

  set organismos(value: Organismo[]) {
    this.parameterService.organismos = value
  }

  get responsables(): Responsable[] {
    return this.parameterService.responsables
  }

  set responsables(value: Responsable[]) {
    this.parameterService.responsables = value
  }

  organismoSeleccionado:Organismo;
  responsableSeleccionado:Responsable;

  elementoSeleccionado:any;


  constructor(public popover: SatPopover, private parameterService:ParameterService) { }

  onElementoSeleccionado(elemento:any){
    //this.organismoSeleccionado=organismo;
    this.elementoSeleccionado=elemento;
  }


  onSubmit() {
    //console.log('origen',this.origen);
    //console.log('valor length',this.comment.length);
    if (this.popover) {
      //this.value=this.organismoSeleccionado.nombre;
      //this.popover.close(this.organismoSeleccionado);
      this.origen=="organismos"
        ? this.value=this.elementoSeleccionado.nombre
        : this.value=this.elementoSeleccionado.nombreCompleto

      this.popover.close(this.elementoSeleccionado);

    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
