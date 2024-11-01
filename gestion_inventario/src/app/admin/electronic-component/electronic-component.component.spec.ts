import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicComponentComponent } from './electronic-component.component';

describe('ElectronicComponentComponent', () => {
  let component: ElectronicComponentComponent;
  let fixture: ComponentFixture<ElectronicComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectronicComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElectronicComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
