import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CONTROLS} from 'src/app/constants/constants';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  public formGroup: FormGroup;

  public controls: any[] = CONTROLS;

  private subscriptions: Subscription[] = [];

  constructor() {
    this.formGroup = this.fb.group({});

    const proxyForm = this.createProxy(this.formGroup);

    this.controls.forEach((ctrl) => {
      if (ctrl.show) {
        const {name, control} = ctrl.toFormControl();
        proxyForm.addControl(name, control);
      }
    });
  }

  public submit() {
    console.log(this.formGroup.value);
  }

  public patch() {
    this.formGroup.patchValue({
      age: '20',
      desc: 'Hola',
      place: 'mx',
      country: 'dos'
    });
  }

  trackByFn(index: number, item: any): number {
    return item.name;
  }

  /**
   * Will intercept all addControl calls from FormGroup
   * and will start to listen changes on the control
   * to avoid calling listenChanges after every addControl on all places
   * @param target
   * @private
   */
  private createProxy(target: FormGroup): FormGroup {
    const handler = {
      get: (target: any, prop: string, receiver: FormGroup) => {
        if (prop === 'addControl') {
          return (name: string, control: any) => {
            const result = Reflect.apply(target[prop], target, [name, control]);
            const ctrl = this.controls.find((c) => c.name === name);
            if (ctrl.detectChanges) {
              const sub = ctrl.listenChanges(this.controls, receiver, (control: object) => {
                this.controls = [...this.controls];
                this.cdr.detectChanges();
              });
              if (sub) {
                this.subscriptions = [sub];
              }
            }
            return result;
          }
        }
        return target[prop];
      }
    }
    return new Proxy(target, handler);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
