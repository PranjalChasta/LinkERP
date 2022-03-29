import { ReportControlBase } from "./report-control-base";

export class TextboxControl extends ReportControlBase<string> {
    controlType = 'textbox';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
