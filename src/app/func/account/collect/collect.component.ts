import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SnackBar } from '../../../tool/snackbar';
import { CollectService } from './collect.service';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  providers: [CollectService]
})
export class CollectComponent implements OnInit {

  public navCollect: any = [{
    label: '方案收藏',
    link: 'solution',
    typeId: 4,
    icon: 'ps-my-collection',
  }, {
    label: '产品收藏',
    link: 'product',
    typeId: 5,
    icon: 'ps-product-collection',
  }, {
    label: '供应商收藏',
    link: 'company',
    typeId: 7,
    icon: 'ps-supplier-collection',
  }, {
    label: '专利收藏',
    link: 'patents',
    typeId: 1,
    icon: 'ps-patent-collection',
  }, {
    label: '园区收藏',
    link: 'park',
    typeId: 3,
    icon: 'ps-park-collection',
  }, {
    label: '标准收藏',
    link: 'standard',
    typeId: 2,
    icon: 'ps-standard-collection',
  }, {
    label: '政策收藏',
    link: 'policy',
    typeId: 6,
    icon: 'ps-policy-collection',
  }];

  public selectedCompanyType: number = 1;
  public currentType: string;
  public currentItem: any;

  public solutionTable: any = {
    header: {
      title: '方案收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '方案名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('solution', row);
      }
    },
    {
      label: '应用行业',
      data: 'industryCategory',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '供应商名称',
      data: 'companyName',
      class: '',
      type: 'text',
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('solution', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10,
      currentPage: 1
    }
  };

  public productTable: any = {
    header: {
      title: '产品收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '产品名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('product', row);
      }
    },
    {
      label: '供应商名称',
      data: 'company_name',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('product', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };

  public companyTable: any = {
    header : {
      title: '供应商收藏'
    },
    columnDefs: {
      show: true,
      data: [{
      label: '供应商名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: ( row: any) => {
        this.linkDetail('company', row);
      }
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('company', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10,
      currentPage: 1
    }
  };

  public patentsTable: any = {
    header: {
      title: '专利收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '专利名称',
      data: 'mingcheng',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('patents', row);
      }
    },
    {
      label: '申请日期',
      data: 'shenqingri',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '申请人',
      data: 'shenqingren',
      class: '',
      type: 'text',
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('patents', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };

  public parkTable: any = {
    header: {
      title: '园区收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '园区名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('park', row);
      }
    },
    {
      label: '级别',
      data: 'level',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '地区',
      data: 'region',
      class: '',
      type: 'text',
      click: ''
    },
    {
      label: '主导产业',
      data: 'industry',
      class: '',
      style: {
        width: '36%'
      },
      type: 'text',
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('park', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };

  public policyTable: any = {
    header: {
      title: '政策收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '标题',
      data: 'title',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('policy', row);
      }
    },
    {
      label: '时间',
      data: 'time',
      type: 'text',
      class: '',
      colStyle: {
        display: 'block',
        width: '8rem'
      },
      click: ''
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: 'collect-table-btn-icon',
        iconFont: 'proudsmart ps-my-collection',
        style: {},
        click: (row: any) => {
          this.cancelCollection('policy', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };

  public standardTable: any = {
    header: {
      title: '标准收藏',
    },
    columnDefs: {
      show: true,
      data: [{
      label: '标准名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('standard', row);
      }
    },
    {
      label: '标准编号',
      data: 'code',
      type: 'text',
      class: '',
      click: ''
    },
    {
      label: '实施时间',
      data: 'date',
      class: '',
      type: 'text',
      click: '',
      colStyle: {
        width: '8rem',
        display: 'block'
      }
    },
    {
      label: '操作',
      data: 'operation',
      type: 'iconGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        iconFont: 'proudsmart ps-my-collection',
        class: 'collect-table-btn-icon',
        style: {},
        click: (row: any) => {
          this.cancelCollection('standard', row);
        }
      }]
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 10
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: SnackBar,
    private collectService: CollectService,
    private titleService: Title,
  ) {
    const title = this.titleService.getTitle(); 
    this.titleService.setTitle('我的收藏' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);
    this.route.queryParams.subscribe((params: Params) => {
      this.currentType = params['type'] ? params['type'] : 'solution';
      this.currentItem = this.navCollect.find((item: any) => {
        return item.link === this.currentType;
      });
      this.getCollection(this.currentType, 1);
    });
  }
  public ngOnInit() {
    this.getCollection(this.currentItem.link, 1);  
  }

  public pageNumber(type: string, page: any) {
    this.getCollection(this.currentItem.link, page); 
    this[`${type}Table`].page.currentPage = page;
  }

  private getCollection(type: string, page: number) {
    this.collectService.getCollection(this.currentItem.typeId, page).subscribe((res: any) => {
      if (res.code === '2000') {
        res.data = res.data === null ? [] : res.data;
        res.data.forEach((item: any) => {
          if (type === 'solution') {
            item.companyName = item.company ? item.company['name'] : '';
          } else if (type === 'compnay') {
            item.updateType = item.updateMd5 ? item.updateMd5 : '';
          }
        });
        this[`${type}Table`].columns = res.data;
        this[`${type}Table`].page.size = res.size;
        this[`${type}Table`].page.currentPage = page;
      }
    });
  }

  private cancelCollection(type: string, row: any) {
    const md5 = row.md5 ? row.md5 : row.collect_md5;
    this.collectService.cancelCollection(md5, this.currentItem.typeId).subscribe((res: any) => {
      if (res.code === '2000') {
        const label = this.currentItem.label.match(/[^收藏$]+/)[0];
        this.snackbar.success(`此${label}取消收藏`);
        if (this[`${type}Table`].columns.length === 1) {
          this.getCollection(this.currentItem.link, 1);
        } else {
          this.getCollection(this.currentItem.link, this[`${type}Table`].page.currentPage);
        }
      }
    });
  }

  private linkDetail(type: string, row: any) {
    if (type === 'solution') {
      let md5 = row.updateMd5 ? row.updateMd5 : row.md5;
      this.router.navigate([`/${type}/detail`], { queryParams: { md5: md5, name: row.name, industry: row.industryCategory }});
    } else if (type === 'product') {
      this.router.navigate([`/${type}/detail`], { queryParams: { md5: row.collect_md5, name: row.name}});
    } else if (type === 'company') {
      this.router.navigate([`/${type}/detail`], { queryParams: { md5: row.md5, name: row.updateName, industry: row.industry }});
    } else {
      let md5 = row.collect_md5 ? row.collect_md5 : row.md5;
      this.router.navigate([`/${type}/detail`], { queryParams: { md5: md5 }});
    }
    
  }

}
