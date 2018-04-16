import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SnackBar {
  constructor(private toastr: ToastrService) {}

  /**
   * 成功
   *
   * @param {string} [msg='']
   * @param {string} [title='']
   * @memberof SnackBar
   */
  public success(msg: string = '', title: string = '成功') {
    this.toastr.success(msg);
  }

  /**
   * 提示
   *
   * @param {string} [msg='']
   * @param {string} [title='']
   * @memberof SnackBar
   */
  public info(msg: string = '', title: string = '提示') {
    this.toastr.info(msg);
  }

  /**
   * 警告
   *
   * @param {string} [msg='']
   * @param {string} [title='']
   * @memberof SnackBar
   */
  public warning(msg: string = '', title: string = '告警') {
    this.toastr.warning(msg);
  }

  /**
   * 严重错误
   *
   * @param {string} [msg='']
   * @param {string} [title='']
   * @memberof SnackBar
   */
  public danger(msg: string = '', title: string = '错误') {
    this.toastr.error(msg);
  }
}
