import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeTime'
})
export class ChangeTimePipe implements PipeTransform {

  transform(value: string): string {
    // Parse the input time in the format "hh:mm a"
    const inputTimeParts = value.split(':');
    const hours = parseInt(inputTimeParts[0], 10);
    const minutes = parseInt(inputTimeParts[1].split(' ')[0], 10);
    const period = inputTimeParts[1].split(' ')[1];

    // Convert to 24-hour format for easy manipulation
    let hours24 = hours % 12;
    hours24 = period === 'PM' ? hours24 + 12 : hours24;

    // Calculate the new time
    const newHours = hours24 + Math.floor((minutes + 30) / 60);
    const newMinutes = (minutes + 30) % 60;

    // Format the updated time as a string in 12-hour format with AM/PM
    const updatedHours12 = newHours % 12 === 0 ? 12 : newHours % 12;
    const updatedPeriod = newHours < 12 ? 'AM' : 'PM';
    const updatedTimeString = `${updatedHours12.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${updatedPeriod}`;

    return updatedTimeString;
  }

}
