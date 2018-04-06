/**
 * This job is responsible for running uncss and registering its results
 */
import * as DB              from '../../lib/db';
import * as UnCssWrap       from '../../lib/tools/UnCssWrap';

import processUnCssOutput   from './processUnCssOutput';
import insertSelectors  from '../../lib/insertSelectors';
import syncCssFiles         from '../../lib/syncCssFiles/index';

export default async function main(logger, applicationID: number, notifyJobComplete) {
    try {
        const app = await DB.getApp(applicationID);
        const url = app.url;
        logger.info('Start job', url);

        const output = await UnCssWrap.analyzeAppAtUrl(logger, url);
        logger.silly('uncss output size', output.length);

        const cssVariationToSelectors = await processUnCssOutput(logger, output);
        logger.silly('post process uncss output', cssVariationToSelectors);

        const cssVariationFiles = await syncCssFiles(
            logger,
            applicationID,
            Array.from(cssVariationToSelectors.keys())
        );
        logger.silly('css variation files', cssVariationFiles);

        let dataToProcess = iDoNotKnowHowToNameThis(cssVariationFiles, cssVariationToSelectors);
        logger.silly('Data to process', dataToProcess );

        await insertSelectors(logger, applicationID, dataToProcess, true);
    } catch(e) {
        console.error(e);
    }
    notifyJobComplete();
}

function iDoNotKnowHowToNameThis(cssVariationFiles: CSSFileVariation[], cssVariationToSelectors: Map<string, string[]>): Map<number, string[]> {
    let dataToProcess = new Map();
    cssVariationFiles.forEach((file) => {
        if (!cssVariationToSelectors.has(file.url)) {
            return;
        }

        const id = file.css_file_id;
        const selectorsToInsert = cssVariationToSelectors.get(file.url);
        if (!dataToProcess.has(id)) {
            dataToProcess.set(id, []);
        }
        const existingSelector = dataToProcess.get(id);
        const ss = new Set(existingSelector.concat(selectorsToInsert));
        dataToProcess.set(file.css_file_id, Array.from(ss));
    });
    return dataToProcess;
}
