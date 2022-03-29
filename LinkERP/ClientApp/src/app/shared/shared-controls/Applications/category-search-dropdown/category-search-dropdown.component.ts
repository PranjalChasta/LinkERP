import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';


@Component({
  selector: 'category-search-dropdown',
  templateUrl: './category-search-dropdown.component.html',
  styleUrls: ['./category-search-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CategorySearchDropdownComponent),
    multi: true
  }]
})
export class CategorySearchDropdownComponent implements OnInit, ControlValueAccessor {

  @Input()
  RetrunValue: any = 'ID';

  @Output()
  CategoryChange = new EventEmitter();
  //get options{ }

  private onChange: (_: any) => void = noop;
  Value: any;
  constructor(private sysCommonService: SysCommonService) { }
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
  selectionChanged(selectedItem) {
    debugger;
    if (selectedItem.value) {
      this.onValueChanged(selectedItem.value.id);
      if (this.RetrunValue == 'CODE')
        this.onChange(selectedItem.value.code);
      else
        this.onChange(selectedItem.value.id);

    } else {
      this.onChange('');
      this.onValueChanged(null);
    }
  }
  BindCategories() {
  
    let options: any[] = [];

    this.sysCommonService.getCategories().subscribe((resp: any) => {
      debugger;
      let categories: any[] = resp.data.categories;
      categories.forEach(c => {
        let option = {
          id: c.id,
          code: c.categoryCode,
          description: c.categoryCode + ' - ' + c.categoryName
        }
        options.push(option);
      });

      this.options = options;
      //  return options;
    }, (error) => {
      //this.Loading = false;
      // this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
      //return options;
    });
  }
  _options: any[] = [];
  set options(value: any[]) {
    this._options = value;
  }

  get options(): any[] {
    return this._options;
  }


  config = {
    displayKey: "description", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: '--Select Category--',// text to be displayed when no item is selected defaults to Select,
    customComparator: () => { },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 3, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Category', // label thats displayed in search input,
    searchOnKey: 'description', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All', // Default text for select all feature
  }
  ngOnInit() {
    this.BindCategories();
  }

  onValueChanged(ID: any) {
    //alert(ID);
    this.CategoryChange.emit(ID);
  }

}
