import { BaseEntity } from "../base-entity";
export class ServerRelationship extends BaseEntity {
  CompanyID: any;
  HostServer: any;
  DestinationServer: any;
  RelationshipType: any;
  Status: any;
}
