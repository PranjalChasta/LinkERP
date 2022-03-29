import { BaseEntity } from "../base-entity";
import { LbsSysMenu } from "./lbs-sys-menu";
import { LbsSysRole } from "./lbs-sys-role";

export class LbsSysRoleMenuAccess extends BaseEntity {
    RoleID: any;
    MenuID: any;
    ReadAccess: any;
    WriteAccess: any;
    DeleteAccess: any;
    AllAccess: any;
    NoAccess: any;
    LBS_SYS_Menu: any = new LbsSysMenu();
    LBS_SYS_Role: any = new LbsSysRole();
}
