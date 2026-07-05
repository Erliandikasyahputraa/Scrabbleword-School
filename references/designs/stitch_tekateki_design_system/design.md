# TekaTeki Design System
## Vision
TekaTeki is a modern EdTech platform where learning feels enjoyable, interactive, and premium.
The experience should resemble a polished SaaS product instead of a university project.
Students should feel motivated to learn.
Teachers should feel empowered to manage learning materials effortlessly.
The interface should communicate:
- Simplicity
- Calmness
- Productivity
- Professionalism
- Trust
- Delight
---
# Design Principles
1. Content First
Content is the hero.
Never overwhelm users with decoration.
2. Spacious Layout
Large whitespace.
Comfortable reading.
Avoid crowded interfaces.
3. Soft Depth
Cards should float subtly.
No heavy shadows.
4. Friendly Learning
Rounded shapes.
Bright colors.
Soft gradients.
Accessible typography.
5. Motion with Purpose
Animations guide attention.
Never distract.
---
# Visual Language
## Inspiration
- Google Material Design 3
- Google Classroom
- Linear
- Stripe Dashboard
- Notion
- Arc Browser
- Raycast
Do NOT imitate them directly.
Combine their best characteristics into a unique identity.
---
# Personality
The interface should feel:
Professional
Minimal
Playful
Friendly
Premium
Elegant
Organized
Calm
---
# Color Palette
## Background
Primary Background
#F8FAFC
Secondary Background
#FFFFFF
Surface
#FFFFFF
Sidebar
#FFFFFF
Hover
#F1F5F9
---
## Brand Colors
Primary
#4285F4
Primary Hover
#1A73E8
Success
#34A853
Warning
#FBBC05
Danger
#EA4335
Purple Accent
#7C3AED
---
## Text
Primary
#111827
Secondary
#6B7280
Placeholder
#94A3B8
Disabled
#CBD5E1
---
## Border
#E2E8F0
---
# Radius
Small
12px
Medium
16px
Large
24px
Buttons
16px
Cards
24px
Input
16px
Dialog
28px
---
# Elevation
Never use heavy shadows.
Cards:
shadow-sm
Hover:
shadow-lg
Large panels:
shadow-xl
Opacity should remain subtle.
---
# Typography
Use:
Inter
Fallback:
Roboto
Hierarchy:
Display
48
Headline
36
Section
28
Card
20
Body
16
Caption
14
Buttons
15
Line height should feel open.
---
# Iconography
Use Lucide React only.
Outlined icons.
Consistent stroke width.
No filled icons.
---
# Components
## Buttons
Large
Rounded
Soft shadow
Google Blue
Animated hover
Hover lift
Hover scale
Active press
---
## Cards
Rounded 2xl
Soft shadow
White
Thin border
Optional glass effect
Hover elevation
---
## Input
Large height
Rounded xl
Focus ring
Animated border
Placeholder animation
---
## Navigation
Floating Sidebar
Sticky Topbar
Rounded navigation items
Animated active indicator
Profile dropdown
Search
Notifications
---
# Dashboard
The dashboard should immediately answer:
What should I do today?
Include:
Hero section
Statistics
Recent activity
Learning progress
Quick actions
Course cards
Calendar preview
Announcements
Goal tracker
---
# Teacher Dashboard
Display:
Total Students
Total Courses
Crosswords
Learning Materials
Completion Rate
Recent Uploads
Quick Create
Analytics
Latest Activities
---
# Student Dashboard
Display:
Continue Learning
Today's Goal
Learning Streak
Progress Ring
Recent Materials
Recommended Courses
Achievements
Recent Activity
Upcoming Deadlines
---
# Course Detail
Hero Banner
Teacher Information
Course Thumbnail
Progress
Course Description
Timeline
Chapter Cards
Estimated Time
Difficulty
Badges
Sticky Action Button
---
# Learning Portal
Two-column layout.
Left
PDF Reader
Toolbar
Bookmarks
Search
Zoom
Sticky
Resizable
Right
Crossword
Current Clue
Hint
Timer
Score
Progress
Completion Animation
---
# Login
Split layout.
Left
Illustration
Brand Story
Feature Highlights
Gradient Background
Right
Floating Login Card
Animated Inputs
Social Login Placeholder
Remember Me
Forgot Password
---
# Register
Same design language as Login.
---
# Motion
Hover Duration
300ms
Page Transition
Fade
Cards
Lift
Buttons
Scale
Navigation
Slide
Dropdown
Fade + Scale
---
# Responsive
Desktop
Laptop
Tablet
Mobile
Maintain the same visual language.
No hidden functionality.
---
# Accessibility
Minimum contrast AA.
Keyboard navigation.
Visible focus state.
44px minimum touch targets.
---
# Coding Rules
Use TailwindCSS v4.
No external UI framework.
No inline CSS.
No duplicated components.
Prefer reusable components.
Business logic must remain untouched.
Only redesign the presentation layer.

# Anti Patterns
Avoid:
- Dark dashboards
- Bootstrap style layouts
- Empty whitespace without purpose
- Giant hero sections
- Heavy shadows
- Glassmorphism everywhere
- Neon colors
- Oversized icons
- Generic CRUD tables
- Flat cards
- Square buttons
- Inconsistent spacing
- AI-generated looking dashboards
- Overly playful illustrations
- Excessive gradients
- Dense interfaces
Every screen should resemble a premium SaaS product built by Google's Workspace team.