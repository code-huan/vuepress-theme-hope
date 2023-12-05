import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "JackHuan博客",
  description: "vuepress-theme-hope 的文档演示",
  theme,
  //sidebar headerDepth
  markdown: {
    headers: {
      level: [2,3,4,5,6],
    }
  }

  // Enable it with pwa
  // shouldPrefetch: false,
});
