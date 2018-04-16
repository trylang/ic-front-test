import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VerifyEmailService } from './verify-email.service';
import { SnackBar } from '../../../tool/snackbar';

@Component({
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  providers: [VerifyEmailService]
})
export class VerifyEmailComponent implements OnInit, AfterViewInit, OnDestroy {
  public email: string;
  public countdown: number = 5;
  private countdownListener: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private verifyEmailService: VerifyEmailService,
    private snackBar: SnackBar
  ) { }

  public ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'];
  }

  public ngAfterViewInit() {
    this.countdownListener = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownListener);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }

  public ngOnDestroy() {
    clearInterval(this.countdownListener);
  }

  public onResendEmail() {
    this.verifyEmailService.resendRegisterVerifyEmail(this.email).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.snackBar.success('邮件发送成功');
      }
    });
  }
}
