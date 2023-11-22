import { AddressResponse } from "./address-response.model";

export class UserResponse {
    userId !: number;
    userCode !: string;
    email !: string;
    firstName !: string;
    lastName !: string;
    dateOfBirth !: string;
    gender !: number;
    phoneNumber !: string;
    userAddress !: AddressResponse;
    roleNames : string[] = [];
    status !: string;
  }