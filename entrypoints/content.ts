import { generate } from 'random-words';

// 設定の型定義
interface EmailGeneratorConfig {
  domain: string;
  format: 'random' | 'words';
  stringLength: number;
  wordPattern: string;
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Random Email Generator content script loaded');

    // デフォルト設定
    const defaultConfig: EmailGeneratorConfig = {
      domain: '@example.com',
      format: 'random',
      stringLength: 12,
      wordPattern: '{word}_{word}',
    };

    // 現在の設定
    let config: EmailGeneratorConfig = { ...defaultConfig };

    // 設定を読み込む
    loadSettings();

    /**
     * ストレージから設定を読み込む
     */
    function loadSettings() {
      browser.storage.sync.get(defaultConfig).then((items) => {
        config = items as EmailGeneratorConfig;
        console.log('設定をロードしました:', config);
      });
    }

    /**
     * ランダムな文字列を生成する
     */
    function generateRandomString(length: number): string {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }

      return result;
    }

    /**
     * 長さが4文字以上のランダムな単語を生成する
     */
    function generateLongerWord(): string {
      let word = '';
      // 4文字以上の単語が得られるまで再試行
      while (word.length <= 3) {
        const words = generate(1);
        word = words[0];
      }
      return word;
    }

    /**
     * パターン内の{word}をランダムな単語に置き換える
     */
    function generateFromPattern(pattern: string): string {
      // {word}の数を数える
      const wordMatches = pattern.match(/{word}/g);
      if (!wordMatches) return pattern;

      // パターン内の{word}を順番に置き換える
      let result = pattern;
      for (let i = 0; i < wordMatches.length; i++) {
        const word = generateLongerWord();
        result = result.replace('{word}', word);
      }

      return result;
    }

    /**
     * 設定に基づいてランダムなメールアドレスを生成する
     */
    function generateRandomEmail(): string {
      let username = '';

      if (config.format === 'words') {
        username = generateFromPattern(config.wordPattern);
      } else {
        username = generateRandomString(config.stringLength);
      }

      return `${username}${config.domain}`;
    }

    /**
     * アクティブな入力フィールドにメールアドレスを挿入する
     */
    function insertEmailToActiveElement(): void {
      const activeElement = document.activeElement as HTMLInputElement;

      // フォーカスされた要素がテキスト入力かチェック
      if (!isValidInputElement(activeElement)) {
        console.log('有効な入力フィールドが見つかりません');
        return;
      }

      const randomEmail = generateRandomEmail();
      console.log('生成されたメールアドレス:', randomEmail);

      // 値を設定して入力イベントを発火
      activeElement.value = randomEmail;
      triggerInputEvents(activeElement);
    }

    /**
     * 要素が有効な入力フィールドかどうかを判定する
     */
    function isValidInputElement(
      element: Element | null
    ): element is HTMLInputElement {
      return (
        !!element &&
        (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') &&
        (element as HTMLInputElement).isContentEditable !== true
      );
    }

    /**
     * 入力イベントを発火させてフォームのバリデーションを更新する
     */
    function triggerInputEvents(element: HTMLInputElement): void {
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * 設定を更新する
     */
    function updateConfig(updates: Partial<EmailGeneratorConfig>): void {
      Object.assign(config, updates);

      // デバッグログ
      Object.entries(updates).forEach(([key, value]) => {
        console.log(`${key}を更新しました:`, value);
      });
    }

    // メッセージリスナーを設定
    browser.runtime.onMessage.addListener((message) => {
      console.log('メッセージを受信:', message);

      if (message.action === 'insertRandomEmail') {
        insertEmailToActiveElement();
      } else if (message.action === 'updateSettings') {
        updateConfig(message);
      }
    });
  },
});
