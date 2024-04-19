hexo.extend.tag.register("include_md", function () {
  const title = this.title.replace(/[^a-zA-Z\s-]/g, "");
  return `<div class="visual-image">
        <div class="visual-image-box">
            <image class="visual-image-deco" src="/blog/images/mawchu_logo_w.svg" />
            <div>${title}</div>
            <div>${title}</div>
            <div>${title}</div>
            <div>．．．</div>
        </div>
    </div>`;
});
