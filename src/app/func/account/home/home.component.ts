import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, Params } from '@angular/router';
import { Account } from '../../../account.model';
import { Title } from '@angular/platform-browser';

import { SnackBar } from '../../../tool/snackbar';
import { HomeService } from './home.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public selectedCompanyType: number = 1;

  // 导航右侧内容去park-table配置封装
  public solutionTable: any = {
    header: {
      title: '最新方案'
    },
    columnDefs: {
      show: false,
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
        label: '时间',
        data: 'updateTime',
        type: 'date',
        class: '',
        colStyle: {
          width: '8rem',
          display: 'block'
        },
        click: ''
      }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 5
    }
  };

  public parkNewsTable: any = {
    header: {
      title: '我的舆情'
    },
    columnDefs: {
      show: false,
      data: [{
      label: '舆情标题',
      data: 'title',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        window.open(row.url);
      }
      },
      {
        label: '时间',
        data: 'publishTime',
        type: 'date',
        class: '',
        colStyle: {
          width: '8rem',
          display: 'block'
        },
        click: ''
      }]
    },
    columns: [],
    page: {
      show: true,
      size: 10,
      rows: 5
    }
  };

  public policyTable: any = {
    header: {
      title: '最新政策'
    },
    columnDefs: {
      show: false,
      data: [{
      label: '政策名称',
      data: 'title',
      class: '',
      style: {
        'width': '90%',
        'padding-right': '2rem',
        'line-height': '2rem'
      },
      type: 'link',
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
          width: '8rem',
          display: 'block'
        },
        click: ''
      }]
    },
    columns: [],
    page: {
      show: true,
      size: 0,
      rows: 5
    }
  };

  public parkTable: any = {
    header: {
      title: '园区订阅'
    },
    columnDefs: {
      show: false,
      data: [{
      label: '园区名称',
      data: 'name',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.router.navigate([`/account/home/news`], { queryParams : { md5 : row.md5 ? row.md5 : row.collect_md5, name: row.name }});
        }
      },
      {
        label: '时间',
        data: 'company_name',
        type: 'text',
        class: '',
        colStyle: {
          width: '8rem',
          display: 'block'
        },
        click: ''
      }]
    },
    columns: [],
    page: {
      show: false
    }
  };

  public companyTable: any = {
    header: {
      title: '企业订阅'
    },
    columnDefs: {
      show: false,
      data: [{
      label: '企业名称',
      data: 'companyName',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.linkDetail('analysis', row);
      }
      },
      {
        label: '分组',
        data: 'groups',
        type: 'text',
        class: '',
        colStyle: {
          width: '8rem',
          display: 'block'
        },
        click: ''
      }]
    },
    columns: [],
    page: {
      show: false
    }
  };

  public vendorTable: any = {
    header: {
      title: '供应商动态',
      options: [{
        label: '',
        type: 'select', //如果需要筛选过滤，加上此type即可
        class: '',
        data: 1,
        filterFormat: {
          label: 'text',
          value: 'type'
        },
        options: [{
          text: '方案',
          type: 1
        }, {
          text: '产品',
          type: 3
        }, {
          text: '案例',
          type: 2
        }]
      }],
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
      colClick: (row: any) => {
        this.linkDetail('company', row);
      }
      },
      {
      label: '更新内容',
      data: 'updateName',
      type: 'link',
      class: '',
      click: '',
      colClass: 'collect-table-title-link',
      colClick: (row: any) => {
        this.homeService.getSolutionIndustry(row.updateMd5).subscribe((res: any) => {
          if (res.code === '2000') {
            row.md5 = row.updateMd5;
            row.industry = res.data ? res.data : '';
            this.linkDetail('solution', row);
          }
        });
      }
    },
    {
      label: '内容类型',
      data: 'updateType',
      class: '',
      type: 'text'
    },
    {
      label: '更新时间',
      data: 'updateTime',
      class: '',
      type: 'date'
    }]
    },
    columns: [],
    page: {
      show: true,
      size: 10,
      rows: 5,
      currentPage: 1
    }
  };


  private account: Account;
  private showType: Params;
  private subTitle: string;
  private subUrl: string;
  private allparkNewsList: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackBar,
    private homeService: HomeService,
    private titleService: Title
  ) {
    const title = this.titleService.getTitle();
    this.titleService.setTitle('我的主页' + title.match(/(\s+-\s+[\u4e00-\u9fa5]+)$/)[0]);

    this.account = localStorage.getItem('account') ? JSON.parse(localStorage.getItem('account')) : null;
    const tab = {
      solution: {
        label: '',
        url: 'javascript:void(0)'
      },
      parkNews: {
        label: '',
        url: 'javascript:void(0)'
      },
      policy: {
        label: '试运营',
        url: 'javascript:void(0)'
      },
      park: {
        label: '试运营',
        url: 'javascript:void(0)'
      },
      company: {
        label: '试运营',
        url: 'javascript:void(0)'
      },
      vendor: {
        label: '',
        url: 'javascript:void(0)'
      },
    };
    this.route.queryParams.subscribe((params: Params) => {
      const type = (this.account.type === 1 || this.account.type === 3) ? 'solution' : 'parkNews';
      this.showType = params['type'] ? params['type'] : type;
      this.subTitle = params['type'] ? tab[params['type']]['label'] : '';
      this.subUrl = params['type'] ? tab[params['type']]['url'] : '';
    });

  }
  public ngOnInit() {
    this.getLatestPolicy(1);
    this.getCollection(1, this.selectedCompanyType);
    this.getCompanySub(1);
    if (this.account.type === 1 || this.account.type === 3) {
      this.getLatestSolution(1);
    }
    if (this.account.type !== 3) {
      this.getParkSub(1);
    }
    if (this.account.type === 4) {
      this.getParkNews(1);
    }
  }

  // 最新方案分页
  public pageSolutionNumber(page: any) {
    this.getLatestSolution(page);
  }

  // 最新政策分页
  public pagePolicyNumber(page: any) {
    this.getLatestPolicy(page);
  }

  // 园区舆情分页与供应商的假分页
  public pageNameNumber(name: string, page: any) {
    if (page === 1) {
      this[`${name}Table`].columns = this[`all${name}List`].slice(0, 5);
    } else if (page === 2) {
      this[`${name}Table`].columns = this[`all${name}List`].slice(5, 10);
    }
  }

  // 供应商分页
  public pageVendorNumber(page: any) {

    this.getCollection(page, this.selectedCompanyType);
    this.vendorTable.page.currentPage = page;
  }

  // 获取最新方案
  private getLatestSolution(page: number) {
    this.homeService.getLatestSolution(page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.solutionTable.columns = res.data ? res.data : [];
        this.solutionTable.page.size = res.size;
      }
    });
  }

  // 获取最新政策
  private getLatestPolicy(page: number) {
    this.homeService.getLatestPolicy(page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.policyTable.columns = res.data ? res.data : [];
        this.policyTable.page.size = res.size;
      }
    });
  }

  // 获取园区订阅
  private getParkSub(page: number) {
    this.homeService.getParkSub(page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.parkTable.columns = res.data ? res.data : [];
      }
    });
  }

  // 根据MD5获取园区舆情
  private getParkNewsList(md5: string, page: number) {
    this.homeService.getParkNewsList(md5, page).subscribe((res: any) => {
      if (res.code === '2000') {
        const parkNewsList = res.data ? res.data : [];
        this.allparkNewsList = parkNewsList;
        this.parkNewsTable.columns = parkNewsList && parkNewsList.length > 0 ? parkNewsList.slice(0, 5) : [];
        this.parkNewsTable.page.size = res.size < 11 ? res.size : 10;
      }
    });
  }

  // 获取园区用户我的舆情
  private getParkNews(page: number) {
    this.homeService.getRelatedEntityForCurrentUser().subscribe((res: any) => {
      if (res.code === '2000') {
        this.getParkNewsList(res.data.md5, page);
      }
    });
  }

  // 获取企业订阅
  private getCompanySub(page: number) {
    this.homeService.getCompanySub(page).subscribe((res: any) => {
      if (res.code === '2000') {
        this.companyTable.columns = res.data ? res.data : [];
      }
    });
  }

  // 获取供应商动态
  private getCollection(page: number, type?: number) {
    this.homeService.getSupplierDynamics(page, type).subscribe((res: any) => {
      if (res.code === '2000') {
        const vendorList = res.data ? res.data : [];
        if (vendorList.length > 0) {
          vendorList.forEach((item: any) => {
            if ( !item.updateMd5 ) {
              item.updateType = '';
            }
          });
        }
        this.vendorTable.columns = vendorList;
        this.vendorTable.page.size = res.size;
        this.vendorTable.page.currentPage = page;
      }
    });
  }

  // 添加路由跳转详情页
  private linkDetail(name: string, row: any) {
    if ('analysis' === name) {
      this.router.navigate(['/account/home/analysis'], { queryParams: { key: row.companyName, md5: row.companyMD5 }});
    } else if ('solution' === name) {
      this.router.navigate([`/${name}/detail`], { queryParams: { md5: row.md5, name: row.name, industry: row.industry }});
    } else {
      this.router.navigate([`/${name}/detail`], { queryParams: { md5: row.md5 ? row.md5 : row.collect_md5 }});
    }
  }

  // 用于可能供应商筛选用
  public selecteType(selectedType: any) {
    this.selectedCompanyType = selectedType;
    this.pageVendorNumber(1);
  }
}
