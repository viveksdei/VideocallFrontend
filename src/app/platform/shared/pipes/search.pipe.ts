import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(list: any[], searchText: string): any[] {
    if (!list) { return []; }
    if (!searchText) { return list; }

    searchText = searchText.toLowerCase();
    return list.filter( item => {
          return item.subCategoryName.toLowerCase().includes(searchText);
        });
      }

}
