import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFormTableComponent } from './order-form-table.component';

describe('OrderFormTableComponent', () => {
  let component: OrderFormTableComponent;
  let fixture: ComponentFixture<OrderFormTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderFormTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
