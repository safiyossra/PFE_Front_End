import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlanentretienaTableComponent } from './my-planentretien-table.component';

describe('MyPlanentretienaTableComponent', () => {
  let component: MyPlanentretienaTableComponent;
  let fixture: ComponentFixture<MyPlanentretienaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPlanentretienaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPlanentretienaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
