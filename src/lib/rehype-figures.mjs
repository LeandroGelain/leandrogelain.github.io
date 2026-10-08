// Parágrafo que contém só imagens vira uma galeria de <figure>.
// Legenda = title da imagem:  ![alt](./img.png "Legenda")
// A classe indica quantas imagens há (figures-1, figures-2, …) para o CSS ajustar a grade.

const isBlank = (n) => n.type === 'text' && !n.value.trim();
const isImg = (n) => n.type === 'element' && n.tagName === 'img';

export default function rehypeFigures() {
  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      if (child.type === 'element' && child.tagName === 'p' && child.children.some(isImg) && child.children.every((c) => isImg(c) || isBlank(c))) {
        const imgs = child.children.filter(isImg);
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['figures', `figures-${Math.min(imgs.length, 5)}`] },
          children: imgs.map((img) => {
            const caption = img.properties?.title;
            if (img.properties) delete img.properties.title;
            return {
              type: 'element',
              tagName: 'figure',
              properties: {},
              children: caption
                ? [img, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(caption) }] }]
                : [img],
            };
          }),
        };
      }
      visit(child);
      return child;
    });
  };
  return (tree) => visit(tree);
}
