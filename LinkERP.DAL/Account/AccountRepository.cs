using Dapper;
using LinkERP.DAL.Account.Interfaces;
using LinkERP.DTO.Account.ChangePassword;
using LinkERP.DTO.Account.ForgotPassword;
using LinkERP.DTO.Account.ResetPassword;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using LinkERPPOS.DTO.Login;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
//using System.Security.Claims;
using System.Text;

namespace LinkERP.DAL.Account
{
    public class AccountRepository : BaseRepository, IAccountRepository
    {
        public LBS_SYS_User Authenticate(string LoginID, string Password)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@Password", Password);

            var User = con.Query<LBS_SYS_User>("AuthenticateManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return User;
        }
        public LBS_SYS_User GetForgotPasswordUserDetails(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@Action", "GetForgotPasswordUserDetails");

            var User = con.Query<LBS_SYS_User>("AuthenticateManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return User;
        }
        public LBS_SYS_User CheckUserName(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);
            parameters.Add("@Action", "CheckUserName");

            var User = con.Query<LBS_SYS_User>("AuthenticateManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return User;
        }
        public LBS_SYS_User CheckSecurityQuestion(ResetSecurityQuestion resetSecurityQuestion)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", resetSecurityQuestion.LoginID);
            parameters.Add("@SecurityQuestion", resetSecurityQuestion.SecurityQuestion);
            parameters.Add("@SecurityAnswer", resetSecurityQuestion.SecurityAnswer);
            parameters.Add("@Action", "CheckSecurityQuestion");

            var User = con.Query<LBS_SYS_User>("AuthenticateManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return User;
        }

        public bool ResetPassword(ResetPassword resetPassword)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", resetPassword.LoginID);
            parameters.Add("@Password", resetPassword.Password);
            parameters.Add("@Action", "ResetPassword");

            SqlMapper.Query(con, "AuthenticateManagement",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            return true;
        }
        public bool SetNewPassword(LBS_SYS_User lBS_SYS_User)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", lBS_SYS_User.LoginID);
            parameters.Add("@Password", lBS_SYS_User.Password);
            parameters.Add("@SecurityQuestion", lBS_SYS_User.SecurityQuestion);
            parameters.Add("@SecurityAnswer", lBS_SYS_User.SecurityAnswer);
            parameters.Add("@Flag", "SetNewPassword");

            SqlMapper.Query(con, "SYS_UpdatePassword",
                                param: parameters,
                                commandType: CommandType.StoredProcedure).FirstOrDefault();
            return true;
        }


        public bool ChangePassword(ChangePassword resetPassword)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", resetPassword.LoginID);
            parameters.Add("@OldPassword", resetPassword.OldPassword);
            parameters.Add("@NewPassword", resetPassword.NewPassword);
            parameters.Add("@IsPasswordChanged", dbType: DbType.Boolean, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_ChangePassword",
                               param: parameters,
                               commandType: CommandType.StoredProcedure).FirstOrDefault();
            var response = parameters.Get<bool>("@IsPasswordChanged");
            return response;
        }
        public void UpdateLogOut(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", LoginID);

            string Query = @"UPDATE LBS_SYS_Users
                                SET
	                                LogOnStatus=0
                                WHERE
	                                LoginID=@LoginID";
            SqlMapper.Query(con, Query,
                               param: parameters,
                               commandType: CommandType.Text);
        }
        
    }
}
