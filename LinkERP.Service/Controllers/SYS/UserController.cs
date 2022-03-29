using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DTO.SYS.User.ResetPassword;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using LinkERP.Service.Helper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Utilities = LinkERP.Service.Helper.Utilities;

namespace LinkERP.Service.Controllers.SYS
{
    //[Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class UserController: BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IUserService userService;
        public UserController(ILogger<IUserService> _logger, IUserService _userService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            userService = _userService;
            logger = _logger;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        // To Fetch All Records from LBS_SYS_User table.
        [HttpGet("[action]")]
        public IActionResult GetUsers()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Users data");
                var data = userService.GetUser();

                response.Data = new
                {
                    users = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
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

        // To Fetch Records from LBS_SYS_User table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetUserByID(string ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving User data by ID from storage");
                var data = userService.GetUserByID(ID);

                response.Data = new
                {
                    users = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
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
        // Add Records into LBS_SYS_User table.
        [HttpPost("[action]")]
        public async Task<IActionResult> AddUser([FromBody]LBS_SYS_User lBS_SYS_User)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Company to storage");
                // lBS_SYS_User.flag = "ADD";
                
                string Password = Utilities.CreateRandomPassword(12);
                string EncryptedPassword =  EncryptionDecryption.Encrypt(Password);

                lBS_SYS_User.Password = EncryptedPassword;

               var  data =  userService.AddUser(lBS_SYS_User);
                 
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "user name  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "user added successfully";
                    SendUserCreationMail(lBS_SYS_User.EmailAddress, lBS_SYS_User.LoginID, Password);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                if(ex.Message.Contains("PRIMARY KEY"))
                {
                    response.IsSuccess = false;
                    response.Message = "User ID already exists ";
                    logger.LogError($"Error: {ex.Message}");
                    return Ok(response);
                }
                
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }
        // Update Records into LBS_SYS_User table.
        [HttpPost("[action]")]
        public IActionResult UpdateUser([FromBody]LBS_SYS_User lBS_SYS_User)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                // lBS_SYS_User.flag = "Edit";
                var data = userService.UpdateUser(lBS_SYS_User);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "user updated successfully";
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

        [HttpGet("[action]/{LoginID}")]
        public IActionResult ResetAndSendPasswordMail(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                string Password = Utilities.CreateRandomPassword(12);
                string EncryptedPassword = EncryptionDecryption.Encrypt(Password);
                ResetNewPassword resetNewPassword = new ResetNewPassword();
                resetNewPassword.LoginID = LoginID;
                resetNewPassword.Password = EncryptedPassword;
                var data = userService.ResetPassword(resetNewPassword);

                SendUserCreationMail(data.EmailAddress, data.LoginID, Password);
                response.Data = new
                {
                    data = data
                };
                response.IsSuccess = true;
                response.Message = "user updated successfully";
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
        // Delete Records from LBS_SYS_User table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteUserByID(string ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the User by ID from storage");
                var data = userService.DeleteUserByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "User deleted successfully";
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
        public async Task<bool>  SendUserCreationMail(string Email, string UserName, string Password)//IList<EmailTemplate> Template
        {
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
                string email_from = iconfiguration.GetSection("Smtp").GetSection("User").Value;
                string email_to = Email;//To Email
                string email_frmpwd = iconfiguration.GetSection("Smtp").GetSection("Pass").Value;
                MailMessage objMailMessage = new MailMessage();
                objMailMessage.To.Add(new MailAddress(email_to));
                objMailMessage.From = new MailAddress(email_from, "LinkERPUser");
                //objMailMessage.Subject = Template[0].Subject;
                objMailMessage.Subject = "Link ERP User creation";

                //objMailMessage.Body = Template[0].Body.Replace("[localhost:4200]", iconfiguration.GetSection("Smtp").GetSection("ZameendarApphost").Value).Replace("[page/id]", URL).Replace("[UserName]", userName);
                objMailMessage.Body = "User Name : " + UserName + "<br>Password : " + Password;
                objMailMessage.IsBodyHtml = true;
                objMailMessage.Priority = MailPriority.High;
                SmtpClient objSmptpClient = new SmtpClient();
                objSmptpClient.Host = iconfiguration.GetSection("Smtp").GetSection("Host").Value;
                objSmptpClient.Port = int.Parse(iconfiguration.GetSection("Smtp").GetSection("Port").Value.ToString());
                objSmptpClient.EnableSsl = bool.Parse(iconfiguration.GetSection("Smtp").GetSection("EnableSSL").Value.ToString());
                objSmptpClient.UseDefaultCredentials = false;
                objSmptpClient.Credentials = new System.Net.NetworkCredential(email_from, email_frmpwd);
                objSmptpClient.Send(objMailMessage);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        [HttpGet("[action]")]
        public IActionResult GetSalesPerson()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving SalesPerson data");
                var data = userService.GetSalesPerson(CompanyID);

                response.Data = new
                {
                    SalesPerson = data
                };
                response.IsSuccess = true;
                response.Message = data == null ? "Record(s) not found" : "";
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
        public IActionResult AddupdateSalesPerson([FromBody]LBS_SOP_SalesPerson LBS_SOP_SalesPerson)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the SalesPerson to storage");
                // lBS_SYS_User.flag = "Edit";
                var data = userService.AddupdateSalesPerson(LBS_SOP_SalesPerson);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "SalesPerson updated successfully";
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
        [HttpGet("[action]/{LoginID}")]
        public IActionResult GeCompanyAccessByLoginID(string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
               
                var data = userService.GeCompanyAccessByLoginID(LoginID);

                response.Data = new
                {
                    RoleCompanyAccess = data
                };
                response.IsSuccess = true;
                response.Message = "CompanyAccessByLoginID retrieved successfully";
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

        [HttpGet("[action]/{LoginID}/{CompanyID}")]
        public IActionResult GeWareHouseAccessByLoginID(string LoginID,Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {

                var data = userService.GeWareHouseAccessByLoginID(LoginID, CompanyID);

                response.Data = new
                {
                    RoleCompanyAccess = data
                };
                response.IsSuccess = true;
                response.Message = "WarehouseAccessByLoginID retrieved successfully";
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
    }
}