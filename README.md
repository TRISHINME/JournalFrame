# 🧠 JournalFrame AI

> **An AI-powered cognitive journaling platform for turning emotional reflections into structured CBT insights.**

JournalFrame AI is a production-oriented, multi-turn cognitive journaling platform powered by **Google Gemini**. It analyzes journal conversations in real time to identify emotional states and potential cognitive distortions, then provides balanced CBT-inspired reframing perspectives.

Built with **React, TypeScript, Node.js, Firebase, and Google Cloud Run**, the platform combines conversational AI with tenant-isolated data storage and cloud-native deployment.

---

## ✨ Features

### 🧠 Multi-Turn Cognitive Analysis

* Analyzes journal conversations across multiple turns.
* Identifies emotional states and recurring thought patterns.
* Detects cognitive distortions such as:

  * Catastrophizing
  * All-or-Nothing Thinking
  * Overgeneralization
  * Mind Reading
  * Emotional Reasoning
* Generates balanced, CBT-inspired reframing perspectives.
* Produces structured AI responses suitable for downstream UI rendering.

### 🔐 Secure, Tenant-Isolated Journaling

* Firebase Authentication for user identity.
* User-scoped Firestore document structures.
* Journal entries isolated by authenticated user ID.
* AI-generated analyses stored alongside the relevant journal entry.
* Designed to prevent users from accessing another user's journal data.

### 🎨 Interactive Journal Experience

* Clean React-based interface.
* Cognitive distortion badges.
* Dynamic filtering and categorization.
* Emotional trend visualization.
* Responsive UI built with Tailwind CSS.
* Lucide icons for consistent interface design.

### ☁️ Cloud-Native Infrastructure

* Containerized backend deployed to Google Cloud Run.
* Automated builds through Cloud Build.
* Images managed using Artifact Registry.
* Environment configuration and secrets managed separately from source code.
* Production-oriented serverless architecture.

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────┐
│            React / Vite UI           │
│       TypeScript + Tailwind CSS      │
└──────────────────┬───────────────────┘
                   │
                   │ Firebase Auth Token
                   ▼
┌──────────────────────────────────────┐
│       Node.js + Express API          │
│           Google Cloud Run           │
│                                      │
│  • Authentication Verification       │
│  • Journal Management                │
│  • Gemini AI Orchestration            │
│  • Structured Cognitive Analysis      │
└───────────────┬───────────────┬──────┘
                │               │
                │               │
                ▼               ▼
┌──────────────────────┐  ┌──────────────────────┐
│   Google Gemini AI   │  │   Firebase Services  │
│                      │  │                      │
│ Cognitive Analysis   │  │ Firebase Auth        │
│ JSON Generation      │  │ Cloud Firestore      │
└──────────────────────┘  └──────────────────────┘
                                  │
                                  ▼
                         /journals/{uid}/entries
```

### Request Flow

```text
User writes journal entry
          │
          ▼
Firebase Authentication
          │
          ▼
Authenticated API Request
          │
          ▼
Cloud Run / Express API
          │
          ├──────────────► Firestore
          │                 Store journal entry
          │
          ▼
     Gemini Analysis
          │
          ▼
Structured CBT Insights
          │
          ▼
Firestore
          │
          ▼
React UI
          │
          ▼
Cognitive Distortion Badges
+ Emotional Insights
+ Reframing Perspective
```

---

## 🛠️ Tech Stack

| Layer                  | Technologies                   |
| ---------------------- | ------------------------------ |
| **Frontend**           | React, Vite, TypeScript        |
| **Styling**            | Tailwind CSS                   |
| **Icons**              | Lucide Icons                   |
| **Backend**            | Node.js, Express               |
| **AI Engine**          | Google Gemini, `@google/genai` |
| **Authentication**     | Firebase Authentication        |
| **Database**           | Cloud Firestore                |
| **Containerization**   | Docker                         |
| **Cloud Platform**     | Google Cloud Run               |
| **CI/CD**              | Cloud Build                    |
| **Container Registry** | Artifact Registry              |

---

## 🔐 Data Isolation

JournalFrame AI uses a user-scoped Firestore structure to maintain logical tenant isolation:

```text
/journals/{uid}/entries/{entryId}
```

The authenticated Firebase user's UID determines which journal resources can be accessed.

```text
Authenticated User
       │
       ▼
Firebase Auth
       │
       ▼
     {uid}
       │
       ▼
/journals/{uid}/entries
       │
       ├── Entry 1
       ├── Entry 2
       └── Entry 3
```

This architecture ensures journal data is associated with the authenticated user's identity rather than being stored in a shared global collection.

---

## 🤖 AI Analysis Pipeline

JournalFrame AI goes beyond simple summarization.

A journal conversation is processed through a structured analysis pipeline:

```text
Raw Journal Reflection
          │
          ▼
   Conversation Context
          │
          ▼
   Gemini Cognitive Analysis
          │
          ├── Emotional State
          │
          ├── Cognitive Distortions
          │
          ├── Supporting Evidence
          │
          └── Balanced Perspective
          │
          ▼
   Structured JSON Response
          │
          ▼
      React UI
```

The model is instructed to return predictable structured output so that cognitive insights can be rendered as interactive UI components rather than plain conversational text.

---

## 🚀 Deployment Architecture

```text
Developer
   │
   │ git push
   ▼
Cloud Build
   │
   ├── Install dependencies
   ├── Build frontend
   ├── Build container
   └── Push image
          │
          ▼
   Artifact Registry
          │
          ▼
     Cloud Run
          │
          ├── Express API
          └── Production Service
                  │
                  ├── Gemini API
                  └── Firebase / Firestore
```

The application is designed to run as a containerized service on **Google Cloud Run**, allowing the backend to scale without managing traditional server infrastructure.

---

## 💡 Engineering Highlights

### Migrating to Gemini

One of the major engineering challenges was migrating the application from deprecated model versions to the newer Gemini model configuration.

The migration required more than simply changing the model name. The prompt structure and expected JSON output had to be refined to reliably produce:

* Empathetic conversational responses
* Cognitive distortion classifications
* Structured analysis data
* Consistent output for frontend rendering

This highlighted the importance of treating **prompt design and output validation as part of the application architecture**, rather than as an isolated AI feature.

### ☁️ Cloud Run Deployment

Containerizing the React + Node.js application introduced several practical deployment considerations.

Key challenges included:

* Dynamic Cloud Run port binding.
* Production frontend builds.
* Separating development and production dependencies.
* Managing `.gcloudignore`.
* Keeping build contexts lightweight.
* Configuring runtime environment variables.
* Integrating Cloud Build with Artifact Registry.

These deployment issues provided hands-on experience with the realities of production serverless infrastructure.

### 🔐 Tenant Isolation

The application initially used mock authentication during development.

Moving to Firebase Authentication required restructuring the data model around authenticated user identities:

```text
User
 │
 └── UID
      │
      └── /journals/{uid}/entries
```

This created a clear relationship between authentication, authorization, and data ownership.

---

## 📚 Key Takeaways

Building JournalFrame AI provided practical experience across the full lifecycle of an AI-powered application:

* **LLM Application Development** — Designing structured multi-turn AI workflows.
* **Prompt Engineering** — Creating reliable instructions for structured cognitive analysis.
* **Full-Stack Development** — Connecting a React frontend with a Node.js API.
* **Authentication & Authorization** — Implementing Firebase-based user identity and data isolation.
* **Cloud Architecture** — Deploying containerized services using Google Cloud Run.
* **CI/CD** — Automating builds and container deployment through Google Cloud tooling.
* **Production Engineering** — Handling environment configuration, ports, builds, secrets, and deployment constraints.

---

## 🧪 Development

### Prerequisites

* Node.js
* npm
* Firebase project
* Google Cloud project
* Gemini API access
* Docker *(for containerized deployment)*

### Local Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project
cd JournalFrame-AI

# Install dependencies
npm install

# Start the development server
npm run dev
```

Configure the required Firebase and Gemini environment variables before starting the application.

---

## ⚠️ Disclaimer

JournalFrame AI is an **AI-assisted journaling and reflection tool**. Its cognitive insights are generated by an AI model and should not be treated as professional medical or psychological diagnosis, treatment, or crisis intervention.

---

## 👨‍💻 Developer Perspective

> **The goal wasn't to build another chatbot wrapper.**
>
> The goal was to build a stateful, security-conscious AI application that could transform unstructured emotional reflections into useful, explainable cognitive insights while operating on real cloud infrastructure.

JournalFrame AI represents hands-on experience in taking an LLM-powered idea from **application design → AI orchestration → authentication → data isolation → containerization → cloud deployment**.

---

## ⭐ If You Find This Project Interesting

Feel free to explore the repository, experiment with the architecture, or use the ideas as a starting point for your own AI-powered applications.

**Built with React · TypeScript · Firebase · Gemini · Node.js · Google Cloud**
