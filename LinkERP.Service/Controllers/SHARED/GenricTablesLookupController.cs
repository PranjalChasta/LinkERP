using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SHARED
{
    [Route("api/SHARED/[controller]")]
    [ApiController]
    public class GenricTablesLookupController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IGenricTablesLookupService tableDataService;
        public GenricTablesLookupController(ILogger<IGenricTablesLookupService> _logger, IGenricTablesLookupService _tableDataService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            tableDataService = _tableDataService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]")]
        public IActionResult GetLookup()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables");
                var data = tableDataService.GetLookup();

                response.Data = new
                {
                    tables = data
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
        [HttpGet("[action]/{TableCode}")]
        public IActionResult GetLookupByID(Guid TableCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Table data by TableID from storage");
                var data = tableDataService.GetLookupByID(TableCode, CompanyID);

                response.Data = new
                {
                    tabledata = data
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

        [HttpGet("[action]/{TableCode}/{ParentCode}")]
        public IActionResult GetChildLookup(Guid TableCode, Guid ParentCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Table data by TableID from storage");
                var data = tableDataService.GetChildLookup(TableCode, ParentCode,CompanyID);

                response.Data = new
                {
                    tabledata = data
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