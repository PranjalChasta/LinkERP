import { Injectable } from '@angular/core';
import { ReportControlBase } from './report-control-base';
import { DropdownControl } from './dropdown-control';
import { TextboxControl } from './textbox-control';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';
import { HiddenTextControl } from './hidden-text-control';
import { DropdownSearchControl } from './dropdown-search-control';
import { DatePickerControl } from './date-picker-control';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private url: string = "";
  private baseurl: string = "";
  constructor(public http: HttpClient, private appConfigService: AppConfigService) {
    this.baseurl = appConfigService.getServiceBaseUrl();
  }

  getReports(moduleId) {
    this.url = this.baseurl + 'api/Reports/GetReportsByModule/' + moduleId;
    return this.http.get(this.url);
  }
  getReportParameters(reportId) {
    this.url = this.baseurl + 'api/Reports/GetReportsParametersDetailsByReportID/' + reportId;
    return this.http.get(this.url);
  }
  getReportControls(controls: any[]) {
    debugger;
    let reportControls: ReportControlBase<any>[] = [];

    controls.forEach(c => {
      if (c.paramDisplayType == 'TEXTBOX') {
        let textbox = new TextboxControl({
          key: c.paramName,
          label: c.paramTitle,
          value: c.defaultValue,
          required: c.isMandatory,
          order: c.displayOrder
        });
        reportControls.push(textbox);
      }
      else if (c.paramDisplayType == 'LOCALSTORAGE') {
        let hiddentext = new HiddenTextControl({
          key: c.paramName,
          label: c.paramTitle,
          value: localStorage.getItem(c.defaultValue),
          required: c.isMandatory,
          order: c.displayOrder
        });
        reportControls.push(hiddentext);
      }
      else if (c.paramDisplayType == 'SEARCHDROPDOWN') {
        let dropdownSearch = new DropdownSearchControl({
          key: c.paramName,
          label: c.paramTitle,
          value: c.defaultValue,
          required: c.isMandatory,
          order: c.displayOrder,
          lookupTable: c.lookupTable,
          memberValue: c.displayMemberID
        });
        reportControls.push(dropdownSearch);
      }
      else if (c.paramDisplayType == 'DATEPICKER') {
        let datepicker = new DatePickerControl({
          key: c.paramName,
          label: c.paramTitle,
          value: c.defaultValue,
          required: c.isMandatory,
          order: c.displayOrder
        });
        reportControls.push(datepicker);
      }
    });
    console.log(reportControls);
    /*
    
        let reportControl: ReportControlBase<any>[] = [
    
          new DropdownControl({
            key: 'ItemFrom',
            label: 'Item From',
            options: [
              { key: '', value: '--Select--' },
              { key: 'Product 1', value: 'Product 1' },
              { key: 'Product 2', value: 'Product 2' },
              { key: 'Product 3', value: 'Product 3' },
              { key: 'Product 3', value: 'Product 4' }
            ],
            order: 3
          }),
          new DropdownControl({
            key: 'ItemTo',
            label: 'Item To',
            options: [
              { key: '', value: '--Select--' },
              { key: 'Product 1', value: 'Product 1' },
              { key: 'Product 2', value: 'Product 2' },
              { key: 'Product 3', value: 'Product 3' },
              { key: 'Product 3', value: 'Product 4' }
            ],
            order: 4
          }),
          new DropdownControl({
            key: 'ItemTo',
            label: 'Item To',
            options: [
              { key: '', value: '--Select--' },
              { key: 'Product 1', value: 'Product 1' },
              { key: 'Product 2', value: 'Product 2' },
              { key: 'Product 3', value: 'Product 3' },
              { key: 'Product 3', value: 'Product 4' }
            ],
            order: 4
          }),
          new TextboxControl({
            key: 'firstName',
            label: 'First name',
            value: '',
            required: true,
            order: 1
          }),
    
          new TextboxControl({
            key: 'emailAddress',
            label: 'Email',
            type: 'email',
            order: 2
          })
        ];
    */
    return reportControls.sort((a, b) => a.order - b.order);
  }

}
