# Ipon — Personal Finance Manager

A modern, full-featured personal finance management application designed to help users track income, monitor expenses, set savings goals, and gain AI-powered financial insights. Built with a clean, intuitive interface and full dark mode support.

## Overview

Ipon (from the Filipino word for "to save") is a comprehensive personal finance dashboard that brings together transaction tracking, budgeting, savings goals, and financial reporting into a single, cohesive experience. The app leverages AI to provide personalized spending advice and uses real-time data synchronization to keep everything up to date across sessions.

## Features

### Dashboard
- Real-time summary cards displaying net balance, income, expenses, savings rate, and transaction count
- Live clock widget with current date display
- Recent transactions overview with category icons and color-coded amounts
- Spending by category breakdown with visual progress bars
- AI-powered financial insights with caching for performance

### Transactions
- Full CRUD support for income and expense transactions
- Category-based organization with custom icons and colors
- Search, filter by type, and filter by month
- Pagination with "Load More" for large datasets
- Edit and delete with confirmation dialogs

### Budgets
- Monthly budgets per expense category
- Visual progress bars with color-coded status (green, yellow, red)
- Real-time spending tracking against budget limits
- Over-budget warnings with excess amount display
- Edit and delete support

### Savings Goals
- Create goals with target amounts, current savings, and optional deadlines
- Visual progress tracking with completion indicators
- Deposit functionality to incrementally add savings
- Completed goals display with success styling and badge
- Edit and delete support

### Reports
- Monthly and custom date range views
- Period comparison donut charts (today vs. yesterday, this week vs. last week, this month vs. last month)
- Expense breakdown by category with percentage distribution
- Daily activity feed showing income and expenses per day
- Summary statistics including total income, expenses, and net savings

### Settings
- Update display name with pre-filled current value
- Change password with confirmation validation
- Clean, centered form layout

### Authentication
- Email and password registration with email confirmation
- Secure login with error handling and user-friendly error messages
- Session persistence across page reloads
- Protected routing — unauthenticated users are redirected to the login screen

### Theme & Accessibility
- Full dark and light mode with smooth transitions
- Theme preference persisted in localStorage
- ARIA labels on interactive elements
- Focus trap and Escape key support in all modals
- Screen reader-friendly toast notifications
- Keyboard navigation support

### Real-Time Sync
- Supabase real-time subscriptions for transactions, budgets, and goals
- Automatic data refresh when changes occur
- Proper subscription cleanup on unmount

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 with functional components and hooks |
| Styling | Tailwind CSS with custom dark mode theme |
| Charts | Recharts for donut charts and data visualization |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL, Auth, Real-time) |
| AI | Google Gemini API for personalized financial insights |
| Build | Create React App |


