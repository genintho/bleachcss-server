import * as _ from 'lodash';

/**
 * Get the Sha of the head of a branch. If the branch does not exists, it is created
 *
 * @param github
 * @param owner
 * @param repo
 * @param defaultBranch
 * @param branchName
 * @returns {Promise<any>}
 */
export default async function createOrGetBranchSha(logger, github, owner, repo, defaultBranch, branchName): Promise<string> {
    try {
        logger.info('Try to create branch');
        const branch = await github.gitdata.getReference({owner, repo, ref: 'heads/' + branchName});
        if (_.has(branch, 'data.object.sha')) {
            return branch.data.object.sha;
        }
    } catch (e) {
        // Nothing to o
        logger.error(e);
    }
    // Create a new Branch
    logger.info('Get Reference to HEAD hash');
    const response = await github.gitdata.getReference({owner, repo, ref: 'heads/' + defaultBranch});
    const branchSha = response.data.object.sha;

    logger.info('Create new Reference');
    await github.gitdata.createReference({
        owner,
        repo,
        sha: branchSha,
        ref: 'refs/heads/' + branchName
    });
    return branchSha;
}
