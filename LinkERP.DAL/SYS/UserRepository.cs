using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.DTO.SYS.User.ResetPassword;
using LinkERP.DTO.SYS.UserProfile;
using LinkERP.Entity.INV;
using LinkERP.Entity.SYS;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
    public class UserRepository : BaseRepository, IUserRepository
    {

        public IList<LBS_SYS_User> GetUser()
        {
            List<LBS_SYS_User> lBS_SYS_Users = new List<LBS_SYS_User>();
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Action", ActionsForSP.SelectAll.GetDescription());
            var users = con.Query<LBS_SYS_User>("SYS_UsersManagement", param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return users;
        }
        public LBS_SYS_User GetUserByID(string ID)  
        {


            List<LBS_SYS_User> lBS_SYS_Users = new List<LBS_SYS_User>();

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", ID);
            parameters.Add("@Action", ActionsForSP.SelectBYID.GetDescription());
            var users = con.Query<LBS_SYS_User>("SYS_UsersManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).FirstOrDefault();
            if (users.LoginAvatorbyte != null && users.LoginAvatorbyte.Length > 0)
            {
                users.LoginAvator = Convert.ToBase64String(users.LoginAvatorbyte);
            }

            //byte[] bytes = Encoding.UTF8.GetBytes("user");
            //string foo = Encoding.ASCII.GetString(bytes);
            return users;
        }

        public string AddUser(LBS_SYS_User lBS_SYS_User)
        {
            byte[] images = null;
            if (!string.IsNullOrEmpty(lBS_SYS_User.LoginAvator))
            {
                string[] imgsplt = lBS_SYS_User.LoginAvator.Split(",");
                images = Convert.FromBase64String(imgsplt[1]);
            }
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@LoginID", lBS_SYS_User.LoginID);
            parameters.Add("@LoginName", lBS_SYS_User.LoginName);
            parameters.Add("@Password", lBS_SYS_User.Password);
            parameters.Add("@AuthenticationMode", lBS_SYS_User.AuthenticationMode);
            parameters.Add("@WindowsUserName", lBS_SYS_User.WindowsUserName);
            parameters.Add("@DefaultCompanyID", lBS_SYS_User.DefaultCompanyID);
            parameters.Add("@DefaultWarehouseID", lBS_SYS_User.DefaultWarehouseID);
            parameters.Add("@DefaultTerminalID", lBS_SYS_User.DefaultTerminalID);
            parameters.Add("@DiscountPercentValue", lBS_SYS_User.DiscountPercentValue);
            parameters.Add("@Discount", lBS_SYS_User.Discount);
            parameters.Add("@LogOnStatus", lBS_SYS_User.LogOnStatus);
            if (images != null)
                parameters.Add("@LoginAvator", images);
            parameters.Add("@EmailAddress", lBS_SYS_User.EmailAddress);
            parameters.Add("@PhoneNumber", lBS_SYS_User.PhoneNumber);
            parameters.Add("@MobileNumber", lBS_SYS_User.MobileNumber);
            parameters.Add("@TaxNumber", lBS_SYS_User.TaxNumber);

            parameters.Add("@LeaveApprovalWorkFlow", lBS_SYS_User.LeaveApprovalWorkFlow);
            parameters.Add("@TimeApprovalWorkFlow", lBS_SYS_User.TimeApprovalWorkFlow);
            parameters.Add("@PerformanceAppraisalWorkFlow", lBS_SYS_User.PerformanceAppraisalWorkFlow);
            parameters.Add("@PurchaseApprovalWorkFlow", lBS_SYS_User.PurchaseApprovalWorkFlow);
            parameters.Add("@PurchaseRequestApprovalWorkFlow", lBS_SYS_User.PurchaseRequestApprovalWorkFlow);
            parameters.Add("@TrainingApprovalWorkFlow", lBS_SYS_User.TrainingApprovalWorkFlow);
            parameters.Add("@CreatedBY", lBS_SYS_User.CreatedBY);
            parameters.Add("@TaxNumber", lBS_SYS_User.TaxNumber);
            parameters.Add("@flag", "ADD");
            parameters.Add("@Action", ActionsForSP.Add.GetDescription());
            parameters.Add("@UserID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_UsersManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@UserID");
            return id;
        }
        public string UpdateUser(LBS_SYS_User lBS_SYS_User)
        {
            byte[] images = null;
            DynamicParameters parameters = new DynamicParameters();
            if (!string.IsNullOrEmpty(lBS_SYS_User.LoginAvator))
            {
                string[] imgsplt = lBS_SYS_User.LoginAvator.Split(",");
                images = Convert.FromBase64String(imgsplt[1]);
            }
            parameters.Add("@LoginId", lBS_SYS_User.LoginID);
            parameters.Add("@LoginName", lBS_SYS_User.LoginName);
            parameters.Add("@Password", lBS_SYS_User.Password);
            parameters.Add("@AuthenticationMode", lBS_SYS_User.AuthenticationMode);
            parameters.Add("@WindowsUserName", lBS_SYS_User.WindowsUserName);
            parameters.Add("@DefaultCompanyID", lBS_SYS_User.DefaultCompanyID);
            parameters.Add("@DefaultWarehouseID", lBS_SYS_User.DefaultWarehouseID);
            parameters.Add("@DefaultTerminalID", lBS_SYS_User.DefaultTerminalID);
            parameters.Add("@DiscountPercentValue", lBS_SYS_User.DiscountPercentValue);
            parameters.Add("@Discount", lBS_SYS_User.Discount);
            parameters.Add("@LogOnStatus", lBS_SYS_User.LogOnStatus);
            if (images != null)
                parameters.Add("@LoginAvator", images);
            parameters.Add("@EmailAddress", lBS_SYS_User.EmailAddress);
            parameters.Add("@PhoneNumber", lBS_SYS_User.PhoneNumber);
            parameters.Add("@MobileNumber", lBS_SYS_User.MobileNumber);
            parameters.Add("@TaxNumber", lBS_SYS_User.TaxNumber);
            parameters.Add("@ForcePasswordChange", lBS_SYS_User.ForcePasswordChange);
            parameters.Add("@LeaveApprovalWorkFlow", lBS_SYS_User.LeaveApprovalWorkFlow);
            parameters.Add("@TimeApprovalWorkFlow", lBS_SYS_User.TimeApprovalWorkFlow);
            parameters.Add("@PerformanceAppraisalWorkFlow", lBS_SYS_User.PerformanceAppraisalWorkFlow);
            parameters.Add("@PurchaseApprovalWorkFlow", lBS_SYS_User.PurchaseApprovalWorkFlow);
            parameters.Add("@PurchaseRequestApprovalWorkFlow", lBS_SYS_User.PurchaseRequestApprovalWorkFlow);
            parameters.Add("@TrainingApprovalWorkFlow", lBS_SYS_User.TrainingApprovalWorkFlow);
            parameters.Add("@flag", "Edit");
            parameters.Add("@Action", ActionsForSP.Edit.GetDescription());

            parameters.Add("@UserID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_UsersManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@UserID");
            return id;
        }
        public bool DeleteUserByID(string ID, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@LoginID", ID);
            parameters.Add("@DeletedBy", DeletedBy);

            SqlMapper.Query(con, "SYS_DeleteUsersByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }

        public UserDetails ResetPassword(ResetNewPassword resetNewPassword)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@LoginID", resetNewPassword.LoginID);

            parameters.Add("@Password", resetNewPassword.Password);

            var response = con.Query<UserDetails>("SYS_ResetPassword",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).FirstOrDefault();

            return response;
        }
        //public void UpdateUserProfile(User lBS_SYS_User)
        //{
        //    byte[] images = null;
        //    if (!string.IsNullOrEmpty(lBS_SYS_User.LoginAvator.ToString()))
        //    {
        //        string[] imgsplt = lBS_SYS_User.LoginAvator.ToString().Split(",");
        //        images = Convert.FromBase64String(imgsplt[1]);
        //    }
        //    DynamicParameters parameters = new DynamicParameters();
        //    parameters.Add("@LoginID", lBS_SYS_User.LoginID);
        //    parameters.Add("@LoginName", lBS_SYS_User.LoginName);
        //    if (images != null)
        //        parameters.Add("@LoginAvator", images);
        //    parameters.Add("@EmailAddress", lBS_SYS_User.EmailAddress);
        //    parameters.Add("@PhoneNumber", lBS_SYS_User.PhoneNumber);
        //    parameters.Add("@MobileNumber", lBS_SYS_User.MobileNumber);
        //    parameters.Add("@TaxNumber", lBS_SYS_User.TaxNumber);

        //    parameters.Add("@flag", "UpdateUserProfile");
        //    parameters.Add("@Action", ActionsForSP.Add.GetDescription());
        //    parameters.Add("@UserID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

        //    SqlMapper.Query(con, "SYS_UsersManagement",
        //                    param: parameters,
        //                    commandType: CommandType.StoredProcedure);
        //}
        public IList<LBS_SOP_SalesPerson> GetSalesPerson(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CompanyID", CompanyID);

            parameters.Add("@Action", "GetAll");

            var response = con.Query<LBS_SOP_SalesPerson>("SYS_SalesPersonManagement",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).ToList();

            return response;
        }
        public string AddupdateSalesPerson(LBS_SOP_SalesPerson LBS_SOP_SalesPerson)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", LBS_SOP_SalesPerson.ID);
            parameters.Add("@CompanyID", LBS_SOP_SalesPerson.CompanyID);
            parameters.Add("@WarehouseID", LBS_SOP_SalesPerson.WarehouseID);
            parameters.Add("@SalesPersonName", LBS_SOP_SalesPerson.SalesPersonName);
            parameters.Add("@CreatedBY", LBS_SOP_SalesPerson.CreatedBY);

            parameters.Add("@Action", "Add");
            parameters.Add("@SalesPersonID", dbType: DbType.String, size: 50, direction: ParameterDirection.Output);

            SqlMapper.Query(con, "SYS_SalesPersonManagement",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);
            var id = parameters.Get<string>("@SalesPersonID");
            return id;
        }

        public IList<SYS_RoleCompanyAccess> GeCompanyAccessByLoginID(string LoginID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@LoginID", LoginID);

            parameters.Add("@Action", "GetCompanyByRole");

            var response = con.Query<SYS_RoleCompanyAccess>("SYS_UsersManagement",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).ToList();

            return response;
        }
        
        public IList<LBS_SYS_User> GetUserDetails(Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@CompanyID", CompanyID);

            var response = con.Query<LBS_SYS_User>("Sp_GetUserDetailsForInventory",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).ToList();

            return response;
        }

        public IList<LBS_INV_Warehouse> GeWareHouseAccessByLoginID(string LoginID, Guid CompanyID)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@LoginID", LoginID);
            parameters.Add("@DefaultCompanyID", CompanyID);

            parameters.Add("@Action", "GetWareHouseRole");

            var response = con.Query<LBS_INV_Warehouse>("SYS_UsersManagement",
                              param: parameters,
                              commandType: CommandType.StoredProcedure).ToList();

            return response;
        }
       
    }
  
   
}
