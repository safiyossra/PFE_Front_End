import { Component, EventEmitter, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';

export interface Option {
  name: String
  selected: Boolean
}

@Component({
  selector: 'my-dropdown-checkbox',
  templateUrl: './dropdown-checkbox.component.html',
  styleUrls: ['./dropdown-checkbox.component.scss']
})

export class DropdownCheckboxComponent implements OnInit {

  @Input() options: String[]
  @Input() selected?: String[]

  myOptions: Option[] = []


  @Output() changeDisplayedColumn?: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    console.log(this.options);

    this.options.forEach(op => {
      this.myOptions.push(
        {
          name: op,
          selected: this.selected.includes(op)
        }
      )
    })

  }

  allChecked: boolean = true;

  onChange() {
    let result = []
    for (let i = 0; i < this.myOptions.length; i++) {
      if (this.myOptions[i].selected) {
        result.push(this.myOptions[i].name)
      }
    }
    this.changeDisplayedColumn.emit(result)
  }

  updateAllComplete() {
    this.allChecked = this.myOptions.every(op => op.selected);
    this.onChange()
  }

  someChecked(): boolean {
    return this.selected.length > 0 && !this.allChecked;
  }

  setAll(checked: boolean) {
    this.allChecked = checked;

    this.myOptions.forEach(op => (op.selected = checked));

    this.onChange()
  }

}
