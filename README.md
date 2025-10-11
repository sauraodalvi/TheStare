# The Stare - Product Management Resource Platform

## 🌟 Overview

The Stare is a comprehensive platform designed for product managers to access resources, case studies, and tools to enhance their skills and career. The platform offers a curated collection of learning materials, case studies, and practical tools for product management professionals.

## 🌐 Site Map & Content Overview

### 📚 Main Pages

1. **Homepage (`/`)**
   - Hero section with value proposition
   - Featured case studies and resources
   - User testimonials and social proof
   - Call-to-action for new users

2. **Case Studies (`/case-studies`)**
   - Collection of real-world product management case studies
   - Filterable by industry, company size, and product type
   - Detailed case study pages with problem-solution analysis
   - Interactive elements for learning and discussion

3. **Resources (`/resources`)**
   - **Self-Study (`/resources/self-study`)
     - Curated list of books, articles, and learning materials
     - Structured learning paths for different PM levels
     - Video tutorials and expert talks
   
   - **Courses (`/resources/courses`)
     - Free and paid course recommendations
     - Course reviews and ratings
     - Learning progress tracking

   - **Portfolio (`/resources/portfolio`)
     - Portfolio building guides
     - Template gallery
     - Best practices and examples

   - **Resume (`/resources/resume`)
     - PM-specific resume templates
     - ATS-optimized formats
     - Action verb suggestions and examples

4. **Case Study Review (`/case-study-review`)**
   - AI-powered case study analysis
   - Submission form for review requests
   - Feedback and improvement suggestions
   - Success stories from reviewed cases

5. **Community (`/community`)**
   - Discussion forums
   - Case challenges
   - Peer feedback system
   - Networking opportunities

6. **About Us (`/about`)**
   - Our mission and vision
   - Team members
   - Success metrics and impact
   - Press and media mentions

7. **Pricing (`/pricing`)**
   - Subscription plans
   - Feature comparison
   - Free trial information
   - Enterprise solutions

8. **Admin Dashboard (`/admin`)**
   - User management
   - Content moderation
   - Analytics and insights
   - System configuration

### 🔍 SEO Optimized Content

- **Target Keywords**:
  - Product management resources
  - PM case studies
  - Product manager portfolio examples
  - Resume templates for product managers
  - Case study review for PM interviews

- **Content Strategy**:
  - Long-form, detailed case studies (1500+ words)
  - How-to guides and tutorials
  - Industry insights and trends
  - Interview preparation resources

- **Structured Data**:
  - FAQ schema for common PM questions
  - How-to schema for guides
  - Article schema for blog posts
  - Review schema for case study reviews

## ✨ Features

- **Case Studies**: Real-world product management scenarios and solutions
- **Self-Study Resources**: Books, courses, and articles for independent learning
- **Portfolio Building**: Tools and templates to showcase your work
- **Resume Templates**: Professionally designed templates for PM roles
- **Case Study Review**: Get AI-powered feedback on your case studies
- **Community Participation**: Engage in case challenges and discussions
- **Admin Dashboard**: Manage content and users (admin access required)

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query, Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel/Netlify compatible

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Supabase account for backend services
- Google Drive API credentials (for file uploads)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stare-revived-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_PASSWORD=Pass@120697
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔒 Admin Access

To access the admin dashboard:
1. Navigate to `/admin`
2. Enter the admin password (default: `Pass@120697`)
3. Manage users, content, and platform settings

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility functions and configurations
├── hooks/         # Custom React hooks
├── styles/        # Global styles and themes
└── types/         # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by The Stare Team
- Special thanks to all contributors and the open-source community

---

*This project was initially created with [Lovable](https://lovable.dev) and has been customized for The Stare platform.*
