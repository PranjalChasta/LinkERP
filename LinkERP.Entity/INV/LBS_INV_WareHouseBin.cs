using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_WareHouseBin : BaseEntity
    {
       public Guid CompanyID { get; set; }
        public Guid WareHouseID { get; set; }
        public string BinCode { get; set; }
        public string BinName { get; set; }
        public string WareHouseName { get; set; }
        public string CompanyName { get; set; }
        public bool? Default { get; set; }
        public string DefaultStatus { get; set; }
    }
}
