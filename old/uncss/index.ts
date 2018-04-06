// NOT USED IN PRODUCTION

import main from './main';
import loggerFactory from '../../lib/logger';

main(
    loggerFactory('job_uncss'),
    2,
    () => {
        process.exit(0)
    }
);
