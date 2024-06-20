import { environment } from '../../../environments/environment'; 
import * as CryptoJS from 'crypto-js';

export function encryption(value: any) {
  var key = CryptoJS.enc.Utf8.parse(environment.AESencryptionKey);
  var IV = CryptoJS.enc.Utf8.parse(environment.AESencryptionIV);

  if (value == '' || value == null) {
    return null;
  }

  var encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(value.toString()),
    key,
    {
      keySize: 128 / 8,
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
}

export function decryption(value: any) {
  if (value == '' || value == null) {
    return '';
  }

  var key = CryptoJS.enc.Utf8.parse(environment.AESencryptionKey);
  var IV = CryptoJS.enc.Utf8.parse(environment.AESencryptionIV);

  var decrypted = CryptoJS.AES.decrypt(value, key, {
    keySize: 128 / 8,
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
