using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class InventoryDetail
    {
        string _ProductCode, _WarehouseCode, _BinCode;
        dynamic _AllowNegative;
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
        public string WarehouseCode
        {
            get { return _WarehouseCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _WarehouseCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Warehouse code data");
                }
            }
        }
        public string BinCode
        {
            get { return _BinCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _BinCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Bin code data");
                }
            }
        }
        public dynamic MinimumStock { get; set; }
        public dynamic MaximumStock { get; set; }
        public dynamic MinimumOrder { get; set; }
        public dynamic AverageCost { get; set; }
        public dynamic StandardCost { get; set; }
        public dynamic LastCost { get; set; }
        public dynamic AvailableQuantity { get; set; }
        public string InventoryGLClassificationID { get; set; }
        public dynamic AllowNegative
        {
            get { return _AllowNegative; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _AllowNegative = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _AllowNegative = false;
                }
                else
                {
                    throw new Exception("Invalid Allow Negative data");
                }
            }
        }
    }
}