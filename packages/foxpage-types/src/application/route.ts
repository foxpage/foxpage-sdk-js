export interface FoxRoute {
  /**
   * match path
   */
  path: string;
  /**
   * match weight
   */
  weight?: number;
  /**
   * enable status
   */
  enable?: boolean;
  /**
   * exact match
   * examples.
   * true: /xxx/ not match /xxx/xx.html;
   * false: /xxx/ match /xxx/xx.html;
   */
  exact?: boolean;
  /**
   * rewrite, for matched path
   */
  rewrite?: string | ((pathname: string) => string | undefined | null);
}
