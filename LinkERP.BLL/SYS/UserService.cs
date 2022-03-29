using LinkERP.BLL.SYS.Interfaces;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.DTO.SYS.Role.RoleCompanyAccess;
using LinkERP.DTO.SYS.User.ResetPassword;
using LinkERP.Entity.INV;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SYS
{
    public class UserService : IUserService
    {
        IUserRepository user;
        public UserService(IUserRepository _user)
        {
            user = _user;
        }

        public string AddUser(LBS_SYS_User lBS_SYS_User)
        {
            return user.AddUser(lBS_SYS_User);
        }

        public bool DeleteUserByID(string ID, string DeletedBy)
        {
            return user.DeleteUserByID(ID, DeletedBy);
        }

        public IList<LBS_SYS_User> GetUser()
        {
            return user.GetUser();
        }

        public LBS_SYS_User GetUserByID(string ID)
        {
            return user.GetUserByID(ID);
        }

        public UserDetails ResetPassword(ResetNewPassword resetNewPassword)
        {
            return user.ResetPassword(resetNewPassword);
            // throw new NotImplementedException();
        }

        public string UpdateUser(LBS_SYS_User lBS_SYS_User)
        {
            return user.UpdateUser(lBS_SYS_User);
        }
        public IList<LBS_SOP_SalesPerson> GetSalesPerson(Guid CompanyID)
        {
            return user.GetSalesPerson(CompanyID);
            // throw new NotImplementedException();
        }

        public string AddupdateSalesPerson(LBS_SOP_SalesPerson LBS_SOP_SalesPerson)
        {
            return user.AddupdateSalesPerson(LBS_SOP_SalesPerson);
        }

        public IList<SYS_RoleCompanyAccess> GeCompanyAccessByLoginID(string LoginID)
        {
            return user.GeCompanyAccessByLoginID(LoginID);
        }

       
        public IList<LBS_SYS_User> GetUserDetails(Guid CompanyID)
        {
            return user.GetUserDetails(CompanyID);
        }
        public IList<LBS_INV_Warehouse> GeWareHouseAccessByLoginID(string LoginID, Guid CompanyID)
        {
            return user.GeWareHouseAccessByLoginID(LoginID, CompanyID);
        }
       

    }
}
