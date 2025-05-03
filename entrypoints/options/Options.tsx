import React, { useEffect, useState } from 'react';
import { t } from '../../utils/i18n';

// 設定の型定義
interface EmailSettings {
  domain: string;
  format: 'random' | 'words';
  stringLength: number;
  wordPattern: string;
}

// スタイルの定義
const styles = {
  container: {
    padding: '20px 30px',
    maxWidth: '500px',
    margin: '0 auto',
    boxSizing: 'border-box' as const,
  },
  section: { marginBottom: '20px' },
  header: { fontSize: '2em', marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  numberInput: {
    width: '60px',
    padding: '4px 8px',
    marginLeft: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  radioLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  radio: { marginRight: '8px' },
  subSection: { marginLeft: '24px', marginTop: '8px' },
  hint: { fontSize: '14px', color: '#666', margin: '8px 0 0' },
  smallHint: { fontSize: '13px', color: '#666', margin: '4px 0 0' },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  successMessage: { marginLeft: '12px', color: 'green' },
};

export const Options: React.FC = () => {
  // デフォルト設定
  const defaultSettings: EmailSettings = {
    domain: '@example.com',
    format: 'random',
    stringLength: 12,
    wordPattern: '{word}_{word}',
  };

  // ステート
  const [domain, setDomain] = useState(defaultSettings.domain);
  const [format, setFormat] = useState<'random' | 'words'>(
    defaultSettings.format
  );
  const [stringLength, setStringLength] = useState(
    defaultSettings.stringLength
  );
  const [wordPattern, setWordPattern] = useState(defaultSettings.wordPattern);
  const [saved, setSaved] = useState(false);

  // 設定をロード
  useEffect(() => {
    loadSettings();
  }, []);

  // 設定を読み込む
  const loadSettings = () => {
    browser.storage.sync.get(defaultSettings).then((items) => {
      setDomain(items.domain);
      setFormat(items.format as 'random' | 'words');
      setStringLength(items.stringLength);
      setWordPattern(items.wordPattern);
    });
  };

  // 設定を保存
  const saveSettings = () => {
    const settings: EmailSettings = {
      domain,
      format,
      stringLength,
      wordPattern,
    };

    browser.storage.sync.set(settings).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };

  // 数値入力の処理
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 4 && value <= 30) {
      setStringLength(value);
    }
  };

  return (
    <div style={styles.container}>
      {/* ドメイン設定 */}
      <div style={styles.section}>
        <label style={styles.label}>{t('domainLabel')}:</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={styles.input}
        />
        <p style={styles.hint}>{t('domainHint')}</p>
      </div>

      {/* 形式設定 */}
      <div style={styles.section}>
        <label style={styles.label}>{t('formatLabel')}:</label>

        {/* ランダム文字列オプション */}
        <div style={{ marginBottom: '12px' }}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="random"
              checked={format === 'random'}
              onChange={() => setFormat('random')}
              style={styles.radio}
            />
            {t('randomDescription')}
          </label>

          {format === 'random' && (
            <div style={styles.subSection}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                {t('stringLengthLabel')}:
                <input
                  type="number"
                  min="4"
                  max="30"
                  value={stringLength}
                  onChange={handleNumberChange}
                  style={styles.numberInput}
                />
              </label>
            </div>
          )}
        </div>

        {/* 単語組み合わせオプション */}
        <div>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="format"
              value="words"
              checked={format === 'words'}
              onChange={() => setFormat('words')}
              style={styles.radio}
            />
            {t('wordsDescription')}
          </label>

          {format === 'words' && (
            <div style={styles.subSection}>
              <label style={{ display: 'block', marginBottom: '4px' }}>
                {t('patternLabel')}
              </label>
              <input
                type="text"
                value={wordPattern}
                onChange={(e) => setWordPattern(e.target.value)}
                style={styles.input}
              />
              <p style={styles.smallHint}>{t('patternHint')}</p>
            </div>
          )}
        </div>
      </div>

      {/* 保存ボタン */}
      <div style={styles.buttonContainer}>
        <button onClick={saveSettings} style={styles.button}>
          {t('saveButton')}
        </button>

        {saved && (
          <span style={styles.successMessage}>{t('savedMessage')}</span>
        )}
      </div>
    </div>
  );
};
