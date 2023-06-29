import { ComponentSourceMap, RenderStructureNode, VisualEditorConfig } from '@foxpage/foxpage-client-types';

export class States {
  private static selectedNode: RenderStructureNode;
  private static componentMap: ComponentSourceMap = {};
  private static zoom: number;
  static config: VisualEditorConfig;

  public static getSelected() {
    return States.selectedNode;
  }

  public static setSelected(node: RenderStructureNode) {
    States.selectedNode = node;
  }

  public static getComponentMap() {
    return States.componentMap;
  }

  public static setComponentMap(map: { [key: string]: any }) {
    States.componentMap = map;
  }

  public static getZoom() {
    return States.zoom;
  }

  public static setZoom(zoom: number) {
    States.zoom = zoom;
  }

  public static getConfig() {
    return States.config;
  }

  public static setConfig(config: VisualEditorConfig) {
    States.config = config;
  }
}
