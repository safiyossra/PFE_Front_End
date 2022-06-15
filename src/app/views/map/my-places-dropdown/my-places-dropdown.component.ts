import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  DoCheck
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'my-places-search',
  templateUrl: './my-places-dropdown.component.html',
  styleUrls: ['./my-places-dropdown.component.scss']
})
export class MyPlacesDropdownComponent {
  @Input() provider: any;
  @Input() display = "label";
  @Input() formControl: FormControl = new FormControl();

  @Output()
  selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild("selectElem") selectElem;

  selectPlaceholder: string = "Chercher...";
  placeholder: string = "Chercher une addresse";
  default = { label: "", x: 0 };
  options = [this.default];
  selectedValue: any;
  displayString = "";
  constructor() { }

  ngOnChanges() {
    if (this.formControl.value) {
      this.selectedValue = this.formControl.value;
    }
  }

  filterItem(val: any, force = false) {
    this.selectedValue = undefined
    this.provider.search({ query: val }).then((result) => {
      this.options = [this.default, ...result]
    })
    if (force)
      this.selectionChange.emit(null);
  }

  onDisplayString() {
    this.displayString = "";
    if (this.selectedValue != undefined && this.options.length > 1) {
      // Single select display
      this.displayString = this.options[this.selectedValue].label;
    }
    return this.displayString;
  }

  onSelectionChange(val) {
    this.selectedValue = val.value;
    this.selectionChange.emit(this.options[this.selectedValue]);
  }

  public trackByFn(index, item) {
    return item.value;
  }
}
