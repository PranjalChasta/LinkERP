import { BaseEntity } from "../base-entity"
import { LbsSysUser } from './lbs-sys-user';
import { LbsSysRole } from './lbs-sys-role';
export class LBS_SYS_UserRoles extends BaseEntity { 
    LoginID: any;
    RoleId: any;
    LBS_SYS_User: LbsSysUser;
    LBS_SYS_Role: LbsSysRole;
}