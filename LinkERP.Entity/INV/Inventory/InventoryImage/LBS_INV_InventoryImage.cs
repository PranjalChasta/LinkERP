using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Inventory.InventoryImage
{
    public class LBS_INV_InventoryImage:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid ProductID { get; set; }
        //public byte[] Image { get; set; }
        public string Image { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
    }
}
