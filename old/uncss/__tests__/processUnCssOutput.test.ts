import processUnCssOutput from '../processUnCssOutput';
import loggerFactory from '../../../lib/logger';

test('processUnCSSOutput', async () => {
    const data = await processUnCssOutput(loggerFactory('test'), TESTDATA);
    expect(data.size).toBe(4);
    expect(Array.from(data.keys())).toEqual([
        'https://www.bleachcss.com/css/bootstrap-3.3.6.css',
        'https://www.bleachcss.com/css/style.css',
        'https://www.bleachcss.com/css/aaaa.css',
        'https://www.bleachcss.com/bbbb.css',
    ]);
    expect(data.get('https://www.bleachcss.com/bbbb.css')).toEqual(['h1']);
});



const TESTDATA = `
/*** uncss> filename: https://www.bleachcss.com/css/bootstrap-3.3.6.css ***/
/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */
html {font-family: sans-serif;}
a {color: purple;}

/*** uncss> filename: https://www.bleachcss.com/css/style.css ***/
a{font-family: "Verdana";}

/*** uncss> filename: https://www.bleachcss.com/css/aaaa.css ***/
h1{padding-top: 50px}

/*** uncss> filename: https://www.bleachcss.com/bbbb.css ***/
h1{color: red;}
`;
