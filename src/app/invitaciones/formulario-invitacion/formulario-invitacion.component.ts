import { ParameterService } from './../../shared/parameter.service';
import { Organismo } from './../../ofertas/models/organismo';
import { OfertasService } from './../../ofertas/ofertas.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Invitacion } from '../../models/invitacion';
import { valorNumerico } from '../../shared/validadores/valorNumerico';

@Component({
  selector: 'app-formulario-invitacion',
  templateUrl: './formulario-invitacion.component.html',
  styleUrls: ['./formulario-invitacion.component.scss']
})
export class FormularioInvitacionComponent implements OnInit {
  @ViewChild('formDirective') private formDirective:NgForm;
  form: FormGroup;

  @Input()
  modelo: Invitacion;

  @Output()
  OnSubmit: EventEmitter<Invitacion> = new EventEmitter<Invitacion>();

  get organismos(): Organismo[] {
    return this.parameterService.organismos
  }

  set organismos(value: Organismo[]) {
    this.parameterService.organismos = value
  }

  alBuscador: any;
  organismoSeleccionado:Organismo;


  constructor(private formBuilder: FormBuilder, private dataService: OfertasService, private parameterService:ParameterService) { }

  ngOnInit(): void {

    this.inicializaFormulario();

    if(this.organismos.length==0){
      this.dataService.getOrganismos()
      .subscribe(
        data => {
          this.alBuscador = data;
          this.organismos=data;
        },
        err => console.error(err),
        () => {

        }
      );
    }
  }

  inicializaFormulario(){
    this.form = this.formBuilder.group({
      descripcion: ['',{
        validators:[Validators.required]
      }],
      plazo: ['',{
        validators:[Validators.required]
      }],
      fechaPresentacion: ['',{
        validators:[Validators.required]
      }],
      clasificacion: '',
      expediente: '',
      presupuesto: ['',{
        validators:[Validators.required, valorNumerico()]
      }],
      organismo: ['',{
        validators:[Validators.required]
      }]
    });

    if (this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
    }
  }



  onOrganismoSeleccionado(organismo:Organismo){
    //console.log('organismo seleccionado en el formulario', organismo);
    this.organismoSeleccionado=organismo;
    this.form.patchValue({organismo:this.organismoSeleccionado})
  }

  obtenerErrorCampoPresupuesto():string{
    var campo=this.form.get('presupuesto');
    if(campo.hasError('required')){
      return 'El campo Presupuesto es obligatorio'
    }

    if(campo.hasError('NaN')){
      return campo.getError('NaN').mensaje;
    }

    return ''

  }

  guardarCambios() {
    //console.log('valores formulario', this.form.value);
    //console.log('organismo seleccionado', this.organismoSeleccionado);
    this.OnSubmit.emit(this.form.value);
    this.formDirective.resetForm();
    this.parameterService.limpiarBuscador(true);

  }

}
