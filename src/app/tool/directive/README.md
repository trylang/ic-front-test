# usage

```html
<div class="col-sm-12 margin-bottom-10 filter-item">
  <div class="col-sm-2 ark-padding">地区</div>
  <div class="col-sm-10 search-element">
    <ul>
      <li>
        <a [ngClass]="{'active' : province === 'all'}" routerLinkActive="active" [routerLink]="['/park/list']" [queryParams]="{province: 'all'}" queryParamsHandling="merge">全部</a>
      </li>
      <li *ngFor="let item of regions">
        <a routerLinkActive="active" [routerLink]="['/park/list']" [queryParams]="{province: item}" queryParamsHandling="merge" [innerHtml]="item"></a>
      </li>
    </ul>
  </div>

  <!-- Add this -->
  <div class="pull-right ark-btn-more" moreBtn></div>

  <!-- OR -->

  <!-- 如果列表是动态改变的，需要添加下面的属性，并把列表返回值赋值进去 -->
  <div class="pull-right ark-btn-more" [dataListenter]="regions"  moreBtn></div>
</div>
```

```scrollTo简单使用

<div scrollTo>Hello</div>

<!-- OR -->
<div scrollTo="10">Hello</div>

```