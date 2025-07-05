import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIngresos } from './reporte-ingresos';

describe('ReporteIngresos', () => {
  let component: ReporteIngresos;
  let fixture: ComponentFixture<ReporteIngresos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteIngresos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteIngresos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
