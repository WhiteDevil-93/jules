import * as vscode from 'vscode';

export interface GitHubUrlInfo {
    owner: string;
    repo: string;
}

/**
 * GitHub URLを解析してownerとrepoを取得する
 */
export function parseGitHubUrl(url: string): GitHubUrlInfo | null {
    // HTTPS (e.g., https://github.com/owner/repo or https://github.com/owner/repo.git) and
    // SSH (e.g., git@github.com:owner/repo.git) URLs are supported.
    const regex = /(?:https?:\/\/|git@)github\.com[\/:]([^\/]+)\/([^\/]+?)(\.git)?$/;
    const match = url.match(regex);

    if (!match) {
        return null;
    }

    return {
        owner: match[1],
        repo: match[2],
    };
}
/**
 * @deprecated Use GitHubAuth.getToken() instead. PAT support will be removed in a future version
 */
export async function getGitHubPAT(context: vscode.ExtensionContext): Promise<string | undefined> {
    return await context.secrets.get('github-pat');
}

/**
 * @deprecated Use GitHubAuth.signIn() instead. PAT support will be removed in a future version
 */
export async function setGitHubPAT(context: vscode.ExtensionContext, pat: string): Promise<void> {
    await context.secrets.store('github-pat', pat);
}
export async function createRemoteBranch(
    pat: string,
    owner: string,
    repo: string,
    branchName: string
): Promise<void> {
    const { Octokit } = await import('@octokit/rest');
    const octokit = new Octokit({ auth: pat });

    // デフォルトブランチのSHAを取得
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`
    });
    const baseSha = refData.object.sha;

    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: baseSha
    });
}

/**
 * Extracts a Pull Request URL from a text string (e.g., session output).
 */
export function extractPRUrl(text: string): string | null {
    const prUrlRegex = /https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+/;
    const match = text.match(prUrlRegex);
    return match ? match[0] : null;
}
