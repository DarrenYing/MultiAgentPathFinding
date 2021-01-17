function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
    );
    obj.dispatchEvent(ev);
}

function download(data, name) {
    var urlObject = window.URL || window.webkitURL || window;

    var downloadData = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(downloadData);
    save_link.download = name;
    fake_click(save_link);
}

function saveToFile(data, filename) {
    let MIME_TYPE = "text/json";
    if (!data) return;
    if (!filename) filename = "console.json";
    if (typeof data === "object") data = JSON.stringify(data, null, 4);

    let blob = new Blob([data], { tyoe: MIME_TYPE });
    // 创建事件
    let e = document.createEvent("MouseEvent");
    // 创建一个a链接
    let a = document.createElement("a");
    // 设置a链接下载文件的名称
    a.download = filename;
    // 创建下载的URL对象（blob或者file）
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(":");
    // 初始化事件
    e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // 触发事件
    a.dispatchEvent(e);
}
//调用方法
// download("data", "save.txt");
