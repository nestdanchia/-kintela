import { Component, Input, Optional, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'inline-edit',
  styleUrls: ['inline-edit.component.scss'],
  templateUrl: 'inline-edit.component.html'
})
export class InlineEditComponent {
  /** Overrides the comment and provides a reset value when changes are cancelled. */
  @Input()
  //value:string;
  get value(): string { return this._value; }
  set value(x: string) {
    this.comment = this._value = x;
  }

  @Input()
  origen:string;

  private _value = '';

  /** Form model for the input. */
  comment = '';

  //textoCabecera:string=`Editar ` {{}}

  //constructor(@Optional() @Host() public popover: SatPopover) { }

  constructor(@Optional() public popover: SatPopover) { }

  ngOnInit() {
    // subscribe to cancellations and reset form value
    if (this.popover) {
      this.popover.closed.pipe(filter(val => val == null))
        .subscribe(() => this.comment = this.value || '');
    }
  }

  onSubmit() {
    if (this.popover) {
      this.popover.close(this.comment);
    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }
}

