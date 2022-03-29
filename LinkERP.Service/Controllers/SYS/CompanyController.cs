using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL;
using LinkERP.Entity;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SYS
{
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CompanyController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICompanyService companyService;
        BaseRepository objdal =new BaseRepository();
        public CompanyController(ILogger<ICompanyService> _logger, ICompanyService _companyService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            companyService = _companyService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
            Guid companyId = Guid.NewGuid();
           // LBSTest.CompanyID = companyId;
            //LBSTest.CompanyID = companyId;
        }


        [HttpGet("[action]")]
        public IActionResult GetCompanies()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                Guid companyID = CompanyID;
             
                logger.LogInformation("Retriving Companies data");
                var data = companyService.GetCompanies();

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

        [HttpGet("[action]")]
        public IActionResult GetAllCompanies()
        {
            ResponseModel response = new ResponseModel();
            try
            {

                Guid companyID = CompanyID;

                logger.LogInformation("Retriving Companies data");
                var data = companyService.GetAllCompanies();

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

        [HttpGet("[action]/{ID}")]
        public IActionResult GetCompanyByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Company data by ID from storage");
                var data = companyService.GetCompanyByID(ID);

                response.Data = new
                {
                    company = data
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
        public IActionResult AddCompany([FromBody]LBS_SYS_Company lBS_SYS_Company)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Company to storage");
                var data = companyService.AddCompany(lBS_SYS_Company);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Company Code  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Company added successfully";
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("UNIQUE KEY"))
                {
                    response.IsSuccess = false;
                    response.Message = "Company Code already exists";
                    logger.LogError($"Error: {ex.Message}");
                    return Ok(response);
                }
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }

        [HttpPost("[action]")]
        public IActionResult UpdateCompany([FromBody]LBS_SYS_Company lBS_SYS_Company)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Company to storage");
                var data = companyService.UpdateCompany(lBS_SYS_Company);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = "Company Code  Already Exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Company updated successfully";
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("UNIQUE KEY"))
                {
                    response.IsSuccess = false;
                    response.Message = "Company Code already exists";
                    logger.LogError($"Error: {ex.Message}");
                    return Ok(response);
                }
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return BadRequest(response);
            }
        }

        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteCompanyByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the Company by ID from storage");
                var data = companyService.DeleteCompanyByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "Company deleted successfully";
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