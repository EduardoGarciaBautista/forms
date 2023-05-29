import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subscription} from 'rxjs';
import {ControlBase, ControlType} from 'src/app/interfaces/control.interface';

export class Control<T> implements ControlBase<T> {

  label: string = '';
  placeholder: string = '';
  name: string = '';
  tag: string = '';
  type?: ControlType | undefined = 'text';
  show?: boolean | undefined = true;
  validators: ValidatorFn[] = [];
  detectChanges: boolean = false;
  detectChangesDelay?: number | undefined = 0;

  create(
    props: Partial<T>
  ): ControlBase<T> {
    Object.assign(this, props);
    return this;
  }

  toFormControl(): { name: string; control: FormControl<any> } {
    return {name: this.name, control: new FormControl('', this.validators)};
  }

  listenChanges(
    nativeControls: object[],
    form: FormGroup<any>,
    callback?: Function,
  ): Subscription | null {
    if (!this.detectChanges) {
      return null;
    }
    const currentControl = form.get(this.name);

    if (!currentControl) {
      return null;
    }
    return currentControl.valueChanges.pipe(
      debounceTime(this.detectChangesDelay || 0),
      distinctUntilChanged(),
    ).subscribe((value: any) => {
      this.dependencies(form, nativeControls, value);
      if (callback) {
        callback(this);
      }
    });
  }

  dependencies = (form: FormGroup<any>, nativeControls: object[], value: any) => {
  };

  get props(): object {
    return {
      label: this.label,
      placeholder: this.placeholder,
      name: this.name,
      type: this.type,
    };
  }
}

export class ControlRadio extends Control<ControlRadio> {
  controlGroup!: {
    label: string;
    id: string;
    value: string;
    message?: string;
  }[];
}

export class ControlTexArea extends Control<ControlTexArea> {
  message: string = '';
  rows: number = 10;
  cols: number = 5;

  public override get props(): Partial<ControlTexArea> {
    return {
      label: this.label,
      placeholder: this.placeholder,
      name: this.name,
      type: this.type,
      rows: this.rows,
      cols: this.cols,
    };
  }
}

export class ControlSelect extends Control<ControlSelect> {
  options: string[] = [];
}
