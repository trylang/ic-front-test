# Paginator Usage

## 1. module

```ts
import { PaginatorModule } from 'CustomPathPre/tool/paginator/paginator.module';
```

## 2. html

```html
<ark-paginator rows="10" currentPage="{{currentPage}}" totalRecords="{{totalRecords}}" (onPageChange)="paginate($event)"></ark-paginator>
```

## 3. component

```ts
  public totalRecords: number = 100;

  public paginate(paginator: any) {
    const page = paginator.page + 1;
  }
```
