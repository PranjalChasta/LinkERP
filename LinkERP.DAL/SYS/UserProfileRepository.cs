using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.UserProfile;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class UserProfileRepository : BaseRepository, IUserProfileRepository
    {
        //SYS_UpdateUserProfile

        public void UpdateUser(User lBS_SYS_User)
        {
            //byte[] images = null;
            DynamicParameters parameters = new DynamicParameters();
            //if (!string.IsNullOrEmpty(lBS_SYS_User.LoginAvator))
            //{
            //    string[] imgsplt = lBS_SYS_User.LoginAvator.Split(",");
            //    images = Convert.FromBase64String(imgsplt[1]);
            //}
            parameters.Add("@LoginId", lBS_SYS_User.LoginID);
            parameters.Add("@LoginName", lBS_SYS_User.LoginName);

            if (lBS_SYS_User.LoginAvator != null)
                parameters.Add("@LoginAvator", lBS_SYS_User.LoginAvator);
            parameters.Add("@EmailAddress", lBS_SYS_User.EmailAddress);
            parameters.Add("@PhoneNumber", lBS_SYS_User.PhoneNumber);
            parameters.Add("@MobileNumber", lBS_SYS_User.MobileNumber);
            parameters.Add("@TaxNumber", lBS_SYS_User.TaxNumber);
            parameters.Add("@Action", "Edit");

            SqlMapper.Query(con, "SYS_UserProfileManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

        }

        public User GetUserByLoginID(string LoginID)
        {

            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@LoginId", LoginID);
            parameters.Add("@Action", "GetByID");

            var response = con.Query<User>("SYS_UserProfileManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return response;

        }

    }
}
