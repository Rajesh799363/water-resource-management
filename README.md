# Water Resource Management System v2.0

🌊 A professional water storage monitoring and analytics platform built with vanilla JavaScript, HTML5, and CSS3.

## 🚀 Quick Start

### Method 1: Direct Usage
1. Download the zip file and extract it
2. Open `enhanced-index.html` in your web browser
3. Start adding water sources and logging data!

### Method 2: Development Server
```bash
npm install
npm run dev
```

## 📋 Features

### Enhanced Version (v2.0)
- **📊 Dashboard**: Real-time statistics and analytics
- **🚨 Alert System**: Automated notifications for critical conditions
- **📤 Data Management**: Export/import functionality with backup
- **📈 Advanced Charts**: Multi-source visualization with Chart.js
- **⚙️ Settings Panel**: Customizable thresholds and units
- **📱 Responsive Design**: Mobile-first CSS with modern layout
- **🌙 Dark Mode**: Automatic theme switching
- **📝 Report Generation**: Automated Markdown reports

### Core Functionality
- **Multi-Source Management**: Reservoirs, lakes, rivers, groundwater, tanks
- **Daily Data Logging**: Inflow, outflow, rainfall, demand tracking
- **Storage Calculations**: Automatic balance calculations with rainfall
- **Local Storage**: Browser-based data persistence

## 📁 File Structure

```
water-resource-management-v2/
├── enhanced-index.html      # Enhanced UI (recommended)
├── enhanced-app.js          # Advanced JavaScript features
├── enhanced-style.css       # Modern responsive CSS
├── index.html              # Original simple version
├── app.js                  # Original JavaScript
├── style.css               # Original CSS
├── config.json             # Application configuration
├── package.json            # Node.js project setup
├── README.md              # This file
├── CHANGELOG.md           # Version history
├── USER-GUIDE.md          # Detailed user instructions
└── DEPLOYMENT.md          # Deployment guide
```

## 💡 Usage

### Getting Started
1. **Add Sources**: Create water sources with capacity and initial storage
2. **Log Data**: Enter daily measurements for each source
3. **View Analytics**: Monitor trends in the interactive charts
4. **Set Alerts**: Configure thresholds for automated warnings
5. **Export/Backup**: Save your data for backup or sharing

### Data Management
- **Export**: Download complete data as JSON backup
- **Import**: Restore from previous backup files
- **Report**: Generate comprehensive analysis reports
- **Settings**: Customize alerts and display units

## 🔧 Technical Details

### Browser Requirements
- Modern browser with ES6 support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage support
- No server required - runs entirely client-side

### Storage Format
- JSON-based localStorage
- Automatic data persistence
- Version-compatible import/export

### Dependencies
- Chart.js (loaded from CDN)
- No other external dependencies

## 📊 Comparison: Original vs Enhanced

| Feature | Original (v1.0) | Enhanced (v2.0) |
|---------|----------------|-----------------|
| UI Design | Basic forms | Professional dashboard |
| Data Management | Local only | Export/import/reports |
| Analytics | Single chart | Multi-source analytics |
| Alerts | None | Automated monitoring |
| Responsiveness | Basic | Mobile-first design |
| Code Architecture | Procedural | Object-oriented ES6 |
| Settings | Fixed | Customizable panel |
| Documentation | None | Comprehensive guides |

## 🚀 Deployment

### Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using live-server
npx live-server --port=3000
```

### Production Hosting
- GitHub Pages
- Netlify (drag & drop)
- Vercel
- Any static hosting service

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📞 Support

- Check USER-GUIDE.md for detailed instructions
- Review CHANGELOG.md for version information
- See DEPLOYMENT.md for hosting options

---

**Made with 💧 for better water resource management**