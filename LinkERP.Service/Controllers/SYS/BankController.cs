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
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class BankController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IBankService bankService ;
        public BankController (ILogger<ICompanyService> _logger, IBankService _bankService , IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            bankService = _bankService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;           
        }


        // To Fetch All Records from LBS_SYS_Bank table.
        [HttpGet("[action]")]
        public IActionResult GetAllBank()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data");
                var data = bankService.GetAllBank(CompanyID);

                response.Data = new
                {
                    bank  = data
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

        // To Fetch Records from LBS_SYS_Bank  table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetBankByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data by ID from storage");
                var data = bankService.GetBankByID(ID);

                response.Data = new
                {
                    bank  = data
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

        // Add Records into LBS_SYS_Bank table.
        [HttpPost("[action]")]
        public IActionResult AddBank([FromBody]LBS_SYS_Bank lBS_SYS_Bank)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Bank to storage");
                var data = bankService.AddBank(lBS_SYS_Bank);
                if (data =="Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Bank Code is Already Exists";
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
        // Update Records into LBS_SYS_Bank table.
        [HttpPost("[action]")]
        public IActionResult UpdateBank([FromBody]LBS_SYS_Bank lBS_SYS_Bank)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Bank to storage");
                var data = bankService.UpdateBank(lBS_SYS_Bank);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Bank account `is already exist";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Bank updated successfully";
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
        // Delete Records from LBS_SYS_Bank  table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteBankByID (Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Bank by ID from storage");
                var data = bankService.DeleteBankByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Bank deleted successfully";
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