using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class InventoryKitItems
    {
        string _KitProductCode, _ParentProductCode;
       
        public string KitProductCode
        {
            get { return _KitProductCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _KitProductCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Kit Product code data");
                }
            }
        }
        public string ParentProductCode
        {
            get { return _ParentProductCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _ParentProductCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Parent Product code data");
                }
            }
        }        
        public decimal Quantity { get; set; }
        public decimal ConversionRatio { get; set; }
    }
}
