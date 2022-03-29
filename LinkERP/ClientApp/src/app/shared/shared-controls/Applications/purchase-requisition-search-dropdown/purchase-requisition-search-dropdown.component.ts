import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { PurCommonService } from 'src/app/pur/services/pur-common.service';

@Component({
  selector: 'purchase-requisition-search-dropdown',
  templateUrl: './purchase-requisition-search-dropdown.component.html',
  styleUrls: ['./purchase-requisition-search-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PurchaseRequisitionSearchDropdownComponent),
    multi: true
  }]
})
export class PurchaseRequisitionSearchDropdownComponent implements OnInit, ControlValueAccessor {

  @Input()
  RetrunValue: any = 'ID';

  //get options{ }

  private onChange: (_: any) => void = noop;
  Value: any;
  constructor(private purCommonService: PurCommonService) { }
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
      if (this.RetrunValue == 'REQUISITIONNUMBER')
        this.onChange(selectedItem.value.requisitionNumber);
      else
        this.onChange(selectedItem.value.id);

    } else {
      this.onChange('');
    }
  }
  BindProducts() {
    debugger;
    let options: any[] = [];

    this.purCommonService.getPurchaseRequisitionNumber().subscribe((resp: any) => {
      let PurchaseRequisitions: any[] = resp.data.purchaseRequisitions;
      PurchaseRequisitions.forEach(p => {
        let option = {
          id: p.id,
          requisitionNumber: p.requisitionNumber
        }
        options.push(option);

      });
      //console.log('Binding Data');
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

  // { id: 1, code: 'P1', description: 'Product 1' },
  // { id: 2, code: 'P2', description: 'Product 2' },
  // { id: 3, code: 'P3', description: 'Product 3' },
  // { id: 4, code: 'P4', description: 'Product 4' },
  // { id: 5, code: 'P5', description: 'Product 5' },
  // { id: 6, code: 'P6', description: 'Product 6' }

  config = {
    displayKey: "requisitionNumber", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: '--Select Requisition Number--',// text to be displayed when no item is selected defaults to Select,
    customComparator: () => { },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 3, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Requisition Number', // label thats displayed in search input,
    searchOnKey: 'requisitionNumber', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All', // Default text for select all feature
  }
  ngOnInit() {
    //this.BindProducts();
    // debugger;
    // this.product = this.BindProducts();
    // console.log('Products data');
    // console.log(this.product);
    // this.options = [
    //   { id: 1, code: 'P1', description: 'Product 1' },
    //   { id: 2, code: 'P2', description: 'Product 2' },
    //   { id: 3, code: 'P3', description: 'Product 3' },
    //   { id: 4, code: 'P4', description: 'Product 4' },
    //   { id: 5, code: 'P5', description: 'Product 5' },
    //   { id: 6, code: 'P6', description: 'Product 6' }
    // ];
    this.BindProducts();
  }

}
