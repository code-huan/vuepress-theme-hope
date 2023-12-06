import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

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
  },
  plugins: [
    searchProPlugin({
      // 索引全部内容 true
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
