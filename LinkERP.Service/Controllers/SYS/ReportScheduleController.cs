using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class ReportScheduleController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IReportScheduleService reportScheduleService;
        public ReportScheduleController(ILogger<ReportScheduleController> _logger, IReportScheduleService _reportScheduleService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            reportScheduleService = _reportScheduleService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]")]
        public IActionResult GetReportSchedules()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Fetching Schedule Report Details from storage");
                var data = reportScheduleService.GetReportSchedules(CompanyID);
                response.Data = new
                {
                    ReportSchedules = data
                };
                response.IsSuccess = true;
                response.Message = "Schedule Report retrivied successfully";

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
        public IActionResult AddReportSchedule([FromBody]LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding Schedule Report date to storage");
                var ID = reportScheduleService.AddReportSchedule(lBS_SYS_ReportSchedule);
                response.Data = new
                {
                    ID = ID
                };
                response.IsSuccess = true;
                response.Message = "Report schedule added successfully";

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
        public IActionResult UpdateReportSchedule([FromBody]LBS_SYS_ReportSchedule lBS_SYS_ReportSchedule)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding Schedule Report date to storage");
                reportScheduleService.UpdateReportSchedule(lBS_SYS_ReportSchedule);
                response.Data = 1;
                response.IsSuccess = true;
                response.Message = "Report schedule added successfully";

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
        [HttpGet("[action]/{ID}")]
        public IActionResult GetReportsScheduleByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving ReportSchedule data by ID from storage");
                var data = reportScheduleService.GetReportsScheduleByID(ID);

                response.Data = new
                {
                    report = data
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
        public IActionResult BackupDatabase([FromBody]SYSUtility SYSUtility)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving ReportSchedule data by ID from storage");
                var data = reportScheduleService.BackupDatabase(SYSUtility);
                if(data=="Successfull")
                {
                    response.Data = new
                    {
                        report = data
                    };
                    response.IsSuccess = true;
                }

                else
                {
                    response.IsSuccess = false;
                    response.Message = data;
                    logger.LogInformation(data);
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