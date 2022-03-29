using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
  //  [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class BankAccountController : Controller
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IBankAccountService bankService;
        public BankAccountController(ILogger<ICompanyService> _logger, IBankAccountService _bankService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            bankService = _bankService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // To Fetch All Records from LBS_SYS_BankAccount table.
        [HttpGet("[action]")]
        public IActionResult GetAllBankAccount()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data");
                var data = bankService.GetAllBankAccount();

                response.Data = new
                {
                    bank = data
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
        // Add Records into LBS_SYS_BankAccount table.
        [HttpPost("[action]")]
        public IActionResult AddBankAccount([FromBody]IList<LBS_SYS_BankAccount> lBS_SYS_Bank)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Bank to storage");
                var data = bankService.AddBankAccount(lBS_SYS_Bank);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "BankAccount  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Bank added successfully";
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


        //[HttpPost("[action]")]
        //public IActionResult UpdateBankAccount([FromBody]LBS_SYS_BankAccount lBS_SYS_Bank )
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Adding the Bank to storage");
        //        var data = bankService.UpdateBankAccount (lBS_SYS_Bank);

        //        response.Data = new
        //        {
        //            id = data
        //        };
        //        response.IsSuccess = true;
        //        response.Message = "Bank added successfully";
        //        return Ok(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        response.IsSuccess = false;
        //        response.Message = "Error: " + ex.Message;
        //        logger.LogError($"Error: {ex.Message}");
        //        return BadRequest(response);
        //    }
        //}


        // To Fetch Records from LBS_SYS_BankAccount table By BankID.
        [HttpGet("[action]/{BankID}")]
        public IActionResult GetBankAccountByBankID (Guid BankID)
        
            {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data by ID from storage");
                var data = bankService.GetBankAccountByBankID(BankID);

                response.Data = new
                {
                    bank = data
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

        [HttpPost("[action]/{BankID}/{DeletedBy}")]
        public IActionResult DeleteBankAccountByID(Guid BankID,string DeletedBy, [FromBody]string[] DeletedAccountNo)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Bank by ID from storage");
                var data = bankService.DeleteBankAccountByID(BankID,DeletedAccountNo, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "BankAccount deleted successfully";
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

        // To Fetch Records from LBS_SYS_BankAccount table By BankID.
        [HttpPost("[action]/{ID}/{AccountNo}")]
        public IActionResult DeleteBankAccount(Guid ID, string AccountNo)

        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data by ID from storage");
                var data = bankService.DeleteBankAccount(ID, AccountNo);

                response.Data = new
                {
                    DeleteBank = data
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
    }
}