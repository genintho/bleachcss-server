import * as _ from 'lodash';
import * as Download from '../../lib/Download';
import * as path from 'path';
import * as fsp from '../../lib/fsp';

export default async function downloadArchive(github, owner: string, repo: string, defaultBranch: string): Promise<string> {
    const tmpDir = await fsp.mkDirTemp('job_create_pr');
    const archiveTar = path.join(tmpDir, 'archive.tar.gz');
    const archiveUrl = await getArchiveURL(github, owner, repo, defaultBranch);
    await Download.toFile(archiveUrl, archiveTar);
    await fsp.untar(archiveTar, tmpDir);
    return tmpDir;
}

/**
 *
 * @param github
 * @param owner
 * @param repo
 * @param defaultBranch
 * @returns {Promise<string>}
 */
async function getArchiveURL(github, owner: string , repo: string, defaultBranch: string): Promise<string> {
    const response = await github.repos.getArchiveLink({owner, repo, archive_format: 'tarball'});
    if (!_.has(response, 'meta.location')) {
        throw new Error('Can not get the loc');
    }

    let locationURL = response.meta.location;
    locationURL = locationURL.replace(':ref', defaultBranch);
    return locationURL;
}
