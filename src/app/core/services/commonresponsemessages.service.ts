import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonresponsemessagesService {

  constructor() { }
  public LoginSuccess = "Login successfully!";
  public InsertSuccess = "Record saved successfully!"
  public Deleterecord = "Data deleted successfully!"
  public errormessage = "error occurred!, Please try after some time. "
  public PasswordChangedSuccessMessage = "Password Changed successsfully!";
  public LoginFailed = "Incorrect Username or Password! Please Try again";
  public IncorrectPassword = "Incorrect Password !";
  public IncorrectEmail = "Incorrect Email ";
  public passwordAndConfirmPasswordNotMatched = "Password Not Matched ";
  public UserNotFound = "User Not Found "
  public OtpSentSuccessfully = "Otp Sent Successfully "
  public InvalidOtp = "Otp Invalid"
  
}
