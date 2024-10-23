export class EmptyStructureError extends Error {
  constructor(message = 'Operation cannot be performed on empty structure') {
    super(message);
    this.name = 'EmptyStructureError';
  }
}

export class IndexOutOfBoundsError extends Error {
  constructor(message = 'Index is out of bounds') {
    super(message);
    this.name = 'IndexOutOfBoundsError';
  }
}

export class InvalidOperationError extends Error {
  constructor(message = 'Invalid operation') {
    super(message);
    this.name = 'InvalidOperationError';
  }
}
