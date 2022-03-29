using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LinkERP.Entity.Utilities
{
    public enum ActionsForSP
    {
        [Description("SelectAll")]  //SelectAll parameter for selecting all records in table
        SelectAll,
        [Description("SelectBYID")]   //SelectBYID parameter for selecting one record in table filter by id
        SelectBYID,
        [Description("Add")]   //Add parameter for inserting records in table
        Add,
        [Description("Edit")]   //Edit parameter for editing records in table
        Edit,
        [Description("Delete")]   //Delete parameter for deleteing records in table
        Delete,
        [Description("SelectBYRecID")]   //SelectBYRecID parameter for selecting one record in table filter by recid
        SelectBYRecID,
        [Description("Out")]   //Out parameter for selecting records from Inv_Stock AllocationDetail Table
        Out,
        [Description("SelectForDrpdwn")]   //SelectForDrpdwn parameter for selecting  active records in table 
        SelectForDrpwn,
        [Description("SelectForWarehouse")]   //Warehouse parameter for selecting  active records in table 
        SelectForWarehouse,
        [Description("AddMedication")]   //Add Parameter for Inserting Medication in table 
        AddMedication,
        [Description("SelectBYIDs")]    //SelectBYIDs parameter for selecting one record in table filter by Ids
        SelectBYIDs,
        [Description("FetchProductDetails")]
        FetchProductDetails,
        [Description("GetMixtureDetailsByID")]
        GetMixtureDetailsByID,
        [Description("SelectBYTableID")]
        SelectBYTableID
    }


}
