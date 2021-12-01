import { StructureNode } from '../structure';
import { ComponentLoadOption } from '../component';

export interface RenderToHTMLOptions extends ComponentLoadOption {

}

export interface PageRenderOption {

}

export interface RenderedStructureNode extends StructureNode {

}

export interface RenderedPage {
  id: string;
  schemas: RenderedStructureNode[];
}
