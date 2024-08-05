import { Named } from '../../src/printer/Named';
import { Schemata } from '../../src/printer/Schemata';

test('required', () => {
    const named = new Named();
    const schemata = new Schemata(named);
    const type = schemata.toString({
        type: 'object',
        required: ['t1'],
        properties: {
            t0: {
                type: ['string'],
                required: true,
            },
            t1: {
                type: 'number',
            },
            t2: {
                type: 'boolean',
            },
            t3: {
                type: ['string', 'number'],
                required: true,
            },
        },
    });
    // console.log(type);
    expect(type).toMatchInlineSnapshot(`
      "{
      "t0":string;
      "t1":number;
      "t2"?:boolean;
      "t3"?:((string)|(number));
      }"
    `);
});
