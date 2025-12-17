// Copyright 2025-2026 the @mskr/data-structures authors. All rights reserved. MIT license.

/**
 * Error thrown when attempting to perform operations on an empty data structure.
 * @extends Error
 */
export class EmptyStructureError extends Error {
  /**
   * Creates a new EmptyStructureError instance.
   * @param message Optional error message
   */
  constructor(message = 'Operation cannot be performed on empty structure') {
    super(message);
    this.name = 'EmptyStructureError';
  }
}

/**
 * Error thrown when attempting to access an index that is out of bounds.
 * @extends Error
 */
export class IndexOutOfBoundsError extends Error {
  /**
   * Creates a new IndexOutOfBoundsError instance.
   * @param message Optional error message
   */
  constructor(message = 'Index is out of bounds') {
    super(message);
    this.name = 'IndexOutOfBoundsError';
  }
}

/**
 * Error thrown when an invalid operation is attempted.
 * @extends Error
 */
export class InvalidOperationError extends Error {
  /**
   * Creates a new InvalidOperationError instance.
   * @param message Optional error message
   */
  constructor(message = 'Invalid operation') {
    super(message);
    this.name = 'InvalidOperationError';
  }
}
