# img-path-pre Usage

## module

```ts
import { ArkPipeModule } from 'path/.../tool/pipe';

@NgModule({
  imports: [
    ArkPipeModule
  ]
})
```

## HTML

```html
<img src="{{img | ImgPathPre}}">
```

## Pipe List

- ImgPathPre
- trustHtml
- trustURL
