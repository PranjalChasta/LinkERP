import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SendReportMailService } from '../send-report-mail.service';

@Component({
  selector: 'app-send-report-mail',
  templateUrl: './send-report-mail.component.html',
  styleUrls: ['./send-report-mail.component.css']
})
export class SendReportMailComponent implements OnInit {

  @Input()
  ReportID: any;

  @Input()
  ReportParameters: any;

  SendEmailForm: FormGroup;

  UsersEmailAddress: any[] = [];

  DocumentTemplates: any[] = [];

  modalRef: BsModalRef;
  @ViewChild('EMailComposer') EMailComposerVariable: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private sendReportMailService: SendReportMailService,
    private FB: FormBuilder) { }

  ngOnInit() {
    this.SendEmailForm = this.FB.group({
      Subject: [''],
      EmailAddresses: [''],
      DocumentTemplate: ['-1'],
      UsersEmailAddresses: this.FB.array([])
    });

  }


  get UsersEmailAddresses(): FormArray {
    return this.SendEmailForm.get('UsersEmailAddresses') as FormArray;
  }

  CreateUserEmailAddress(): FormGroup {
    return this.FB.group({
      Select: [false],
      LoginName: [''],
      EmailAddress: ['']
    });
  }

  setUserEmailAddresses(UserEmailAddressess: any[]): FormArray {

    const formArray = new FormArray([]);
    UserEmailAddressess.forEach(ue => {
      formArray.push(this.FB.group({
        SelectUser: false,
        LoginName: ue.loginName,
        EmailAddress: ue.emailAddress
      }));
    });
    return formArray;
  }

  BindUsersEmailAddress() {
    this.sendReportMailService.getUsersEMails().subscribe((resp: any) => {
      this.UsersEmailAddress = resp.data.usersEmailAddress;
      this.SendEmailForm.setControl('UsersEmailAddresses', this.setUserEmailAddresses(resp.data.usersEmailAddress));
    }, (error: any) => {

    });
  }

  BindDocumentTemplates() {
    this.sendReportMailService.getDocumentTemplatesByReport(this.ReportID).subscribe((resp: any) => {
      this.DocumentTemplates = resp.data.documentTemplate;
    }, (error: any) => {

    });
  }
  OpenEMailComposer() {
    this.modalRef = this.modalService.show(this.EMailComposerVariable);
    this.BindUsersEmailAddress();
    this.BindDocumentTemplates();
  }

  SelectEmail(index: any) {
    let selected: boolean = this.UsersEmailAddresses.at(index).get('SelectUser').value;
    this.UsersEmailAddresses.at(index).patchValue({
      SelectUser: !selected
    });
  }

  Cancel() {
    this.modalRef.hide();
  }

  OnSendEmail() {
    let emailAddress: any[] = [];
    this.UsersEmailAddresses.controls.forEach(em => {
      emailAddress.push(em.get('EmailAddress').value);
    });
    let EmailData = {
      Subject: '',
      Emails: '',
      DocumentTemplateID: '',
      UserEmails: emailAddress,
      ReportParameters: this.ReportParameters
    }
    
  }
}
