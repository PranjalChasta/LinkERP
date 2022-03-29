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
    public class DeleteRecordsController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IDeleteRecordsService deleteRecordsService;
        public DeleteRecordsController(ILogger<IDeleteRecordsService> _logger, IDeleteRecordsService _deleteRecordsService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            deleteRecordsService = _deleteRecordsService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        [HttpPost("[action]/{ID}/{TableName}/{DeletedBy}")]
        public IActionResult DeleteRecordsBYID(Guid ID, string TableName, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the "+ TableName + " by ID from storage");
                var data = deleteRecordsService.DeleteRecordsBYID(ID, TableName, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message =   TableName + "  deleted successfully";
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