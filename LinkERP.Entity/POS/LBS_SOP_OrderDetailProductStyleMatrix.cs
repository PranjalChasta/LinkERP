using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_SOP_OrderDetailProductStyleMatrix:BaseEntity
    {
        public Guid? CompanyID { get; set; }
        public Guid? SalesOrderDetailID { get; set; }
        public Guid? OrderDetailLineNum { get; set; }
        public Guid? BinID { get; set; }
        public Guid? ProductMatrixRow { get; set; }
        public Guid? ProductMatrixColumn { get; set; }
        public string SerialNo { get; set; }
        public decimal? TransactionQuantity { get; set; }
    }
    public class SalesOrderDetailProductMatrix
    {
        public object ProductStyleMatrixRow { get; set; }
        public object ProductStyleMatrixColumn { get; set; }
        public object LBS_SOP_OrderDetailProductStyleMatrix { get; set; }
    }
}
