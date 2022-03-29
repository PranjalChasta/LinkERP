import { BaseEntity } from "../base-entity";

export class LBSSYSReportSchedule extends BaseEntity {
    CompanyID: any;
    FrequencyID: any;
    ReportID: any;
    Description: any;
    Subject: any;
    EmaSubjectilTo: any;
    EmailSendMode: any;
    LastRunDate: any;
    NextRunDate: any;
    EmailReportOption: any;
    ReportUser: any;
    DocumentTemplate: any;
    DateFromType: any;
    DateToType: any;
    OffSetDateFrom: any = 0;
    OffSetDateTo: any = 0;
}
