import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "文档",
      icon: "book",
      prefix: "mydocs/",
      link: "mydocs/",
      children: "structure",
    },
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "examples/",
      link: "examples/",
      children: "structure",
    },
    //"slides",
  ],
});
