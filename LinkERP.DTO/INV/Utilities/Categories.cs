using System;
using System.Collections.Generic;
using System.Text;

namespace LinkERP.DTO.INV.Utilities
{
    public class Categories
    {
        string _CategoryCode, _CategoryName;
        public string CategoryCode
        {
            get { return _CategoryCode; }
            set
            {
                if (value.Length >= 1 && value.Length <= 50)
                {
                    _CategoryCode = value.Trim();
                }
                else
                {
                    throw new Exception("Category code should not null (or) size 1 to 50");
                }
            }
        }

        public string CategoryName { get; set; }
    }
}
