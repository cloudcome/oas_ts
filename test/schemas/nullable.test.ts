import { migrate } from '../../src/migrations';
import { Printer } from '../../src/printer';
import { Named } from '../../src/printer/Named';
import { Schemata } from '../../src/printer/Schemata';

test('nullable + required', () => {
    const named = new Named();
    named.nextRefName('T1', '#/components/schemas/T1');
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        required: ['t0'],
        properties: {
            t0: {
                type: ['string', 'null'],
            },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0":((string)|(null));
      }"
    `);
});

test('nullable + array', () => {
    const named = new Named();
    named.nextRefName('T1', '#/components/schemas/T1');
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        required: ['t0'],
        properties: {
            t0: {
                type: ['array', 'null'],
                items: { $ref: '#/components/schemas/T1' },
            },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0":((T1[])|(null));
      }"
    `);
});

test('nullable + allOf', () => {
    const named = new Named();
    named.nextRefName('T1', '#/components/schemas/T1');
    named.nextRefName('T2', '#/components/schemas/T2');
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        properties: {
            t0: { oneOf: [{ type: 'null' }, { allOf: [{ $ref: '#/components/schemas/T1' }, { $ref: '#/components/schemas/T2' }] }] },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0"?:(null|(T1&T2));
      }"
    `);
});

test('nullable + oneOf', () => {
    const named = new Named();
    named.nextRefName('T1', '#/components/schemas/T1');
    named.nextRefName('T2', '#/components/schemas/T2');
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        properties: {
            t0: { oneOf: [{ type: 'null' }, { oneOf: [{ $ref: '#/components/schemas/T1' }, { $ref: '#/components/schemas/T2' }] }] },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0"?:(null|(T1|T2));
      }"
    `);
});

test('nullable + anyOf', () => {
    const named = new Named();
    named.nextRefName('T1', '#/components/schemas/T1');
    named.nextRefName('T2', '#/components/schemas/T2');
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        properties: {
            t0: { oneOf: [{ type: 'null' }, { anyOf: [{ $ref: '#/components/schemas/T1' }, { $ref: '#/components/schemas/T2' }] }] },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0"?:(null|AnyOf<[T1,T2]>);
      }"
    `);
});
