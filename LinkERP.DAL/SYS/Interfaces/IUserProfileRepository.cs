using LinkERP.DTO.SYS.UserProfile;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
    public interface IUserProfileRepository 
    {
        void UpdateUser(User lBS_SYS_User);
        User GetUserByLoginID(string LoginID);
    }
}
