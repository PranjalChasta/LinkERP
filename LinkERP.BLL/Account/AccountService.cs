using LinkERP.BLL.Account.Interfaces;
using LinkERP.DAL.Account.Interfaces;
using LinkERP.DTO.Account.ChangePassword;
using LinkERP.DTO.Account.ForgotPassword;
using LinkERP.DTO.Account.ResetPassword;
using LinkERP.Entity.SYS;
using LinkERPPOS.DTO.Login;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.Account
{
    public class AccountService : IAccountService
    {
        IAccountRepository accountRepository;
        public AccountService(IAccountRepository _accountRepository)
        {
            accountRepository = _accountRepository;
        }
        public LBS_SYS_User Authenticate(string LoginID, string Password)
        {
            return accountRepository.Authenticate(LoginID, Password);
        }
        public bool ChangePassword(ChangePassword resetPassword)
        {
            return accountRepository.ChangePassword(resetPassword);
        }

        public LBS_SYS_User CheckSecurityQuestion(ResetSecurityQuestion resetSecurityQuestion)
        {
            return accountRepository.CheckSecurityQuestion(resetSecurityQuestion);
        }

        public LBS_SYS_User CheckUserName(string LoginID)
        {
            return accountRepository.CheckUserName(LoginID);
        }
        public LBS_SYS_User GetForgotPasswordUserDetails(string LoginID)
        {
            return accountRepository.GetForgotPasswordUserDetails(LoginID);
        }
        public bool ResetPassword(ResetPassword resetPassword)
        {
            return accountRepository.ResetPassword(resetPassword);
        }
        public bool SetNewPassword(LBS_SYS_User lBS_SYS_User)
        {
            return accountRepository.SetNewPassword(lBS_SYS_User);
        }

        public void UpdateLogOut(string LoginID)
        {
            accountRepository.UpdateLogOut(LoginID);
        }
        
    }
}