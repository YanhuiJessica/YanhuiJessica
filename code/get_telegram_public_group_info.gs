function doGet(e) {
  let content;
  if (e) {
    let url = e.parameter.url;
    let html = UrlFetchApp.fetch(url).getContentText();

    // https://stackoverflow.com/a/63532711/13542937
    html = html.replace(/(<(?=link|meta|br|input|img)[^>]*)(?<!\/)>/ig, '$1/>');
    html = html.replace(/(<(script|style)[^>]*>)/ig, '$1<![CDATA[').replace(/(<\/(script|style)[^>]*>)/ig, ']]>$1');
    html = html.replace(/&(?!amp;)/g, '&amp;');

    let root = XmlService.parse(html).getRootElement().getChild("body");
    let name = root.getChildren("div")[1].getChildren("div")[1].getChild("div").getChildren("div")[1].getChild("span").getText();
    let member = root.getChildren("div")[1].getChildren("div")[1].getChild("div").getChildren("div")[2].getText();
    content = {
      "name": name,
      "member_cnt": member
    };
  } else {
    content = {"error": "empty url!"};
  }

  return ContentService.createTextOutput(JSON.stringify(content)).setMimeType(ContentService.MimeType.JSON);
}
