import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { SideBarTree } from './sidebar.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'macro-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sideBarTree: SideBarTree[];
  public keywords: string = null;
  public totalRecords: number = 0;
  public currentPage: number = 1;

  constructor(private sidebarService: SidebarService, private router: Router, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.getBasicInfo();
  }

  public onSearch() {
    if (!this.keywords) {
      this.getBasicInfo();
    } else {
      this.getByKeyword();
    }
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    this.getByKeyword(page);
  }

  public refreshRouter(id: number) {
    // 格式化最后一级分类
    this.sideBarTree = this.unActiveOtherLastChild(this.sideBarTree, id);

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: {
        id
      }
    });
  }

  /**
   * 遍历sidebar tree，除了最近选中的最后一级分类高亮，其它都正常
   *
   * @private
   * @param {SideBarTree[]} childs
   * @param {number} id
   * @returns {SideBarTree[]}
   * @memberof SidebarComponent
   */
  private unActiveOtherLastChild(childs: SideBarTree[], id: number): SideBarTree[] {
    childs.forEach((child: SideBarTree) => {
      if (!child.last) {
        this.unActiveOtherLastChild(child.children, id);
      } else {
        if (child.isActive && child.id !== id) {
          child.isActive = false;
        }
      }
    });

    return childs;
  }

  /**
   * 获取顶级分类
   *
   * @private
   * @memberof SidebarComponent
   */
  private getBasicInfo() {
    this.sidebarService.getBasicInfo().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.sideBarTree = data.data.baseInfo.map((e: any) => {
          return Object.assign({}, e, { children: [], isActive: false });
        });
      }
    });
  }

  /**
   * 通过关键字搜索
   *
   * @private
   * @memberof SidebarComponent
   */
  private getByKeyword(page: number = 1) {
    this.sidebarService.getByKeyword(this.keywords, page).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.sideBarTree = data.data.map((e: any) => {
          return Object.assign({}, e, { children: [], isActive: false });
        });

        this.totalRecords = data.size;
      }
    });
  }
}
