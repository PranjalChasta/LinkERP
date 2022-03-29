import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
//import * as config from '../../configuration.json'; 
import * as config from 'src/assets/config.json'; 

@Pipe({
  name: 'appDate'
})
export class CustomDateFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //console.log(config.default.DateTimeFormat.Date);
    return super.transform(value, config.DateTimeFormat.Date);
  }

}
