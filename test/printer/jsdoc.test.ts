import { JsDoc } from '../../src/printer/JsDoc';

it('multiple', () => {
  const jsDoc = new JsDoc([
    {
      name: 't1',
    },
    {
      name: 't2',
      description: 't2 description',
    },
    {
      name: 't3',
      description: 't3 description 1\n\nt3 description 2',
      externalDocs: {
        url: 'https://example.com',
        description: 'external docs 1\nexternal docs 2',
      },
    },
  ]);
  jsDoc.addComments({
    description: 'aaa\nbbb\nccc',
    deprecated: true,
    summary: 'summary',
    tags: ['t1', 't2', 't3'],
  });
  expect(jsDoc.print()).toMatchInlineSnapshot(`
      "/**
       * @description aaa
       * bbb
       * ccc
       * @deprecated
       * @summary summary
       * @see t1 
       * @see t2 t2 description
       * @see t3 t3 description 1
       * 
       * t3 description 2 {@link https://example.com external docs 1
       * external docs 2}
       */"
    `);
});
