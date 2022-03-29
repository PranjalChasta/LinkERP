import { BaseEntity } from "../base-entity"

export class LbsSysUser extends BaseEntity {
    LoginID: any;
    LoginName: any;
    Password: any;
    AuthenticationMode: any;
    WindowsUserName: any;
    DefaultCompanyID: any;
    DefaultWarehouseID: any;
    DefaultTerminalID: any;
    DiscountPercentValue: boolean;
    Discount: any;
    ResetPassword: any;
    SecurityQuestion: any;
    SecurityAnswer: any;
    LogOnStatus: boolean;
    ForcePasswordChange: boolean;
    EmailAddress: any;
    PhoneNumber: any;
    MobileNumber: any;
    TaxNumber: any;
    flag: string;
    LoginAvator: any;
    LeaveApprovalWorkFlow
    TimeApprovalWorkFlow
    PerformanceAppraisalWorkFlow
    PurchaseApprovalWorkFlow
    PurchaseRequestApprovalWorkFlow
    TrainingApprovalWorkFlow
    LoginAvatorbyte: any;
}