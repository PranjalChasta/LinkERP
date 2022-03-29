import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PurchaseTemplateDetailService } from '../../services/purchase-template-detail.service';
import { SysCommonService } from 'src/app/sys/services/sys-common.service';
import { PurchaseTemplateService } from 'src/app/inv/services/purchase-template.service';

@Component({
  selector: 'app-create-po-from-templete',
  templateUrl: './create-po-from-templete.component.html',
  styleUrls: ['./create-po-from-templete.component.css']
})
export class CreatePoFromTempleteComponent implements OnInit {
  @Output() OnBackClick = new EventEmitter<any>();
  templates: any;
  SelectedtemplateID: any;
  constructor(private toastr: ToastrService,
    private purchasetemplateService: PurchaseTemplateService,
    private sysCommonService: SysCommonService) { }

  ngOnInit() {
    this.SelectedtemplateID = "-1";
    this.BindPurchaseTemplate();
  }
  Back() {
    this.OnBackClick.emit("");
  }

  BindPurchaseTemplate() {
    this.purchasetemplateService.getActivePurchaseTemplates().subscribe((resp: any) => {
      this.templates = resp.data.template;
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
  CreatePO() {
    this.purchasetemplateService.createPOFromTemplete(this.SelectedtemplateID, localStorage.getItem('LoginID')).subscribe((resp: any) => {
      this.toastr.success('Purchase order created successfully');
      this.OnBackClick.emit("");
    }, (error) => {
      console.error('Problem with the sevice. Please try later : ' + error);
    });
  }
}
