import { t } from '../utils/i18n';

// 設定キーの型定義
type SettingKey = 'domain' | 'format' | 'stringLength' | 'wordPattern';

type InsertEmailMessage = {
  action: 'insertRandomEmail';
};

type UpdateSettingsMessage = {
  action: 'updateSettings';
  domain?: string;
  format?: 'random' | 'words';
  stringLength?: number;
  wordPattern?: string;
};

// メッセージ型の合成
type Message = InsertEmailMessage | UpdateSettingsMessage;

export default defineBackground(() => {
  console.log(
    'ランダムメールジェネレーター: バックグラウンドスクリプト初期化',
    { id: browser.runtime.id }
  );

  // 初期化処理
  initializeContextMenu();
  setupEventListeners();

  /**
   * コンテキストメニューの初期化
   */
  function initializeContextMenu(): void {
    browser.contextMenus.create({
      id: 'insert-random-email',
      title: t('insertRandomEmail'),
      contexts: ['editable'],
      documentUrlPatterns: ['*://*/*'], // chrome:// URLでは表示しない
    });
  }

  /**
   * イベントリスナーの設定
   */
  function setupEventListeners(): void {
    // コンテキストメニューのクリックイベント
    browser.contextMenus.onClicked.addListener(handleContextMenuClick);

    // ブラウザアクションのクリックイベント
    browser.action.onClicked.addListener(handleBrowserActionClick);

    // ストレージ変更イベント
    browser.storage.onChanged.addListener(handleStorageChanged);
  }

  /**
   * コンテキストメニューのクリックを処理
   */
  function handleContextMenuClick(
    info: Browser.contextMenus.OnClickData,
    tab?: Browser.tabs.Tab
  ): void {
    if (info.menuItemId === 'insert-random-email' && tab?.id) {
      const message: InsertEmailMessage = { action: 'insertRandomEmail' };
      sendMessageToTab(tab.id, message);
    }
  }

  /**
   * ブラウザアクションのクリックを処理
   */
  function handleBrowserActionClick(): void {
    browser.runtime.openOptionsPage();
  }

  /**
   * ストレージの変更を処理
   */
  function handleStorageChanged(
    changes: Record<string, Browser.storage.StorageChange>,
    areaName: string
  ): void {
    if (areaName !== 'sync') return;

    const settingKeys: SettingKey[] = [
      'domain',
      'format',
      'stringLength',
      'wordPattern',
    ];
    const updateMessage: UpdateSettingsMessage = { action: 'updateSettings' };
    let hasChanges = false;

    // 変更された設定を確認
    for (const key of settingKeys) {
      if (changes[key]) {
        const newValue = changes[key].newValue;
        console.log(`設定の変更: ${key} =`, newValue);
        updateMessage[key] = newValue;
        hasChanges = true;
      }
    }

    // 変更があれば全タブに通知
    if (hasChanges) {
      notifyAllTabs(updateMessage);
    }
  }

  /**
   * 特定のタブにメッセージを送信
   */
  function sendMessageToTab(tabId: number, message: Message): void {
    try {
      browser.tabs.sendMessage(tabId, message);
    } catch (error) {
      console.error(`タブ ${tabId} へのメッセージ送信エラー:`, error);
    }
  }

  /**
   * すべてのタブにメッセージを送信
   */
  function notifyAllTabs(message: Message): void {
    browser.tabs.query({}).then((tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          sendMessageToTab(tab.id, message);
        }
      });
    });
  }
});
