import { Invitacion } from '../../models/invitacion';
import { Concurso } from './concurso';
export class Oferta {
  id: string;
  idPresentada: string;
  descripcion: string;
  fechaPublicacion: Date;
  fechaAperturaTecnica: Date;
  fechaAperturaEconomica: Date;
  fechaAdjudicacion: Date;
  fechaInteres: Date;
  fechaPresentacionFulcrum: Date;
  fechaInsercion: Date;
  pedirPliego: string;
  pliegoRecibido: string;
  responsableOferta: number;
  responsableTecnico: number;
  interesa: string;
  presentada: string;
  comentarios: string;
  horaAperturaTecnica: string;
  horaAperturaEconomica: string;
  comentarioAperturaTecnica: string;
  comentarioAperturaEconomica: string;
  nacional: boolean;
  pais: string;
  provincia: string;
  poblacion: string;
  operador: string;
  concursoId: number;
  añoPresentada: number;
  organismoId: number;
  organismoNombre: string;
  presupuesto: number;
  responsableOfertaNombre: string;
  responsableTecnicoNombre: string;
  origen:string;

  concurso: Concurso;
  invitacion:Invitacion;
}


