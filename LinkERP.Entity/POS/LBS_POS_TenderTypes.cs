using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_TenderTypes:BaseEntity
    {
        public Guid? CompanyID { get; set; }

        public string Description { get; set; }
        public string FastKey { get; set; }
        public string TenderTypesGroup { get; set; }
        public string Caption1 { get; set; }
        public string Caption2 { get; set; }
        public string Caption3 { get; set; }
        public string Caption4 { get; set; }
        public string Caption5{ get; set; }
        public string Caption6{ get; set; }
        public string Caption7{ get; set; }
        public string Caption8{ get; set; }
        public bool? Caption1IsRequired { get; set; }
        public bool? Caption2IsRequired { get; set; }
        public bool? Caption3IsRequired { get; set; }
        public bool? Caption4IsRequired { get; set; }
        public bool? Caption5IsRequired { get; set; }
        public bool? Caption6IsRequired { get; set; }
        public bool? Caption7IsRequired { get; set; }
        public bool? Caption8IsRequired { get; set; }
        public string Caption1FieldType { get; set; }
        public string Caption2FieldType { get; set; }
        public string Caption3FieldType { get; set; }
        public string Caption4FieldType { get; set; }
        public string Caption5FieldType { get; set; }
        public string Caption6FieldType { get; set; }
        public string Caption7FieldType { get; set; }
        public string Caption8FieldType { get; set; }
        public string Caption1List { get; set; }
        public string Caption2List { get; set; }
        public string Caption3List { get; set; }
        public string Caption4List { get; set; }
        public string Caption5List { get; set; }
        public string Caption6List { get; set; }
        public string Caption7List { get; set; }
        public string Caption8List { get; set; }
        public bool? VerifyFromListCaption1 { get; set; }
        public bool? VerifyFromListCaption2 { get; set; }
        public bool? VerifyFromListCaption3 { get; set; }
        public bool? VerifyFromListCaption4 { get; set; }
        public bool? VerifyFromListCaption5 { get; set; }
        public bool? VerifyFromListCaption6 { get; set; }
        public bool? VerifyFromListCaption7 { get; set; }
        public bool? VerifyFromListCaption8 { get; set; }
        public bool? SurchargePercentValue { get; set; }
        public decimal? SurchargeAmount { get; set; }
        public bool? DiscountPercentValue { get; set; }
        public decimal? DiscountAmount { get; set; }
        public bool? MultiCurrency { get; set; }
        public bool? EFT { get; set; }
        public bool? IncludeInBanking { get; set; }
        public string BankAccountCode { get; set; }
        public string ShiftVarianceAccountCode { get; set; }

    }
}
