using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.UserProfile;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class UserProfileService: IUserProfileService
    {
        IUserProfileRepository userProfileRepository;
        public UserProfileService(IUserProfileRepository _userProfileRepository)
        {
            userProfileRepository = _userProfileRepository;
        }

        public User GetUserByLoginID(string LoginID)
        {
            return userProfileRepository.GetUserByLoginID(LoginID);
        }

        public void UpdateUser(User lBS_SYS_User)
        {
            userProfileRepository.UpdateUser(lBS_SYS_User);
        }
    }
}
