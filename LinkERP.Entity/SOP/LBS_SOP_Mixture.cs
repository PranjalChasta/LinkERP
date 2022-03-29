using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_SOP_Mixture : BaseEntity
    {
        public Guid? MixtureID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid? PrescriptionID { get; set; }
        public Guid? WareHouseID { get; set; }
        public int? PrescriptionLineNumber { get; set; }
        public Guid ProductID { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
        public decimal Total { get; set; }
        public decimal Tax { get; set; }
        public int Processed { get; set; }
    }
}
