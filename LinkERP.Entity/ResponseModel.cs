using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.Entity
{
    public class ResponseModel
    {
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
        public object Data { get; set; }
    }
}
