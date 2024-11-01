import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewElectronicComponentComponent } from './view-electronic-component.component';

describe('ViewElectronicComponentComponent', () => {
  let component: ViewElectronicComponentComponent;
  let fixture: ComponentFixture<ViewElectronicComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewElectronicComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewElectronicComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
