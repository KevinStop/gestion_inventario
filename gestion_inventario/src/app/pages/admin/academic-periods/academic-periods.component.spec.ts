import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicPeriodsComponent } from './academic-periods.component';

describe('AcademicPeriodsComponent', () => {
  let component: AcademicPeriodsComponent;
  let fixture: ComponentFixture<AcademicPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicPeriodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
