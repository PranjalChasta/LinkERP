import { ReportControlBase } from "./report-control-base";

export class DropdownControl extends ReportControlBase<string> {
    controlType = 'dropdown';
    options: { key: string, value: string }[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
    }
}
