# 校验组件库

## 校验器需求列表

### 1. name-validator

- 字符范围校验
- 不支持词组校验（比如：不支持纯数字，不支持sb等）

### 2. phone-validator

- 中国大陆通用手机号格式校验
- 港澳台及国外手机号格式校验

### 3. email-validator

- 通用邮箱格式校验

### 4. tel-validator

- 中国大陆通用电话格式校验

### 5. server-validator

- 需要请求服务端的校验

### 6. two-relation-validator

- 对两个有相互关联的输入进行校验，比如新旧密码，新密码与确认密码

## Usage

### 1 example.module.ts

```ts
import { ValidatorModule } from 'path/tool/validator';

@NgModule({
  imports: [
    ValidatorModule
  ]
})
```

### 2. Use it in component.ts, for example: *.component.ts

```ts
import { nameValidator } from 'path/tool/validator';

this.fb.group({
  testKey: [this.test.key, [nameValidator()]]
})
```

### OR use it in HTML

```html
<input id="name" name="name" [(ngModel)]="test.key" #name="ngModel" validateName="denyword">
```
