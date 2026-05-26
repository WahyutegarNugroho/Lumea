import fs from 'fs';

for (const [file, lang] of [
  ['dist/image/converter/index.html', 'en'],
  ['dist/id/image/converter/index.html', 'id'],
  ['dist/es/image/converter/index.html', 'es'],
]) {
  const html = fs.readFileSync(file, 'utf8');
  const body = html.substring(html.indexOf('<body'), html.indexOf('</body>'));
  const pattern = /<a\s[^>]*class="[^"]*inline-flex[^"]*gap-2[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = pattern.exec(body)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    console.log(lang + ': Back button text = "' + text + '"');
  }
}
