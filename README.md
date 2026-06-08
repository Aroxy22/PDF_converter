# PDFly — Free Online PDF Converter

**Powerful PDF tools that run entirely in your browser. Your files never leave your device — lightning fast, completely free.**

## ⚡ Features

### Conversion Tools
- **Image → PDF** — Convert JPG, PNG, WebP images to PDF documents with customizable page sizes and margins
- **PDF → Image** — Export every PDF page as JPG or PNG images at multiple resolution scales
- **Text → PDF** — Convert plain .txt files to formatted PDF documents with font customization
- **Merge PDFs** — Combine multiple PDFs into one single document
- **Split PDF** — Extract individual pages from a PDF file
- **Compress PDF** — Reduce PDF file size while keeping quality
- **PDF → Text** — Extract clean plain text from PDF files

### Special Features
- **✍️ Draw Signature** — Create professional digital signatures with 16+ color palettes and adjustable brush sizes. Download as PNG or SVG.

## 🔒 Privacy & Security

- **100% Browser-Based** — All processing happens locally in your browser
- **No Data Upload** — Your files never leave your device
- **Completely Free** — No hidden fees, no account needed
- **Works Offline** — Full functionality without internet connection

## 🚀 Tech Stack

- **Framework**: Vite v8.0.16
- **Language**: Vanilla JavaScript (ES6+)
- **Browser APIs**: Canvas 2D, File API, Blob API, localStorage
- **PDF Libraries**: pdf-lib, pdfjs, docx, mammoth
- **Styling**: CSS custom properties with modern design system

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd PDF\ MAKER
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5175/`

## 📁 Project Structure

```
src/
├── main.js                 # App router & state management
├── style.css              # Global styles
├── components/
│   └── toast.js          # Toast notification system
├── converters/            # Conversion logic
│   ├── imageToPdf.js
│   ├── pdfToImage.js
│   ├── textToPdf.js
│   ├── mergePdf.js
│   ├── splitPdf.js
│   ├── compressPdf.js
│   └── pdfToOthers.js
├── pages/
│   ├── home.js           # Landing page with tool grid
│   ├── converter.js      # Main converter orchestration
│   └── signature.js      # Signature drawing tool
└── utils/
    └── pdfSetup.js       # PDF library initialization
```

## 🎨 Signature Tool

The professional signature drawing tool features:
- **16+ Color Palettes** — Pre-set colors including black, blue, red, green, purple, orange, cyan, magenta, and more
- **Custom Colors** — Color picker for unlimited palette options
- **Adjustable Brush Size** — 1-10px brush control
- **Undo & Clear** — Easy stroke management
- **Multiple Exports** — Download as PNG or SVG format

## 💾 Data Management

- **File Caching** — Browser cache stores file metadata for 10 minutes of inactivity
- **Auto-Cleanup** — Cached files automatically clear after inactivity timeout
- **localStorage** — Metadata-only caching, no binary data stored

## 🛠️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 📊 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 💡 Tips

- **Batch Operations** — Most tools support multiple file uploads for efficient batch processing
- **Resolution Options** — PDF to Image offers standard, high detail, and ultra HD export options
- **File Size** — Use Compress PDF to reduce large PDFs before sharing
- **Signature Security** — Download and store signatures locally for important documents

## 🐛 Troubleshooting

### Large files not processing?
- Try splitting the PDF first or compressing it
- Refresh the page and try again

### Color not changing in signature?
- Ensure you click the color swatch or custom color picker
- The currently selected color will show a blue highlight ring

### Download not working?
- Check browser security settings
- Ensure pop-ups are not blocked
- Try a different browser if issues persist

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub or contact support.

---

**Made with ❤️ for everyone** — PDFly | Free Online PDF Tools
