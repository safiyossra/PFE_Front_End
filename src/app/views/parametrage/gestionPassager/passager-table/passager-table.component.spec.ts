import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassagerTableComponent } from './passager-table.component';

describe('PassagerTableComponent', () => {
  let component: PassagerTableComponent;
  let fixture: ComponentFixture<PassagerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassagerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassagerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
