import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';

@Component({
  selector: 'app-organisation-details',
  templateUrl: './organisation-details.component.html',
  styleUrls: ['./organisation-details.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OrganisationDetailsComponent),
    multi: true
  }]
})
export class OrganisationDetailsComponent implements OnInit {
  @Input()
  RetrunValue: any = 'ID';

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
      if (this.RetrunValue == 'CODE')
        this.onChange(selectedItem.value.code);
      else
        this.onChange(selectedItem.value.id);

    } else {
      this.onChange('');
    }
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
    placeholder: '--Select Organisation--',// text to be displayed when no item is selected defaults to Select,
    customComparator: () => { },// a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 3, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search Organisation', // label thats displayed in search input,
    searchOnKey: 'description', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    selectAll: 'true', // Should enable select all feature for multiple select items
    selectAllText: 'Select All', // Default text for select all feature
  }
  ngOnInit() {
    this.BindOrganisations();
  }
  BindOrganisations() {
    debugger;
    let options: any[] = [];

    this.sysCommonService.getCompanies().subscribe((resp: any) => {
      let Company: any[] = resp.data.companies;
      Company.forEach(p => {
        let option = {
          id: p.id,
          code: p.companyCode,
          description: p.name + ' - ' + p.companyCode
        }
        options.push(option);

      });
      console.log('Binding Data');
      this.options = options;
      //  return options;
    }, (error) => {
      //this.Loading = false;
      // this.toastr.error(error);
      console.error('Problem with the sevice. Please try later : ' + error);
      //return options;
    });
  }
}
