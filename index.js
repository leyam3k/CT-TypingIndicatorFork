import {
  name2,
  eventSource,
  event_types,
  isStreamingEnabled,
  saveSettingsDebounced,
} from "../../../../script.js";
import { extension_settings } from "../../../extensions.js";
import { selected_group } from "../../../group-chats.js";
import { t } from "../../../i18n.js";

const MODULE = "typing_indicator";
const legacyIndicatorTemplate = document.getElementById(
  "typing_indicator_template"
);

/**
 * @typedef {Object} TypingIndicatorSettings
 * @property {boolean} enabled
 * @property {boolean} streaming
 */

/**
 * @type {TypingIndicatorSettings}
 */
const defaultSettings = {
  enabled: false,
  streaming: false,
};

function getSettings() {
  if (extension_settings[MODULE] === undefined) {
    extension_settings[MODULE] = structuredClone(defaultSettings);
  }
  for (const key in defaultSettings) {
    if (extension_settings[MODULE][key] === undefined) {
      extension_settings[MODULE][key] = defaultSettings[key];
    }
  }
  return extension_settings[MODULE];
}

function addExtensionSettings(settings) {
  const settingsContainer =
    document.getElementById("typing_indicator_container") ??
    document.getElementById("extensions_settings");
  if (!settingsContainer) return;

  const inlineDrawer = document.createElement("div");
  inlineDrawer.classList.add("inline-drawer");
  settingsContainer.append(inlineDrawer);

  const inlineDrawerToggle = document.createElement("div");
  inlineDrawerToggle.classList.add(
    "inline-drawer-toggle",
    "inline-drawer-header"
  );

  const extensionName = document.createElement("b");
  extensionName.textContent = t`Typing Indicator`;

  const inlineDrawerIcon = document.createElement("div");
  inlineDrawerIcon.classList.add(
    "inline-drawer-icon",
    "fa-solid",
    "fa-circle-chevron-down",
    "down"
  );

  inlineDrawerToggle.append(extensionName, inlineDrawerIcon);

  const inlineDrawerContent = document.createElement("div");
  inlineDrawerContent.classList.add("inline-drawer-content");
  inlineDrawer.append(inlineDrawerToggle, inlineDrawerContent);

  // Enabled toggle
  const enabledLabel = document.createElement("label");
  enabledLabel.classList.add("checkbox_label");
  enabledLabel.htmlFor = "typingIndicatorEnabled";
  const enabledInput = document.createElement("input");
  enabledInput.id = "typingIndicatorEnabled";
  enabledInput.type = "checkbox";
  enabledInput.checked = settings.enabled;
  enabledInput.addEventListener("change", () => {
    settings.enabled = enabledInput.checked;
    saveSettingsDebounced();
  });
  const enabledText = document.createElement("span");
  enabledText.textContent = t`Enabled`;
  enabledLabel.append(enabledInput, enabledText);
  inlineDrawerContent.append(enabledLabel);

  // Show-if-streaming toggle
  const streamingLabel = document.createElement("label");
  streamingLabel.classList.add("checkbox_label");
  streamingLabel.htmlFor = "typingIndicatorShowIfStreaming";
  const streamingInput = document.createElement("input");
  streamingInput.id = "typingIndicatorShowIfStreaming";
  streamingInput.type = "checkbox";
  streamingInput.checked = settings.streaming;
  streamingInput.addEventListener("change", () => {
    settings.streaming = streamingInput.checked;
    saveSettingsDebounced();
  });
  const streamingText = document.createElement("span");
  streamingText.textContent = t`Show if streaming`;
  streamingLabel.append(streamingInput, streamingText);
  inlineDrawerContent.append(streamingLabel);
}

function showTypingIndicator(type, _args, dryRun) {
  const settings = getSettings();
  const noIndicatorTypes = ["quiet", "impersonate"];
  if (noIndicatorTypes.includes(type) || dryRun) return;
  if (
    !settings.enabled ||
    !name2 ||
    (!settings.streaming && isStreamingEnabled())
  )
    return;
  if (legacyIndicatorTemplate && selected_group && !isStreamingEnabled())
    return;

  // Build the new "Waiting for ..." text + SVG animation
  const text = t`Waiting for ${name2}`;
  const svgAnimation = `
        <span class="svg_dots">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 30 16" fill="var(--SmartThemeBodyColor)">
                <style>
                .dot-fade-1 { animation: fade 1.5s ease-in-out 0s infinite; }
                .dot-fade-2 { animation: fade 1.5s ease-in-out 0.3s infinite; }
                .dot-fade-3 { animation: fade 1.5s ease-in-out 0.6s infinite; }
                    @keyframes fade {
                        0%,100% { opacity: 0.2; }
                        50%      { opacity: 1;   }
                    }
                </style>
                <circle class="dot-fade-1" cx="5"  cy="8" r="3"/>
                <circle class="dot-fade-2" cx="15" cy="8" r="3"/>
                <circle class="dot-fade-3" cx="25" cy="8" r="3"/>
            </svg>
        </span>
    `;
  const htmlContent = `${text}&nbsp;${svgAnimation}`;

  const existing = document.getElementById("typing_indicator");
  if (existing) {
    existing.innerHTML = htmlContent;
    return;
  }

  const indicator = document.createElement("div");
  indicator.id = "typing_indicator";
  indicator.classList.add("typing_indicator");
  indicator.innerHTML = htmlContent;
  $(indicator).hide();

  const chat = document.getElementById("chat");
  if (chat) {
    chat.appendChild(indicator);
    const atBottom =
      Math.ceil(chat.scrollTop + chat.clientHeight) >= chat.scrollHeight;
    $(indicator).show(() => {
      if (!atBottom) return;
      const style = getComputedStyle(indicator);
      const offset = parseInt(style.bottom) + parseInt(style.marginBottom);
      chat.scrollTop += indicator.clientHeight + offset;
    });
  }
}

function hideTypingIndicator() {
  const indicator = document.getElementById("typing_indicator");
  if (indicator) {
    $(indicator).hide(() => indicator.remove());
  }
}

(function () {
  const settings = getSettings();
  addExtensionSettings(settings);

  const showEvents = [event_types.GENERATION_AFTER_COMMANDS];
  const hideEvents = [
    event_types.GENERATION_STOPPED,
    event_types.GENERATION_ENDED,
    event_types.CHAT_CHANGED,
  ];

  showEvents.forEach((e) => eventSource.on(e, showTypingIndicator));
  hideEvents.forEach((e) => eventSource.on(e, hideTypingIndicator));
})();
