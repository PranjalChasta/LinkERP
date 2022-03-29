using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LinkERPPOS.DTO.Login
{
    public class ConfigurationDetails
    {
        public Guid ID { get; set; }
        public Guid CompanyID { get; set; }
        public string MachineName { get; set; }
        public string Configuration { get; set; }
        public string ConfigurationValue { get; set; }
        public string CreatedBy { get; set; }
        public string Flag { get; set; }
    }
}
