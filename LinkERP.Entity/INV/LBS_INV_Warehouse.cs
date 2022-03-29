using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_Warehouse : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string WareHouseCode { get; set; }
        public string WareHouseName { get; set; }
        public string DeliveryAddress1 { get; set; }
        public string DeliveryAddress2 { get; set; }
        public string DeliveryAddress3 { get; set; }
        public string PostalAdderss1 { get; set; }
        public string PostalAddress2 { get; set; }
        public string PostalAddress3 { get; set; }
        public string ContactName { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string ContactEmailAddress { get; set; }
        public string WarehouseTransactionMask { get; set; }
    }
}
