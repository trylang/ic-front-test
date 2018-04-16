# Table表格组件

## table样式抽离

## 1. module

```ts
import { TableModule } from 'CustomPathPre/tool/table/table.module';
```

## 2. html

```html
<park-table [data]="vendorTable" (onPageNumber)="pageNumber($event)" (onModelChange)="selecteType($event)"></park-table>
```

## 3. component

```ts
	public vendorTable: any = {
    header : {
      title: '供应商收藏',
      options: [{  // 如果表格需要筛选，可设置
        label: '',
        type: 'select',
        class: '',
        data: 'selectId', 
        filterFormat: { 
          label: 'text',
          value: 'type'
        },
        options: [{
          text: '方案',
          type: 1
        }, {
          text: '产品',
          type: 3
        }, {
          text: '案例',
          type: 2
        }]
      }],
    },
    columnDefs: {
      show: true, // 是否显示表头
      data: [{
      label: '供应商名称',
      data: 'name', // 定义字段名
      type: 'text',
      class: ''
    },
    {
      label: '更新时间',
      data: 'updateTime',
      class: '',   
      type: 'date' // 时间类型的转义
    },
    {
      label: '操作',
      data: 'operation',
      type: 'buttonGroup',
      class: '',
      modes: [{
        label: '取消收藏',
        class: '',
        style: {
          'width': '80%',
          'position': 'relative',
          'right': '-5%',
          'text-align': 'center',
          'border': '2px solid #ffbc5d',
          'border-radius': '20px',
          'color': '#ffbc5d'
        },
        click: (row: any) => {
          this.cancelCollection(row);
        }
      }]
    }]
    },
    columns: [], // 显示数据部分
    page: { // 是否显示分页
      show: true,
      size: 0,
      rows: 10
    }
  };

  public pageNumber(page: any) {
    // 获取页数
  }

  public selecteType(type: any) {
    // 获取model变化的值
  }
```
