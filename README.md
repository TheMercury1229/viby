# Viby ⚡

> A vibe-based collaborative coding platform that makes prototyping feel like magic

Viby is an AI-powered development environment that lets you spin up live coding sandboxes instantly. Think [bolt.new](https://bolt.new) meets [lovable.dev](https://lovable.dev), but with more vibe ✨

Perfect for solo developers, indie hackers, and teams who want to prototype fast without the friction of traditional dev setups.

## 🚀 Features

- **⚡ Instant Environments** - Live coding sandboxes that spin up in seconds
- **🤖 AI-Powered Assistant** - Gemini 2.5 Flash integration with smart context generation
- **🎨 Beautiful UX** - Themeable, minimal interface built with shadcn/ui
- **🔐 Authentication & Billing** - Secure auth and pricing plans via Clerk
- **🛠️ Extensible Backend** - Scalable tRPC-based architecture

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   tRPC Backend  │    │   Inngest       │
│  (Frontend UI)  │◄──►│   (API Layer)   │◄──►│ (AI Orchestration)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Clerk      │    │       e2b       │    │   Gemini 2.5    │
│   (Auth/Billing)│    │  (Live Sandbox) │    │     Flash       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: Next.js + TailwindCSS + shadcn/ui
- **Backend**: tRPC
- **AI Orchestration**: Inngest
- **AI Model**: Gemini 2.5 Flash
- **Authentication**: Clerk
- **Live Sandboxes**: e2b
- **Package Manager**: npm

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm
- Required API keys (see Environment Variables)

### Installation

```bash
# Clone the repository
git clone https://github.com/TheMercury1229/viby.git
cd viby

# Install dependencies
npm install

```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="your-db-url"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-key"
E2B_API_KEY="your-e2b-key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-key"
CLERK_SECRET_KEY="your-secret"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SING_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
```

### Running the Development Server

```bash
# Start the development server
npm dev

# Start Inngest dev server (in another terminal)
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see Viby in action!

## 🤖 How AI Agent Flow Works

Viby uses a sophisticated AI orchestration system powered by **Inngest** and **Gemini 2.5 Flash**:

1. **Context Generation**: When you create a new project, Viby analyzes your requirements and generates intelligent context
2. **AI Orchestration**: Inngest manages the workflow, coordinating between different AI tasks
3. **Code Generation**: Gemini 2.5 Flash generates code based on your specifications and context



## 🏖️ How Live Sandbox Works

Viby leverages **e2b** to provide instant, containerized coding environments:

1. **Instant Provisioning**: Sandboxes spin up in seconds, no setup required
2. **Full Environment**: Complete development environment with terminal, file system, and package managers
3. **Real-time Sync**: Changes sync instantly between the UI and sandbox
4. **Persistent State**: Your work is saved and can be resumed anytime

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

## Made with ❤️ by Mercury
