using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Make.Series
{
   public class LBS_INV_Series:BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid MakeID { get; set; }
        public Guid ModelID { get; set; }
        public Guid? Year { get; set; }
        public string Series { get; set; }
        public string MakeDescription { get; set; }
        public string ModelDescription { get; set; }
        public int  Name { get; set; }
    }
}
