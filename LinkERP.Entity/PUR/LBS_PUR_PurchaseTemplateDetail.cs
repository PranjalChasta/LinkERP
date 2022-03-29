using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_PurchaseTemplateDetail : BaseEntity
    {
        public Guid CompanyID{get;set;}
        public Guid PurchaseTemplateID { get; set; }
        public int LineNo { get; set; }
        public string PurchaseLineStatus { get; set; }
        public string ProductType { get; set; }
        public string ProductID { get; set; }
        public string ProductDescription { get; set; }
        public string Quantity { get; set; }
        public string UnitOfMeasure { get; set; }
        public string ClassificationID { get; set; }
        public string  Description { get; set; }


    }
}
