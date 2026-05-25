const path = require("node:path");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

const publicDir = path.join(__dirname, "public");
const staticOptions = {
  index: "index.html",
  extensions: ["html"],
  maxAge: "1h",
};

app.get("/health", (_req, res) => res.status(200).send("ok"));

const logoSvg = `<?xml version="1.0" encoding="utf-8" ?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="754" height="717" viewBox="0 0 754 717"><clipPath id="cl_3"><rect width="754" height="717"/></clipPath><g clip-path="url(#cl_3)"><path transform="translate(-147 0)" d="M655.747 118.708C660.818 117.954 679.625 118.316 685.11 118.543C685.272 124.633 684.908 132.099 684.905 138.451L684.674 205.57L684.744 246.255C684.774 250.939 685.297 263.822 684.596 267.675C684.196 267.624 683.795 267.575 683.394 267.531C648.994 263.712 605.781 273.498 576.138 291.051C564.031 298.221 552.709 307.552 541.71 316.292C577.596 315.825 613.624 316.75 649.526 316.393C661.292 316.276 673.327 316.241 685.087 316.537L684.898 403.67C684.919 425.031 685.431 448.281 684.946 469.499C670.351 470.076 651.928 469.571 637.108 469.567L542.477 469.479C541.82 428.264 542.828 386.769 542.435 345.532C542.346 336.106 542.894 326.13 541.921 316.796C507.64 347.185 485.979 389.308 481.206 434.87C479.168 452.528 479.946 472.794 479.941 490.884L479.875 581.372C479.844 586.875 480.646 616.797 478.749 619.884C475.221 620.496 468.845 620.242 464.986 620.253L440.634 620.321C407.441 620.404 372.627 619.71 339.612 620.471C339.406 610.614 339.824 598.991 339.819 588.884L339.841 506.694C339.885 482.287 339.015 448.042 340.904 424.346C346.897 352.457 375.929 284.422 423.683 230.353C465.443 182.392 526.56 143.367 588.46 127.979C610.958 122.386 632.738 120.27 655.747 118.708Z"/></g></svg>`;
app.get("/favicon.svg", (_req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(logoSvg);
});
app.get("/favicon.ico", (_req, res) => res.redirect(301, "/favicon.svg"));
app.get("/logo.svg", (_req, res) => {
  res.set("Content-Type", "image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.send(logoSvg);
});

// /docs 경로로 들어오는 요청은 새 루트로 영구 리다이렉트 (기존 북마크/링크 호환).
app.use((req, res, next) => {
  if (req.path === "/docs" || req.path.startsWith("/docs/")) {
    const target = req.originalUrl.replace(/^\/docs(\/|$)/, "/");
    return res.redirect(301, target);
  }
  next();
});

app.use("/storybook", express.static(path.join(publicDir, "storybook"), staticOptions));
app.use("/", express.static(path.join(publicDir, "docs"), staticOptions));

app.use((_req, res) => res.status(404).send("Not Found"));

app.listen(port, () => {
  console.log(`[web-server] listening on ${port}`);
});
