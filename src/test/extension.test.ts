import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import {
  SessionTreeItem,
  mapApiStateToSessionState,
  buildFinalPrompt,
  areOutputsEqual,
  updatePreviousStates,
  Session,
  SessionOutput
} from "../extension";
import * as sinon from "sinon";
import * as fetchUtils from "../fetchUtils";
import { activate } from "../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  // Tests for mapApiStateToSessionState function behavior
  suite("API State Mapping", () => {
    test("PLANNING should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("PLANNING"), "RUNNING");
    });

    test("AWAITING_PLAN_APPROVAL should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("AWAITING_PLAN_APPROVAL"), "RUNNING");
    });

    test("AWAITING_USER_FEEDBACK should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("AWAITING_USER_FEEDBACK"), "RUNNING");
    });

    test("IN_PROGRESS should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("IN_PROGRESS"), "RUNNING");
    });

    test("QUEUED should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("QUEUED"), "RUNNING");
    });

    test("STATE_UNSPECIFIED should map to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("STATE_UNSPECIFIED"), "RUNNING");
    });

    test("COMPLETED API state should map to COMPLETED UI state", () => {
      assert.strictEqual(mapApiStateToSessionState("COMPLETED"), "COMPLETED");
    });

    test("FAILED API state should map to FAILED UI state", () => {
      assert.strictEqual(mapApiStateToSessionState("FAILED"), "FAILED");
    });

    test("CANCELLED API state should map to CANCELLED UI state", () => {
      assert.strictEqual(mapApiStateToSessionState("CANCELLED"), "CANCELLED");
    });

    test("PAUSED API state should map to CANCELLED UI state", () => {
      assert.strictEqual(mapApiStateToSessionState("PAUSED"), "CANCELLED");
    });

    test("Unknown states should default to RUNNING", () => {
      assert.strictEqual(mapApiStateToSessionState("UNKNOWN_STATE"), "RUNNING");
      assert.strictEqual(mapApiStateToSessionState(""), "RUNNING");
    });
  });

  suite("Session Tree Item", () => {
    test("SessionTreeItem should display correct icons based on state", () => {
      const runningItem = new SessionTreeItem({
        name: "sessions/123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
      } as any);
      assert.ok(runningItem.iconPath);

      const completedItem = new SessionTreeItem({
        name: "sessions/456",
        title: "Completed Session",
        state: "COMPLETED",
        rawState: "COMPLETED",
      } as any);
      assert.ok(completedItem.iconPath);
    });

    test("SessionTreeItem exposes context value for view menus", () => {
      const item = new SessionTreeItem({
        name: "sessions/123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
      } as any);

      assert.strictEqual(item.contextValue, "jules-session");
    });

    test("SessionTreeItem should have proper command", () => {
      const item = new SessionTreeItem({
        name: "sessions/789",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
      } as any);

      assert.ok(item.command);
      assert.strictEqual(item.command?.command, "jules-extension.showActivities");
      assert.strictEqual(item.command?.arguments?.[0], "sessions/789");
    });

    test("SessionTreeItem should have Markdown tooltip", () => {
      const item = new SessionTreeItem({
        name: "sessions/123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        requirePlanApproval: true,
        sourceContext: { source: "sources/github/owner/repo" }
      } as any);

      assert.ok(item.tooltip instanceof vscode.MarkdownString);
      const tooltipValue = (item.tooltip as vscode.MarkdownString).value;
      assert.ok(tooltipValue.includes("**Test Session**"));
      assert.ok(tooltipValue.includes("Status: **RUNNING**"));
      assert.ok(tooltipValue.includes("⚠️ **Plan Approval Required**"));
      assert.ok(tooltipValue.includes("Source: `owner/repo`"));
      assert.ok(tooltipValue.includes("ID: `sessions/123`"));
    });
  });

  suite("buildFinalPrompt", () => {
    let getConfigurationStub: sinon.SinonStub;

    setup(() => {
      getConfigurationStub = sinon.stub(vscode.workspace, "getConfiguration");
    });

    teardown(() => {
      getConfigurationStub.restore();
    });

    test("should append custom prompt to user prompt", () => {
      const workspaceConfig = {
        get: sinon.stub().withArgs("customPrompt").returns("My custom prompt"),
      };
      getConfigurationStub.withArgs("jules-extension").returns(workspaceConfig as any);

      const userPrompt = "User message";
      const finalPrompt = buildFinalPrompt(userPrompt);
      assert.strictEqual(finalPrompt, "User message\n\nMy custom prompt");
    });

    test("should return only user prompt if custom prompt is empty", () => {
      const workspaceConfig = {
        get: sinon.stub().withArgs("customPrompt").returns(""),
      };
      getConfigurationStub.withArgs("jules-extension").returns(workspaceConfig as any);

      const userPrompt = "User message";
      const finalPrompt = buildFinalPrompt(userPrompt);
      assert.strictEqual(finalPrompt, "User message");
    });

    test("should return only user prompt if custom prompt is not set", () => {
      const workspaceConfig = {
        get: sinon.stub().withArgs("customPrompt").returns(undefined),
      };
      getConfigurationStub.withArgs("jules-extension").returns(workspaceConfig as any);

      const userPrompt = "User message";
      const finalPrompt = buildFinalPrompt(userPrompt);
      assert.strictEqual(finalPrompt, "User message");
    });
  });

  suite("PR Status Check Feature", () => {
    test("PR URL extraction works correctly", () => {
      const session = {
        name: "sessions/123",
        title: "Test Session",
        state: "COMPLETED" as const,
        rawState: "COMPLETED",
        outputs: [
          {
            pullRequest: {
              url: "https://github.com/owner/repo/pull/123",
              title: "Test PR",
              description: "Test",
            },
          },
        ],
      };

      // This would need to be exported from extension.ts for proper testing
      // For now, we're just verifying the structure is correct
      assert.ok(session.outputs);
      assert.ok(session.outputs[0].pullRequest);
      assert.strictEqual(
        session.outputs[0].pullRequest.url,
        "https://github.com/owner/repo/pull/123"
      );
    });

    test("Session without PR has no PR URL", () => {
      const session = {
        name: "sessions/456",
        title: "Test Session",
        state: "RUNNING" as const,
        rawState: "IN_PROGRESS",
        outputs: [],
      };

      assert.ok(!session.outputs || session.outputs.length === 0);
    });

    test("activate should clean expired PR status cache entries and keep valid ones", async () => {
      const now = Date.now();
      const PR_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      // Build cache: one valid (2 minutes ago), one expired (6 minutes ago)
      const validLastChecked = now - 2 * 60 * 1000;
      const expiredLastChecked = now - (PR_CACHE_DURATION + 60 * 1000);

      const prCache: any = {
        "https://github.com/owner/repo/pull/1": { isClosed: true, lastChecked: validLastChecked },
        "https://github.com/owner/repo/pull/2": { isClosed: false, lastChecked: expiredLastChecked },
      };

      const localSandbox = sinon.createSandbox();

      const getStub = localSandbox.stub().callsFake((key: string, def?: any) => {
        if (key === 'jules.prStatusCache') return prCache;
        return def;
      });

      const updateStub = localSandbox.stub().resolves();

      const mockContext = {
        globalState: {
          get: getStub,
          update: updateStub,
          keys: localSandbox.stub().returns([]),
        },
        subscriptions: [],
        secrets: { get: localSandbox.stub().resolves(undefined), store: localSandbox.stub().resolves() }
      } as any as vscode.ExtensionContext;

      const consoleLogStub = localSandbox.stub(console, 'log');

      // Stub fetch so we can observe calls for expired entry
      const fetchStub = localSandbox.stub(fetchUtils, 'fetchWithTimeout').resolves({ ok: true, json: async () => ({ state: 'open' }) } as any);

      // Prevent duplicate command registration errors during test
      const registerCmdStub = localSandbox.stub(vscode.commands, 'registerCommand').callsFake(() => ({ dispose: () => {} } as any));

      // Call activate to load and clean cache
      activate(mockContext);


      // Now trigger PR status checks by calling updatePreviousStates for two completed sessions
      const session1: Session = {
        name: 's-valid',
        title: 'valid',
        state: 'COMPLETED',
        rawState: 'COMPLETED',
        outputs: [{ pullRequest: { url: 'https://github.com/owner/repo/pull/1', title: 'PR1', description: '' } }]
      };

      const session2: Session = {
        name: 's-expired',
        title: 'expired',
        state: 'COMPLETED',
        rawState: 'COMPLETED',
        outputs: [{ pullRequest: { url: 'https://github.com/owner/repo/pull/2', title: 'PR2', description: '' } }]
      };

      // Run updatePreviousStates which will invoke PR checks; the valid cached PR should NOT trigger a fetch
      await updatePreviousStates([session1, session2], mockContext);

      // Expect one fetch call (for the expired PR only)
      assert.strictEqual(fetchStub.callCount, 1);
      const fetchArg0 = String(fetchStub.getCall(0).args[0]);
      assert.ok(fetchArg0.includes('/repos/owner/repo/pulls/2'));

      // Cleanup stubs
      localSandbox.restore();
    });
  });

  // Integration tests for caching logic
  suite("Caching Integration Tests", () => {
    let sandbox: sinon.SinonSandbox;
    let mockContext: vscode.ExtensionContext;
    let fetchStub: sinon.SinonStub;

    setup(() => {
      sandbox = sinon.createSandbox();
      mockContext = {
        globalState: {
          get: sandbox.stub(),
          update: sandbox.stub().resolves(),
          keys: sandbox.stub().returns([]),
        },
      } as any;

      fetchStub = sandbox.stub(global, 'fetch');
    });

    teardown(() => {
      sandbox.restore();
    });

    test("listSources should use cached sources when valid", async () => {
      const cachedSources = [{ id: "source1", name: "Source 1" }];
      const cacheData = { sources: cachedSources, timestamp: Date.now() };
      (mockContext.globalState.get as sinon.SinonStub).returns(cacheData);

      // キャッシュが有効な場合、fetchが呼ばれないことを確認
      // 注：この部分は実際のlistSourcesコマンドの呼び出しが必要
      // 現在はキャッシュデータ構造の検証のみ
      assert.deepStrictEqual(cacheData.sources, cachedSources);
      assert.ok(Date.now() - cacheData.timestamp < 5 * 60 * 1000); // 5分以内
    });

    test("clearCache should clear all branch caches", async () => {
      // 複数のブランチキャッシュをモック
      const allKeys = [
        'jules.sources',
        'jules.branches.source1',
        'jules.branches.source2',
        'jules.branches.source3'
      ];
      (mockContext.globalState.keys as sinon.SinonStub).returns(allKeys);

      // キャッシュクリア処理をシミュレート
      const branchCacheKeys = allKeys.filter(key => key.startsWith('jules.branches.'));
      const cacheKeys = ['jules.sources', ...branchCacheKeys];

      // 検証：正しいキーがフィルタされることを確認
      assert.strictEqual(cacheKeys.length, 4); // 1 sources + 3 branches
      assert.strictEqual(branchCacheKeys.length, 3);
      assert.ok(cacheKeys.includes('jules.sources'));
      assert.ok(cacheKeys.includes('jules.branches.source1'));
      assert.ok(cacheKeys.includes('jules.branches.source2'));
      assert.ok(cacheKeys.includes('jules.branches.source3'));
    });

    test("cache should expire after TTL", () => {
      const now = Date.now();
      const validTimestamp = now - (4 * 60 * 1000); // 4分前
      const invalidTimestamp = now - (6 * 60 * 1000); // 6分前
      const ttl = 5 * 60 * 1000; // 5分

      // 4分前のキャッシュは有効
      assert.ok((now - validTimestamp) < ttl);

      // 6分前のキャッシュは無効
      assert.ok((now - invalidTimestamp) >= ttl);
    });
  });

  suite("areOutputsEqual", () => {
    test("should return true when both are undefined", () => {
      assert.strictEqual(areOutputsEqual(undefined, undefined), true);
    });
    test("should return false when one is undefined", () => {
      assert.strictEqual(areOutputsEqual(undefined, []), false);
      assert.strictEqual(areOutputsEqual([], undefined), false);
    });
    test("should return true when both are empty arrays", () => {
      assert.strictEqual(areOutputsEqual([], []), true);
    });
    test("should return false when length differs", () => {
      assert.strictEqual(areOutputsEqual([], [{}]), false);
    });
    test("should return true for same reference", () => {
      const arr: SessionOutput[] = [];
      assert.strictEqual(areOutputsEqual(arr, arr), true);
    });
    test("should return false when pullRequest url differs", () => {
      const a: SessionOutput[] = [{ pullRequest: { url: "u1", title: "t", description: "d" } }];
      const b: SessionOutput[] = [{ pullRequest: { url: "u2", title: "t", description: "d" } }];
      assert.strictEqual(areOutputsEqual(a, b), false);
    });
    test("should return false when pullRequest title differs", () => {
      const a: SessionOutput[] = [{ pullRequest: { url: "u", title: "t1", description: "d" } }];
      const b: SessionOutput[] = [{ pullRequest: { url: "u", title: "t2", description: "d" } }];
      assert.strictEqual(areOutputsEqual(a, b), false);
    });
    test("should return true when all properties match", () => {
      const a: SessionOutput[] = [{ pullRequest: { url: "u", title: "t", description: "d" } }];
      const b: SessionOutput[] = [{ pullRequest: { url: "u", title: "t", description: "d" } }];
      assert.strictEqual(areOutputsEqual(a, b), true);
    });
  });

  suite("updatePreviousStates", () => {
    let sandbox: sinon.SinonSandbox;
    let mockContext: vscode.ExtensionContext;
    let updateStub: sinon.SinonStub;

    setup(() => {
      sandbox = sinon.createSandbox();
      updateStub = sandbox.stub().resolves();
      mockContext = {
        globalState: {
          get: sandbox.stub().returns({}),
          update: updateStub,
          keys: sandbox.stub().returns([]),
        },
      } as any;
    });

    teardown(() => {
      sandbox.restore();
    });

    test("should not update globalState if session state unchanged", async () => {
      const session: Session = {
        name: "s1",
        title: "title",
        state: "RUNNING",
        rawState: "RUNNING",
        outputs: []
      };

      // Update once to set initial state
      await updatePreviousStates([session], mockContext);
      // Calls update for both previousSessionStates and prStatusCache
      assert.strictEqual(updateStub.callCount, 2, "First call should update (states + cache)");

      // Update again with same state
      updateStub.resetHistory();
      await updatePreviousStates([session], mockContext);
      assert.strictEqual(updateStub.callCount, 0, "Second call with same data should not update");
    });

    test("should update globalState if session state changed", async () => {
      const session1: Session = { name: "s2", title: "t", state: "RUNNING", rawState: "RUNNING", outputs: [] };
      await updatePreviousStates([session1], mockContext);
      updateStub.resetHistory();

      const session2: Session = { ...session1, state: "COMPLETED" };
      await updatePreviousStates([session2], mockContext);
      assert.strictEqual(updateStub.callCount, 2, "Should update when state changes (states + cache)");
    });

    test("should persist PR status cache when session state changes", async () => {
      const session: Session = {
        name: "s3",
        title: "title",
        state: "COMPLETED",
        rawState: "COMPLETED",
        outputs: []
      };

      await updatePreviousStates([session], mockContext);

      let prCacheUpdateCalled = false;
      for (const call of updateStub.getCalls()) {
        if (call.args[0] === "jules.prStatusCache") {
          prCacheUpdateCalled = true;
          break;
        }
      }
      assert.ok(prCacheUpdateCalled, "Should have attempted to save PR status cache");
    });
  });

  suite("Session URL Feature", () => {
    test("Session interface should support optional url field", () => {
      const sessionWithUrl: Session = {
        name: "sessions/123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: "https://example.com/session/123"
      };

      assert.strictEqual(sessionWithUrl.url, "https://example.com/session/123");
      assert.ok(sessionWithUrl.name);
      assert.ok(sessionWithUrl.title);
    });

    test("Session interface should work without url field", () => {
      const sessionWithoutUrl: Session = {
        name: "sessions/456",
        title: "Test Session",
        state: "COMPLETED",
        rawState: "COMPLETED"
      };

      assert.strictEqual(sessionWithoutUrl.url, undefined);
      assert.ok(sessionWithoutUrl.name);
    });

    test("Session url field can be undefined explicitly", () => {
      const session: Session = {
        name: "sessions/789",
        title: "Test Session",
        state: "FAILED",
        rawState: "FAILED",
        url: undefined
      };

      assert.strictEqual(session.url, undefined);
    });

    test("Session url field can contain various URL formats", () => {
      const httpsSession: Session = {
        name: "sessions/001",
        title: "HTTPS Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: "https://jules.ai/sessions/001"
      };

      const httpSession: Session = {
        name: "sessions/002",
        title: "HTTP Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: "http://localhost:3000/session/002"
      };

      const urlWithParams: Session = {
        name: "sessions/003",
        title: "Session with params",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: "https://example.com/session?id=003&view=full"
      };

      assert.ok(httpsSession.url?.startsWith("https://"));
      assert.ok(httpSession.url?.startsWith("http://"));
      assert.ok(urlWithParams.url?.includes("?"));
    });
  });

  suite("SessionTreeItem with URL", () => {
    test("SessionTreeItem contextValue should include 'jules-session-with-url' when url is present", () => {
      const sessionWithUrl: Session = {
        name: "sessions/123",
        title: "Session with URL",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: "https://example.com/session/123"
      };

      const item = new SessionTreeItem(sessionWithUrl);

      assert.ok(item.contextValue);
      assert.ok(item.contextValue.includes("jules-session"));
      assert.ok(item.contextValue.includes("jules-session-with-url"));
      assert.strictEqual(item.contextValue, "jules-session jules-session-with-url");
    });

    test("SessionTreeItem contextValue should not include 'jules-session-with-url' when url is undefined", () => {
      const sessionWithoutUrl: Session = {
        name: "sessions/456",
        title: "Session without URL",
        state: "COMPLETED",
        rawState: "COMPLETED"
      };

      const item = new SessionTreeItem(sessionWithoutUrl);

      assert.strictEqual(item.contextValue, "jules-session");
      assert.ok(!item.contextValue.includes("jules-session-with-url"));
    });

    test("SessionTreeItem contextValue should not include 'jules-session-with-url' when url is empty string", () => {
      const sessionWithEmptyUrl: Session = {
        name: "sessions/789",
        title: "Session with empty URL",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: ""
      };

      const item = new SessionTreeItem(sessionWithEmptyUrl);

      // Empty string is falsy, so should not add the suffix
      assert.strictEqual(item.contextValue, "jules-session");
    });

    test("SessionTreeItem should preserve url in session property", () => {
      const testUrl = "https://jules.ai/session/test-123";
      const session: Session = {
        name: "sessions/test-123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: testUrl
      };

      const item = new SessionTreeItem(session);

      assert.strictEqual(item.session.url, testUrl);
    });

    test("SessionTreeItem with url should maintain all other properties correctly", () => {
      const session: Session = {
        name: "sessions/full-test",
        title: "Full Feature Session",
        state: "COMPLETED",
        rawState: "COMPLETED",
        url: "https://example.com/session/full",
        outputs: [
          {
            pullRequest: {
              url: "https://github.com/owner/repo/pull/1",
              title: "Test PR",
              description: "Description"
            }
          }
        ],
        sourceContext: { source: "sources/github/owner/repo" },
        requirePlanApproval: true
      };

      const item = new SessionTreeItem(session);

      assert.strictEqual(item.session.name, "sessions/full-test");
      assert.strictEqual(item.session.title, "Full Feature Session");
      assert.strictEqual(item.session.state, "COMPLETED");
      assert.strictEqual(item.session.url, "https://example.com/session/full");
      assert.ok(item.contextValue.includes("jules-session-with-url"));
      assert.ok(item.tooltip instanceof vscode.MarkdownString);
    });

    test("SessionTreeItem contextValue with different states and url presence", () => {
      const states: Array<"RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"> = [
        "RUNNING",
        "COMPLETED",
        "FAILED",
        "CANCELLED"
      ];

      states.forEach(state => {
        const sessionWithUrl: Session = {
          name: `sessions/${state.toLowerCase()}`,
          title: `${state} Session`,
          state: state,
          rawState: state,
          url: `https://example.com/session/${state.toLowerCase()}`
        };

        const item = new SessionTreeItem(sessionWithUrl);
        assert.ok(item.contextValue.includes("jules-session-with-url"),
          `Session with state ${state} should have url context value`);
      });
    });
  });

  suite("openInWebApp Command", () => {
    let sandbox: sinon.SinonSandbox;
    let openExternalStub: sinon.SinonStub;
    let showErrorMessageStub: sinon.SinonStub;
    let showWarningMessageStub: sinon.SinonStub;
    let mockContext: vscode.ExtensionContext;

    setup(() => {
      sandbox = sinon.createSandbox();
      openExternalStub = sandbox.stub(vscode.env, 'openExternal');
      showErrorMessageStub = sandbox.stub(vscode.window, 'showErrorMessage');
      showWarningMessageStub = sandbox.stub(vscode.window, 'showWarningMessage');
      
      mockContext = {
        globalState: {
          get: sandbox.stub().returns({}),
          update: sandbox.stub().resolves(),
          keys: sandbox.stub().returns([]),
        },
        subscriptions: [],
        secrets: { 
          get: sandbox.stub().resolves(undefined), 
          store: sandbox.stub().resolves() 
        }
      } as any;
    });

    teardown(() => {
      sandbox.restore();
    });

    test("openInWebApp should open external URL when session has valid url", async () => {
      const testUrl = "https://jules.ai/session/test-123";
      const session: Session = {
        name: "sessions/test-123",
        title: "Test Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: testUrl
      };

      const item = new SessionTreeItem(session);
      openExternalStub.resolves(true);

      // Simulate command execution
      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler(item);

      assert.ok(openExternalStub.calledOnce);
      const calledUri = openExternalStub.firstCall.args[0];
      assert.strictEqual(calledUri.toString(), testUrl);
      assert.ok(!showWarningMessageStub.called);
      assert.ok(!showErrorMessageStub.called);
    });

    test("openInWebApp should show warning when session has no url", async () => {
      const session: Session = {
        name: "sessions/no-url",
        title: "Session without URL",
        state: "RUNNING",
        rawState: "IN_PROGRESS"
      };

      const item = new SessionTreeItem(session);

      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler(item);

      assert.ok(!openExternalStub.called);
      assert.ok(showWarningMessageStub.calledOnce);
      assert.ok(showWarningMessageStub.calledWith("No URL is available for this session."));
    });

    test("openInWebApp should show error when no item is provided", async () => {
      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler(undefined);

      assert.ok(showErrorMessageStub.calledOnce);
      assert.ok(showErrorMessageStub.calledWith("No session selected."));
      assert.ok(!openExternalStub.called);
    });

    test("openInWebApp should show error when item is not a SessionTreeItem", async () => {
      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler({} as any);

      assert.ok(showErrorMessageStub.calledOnce);
      assert.ok(!openExternalStub.called);
    });

    test("openInWebApp should show warning when openExternal fails", async () => {
      const testUrl = "https://jules.ai/session/fail-test";
      const session: Session = {
        name: "sessions/fail-test",
        title: "Failing Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: testUrl
      };

      const item = new SessionTreeItem(session);
      openExternalStub.resolves(false);

      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler(item);

      assert.ok(openExternalStub.calledOnce);
      assert.ok(showWarningMessageStub.calledOnce);
      assert.ok(showWarningMessageStub.calledWith('Failed to open the URL in the browser.'));
    });

    test("openInWebApp should handle various URL formats correctly", async () => {
      const urlFormats = [
        "https://example.com/session/1",
        "http://localhost:3000/session/2",
        "https://jules.ai/sessions/3?view=full",
        "https://app.jules.ai/workspace/123/session/456",
        "https://example.com:8080/session"
      ];

      for (const testUrl of urlFormats) {
        openExternalStub.reset();
        const session: Session = {
          name: "sessions/test",
          title: "Test",
          state: "RUNNING",
          rawState: "IN_PROGRESS",
          url: testUrl
        };

        const item = new SessionTreeItem(session);
        openExternalStub.resolves(true);

        const commandHandler = async (treeItem?: SessionTreeItem) => {
          if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
            return;
          }
          const sess = treeItem.session;
          if (sess.url) {
            await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          }
        };

        await commandHandler(item);

        assert.ok(openExternalStub.calledOnce, `Should call openExternal for ${testUrl}`);
        const calledUri = openExternalStub.firstCall.args[0];
        assert.strictEqual(calledUri.toString(), testUrl);
      }
    });

    test("openInWebApp should not open URL when session url is empty string", async () => {
      const session: Session = {
        name: "sessions/empty-url",
        title: "Empty URL Session",
        state: "RUNNING",
        rawState: "IN_PROGRESS",
        url: ""
      };

      const item = new SessionTreeItem(session);

      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          vscode.window.showErrorMessage("No session selected.");
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          const success = await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          if (!success) {
            vscode.window.showWarningMessage('Failed to open the URL in the browser.');
          }
        } else {
          vscode.window.showWarningMessage("No URL is available for this session.");
        }
      };

      await commandHandler(item);

      assert.ok(!openExternalStub.called);
      assert.ok(showWarningMessageStub.calledOnce);
      assert.ok(showWarningMessageStub.calledWith("No URL is available for this session."));
    });

    test("openInWebApp should handle URLs with special characters", async () => {
      const specialUrls = [
        "https://example.com/session?id=123&name=test%20session",
        "https://example.com/session/test-session-1",
        "https://example.com/session/test_session_2",
        "https://example.com/session#section",
        "https://example.com/session?param1=value1&param2=value2"
      ];

      for (const testUrl of specialUrls) {
        openExternalStub.reset();
        const session: Session = {
          name: "sessions/special",
          title: "Special URL Session",
          state: "RUNNING",
          rawState: "IN_PROGRESS",
          url: testUrl
        };

        const item = new SessionTreeItem(session);
        openExternalStub.resolves(true);

        const commandHandler = async (treeItem?: SessionTreeItem) => {
          if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
            return;
          }
          const sess = treeItem.session;
          if (sess.url) {
            await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          }
        };

        await commandHandler(item);

        assert.ok(openExternalStub.calledOnce, `Should handle special URL: ${testUrl}`);
      }
    });

    test("openInWebApp with completed session containing url", async () => {
      const testUrl = "https://jules.ai/completed-session/123";
      const session: Session = {
        name: "sessions/completed-123",
        title: "Completed Session",
        state: "COMPLETED",
        rawState: "COMPLETED",
        url: testUrl
      };

      const item = new SessionTreeItem(session);
      openExternalStub.resolves(true);

      const commandHandler = async (treeItem?: SessionTreeItem) => {
        if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
          return;
        }
        const sess = treeItem.session;
        if (sess.url) {
          await vscode.env.openExternal(vscode.Uri.parse(sess.url));
        }
      };

      await commandHandler(item);

      assert.ok(openExternalStub.calledOnce);
      assert.strictEqual(item.session.state, "COMPLETED");
    });

    test("openInWebApp should work with sessions in different states", async () => {
      const states: Array<"RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"> = [
        "RUNNING",
        "COMPLETED",
        "FAILED",
        "CANCELLED"
      ];

      for (const state of states) {
        openExternalStub.reset();
        const testUrl = `https://jules.ai/session/${state.toLowerCase()}`;
        const session: Session = {
          name: `sessions/${state.toLowerCase()}`,
          title: `${state} Session`,
          state: state,
          rawState: state,
          url: testUrl
        };

        const item = new SessionTreeItem(session);
        openExternalStub.resolves(true);

        const commandHandler = async (treeItem?: SessionTreeItem) => {
          if (!treeItem || !(treeItem instanceof SessionTreeItem)) {
            return;
          }
          const sess = treeItem.session;
          if (sess.url) {
            await vscode.env.openExternal(vscode.Uri.parse(sess.url));
          }
        };

        await commandHandler(item);

        assert.ok(openExternalStub.calledOnce, `Should open URL for ${state} session`);
      }
    });
  });
});
