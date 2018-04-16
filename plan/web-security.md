# Web security

## 一、XSS 跨站脚本攻击

> 跨站脚本(XSS)允许攻击者将恶意代码注入到页面中。这些代码可以偷取用户数据 （特别是它们的登录数据），还可以冒充用户执行操作。它是Web上最常见的攻击方式之一

### 解决方案

___Angular框架做了一些处理___

- 避免直接使用DOM API
  > 浏览器内置的DOM API不会自动针对安全漏洞进行防护。比如，document（它可以通过ElementRef访问）以及其它第三方API都可能包含不安全的方法。 要避免直接与DOM交互，只要可能，就尽量使用Angular模板。

- 合理使用innerHTML - 会解析tag标签 和 {{}} - 无害化处理
- 合理使用bypassSecurityTrust API
    * bypassSecurityTrustHtml
    * bypassSecurityTrustScript
    * bypassSecurityTrustStyle
    * bypassSecurityTrustUrl
    * bypassSecurityTrustResourceUrl
- HttpOnly, Secure, Expire设置,可有效提高被攻击风险

## 二、CSRF或XSRF 跨站请求伪造

### 要完成一次CSRF攻击，受害者必须依次完成两个步骤：

1. 登录受信任网站A，并在本地生成Cookie
2. 在不登出A的情况下，访问危险网站B

### 解决方案

- 添加两个token，一个用于维持登录状态，一个用于敏感请求请求的验证
- Set-Cookie: foo=bar; SameSite=Lax
- 验证码
- 检查Referer

## 三、a标签target="_blank" 漏洞

> 带有 target="_blank" 跳转的网页拥有了浏览器 window.opener 对象赋予的对原网页的跳转权限，这可能会被恶意网站利用，例如一个恶意网站在某 UGC 网站 Po 了其恶意网址，该 UGC 网站用户在新窗口打开页面时，恶意网站利用该漏洞将原 UGC 网站跳转到伪造的钓鱼页面，用户返回到原窗口时可能会忽视浏览器 URL 已发生了变化，伪造页面即可进一步进行钓鱼或其他恶意行为

### 解决方案

- 所有a标签 带有 target="_blank" 都要使用配置  rel="noopener noreferrer"