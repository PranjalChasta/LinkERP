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
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class WorkFlowController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IWorkFlowService workFlowService;
        public WorkFlowController(ILogger<IWorkFlowService> _logger, IWorkFlowService _workFlowService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            workFlowService = _workFlowService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_WorkFlow table.
        [HttpPost("[action]")]
        public IActionResult AddWorkFlow([FromBody]LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var data = workFlowService.AddWorkFlow(lBS_SYS_WorkFlow);

                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Workflow Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Workflow Code added successfully";
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
        // Update Records into LBS_SYS_WorkFlow table.
        [HttpPost("[action]")]
        public IActionResult UpdateWorkFlow([FromBody]LBS_SYS_WorkFlow lBS_SYS_WorkFlow)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the WorkFlow to storage");
                var data = workFlowService.UpdateWorkFlow(lBS_SYS_WorkFlow);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "WorkFlow Code Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "WorkFlow updated successfully";
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
        // To Fetch All Records from LBS_SYS_WorkFlow table.
        [HttpGet("[action]")]
        public IActionResult GetAllWorkFlows()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving WorkFlow data");
                var data = workFlowService.GetAllWorkFlows(CompanyID);

                response.Data = new
                {
                    workFlow = data
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
        // To Fetch Records from LBS_SYS_WorkFlow table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetWorkFlowByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving WorkFlow data by ID from storage");
                var data = workFlowService.GetWorkFlowByID(ID);

                response.Data = new
                {
                    workflow = data
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
        public IActionResult AddUpdateWorkFlowData([FromBody] IList<LBS_SYS_WorkFlow> lBS_SYS_WorkFlow)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var UpdateMsg = workFlowService.AddUpdateWorkFlowData(JsonConvert.SerializeObject(lBS_SYS_WorkFlow));
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
                //response.Data = new
                //{
                //    id = data
                //};
                //response.IsSuccess = true;
                //response.Message = "WorkFlow Data added successfully";
                //if (data != "Success")
                //{
                //    response.IsSuccess = false;
                //    response.Message = data;
                //}

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
