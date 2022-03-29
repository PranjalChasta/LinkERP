using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
    public class LBS_SYS_User : BaseEntity
    {
        public string LoginID { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public string AuthenticationMode { get; set; }
        public string WindowsUserName { get; set; }
        public Guid DefaultCompanyID { get; set; }
        public Guid? DefaultWarehouseID { get; set; }
        public Guid? DefaultTerminalID { get; set; }
        public bool DiscountPercentValue { get; set; }
        public decimal Discount { get; set; }
        public bool ResetPassword { get; set; }
        public bool ForcePasswordChange { get; set; }
        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; }
        public bool LogOnStatus { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string MobileNumber { get; set; }
        public string TaxNumber { get; set; }
        public string Name { get; set; }
       // public Guid CompanyID { get; set; }
        public Guid? LeaveApprovalWorkFlow { get; set; }
        public Guid? TimeApprovalWorkFlow { get; set; }
        public Guid? PerformanceAppraisalWorkFlow { get; set; }
        public Guid? PurchaseApprovalWorkFlow { get; set; }
        public Guid? PurchaseRequestApprovalWorkFlow { get; set; }
        public Guid? TrainingApprovalWorkFlow{ get; set; }
        public string LoginAvator { get; set; }
        public byte[] LoginAvatorbyte { get; set; }
        public string LogStatus { get; set; }

    }
}
