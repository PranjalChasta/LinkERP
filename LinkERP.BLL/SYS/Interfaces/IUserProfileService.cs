using LinkERP.DTO.SYS.UserProfile;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS.Interfaces
{
    public interface IUserProfileService
    {
        void UpdateUser(User lBS_SYS_User);
        User GetUserByLoginID(string LoginID);
    }
}
