import { ParameterService } from '../../shared/parameter.service';
import { OfertasService } from './../ofertas.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Responsable } from '../models/responsable';
import { Oferta } from '../models/oferta';
import { TipoOferta } from '../models/tipoOferta';
import { Organismo } from '../models/organismo';

interface Opcion {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-formulario-oferta',
  templateUrl: './formulario-oferta.component.html',
  styleUrls: ['./formulario-oferta.component.scss']
})
export class FormularioOfertaComponent implements OnInit {
  get organismos(): Organismo[] {
    return this.parameterService.organismos
  }

  set organismos(value: Organismo[]) {
    this.parameterService.organismos = value
  }

  form: FormGroup;
  responsables: Responsable[] = [];
  tipos: TipoOferta[] = [];

  opciones: Opcion[] = [
    { value: 'Sí', viewValue: 'Sí' },
    { value: 'No', viewValue: 'No' },
    { value: 'pt', viewValue: 'Pendiente' }
  ];

  @Input()
  modelo: Oferta;

  @Output()
  OnSubmit: EventEmitter<Oferta> = new EventEmitter<Oferta>();

  constructor(private formBuilder: FormBuilder, private dataService: OfertasService, private parameterService:ParameterService) { }


  ngOnInit(): void {
    this.dataService.getResponsables()
      .pipe(
        tap(item => console.log(item))
      )
      .subscribe(
        data => {
          this.responsables = data;
        }
      )
      , err => console.log(err),
      () => { };

    this.dataService.getTiposOfertas()
      .pipe(
        tap(item => console.log(item))
      )
      .subscribe(
        data => {
          this.tipos = data;
        }
      )
      , err => console.log(err),
      () => { };

    this.form = this.formBuilder.group({
      id: '',
      descripcion: '',
      fechaPresentacionFulcrum: '',
      nacional: true,
      pedirPliego: true,
      pliegoRecibido: false,
      responsableOferta: '',
      responsableTecnico: '',
      interesa: '',
      presentada: '',
      pais: 'España',
      tipo: ''
    });

    if (this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
    }


  }

  guardarCambios() {
    this.OnSubmit.emit(this.form.value);
  }

}


