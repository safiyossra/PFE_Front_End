import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyDateRangePickerComponent } from './my-daterangepicker.component';

describe('MyDaterangepickerComponent', () => {
  let component: MyDateRangePickerComponent;
  let fixture: ComponentFixture<MyDateRangePickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MyDateRangePickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
