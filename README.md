# Saakie - Premium Indian Sarees E-commerce Platform

A modern, production-ready e-commerce platform for Indian sarees built with Next.js 14, TypeScript, and MAANG-level engineering standards.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Authentication**: Clerk
- **Database**: MongoDB with Prisma ORM
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Code Quality**: ESLint (Airbnb config), Prettier, Husky, Commitlint

## Project Structure

```
src/
├── app/              # Next.js 14 app directory
├── components/       # Reusable UI components
│   └── ui/          # Shadcn/ui components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── constants/       # Application constants
└── utils/           # Helper functions
```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd saakie
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your actual credentials.

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Commits are validated using Commitlint.

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools
- `revert`: Reverts a previous commit
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies

### Example

```bash
git commit -m "feat: add product listing page"
git commit -m "fix: resolve cart quantity update issue"
```

## Code Style

This project uses:

- ESLint with Airbnb configuration for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- lint-staged to run linters on staged files

Code is automatically formatted and linted on commit.

## License

This project is private and proprietary.
