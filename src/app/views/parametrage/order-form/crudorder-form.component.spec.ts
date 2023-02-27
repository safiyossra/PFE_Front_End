import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudorderFormComponent } from './crudorder-form.component';

describe('CrudorderFormComponent', () => {
  let component: CrudorderFormComponent;
  let fixture: ComponentFixture<CrudorderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudorderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudorderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
