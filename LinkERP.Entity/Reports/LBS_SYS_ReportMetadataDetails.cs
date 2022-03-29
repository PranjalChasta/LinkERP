using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.Reports
{
    public class LBS_SYS_ReportMetadataDetails
    {
        public Guid ID { get; set; }
        public Guid ReportID { get; set; }
        public string ParamTitle { get; set; }
        public string ParamName { get; set; }
        public string ParamDataType { get; set; }
        public string ParamDisplayType { get; set; }
        public bool IsMandatory { get; set; }
        public string LookupTable { get; set; }
        public string DisplayMemberID { get; set; }
        public string DisplayMemberName { get; set; }
        public string DependsOnLookupParamID { get; set; }
        public int DisplayOrder { get; set; }
        public string DefaultValue { get; set; }
        public bool IsChildLookupData { get; set; }
        public bool IsDelete { get; set; }
        public bool IsVisible { get; set; }   
    }
}
