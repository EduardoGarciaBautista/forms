import {FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Subscription} from 'rxjs';

export type ControlType = 'text' | 'number' | 'radio' | 'select';

export interface ControlBase<T> {
  /**
   * @description Control label text
   */
  label: string;
  /**
   * @description Control placeholder text
   */
  placeholder: string;
  /**
   *  @description Control name
   */
  name: string;
  /** @description Control tag input, text area etc */
  tag: string;
  /**
   * @description Control type(text, number, radio, select, textarea)
   */
  type?: ControlType;
  /**
   * @description Show or hide the control
   */
  show?: boolean;
  /**
   * @description Control array validators
   */
  validators: ValidatorFn[];

  /**
   * @description Validate if want to listen control changes
   */
  detectChanges: boolean;

  /**
   * @description Delay to execute detect changes
   */
  detectChangesDelay?: number;

  /**
   * @description Create a partial instance of Control
   * @param {Partial} props
   */
  create(props: Partial<T>): ControlBase<T>;

  /**
   * @description Create an object to use as form control
   */
  toFormControl(): { name: string; control: FormControl };

  /**
   * Start to listen value changes of control
   * @param nativeControls - the native list of controls
   * @param form - The form created using native control list
   * @param callback - Function - used to execute tasks after value
   * change(normally detect changes)
   */
  listenChanges(nativeControls: object[], form: FormGroup, callback?: Function): Subscription | null;

  /**
   * @description Control method for custom logic on control value change
   * @param form - The form created using native control list
   * @param nativeControls - the native list of controls
   * @param value - The current value of control
   * @returns a subscription to unsubscribe
   */
  dependencies: (form: FormGroup, nativeControls: object[], value: any) => void;

  /**
   * @description Get principal or control props
   */
  get props(): object;
}
