import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { AuditDetailService } from './audit-detail.service';
import { flyInOutAnimation } from '../../../../../tool/animation';
import { Req, EntRes, ParkRes } from './model';
import { SnackBar } from '../../../../../tool/snackbar';

@Component({
  templateUrl: './audit-detail.component.html',
  animations: [ flyInOutAnimation ],
  styleUrls: ['./audit-detail.component.scss'],
  providers: [ AuditDetailService ]
})
export class AuditDetailComponent implements OnInit {
  private ent: EntRes;
  private park: ParkRes;
  private req: Req;
  private isEntDetail: boolean;
  private title: string;
  private params: Params;

  constructor(
    private auditDetailService: AuditDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: SnackBar
  ) { }

  public ngOnInit() {
    this.params = this.route.snapshot.queryParams;
    this.isEntDetail = this.params['type'] === 'ent' ? true : false;
    this.req = new Req();
    if (this.isEntDetail) {
      this.title = '企业用户';
      this.ent = new EntRes();
      this.getEnterpriseVerify();
    } else {
      this.title = '园区用户';
      this.park = new ParkRes();
      this.getParkVerify();
    }
  }

  private onSubmit() {
    if (this.isEntDetail) {
      this.req.username = this.ent.username;
      this.req.companyName = this.ent.companyName;
      this.saveEnterVerityResult();
    } else {
      this.req.parkName = this.park.parkName;
      this.req.username = this.park.username;
      this.saveParkVerityResult();
    }
  }

  /**
   * 获取企业审核信息
   *
   * @private
   * @memberof AuditDetailComponent
   */
  private getEnterpriseVerify() {
    this.auditDetailService.getEnterpriseVerify(this.params['name']).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.ent = data.data;
        this.req.state = String(this.ent.state);
        this.req.remark = this.ent.remark;
      }
    });
  }

  /**
   * 获取园区审核信息
   *
   * @private
   * @memberof AuditDetailComponent
   */
  private getParkVerify() {
    this.auditDetailService.getParkVerify(this.params['name']).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.park = data.data;
        this.req.state = String(this.park.state);
        this.req.remark = this.park.remark;
      }
    });
  }

  private saveEnterVerityResult() {
    this.auditDetailService.saveEnterVerityResult(this.req).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('审核完成');
        this.router.navigate(['../list'], {
          relativeTo: this.route
        });
      }
    });
  }

  private saveParkVerityResult() {
    this.auditDetailService.saveParkVerityResult(this.req).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackbar.success('审核完成');
        this.router.navigate(['../list'], {
          relativeTo: this.route
        });
      }
    });
  }
}
