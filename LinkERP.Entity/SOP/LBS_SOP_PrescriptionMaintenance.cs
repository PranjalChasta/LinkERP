using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SOP
{
    public class LBS_SOP_PrescriptionMaintenance : BaseEntity
    {

        public Guid CompanyID { get; set; }
        public string PrescriptionNo { get; set; }
        public int? LineNo { get; set; }
        public Guid? WarehouseID { get; set; }
        public string DoctorReferenceNo { get; set; }
        public Guid? DoctorID { get; set; }
        public string DoctorShortCode { get; set; }
        public string DoctorName { get; set; }
        public Guid? PatientID { get; set; }
        public string PatientName { get; set; }
        public int? PatientAge { get; set; }
        public Guid? MedicationID { get; set; }
        public string MedicationName { get; set; }
        public string Warning { get; set; }
        public string SpecialInstructions { get; set; }
        public string Instructions { get; set; }
        public string CareInstructions { get; set; }
        public decimal? DispensedQuantity { get; set; }
        public bool? UnitPriceOverride { get; set; }
        public decimal? UnitPriceTaxInclusive { get; set; }
        public bool? AdminFeesOverride { get; set; }
        public decimal? AdminFeesTaxInclusive { get; set; }
        public decimal? TotalAmountTaxInclusive { get; set; }
        public int? Repeats { get; set; }
        public decimal? UnitCost { get; set; }
        public decimal? TotalCost { get; set; }
        public int? Status { get; set; }
        public bool? PayByInsurance { get; set; }
        public string Insurer { get; set; }
        public Guid? TransactionSourceReference { get; set; }

    }
}
