using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class InventoryMaster
    {
        string _ProductCode, _ProductName, _CategoryCode, _SubCategoryCode, _UnitOfMeasureCode, _TaxCode,
            _PriceGroupCode, _StockTakeCycleCode, _ProductStatus, _ProductStyleMatrixColumnCode, _ProductStyleMatrixRowCode;
        dynamic _InventoryDefaultCost, _AllowPurchase, _ProductStyleMatrixEnabled, _UseWareHousePrice, _SerialisedProduct,
            _BulkItem, _AllowDiscount, _CustomKit, _Websellable, _GiftVoucher, _UseExpiryDates, _DecimalPlaces;

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
                    throw new Exception("Invalid Product code data");
                }
            }
        }
        public string ProductName
        {
            get { return _ProductName; }
            set
            {
                if (value.Trim().Length >= 1)
                {
                    _ProductName = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Product Name data");
                }
            }
        }
        public string CategoryCode
        {
            get { return _CategoryCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _CategoryCode = value.Trim();
                }
                else
                {
                    throw new Exception("Invalid Category Code data");
                }
            }
        }
        public string SubCategoryCode
        {
            get { return _SubCategoryCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _SubCategoryCode = value;
                }
                else
                {
                    throw new Exception("Invalid Sub Category Code data");
                }
            }
        }
        public string UnitOfMeasureCode
        {
            get { return _UnitOfMeasureCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _UnitOfMeasureCode = value;
                }
                else
                {
                    throw new Exception("Invalid Unit of measure data");
                }
            }
        }
        public dynamic InventoryDefaultCost
        {
            get { return _InventoryDefaultCost; }
            set
            {
                if (((string)value).ToLower() == "last cost")
                {
                    _InventoryDefaultCost = "1";
                }
                else if (((string)value).ToLower() == "average cost")
                {
                    _InventoryDefaultCost = "2";
                }
                else if (((string)value).ToLower() == "standard cost")
                {
                    _InventoryDefaultCost = "3";
                }
                else
                {
                    throw new Exception("Invalid Inventory Default Cost data");
                }
            }
        }
        public string TaxCode
        {
            get { return _TaxCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _TaxCode = value;
                }
                else
                {
                    throw new Exception("Invalid Tax Code data");
                }
            }
        }
        public dynamic Weight { get; set; }
        public dynamic Height { get; set; }
        public dynamic Width { get; set; }
        public dynamic Length { get; set; }
        public string PriceGroupCode
        {
            get { return _PriceGroupCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _PriceGroupCode = value;
                }
                else
                {
                    throw new Exception("Invalid Price Group Code data");
                }
            }
        }
        public string StockTakeCycleCode
        {
            get { return _StockTakeCycleCode; }
            set
            {
                if (value.Trim().Length >= 1 && value.Length <= 50)
                {
                    _StockTakeCycleCode = value;
                }
                else
                {
                    throw new Exception("Invalid Price Group Code data");
                }
            }
        }
        public string ProductStatus
        {
            get { return _ProductStatus; }
            set
            {
                if (((string)value).ToLower() == "finished good" || ((string)value).ToLower() == "f")
                {
                    _ProductStatus = "F";
                }
                else if (((string)value).ToLower() == "non-quantity bearing" || ((string)value).ToLower() == "n")
                {
                    _ProductStatus = "N";
                }
                else if (((string)value).ToLower() == "component" || ((string)value).ToLower() == "c")
                {
                    _ProductStatus = "C";
                }
                else if (((string)value).ToLower() == "discontinued" || ((string)value).ToLower() == "d")
                {
                    _ProductStatus = "D";
                }
                else
                {
                    throw new Exception("Invalid Product Status data");
                }
            }
        }
        public dynamic AllowPurchase
        {
            get { return _AllowPurchase; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _AllowPurchase = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _AllowPurchase = false;
                }
                else
                {
                    throw new Exception("Invalid Allow Purchase data");
                }
            }
        }
        public dynamic MinimumProfitPercentage { get; set; }
        public dynamic ProductStyleMatrixEnabled
        {
            get { return _ProductStyleMatrixEnabled; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _ProductStyleMatrixEnabled = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _ProductStyleMatrixEnabled = false;
                }
                else
                {
                    throw new Exception("Invalid Product Style Matrix Enabled data");
                }
            }
        }
        public string ProductStyleMatrixColumnCode
        {
            get { return _ProductStyleMatrixColumnCode; }
            set
            {
                if (_ProductStyleMatrixEnabled)
                {
                    if (value.Trim().Length >= 1 && value.Length <= 50)
                    {
                        _ProductStyleMatrixColumnCode = value;
                    }
                    else
                    {
                        throw new Exception("Invalid Product Style Matrix Column Code data");
                    }
                }
                else
                {
                    _ProductStyleMatrixColumnCode = value;
                }
                
            }
        }
        public string ProductStyleMatrixRowCode
        {
            get { return _ProductStyleMatrixRowCode; }
            set
            {
                if (_ProductStyleMatrixEnabled)
                {
                    if (value.Trim().Length >= 1 && value.Length <= 50)
                    {
                        _ProductStyleMatrixRowCode = value;
                    }
                    else
                    {
                        throw new Exception("Invalid Product Style Matrix Row Code data");
                    }
                }
                else
                {
                    _ProductStyleMatrixRowCode = value;
                }
               
            }
        }
        public dynamic UseWareHousePrice
        {
            get { return _UseWareHousePrice; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _UseWareHousePrice = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _UseWareHousePrice = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic SerialisedProduct
        {
            get { return _SerialisedProduct; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _SerialisedProduct = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _SerialisedProduct = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic BulkItem
        {
            get { return _BulkItem; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _BulkItem = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _BulkItem = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic AllowDiscount
        {
            get { return _AllowDiscount; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _AllowDiscount = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _AllowDiscount = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic CustomKit
        {
            get { return _CustomKit; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _CustomKit = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _CustomKit = false;
                }
                else
                {
                    throw new Exception("Invalid data ");
                }
            }
        }
        public dynamic Websellable
        {
            get { return _Websellable; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _Websellable = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _Websellable = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic GiftVoucher
        {
            get { return _GiftVoucher; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _GiftVoucher = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _GiftVoucher = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic UseExpiryDates
        {
            get { return _UseExpiryDates; }
            set
            {
                if (((string)value).ToLower() == "y")
                {
                    _UseExpiryDates = true;
                }
                else if (((string)value).ToLower() == "n")
                {
                    _UseExpiryDates = false;
                }
                else
                {
                    throw new Exception("Invalid data");
                }
            }
        }
        public dynamic DecimalPlaces { get; set; }
        public string PrescriptionInstructions { get; set; }
        public string PrescriptionSpecialInstructions { get; set; }
        public string PrescriptionCareInstructions { get; set; }
        public string PrescriptionWarning { get; set; }

    }
}
