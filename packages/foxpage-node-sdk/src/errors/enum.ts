export enum FoxpageStatus {
  OK = 200,

  // not find
  NOT_MATCH_ROUTER = 400,
  NOT_FIND_DSL = 404,

  // fail
  DSL_PARSE_ERROR = 501,
  PAGE_RENDER_ERROR = 502,

  FAIL = 500,
}
