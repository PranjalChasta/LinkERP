using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.INV.Make.Engine
{
   public class LBS_INV_Engine :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid MakeID { get; set; }
        public Guid ModelID { get; set; }
        public Guid  Year { get; set; }
        public Guid Series { get; set; }
        public string Engine { get; set; }
        public string MakeDescription { get; set; }
        public string ModelDescription { get; set; }
        public string SeriesName { get; set; }
        public int Name { get; set; }
    }
}
