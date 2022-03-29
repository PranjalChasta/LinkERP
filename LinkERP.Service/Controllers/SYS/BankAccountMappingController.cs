using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class BankAccountMappingController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IBankAccountMappingService bankmappingService;
        public BankAccountMappingController(ILogger<ICompanyService> _logger, IBankAccountMappingService _bankmappingService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            bankmappingService = _bankmappingService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_BankAccountMapping table.
        [HttpPost("[action]")]
        public IActionResult AddBankAccountMapping([FromBody]IList<LBS_SYS_BankAccountsMapping> lBS_SYS_BankMapping)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Bank to storage");
                var data = bankmappingService.AddBankAccountMapping(lBS_SYS_BankMapping);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "mapping number is already exist";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "BankAccountMapping added successfully";
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

        // To Fetch All Records from LBS_SYS_BankAccountMapping table.
        [HttpGet("[action]")]
        public IActionResult GetAllBankAccountMapping()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data");
                var data = bankmappingService.GetAllBankAccountMapping(CompanyID);

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

        [HttpGet("[action]/{BankCodeFrom}")]
        public IActionResult GetBankAccountMappingByBankID(Guid BankCodeFrom)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Bank data");
                var data = bankmappingService.GetBankAccountMappingByBankID(BankCodeFrom, CompanyID);

                response.Data = new
                {
                    BankAccountMapping = data
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
        //[HttpPost("[action]/{ID}/{DeletedBy}")]
        //public IActionResult DeleteBankAccountMappingByID(Guid ID, string DeletedBy)
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Deleting the Bank by ID from storage");
        //        var data = bankmappingService.DeleteBankAccountMappingByID(ID, DeletedBy);

        //        response.Data = new
        //        {
        //            isDeleted = data
        //        };
        //        response.IsSuccess = true;
        //        response.Message = "Bank deleted successfully";
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
    }
}