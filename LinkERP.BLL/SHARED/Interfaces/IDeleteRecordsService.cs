using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.BLL.SHARED.Interfaces
{
    public interface IDeleteRecordsService
    {
        bool DeleteRecordsBYID(Guid ID, string TableName, string DeletedBy);
    }
}
