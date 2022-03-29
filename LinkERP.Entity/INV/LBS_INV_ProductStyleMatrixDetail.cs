using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
  public  class LBS_INV_ProductStyleMatrixDetail :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid StyleMatrixID { get; set; }
        public string StyleMatrixDetailCode { get; set; }
        public string StyleMatrixDetailName { get; set; }
        public LBS_SYS_Company LBS_SYS_Company { get; set; }
        public LBS_INV_ProductStyleMatrix LBS_INV_ProductStyleMatrix { get; set; } 
      
    }
}
