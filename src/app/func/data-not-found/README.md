# Usage

## 1. example.module.ts

```ts
import { DataNotFoundModule } from '../../data-not-found';

@NgModule({
  ...
  imports: [
    DataNotFoundModule
  ]
  ...
})
```

## 2. example.component.html

```html
<!-- Data not found -->
<ark-no-data showType="search" [searchKey]="seatop.data" [hideSign]="totalRecords" bgc="#fff"></ark-no-data>
```

- showType value can be 'search', 'detail'
- searchKey: When select showType value is 'search', you need give keyword.
- hideSign: 显示隐藏暂无数据的标识，搜索页面直接选择size总数即可，详情页面直接输入boolean变量为 true 或者 false
- bgc: set background-color, value type can be #fff, white, rgb(255,255,255) ... transparent

## 暂无数据需求

- 隐藏分页
- 隐藏不必要的内容
- 搜索列表页面过滤条件需要统一一下，都是动态返回有数据的过滤条件
