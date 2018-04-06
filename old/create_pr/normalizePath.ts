import * as _ from 'lodash';

export default function normalizePath(filePath: string, rootDir: string): string {
    // filePath = /tmp/job_create_prc2A8to/genintho-test-b6b72f9/css/test.css
    const a = filePath.replace(rootDir, '');
    // a /genintho-test-b6b72f9/css/test.css

    const b = _.compact(a.split('/'));
    // b [ 'genintho-test-b6b72f9', 'css', 'test.css' ]
    b.shift();
    // b2 [ 'css', 'test.css' ]
    const c = b.join('/');
    // c css/test.css
    return c;
}
