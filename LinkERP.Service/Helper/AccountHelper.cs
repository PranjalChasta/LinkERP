using LinkERP.BLL.Account;
using LinkERP.BLL.Account.Interfaces;
using LinkERP.Entity.Utilities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LinkERP.Service.Helper
{
    public class AccountHelper : IAccountHelper
    {
        private IAccountService accountService;

        public AccountHelper(IAccountService _accountService)
        {
            accountService = _accountService;
        }
        public LoginUser Authenticate(string LoginID, string Password)
        {

            LoginUser loginUser = null;

            var data = accountService.Authenticate(LoginID, Password);

            if (data != null)
            {
                loginUser = new LoginUser();
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("AspireSoftwareDevelopment");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, data.LoginID.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                loginUser.LoginID = data.LoginID;
                loginUser.LoginName = data.LoginName;
                loginUser.ResetPassword = data.ResetPassword;
                loginUser.ForcePasswordChange = data.ForcePasswordChange;
                loginUser.WindowsUserName = data.WindowsUserName;
                loginUser.AuthenticationMode = data.AuthenticationMode;
                loginUser.DefaultCompanyID = data.DefaultCompanyID;
                loginUser.CompanyID = data.DefaultCompanyID;
                loginUser.LogOnStatus = data.LogOnStatus;
               
                loginUser.Token = tokenHandler.WriteToken(token);
                if (data.LoginAvatorbyte != null && data.LoginAvatorbyte.Length > 0)
                {
                    loginUser.LoginAvator = Convert.ToBase64String(data.LoginAvatorbyte);
                }

            }
            return loginUser;

        }


    }
}
