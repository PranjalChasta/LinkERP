import { Injectable } from '@angular/core';
//import * as config from '../../configuration.json';
import * as config from 'src/assets/config.json'; 
import * as moment from 'moment';
import { DatePipe } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class SharedFormatterService {

  constructor(private datePipe: DatePipe) { }

  dateFormatter(params) {
    return moment(params.value).format(config.DateTimeFormat.GridDate);
  }
  dateTimeFormatter(params) {
    let date = new Date(params.value);
    return moment(date).format(config.DateTimeFormat.GridDate).toString() + ' ' + moment(date).format(config.DateTimeFormat.GridTime).toString();
  }
  timeFormatter(params) {
    return moment(params.value).format(config.DateTimeFormat.GridTime);
  }

  dateTimeFormatterToDateTime(params) {
      return new Date(moment(params, ["DD/MM/yyyy hh:mm A"]).format("MM/DD/yyyy").toString());
  }

 

}
