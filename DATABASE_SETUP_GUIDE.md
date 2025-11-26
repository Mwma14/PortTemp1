# Supabase Database Setup Guide

## Current Status

You currently have **1 table**:
- ✅ `portfolios` - Main portfolio data

## Recommended Additional Tables

I've created a complete database schema with **9 tables** for a professional portfolio platform. Here's what to add:

---

## 📊 Complete Database Schema

### 1. **portfolios** ✅ (Already Created)
Stores main portfolio data
```
- id (UUID, Primary Key)
- slug (Text, Unique) - Portfolio URL
- title, subtitle, about - Content
- email, phone, location - Contact info
- profileImage - Avatar URL
- services, projects, socialMedia - JSON arrays
- templateId - Which template used
- createdAt, updatedAt - Timestamps
```

### 2. **portfolio_views** (Analytics)
Tracks every portfolio visit
```
- id (UUID, Primary Key)
- portfolio_id (Foreign Key) → portfolios
- visitor_ip, visitor_country, visitor_city
- referrer - Where visitor came from
- user_agent - Browser info
- viewed_at - Timestamp
```

**Use Case**: Track how many times each portfolio is viewed, where visitors come from

### 3. **portfolio_comments** (Feedback)
Visitors can leave feedback and ratings
```
- id (UUID, Primary Key)
- portfolio_id (Foreign Key) → portfolios
- visitor_name, visitor_email
- message - Comment text
- rating - 1-5 star rating
- created_at, updated_at
```

**Use Case**: Collect feedback and testimonials on portfolios

### 4. **portfolio_analytics** (Monthly Stats)
Monthly aggregated analytics
```
- id (UUID, Primary Key)
- portfolio_id (Foreign Key) → portfolios
- view_count - Total views this month
- unique_visitors - How many unique people
- total_comments - Comment count
- average_rating - Average star rating
- last_viewed_at - Last visit time
- month_year - Date grouping
```

**Use Case**: Display portfolio stats, trending portfolios

### 5. **portfolio_settings** (Custom Config)
Custom configurations per portfolio
```
- id (UUID, Primary Key)
- portfolio_id (Foreign Key) → portfolios
- custom_domain - Use own domain
- custom_colors - Override theme colors
- custom_fonts - Override fonts
- seo_title, seo_description - SEO optimization
- google_analytics_id - Track with GA
- enable_comments - Allow feedback
- enable_contact_form - Show contact form
- show_view_count - Display view count
```

**Use Case**: Portfolio customization and advanced features

### 6. **templates** (Template Management)
Store all available templates
```
- id (Serial, Primary Key)
- name, slug, description
- preview_image - Template screenshot
- design_config - JSON configuration
- colors, fonts - JSON styling
- is_featured - Featured template
- is_active - Enable/disable template
```

**Use Case**: Manage templates dynamically from database

### 7. **contact_messages** (Contact Form)
Store messages from portfolio contact forms
```
- id (UUID, Primary Key)
- portfolio_id (Foreign Key) → portfolios
- sender_name, sender_email, sender_phone
- subject, message - Message content
- is_read - Message read status
- created_at - When submitted
```

**Use Case**: Portfolio owners receive messages from visitors

### 8. **users** (For Authentication - Future)
User accounts management
```
- id (UUID, Primary Key)
- email, username - Unique identifiers
- full_name, profile_image, bio
- password_hash - Secure password
- is_active, email_verified - Account status
- created_at, updated_at
```

**Use Case**: User registration, login, account management

### 9. **user_portfolios** (User Ownership)
Link users to portfolios
```
- id (UUID, Primary Key)
- user_id (Foreign Key) → users
- portfolio_id (Foreign Key) → portfolios
- role - 'owner', 'editor', 'viewer'
```

**Use Case**: Multiple users managing portfolios, sharing

---

## 🚀 How to Set Up in Supabase

### Option A: Using Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project
   - Click "SQL Editor" in left sidebar

2. **Copy & Paste the Migration**
   - Open `supabase_complete_migration.sql` from your project
   - Copy all the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" button

3. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see all 9 tables listed

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref=your_project_ref

# Run migration
supabase db push

# Or paste SQL file content directly
```

### Option C: Manual Table Creation

Create each table one at a time in Supabase SQL Editor. Refer to the SQL file for exact syntax.

---

## 📋 Migration SQL File Location

The complete migration file is in your project:
- **File**: `supabase_complete_migration.sql`
- **Location**: Root directory of your project

---

## ✨ What's Included

### Tables (9 total)
- ✅ portfolios (core)
- ✅ portfolio_views (analytics)
- ✅ portfolio_comments (feedback)
- ✅ portfolio_analytics (monthly stats)
- ✅ portfolio_settings (customization)
- ✅ templates (template management)
- ✅ contact_messages (contact form)
- ✅ users (authentication)
- ✅ user_portfolios (user-portfolio links)

### Security Features
- ✅ Row-Level Security (RLS) enabled on all tables
- ✅ Public read policies for portfolios and comments
- ✅ Insert policies for visitor data
- ✅ Unique constraints to prevent duplicates
- ✅ Foreign keys for data integrity

### Helper Features
- ✅ Indexes for fast queries
- ✅ Helper functions for common operations
- ✅ Database views for easy querying
- ✅ Seed data for templates
- ✅ Timestamps on all tables

---

## 🔧 Database Functions Provided

### 1. `increment_portfolio_views()`
Automatically increment view count when portfolio is viewed

### 2. `get_portfolio_stats()`
Get total views, comments, and average rating for a portfolio

### 3. `get_popular_portfolios()`
Get top portfolios sorted by view count

---

## 📚 TypeScript Integration

A new file is provided: `lib/supabase-extended.ts`

This file includes functions for:

```typescript
// Analytics
recordPortfolioView()        // Log a portfolio view
getPortfolioAnalytics()      // Get view stats

// Comments
addPortfolioComment()        // Add comment/feedback
getPortfolioComments()       // Get all comments

// Settings
getPortfolioSettings()       // Get portfolio config
savePortfolioSettings()      // Save portfolio config

// Contact Messages
sendContactMessage()         // Submit contact form
getContactMessages()         // Get portfolio messages

// Templates
getAllTemplates()            // Get all active templates
getTemplateBySlug()          // Get specific template

// Users (for future)
createUser()                 // Create user account
getUserByEmail()             // Get user by email

// Popular Portfolios
getPopularPortfolios()       // Get trending portfolios
```

---

## 🎯 Which Tables to Add First

### Essential (Must Have)
- ✅ `portfolios` - Already have this
- 📌 `portfolio_views` - Track views
- 📌 `portfolio_comments` - Collect feedback

### Recommended (Nice to Have)
- 📊 `portfolio_analytics` - Monthly stats
- 🎨 `portfolio_settings` - Customization
- 📧 `contact_messages` - Contact form

### Optional (For Future)
- 👤 `users` - Authentication
- 🔗 `user_portfolios` - User management
- 🎭 `templates` - Dynamic templates

---

## 📝 Steps to Implement

### Step 1: Create Tables
Run the complete migration SQL in Supabase

### Step 2: Verify Structure
Check that all tables appear in Supabase UI

### Step 3: Test Connection
Use the functions in `supabase-extended.ts` in your app

### Step 4: Start Using
Call the database functions from your components

---

## 🔐 Security Notes

All tables have Row-Level Security (RLS) enabled:
- **Public tables**: Visible to everyone (portfolios, comments)
- **Insert-only**: Contact messages, views (anyone can add)
- **Future auth**: User tables will require authentication

---

## 🧪 Testing the Setup

After creating tables, test with:

```typescript
import { getPortfolioComments, addPortfolioComment } from '@/lib/supabase-extended';

// Add a test comment
await addPortfolioComment({
  portfolio_id: 'test-portfolio-id',
  visitor_name: 'John Doe',
  visitor_email: 'john@example.com',
  message: 'Great portfolio!',
  rating: 5
});

// Get comments
const comments = await getPortfolioComments('test-portfolio-id');
console.log(comments);
```

---

## 📞 Troubleshooting

**Error: "relation does not exist"**
- Run the migration SQL again
- Verify all tables are created in Supabase

**Error: "permission denied"**
- Check RLS policies
- Ensure public read policies are enabled

**Query returns empty**
- Verify data exists in table
- Check table name spelling
- Test with Supabase SQL Editor directly

---

## ✅ Checklist

- [ ] Open `supabase_complete_migration.sql`
- [ ] Copy all SQL code
- [ ] Go to Supabase SQL Editor
- [ ] Paste and run migration
- [ ] Verify all tables created
- [ ] Test with a sample query
- [ ] Start using extended functions in your app

---

## 📊 Database Schema Diagram

```
portfolios (core)
├── portfolio_views (track visits)
├── portfolio_comments (feedback)
├── portfolio_analytics (monthly stats)
├── portfolio_settings (config)
├── contact_messages (contact form)
└── user_portfolios (user links)
    └── users (accounts)

templates (template library)
```

---

## 🎉 You're All Set!

Once you run the migration:
1. ✅ 9 professional tables created
2. ✅ Security policies configured
3. ✅ Helper functions ready
4. ✅ TypeScript functions available
5. ✅ Your platform can scale!

**Next Step**: Run the migration SQL in Supabase!

---

## 📖 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Full Text Search**: For searching portfolios (future feature)

---

**Ready to add these tables to your portfolio platform?** Follow the steps above!
