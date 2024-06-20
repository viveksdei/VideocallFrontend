import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeHtmlTags'
})
export class RemoveHtmlTagsPipe implements PipeTransform {

  transform(value: string): string {
    // Remove HTML tags using a regular expression
    return value.replace(/<[^>]*>/g, '');
  }

}
