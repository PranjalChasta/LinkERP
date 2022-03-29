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
using Newtonsoft.Json;

namespace LinkERP.Service.Controllers.SYS
{
    //[Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class TaxCodeDetailsController :ControllerBase
    {   
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ITaxCodeDetailsService taxCodeDetailsService ;
        public TaxCodeDetailsController(ILogger<ITaxCodeDetailsService> _logger, ITaxCodeDetailsService _taxCodeDetailsService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            taxCodeDetailsService = _taxCodeDetailsService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_TaxCodeDetail table.
        [HttpPost("[action]")]
        public IActionResult AddTaxCodeDetails([FromBody]LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the TaxCode Details to storage");
                var data = taxCodeDetailsService.AddTaxCodeDetails(lBS_SYS_TaxCodeDetail);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "TaxLabel  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "TaxCode Details added successfully";
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
        // Update Records into LBS_SYS_TaxCodeDetail table.
        [HttpPost("[action]")]
        public IActionResult UpdateTaxCodeDetails([FromBody]LBS_SYS_TaxCodeDetail lBS_SYS_TaxCodeDetail)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the TaxCode Details to storage");
                var data = taxCodeDetailsService.UpdateTaxCodeDetails(lBS_SYS_TaxCodeDetail);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "TaxCode label Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "TaxCode Details updated successfully";
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
        // To Fetch All Records from LBS_SYS_TaxCodeDetail table.
        [HttpGet("[action]")]
        public IActionResult GetAllTaxCodeDetails()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving TaxCode Details data");
                var data = taxCodeDetailsService.GetAllTaxCodeDetails();

                response.Data = new
                {
                    taxcodedetails = data
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
        // To Fetch Records from LBS_SYS_TaxCodeDetail table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetTaxCodeDetailsByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving TaxCode Details data by ID from storage");
                var data = taxCodeDetailsService.GetTaxCodeDetailsByID(ID);

                response.Data = new
                {
                    taxcodedetails = data
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
        // To Fetch Records from LBS_SYS_TaxCodeDetail table By TaxCodeID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetTaxCodeDetailsByTaxCodeID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving TaxCode Details data by ID from storage");
                var data = taxCodeDetailsService.GetTaxCodeDetailsByTaxCodeID(ID);

                response.Data = new
                {
                    taxcodedetails = data
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
        public IActionResult AddUpdateTaxcodeData([FromBody] IList<LBS_SYS_TaxCodeDetail> lBS_SYS_TaxCodeDetail)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding TaxCode to storage");
                var UpdateMsg = taxCodeDetailsService.AddUpdateTaxcodeData(JsonConvert.SerializeObject(lBS_SYS_TaxCodeDetail));
                response.Data = new
                {
                    id = UpdateMsg
                };
                if (UpdateMsg == "Success")
                {
                    response.IsSuccess = true;
                    response.Message = "WorkFlow Data added successfully";
                }
                else
                {
                    response.IsSuccess = false;
                    response.Message = UpdateMsg;
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

    }
}
