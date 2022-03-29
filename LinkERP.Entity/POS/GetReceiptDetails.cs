using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.POS
{
    public class GetRecieptDetais
    {
        private string name = "0.0000";
        public Guid ID { get; set; }
        public int Reconcile { get; set; }
        public string PaymentType { get; set; }
        public string Amount { get; set; }
        public string TillAmount    // property
        {
            get { return name; }
            set { name = value; }
        }

    }
}
