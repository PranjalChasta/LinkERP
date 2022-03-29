using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity
{
    public abstract class BaseEntity
    {
        public Guid? ID { get; set; }
        public string CreatedBY { get; set; }
        public DateTime? DateCreated { get; set; }
        public bool? Deleted { get; set; }
        public string DeletedBy { get; set; }
        public DateTime? DeleteDate { get; set; }
        public string DeleteStatus { get; set; }
    }
}
