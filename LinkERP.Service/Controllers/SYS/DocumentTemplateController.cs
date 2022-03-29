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
    public class DocumentTemplateController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IDocumentTemplateService documentTemplateService;
        public DocumentTemplateController(ILogger<IDocumentTemplateService> _logger, IDocumentTemplateService _documentTemplateService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            documentTemplateService = _documentTemplateService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_DocumentTemplate table.
        [HttpPost("[action]")]
        public IActionResult AddDocumentTemplate([FromBody]LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Document Template to storage");
                var data = documentTemplateService.AddDocumentTemplate(lBS_SYS_DocumentTemplate);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Template Name Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Template Name added successfully";
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
        // Update Records into LBS_SYS_DocumentTemplate table.
        [HttpPost("[action]")]
        public IActionResult UpdateDocumentTemplate([FromBody]LBS_SYS_DocumentTemplate lBS_SYS_DocumentTemplate)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Document Template to storage");
                var data = documentTemplateService.UpdateDocumentTemplate(lBS_SYS_DocumentTemplate);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Template Name Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Document Template updated successfully";
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
        // To Fetch All Records from LBS_SYS_DocumentTemplate table.
        [HttpGet("[action]")]
        public IActionResult GetAllDocumentTemplates()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Document Template data");
                var data = documentTemplateService.GetAllDocumentTemplates(CompanyID);

                response.Data = new
                {
                    documents = data
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
        // To Fetch Records from LBS_SYS_DocumentTemplate table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetDocumentTemplateByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving Document Template  by ID from storage");
                var data = documentTemplateService.GetDocumentTemplateByID(ID);

                response.Data = new
                {
                    country = data
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
        // Delete Records from LBS_SYS_DocumentTemplate table.
        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteDocumentTemplateByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Document Template by ID from storage");
                var data = documentTemplateService.DeleteDocumentTemplateByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Document Template deleted successfully";
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
        //To get DocumentTemplate details By CompanyID
        [HttpGet("[action]/{CompanyID}")]
        public IActionResult GetDocumentByCompanyID(Guid CompanyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retrieving Document Template  by ID from storage");
                var data = documentTemplateService.GetDocumentByCompanyID(CompanyID);

                response.Data = new
                {
                    document = data
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

