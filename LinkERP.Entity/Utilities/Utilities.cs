using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;

namespace LinkERP.Entity.Utilities
{
    public static class Utilities
    {
        public static string GetDescription<Enum>(this Enum e) where Enum : IConvertible
        {
            Type type = e.GetType();
            Array values = System.Enum.GetValues(type);
            foreach (int val in values)
            {
                if (val == e.ToInt32(CultureInfo.InvariantCulture))
                {
                    var memInfo = type.GetMember(type.GetEnumName(val));
                    var descriptionAttribute = memInfo[0]
                        .GetCustomAttributes(typeof(DescriptionAttribute), false)
                        .FirstOrDefault() as DescriptionAttribute;

                    if (descriptionAttribute != null)
                    {
                        return descriptionAttribute.Description;
                    }
                }
            }

            return null;
        }
    }
}
