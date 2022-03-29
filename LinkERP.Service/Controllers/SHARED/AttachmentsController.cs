using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SHARED;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SHARED
{
    [Route("api/SHARED/[controller]")]
    [ApiController]
    public class AttachmentsController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IAttachmentsService attachmentsService;
        public AttachmentsController(ILogger<IAttachmentsService> _logger, IAttachmentsService _attachmentsService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            attachmentsService = _attachmentsService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]")]
        public IActionResult GetAllAttachments()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Attachments data");
                var data = attachmentsService.GetAllAttachments();

                response.Data = new
                {
                    attachments = data
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

        [HttpGet("[action]/{RecID}")]
        public IActionResult GetAllAttachmentsByRecID(string RecID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Attachments data");
                var data = attachmentsService.GetAllAttachmentsByRecID(RecID);

                response.Data = new
                {
                    attachments = data
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
        public IActionResult AddAttachments([FromBody] IList<LBS_SYS_Attachments> lBS_SYS_Attachments)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Attachments to storage");
                //lBS_SYS_Attachments.flag = "ADD";
                var data = attachmentsService.AddAttachments(lBS_SYS_Attachments);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "attachments added successfully";
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



        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteAttachmentsBYID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the attachments by ID from storage");
                var data = attachmentsService.DeleteAttachmentsBYID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Attachments deleted successfully";
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
        //public IActionResult AddAttachments([FromBody]IList<LBS_SYS_Attachments> lBS_SYS_Attachments)
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Adding the Modules to storage");
        //        var data = "";// roleService.AddRoleModuleAccess(lstLBS_SYS_RoleModuleAccess);

        //        response.Data = new
        //        {
        //            id = data
        //        };
        //        response.IsSuccess = true;
        //        response.Message = "Role Module added successfully";
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
        [HttpGet("[action]/{ID}")]
        public IActionResult GetAttachmentByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Attachments data");
                var data = attachmentsService.GetAttachmentByID(ID);

                response.Data = new
                {
                    attachments = data
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