import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../service/product.service';
import { Product, Morelike} from '../model';
import { SolutionList } from '../../solution/model/solution-list-model';
import * as _ from 'lodash';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {

  public morelike: Morelike;
  public products: Product[];
  public product: Product;
  public solutions: SolutionList[];
  public selItem: number = 0;

  constructor(
    private location: Location,
    private titleService: Title,
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.product = new Product();
  }

  public ngOnInit() {
    this.activeRoute.queryParams.subscribe(
      (params: Params) => {
        this.getProductDetail(params['md5']);
        this.getSolutionByProductId(params['md5']);
        this.morelike = new Morelike(params['md5'].trim(), [params['name'].trim()]);
        this.loadData(this.morelike);
      }
    );
  }

  public ngAfterViewInit() {
    window.scroll(0, 0);
  }

  // 返回上一级
  public goBack() {
    this.location.back();
  }

  private onItemClick(type: number) {
    this.selItem = type;
  }

  public redirectToThis(md5: string, name: string) {
    this.selItem = 0; // 默认都是产品详情
    this.router.navigate([], {
      queryParams: {
       md5,
       name
      }
    });
  }

  /**
   * 获取产品详情
   * @param md5
   */
  private getProductDetail(md5: string) {
    this.productService.getProductDetail(md5).subscribe((res: any) => {
      if ('2000' === res.code) {
        this.product = res.data;

        const title = this.titleService.getTitle();
        this.titleService.setTitle(this.product.name + '_产品详情' +  title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
      }
    });
  }

  /**
   * 获取相关方案
   * @param md5
   */
  private getSolutionByProductId(md5: string) {
    this.productService.getSolutionByProductId(md5).subscribe((res: any) => {
        if ('2000' === res.code) {
          this.solutions =  res.data.length === 0 ? null : res.data;
        }
    });
  }

  /**
   * 获取类似产品
   * @param morelike
   */
  private loadData(morelike: Morelike) {
    this.productService.gettProductLikeList(morelike).subscribe(
    (res) => {
      this.products = res['data']['resultList'];
    });
  }
}
