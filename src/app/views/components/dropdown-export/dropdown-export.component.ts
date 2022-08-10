import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-export',
  templateUrl: './dropdown-export.component.html',
  styleUrls: ['./dropdown-export.component.scss']
})
export class DropdownExportComponent implements OnInit {
  @Output() export?: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  exporter(type) {
    this.export.emit(type)
  }

}
