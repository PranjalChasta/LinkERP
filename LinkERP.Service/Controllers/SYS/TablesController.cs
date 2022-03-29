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

    public class TablesController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ITablesService  tablesService;
        public TablesController(ILogger<ITablesService> _logger, ITablesService _tablesService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            tablesService = _tablesService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        [HttpGet("[action]")]
        public IActionResult GetAllTables()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables data");
                var data = tablesService.GetAllTables();

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
        [HttpGet("[action]/{ID}")]
        public IActionResult GetTablesByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Table data by ID from storage");
                var data = tablesService.GetTablesByID(ID);

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
    }
}
