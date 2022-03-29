import { BaseEntity } from "../models/base-entity";
import { LBS_SYS_AttachmentFiles } from "./LBS_SYS_AttachmentFiles";

export class LBS_SYS_Attachments extends BaseEntity  { 
   RecID:any;
   Description: any;
    PhysicalFileName: string;
    FileBinary:string;
    Size: string;
    FileType: any;
}
