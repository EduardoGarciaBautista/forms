export interface CreateControl<T> {
  create: (props: T) => T;
}