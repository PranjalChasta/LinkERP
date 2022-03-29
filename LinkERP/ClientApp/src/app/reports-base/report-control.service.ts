import { Injectable } from '@angular/core';
import { ReportControlBase } from './report-control-base';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReportControlService {

  constructor(private FB: FormBuilder) { }
  toFormGroup(reportControls: ReportControlBase<any>[]) {
    debugger;
    let group: any = {};

    if (reportControls.length > 0) {

      reportControls.forEach(reportControl => {
        group[reportControl.key] = reportControl.required ? new FormControl(reportControl.value || '', Validators.required)
          : new FormControl(reportControl.value || '');
      });
    }
    else {
      return this.FB.group({});
    }

    return new FormGroup(group);
  }
}
