using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_OrderDetailPriceGroup: BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? SalesOrderDetailID { get; set; }
        public Guid? OrderDetailLineNum { get; set; }
        public Guid? ProductID { get; set; }
        public Guid? PriceGroupID { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? SalesQuantity { get; set; }
        public decimal? ReturnsQuantity { get; set; }
        public decimal? UnitCost { get; set; }

    }
}
