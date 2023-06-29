interface FoxpageParserApi {
  evalWithScope?: <T = unknown>(scope: Record<string, any>, expression: string) => T;
  executeFun?: (code: string, args: any[], vars?: any[]) => any;
}

export type FoxpagePluginApi = FoxpageParserApi & Record<string, unknown>;
