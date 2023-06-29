import { StructureDetail } from '../interface';

export class NodesStore {
  private static nodes: { detail: StructureDetail }[] = [];

  public static allNodes() {
    return NodesStore.nodes;
    // .sort((a, b) => {
    //   const aBound = document.getElementById(a.detail.node.id)?.getBoundingClientRect() as DOMRect;
    //   const bBound = document.getElementById(b.detail.node.id)?.getBoundingClientRect() as DOMRect;
    //   return aBound.width * aBound.height - bBound.width * bBound.height;
    // })
  }

  public static push(element: { detail: StructureDetail }) {
    NodesStore.nodes.push(element);
  }

  public static clean() {
    NodesStore.nodes = [];
  }
}
