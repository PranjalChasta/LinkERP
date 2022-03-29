using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class InventoryBarcode
    {
        string _ProductCode, _Barcode;
       
        public string ProductCode
        {
            get { return _ProductCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _ProductCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Product code data (or) check the size");
                }
            }
        }

        public string Barcode
        {
            get { return _Barcode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _Barcode = value.Trim();
                }
                else
                {
                    throw new Exception("Barcode code character size");
                }
            }
        }

    }
}
