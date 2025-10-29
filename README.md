<div align="center">

<img width="100%" height="267" alt="image" src="https://github.com/user-attachments/assets/dc365408-15d5-4deb-8f32-d352a4f572ee" />

### AI-Powered Diagram Creation & Editing Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-7B5CF1?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---
### 🖼️ Preview

<table>
  <tr>
    <td width="50%" align="center">
      <img width="1725" height="902" alt="1" src="https://github.com/user-attachments/assets/0baec918-9f34-4d86-bdd7-6fde748eaf8e" />
    </td>
    <td width="50%" align="center">
      <img width="1725" height="902" alt="2" src="https://github.com/user-attachments/assets/2885518c-f635-4e20-b0f6-6eb61d26ee25" />
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img width="1728" height="902" alt="3" src="https://github.com/user-attachments/assets/26f3eba8-ee1f-4b81-a41d-ca2ab956282e" />
    </td>
    <td width="50%" align="center">
      <img width="1728" height="902" alt="4" src="https://github.com/user-attachments/assets/826aa619-fd75-4f48-b91a-f8b02defd895" />
    </td>
  </tr>
</table>

---

### ✨ Features

### **AI-Powered Generation**
- Generate diagrams from natural language descriptions
- Support for multiple diagram types: Architecture, Flowchart, ERD, Sequence, and Org Charts

### **Advanced Styling**
- **Node Customization**: Full control over shapes, colors, text, borders, and shadows
- **Edge Styling**: Customize arrows with multiple line types, dash patterns, colors, and arrow heads
- **Components Library**: Choose from different type of components available
- **Live Preview**: See changes instantly as you style

### **AI Chat Assistant**
- Conversational diagram editing
- Ask AI to modify, add, expand, or remove components
- Natural language commands for quick changes
- Smart highlighting of AI-modified elements

### **Other Features**
- **Multi-Format Export**: PNG, SVG, Mermaid, and JSON formats
- **Code Editor**: Edit diagrams directly in JSON or Mermaid syntax
- **Theme Support**: Beautiful dark and light themes
- Collapsible side panels for maximum workspace

---

### 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   vi .env
   ```

   Configure your `.env` file with required API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5001
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5001
   ```

---

### 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **React Flow** - Powerful diagram rendering
- **TailwindCSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library
- **Zustand** - Lightweight state management
- **TanStack Query** - Data fetching & caching

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Gemini 2.5 Flash (default)** - AI language model
- **Zod** - Schema validation
- **TypeScript** - Full-stack type safety

### Build Tools
- **Vite** - Lightning-fast build tool
- **tsx** - TypeScript execution
- **ESLint** - Code quality
- **Prettier** - Code formatting

---

### 📦 Project Structure

```
mappin/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── diagram/  # Diagram-specific components
│   │   │   └── ui/       # Shadcn UI components
│   │   ├── lib/          # Utilities and stores
│   │   ├── pages/        # Page components
│   │   └── index.css     # Global styles
│   └── public/           # Static assets
├── server/                # Backend Node.js application
│   ├── index.ts           # Express server
├── shared/               # Shared types and schemas
│   └── schema.ts        # Zod schemas
└── package.json         # Project dependencies
```

---
### 🤝 Contributing
Contributions, issues, and feature requests are welcome!  

---
<div align="center">

### Built with ⚡
<br/>
</div>
