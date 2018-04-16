import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import swal from 'sweetalert2';
import * as _ from 'lodash';
import { CaseEditComponent } from './case-edit.component';

@Injectable()
export class CaseDeactivateGuard implements CanDeactivate<CaseEditComponent> {
  public canDeactivate(
    component: CaseEditComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | boolean {
   if (_.isEqual(component.case, component.guardCase)) {
     return true;
   } else {
     return this.confirmCanDeactivate();
   }
  }

  private confirmCanDeactivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      swal({
        title: '确定要退出吗',
        text: '您有尚未保存的内容，退出后将删除并且不能恢复!',
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
          resolve(true);
        },
        (dismiss: string) => {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            // swal('Cancelled', 'Your imaginary file is safe :)', 'error');
            // do antion cancel
            resolve(false);
          }
        }
      );
    });
  }
}
