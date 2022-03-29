using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.GenericMaster;
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
    public class TableDataController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ITableDataService tableDataService;
        public TableDataController(ILogger<ITableDataService> _logger, ITableDataService _tableDataService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            tableDataService = _tableDataService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        [HttpGet("[action]")]
        public IActionResult GetAllTableData()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables data");
                var data = tableDataService.GetAllTableData();

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
        [HttpPost("[action]")]
        public IActionResult AddTableData([FromBody]LBS_SYS_TableData lBS_SYS_TableData)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Table Data to storage");
                var data = tableDataService.AddTableData(lBS_SYS_TableData);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Table Data added successfully";
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
        public IActionResult UpdateTableData([FromBody]LBS_SYS_TableData lBS_SYS_TableData)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Table Data to storage");
                var data = tableDataService.UpdateTableData(lBS_SYS_TableData);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Table updated added successfully";
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
        public IActionResult GetTableDataByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Table data by ID from storage");
                var data = tableDataService.GetTableDataByID(ID);

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
