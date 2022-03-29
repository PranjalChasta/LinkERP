import { Component, OnInit, Input } from '@angular/core';
import { ReportControlBase } from '../report-control-base';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {

  @Input() ReportControl: ReportControlBase<any>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.ReportControl.key].valid; }

  constructor() { }

  ngOnInit() {
  }

  onCategorySelected(value: any) {
    // debugger;
    // alert(value);
    //console.log(value);
  }
}
