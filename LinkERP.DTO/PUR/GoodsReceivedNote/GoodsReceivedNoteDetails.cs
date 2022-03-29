using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.GoodsReceivedNote
{
    public class GoodsReceivedNoteDetails
    {
        public Guid ID { get; set; }
        public string GRNNo { get; set; }
        public string WareHouseCode { get; set; }
        public string WareHouseName { get; set; }
        public string SupplierDeliveryReference { get; set; }
        public string VendorCode { get; set; }
        public string VendorAccountName { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string StatusName { get; set; }
        public bool? Reversed { get; set; }
        public string IsReversed { get; set; }
        public bool Invoiced { get; set; }
        public string IsInvoiced { get; set; }
        public decimal TotalInclusiveofTaxHome { get; set; }
        public bool Deleted { get; set; }
        public string DeleteStatus { get; set; } 
        public string PurchaseOrderNumber { get; set; }
    }
}
