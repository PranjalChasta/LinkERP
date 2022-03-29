import { ReportControlBase } from "./report-control-base";
export class DropdownSearchControl extends ReportControlBase<string> {
    controlType = 'dropdownsearch';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }

}
