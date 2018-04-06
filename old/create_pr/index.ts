import main from './main';
import loggerFactory from '../../lib/logger';
const logger = loggerFactory('job_create_pr');

main(
    logger, 4, "5dba8d628a35064789578fab9eba91fdd3f83849", () => {}
);
