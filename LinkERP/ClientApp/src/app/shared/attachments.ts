import { BaseEntity } from "../models/base-entity";
import { AttachmentFiles } from "./attachmentfiles";

export class Attachments extends BaseEntity  {
   AttachmentFiles:Array<AttachmentFiles> = [];  
   RecID:any;
}
