using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.KitchenView
{
    public class Kitchen_Table : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public string TableName { get; set; }
        public int NoOfGuests { get; set; }
        public DateTime ReservationStartTime { get; set; }
        public DateTime ReservationEndTime { get; set; }
    }
}
