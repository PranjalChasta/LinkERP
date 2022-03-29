using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkERP.Service.Controllers.SYS
{
    [Route("api/SYS/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        public IProfileService profileService;

        [HttpGet("[action]")]
        public IActionResult GetcheckboxCountrie([FromBody] LBS_SYS_Profile lBS_SYS_Profile)
        {


            return Ok();
        }

            public IActionResult Index()
        {

            return Ok();
        }
    }
}
