using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DAL.SHARED.Interfaces
{
    public interface IDeleteRecordsRepository
    {
        bool DeleteRecordsBYID(Guid ID, string TableName, string DeletedBy);
    }
}
