using LinkERP.BLL.SHARED.Interfaces;
using LinkERP.DAL.SHARED.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED
{
    public class DeleteRecordsService: IDeleteRecordsService
    {
        IDeleteRecordsRepository deleteRecords;

        public DeleteRecordsService(IDeleteRecordsRepository _deleteRecords)
        {
            deleteRecords = _deleteRecords;
        }
        public bool DeleteRecordsBYID(Guid ID, string TableName, string DeletedBy)
        {
            return deleteRecords.DeleteRecordsBYID(ID,TableName, DeletedBy);
        }
    }
}
