using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class LBS_POS_PriceWorkflow
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string PriceWorkflowDescription { get; set; }       
        public bool UseCheapestPrice { get; set; }
        public bool Default { get; set; }
        public string CreatedBY { get; set; }
        public bool Deleted { get; set; }
    }
    public class LBS_SOP_PriceWorkflowDetail
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public Guid PriceWorkFlowID { get; set; }
        public Guid PriceWorkflowOptionsId { get; set; }
        public int PriceWorkflowPriority { get; set; }
        public string CreatedBY { get; set; }
    }
    public class LBS_SOP_PriceWorkflowOptions
    {        
        public Guid PriceWorkflowOptionsId { get; set; }        
        public string PriceWorkflowCode { get; set; }
        public string PriceWorkflowName { get; set; }        
    }
}
