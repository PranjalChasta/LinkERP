import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { InvCommonService } from 'src/app/inv/services/inv-common.service';

@Component({
  selector: 'warehouse-bin-search-dropdown',
  templateUrl: './warehouse-bin-search-dropdown.component.html',
  styleUrls: ['./warehouse-bin-search-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WarehouseBinSearchDropdownComponent),
    multi: true
  }]
})
export class WarehouseBinSearchDropdownComponent implements OnInit, ControlValueAccessor {
  @Input()
  RetrunValue: any = 'ID';
  private onChange: (_: any) => void = noop;
  Value: any;

  _options: any[] = [];
  set options(value: any[]) {
    this._options = value;
  }

  get options(): any[] {
    return this._options;
  }

  constructor(private invCommonService: InvCommonService) { }
  writeValue(obj: any): void {
    this.Value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }
  config = {
    displayKey: "description", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: '--Select Warehouse Bin--',// text to be displayed when no item is selected defaults to Select,
    customComparator: () => { },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: this.options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Warehouse Bin', // label thats displayed in search input,
    searchOnKey: 'description', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All', // Default text for select all feature
  }

  ngOnInit() {
    this.BindWarehouseBins();
  }
  selectionChanged(selectedItem) {
    debugger;
    if (selectedItem.value) {
      if (this.RetrunValue == 'CODE')
        this.onChange(selectedItem.value.code);
      else
        this.onChange(selectedItem.value.id);
    } else {
      this.onChange('');
    }
  }
  BindWarehouseBins() {
    debugger;
    let options: any[] = [];

    this.invCommonService.getWareHouseBin().subscribe((resp: any) => {
      let WarehouseBins: any[] = resp.data.wareHouseBins;
      WarehouseBins.forEach(b => {
        let option = {
          id: b.id,
          code: b.binCode,
          description: b.binCode + ' - ' + b.binName
        }
        options.push(option);
      });
      //console.log('Binding Data');
      this.options = options;

    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
