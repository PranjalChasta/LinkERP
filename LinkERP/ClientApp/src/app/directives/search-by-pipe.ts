import { Pipe, PipeTransform } from "@angular/core";
@Pipe( {
name: 'SearchByPipe'
} )
export class SearchByPipe implements PipeTransform {
transform( array: Array<any>, orderField: string, orderType: boolean ): Array<string> {
    array = array.filter(item =>  item['productMatrixRow'] === orderField) 
    return array;
  }
}

 
@Pipe( {
name: 'SearchByuom'
} )
export class SearchByuom implements PipeTransform {
transform( array: Array<any>, orderField: string, orderType: boolean ): Array<string> {
    array = array.filter(item =>  item['productMatrixRow'] === orderField) 
    return array;
  }
}
