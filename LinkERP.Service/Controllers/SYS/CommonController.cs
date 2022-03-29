using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CommonController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICommonService commonService;
        public CommonController(ILogger<ICompanyService> _logger, ICommonService _commonService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            commonService = _commonService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }
        /// <summary>
        /// To retrieve the companies/organisations except deleted.
        /// </summary>
        /// <returns></returns>
        /// 
        // To Fetch All Records from LBS_SYS_Company table.
        [HttpGet("[action]")]
        public IActionResult GetCompanies()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = commonService.GetCompanies();

                response.Data = new
                {
                    companies = data
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

        // To Fetch All Records from LBS_SYS_RoleCompanyAccess table.
        [HttpGet("[action]")]
        public IActionResult GetRoleCompanyAccesses()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = commonService.GetRoleCompanyAccesses();

                response.Data = new
                {
                    companies = data
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
        // To Fetch All Records from LBS_SYS_Module table.
        [HttpGet("[action]")]
        public IActionResult GetModules()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Modules data");
                var data = commonService.GetModules();

                response.Data = new
                {
                    modules = data
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
        // To Fetch All Records from LBS_SYS_Country table.
        [HttpGet("[action]")]
        public IActionResult GetCountries()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetCountries();

                response.Data = new
                {
                    countries = data
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
        public IActionResult GetcheckboxCountries()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetcheckboxCountries();

                response.Data = new
                {
                    countriescheck = data
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

        // To Fetch All Records from LBS_SYS_State table.
        [HttpGet("[action]")]
        public IActionResult GetCountryState()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving states data");
                var data = commonService.GetCountryState();

                response.Data = new
                {
                    states = data
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

        // To Fetch All Records from LBS_SYS_City table.
        [HttpGet("[action]")]
        public IActionResult GetCountryStateCity()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving cities data");
                var data = commonService.GetCountryStateCity();

                response.Data = new
                {
                    cities = data
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
        // To Fetch Records from LBS_INV_State table By CountryID.
        [HttpGet("[action]/{CountryID}")]
        public IActionResult GetStatesBYCountryID(Guid CountryID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving states data");
                var data = commonService.GetStatesBYCountryID(CountryID);

                response.Data = new
                {
                    states = data
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
        // To Fetch Records from LBS_INV_City table By StateID.
        [HttpGet("[action]/{StateID}")]
        public IActionResult GetCitiesByStateID(Guid StateID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving cities data");
                var data = commonService.GetCitiesByStateID(StateID);

                response.Data = new
                {
                    cities = data
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

        [HttpGet("[action]/{ModuleID}")]
        public IActionResult GetMenusByModuleID(string ModuleID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Menus by ModuleID");
                var data = commonService.GetMenusByModuleID(ModuleID);

                response.Data = new
                {
                    menus = data
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

        [HttpGet("[action]/{RoleId}")]
        public IActionResult GetModulesByRokeID(Guid RoleId)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Modules by RoleID");
                var data = commonService.GetModulesByRokeID(RoleId);

                response.Data = new
                {
                    modules = data
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
        public IActionResult GetRoles()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Roles");
                var data = commonService.GetRoles();

                response.Data = new
                {
                    roles = data
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
        public IActionResult GetUserKit()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving ProductKits data");
                var data = commonService.GetUserKit();
                response.Data = new
                {
                    users = data
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
        public IActionResult GetWorkFlow()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving ProductKits data");
                var data = commonService.GetWorkFlow(CompanyID);
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

        [HttpGet("[action]")]
        public IActionResult GetTaxCode()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving ProductKits data");
                var data = commonService.GetTaxCode(CompanyID);
                response.Data = new
                {
                    taxcode = data
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
        public IActionResult GetCurrency()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving cuurncy data");
                var data = commonService.GetCurrency(CompanyID);
                response.Data = new
                {
                    cuurency = data
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
        public IActionResult GetActiveCountries()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetActiveCountries();

                response.Data = new
                {
                    countries = data
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
        public IActionResult GetActiveCities()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetActiveCities();

                response.Data = new
                {
                    cities = data
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
        public IActionResult GetActiveStates()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetActiveStates();

                response.Data = new
                {
                    states = data
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
        public IActionResult GetAllDebtors()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving country data");
                var data = commonService.GetAllDebtors(CompanyID);

                response.Data = new
                {
                    debtors = data
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
        public IActionResult GetFrequency()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Frequency Data data");
                var data = commonService.GetFrequency(CompanyID);

                response.Data = new
                {
                    Frequency = data
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
        public IActionResult GetReportNames()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Frequency Data data");
                var data = commonService.GetReportNames();

                response.Data = new
                {
                    ReportNames = data
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
        public IActionResult GetUsers()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Users Data data");
                var data = commonService.GetUsers();

                response.Data = new
                {
                    Users = data
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
        public IActionResult GetAdjustments()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Adjustments data");
                var data = commonService.GetAdjustments(CompanyID);
                response.Data = new
                {
                    adjustment = data
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