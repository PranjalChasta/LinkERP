using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_OrderDetailKIT: BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? SalesOrderDetailID { get; set; }
        public string OrderDetailLineNum { get; set; }
        public Guid? KITID { get; set; }
        public Guid? ParentID { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? SalesQuantity { get; set; }
        public decimal? ReturnsQuantity { get; set; }
        public decimal? ConversionRatio { get; set; }
        public decimal? UnitCost { get; set; }

    }
}
