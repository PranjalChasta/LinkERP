using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
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
    public class ReportDocumentTemplateController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IReportDocumentTemplateService reportDocumentTemplateService;
        public ReportDocumentTemplateController(ILogger<ReportDocumentTemplateController> _logger, IReportDocumentTemplateService _reportDocumentTemplateService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            reportDocumentTemplateService = _reportDocumentTemplateService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpPost("[action]")]
        public IActionResult AddReportDocumentTemplate([FromBody]LBS_SYS_ReportDocumentTemplate lBS_SYS_ReportDocumentTemplate)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Document Template to storage");
                var data = reportDocumentTemplateService.AddReportDocumentTemplate(lBS_SYS_ReportDocumentTemplate);
                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Template Name added successfully";

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


        [HttpGet("[action]/{DocumentTemplateID}")]
        public IActionResult GetReportNames(Guid DocumentTemplateID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Fetching Report Names from storage");
                var data = reportDocumentTemplateService.GetReportNames(DocumentTemplateID, CompanyID);
                response.Data = new
                {
                    ReportNames = data
                };
                response.IsSuccess = true;
                response.Message = "Report Names retrivied successfully";

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


        //[HttpGet("[action]")]
        //public IActionResult GetDocumentTemplates()
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Fetching Report Names from storage");
        //        var data = reportDocumentTemplateService.GetReportNames(CompanyID);
        //        response.Data = new
        //        {
        //            ReportNames = data
        //        };
        //        response.IsSuccess = true;
        //        response.Message = "Report Names retrivied successfully";

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


        [HttpGet("[action]/{DocumentTemplateID}")]
        public IActionResult GetReportDocumentTemplate(Guid DocumentTemplateID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Fetching Report Document Template from storage");
                var data = reportDocumentTemplateService.GetReportDocumentTemplate(DocumentTemplateID, CompanyID);
                response.Data = new
                {
                    ReportDocumentTemplate = data
                };
                response.IsSuccess = true;
                response.Message = "Report Document Template retrivied successfully";

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