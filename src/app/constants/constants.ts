import {FormGroup, Validators} from '@angular/forms';
import {
  Control,
  ControlRadio,
  ControlSelect,
} from '../models/control/control-model';

export const CONTROLS = [
  new ControlRadio().create({
    label: 'Cuanto quieres pagar?',
    name: 'pay',
    tag: 'radio',
    controlGroup: [
      {
        label: 'El saldo pendiente',
        id: 'pending',
        value: '0',
      },
      {
        label: 'Otro monto',
        id: 'other',
        value: '1',
      }
    ],
    detectChanges: true,
    validators: [Validators.required],
    dependencies: (form: FormGroup<any>, nativeControls: object[], value: any) => {
      const controls = nativeControls.filter((ctrl: any) => ctrl.name === 'amount' || ctrl.name === 'payApplication');
      controls.forEach((ctrl: any) => {
        ctrl.show = value === '1';
        if (ctrl.show) {
          form.addControl(ctrl.name, ctrl.toFormControl().control);
        } else {
          form.removeControl(ctrl.name);
        }
      });
    }
  }),
  new Control().create({
    label: 'Ingresa el monto que quieres pagar',
    name: 'amount',
    tag: 'input',
    type: 'text',
    validators: [Validators.required],
    show: false
  }),
  new ControlRadio().create({
    label: 'Como quieres que aplique tu pago?',
    name: 'payApplication',
    tag: 'radio',
    controlGroup: [
      {
        label: 'Aplicar a cuota',
        id: 'quota',
        value: '0',
      },
      {
        label: 'Aplicar a plazo',
        id: 'term',
        value: '1',
      }
    ],
    validators: [Validators.required],
    show: false,
  }),
  new ControlRadio().create({
    label: 'Ya pagaste los MXN?',
    name: 'alreadyPay',
    tag: 'radio',
    controlGroup: [
      {
        label: 'Si',
        id: 'si',
        value: '1',
      },
      {
        label: 'No',
        id: 'no',
        value: '0',
      }
    ],
    validators: [Validators.required],
  }),
  new ControlRadio().create({
    label: 'donde te encuentras en este momento?',
    name: 'place',
    tag: 'radio',
    controlGroup: [
      {
        label: 'En mexico',
        id: 'mx',
        value: 'mx',
      },
      {
        label: 'En el extranjero',
        id: 'ext',
        value: 'ext',
      }
    ],
    validators: [Validators.required],
    detectChanges: true,
    dependencies: (form: FormGroup<any>, nativeControls: object[], value: any) => {
      const control = nativeControls.find((ctrl: any) => ctrl.name === 'state') as ControlSelect;
      if (!control) {
        return;
      }
      control.show = value === 'mx';
      if (control.show) {
        form.addControl(control.name, control.toFormControl().control);
      } else {
        form.removeControl(control.name);
      }
    }
  }),
  new ControlSelect().create({
    label: 'Selecciona la entidad federativa donde te encuentras',
    name: 'state',
    tag: 'select',
    placeholder: 'Selecciona una opcion',
    options: [
      'Aguascalientes',
      'Baja California',
      'Baja California Sur',
    ],
    show: false,
    validators: [Validators.required],
  }),
];
