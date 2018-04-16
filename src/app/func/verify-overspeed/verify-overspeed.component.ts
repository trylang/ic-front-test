import { Component, OnInit } from '@angular/core';
import { VerifyOverspeedService } from './verify-overspeed.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBar } from '../../tool/snackbar';

@Component({
  templateUrl: './verify-overspeed.component.html',
  styleUrls: ['./verify-overspeed.component.scss'],
  providers: [VerifyOverspeedService]
})
export class VerifyOverspeedComponent implements OnInit {
  private base64Img: string;

  constructor(
    private verifyOverspeedService: VerifyOverspeedService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: SnackBar
  ) {}

  public ngOnInit() {
    this.getKaptcha();
  }

  private verifyCode(code: string) {
    if (!code) {
      this.snackBar.warning('请输入验证码');
      return;
    }
    this.verifyOverspeedService.verifyOverspeed(code).subscribe((data: any) => {
      if ('2000' === data.code) {
        // 返回上一页面，或者首页
        const returnURL: string = this.route.snapshot.queryParams['returnURL'];
        if (returnURL) {
          this.router.navigateByUrl(returnURL);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        // 校验错误：重新获取一张图片
        this.getKaptcha();
      }
    });
  }

  private getKaptcha() {
    this.verifyOverspeedService.getKaptcha().subscribe((data: any) => {
      if ('2000' === data.code) {
        this.base64Img = `data:image/jpg;base64,${data.data}`;
      }
    });
  }
}
