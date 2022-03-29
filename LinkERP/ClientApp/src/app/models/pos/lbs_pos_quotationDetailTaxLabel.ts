import { BaseEntity } from "../base-entity";

export class LbsPosQuotationDetailTaxlabel extends BaseEntity {
    public CompanyID: any
    public QuotationLineID: any
    public TaxID: any
    public TaxLabel: string
    public TaxAmount: number

}