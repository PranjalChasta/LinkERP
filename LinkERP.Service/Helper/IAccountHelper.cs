using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkERP.Service.Helper
{
    public interface IAccountHelper
    {
        LoginUser Authenticate(string LoginID, string Password);
    }
}
