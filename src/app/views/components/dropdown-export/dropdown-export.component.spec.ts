import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownExportComponent } from './dropdown-export.component';

describe('DropdownExportComponent', () => {
  let component: DropdownExportComponent;
  let fixture: ComponentFixture<DropdownExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
