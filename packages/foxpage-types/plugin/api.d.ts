interface FoxpageParserApi {
  evalWithScope?: <T = unknown>(scope: Record<string, any>, expression: string) => T;
}

export type FoxpagePluginApi = FoxpageParserApi & Record<string, unknown>;
