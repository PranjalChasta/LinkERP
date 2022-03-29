import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
//import * as config from '../../configuration.json'; 
import * as config from 'src/assets/config.json'; 

@Pipe({
  name: 'appTime'
})
export class CustomTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, config.DateTimeFormat.Time);
  }
}


