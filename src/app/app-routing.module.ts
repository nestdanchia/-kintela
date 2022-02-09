import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearAvalComponent } from './avales/crear-aval/crear-aval.component';
import { FiltroAvalesComponent } from './avales/filtro-avales/filtro-avales.component';
import { FiltroConcursosComponent } from './concursos/filtro-concursos/filtro-concursos.component';
import { CrearInvitacionComponent } from './invitaciones/crear-invitacion/crear-invitacion.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FiltroOfertasComponent } from './ofertas/filtro-ofertas/filtro-ofertas.component';

const routes: Routes = [
  { path: 'ofertas/buscar', component: FiltroOfertasComponent },
  { path: 'invitaciones/crear', component: CrearInvitacionComponent },
  { path: 'concursos/buscar', component: FiltroConcursosComponent },
  //{ path: 'plicas', component: IndicePlicasComponent },
  { path: 'avales', component: FiltroAvalesComponent },
  { path: 'avales/crear', component: CrearAvalComponent },
  //{ path: 'licitadores', component: IndiceLicitadoresComponent },
  //{ path: 'licitadores/crear', component: CrearLicitadorComponent },
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
