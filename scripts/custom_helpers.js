hexo.extend.tag.register('include_md', function() {
    const title = this.title.replace(/[^a-zA-Z\s-]/g, '');
    return `<div class="visual-image">
        <div class="visual-image-box">
            <div>${title}</div>
            <div>${title}</div>
            <div>${title}</div>
            <div>．．．</div>
        </div>
    </div>`
});