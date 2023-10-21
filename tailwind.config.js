export const BACKGROUND = "#080808";
export const FOREGROUND = "#bdbdbd";
export const BOLD = "#eeeeee";
export const CURSOR = "#9e9e9e";
export const CURSOR_TEXT = "#080808";
export const SELECTION = "#b2ceee";
export const SELECTION_TEXT = "#080808";
export const BLACK_NORMAL = "#323437";
export const RED_NORMAL = "#ff5454";
export const GREEN_NORMAL = "#8cc85f";
export const YELLOW_NORMAL = "#e3c78a";
export const BLUE_NORMAL = "#80a0ff";
export const PURPLE_NORMAL = "#cf87e8";
export const CYAN_NORMAL = "#79dac8";
export const WHITE_NORMAL = "#c6c6c6";
export const BLACK_BRIGHT = "#949494";
export const RED_BRIGHT = "#ff5189";
export const GREEN_BRIGHT = "#36c692";
export const YELLOW_BRIGHT = "#c2c292";
export const BLUE_BRIGHT = "#74b2ff";
export const PURPLE_BRIGHT = "#ae81ff";
export const CYAN_BRIGHT = "#85dc85";
export const WHITE_BRIGHT = "#e4e4e4";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      "red-bright": RED_BRIGHT,
      "green-bright": GREEN_BRIGHT,
    },
    extend: {
      fontFamily: {
        mono: "monospace",
      },
    },
  },
  plugins: [],
};
