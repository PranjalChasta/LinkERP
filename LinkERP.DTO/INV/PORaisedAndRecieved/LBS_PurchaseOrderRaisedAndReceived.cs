using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.PORaisedAndRecieved
{
    public class LBS_PurchaseOrderRaisedAndReceived
    {
        public Guid? CompanyID { get; set; }
        public Guid? PurchaseOrderID { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public decimal OrderedQuantity { get; set; }
        public decimal FreeDealsQuantity { get; set; }
    }
}
