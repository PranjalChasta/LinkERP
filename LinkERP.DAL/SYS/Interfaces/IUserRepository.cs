using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.DTO.SYS.User.ResetPassword;
using LinkERP.DTO.SYS.UserProfile;
using LinkERP.Entity.INV;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SYS.Interfaces
{
   public interface IUserRepository
    {
        string AddUser(LBS_SYS_User lBS_SYS_User);
        string UpdateUser(LBS_SYS_User lBS_SYS_User);
        IList<LBS_SYS_User> GetUser();
        LBS_SYS_User GetUserByID(string ID);
        bool DeleteUserByID(string ID, string DeletedBy);
        UserDetails ResetPassword(ResetNewPassword resetNewPassword);
        IList<LBS_SOP_SalesPerson> GetSalesPerson(Guid CompanyID);
        string AddupdateSalesPerson(LBS_SOP_SalesPerson LBS_SOP_SalesPerson);
        IList<SYS_RoleCompanyAccess> GeCompanyAccessByLoginID(string LoginID);
        IList<LBS_SYS_User> GetUserDetails(Guid CompanyID);
        IList<LBS_INV_Warehouse> GeWareHouseAccessByLoginID(string LoginID, Guid CompanyID);
    }
}
