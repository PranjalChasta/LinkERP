using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity.KitchenView
{
    public class Table_Reservation : BaseEntity
    {
        public Guid CompanyID { get; set; }
        public Guid TableID { get; set; }
        public string GuestName { get; set; }
        public DateTime ReservationTimeFrom { get; set; }
        public DateTime ReservationTimeTo { get; set; }

    }
}
