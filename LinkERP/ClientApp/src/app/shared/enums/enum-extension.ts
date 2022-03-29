import { MultiSelect } from './multiSelect';
import { IMultiSelect } from './iMultiSelect';

export interface INameValue {
    name: string;
    value: number;
}
export interface INameValueStr {
    name: string;
    value: string; 
}
export interface ISelectedNameValue extends INameValue {
    selected: boolean;
}

export class EnumExtension {
    // Returns names from enum type    
    static getNames(e: any): string[] {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    // Gets number values of enum type
    static getValues(e: any): number[] {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    // Gets array of pairs containing name and value from enum type
    static getNamesAndValues(e: any): INameValue[] {
        const enumValues = EnumExtension.getValues(e).map(v => ({ name: <string>e[v], value: v }));
        return enumValues;
    }
    static getValuestring(e: any): string[] {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

 static getNamesAndValuestring(e: any): INameValueStr[] {
        const enumValues = EnumExtension.getValuestring(e).map(v => ({ name: <string>e[v], value: <string>v }));
        return enumValues;
    }
    // Returns array of enums with selected attribute
    static getSelectedNameAndValuesFromMultiSelect(e: any, values?: IMultiSelect<any>): ISelectedNameValue[] {
        if (values == null) {
            values = new MultiSelect<any>();
        }

        const isAllSelected = values.isAllSelected;
        let enumValues;

        if (isAllSelected) {
            enumValues = EnumExtension.getValues(e)
                .map(v => ({ name: <string>e[v], value: v, selected: true }));
            enumValues.unshift((<ISelectedNameValue>{ name: 'All', value: -1, selected: true }));
        } else {
            enumValues = EnumExtension.getValues(e)
                .map(v => ({ name: <string>e[v], value: v, selected: values.items && values.items.indexOf(v) !== -1 }));
            enumValues.unshift((<ISelectedNameValue>{ name: 'All', value: -1, selected: false }));
        }

        return enumValues;
    }

    // Returns selected enum values from the list
    static getValuesFromSelectedList(values: ISelectedNameValue[]): number[] {
        return values.map(v => v.value);
    }
}
