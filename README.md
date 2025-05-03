# Random Email Generator

Random Email Generator is a browser extension that quickly inserts random email addresses into forms. It's useful for web testing and service registrations.

[日本語はこちら](/README_JA.md)

## Features

- Generate and insert email addresses via right-click menu
- Customizable email formats:
  - Random string (e.g., a7b2c9d3@example.com)
  - Word combinations (e.g., apple_banana@example.com)
- Customizable domain names
- String length settings
- Word pattern customization

## How to Use

1. Install the extension
2. Right-click on any form field where you want to enter an email address
3. Select "Generate Random Email" from the menu
4. An email address based on your settings will be automatically inserted

## Settings

Open the settings page by clicking on the extension icon or through the browser's extension management page.

You can configure the following options:

- **Email Domain**: The domain part of the generated email address (e.g., example.com)
- **Email Format**:
  - **Random**: Generates a random string (e.g., a7b2c9d3@example.com)
  - **Word Combination**: Generates an email using random words (e.g., apple_banana@example.com)
- **String Length**: Number of characters for random format
- **Word Pattern**: Pattern for word combination format (where {word} will be replaced with random words)

## Development

This project is developed using [WXT](https://wxt.dev/).

### Requirements

- Node.js
- pnpm

### Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build

```bash
# Production build
pnpm build
```

## Note

Most of the code in this project was written using AI assistance.

## License

MIT 
