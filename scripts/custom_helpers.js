hexo.extend.tag.register("include_md", function () {
  const title = this.title.replace(/[^a-zA-Z\s-]/g, "");
  return `<div class="visual-image">
        <div class="visual-image-box">
            <image class="visual-image-deco" src="/blog/images/mawchu_logo_w.svg" />
            <div class="stroke">${title}</div>
            <div class="stroke">${title}</div>
            <div class="plain main-title">${title}</div>
            <div class="plain">．．．</div>
        </div>
    </div>`;
});
``