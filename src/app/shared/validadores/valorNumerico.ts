import { AbstractControl, ValidatorFn } from "@angular/forms";

export function valorNumerico():ValidatorFn{
  return(control:AbstractControl)=>{
    let valor=control.value;
    if(!valor) return null;
    if(valor.length===0) return null;

    if (isNaN(control.value)) {
      return {
        NaN:{mensaje:'El importe ha de ser un valor numérico'}
      };
    }

    return null;
  }
}