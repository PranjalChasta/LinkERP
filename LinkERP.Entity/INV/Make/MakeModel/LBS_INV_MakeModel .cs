using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Make.MakeModel
{
   public class LBS_INV_MakeModel:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid MakeID { get; set; }
        public string ModelDescription { get; set; }
        public  string MakeDescription { get; set; }
        public string Series { get; set; }
    }
}
