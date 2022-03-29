using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.PUR
{
    public class LBS_PUR_LandedCostShipmentLine :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid WarehouseID { get; set; }
        public Guid PurchaseLandedCostID { get; set; }
        public string InvoicesNumber { get; set; }
        public string BookingNumber { get; set; }
        public Guid PurchaseOrderID { get; set; }
        public Guid PurchaseOrderLineID { get; set; }
        public string VendorID { get; set; }
        public string ProductType { get; set; }
        public string Status { get; set; }
        public string ProductID { get; set; }
        public string ProductCode { get; set; }
        public string Description { get; set; }
        public bool? UseSerialNo { get; set; }
        public bool? UseExpiry { get; set; }
        public decimal? Weight { get; set; }
        public decimal? Volume { get; set; }
        public decimal? QuantityOrdered { get; set; }
        public decimal? QuantityReceivedThisShipment { get; set; }
        //public decimal? OrderedUnitCostTaxInclusiveHome { get; set; }
        //public decimal? OrderedUnitCostTaxExclusiveForeign { get; set; }
        //public string ForeignCurrency { get; set; }
        //public decimal? ForeignExchangeRate { get; set; }
        //public decimal? ForeignLandedUnitTaxExclusive { get; set; }
        public decimal? LandedUnitCostTaxExclusiveHome { get; set; }
        //public Guid TaxID { get; set; }
        //public decimal? TaxRate { get; set; }

        public decimal? LineTotalForeignExchangeCostTaxExclusive { get; set; }
        public decimal? LineTotalLandedCostTaxExclusiveHome { get; set; }
        public decimal? LineTotalTaxExclusiveHome { get; set; }

        //public decimal? LineTotalTaxInclusiveHome { get; set; }
        //public decimal? LineTotalTaxExclusiveForeign { get; set; }
        //public decimal? LineTotalTaxInclusiveForeign { get; set; }
        //public decimal? ImportCosts { get; set; }
        //public decimal? LineTotalLandedCostTaxExclusiveHome { get; set; }
        //public string ClassificationID { get; set; }
        public string ProductName { get; set; }
        public string ShipmentNumber { get; set; }
        public Guid ShipmentLineID { get; set; }
        public Guid? ShipmentBookingID { get; set; }

    }
}
