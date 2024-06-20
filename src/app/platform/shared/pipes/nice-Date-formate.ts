import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'niceDateFormat'
})
export class NiceDateFormatPipe implements PipeTransform {
  transform(value : any) {

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

       if (value.getFullYear() == today.getFullYear() && value.getMonth() == today.getMonth() && value.getDate() == today.getDate())
       return "Today";
     else if (value.getFullYear() == yesterday.getFullYear() && value.getMonth() == yesterday.getMonth() && value.getDate() == yesterday.getDate())
       return "Yesterday";
    else{
      return (new DatePipe("en-US")).transform(value, 'dd/MM/yyyy');
    }
 }
}