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

namespace LinkERP.Service.Controllers.SYS
{
    [Authorize]
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class CurrencyController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private ICurrencyService currencies;
        public CurrencyController(ILogger<ICurrencyService> _logger, ICurrencyService _currencies, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            currencies = _currencies;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        // To Fetch All Records from LBS_SYS_Currency table.
        [HttpGet("[action]")]
        public IActionResult GetCurrencies()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = currencies.GetCurrencies(CompanyID);

                response.Data = new
                {
                    currency = data
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
        // Add Records into LBS_SYS_Currency table.
        [HttpPost("[action]")]
        public IActionResult AddCurrency([FromBody]LBS_SYS_Currency lBS_SYS_Currency)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Currency Details to storage");
                var data = currencies.AddCurrency(lBS_SYS_Currency);
                if (data == "EXISTS")
                {
                    response.IsSuccess = false;
                    response.Message = "Currency Code already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Currency details  added successfully";
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

        // Update Records into LBS_SYS_Currency table.
        [HttpPost("[action]")]
        public IActionResult UpdateCurrency([FromBody]LBS_SYS_Currency lBS_SYS_Currency)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Currency Details to storage");
                var data = currencies.UpdateCurrency(lBS_SYS_Currency); 

                if (data == "EXISTS")
                {
                    response.IsSuccess = false;
                    response.Message = "Currency Code already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Currency details updated successfully";
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

        // To Fetch Records from LBS_SYS_Currency table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetCurrencyByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Currency Details data by ID from storage");
                var data = currencies.GetCurrencyByID(ID);

                response.Data = new
                {
                    currencybyID = data
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

        // To Fetch All Records from LBS_SYS_CurrencyRates table.
        [HttpGet("[action]")]
        public IActionResult GetCurrencyRates()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Companies data");
                var data = currencies.GetCurrencyRates();

                response.Data = new
                {
                    currency = data
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

        // Add Records into LBS_SYS_CurrencyRates table.
        [HttpPost("[action]")]
        public IActionResult AddCurrencyRate([FromBody]LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            ResponseModel response = new ResponseModel();
            try
                {
                logger.LogInformation("Adding the Currency Details to storage");
                var data = currencies.AddCurrencyRate(lBS_SYS_CurrencyRates);
                if (data == "Exists")
                {
                    response.IsSuccess = false;
                    response.Message = " Effective date  is already exists";
                }
                else
                {
                    response.Data = new
                    {
                        id = data
                    };
                    response.IsSuccess = true;
                    response.Message = "Currency Details added successfully";
                }
                //response.Data = new
                //{
                //    id = data
                //};
                //response.IsSuccess = true;
                //response.Message = "Currency Details added successfully";
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

        // Update Records into LBS_SYS_CurrencyRates table.
        [HttpPost("[action]")]
        public IActionResult UpdateCurrencyRate([FromBody]LBS_SYS_CurrencyRates lBS_SYS_CurrencyRates)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the Currency Details to storage");
                var data = currencies.UpdateCurrencyRate(lBS_SYS_CurrencyRates);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Currency Details updated successfully";
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
        // To Fetch Records from LBS_SYS_CurrencyRates table By ID.
        [HttpGet("[action]/{ID}")]
        public IActionResult GetCurrencyRateByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Currency Details data by ID from storage");
                var data = currencies.GetCurrencyRateByID(ID);

                response.Data = new
                {
                    currencyrates = data
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
        [HttpGet("[action]/{CurrencyID}")]
        public IActionResult GetCurrencyRatesExchange(Guid CurrencyID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Currency Details data by ID from storage");
                var data = currencies.GetCurrencyRatesExchange(CurrencyID);

                response.Data = new
                {
                    currencyratesexchange = data
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