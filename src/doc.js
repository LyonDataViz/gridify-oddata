export function doc(raw) {
  let docstring = `<div
    style="background:#fff; border: 2px solid #000; max-width:640px; width: 100%; padding: 10px 20px; box-sizing: border-box; max-height: 420px; overflow-y: scroll; font-size: 80%;"
    ><h3>${raw.name}</h3> ${raw.description}`;
  if (raw.author) docstring += `<p><em>by ${raw.author}</em></p>`;
  if (raw.meta) {
    docstring += `<h4>Meta:</h4> <ol>${Object.keys(raw.meta)
      .map(k => `<li><strong>${k}</strong>: ${raw.meta[k]} </li>`)
      .join('')}</ol>`;
  }
  if (raw.attributes) {
    docstring += `<h4>Attributes:</h4> <ol>${raw.attributes
      .map(d => `<li><strong>${d.name}</strong>: ${d.type} </li>`)
      .join('')}</ol>`;
  }
  if (raw.source) docstring += `<p><em>Source: ${raw.source}</em></p>`;
  docstring += `</div>`;
  return docstring;
}
