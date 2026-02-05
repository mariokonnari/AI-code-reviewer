# 🤖 AI Code Review Assistant

A powerful web application that provides instant, AI-powered code reviews using Google's Gemini API. Get expert-level feedback on security, performance, readability, testing, and general best practices.

## ✨ Features

- **🔍 Multiple Review Types**: General, Security, Performance, Readability, and Testing-focused reviews
- **🌐 Multi-Language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift
- **💾 Workspace**: Save and manage your code reviews locally
- **📄 PDF Export**: Download professional PDF reports of your reviews
- **⚡ Fast & Free**: Powered by Google Gemini 2.5 API with generous free tier
- **🎨 Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **📊 Token Tracking**: Monitor API usage with token counters

## 🚀 Live Demo

https://ai-code-reviewer-tau-coral.vercel.app/

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini 2.5 API
- **PDF Generation**: jsPDF
- **Markdown Rendering**: react-markdown

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get it free here](https://aistudio.google.com/app/apikey))

## 🔧 Installation

1. **Clone the repository**
```bash
   git clone https://github.com/mariokonnari/AI-code-reviewer
   cd ai-code-reviewer
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
```env
   GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**
```bash
   npm run dev
```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Performing a Code Review

1. **Paste your code** into the left panel
2. **Select the programming language** from the dropdown
3. **Choose a review type**:
   - 🔍 **General**: Comprehensive review covering all aspects
   - 🔒 **Security**: Focus on vulnerabilities and security issues
   - ⚡ **Performance**: Optimization suggestions
   - 📖 **Readability**: Code clarity and maintainability
   - 🧪 **Testing**: Test coverage and testability
4. **Click "Review My Code"** and wait 5-10 seconds
5. **View the AI-generated review** with actionable feedback

### Saving Reviews

- Click the **💾 Save** button to store reviews in your workspace
- Access saved reviews anytime from the **Workspace** page
- Reviews are stored locally in your browser

### Exporting to PDF

- Click **📄 Export PDF** to download a professional report
- PDFs include original code, AI review, and metadata
- Available from both main page and workspace

## 🏗️ Project Structure
```
src/
├── app/
│   ├── page.tsx              # Main review interface
│   ├── workspace/
│   │   └── page.tsx          # Saved reviews workspace
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── review/
│           └── route.ts      # API endpoint for Gemini
├── components/
│   ├── CodeInput.tsx         # Code input with language selector
│   ├── ReviewOutput.tsx      # Review display with markdown
│   └── ReviewTypeSelector.tsx # Review type buttons
├── lib/
│   ├── gemini.ts             # Gemini AI client
│   ├── prompts.ts            # AI prompt templates
│   └── pdfExport.ts          # PDF generation logic
└── types/
    └── index.ts              # TypeScript interfaces
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Add environment variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key

4. **Deploy**
   - Vercel will automatically deploy your app
   - You'll get a live URL instantly

### Build for Production Locally
```bash
npm run build
npm start
```

## 📊 API Rate Limits

Google Gemini Free Tier:
- **gemini-2.5-flash**: 15 requests/minute
- **gemini-2.5-pro**: 2 requests/minute
- **Daily limit**: 1,500 requests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**[Marios Konnaris]**
- GitHub: [mariokonnari](https://github.com/mariokonnari)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/marios-konnaris-1b3726286/)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

## 📸 Screenshots

### Main Interface
![Main Interface](/ai-code-reviewer/public/screenshots/main_interface.png)

### Workspace
![Workspace](/ai-code-reviewer/public/screenshots/workspace.png)

### PDF Export
![PDF Export](/ai-code-reviewer/public/screenshots/pdf_export.png)
