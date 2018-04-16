import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const ROUTES: Routes = [
  {path: 'manage', loadChildren: './func/manage/manage.module#ManageModule'},
  {path: 'account', loadChildren: './func/account/account.module#AccountModule'},
  {path: 'login', loadChildren: './func/log-in/log-in.module#LogInModule'},
  {path: 'signup', loadChildren: './func/sign-up/sign-up.module#SignUpModule'},
  {path: 'forgotpassword', loadChildren: './func/forgot-password/forgot-password.module#ForgotPsdModule'},
  {path: 'solution', loadChildren: './func/solution/solution.module#SolutionModule'},
  {path: 'company', loadChildren: './func/company/company.module#CompanyModule'},
  {path: 'product', loadChildren: './func/product/product.module#ProductModule'},
  {path: 'patents', loadChildren: './func/patents/patents.module#PatentsModule'},
  {path: 'policy', loadChildren: './func/policy/policy.module#PolicyModule'},
  {path: 'standard', loadChildren: './func/standard/standard.module#StandardModule'},
  {path: 'park', loadChildren: './func/park/park.module#ParkModule'},
  {path: '404', loadChildren: './func/page-not-found/page-not-found.module#PageNotFoundModule'},
  {path: '500', loadChildren: './func/server-error/server-error.module#ServerErrorModule'},
  {path: 'overspeed', loadChildren: './func/verify-overspeed/verify-overspeed.module#VerifyOverspeedModule'},
  {path: 'mail', loadChildren: './func/email-page/email-page.module#EmailPageModule'},
  {path: 'experience', loadChildren: './func/experience/experience.module#ExperienceModule'},
  {path: 'about', loadChildren: './func/about/about.module#AboutModule'},
  {path: '', loadChildren: './func/home/home.module#HomeModule', pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
