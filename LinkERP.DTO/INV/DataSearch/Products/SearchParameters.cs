using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.DataSearch.Products
{
    public class SearchParameters
    {
        public Guid CompanyID { get; set; }
        public string SearchText { get; set; }
        public string ModuleName { get; set; }
        public Guid? WarehouseID { get; set; }
        public Guid? SearchID1 { get; set; }
        public Guid? SearchID2 { get; set; }
        public string Action { get; set; }
    }
}
