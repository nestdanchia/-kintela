import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SAPService } from './shared/sap.service';
import { OfertasService } from './ofertas/ofertas.service';
import { ConcursosService } from './concursos/concursos.service';
import { InvitacionesService } from './invitaciones/invitaciones.service';
import { ParameterService } from './shared/parameter.service';
import { AvalesService } from './avales/avales.service';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { MenuComponent } from './menu/menu.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CrearAvalComponent } from './avales/crear-aval/crear-aval.component';
import { FormularioAvalesComponent } from './avales/formulario-avales/formulario-avales.component';
import { ListadoAvalesComponent } from './avales/listado-avales/listado-avales.component';
import { FiltroOfertasComponent } from './ofertas/filtro-ofertas/filtro-ofertas.component';
import { ListadoGenericoComponent } from './shared/listado-generico/listado-generico.component';
import { ListadoConcursosComponent } from './concursos/listado-concursos/listado-concursos.component';
import { CrearInvitacionComponent } from './invitaciones/crear-invitacion/crear-invitacion.component';
import { FiltroConcursosComponent } from './concursos/filtro-concursos/filtro-concursos.component';
import { BuscadorComponent } from './shared/buscador/buscador.component';
import { ListadoOfertasComponent } from './ofertas/listado-ofertas/listado-ofertas.component';
import { FiltroAvalesComponent } from './avales/filtro-avales/filtro-avales.component';
import { FormularioOfertaComponent } from './ofertas/formulario-oferta/formulario-oferta.component';
import { CrearOfertaComponent } from './ofertas/crear-oferta/crear-oferta.component';
import { SelectorMultipleComponent } from './shared/selector-multiple/selector-multiple.component';
import { DialogComponent } from './shared/dialog-component/dialog.component';
import { InlineEditComponent } from './shared/inline-edit/inline-edit.component';
import { SelectEditComponent } from './shared/select-edit/select-edit.component';
import { FormularioInvitacionComponent } from './invitaciones/formulario-invitacion/formulario-invitacion.component';
import { MomentPipe } from './moment.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LandingPageComponent,
    CrearAvalComponent,
    FormularioAvalesComponent,
     ListadoAvalesComponent,
     FiltroAvalesComponent,
     FiltroOfertasComponent,
     ListadoOfertasComponent,
     FormularioOfertaComponent,
     CrearOfertaComponent,
     ListadoGenericoComponent,
     SelectorMultipleComponent,
     DialogComponent,
     InlineEditComponent,
     SelectEditComponent,
     ListadoConcursosComponent,
     FiltroConcursosComponent,
     CrearInvitacionComponent,
     FormularioInvitacionComponent,
     BuscadorComponent,
     MomentPipe
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SatPopoverModule
  ],
  providers: [OfertasService, ConcursosService, InvitacionesService, ParameterService, AvalesService, SAPService],
  bootstrap: [AppComponent]
})
export class AppModule { }
