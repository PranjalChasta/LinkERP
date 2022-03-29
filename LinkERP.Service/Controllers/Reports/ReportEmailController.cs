using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using LinkERP.BLL.Reports.Interfaces;
using LinkERP.DTO.Report;
using LinkERP.Entity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkERP.Service.Controllers.Reports
{
    [Route("api/Report/[controller]")]
    [ApiController]
    public class ReportEmailController : ControllerBase
    {
        private ILogger logger;
        private IConfiguration iconfiguration;
        private readonly IHostingEnvironment hostingEnvironment;
        private IReportEmailService reportEmailService;
        public ReportEmailController(ILogger<ReportEmailController> _logger, IReportEmailService _reportEmailService, IConfiguration _iconfiguration, IHostingEnvironment _hostingEnvironment)
        {
            reportEmailService = _reportEmailService;
            logger = _logger;
            iconfiguration = _iconfiguration;
            hostingEnvironment = _hostingEnvironment;
        }

        [HttpGet("[action]")]
        public IActionResult GetUsersEMails()
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Users Email Address data");
                var data = reportEmailService.GetUsersEMails();

                response.Data = new
                {
                    usersEmailAddress = data
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
        [HttpGet("[action]/{ReportID}")]
        public IActionResult GetDocumentTemplatesByReport(Guid ReportID)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Document Template By Report ID data");
                var data = reportEmailService.GetDocumentTemplatesByReport(ReportID);

                response.Data = new
                {
                    DocumentTemplate = data
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
        public IActionResult SendReportEmail([FromBody]EmailReport emailReport)
        {
            ResponseModel response = new ResponseModel();
            try
            {
                logger.LogInformation("Retriving Reports data");
                var documentTemplate = reportEmailService.GetDocumentTemplatesByID(emailReport.DocumentTemplateID);
                string emailAddresses = "";
                if (emailReport.Emails != null || emailReport.Emails != "")
                {
                    emailAddresses = emailReport.Emails;
                }
                if (emailReport.UserEmails.Count > 0)
                {
                    if (emailAddresses != "")
                        emailAddresses += ",";
                    int count = 0;
                    foreach (string email in emailReport.UserEmails)
                    {
                        emailAddresses += email;
                        count++;
                        if (count != emailReport.UserEmails.Count)
                            emailAddresses += ",";
                    }
                }
                SendEmail(emailAddresses, emailReport.Subject, documentTemplate.TemplateData);
                //response.Data = new
                //{
                //    reportParameters = data
                //};
                response.IsSuccess = true;
                response.Message = "Email sent successfully";
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Error: " + ex.Message;
                logger.LogError($"Error: {ex.Message}");
                return Ok(response);
            }
        }

        //public void ExportToPDF(string path, List<ReportParameter> reportParams, string fileName)
        //{

        //    Warning[] warnings;
        //    string[] streamIds;
        //    string mimeType = string.Empty;
        //    string encoding = string.Empty;
        //    string extension = string.Empty;


        //    ReportParameter reportParameter = new ReportParameter() { Name = "" };


        //    // Setup the report viewer object and get the array of bytes
        //    // ReportSettings reportSettings = new ReportSettings();
        //    ReportViewer viewer = new ReportViewer();
        //    viewer.ProcessingMode = ProcessingMode.Remote;
        //    viewer.ServerReport.ReportServerUrl = new Uri("http://ascdevs2.com:8001/Reports/report/LinkERP.Reports/INV/INV_InventoryAuditReport");
        //    viewer.ServerReport.ReportPath = "/" + path;
        //    viewer.ServerReport.SetParameters(reportParams);
        //    //viewer.ServerReport.ReportServerCredentials

        //    byte[] bytes = viewer.ServerReport.Render("PDF", null, out mimeType, out encoding, out extension,
        //        out streamIds, out warnings);


        //    // Now that you have all the bytes representing the PDF report, buffer it and send it to the client.
        //    //Response.Buffer = true;
        //    //Response.Clear();
        //    //Response.ContentType = mimeType;
        //    //Response.AddHeader("content-disposition", "attachment; filename=" + fileName + "." + extension);
        //    //Response.BinaryWrite(bytes); // create the file
        //    //Response.Flush(); // send it to the client to download
        //}

        //[HttpPost("[action]")]
        //public IActionResult ExportToPDFSample()
        //{
        //    ResponseModel response = new ResponseModel();
        //    try
        //    {
        //        Warning[] warnings;
        //        string[] streamIds;
        //        string mimeType = string.Empty;
        //        string encoding = string.Empty;
        //        string extension = string.Empty;

        //        List<ReportParameter> reportParams = new List<ReportParameter>();


        //        ReportParameter paramCompanyID = new ReportParameter();
        //        paramCompanyID.Name = "CompanyID";
        //        paramCompanyID.Values.Add("F1164F06-2DEB-49B8-B249-6B239B2CBF5F");
        //        reportParams.Add(paramCompanyID);

        //        ReportParameter paramLoginID = new ReportParameter();
        //        paramLoginID.Name = "LoginID";
        //        paramLoginID.Values.Add("Admin");
        //        reportParams.Add(paramLoginID);

        //        ReportParameter paramItemFrom = new ReportParameter();
        //        paramItemFrom.Name = "ItemFrom";
        //        paramItemFrom.Values.Add("");
        //        reportParams.Add(paramItemFrom);

        //        ReportParameter paramItemTo = new ReportParameter();
        //        paramItemTo.Name = "ItemTo";
        //        paramItemTo.Values.Add("");
        //        reportParams.Add(paramItemTo);

        //        ReportParameter paramCategoryFrom = new ReportParameter();
        //        paramCategoryFrom.Name = "CategoryFrom";
        //        paramCategoryFrom.Values.Add("");
        //        reportParams.Add(paramCategoryFrom);

        //        ReportParameter paramCategoryTo = new ReportParameter();
        //        paramCategoryTo.Name = "CategoryTo";
        //        paramCategoryTo.Values.Add("");
        //        reportParams.Add(paramCategoryTo);

        //        ReportParameter paramSubCategoryFrom = new ReportParameter();
        //        paramSubCategoryFrom.Name = "SubCategoryFrom";
        //        paramSubCategoryFrom.Values.Add("");
        //        reportParams.Add(paramSubCategoryFrom);

        //        ReportParameter paramSubCategoryTo = new ReportParameter();
        //        paramSubCategoryTo.Name = "SubCategoryTo";
        //        paramSubCategoryTo.Values.Add("");
        //        reportParams.Add(paramSubCategoryTo);

        //        ReportParameter paramSupplierFrom = new ReportParameter();
        //        paramSupplierFrom.Name = "SupplierFrom";
        //        paramSupplierFrom.Values.Add("");
        //        reportParams.Add(paramSupplierFrom);

        //        ReportParameter paramSupplierTo = new ReportParameter();
        //        paramSupplierTo.Name = "SupplierTo";
        //        paramSupplierTo.Values.Add("");
        //        reportParams.Add(paramSupplierTo);

        //        // Setup the report viewer object and get the array of bytes
        //        // ReportSettings reportSettings = new ReportSettings();
        //        ReportViewer viewer = new ReportViewer();
        //        viewer.ProcessingMode = ProcessingMode.Remote;
        //        viewer.ServerReport.ReportServerUrl = new Uri("http://ascdevs2.com:8001/reportserver");
        //        viewer.ServerReport.ReportPath = "/LinkERP.Reports/INV/INV_InventoryAuditReport";
        //        viewer.ServerReport.SetParameters(reportParams);

        //        byte[] bytes = viewer.ServerReport.Render("PDF", null, out mimeType, out encoding, out extension,
        //            out streamIds, out warnings);

        //        response.IsSuccess = true;
        //        response.Message = "";
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

        public void SendEmail(string EmailAddresses, string Subject, string Template)
        {
            System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
            string email_from = iconfiguration.GetSection("Smtp").GetSection("User").Value;
            string email_to = EmailAddresses;
            string email_frmpwd = iconfiguration.GetSection("Smtp").GetSection("Pass").Value;
            MailMessage objMailMessage = new MailMessage();
            string[] emails = EmailAddresses.Split(",");
            foreach (string email in emails)
            {
                objMailMessage.To.Add(new MailAddress(email));
            }
            objMailMessage.From = new MailAddress(email_from, "Link ERP");
            objMailMessage.Subject = Subject;

            //objMailMessage.Body = template.Replace("[localhost:4200]", iconfiguration.GetSection("Smtp").GetSection("LinkERPApphost").Value).Replace("[page/id]", URL).Replace("[UserName]", userName);
            objMailMessage.Body = Template;
            objMailMessage.IsBodyHtml = true;
            objMailMessage.Priority = MailPriority.High;
            SmtpClient objSmptpClient = new SmtpClient();
            objSmptpClient.Host = iconfiguration.GetSection("Smtp").GetSection("Host").Value;
            objSmptpClient.Port = int.Parse(iconfiguration.GetSection("Smtp").GetSection("Port").Value.ToString());
            objSmptpClient.EnableSsl = bool.Parse(iconfiguration.GetSection("Smtp").GetSection("EnableSSL").Value.ToString());
            objSmptpClient.UseDefaultCredentials = false;
            objSmptpClient.Credentials = new System.Net.NetworkCredential(email_from, email_frmpwd);
            objSmptpClient.Send(objMailMessage);

        }

    }
}