using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class ProfileServices:IProfileService 
    {
        IProfileRepository profile;
        public ProfileServices(IProfileRepository _profile)
        {
            profile = _profile;
        }

        public string AddProfile(LBS_SYS_Profile lBS_SYS_Profile)
        {
            return profile.AddProfile(lBS_SYS_Profile);
        }
    }
}
