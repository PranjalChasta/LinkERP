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
using Newtonsoft.Json;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class GenericMasterTableController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IGenericMasterTableService tableDataService;
        public GenericMasterTableController(ILogger<IGenericMasterTableService> _logger, IGenericMasterTableService _tableDataService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
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
                logger.LogInformation("Retriving Table data");
                var data = tableDataService.GetAllTableData(CompanyID);

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
        [HttpGet("[action]")]
        public IActionResult GetAllTables()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables");
                var data = tableDataService.GetAllTables();

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
        public IActionResult GetTableDataByTableDataID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving table data by ID from storage");
                var data = tableDataService.GetTableDataByTableDataID(ID);

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
        [HttpGet("[action]/{ID}")]
        public IActionResult GetDataByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving table data by ID from storage");
                var data = tableDataService.GetDataByID(ID, CompanyID);

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

        [HttpGet("[action]/{ID}")]
        public IActionResult GetPriceChangeReasonDataByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving table data by ID from storage");
                var data = tableDataService.GetPriceChangeReasonDataByID(ID, CompanyID);

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
        public IActionResult AddTableData([FromBody] LBS_SYS_TableData  lBS_SYS_TableData)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var data = tableDataService.AddTableData(lBS_SYS_TableData);
                if (data == "DataCode")
                {
                    response.IsSuccess = false;
                    response.Message = "Table datacode already exists";
                }
                else if (data == "DataName")
                {
                    response.IsSuccess = false;
                    response.Message = "Table dataname already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Table data added successfully";
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
        [HttpPost("[action]")]
        public IActionResult UpdateTableData([FromBody] LBS_SYS_TableData lBS_SYS_TableData)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var data = tableDataService.UpdateTableData(lBS_SYS_TableData);
                if (data == "DataCode")
                {
                    response.IsSuccess = false;
                    response.Message = "Table datacode  already exists";
                } else if (data == "DataName")
                {
                    response.IsSuccess = false;
                    response.Message = "Table dataname  already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Table Data updated successfully";
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

        [HttpGet("[action]/{Module}")]
        public IActionResult GetAllModulesTables(string Module)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables");
                var data = tableDataService.GetAllModulesTables(Module);

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

        [HttpGet("[action]/{TableCode}/{ParentCode}")]
        public IActionResult GetChildLookup(Guid TableCode, Guid ParentCode)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Tables");
                var data = tableDataService.GetChildLookup(TableCode,ParentCode); 
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


        [HttpPost("[action]")]
        public IActionResult AddUpdateParentData([FromBody] IList<LBS_SYS_TableData> lBS_SYS_TableData)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding WorkFlow to storage");
                var data = tableDataService.AddUpdateParentData(JsonConvert.SerializeObject(lBS_SYS_TableData));
                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Table Data added successfully";
                if (data != "Success")
                {
                    response.IsSuccess = false;
                    response.Message = data;
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
