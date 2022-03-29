using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.LandedCostShipmentLines
{
    public class LBS_PUR_GetShipmentLineDetails
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public string InvoicesNumber { get; set; }
        public Guid PurchaseOrderID { get; set; }
        public Guid PurchaseOrderLineID { get; set; }
        public string VendorID { get; set; }
        public Guid CurrencyID { get; set; }
        public string ShipmentNumber { get; set; }
        public string VendorAccountName { get; set; }
        public string VendorCode { get; set; }
        public string ProductType { get; set; }
        public string ProductID { get; set; }
        public string ProductCode { get; set; }
        public string POLineNo { get; set; }
        public string ProductName { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public string Description { get; set; }
        public string ClassificationID { get; set; }
        public bool? UseSerialNo { get; set; }
        public bool? UseExpiry { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Volume { get; set; }
        public Guid TaxID { get; set; }
        public decimal? TaxRate { get; set; }

        public decimal? OrderedUnitCostTaxExclusiveForeign { get; set; }
        public decimal? OrderedUnitCostTaxInclusiveHome { get; set; }

        public decimal AportionedImportCosts { get; set; }
        public decimal LineTotalLandedCostTaxExclusiveHome { get; set; }
        public decimal LandedUnitCostTaxExclusiveHome { get; set; }
        public string Currency { get; set; }
        public decimal? QuantityOrdered { get; set; }
        public decimal? QuantityReceivedThisShipment { get; set; }
        public decimal? UnitCostTaxExclusiveHome { get; set; }
        public decimal? FxRate { get; set; }

        public decimal? ForeignLandedUnitTaxExclusive { get; set; }
        public decimal? UnitCostTaxInclusiveHome { get; set; }
        public decimal? LineTotalTaxExclusiveHome { get; set; }
        public decimal? LineTotalTaxInclusiveHome { get; set; }
        public decimal? LineTotalTaxInclusiveForeign { get; set; }
        public decimal? LineTotalTaxExclusiveForeign { get; set; }
        public decimal? LineTotalTaxAmountHome { get; set; }
        public decimal? LineTotalTaxAmountForeign { get; set; }   
    }
}
