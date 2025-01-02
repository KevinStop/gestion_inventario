import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMovementComponent } from './component-movement.component';

describe('ComponentMovementComponent', () => {
  let component: ComponentMovementComponent;
  let fixture: ComponentFixture<ComponentMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentMovementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
