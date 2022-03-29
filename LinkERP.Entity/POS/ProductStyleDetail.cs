using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
   public class ProductStyleDetail
    {
        public Guid ID { get; set; }
        public string ProductID { get; set; }
        public Guid OrderDetailID { get; set; }
        public Guid BinID { get; set; }
        public Guid ProductMatrixRow { get; set; }
        public Guid ProductMatrixColumn { get; set; }
        public DateTime ExpireDate { get; set; }
        public string BinName { get; set; }
        public string ProductMatrixRowName { get; set; }
        public string ProductMatrixColumnName { get; set; }
        public string StyleMatrixDetailName { get; set; }
        public string StyleMatrixName { get; set; }
        public string QuantityOnHand { get; set; }
        public string SerialNo { get; set; }
        public string SaleQuantity { get; set; }
        public decimal TransactionQuantity { get; set; }
        public decimal ReturnQuantity { get; set; }
    }
}
