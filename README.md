# JARVIS AI - Professional AI Chat Assistant

A modern, professional AI chatting website with voice recognition, text-to-speech, and image analysis capabilities. Built with React, Tailwind CSS, and featuring a beautiful, responsive design.

![JARVIS AI](https://img.shields.io/badge/JARVIS-AI%20Assistant-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Voice & Image](https://img.shields.io/badge/Voice%20%26%20Image-Analysis-orange?style=for-the-badge&logo=mic)

## ✨ Features

- 🤖 **Advanced AI Integration** - Powered by state-of-the-art language models
- 🎤 **Voice Recognition** - Speak to JARVIS with real-time speech-to-text
- 🔊 **Text-to-Speech** - JARVIS responds with natural voice output
- 📷 **Image Analysis** - Upload or capture images for AI analysis
- 🔐 **Secure API Key Authentication** - Local storage with validation
- 💬 **Real-time Chat Interface** - Professional messaging experience
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI/UX** - Beautiful gradients and animations
- 📋 **Copy to Clipboard** - Easy message copying functionality
- 🌙 **Professional Styling** - Glass morphism and modern aesthetics
- ⚡ **Fast & Lightweight** - Optimized for performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API key from AI Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dr-MrBot/Jarvis-AI
   cd JARVIS-Web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Getting Your API Key

1. Visit [AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in the JARVIS login screen

## 🎤 Voice Features

- **Speech-to-Text**: Click the microphone button to speak
- **Text-to-Speech**: JARVIS reads responses aloud
- **Voice Controls**: Enable/disable voice features
- **Real-time Recognition**: Instant voice input processing

## 📷 Image Analysis

- **Upload Images**: Drag and drop or click to upload
- **Camera Capture**: Take photos directly in the app
- **AI Analysis**: Get detailed descriptions and insights
- **Multi-modal Chat**: Combine text and images in conversations

## 🏗️ Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** and your app will be live!

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Drag the `build` folder** to [Netlify Drop](https://app.netlify.com/drop)

### Option 3: GitHub Pages

1. **Add homepage to package.json**
   ```json
   {
     "homepage": "https://github.com/Dr-MrBot/Jarvis-AI"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 4: Traditional Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `build` folder** to your web server
3. **Configure your server** to serve `index.html` for all routes

## 🛠️ Environment Variables (Optional)

For enhanced security, you can use environment variables:

1. **Create `.env` file**
   ```env
   REACT_APP_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
   ```

2. **Update API calls** in the code to use `process.env.REACT_APP_API_URL`

## 📁 Project Structure

```
JARVIS-Web/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Authentication component
│   │   ├── Chat.js           # Main chat interface
│   │   ├── Header.js         # Navigation header
│   │   ├── VoiceRecorder.js  # Voice input component
│   │   ├── TextToSpeech.js   # Voice output component
│   │   ├── ImageUpload.js    # Image upload component
│   │   └── ApiTest.js        # API testing component
│   ├── App.js               # Main app component
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors here
    }
  }
}
```

### Styling
Modify `src/index.css` to change global styles and component classes.

## 🔧 Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure your API key is valid
   - Check if you have sufficient API quota
   - Verify the key is copied correctly

2. **Voice Recognition Issues**
   - Allow microphone permissions in browser
   - Use HTTPS in production (required for voice features)
   - Check browser compatibility

3. **Image Upload Issues**
   - Allow camera permissions for photo capture
   - Check file size limits
   - Ensure image format is supported

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Update dependencies: `npm update`

5. **Deployment Issues**
   - Ensure all dependencies are in `package.json`
   - Check if your hosting platform supports React Router

## 📱 Browser Support

- Chrome (latest) - Full support
- Firefox (latest) - Full support
- Safari (latest) - Full support
- Edge (latest) - Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**MOHAMMAD FAHAD**

- 🌟 Professional AI Chat Application with Voice & Image
- 🚀 Built with modern web technologies
- 💡 Designed for optimal user experience
- 📧 Email: fahad@cyberdream.com
- 📱 Instagram: [@dr_mr.bot](https://www.instagram.com/dr_mr.bot/)

### About JARVIS

When asked about its identity, JARVIS responds:
> "I am JARVIS, developed by MOHAMMAD FAHAD. I'm your intelligent AI assistant powered by advanced language models. I can help you with text, voice, and image analysis. You can reach my developer at fahad@cyberdream.com or follow him on Instagram @dr_mr.bot"

---

<div align="center">
  <p>Made with ❤️ by <strong>MOHAMMAD FAHAD</strong></p>
  <p>📧 fahad@cyberdream.com | 📱 <a href="https://www.instagram.com/dr_mr.bot/">@dr_mr.bot</a></p>
</div> 
