import * as postCssExtractor from 'bleachcss-probe/src/postCssExtractor';

export default async function processUnCssOutput(logger, inputString: string): Promise<Map<string, string[]>> {
    const chunks = inputString.split("/*** uncss> filename:");

    const data = new Map();
    for (let idx = 1; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const {url, selectors} = await runPostCssOnChunk(chunk);
        data.set(url, selectors);
    }
    return data;
};

async function runPostCssOnChunk(chunk): Promise<{url: string, selectors: Array<string>}> {
    const endUrlIdx = chunk.indexOf("***/");
    const url = chunk.substr(0, endUrlIdx).trim();
    const cssStr = chunk.substr(endUrlIdx + 4);

    const rules: Set<string> = await postCssExtractor(cssStr);
    return {
        url,
        selectors: Array.from(rules)
    };
}
