import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, Params } from '@angular/router';

import swal from 'sweetalert2';
import { SnackBar } from '../../../../../tool/snackbar';
import { PersonService } from './person.service';
import { QueryParam, Person } from './model';

import { flyInOutAnimation } from '../../../../../tool/animation';

@Component({
  templateUrl: './person.component.html',
  animations: [ flyInOutAnimation ],
  styleUrls: ['./person.component.scss'],
  providers: [PersonService]
})
export class PersonComponent implements OnInit {
  public totalRecords: number = 0;
  public currentPage: number = 1;
  public persons: Person[];
  public queryParam: QueryParam;

  constructor(
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackBar
  ) {
    this.queryParam = new QueryParam();
  }

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParam.page = Number(params['page']) || 1;
      this.queryParam.key = params['key'] || null;
      this.queryParam.sort = Number(params['sort']) || 0;
      this.queryParam.type = Number(params['type']) || null;

      this.currentPage = this.queryParam.page;
      this.getPersonAccount();
    });
  }

  public paginate(paginator: any) {
    const page = paginator.page + 1;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onSearch(key: string) {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        key,
        page: 1
      }
    });
  }

  public onDelete(username: string) {
    swal({
      title: '您确定要删除吗？',
      text: '该操作将彻底删除，并且不能恢复!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        // do action confirm
        this.deletePerson(username);
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'

        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          // do antion cancel
        }
      }
    );
  }

  public onChangeSort() {
    const sort = this.queryParam.sort === 0 ? 1 : 0;
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        sort
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public onChangeType(type: number): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        page: 1,
        type
      }
    };
    this.router.navigate([], navigationExtras);
  }

  public convertToResearcher(username: string) {
    swal({
      title: '您确定要将个人用户的用户类型修改为研究员吗？',
      text: '该操作不能将研究员修改为个人用户！',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0069d9',
      cancelButtonColor: '#868e96',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(
      () => {
        // swal('Deleted!', 'Your file has been deleted.', 'success');
        // do action confirm
        this.doConvert(username);
      },
      (dismiss: string) => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
          // do antion cancel
        }
      }
    );
  }

  /**
   * 获取个人用户列表
   *
   * @private
   * @memberof PersonComponent
   */
  private getPersonAccount() {
    this.personService.getPersonalAccount(this.queryParam).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.persons = data.data;
        this.totalRecords = data.size;
      }
    });
  }

  /**
   * 升级用户类型
   *
   * @private
   * @param {string} username
   * @memberof PersonComponent
   */
  private doConvert(username: string) {
    this.personService.convertToResearcher(username).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('升级成功');
        this.getPersonAccount();
      }
    });
  }

  /**
   * 删除用户
   *
   * @private
   * @param {string} username
   * @memberof PersonComponent
   */
  private deletePerson(username: string) {
    this.personService.deleteAccount(username).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('删除用户成功');
        this.getPersonAccount();
      }
    });
  }
}
