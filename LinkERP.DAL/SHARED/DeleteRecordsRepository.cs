using Dapper;
using LinkERP.DAL.SHARED.Interfaces;
using LinkERP.Entity.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LinkERP.DAL.SHARED
{
    public class DeleteRecordsRepository : BaseRepository, IDeleteRecordsRepository
    {
        public bool DeleteRecordsBYID(Guid ID, string TableName, string DeletedBy)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@ID", ID);
            parameters.Add("@DeletedBy", DeletedBy);
            parameters.Add("@TableName", TableName);
            SqlMapper.Query(con, "DeleteRecordsByID",
                            param: parameters,
                            commandType: CommandType.StoredProcedure);

            return true;
        }
    }
}
