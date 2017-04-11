export interface Action<T> {
  namespace: string;
  type: string;
  data: T;
  [key: string]: any;
}
