import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../reports-base/report.service';
@Component({
  selector: 'app-inv-reports',
  templateUrl: './inv-reports.component.html',
  styleUrls: ['./inv-reports.component.css']
})
export class InvReportsComponent implements OnInit {

  reportControls: any[] = [];
  constructor(private reportService: ReportService) { }

  ngOnInit() {
 
   
    
  }
 

}
