export const colors = ['#d922d3', '#22b0d9', '#e8b20e', '#78c910', '#e32222', '#e8600e'];

export function calculateStr(str: string): number {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      width += 12;
    } else {
      width += 6;
    }
  }
  return width;
}

export function plusPath(a: number, b: number): string {
  // tslint:disable-next-line:max-line-length
  return `M -${a},-${a} L -${a},-${b} L ${a},-${b} L ${a},-${a} L ${b},-${a} L ${b},${a}  L ${a},${a} L ${a},${b} L -${a},${b} L -${a},${a} L -${b},${a} L -${b},-${a} L -${a},-${a}`;
}

export function minusPath(a: number, b: number): string {
  return `M -${b},-${a}L ${b},-${a} L ${b},${a} L -${b},${a} L -${b},-${a} L -${b},-${a}`;
}

export function getMaxDepth(data: any): number {
  const arr = data.map((elem: any) => elem.depth);
  return Math.max.apply(null, arr);
}

export function remapEmptyTree(data: any) {
  const depths = data.descendants().map((element: any) => element.depth);
  const maxDepth = Math.max.apply(null, depths);

  const loop = (item: any) => {
    if (item.hasOwnProperty('_children')) {
      const depth = item.depth;
      item.children = [
        {
          depth
        }
      ];
      let target = item.children[0];
      for (let i = depth + 1; i < maxDepth - 1; i++) {
        target.children = [
          {
            depth: i
          }
        ];
        target = target.children[0];
      }
    }
  };

  for (const i in data.descendants()) {
    if (data.descendants().hasOwnProperty(i)) {
      loop(data.descendants()[i]);
    }
  }

  return data;
}

export function removeNousedNode(data: any): void {
  const loop = (item: any) => {
    if (item) {
      if (item.hasOwnProperty('_children')) {
        delete item.children;
      }
    }
  };

  for (const i in data.descendants()) {
    if (data.descendants().hasOwnProperty(i)) {
      loop(data.descendants()[i]);
    }
  }
}

export function initMouseListener(g: any) {
  let pos: number[] = [];

  const docMouseMove = (event: any) => {
    const getPos = (str: string) => {
      return str
        .split('(')[1]
        .split(')')[0]
        .split(',')
        .map((element: any) => parseFloat(element));
    };
    const pos1 = pos;
    pos = [event.screenX, event.screenY];
    const delta = [pos[0] - pos1[0], pos[1] - pos1[1]];
    const attributes = g.attr('transform');
    const position = attributes.split(' ')[0];
    const scale = attributes.split(' ')[1];
    const rotate = attributes.split(' ')[2];
    const num = getPos(position);
    g.attr('transform', `translate(${num[0] + delta[0]},${num[1] + delta[1]}) ${scale} ${rotate}`);
  };

  const docMouseDown = (event: any) => {
    pos = [event.screenX, event.screenY];
    $(document).off('mousedown');
    $(document).on('mouseup', docMouseUp);
    $(document).on('mousemove', docMouseMove);
  };

  const docMouseUp = () => {
    $(document).off('mouseup');
    $(document).off('mousemove');
    $(document).on('mousedown', docMouseDown);
  };

  $(document).on('mousedown', docMouseDown);
}

export function getNum(str: string): string {
  return str.split('(')[1].split(')')[0];
}

export function fillColor(d: any) {
  if (d.parent === null) {
    return '#2f8cc7';
  } else {
    if (d.parent.data.name === '高管成员') {
      return '#ccc';
    } else {
      let inx = 0;

      const traverse = (data: any) => {
        if (data.data.index) {
          inx = data.data.index;
        } else {
          traverse(data.parent);
        }
      };

      traverse(d);

      return colors[inx];
    }
  }
}

export function initDataAction(data: any, g: any): any {
  data.zoomin = () => {
    const attributes = g.attr('transform');
    const position = attributes.split(' ')[0];
    const scale = attributes.split(' ')[1];
    const rotate = attributes.split(' ')[2];
    const num = getNum(scale);
    g.attr('transform', `${position} scale(${parseFloat(num) + 0.1}) ${rotate}`);
  };

  data.zoomout = () => {
    const attributes = g.attr('transform');
    const position = attributes.split(' ')[0];
    const scale = attributes.split(' ')[1];
    const rotate = attributes.split(' ')[2];
    const num = getNum(scale);
    g.attr('transform', `${position} scale(${parseFloat(num) - 0.1 > 0.5 ? parseFloat(num) - 0.1 : 0.5}) ${rotate}`);
  };

  data.rotate = (clockWise: any) => {
    const attributes = g.attr('transform');
    const position = attributes.split(' ')[0];
    const scale = attributes.split(' ')[1];
    const rotate = attributes.split(' ')[2];
    const num = getNum(rotate);
    g.attr('transform', `${position} ${scale} rotate(${clockWise ? parseInt(num, 10) - 5 : parseInt(num, 10) + 5}) `);
  };

  data.refresh = () => {
    const attributes = g.attr('transform');
    const position = attributes.split(' ')[0];
    g.attr('transform', `${position} scale(1) rotate(0)`);
  };

  return data;
}

function randomString(len = 32) {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function traverse(data: any) {
  data.id = randomString();
  if (data.children) {
    for (const i in data.children) {
      if (data.children.hasOwnProperty(i)) {
        traverse(data.children[i]);
      }
    }
  }
}

export function renderLink(x: number, y: number, px: number, py: number) {
  return `M${project(x, y)}C${project(x, (y + py) / 2)} ${project(px, py + 50)} ${project(px, py)}`;
}

export function project(x: number, y: number) {
  const angle = (x - 90) / 180 * Math.PI;
  const radius = y;

  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}
