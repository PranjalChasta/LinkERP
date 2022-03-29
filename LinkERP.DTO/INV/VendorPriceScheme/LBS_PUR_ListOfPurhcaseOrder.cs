using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.VendorPriceScheme
{
   public class LBS_PUR_ListOfPurhcaseOrder
    {
        public Guid? CompanyID { get; set; }
        public Guid? PurchaseOrderID { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string GrnNumber { get; set; }
        public string SupplierReference { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public decimal? UnitCost { get; set; }

    }
}
