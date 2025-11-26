# Supabase Database - Tables Summary

## 📊 Your Database Structure

### Currently Deployed
- ✅ `portfolios` - Main portfolio data (already created)

### Ready to Deploy
- 📄 `supabase_complete_migration.sql` - Contains all additional tables
- 🔧 `lib/supabase-extended.ts` - TypeScript functions for new tables

---

## 🎯 Quick Reference: All 9 Tables

| Table | Purpose | Records | Status |
|-------|---------|---------|--------|
| **portfolios** | Main portfolio data | 1 per user | ✅ Ready |
| **portfolio_views** | Track page visits | Millions | 📌 Add Soon |
| **portfolio_comments** | Visitor feedback & ratings | 1000s | 📌 Add Soon |
| **portfolio_analytics** | Monthly statistics | Per portfolio/month | 📊 Optional |
| **portfolio_settings** | Portfolio customization | 1 per portfolio | 🎨 Optional |
| **templates** | Available template definitions | 6 | 🎭 Optional |
| **contact_messages** | Contact form submissions | 1000s | 📧 Optional |
| **users** | User accounts (future) | Auth users | 👤 Future |
| **user_portfolios** | User-portfolio relationships | N/A | 🔗 Future |

---

## 📋 Fields by Table

### 1. portfolios (✅ CREATED)
```
✓ id                UUID primary key
✓ slug              TEXT unique (portfolio URL)
✓ title             TEXT (user name/title)
✓ subtitle          TEXT (role/tagline)
✓ about             TEXT (bio)
✓ email             TEXT (contact)
✓ phone             TEXT (contact)
✓ location          TEXT (city/country)
✓ profileImage      TEXT (avatar URL)
✓ services          JSONB (array of services)
✓ projects          JSONB (array of projects)
✓ socialMedia       JSONB (social links)
✓ templateId        INTEGER (template design)
✓ createdAt         TIMESTAMP
✓ updatedAt         TIMESTAMP
```

### 2. portfolio_views (NEW - Analytics)
```
○ id                UUID primary key
○ portfolio_id      UUID foreign key → portfolios
○ visitor_ip        TEXT
○ visitor_country   TEXT
○ visitor_city      TEXT
○ referrer          TEXT (where visitor came from)
○ user_agent        TEXT (browser info)
○ viewed_at         TIMESTAMP
```

### 3. portfolio_comments (NEW - Feedback)
```
○ id                UUID primary key
○ portfolio_id      UUID foreign key → portfolios
○ visitor_name      TEXT
○ visitor_email     TEXT
○ message           TEXT
○ rating            INTEGER (1-5 stars)
○ created_at        TIMESTAMP
○ updated_at        TIMESTAMP
```

### 4. portfolio_analytics (NEW - Stats)
```
○ id                UUID primary key
○ portfolio_id      UUID foreign key → portfolios
○ view_count        INTEGER
○ unique_visitors   INTEGER
○ total_comments    INTEGER
○ average_rating    DECIMAL
○ last_viewed_at    TIMESTAMP
○ month_year        DATE
```

### 5. portfolio_settings (NEW - Config)
```
○ id                UUID primary key
○ portfolio_id      UUID foreign key → portfolios
○ custom_domain     TEXT unique
○ custom_colors     JSONB
○ custom_fonts      JSONB
○ seo_title         TEXT
○ seo_description   TEXT
○ google_analytics_id TEXT
○ enable_comments   BOOLEAN
○ enable_contact_form BOOLEAN
○ show_view_count   BOOLEAN
```

### 6. templates (NEW - Template Library)
```
○ id                SERIAL primary key
○ name              TEXT unique
○ slug              TEXT unique
○ description       TEXT
○ preview_image     TEXT
○ design_config     JSONB
○ colors            JSONB
○ fonts             JSONB
○ is_featured       BOOLEAN
○ is_active         BOOLEAN
```

### 7. contact_messages (NEW - Contact Form)
```
○ id                UUID primary key
○ portfolio_id      UUID foreign key → portfolios
○ sender_name       TEXT
○ sender_email      TEXT
○ sender_phone      TEXT
○ subject           TEXT
○ message           TEXT
○ is_read           BOOLEAN
○ created_at        TIMESTAMP
```

### 8. users (NEW - Authentication)
```
○ id                UUID primary key
○ email             TEXT unique
○ username          TEXT unique
○ full_name         TEXT
○ password_hash     TEXT
○ profile_image     TEXT
○ bio               TEXT
○ is_active         BOOLEAN
○ email_verified    BOOLEAN
○ created_at        TIMESTAMP
○ updated_at        TIMESTAMP
```

### 9. user_portfolios (NEW - Relationships)
```
○ id                UUID primary key
○ user_id          UUID foreign key → users
○ portfolio_id      UUID foreign key → portfolios
○ role              TEXT ('owner', 'editor', 'viewer')
○ created_at        TIMESTAMP
```

---

## 📚 Available TypeScript Functions

Location: `lib/supabase-extended.ts`

### Portfolio Views (Analytics)
```typescript
recordPortfolioView(portfolioId, data)   // Log a page view
getPortfolioAnalytics(portfolioId)       // Get view statistics
```

### Comments & Ratings
```typescript
addPortfolioComment(comment)             // Add comment/feedback
getPortfolioComments(portfolioId)        // Get all comments
```

### Settings & Configuration
```typescript
getPortfolioSettings(portfolioId)        // Get custom settings
savePortfolioSettings(settings)          // Save settings
```

### Contact Messages
```typescript
sendContactMessage(message)              // Submit contact form
```

### Templates
```typescript
getAllTemplates()                        // Get all active templates
getTemplateBySlug(slug)                  // Get specific template
```

### Statistics
```typescript
getPortfolioSummary(slug)                // Get portfolio with stats
getPopularPortfolios(limit)              // Get trending portfolios
```

### Users (Future Authentication)
```typescript
createUser(user)                         // Create new user
getUserByEmail(email)                    // Look up user
getUserPortfolios(userId)                // Get user's portfolios
```

---

## 🚀 Implementation Timeline

### Phase 1: DONE ✅
- [x] Basic portfolios table
- [x] Database connected to app
- [x] Portfolio create/read working

### Phase 2: RECOMMENDED (Add These Next)
- [ ] portfolio_views - Track visits
- [ ] portfolio_comments - Get feedback
- [ ] portfolio_analytics - Show stats

### Phase 3: NICE TO HAVE
- [ ] portfolio_settings - Customization
- [ ] contact_messages - Contact form
- [ ] templates - Dynamic templates

### Phase 4: FUTURE
- [ ] users - Authentication
- [ ] user_portfolios - User management

---

## 📂 Files Provided

```
/database-files/
├── supabase_migration.sql           (✅ Current - basic)
├── supabase_complete_migration.sql  (📌 New - full schema)
├── lib/supabase.ts                  (✅ Current - basic functions)
├── lib/supabase-extended.ts         (📌 New - extended functions)
├── DATABASE_SETUP_GUIDE.md          (📌 How to setup)
└── DATABASE_TABLES_SUMMARY.md       (This file)
```

---

## ⚡ Quick Setup (5 Minutes)

1. **Open Supabase Dashboard**
   - https://supabase.com → Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in sidebar
   - Click "New Query"

3. **Copy & Paste Migration**
   - Open `supabase_complete_migration.sql` from your project
   - Copy all content
   - Paste into SQL Editor in Supabase

4. **Run the Query**
   - Click "Run" button
   - Wait for completion ✅

5. **Verify Tables**
   - Go to "Table Editor"
   - See all 9 tables listed

6. **Start Using**
   - Import functions from `lib/supabase-extended.ts`
   - Use in your components

---

## 🔍 What Each Phase Enables

### Phase 1 (DONE): Basic Portfolio
```
Users can:
✓ Create portfolio with personal details
✓ View their portfolio publicly
✓ Share unique URL
```

### Phase 2 (ADD NEXT): Analytics & Feedback
```
Users can additionally:
✓ See how many times portfolio viewed
✓ Get visitor comments/feedback
✓ View rating scores
✓ See visitor count trends
```

### Phase 3 (ADD LATER): Advanced Features
```
Users can additionally:
✓ Customize colors/fonts
✓ Receive contact form messages
✓ Use custom domain
✓ Add Google Analytics
```

### Phase 4 (FUTURE): Full Platform
```
Users can additionally:
✓ Create account & login
✓ Manage multiple portfolios
✓ Share portfolios with team
✓ See detailed analytics
```

---

## 💡 Common Use Cases by Table

| Use Case | Table | Function |
|----------|-------|----------|
| Track page views | portfolio_views | recordPortfolioView() |
| Show "X people viewed" | portfolio_analytics | getPortfolioAnalytics() |
| Display comments | portfolio_comments | getPortfolioComments() |
| Get 5-star rating | portfolio_comments | getPortfolioComments() |
| Show trending portfolios | portfolio_analytics | getPopularPortfolios() |
| Store contact form | contact_messages | sendContactMessage() |
| Customize theme | portfolio_settings | savePortfolioSettings() |
| List all templates | templates | getAllTemplates() |
| User login | users | getUserByEmail() |

---

## 🎯 Recommended First Step

### Minimal (Just Analytics):
Add these 2 tables to track usage:
1. `portfolio_views` - Track visits
2. `portfolio_analytics` - Monthly stats

### Full (Complete Platform):
Add all 9 tables for complete functionality

### Budget (Don't Need Yet):
Skip `users` and `user_portfolios` for now (add later when you add authentication)

---

## 🔐 Security Features Included

- ✅ Row-Level Security (RLS) on all tables
- ✅ Public read policies (anyone can view portfolios)
- ✅ Insert-only access for visitors (can add comments/views)
- ✅ Unique constraints (prevent duplicate slugs, etc.)
- ✅ Foreign keys (data integrity)
- ✅ Indexes (fast queries)

---

## 📞 Support

**Questions?** Refer to:
- `DATABASE_SETUP_GUIDE.md` - How to setup
- `lib/supabase-extended.ts` - Function examples
- Supabase Docs - https://supabase.com/docs

---

## ✅ Checklist

- [ ] Understand the 9 tables and their purposes
- [ ] Decide which tables to add (Phase 2 recommended)
- [ ] Open `supabase_complete_migration.sql`
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify tables appear in Table Editor
- [ ] Test with a sample query
- [ ] Import `supabase-extended.ts` in your app
- [ ] Start using the new functions!

---

**Status**: 📌 Ready to deploy additional tables

Choose what to add based on your needs, or add everything for a complete platform!
