import { Named } from '../../src/printer/Named';
import { Schemata } from '../../src/printer/Schemata';

it('types', () => {
  const named = new Named();
  const schemata = new Schemata(named);
  const type = schemata.toString({
    type: 'object',
    properties: {
      t0: {
        type: 'string',
      },
      t1: {
        type: [],
      },
      t2: {
        type: ['string'],
      },
      t3: {
        type: ['string', 'number'],
      },
    },
  });
    // console.log(type);
  expect(type).toMatchInlineSnapshot(`
      "{
      "t0"?:string;
      "t1"?:unknown;
      "t2"?:string;
      "t3"?:((string)|(number));
      }"
    `);
});

it('unknownObject', () => {
  const named = new Named();
  const schemata = new Schemata(named);
  const type = schemata.toString({
    type: 'object',
    properties: {
      t0: {
        type: 'object',
      },
    },
  });
    // console.log(type);
  expect(type).toMatchInlineSnapshot(`
      "{
      "t0"?:UnknownObject;
      }"
    `);
});
