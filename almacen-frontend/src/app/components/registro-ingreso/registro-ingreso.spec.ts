import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIngreso } from './registro-ingreso';

describe('RegistroIngreso', () => {
  let component: RegistroIngreso;
  let fixture: ComponentFixture<RegistroIngreso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroIngreso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroIngreso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
