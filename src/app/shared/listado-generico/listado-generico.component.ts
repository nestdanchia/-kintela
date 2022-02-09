import { ParameterService } from '../../shared/parameter.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-listado-generico',
  templateUrl: './listado-generico.component.html',
  styleUrls: ['./listado-generico.component.scss']
})
export class ListadoGenericoComponent implements OnChanges {
  @Input()
  listado;

  constructor(private parameterService: ParameterService) { }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('concursos en listado-generico ngOnChanges', this.listado);
  }

}
