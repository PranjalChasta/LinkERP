using LinkERP.DTO.Account.ChangePassword;
using LinkERP.DTO.Account.ForgotPassword;
using LinkERP.DTO.Account.ResetPassword;
using LinkERP.Entity.SYS;
using LinkERPPOS.DTO.Login;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.Account.Interfaces
{
    public interface IAccountRepository
    {
        LBS_SYS_User Authenticate(string LoginID, string Password);
        bool SetNewPassword(LBS_SYS_User lBS_SYS_User);
        LBS_SYS_User GetForgotPasswordUserDetails(string LoginID);
        bool ResetPassword(ResetPassword resetPassword);
        bool ChangePassword(ChangePassword resetPassword);
        void UpdateLogOut(string LoginID);
        LBS_SYS_User CheckUserName(string LoginID);
        LBS_SYS_User CheckSecurityQuestion(ResetSecurityQuestion resetSecurityQuestion);
        
    }
}
