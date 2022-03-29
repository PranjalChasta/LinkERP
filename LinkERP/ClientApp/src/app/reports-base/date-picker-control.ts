import { ReportControlBase } from "./report-control-base";

export class DatePickerControl extends ReportControlBase<string> {
    controlType = 'datepicker';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
