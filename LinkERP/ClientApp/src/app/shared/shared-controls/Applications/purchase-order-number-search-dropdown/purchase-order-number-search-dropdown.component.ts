import { Component, OnInit, forwardRef, TemplateRef, ViewChild, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { PurCommonService } from 'src/app/pur/services/pur-common.service';

@Component({
  selector: 'purchase-order-number-search-dropdown',
  templateUrl: './purchase-order-number-search-dropdown.component.html',
  styleUrls: ['./purchase-order-number-search-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PurchaseOrderNumberSearchDropdownComponent),
    multi: true
  }]
})
export class PurchaseOrderNumberSearchDropdownComponent implements OnInit, ControlValueAccessor {

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
   
    if (selectedItem.value) {
      if (this.RetrunValue == 'PURCHASEORDERNUMBER')
        this.onChange(selectedItem.value.purchaseOrderNumber);
      else
        this.onChange(selectedItem.value.id);

    } else {
      this.onChange('');
    }
  }
  BindPurchaseOrderNmbers() {
   
    let options: any[] = [];

    this.purCommonService.getPurchaseOrderNumbers().subscribe((resp: any) => {
      let PurchaseOrderNumbers: any[] = resp.data.purchaseOrderNumbers;
      PurchaseOrderNumbers.forEach(p => {
        let option = {
          id: p.id,
          purchaseOrderNumber: p.purchaseOrderNumber
        }
        options.push(option);

      });    
      this.options = options;      
    }, (error) => {     
      console.error('Problem with the sevice. Please try later : ' + error);     
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
    displayKey: "purchaseOrderNumber", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: '--Select Purchase Order Number--',// text to be displayed when no item is selected defaults to Select,
    customComparator: () => { },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 3, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Purchase Order Numbers', // label thats displayed in search input,
    searchOnKey: 'purchaseOrderNumber', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All', // Default text for select all feature
  }
  ngOnInit() {
   
    this.BindPurchaseOrderNmbers();
  }

}
