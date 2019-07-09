export class MockDate extends Date {
  constructor(datetime?: number) {
    super(datetime || 3141592653589)
    return this
  }

  static now() {
    return 3141592653589
  }
}
