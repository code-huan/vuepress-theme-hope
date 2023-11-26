import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "JackHuan博客",
  description: "vuepress-theme-hope 的文档演示",
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
