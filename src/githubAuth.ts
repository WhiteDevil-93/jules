import * as vscode from 'vscode';

export class GitHubAuth {
    private static readonly SCOPES = ['repo'];

    static async signIn(): Promise<string | undefined> {
        try {
            const session = await vscode.authentication.getSession(
                'github',
                GitHubAuth.SCOPES,
                { createIfNone: true }
            );

            return session?.accessToken;
        } catch (error) {
            vscode.window.showErrorMessage('Failed to sign in to GitHub');
            return undefined;
        }
    }

    static async getSession(): Promise<vscode.AuthenticationSession | undefined> {
        try {
            return await vscode.authentication.getSession(
                'github',
                GitHubAuth.SCOPES,
                { createIfNone: false }
            );
        } catch (error) {
            return undefined;
        }
    }

    static async getToken(): Promise<string | undefined> {
        const session = await GitHubAuth.getSession();
        return session?.accessToken;
    }

    static async getUserInfo(): Promise<{ login: string; name: string } | undefined> {
        const session = await GitHubAuth.getSession();
        if (!session) {
            return undefined;
        }

        return {
            login: session.account.label,
            name: session.account.label
        };
    }

    static async isSignedIn(): Promise<boolean> {
        const session = await GitHubAuth.getSession();
        return session !== undefined;
    }
}
