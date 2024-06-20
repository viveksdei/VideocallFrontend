//import { NotificationsModel } from "../../../../shared/models";

export interface LoginUser {
  access_token: string;
  appConfigurations?: Array<any>;
  data: any;
  expires_in: number;
  firstTimeLogin: boolean;
  passwordExpiryStatus?: any;
  statusCode: number;
  userLocations?: Array<any>;
  userPermission?: any;
  patientData?: any;
  RoleName:string;
}

