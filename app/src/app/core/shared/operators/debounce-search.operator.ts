// src/app/core/shared/operators/debounce-search.operator.ts
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

export function debounceSearch<T>(time: number = 300) {
  return (source: Observable<T>) =>
    source.pipe(
      debounceTime(time),
      distinctUntilChanged(),
      filter((term: any) => !term || term.length >= 2)
    );
}
