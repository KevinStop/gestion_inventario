import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoansSummaryComponent } from './loans-summary.component';

describe('LoansSummaryComponent', () => {
  let component: LoansSummaryComponent;
  let fixture: ComponentFixture<LoansSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoansSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
