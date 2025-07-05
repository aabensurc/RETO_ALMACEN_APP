import { TestBed } from '@angular/core/testing';

import { IngresoProducto } from './ingreso-producto';

describe('IngresoProducto', () => {
  let service: IngresoProducto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresoProducto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
