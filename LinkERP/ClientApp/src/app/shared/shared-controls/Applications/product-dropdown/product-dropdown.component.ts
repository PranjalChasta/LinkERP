import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms'
import { noop } from 'rxjs';
import { SysCommonService } from 'src/app/sys/services/sys-common.service'

@Component({
  selector: 'product-dropdown',
  templateUrl: './product-dropdown.component.html',
  styleUrls: ['./product-dropdown.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductDropdownComponent),
    multi: true
  }]
})
export class ProductDropdownComponent implements OnInit, ControlValueAccessor {
  private onChange: (_: any) => void = noop;
  private value: any = '-1';
  Products: any[] = [];

  constructor(private sysCommonService: SysCommonService) { }

  writeValue(obj: any): void {
    debugger;
    if (obj == '-1') {
      this.value = obj;
      this.onChange('-1');
    } else {
      this.value = obj;
      this.onChange(this.value);
    }
  }
  BindProducts() {
    debugger;
    this.sysCommonService.getFinishedProducts().subscribe((resp: any) => {
      this.Products = resp.data.productkits;    
    }, (error) => {     
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnInit() {
    this.BindProducts();
  }
  OnProductSelected(value) {
    // if (value == '-1') {
    //   this.onChange(null);
    // }
    // else {
    //   this.onChange(value);
    // }
    this.onChange(value);
  }
  // OnSelect() {
  //   this.value = '1';
  //   this.onChange(this.value);
  // }
}
