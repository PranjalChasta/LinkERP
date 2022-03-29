using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.SYS
{
  public  class LBS_SYS_Jobs :BaseEntity
    {
        public Guid CompanyID { get; set; }
        public  string JobCode { get; set; }
        public string JobName { get; set; }
        public  string JobScript { get; set; }
        public  string EmailAddress { get; set; }
        public  string CopyEmailAddress { get; set; }
        public string BCCEmailAddress { get; set; }
        public DateTime? LastExecuteDateTime { get; set; }
        public DateTime? NextExecuteDateTime { get; set; }
        public Guid DocumentTemplateID { get; set; }
        public string ModuleID { get; set; }
        public Guid FrequencyID { get; set; }
        public string Status { get; set; }
        public string Organisation { get; set; }
        public string FrequencyName { get; set; }
        public string ModuleName { get; set; }

    }
}
