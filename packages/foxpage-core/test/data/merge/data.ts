import { Page } from '@foxpage/foxpage-types';

const parent: Page = {
  id: 'cont_N5vSO5rQWZM1MOs',
  schemas: [
    {
      children: [
        {
          children: [
            {
              children: [],
              id: 'stru_bntlusFgCxauzb4',
              label: 'meta',
              name: '@fox-design/react-meta',
              props: {
                attrs: {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
                },
              },
              type: 'react.component',
            },
            {
              children: [],
              id: 'stru_aodqltvK6tDIBnU',
              label: 'style',
              name: '@fox-design/react-style',
              props: {
                code: "html body { font-family: BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif }\nhtml[lang='zh-HK'] body, html[lang='zh-TW'] body { font-family: 'Microsoft Jhenghei', 'PingFang HK', STHeitiTC-Light, tahoma, arial, sans-serif }\nhtml[lang='ko-KR'] body { font-family: '나눔바른고딕', Nanum Barun Gothic, '나눔 고딕', 'Nanum Gothic', '맑은 고딕', 'Malgun Gothic', '돋움', dotum, tahoma, arial, sans-serif }\nhtml[lang='ja-JP'] body { font-family: Meiryo UI, Meiryo, 'MS PGothic', Helvetica, Osaka, Tahoma, Arial, sans-serif }\n.rich-text-box ol li { list-style: decimal; }\n.rich-text-box ul li { list-style: disc }\n.rich-text-box ul ul li { list-style: circle }",
              },
              type: 'react.component',
            },
          ],
          id: 'stru_rppzktJnBYQwvDe',
          label: 'head',
          name: '@fox-design/react-head',
          props: {},
          type: 'react.component',
        },
        {
          children: [
            {
              children: [],
              id: 'stru_khykgbCcUEDsW5q',
              label: 'GTM',
              name: '@fox-design/react-script',
              props: {
                code: '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],\r\nj=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src=\r\n\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f);\r\n})(window,document,\'script\',\'dataLayer\',\'GTM-MV95N9D\');\r\nwindow.dataLayer.push({\r\n  "event": "page_view",\r\n  "locale": "{{cargo:locale}}",\r\n  "language": "{{cargo:lang}}",\r\n  "currentcyCode": "{{cargo:currency}}",\r\n  "region": "{{cargo:site}}",\r\n  "allianceID": "{{request:union:aid}}",\r\n  "allianceSid": "{{request:union:sid}}",\r\n  "page_category": "{{injector:pageInfo:category}}",\r\n  "prd_type": "hotel|flight",\r\n  "loginStatus": "",\r\n  "page_id": "{{injector:pageInfo:pageId}}",\r\n})',
              },
              type: 'react.component',
            },
            {
              children: [
                {
                  id: 'stru_afufclgM0-MkWg4',
                  label: '@fox-design/react-container',
                  name: '@fox-design/react-container',
                  type: 'react.component',
                  props: {},
                  children: [
                    {
                      children: [],
                      id: 'stru_pnhjpw0B9VGdZ7Su',
                      label: 'slot',
                      name: '@fox-design/react-slot',
                      props: {},
                      type: 'react.component',
                      directive: {
                        tpl: '{{$this.children}}',
                      },
                    },
                  ],
                },
              ],
              id: 'stru_mnqaep7OGra5XAK',
              label: 'csr-entry',
              name: '@ctrip/cloud-flight-seo-csr-entry',
              props: {
                resource: {
                  requirejsLink: 'https://xxx/modules/ibu/cloud-foxpage/library/requirejs.min.3e9a0d.js',
                  libs: {
                    react: {
                      url: 'https://xxx/modules/ibu/cloud-foxpage/library/react.min.b722e6.js',
                      injectWindow: 'React',
                      umdModuleName: 'react',
                    },
                    'react-dom': {
                      url: 'https://xxx/modules/ibu/cloud-foxpage/library/react-dom.min.5cd6ab.js',
                      injectWindow: 'ReactDOM',
                      umdModuleName: 'react-dom',
                    },
                    'react-helmet': {
                      url: 'https://xxx/modules/ibu/cloud-foxpage/library/react-helmet.min.5c994e.js',
                      injectWindow: 'Helmet',
                      umdModuleName: 'react-helmet',
                    },
                  },
                },
                entryLink: {
                  url: 'https://xxx/modules/ibu/cloud-foxpage/entry.098b49.js',
                },
              },
              type: 'react.component',
            },
            {
              children: [],
              id: 'stru_uqzjriwLLTJ9t-9',
              label: 'script',
              name: '@fox-design/react-script',
              props: {
                code: 'window.__BF_CUSTOM_LOAD_FLAG__ = true;',
              },
              type: 'react.component',
            },
          ],
          id: 'stru_weaybaukXgA9QBZ',
          label: 'body',
          name: '@fox-design/react-body',
          props: {},
          type: 'react.component',
        },
      ],
      id: 'stru_fhvmwpVlaToSLrW',
      label: 'html',
      name: '@fox-design/react-html',
      props: {},
      type: 'react.component',
    },
  ],
  relation: {
    'cargo:locale': {
      type: 'variable',
      id: 'cont_qOmkuEXyLccjACI',
    },
    'cargo:lang': {
      type: 'variable',
      id: 'cont_qOmkuEXyLccjACI',
    },
    'cargo:currency': {
      type: 'variable',
      id: 'cont_qOmkuEXyLccjACI',
    },
    'cargo:site': {
      type: 'variable',
      id: 'cont_qOmkuEXyLccjACI',
    },
    'request:union:aid': {
      type: 'variable',
      id: 'cont_Frm7RPHD9rpZPyA',
    },
    'request:union:sid': {
      type: 'variable',
      id: 'cont_Frm7RPHD9rpZPyA',
    },
    'injector:pageInfo:category': {
      type: 'variable',
      id: 'cont_JR5Z8ieaW595KyY',
    },
    'injector:pageInfo:pageId': {
      type: 'variable',
      id: 'cont_JR5Z8ieaW595KyY',
    },
  },
};

const child: Page = {
  id: 'cont_N5vSO5rQWZM1MOs-1',
  extension: {
    extendId: 'cont_N5vSO5rQWZM1MOs',
  },
  schemas: [
    {
      id: 'stru_bntlusFgCxauzb4-1',
      name: '@fox-design/react-meta',
      type: 'react.component',
      label: 'meta-1',
      props: {
        attrs: {
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes',
        },
      },
      extension: {
        extendId: 'stru_bntlusFgCxauzb4',
      },
    },
    {
      id: 'stru_mnqaep7OGra5XAK-1',
      label: 'csr-entry-1',
      name: '@ctrip/cloud-flight-seo-csr-entry',
      props: {
        resource: {
          requirejsLink: 'https://xxx/modules/ibu/cloud-foxpage/library/requirejs.min.3e9a0d.js',
        },
      },
      type: 'react.component',
      extension: {
        extendId: 'stru_mnqaep7OGra5XAK',
      },
    },
    {
      id: 'stru_bntlusFgCxauzb6',
      name: '@fox-design/react-meta',
      type: 'react.component',
      label: 'meta-1',
      props: {
        attrs: {
          // content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes',
          newStr: 'new str',
        },
      },
      extension: {
        sort: 100,
        parentId: 'stru_pnhjpw0B9VGdZ7Su',
      },
    },
    {
      children: [],
      id: 'stru_uqzjriwLLTJ9t-9',
      label: 'script',
      name: '@fox-design/react-script',
      props: {
        newCode: 'new code',
      },
      type: 'react.component',
    },
  ],
  relation: {},
};

export const getData = () => {
  return { base: parent, current: child };
};
