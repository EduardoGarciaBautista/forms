import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[]): any[] {
    console.log('filter');
    if (!list) {
      return [];
    }
    return list.filter((ctrl) => ctrl.show);
  }

}
