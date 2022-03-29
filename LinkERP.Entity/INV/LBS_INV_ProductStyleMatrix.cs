using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV
{
    public class LBS_INV_ProductStyleMatrix : BaseEntity
    {

        public Guid CompanyID { get; set; }
        public string StyleMatrixCode { get; set; }
        public string StyleMatrixName { get; set; }
        public string CompanyName { get; set; }
        public LBS_SYS_Company LBS_SYS_Company { get; set; }
    }
}
