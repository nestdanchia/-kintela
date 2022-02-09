import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Aval } from '../../models/aval';
import { Avalista } from '../../models/avalista';
import { EstadoAval } from '../../models/estadoAval';
import { TipoAval } from '../../models/tipoAval';
import { Oferta } from '../../ofertas/models/oferta';
import { OfertasService } from '../../ofertas/ofertas.service';
import { ParameterService } from '../../shared/parameter.service';
import { valorNumerico } from '../../shared/validadores/valorNumerico';
import { AvalesService } from '../avales.service';

@Component({
  selector: 'app-formulario-avales',
  templateUrl: './formulario-avales.component.html',
  styleUrls: ['./formulario-avales.component.scss']
})
export class FormularioAvalesComponent implements OnInit {
  id:number=3;
  @ViewChild('formDirective') private formDirective!: NgForm;
  get ofertas(): Oferta[] {
    return this.parameterService.ofertas
  }

  set ofertas(value: Oferta[]) {
    this.parameterService.ofertas = value
  }

  get tipoAvales(): TipoAval[] {
    return this.parameterService.tipoAvales
  }

  set tipoAvales(value: TipoAval[]) {
    this.parameterService.tipoAvales = value
  }

  get estadoAvales(): EstadoAval[] {
    return this.parameterService.estadoAvales
  }

  set estadoAvales(value: EstadoAval[]) {
    this.parameterService.estadoAvales = value
  }

  get avalistas(): Avalista[] {
    return this.parameterService.avalistas
  }

  set avalistas(value: Avalista[]) {
    this.parameterService.avalistas = value
  }


  @Input()
  modelo!: Aval ;

  form!: FormGroup;

  @Output()
  OnSubmit: EventEmitter<Aval> = new EventEmitter<Aval>();

  tipoAvalSeleccionado!: TipoAval;

  estadoAvalSeleccionado!: EstadoAval;

  //avalistas: EstadoAval[] = [];
  avalistaSeleccionado!: EstadoAval;

  ofertaSeleccionada!: Oferta;

  constructor(private formBuilder: FormBuilder, private parameterService: ParameterService,
    private dataServiceOfertas: OfertasService, private dataServiceAvales: AvalesService) { }

  ngOnInit(): void {
    this.inicializaFormulario();

    if (this.ofertas.length == 0) {
      this.dataServiceOfertas.getOfertas()
        .subscribe(
          data => {
            this.ofertas = data;
          }
          , err => console.error(err)
          , () => {
            //console.log('Ofertas recien obtenidas al entrar a crear avales', this.ofertas);
          }
        );
    }
    else {
      //console.log('Ofertas obtenidas antes al entrar a crear avales', this.ofertas);
    }

    if (this.tipoAvales.length == 0) {
      this.dataServiceAvales.getTipoAvales()
        .subscribe(
          data => {
            this.tipoAvales = data;
          }
          , err => console.error(err)
          , () => {
            //console.log('Tipos Avales', this.tipoAvales)
          }
        );
    }

    if(this.estadoAvales.length==0){
      this.dataServiceAvales.getEstadoAvales()
      .subscribe(
        data => {
          this.estadoAvales = data;
        }
        , err => console.error(err)
        , () => { }
      );
    }

    if(this.avalistas.length==0){
      this.dataServiceAvales.getAvalistas()
      .subscribe(
        data => {
          this.avalistas = data;
        }
        , err => console.error(err)
        , () => { }
      );
    }
  }


  inicializaFormulario() {
    this.form = this.formBuilder.group({
      numero: ['', {
        validators: [Validators.required, Validators.maxLength(20)]
      }],
      importe: ['', {
        validators: [Validators.required, valorNumerico()]
      }],
      tipo: ['', {
        validators: [Validators.required]
      }],
      estado: ['', {
        validators: [Validators.required]
      }],
      avalista: ['', {
        validators: [Validators.required]
      }],
      oferta: ['', {
        validators: [Validators.required]
      }],
      fechaAval: '',
      fechaSolicitud: '',
      fechaAnulacion: '',
      fechaSolicitudDevolucion: '',
      fechaRecepcion: '',
      observaciones: ''
    });

    if (this.modelo != undefined) {
      this.form.patchValue(this.modelo);
    }

  }

  onOfertaSeleccionada(oferta: any) {
    //console.log('organismo seleccionado en el formulario', organismo);
    this.ofertaSeleccionada = oferta;
    this.form.patchValue({ oferta: this.ofertaSeleccionada })
  }

  onTipoAvalSeleccionado(tipoAvalSeleccionado: TipoAval) {
    //console.log('organismo seleccionado en el formulario', organismo);
    this.tipoAvalSeleccionado = tipoAvalSeleccionado;
    this.form.patchValue({ tipo: this.tipoAvalSeleccionado })
  }

  onEstadoAvalSeleccionado(estadoAvalSeleccionado: EstadoAval) {
    //console.log('organismo seleccionado en el formulario', organismo);
    this.estadoAvalSeleccionado = estadoAvalSeleccionado;
    this.form.patchValue({ estado: this.estadoAvalSeleccionado })
  }

  onAvalistaSeleccionado(avalistaSeleccionado: Avalista) {
    //console.log('organismo seleccionado en el formulario', organismo);
    this.avalistaSeleccionado = avalistaSeleccionado;
    this.form.patchValue({ avalista: this.avalistaSeleccionado })
  }

  getErrorCampoNumero(): string {
    var campo = this.form.get('numero');

    if (campo!.hasError('required')) {
      return 'El campo número es obligatorio'
    }
    if (campo!.hasError('maxlength')) {
      return 'La longitud máxima son 20 caracteres'
    }

    return ''
  }

  guardarCambios() {
    this.OnSubmit.emit(this.form.value);
    this.formDirective.resetForm();
    //this.parameterService.limpiarBuscador();
  }

}
