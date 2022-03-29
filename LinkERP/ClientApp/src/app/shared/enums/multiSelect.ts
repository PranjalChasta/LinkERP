import { IMultiSelect } from './IMultiSelect';

export class MultiSelect<T> implements IMultiSelect<T> {
  items: Array<T> = new Array<T>();
  isAllSelected = false;
  selectedbookingTypes: any;
  selectedbedTypes: any;
  selectedextrabedTypes: any;

  constructor(items?: Array<T>, isAllSelected?: boolean) {
    this.items = items ? items : [];
    this.isAllSelected = isAllSelected !== undefined ? isAllSelected : true;
  }

  clone() {
   // const _: UnderlyingSource = require('underscore');
    const copy="" ;
   /*  = angular.copy(this);
    copy.items = _.extend(new Array(), angular.copy(this.items)); */
    return copy;
  }
}
