using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using LinkERP.BLL.INV.Inventory.Interfaces;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.INV.Inventory;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


namespace LinkERP.Service.Controllers.SYS
{
   // [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class WorkFlowApproversController :ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IWorkFlowApproversService workFlowApproversService;
        public WorkFlowApproversController(ILogger<IWorkFlowApproversService> _logger, IWorkFlowApproversService _workFlowApproversService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            workFlowApproversService = _workFlowApproversService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        // Add Records into LBS_SYS_WorkFlowApprover table.
        //[HttpPost("[action]")]
        //public IActionResult AddWorkFlowApprover([FromBody]LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Adding the Workflow Approvers   to storage");
        //        var data = workFlowApproversService.AddWorkFlowApprover(lBS_SYS_WorkFlowApprover);

        //        response.Data = new
        //        {
        //            id = data
        //        };
        //        response.IsSuccess = false;
        //        if (data == "Success")
        //        {
        //            response.IsSuccess = true;
        //        }
        //        response.Message = data;
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
        [HttpPost("[action]")]
        public IActionResult AddWorkFlowApprover([FromBody]LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow Approver to storage");
                var data = workFlowApproversService.AddWorkFlowApprover(lBS_SYS_WorkFlowApprover);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "WorkFlow Approver added successfully";
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
        // Update Records into LBS_SYS_WorkFlowApprover table.
        [HttpPost("[action]")]
        public IActionResult UpdateWorkFlowApprover([FromBody]LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating WorkFlow Approver to storage");
                var data = workFlowApproversService.UpdateWorkFlowApprover(lBS_SYS_WorkFlowApprover);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "WorkFlow Approver updated successfully";
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
        //public IActionResult UpdateWorkFlowApprover([FromBody]LBS_SYS_WorkFlowApprover lBS_SYS_WorkFlowApprover)
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        logger.LogInformation("Updating the Workflow Approvers   to storage");
        //        var data = workFlowApproversService.UpdateWorkFlowApprover(lBS_SYS_WorkFlowApprover);

        //        response.Data = new
        //        {
        //            id = data
        //        };
        //        response.IsSuccess = false;
        //        if (data == "Success")
        //        {
        //            response.IsSuccess = true;
        //        }
        //        response.Message = data;
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
        // To Fetch All Records from LBS_SYS_WorkFlowApprover table.
        [HttpGet("[action]")]
        public IActionResult GetAllWorkflowApprovers()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Workflow Approvers  data");
                var data = workFlowApproversService.GetAllWorkflowApprovers();

                response.Data = new
                {
                    workflowapprovers = data
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
        // To Fetch Records from LBS_SYS_WorkFlowApprover table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetWorkflowApproversByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Workflow Approvers  data by ID from storage");
                var data = workFlowApproversService.GetWorkflowApproversByID(ID);

                response.Data = new
                {
                    workflowapprovers = data
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
        // To Fetch Records from LBS_SYS_WorkFlowApprover table By WorkflowID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetWorkflowApproversByWorkflowID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Workflow Approvers  data by ID from storage");
                var data = workFlowApproversService.GetWorkflowApproversByWorkflowID(ID);

                response.Data = new
                {
                    workflowapprovers = data
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
        //This method is for not getting the repeated Users in dropdown
        [HttpGet("[action]/{ID}/{LoginID}")]
        public IActionResult GetLoginUsersforworkflowApprovers(Guid ID,string LoginID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Login Users data from storage");
                var data = workFlowApproversService.GetLoginUsersforworkflowApprovers(ID, LoginID);

                response.Data = new
                {
                    workflowapprovers = data
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
