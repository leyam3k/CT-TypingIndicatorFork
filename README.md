# CT-TypingIndicatorFork

A SillyTavern extension that displays a stylish "Waiting for [character name]..." typing indicator while the AI generates a response. This is a Cozy Tavern fork with enhanced visual styling.

## Features

- **Animated Typing Indicator**: Shows a "Waiting for [character name]..." message with animated dots while waiting for AI responses
- **High-Visibility Design**: Features a neon glow effect with purple accents that pulses smoothly
- **Configurable Options**:
  - Enable/disable the indicator entirely
  - Option to show the indicator even when streaming is enabled
- **Smart Behavior**:
  - Automatically hides during quiet prompts and impersonation
  - Respects group chat legacy indicator settings
  - Auto-scrolls to keep the indicator visible

## Installation and Usage

### Installation

Use SillyTavern's built-in extension installer:

1. Open SillyTavern
2. Navigate to Extensions → Install Extension
3. Enter the repository URL: `https://github.com/leyam3k/CT-TypingIndicatorFork`
4. Click Install

Alternatively, clone directly into your extensions folder:

```bash
cd SillyTavern/public/scripts/extensions/third-party/
git clone https://github.com/leyam3k/CT-TypingIndicatorFork
```

### Usage

1. After installation, go to **Extensions** in SillyTavern
2. Find **Typing Indicator** in the extension list
3. Check **Enabled** to activate the indicator
4. Optionally check **Show if streaming** to display the indicator during streamed responses

## Prerequisites

- SillyTavern 1.12.0 or later

## Visual Style

The indicator features a distinctive Cozy Tavern aesthetic:

- Semi-transparent purple background with high contrast white text
- Animated neon glow effect that pulses between soft and bright
- Pastel-colored animated dots
- Sticky positioning at the bottom of the chat window
- Uses the 'Rubik Mono One' monospace font for a clean look

## Support and Contributions

For support, please open an issue on the [GitHub repository](https://github.com/leyam3k/CT-TypingIndicatorFork).

Contributions are welcome! Feel free to submit pull requests for bug fixes or new features.

## License

MIT License
