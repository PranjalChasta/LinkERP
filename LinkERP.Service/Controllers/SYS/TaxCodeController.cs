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

namespace LinkERP.Service.Controllers.INV
{
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class TaxCodeController :BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ITaxCodeService taxCodeService ;
        public TaxCodeController(ILogger<ITaxCodeService> _logger, ITaxCodeService _taxCodeService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            taxCodeService = _taxCodeService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_TaxCode table.
        [HttpPost("[action]")]
        public IActionResult AddTaxCode([FromBody]LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding TaxCode to storage");
                var data = taxCodeService.AddTaxCode(lBS_SYS_TaxCode);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Tax Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Tax Code added successfully";
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
        // Update Records into LBS_SYS_TaxCode table.
        [HttpPost("[action]")]
        public IActionResult UpdateTaxCode([FromBody]LBS_SYS_TaxCode lBS_SYS_TaxCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                //logger.LogInformation("Updating the TaxCode to storage");
               var data = taxCodeService.UpdateTaxCode(lBS_SYS_TaxCode);
                //response.Data = new
                //{
                //    id = data
                //};
                //response.IsSuccess = true;
                //response.Message = "TaxCode updated successfully";
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Tax Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Tax Code added successfully";
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
        // To Fetch All Records from LBS_SYS_TaxCode table.
        [HttpGet("[action]")]
        public IActionResult GetAllTaxCode()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving TaxCode data");
                var data = taxCodeService.GetAllTaxCode(CompanyID);

                response.Data = new
                {
                    taxCode = data
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
        // To Fetch Records from LBS_SYS_TaxCode table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetTaxCodeByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving TaxCode data by ID from storage");
                var data = taxCodeService.GetTaxCodeByID(ID);

                response.Data = new
                {
                    taxCode = data
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
        //public IActionResult DeleteTaxCodeByID(Guid ID, Guid DeletedBy)
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Deleting the TaxCode by ID from storage");
        //        var data = taxCodeService.DeleteTaxCodeByID(ID, DeletedBy);

        //        response.Data = new
        //        {
        //            isDeleted = data
        //        };
        //        response.IsSuccess = true;
        //        response.Message = "TaxCode deleted successfully";
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
