import { ReportControlBase } from "./report-control-base";

export class HiddenTextControl  extends ReportControlBase<string> {
    controlType = 'hiddentext';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}

