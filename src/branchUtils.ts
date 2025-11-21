import * as vscode from "vscode";
import { JulesApiClient } from './julesApiClient';
import { Source as SourceType } from './types';

/**
 * 現在のGitブランチを取得する
 * @returns 現在のブランチ名、またはnull（Git拡張が利用できない場合など）
 */
export async function getCurrentBranch(): Promise<string | null> {
    try {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            console.log('Git extension not available');
            return null;
        }

        const git = gitExtension.exports.getAPI(1);
        if (!git) {
            console.log('Git API not available');
            return null;
        }

        const repositories = git.repositories;
        if (repositories.length === 0) {
            console.log('No git repositories found');
            return null;
        }

        // Use the first repository (usually the main one)
        const repository = repositories[0];
        const head = repository.state.HEAD;
        if (!head) {
            console.log('No HEAD found');
            return null;
        }

        return head.name || null;
    } catch (error) {
        console.error('Error getting current branch:', error);
        return null;
    }
}

/**
 * セッション作成時のブランチ選択に必要な情報を取得する
 * @param selectedSource 選択されたソース
 * @param apiClient APIクライアント
 * @returns ブランチリスト、デフォルトブランチ、現在のブランチ
 */
export async function getBranchesForSession(
    selectedSource: SourceType,
    apiClient: JulesApiClient
): Promise<{ branches: string[]; defaultBranch: string; currentBranch: string | null }> {
    let branches: string[] = [];
    let defaultBranch = 'main';

    try {
        const sourceDetail = await apiClient.getSource(selectedSource.name!);
        if (sourceDetail.githubRepo?.branches) {
            branches = sourceDetail.githubRepo.branches.map(b => b.displayName);
            defaultBranch = sourceDetail.githubRepo.defaultBranch?.displayName || 'main';
        }
    } catch (error) {
        console.error('Failed to get branches, using default:', error);
        branches = [defaultBranch];
    }

    // 現在のブランチを取得
    const currentBranch = await getCurrentBranch();

    // 設定からデフォルトブランチ選択を取得
    const config = vscode.workspace.getConfiguration('jules');
    const defaultBranchSetting = config.get<string>('defaultBranch', 'current');

    // 設定に基づいてデフォルトブランチを決定
    let selectedDefaultBranch = defaultBranch;
    if (defaultBranchSetting === 'current' && currentBranch) {
        selectedDefaultBranch = currentBranch;
    } else if (defaultBranchSetting === 'main') {
        selectedDefaultBranch = 'main';
    } // 'default' の場合はAPIから取得したdefaultBranchを使用

    // 現在のブランチをブランチリストの先頭に追加（まだない場合）
    if (currentBranch && !branches.includes(currentBranch)) {
        branches.unshift(currentBranch);
    }

    return { branches, defaultBranch: selectedDefaultBranch, currentBranch };
}