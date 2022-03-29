using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LinkERP.Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private Guid companyId;
        private string loginID;
        public Guid CompanyID   // property
        {
            get
            {
                if (Request.Headers.ContainsKey("CompanyID"))
                {
                    //ideally it should be encrypted companyid field in header..and here it should decrypt

                    return Guid.Parse(Request.Headers["CompanyID"].ToString());
                }

                return companyId;
            }

        }
        public string LoginID
        {
            get
            {
                if (Request.Headers.ContainsKey("LoginID"))
                {
                    //ideally it should be encrypted companyid field in header..and here it should decrypt
                    return Request.Headers["LoginID"].ToString();
                }
                return loginID;
            }
        }

    }
}