export class Option<T = any> {
  constructor(
    public label: string,
    public value: T,
  ) {}
}
