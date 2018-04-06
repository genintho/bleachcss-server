jest.mock('../../../lib/db');
const DB = require('../../../lib/db');

jest.mock('../../../lib/jobQueue/createJob');
jest.mock('../../../lib/tools/UnCssWrap');
const UnCssWrap = require('../../../lib/tools/UnCssWrap');

jest.mock('../processUnCssOutput');
const processUnCSSOutput = require('../processUnCssOutput').default;

jest.mock('../../../lib/syncCssFiles');
const syncCssFiles = require('../../../lib/syncCssFiles').default;

jest.mock('../../../lib/insertSelectors');
const insertSelectors = require('../../../lib/insertSelectors').default;

import main from '../main';
import loggerFactory from '../../../lib/logger';

const logger = loggerFactory('test');

import {promReturn} from '../../../lib/testUtils';
const mockCallback = jest.fn(() => {});

const APP_ID = 2;

describe('UnCSS Job main', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        DB.getApp.mockReturnValue(promReturn({url:'https://www.test.com/'}));
        UnCssWrap.analyzeAppAtUrl.mockReturnValue(promReturn(TEST_DATA));
        insertSelectors.mockReturnValue(promReturn(1));
    });

    test('should work', async () => {
        const m = new Map();
        m.set('https://www.bleachcss.com/bbbb.css', ['h1']);
        processUnCSSOutput.mockReturnValue(promReturn(m));

        syncCssFiles.mockReturnValue(promReturn([{
            id: 123,
            application_id: APP_ID,
            css_file_id: 15,
            url: 'https://www.bleachcss.com/bbbb.css',
        }]));

        return main(logger, APP_ID, mockCallback).then(() => {
            expect(DB.getApp).toBeCalledWith(APP_ID);
            expect(UnCssWrap.analyzeAppAtUrl).toBeCalledWith(logger, 'https://www.test.com/');
            expect(processUnCSSOutput).toBeCalledWith(logger, TEST_DATA);
            expect(syncCssFiles.mock.calls[0][2]).toMatchObject(Array.from(m.keys()));

            const i = new Map();
            i.set(15, ['h1']);
            expect(insertSelectors.mock.calls[0][2]).toMatchObject(i);

            expect(mockCallback).toBeCalled();
        });
    });

    test('double unclassified', async () => {
        const m = new Map();
        m.set('https://www.bleachcss.com/aaaa.css', ['.aa']);
        m.set('https://www.bleachcss.com/bbbb.css', ['h1']);
        processUnCSSOutput.mockReturnValue(promReturn(m));

        syncCssFiles.mockReturnValue(promReturn([{
            id: 123,
            application_id: APP_ID,
            css_file_id: 15,
            url: 'https://www.bleachcss.com/bbbb.css',
        }, {
            id: 124,
            application_id: APP_ID,
            css_file_id: 15,
            url: 'https://www.bleachcss.com/aaaa.css',
        }]));

        return main(logger, APP_ID, mockCallback).then(() => {
            expect(DB.getApp).toBeCalledWith(APP_ID);
            expect(UnCssWrap.analyzeAppAtUrl).toBeCalledWith(logger, 'https://www.test.com/');
            expect(processUnCSSOutput).toBeCalledWith(logger, TEST_DATA);
            expect(syncCssFiles.mock.calls[0][2]).toMatchObject(Array.from(m.keys()));

            const i = new Map();
            i.set(15, ['h1', '.aa']);
            expect(insertSelectors.mock.calls[0][2]).toMatchObject(i);

            expect(mockCallback).toBeCalled();
        });
    });

    test('should accept 2 matches', async () => {
        const m = new Map();
        m.set('https://www.bleachcss.com/aaaa.css', ['.aa']);
        m.set('https://www.bleachcss.com/bbbb.css', ['h1']);
        processUnCSSOutput.mockReturnValue(promReturn(m));

        syncCssFiles.mockReturnValue(promReturn([{
            id: 123,
            application_id: APP_ID,
            css_file_id: 15,
            url: 'https://www.bleachcss.com/bbbb.css',
        }, {
            id: 124,
            application_id: APP_ID,
            css_file_id: 16,
            url: 'https://www.bleachcss.com/aaaa.css',
        }]));

        return main(logger, APP_ID, mockCallback).then(() => {
            expect(DB.getApp).toBeCalledWith(APP_ID);
            expect(UnCssWrap.analyzeAppAtUrl).toBeCalledWith(logger, 'https://www.test.com/');
            expect(processUnCSSOutput).toBeCalledWith(logger, TEST_DATA);
            expect(syncCssFiles.mock.calls[0][2]).toMatchObject(Array.from(m.keys()));

            const i = new Map();
            i.set(15, ['h1']);
            i.set(16, ['.aa']);
            expect(insertSelectors.mock.calls[0][2]).toMatchObject(i);

            expect(mockCallback).toBeCalled();
        });
    });
});



const TEST_DATA = `
/*** uncss> filename: https://www.bleachcss.com/bbbb.css ***/
h1{color: red;}

/*** uncss> filename: https://www.bleachcss.com/aaaa.css ***/
.aa{color: red;}
`;
