
using LinkERP.Entity.PUR;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.PUR.GoodsReceivedNote
{
    public class PurchaseGoodsReceiveNote
    {
        public LBS_PUR_PurchaseGoodsReceiveNote LBS_PUR_PurchaseGoodsReceiveNote { get; set; }
        public IList<LBS_PUR_PurchaseGRNDetails> LBS_PUR_PurchaseGRNDetails { get; set; }
    }
}
