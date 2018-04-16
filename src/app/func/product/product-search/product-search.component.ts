import { Component, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ProductService } from '../service/product.service';
import { Product, SearchParam } from '../model';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
   styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {

  private keywords: string;
  private sort: number;
  private size: string;
  private cat1: string;
  private cat2: string;
  private cats: string[];
  private catChild: string[];
  private searchTextStream: Subject<string> = new Subject<string>();
  private page: number;
  private totalRecords: number = 0;
  private currentPage: number = 1;
  private product: Product;
  private products: Product[];
  private searchParam: SearchParam;
  constructor(
    private titleService: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('产品搜索' +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.page = this.activeRoute.snapshot.params['page'];
    this.searchParam = new SearchParam();
    this.product = new Product();
  }

  public ngOnInit(): void  {
    this.getCategory();
    this.activeRoute.queryParams.subscribe((params) => {
      // 这里可以从路由里面获取URL参数
      this.sort =  params.sort || -1;
      this.searchParam.sort = this.sort;
      this.keywords = params.key || '数控机床';
      this.searchParam.key = this.keywords;
      this.page = params.page;
      this.currentPage = this.page || 1;
      this.searchParam.page = this.page;
      this.searchParam.cat1 =  params.cat1;
      this.searchParam.cat2 =  params.cat2;
      this.loadData(this.searchParam, this.page);
    });

    // 订阅了searchTextStream的Subject
    this.searchTextStream.debounceTime(1000).distinctUntilChanged().subscribe((keywords) => {
      this.router.navigate([], { queryParams: { key: keywords, page: 1 }, queryParamsHandling: 'merge'});
    });

  }

  public toggleUrl(cat1: string, cat2: string) {
    // 两者都满足，说明是点击的同一个链接，需要消除此链接
    if ( (this.searchParam.cat1 === cat1 && this.searchParam.cat2 === cat2) || this.searchParam.cat1 === '其他' ) {
      this.searchParam.cat1 = null;
      this.searchParam.cat2 = null;
    }
     else if (this.searchParam.cat1 !== '其他' && cat1 === '其他') {
      this.searchParam.cat1 = '其他';
      this.searchParam.cat2 = null;
    }
     else if (cat1 !== '其他' && !cat2) {
      this.searchParam.cat1 = this.searchParam.cat1;
      this.searchParam.cat2 = this.searchParam.cat2;
    } else {
      this.searchParam.cat1 = cat1;
      this.searchParam.cat2 = cat2;
    }
    this.searchParam.page = 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activeRoute,
      queryParams: this.searchParam
    };
    this.router.navigate([], navigationExtras);
  }


  /**
   * 分页控制
   * @param {*} paginator
   * @memberof SolutionSearchComponent
   */
  public paginate(paginator: any) {
    this.page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.activeRoute,
      queryParams: {page: this.page},
      queryParamsHandling: 'merge'
    };
    this.router.navigate([], navigationExtras);
    $(window).scrollTop(0);
  }

  /**
   * 获取产品列表数据
   * @param {Solution} solution
   * @param {number} page
   * @returns
   * @memberof SolutionSearchComponent
   */
  private loadData(searchParam: SearchParam, page: number) {
    this.productService.getProductList(searchParam, page).subscribe(
    (res) => {
      if ('2000' === res.code && res.data) {
        this.products = res['data']['resultList'];
        this.size = res['data']['size'] >= 200 ? '200+' : res['data']['size'] ;
        this.totalRecords = res['data']['size'];
      }
    });
  }


  // 搜索内容变化触发searchTextStream订阅的subject
  private searchChanged($event: any): void {
    this.searchTextStream.next(this.keywords);
  }


  /**
   * 获取行业
   * @private
   * @memberof EntEditComponent
   */
  private getCategory() {
    this.productService.getCategory().subscribe((data: any) => {
      this.cats = data.cats;
      this.catChild = data.catChild;
    });
  }

}

