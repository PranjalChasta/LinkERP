using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using LinkERP.BLL.Account.Interfaces;
using LinkERP.DTO.Account.ChangePassword;
using LinkERP.DTO.Account.ForgotPassword;
using LinkERP.DTO.Account.ResetPassword;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using LinkERP.Service.Helper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IAccountService accountService;
        private Helper.IAccountHelper accountHelper;
        public AccountController(ILogger<AccountController> _logger, IAccountService _accountService, Helper.IAccountHelper _accountHelper, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            accountService = _accountService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
            accountHelper = _accountHelper;
        }

        [HttpPost("[action]")]
        public IActionResult Authenticate([FromBody]LoginUser loginUser)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Authenticate");
                Helper.AccountHelper account = new Helper.AccountHelper(accountService);
               // var password = EncryptionDecryption.Encrypt("INsW9o7j7A9ovfxOSl1W5g==");
                var data = account.Authenticate(loginUser.LoginID, EncryptionDecryption.Encrypt(loginUser.Password));

                if (data != null)
                {
                    response.Data = new
                    {
                        User = data
                    };
                    response.IsSuccess = true;
                    response.Message = "User Logged-in successfully";
                }
                else
                {
                    response.Data = new
                    {
                        User = data
                    };
                    response.IsSuccess = false;
                    response.Message = "In-valid User name/Password...!!!";
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }

        [HttpPost("[action]")]
        public IActionResult SetNewPassword([FromBody]LBS_SYS_User user)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Set New Password");
                //Helper.AccountHelper account = new Helper.AccountHelper(accountService);

                user.Password = EncryptionDecryption.Encrypt(user.Password);
                user.SecurityQuestion = EncryptionDecryption.Encrypt(user.SecurityQuestion.ToUpper());
                user.SecurityAnswer = EncryptionDecryption.Encrypt(user.SecurityAnswer.ToUpper());

                var data = accountService.SetNewPassword(user);

                response.Data = new
                {
                    NewPasswordUpdated = data
                };
                response.IsSuccess = true;
                response.Message = "New password updated successfully";

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }

        [HttpPost("[action]")]
        public IActionResult GetResetPasswordBySecurityQuestion([FromBody]ResetSecurityQuestion resetSecurityQuestion)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Set New Password");
                //Helper.AccountHelper account = new Helper.AccountHelper(accountService);


                resetSecurityQuestion.SecurityQuestion = EncryptionDecryption.Encrypt(resetSecurityQuestion.SecurityQuestion.ToUpper());
                resetSecurityQuestion.SecurityAnswer = EncryptionDecryption.Encrypt(resetSecurityQuestion.SecurityAnswer.ToUpper());

                var data = accountService.CheckSecurityQuestion(resetSecurityQuestion);

                if (data != null)
                {

                    string userName = resetSecurityQuestion.LoginID;
                    var Str = Encoding.UTF8.GetBytes(resetSecurityQuestion.LoginID + "|" + data.LoginName + "|" + DateTime.Now.ToString());
                    string encodedString = Convert.ToBase64String(Str);
                    var str2 = HttpUtility.UrlEncode(encodedString);
                    //var decodedBytes = Convert.FromBase64String(encodedString);
                    //string decodedString = Encoding.UTF8.GetString(decodedBytes);
                    //var URL = "reset-password/" + str2;
                    //var Email = user.EmailAddress;

                    response.Data = new
                    {
                        ResetPasswordLink = str2
                    };
                    response.IsSuccess = true;
                    response.Message = "";
                }
                else
                {
                    response.Data = new
                    {
                        ResetPasswordLink = ""
                    };
                    response.IsSuccess = false;
                    response.Message = "";
                }


                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }

        [HttpGet("[action]/{UserName}")]
        public IActionResult SendForgetPasswordRequest(string UserName)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Checking for Forget Password");
                var user = accountService.GetForgotPasswordUserDetails(UserName);


                if (user == null)
                {
                    response.Data = "";
                    response.IsSuccess = false;
                    response.Message = "Invalid Login Id";
                    return Ok(response);
                }
                //else if (status.Status == "User is locked")
                //{
                //    response.Data = status;
                //    response.IsSuccess = false;
                //    response.Message = "User is locked";
                //    return Ok(response);
                //}
                else
                {

                    string userName = user.LoginID;
                    var Str = Encoding.UTF8.GetBytes(user.LoginID + "|" + user.LoginName + "|" + DateTime.Now.ToString());
                    string encodedString = Convert.ToBase64String(Str);
                    var str2 = HttpUtility.UrlEncode(encodedString);
                    var decodedBytes = Convert.FromBase64String(encodedString);
                    string decodedString = Encoding.UTF8.GetString(decodedBytes);
                    var URL = "reset-password/" + str2;
                    var Email = user.EmailAddress;
                    string template = @"<p>Dear<strong> [UserName]</strong>,</p><p style='margin - left: 40px'>Please reset your password by using below link.</p><p style='margin - left: 40px'><a href='http://[localhost:4200]/[page/id]'>Click here to Reset Password</a></p><p style='margin-left: 80px'>(OR)</p><p style='margin-left: 40px'><a href='http://[localhost:4200]/[page/id]'>http://[localhost:4200]/[page/id]</a></p><p>Thanks & Regards</p><p><strong>Link ERP Application</strong></p>";
                    SendRestPasswordLinkToEmail(template, user.EmailAddress, URL, user.LoginName);

                    response.Data = "";// URL;
                    response.IsSuccess = true;
                    response.Message = "Forgot Password Details are sent to your Mail";
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Something went wrong: {ex.Message}");
                //return StatusCode(500, "Internal server error");
                return Ok((ex.Message));
            }

        }

        [HttpPost("[action]")]
        public IActionResult IsResetPasswordExpired([FromBody]ResetPasswordCode resetPasswordCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                string str = HttpUtility.UrlDecode(resetPasswordCode.Code);
                response.Data = CheckResetPasswordExpired(str);
                response.IsSuccess = true;
                response.Message = "Reset Password has been expired";
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError($"Something went wrong: {ex.Message}");
                //return StatusCode(500, "Internal server error");
                return Ok((ex.Message));
            }
        }

        public void SendRestPasswordLinkToEmail(string template, string Email, string URL, string userName)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            string email_from = iconfiguration.GetSection("Smtp").GetSection("User").Value;
            string email_to = Email;
            string email_frmpwd = iconfiguration.GetSection("Smtp").GetSection("Pass").Value;
            MailMessage objMailMessage = new MailMessage();
            objMailMessage.To.Add(new MailAddress(email_to));
            objMailMessage.From = new MailAddress(email_from, "Link ERP User");
            objMailMessage.Subject = "Link ERP reset password";

            objMailMessage.Body = template.Replace("[localhost:4200]", iconfiguration.GetSection("Smtp").GetSection("LinkERPApphost").Value).Replace("[page/id]", URL).Replace("[UserName]", userName);
            objMailMessage.IsBodyHtml = true;
            objMailMessage.Priority = MailPriority.High;
            SmtpClient objSmptpClient = new SmtpClient();
            objSmptpClient.Host = iconfiguration.GetSection("Smtp").GetSection("Host").Value;
            objSmptpClient.Port = int.Parse(iconfiguration.GetSection("Smtp").GetSection("Port").Value.ToString());
            objSmptpClient.EnableSsl = bool.Parse(iconfiguration.GetSection("Smtp").GetSection("EnableSSL").Value.ToString());
            objSmptpClient.UseDefaultCredentials = false;
            objSmptpClient.Credentials = new System.Net.NetworkCredential(email_from, email_frmpwd);
            objSmptpClient.Send(objMailMessage);

        }

        [HttpPost("[action]")]
        public IActionResult ResetPassword([FromBody]ResetPassword resetPassword)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Resetting new password");
                string str = HttpUtility.UrlDecode(resetPassword.ResetCode);
                var decodedBytes = Convert.FromBase64String(str);
                string decodedString = Encoding.UTF8.GetString(decodedBytes);
                var DecodedArray = decodedString.Split("|");

                resetPassword.LoginID = DecodedArray[0];
                double diffMins = (DateTime.Now - DateTime.Parse(DecodedArray[2])).TotalMinutes;
                resetPassword.Password = EncryptionDecryption.Encrypt(resetPassword.Password);

                bool resp = accountService.ResetPassword(resetPassword);

                response.Data = resp;
                response.IsSuccess = true;
                response.Message = "Password reset successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError($"Something went wrong: {ex.Message}");
                //return StatusCode(500, "Internal server error");
                return Ok((ex.Message));
            }
        }

        [HttpGet("[action]/{LoginID}")]
        public IActionResult CheckUserName(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Checking the UserName");

                var resp = accountService.CheckUserName(LoginID);
                if (resp != null)
                {
                    response.Data = true;
                }
                else
                {
                    response.Data = false;
                }
                response.IsSuccess = true;
                response.Message = "Password reset successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError($"Something went wrong: {ex.Message}");
                //return StatusCode(500, "Internal server error");
                return Ok((ex.Message));
            }
        }

        [HttpPost("[action]")]
        public IActionResult ChangePassword([FromBody]ChangePassword changePassword)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Changing the new password");
                //string str = HttpUtility.UrlDecode(changePassword.ResetCode);
                //var decodedBytes = Convert.FromBase64String(str);
                //string decodedString = Encoding.UTF8.GetString(decodedBytes);
                //var DecodedArray = decodedString.Split("|");

                //changePassword.LoginID = DecodedArray[0];
                //double diffMins = (DateTime.Now - DateTime.Parse(DecodedArray[2])).TotalMinutes;

                changePassword.OldPassword = EncryptionDecryption.Encrypt(changePassword.OldPassword);
                changePassword.NewPassword = EncryptionDecryption.Encrypt(changePassword.NewPassword);

                bool resp = accountService.ChangePassword(changePassword);
                response.Data = resp;
                response.IsSuccess = true;
                if (resp)
                {
                    response.Message = "Password updated successfully";
                }
                else
                {
                    response.Message = "Current password is invalid";
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError($"Something went wrong: {ex.Message}");
                //return StatusCode(500, "Internal server error");
                return Ok((ex.Message));
            }

        }
        private bool CheckResetPasswordExpired(string data)
        {
            var decodedBytes = Convert.FromBase64String(data);
            string decodedString = Encoding.UTF8.GetString(decodedBytes);
            var DecodedArray = decodedString.Split("|");

            double diffMins = (DateTime.Now - DateTime.Parse(DecodedArray[2])).TotalMinutes;
            int ExpiryMins = int.Parse(iconfiguration.GetSection("ResetPwdExpTimeInMins").Value);
            if (diffMins < ExpiryMins)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        [HttpPost("[action]/{LoginID}")]
        public IActionResult UpdateLogOut(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Logout the application");
                //Helper.AccountHelper account = new Helper.AccountHelper(accountService);
                accountService.UpdateLogOut(LoginID);

                response.Data = true;
                response.IsSuccess = true;
                response.Message = "LogOn Status updated successfully successfully";

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        public IActionResult actionResult()
        {
            return Ok();
        }

        [HttpGet("[action]/{Passwords}")]
        public IActionResult DecryptPassword(string Passwords)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Logout the application");
                //Helper.AccountHelper account = new Helper.AccountHelper(accountService);
                 

                response.Data = EncryptionDecryption.Decrypt(Passwords); ;
                response.IsSuccess = true;
                response.Message = "Successfully";

                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        public IActionResult Test4()
        {
            return Ok();
        }

        }
}