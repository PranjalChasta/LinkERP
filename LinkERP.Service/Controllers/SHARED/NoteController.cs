
   using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.BLL.SYS.Interfaces;
using LinkERP.Entity;
using LinkERP.Entity.SHARED;
using LinkERP.Entity.SYS;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.SHARED
{
    [Route("api/SHARED/[controller]")]
    [ApiController]
    public class NoteController : BaseController
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private INoteService noteservice;
        public NoteController(ILogger<INoteService> _logger, INoteService _noteservice, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            noteservice = _noteservice;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }


        [HttpGet("[action]")]
        public IActionResult GetNotes()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving notes data");
                var data = noteservice.GetNotes();

                response.Data = new
                {
                    notes = data
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
        public IActionResult GetNoteByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving note data by ID from storage");
                var data = noteservice.GetNoteByID(ID);

                response.Data = new
                {
                    note = data
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
        public IActionResult AddNote([FromBody]LBS_SYS_Notes lBS_SYS_Notes)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Adding the Note to storage");
                var data = noteservice.AddNote(lBS_SYS_Notes);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "Note added successfully";
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
        public IActionResult UpdateNote([FromBody]LBS_SYS_Notes lBS_SYS_Notes)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Updating the note to storage");
                var data = noteservice.UpdateNote(lBS_SYS_Notes);

                response.Data = new
                {
                    id = data
                };
                response.IsSuccess = true;
                response.Message = "note updated successfully";
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

        [HttpPost("[action]/{ID}/{DeletedBy}")]
        public IActionResult DeleteNoteByID(Guid ID, string DeletedBy)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Deleting the note by ID from storage");
                var data = noteservice.DeleteNoteByID(ID, DeletedBy);

                response.Data = new
                {
                    isDeleted = data
                };
                response.IsSuccess = true;
                response.Message = "note deleted successfully";
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
        public IActionResult GetNotetype()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving notes data");
                var data = noteservice.GetNotetype().Where(w=>w.CompanyID==CompanyID).ToList();

                response.Data = new
                {
                    notetypes = data
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

        [HttpGet("[action]/{RecID}")]
        public IActionResult GetNoteByRecID(string RecID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving note data by RecID from storage");
                var data = noteservice.GetNoteByRecID(RecID);

                response.Data = new
                {
                    note = data
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
        public IActionResult GetNoteDetailByID(Guid ID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving note data by ID from storage");
                var data = noteservice.GetNoteDetailByID(ID); 
                response.Data = new
                {
                    note = data
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