import { ComponentLoadOption } from '../component';
import { StructureNode } from '../structure';

export interface RenderToHTMLOptions extends ComponentLoadOption {}

export interface PageRenderOption {}

export interface RenderedStructureNode extends StructureNode {}

export interface RenderedPage {
  id: string;
  schemas: RenderedStructureNode[];
}
