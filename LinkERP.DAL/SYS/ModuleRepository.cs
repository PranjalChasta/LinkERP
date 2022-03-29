using Dapper;
using LinkERP.DAL.SYS.Interfaces;
using LinkERP.Entity.SYS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace LinkERP.DAL.SYS
{
   public  class ModuleRepository :BaseRepository, IModuleRepository
    {
        public IList<LBS_SYS_Module> GetModules()
        {
            List<LBS_SYS_Module> lBS_SYS_Modules = new List<LBS_SYS_Module>();
            var companies = con.Query<LBS_SYS_Module>("SYS_GetAllModules",
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
        public IList<LBS_SYS_Module> GetModuleNotExistInRoleID(string ID)
        {
            List<LBS_SYS_Module> lBS_SYS_Modules = new List<LBS_SYS_Module>();

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            var companies = con.Query<LBS_SYS_Module>("SYS_GetModuleNotExistRole",
                            param: parameters,
                            commandType: CommandType.StoredProcedure).AsList();
            return companies;
        }
    }
}
