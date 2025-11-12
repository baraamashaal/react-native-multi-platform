# React Native Web - Complex Form Example

A real-world example demonstrating the **challenges and limitations** of building complex web applications with React Native Web.

## What This Demo Includes

This is a **Job Application Management System** featuring:

✅ **Multi-step form** (3 steps with progress bar)
- Step 1: Personal Information
- Step 2: Location Details
- Step 3: Professional Information

✅ **Dependent dropdowns**
- Cities depend on selected country
- Job roles depend on selected industry

✅ **Complex validation**
- Field-level validation with Zod
- Cross-field validation (salary must meet role minimum)
- Real-time validation feedback

✅ **Save as draft** functionality

✅ **Data listing** with:
- Pagination (5 items per page)
- Column sorting (click headers)
- Filtering by status (all/submitted/draft)
- Edit and delete actions

## 🎯 Purpose

This example is designed to show you the **real challenges** you'll face when using React Native Web for complex web applications. Every major pain point is documented in the code with comments.

## 📖 Documentation

**See [CHALLENGES.md](./CHALLENGES.md)** for a comprehensive breakdown of all 20+ challenges encountered, including:

- Custom dropdown issues
- Form handling problems
- Data table nightmares
- Platform-specific workarounds
- Bundle size concerns
- Missing web features
- Library incompatibilities

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run on web
npm run web

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android
```

### Access the App

After running `npm run web`, open:
- **Web**: http://localhost:8081

## 📁 Project Structure

```
react-native-web-demo/
├── src/
│   ├── components/
│   │   ├── CustomDropdown.js      # Custom dropdown (no native select)
│   │   ├── JobApplicationForm.js  # Multi-step form with validation
│   │   └── ApplicationsList.js    # Data table with sort/pagination
│   ├── data/
│   │   └── mockData.js            # Sample data
│   └── utils/
│       └── validation.js          # Zod validation schemas
├── App.js                         # Main app with navigation
├── CHALLENGES.md                  # Detailed documentation of issues
└── README.md                      # This file
```

## 🔍 Key Files to Review

### 1. CustomDropdown.js
Shows why building a dropdown from scratch is necessary and all the issues with it:
- No native `<select>` element
- Modal positioning problems
- Missing accessibility
- No keyboard navigation

### 2. JobApplicationForm.js
Demonstrates form challenges:
- No `<form>` element
- Manual step management
- Dependent field logic
- Platform-specific alerts

### 3. ApplicationsList.js
Reveals data table nightmares:
- FlatList performance on web
- Manual sorting/pagination
- Fixed column widths
- Horizontal scroll issues
- Can't use AG-Grid or TanStack Table

## ⚠️ Challenges You'll See

Open the app and try these scenarios to experience the issues:

### 1. Dropdown Issues
- Click any dropdown
- Notice: Modal overlay (not native dropdown feel)
- Try: Keyboard navigation (doesn't work)
- Compare: To a native HTML `<select>`

### 2. Form Validation
- Try submitting Step 1 with empty fields
- Notice: Manual error display under each field
- Try: Browser autofill (doesn't work)
- Try: Tab between fields (unreliable)

### 3. Dependent Fields
- Step 2: Select a country first, then city appears
- Step 3: Select industry first, then roles appear
- Notice: Complex logic required for simple dependency

### 4. Data Table
- View the Applications List
- Notice: Horizontal scroll on small screens (bad UX)
- Try: Resizing columns (can't do it)
- Try: Selecting rows (no checkboxes)
- Click: Column headers to sort

### 5. Platform Differences
- Look at alerts (ugly browser alert() instead of toast)
- Check styling (shadows use Platform.select)
- View console for "CHALLENGE" comments

## 📊 Stats

| Metric | This Example | Plain React Equivalent |
|--------|--------------|------------------------|
| Lines of Code | ~1,300 | ~300-400 |
| Development Time | ~11 hours | ~3-4 hours |
| Bundle Size | ~800KB+ | ~250-300KB |
| Dependencies | 739 packages | ~100 packages |

## 🛠️ Technologies Used

- **React Native Web** - Run React Native on web
- **Expo** - React Native framework
- **React Hook Form** - Form management
- **Zod** - Validation schema
- **React Native Paper** - UI components

## ❌ What You CAN'T Use

These popular web libraries don't work with React Native Web:

### Data Tables
- AG-Grid
- TanStack Table
- MUI DataGrid

### Form Components
- React Select
- React Datepicker
- React Dropzone

### UI Frameworks
- Material-UI (web version)
- Chakra UI
- Tailwind CSS (need RN version)

### Other
- React Router (must use React Navigation)
- React Hot Toast
- Framer Motion

## 💡 Key Takeaways

After building this example, you'll understand:

1. **When to use React Native Web**:
   - Only if you have an existing React Native app
   - Only if web is secondary to mobile
   - Only if your web needs are simple

2. **When NOT to use it**:
   - Complex web forms ❌
   - Data-heavy tables ❌
   - Web-first applications ❌
   - SEO-critical sites ❌
   - Accessibility requirements ❌

3. **The reality**:
   - You'll write 3-4x more code
   - Development takes 2-3x longer
   - You'll fight platform differences constantly
   - Many web features are impossible
   - Bundle size is huge

## 🔗 Useful Resources

- [CHALLENGES.md](./CHALLENGES.md) - Full challenge documentation
- [React Native Web Docs](https://necolas.github.io/react-native-web/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## 🤔 Questions?

This demo is intentionally showing the **painful** parts of React Native Web. If you're considering using React Native Web for a complex web application, **please read CHALLENGES.md first**.

## 📝 License

MIT - Feel free to use this as a reference for your own evaluation of React Native Web.

---

**Remember**: This example exists to educate, not to discourage. React Native Web can be great for the right use case - just make sure you understand the tradeoffs before committing!
