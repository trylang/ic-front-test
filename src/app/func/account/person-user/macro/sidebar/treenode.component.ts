import { Component, Input, Output, EventEmitter } from '@angular/core';
import {SideBarTree  } from './sidebar.model';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'ark-treenode',
  templateUrl: './treenode.component.html',
  styleUrls: ['./treenode-component.scss']
})
export class TreeNodeComponent {
  @Input() public node: SideBarTree;
  @Output() public onSelecteLastNode: EventEmitter<number> = new EventEmitter<number>();

  constructor(private sidebarService: SidebarService) { }

  public toggleClick() {
    if (!this.node.isActive) {
      this.onLoadChildren(this.node.id);
    }

    // 最后一级首先保证都是高亮，对于其它不高亮的处理，在sidebar.component.ts里面执行
    if (!this.node.last) {
      this.node.isActive = !this.node.isActive;
    } else {
      this.node.isActive = true;
    }

    // 选中最后一级，返回数据
    if (this.node.last === true) {
      this.onSelecteLastNode.emit(this.node.id);
    }
  }

  /**
   * 向上一级emit数据
   *
   * @param {number} id
   * @memberof TreeNodeComponent
   */
  public emitParent(id: number) {
    this.onSelecteLastNode.emit(id);
  }

  public onLoadChildren(id: number) {
    if (!this.node.children || this.node.children.length < 1) {
      this.getCascade(id);
    }
  }

  /**
   * 通过父级分类id，获取子级数据
   *
   * @private
   * @param {number} id
   * @memberof TreeNodeComponent
   */
  private getCascade(id: number) {
    this.sidebarService.getCascade(id).subscribe((data: any) => {
      if ('2000' === data.code) {
        this.node.children = data.data.map((e: any) => Object.assign({}, e, {children: [], isActive: false}));
      }
    });
  }
}
