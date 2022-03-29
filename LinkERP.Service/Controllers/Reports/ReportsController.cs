using System;
using System.Collections.Generic;
using System.Linq;
//using System.Net.Mail;
using System.Threading.Tasks;
//using AspNetCore.Reporting.ReportExecutionService;
using LinkERP.BLL.Reports.Interfaces;
using LinkERP.DTO.Report;
using LinkERP.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.Reports
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IReportsBaseService reportsBaseService;
        public ReportsController(ILogger<ReportsController> _logger, IReportsBaseService _reportsBaseService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            reportsBaseService = _reportsBaseService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]/{ModuleID}")]
        public IActionResult GetReportsByModule(string ModuleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Reports data");
                var data = reportsBaseService.GetReportsByModule(ModuleID);

                response.Data = new
                {
                    reportsMetadata = data
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

        [HttpGet("[action]/{ReportID}")]
        public IActionResult GetReportsParametersDetailsByReportID(Guid ReportID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Reports data");
                var data = reportsBaseService.GetReportsParametersDetailsByReportID(ReportID);

                response.Data = new
                {
                    reportParameters = data
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