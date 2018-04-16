# Share btns

- Weibo
- QQ Zone
- Wechat

## Usage

### 1. Module

```ts
import { ShareModule } from 'path/to/tool/share';

@NgModule({
  imports: [
    ShareModule
  ]
})
```

### 2. HTML

```html
<ark-share sharePic="{{currentPageLogoURL}}" shareDesc="{{desc}}"></ark-share>
```

### 3. index.html

```html
<html xmlns:wb="http://open.weibo.com/wb">

<!-- Add this to head -->
<meta property="wb:webmaster" content="b7c976401f270fdf" />

<!-- Add this to </body> -->
<script src="http://tjs.sjs.sinajs.cn/open/api/js/wb.js" type="text/javascript" charset="utf-8"></script>
```

## 一、Share to Weibo

### 1. index.html

```html
  <meta property="wb:webmaster" content="b7c976401f270fdf" />
```

### 2. App key & App sercet

App Key：
App Sercet：

## 二、Share to QZone
