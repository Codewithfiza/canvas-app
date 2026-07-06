# 🎨 Sketchboard — Drawing Canvas

A minimal, responsive drawing app built with vanilla HTML, CSS, and JavaScript. Draw freehand with a pen, erase mistakes, add shapes, and save your artwork as a PNG — all in the browser, no libraries required.



## ✨ Features

- **Freehand Pen Tool** — smooth, round-cap strokes that follow your cursor or finger
- **Eraser Tool** — erase parts of your drawing without clearing everything
- **Shape Tools** — draw straight lines, rectangles, and circles with live preview as you drag
- **Custom Colour Picker** — pick any colour for your strokes
- **Adjustable Brush Size** — from 1px to 60px
- **Clear Canvas** — wipe the board clean in one click
- **Download as PNG** — export your sketch with a flattened white background, ready to share
- **Touch Support** — fully responsive and usable on mobile/tablet
- **Responsive Layout** — toolbar shifts from a side rail (desktop) to a bottom bar (mobile)

## 🛠️ Built With

- HTML5 `<canvas>` API
- CSS3 (custom properties, flexbox, responsive media queries)
- Vanilla JavaScript (no frameworks, no dependencies)



## 🚀 Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/codewithfiza/sketchboard.git
   ```
2. Open `index.html` in your browser — that's it, no build step needed.

## 🧠 What I Learned

- Working with the Canvas API and 2D rendering context
- Handling mouse **and** touch events for cross-device drawing
- Using `getImageData` / `putImageData` to build live shape previews without leaving a trail
- Flattening a transparent canvas onto a white background before export
- Structuring a responsive toolbar that adapts between desktop and mobile layouts

## 📂 Project Structure

```
sketchboard/
├── index.html
├── style.css
├── app.js
└── README.md
```

## 🔮 Future Improvements

- Undo / redo history
- More shape tools (triangle, arrow, text)
- Layers support
- Save/load drawings locally

## 👩‍💻 Author

fiza [GitHub](https://github.com/codewithfiza)

---

⭐ If you like this project, consider giving it a star!
