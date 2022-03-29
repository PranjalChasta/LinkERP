using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.Purchaseinvoice
{
    public class PurchaseInvoiceGRN
    {
        public Guid GRNID {get;set;}
        public Guid WareHouseID {get;set;}
        public string GRNNumber {get;set;}
        public Guid VendorID {get;set;}
        public DateTime ReceivedDate {get;set;}
        public bool Status {get;set;}
        public string CraetedBy {get;set;}
    }
}
