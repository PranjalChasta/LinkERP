
using LinkERP.Entity.PUR;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.GoodsReceivedNote
{
    public class PurchaseMain : LBS_PUR_PurchaseMain
    {
        public string VendorCode { get; set; }
        public string VendorAccountName { get; set; }
        public string WareHouseCode { get; set; }
        public string WareHouseName { get; set; } 
        public string GRNNo { get; set; }
        public string FreightTaxName { get; set; }
        public string DutyTaxName { get; set; }
        public string InsuranceTaxName { get; set; }
        public string SupplierDeliveryReference { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public bool? Reversed { get; set; }
        public bool? Invoiced { get; set; }

    }
}
