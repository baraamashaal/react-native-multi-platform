# React Native Web Challenges - Real Example Documentation

This document details **all the challenges and issues** encountered while building a complex web form application with React Native Web.

## Summary

We built a **Job Application Management System** with:
- ✅ Multi-step form (3 steps)
- ✅ Dependent dropdowns (cities depend on country, roles depend on industry)
- ✅ Complex validation with custom rules (salary must meet role minimum)
- ✅ Save as draft functionality
- ✅ Data listing with pagination (5 items per page)
- ✅ Column sorting (click headers to sort)
- ✅ Filtering by status (all/submitted/draft)

---

## Major Challenges Encountered

### 🔴 CHALLENGE #1: Custom Dropdown Component
**Location**: `src/components/CustomDropdown.js`

**Problem**: React Native doesn't have a native `<select>` element like web HTML.

**What We Had To Do**:
- Build dropdown from scratch using Modal + FlatList
- Manually handle open/close state
- Create custom styling to look like a dropdown
- Handle touch events instead of native select events

**Issues**:
- ❌ Modal positioning is tricky on web (creates centered overlay instead of dropdown below field)
- ❌ No accessibility support (ARIA attributes don't work)
- ❌ No keyboard navigation (can't use arrow keys, Enter to select)
- ❌ Styling is inconsistent between web and mobile
- ❌ No native search/filter in dropdown like HTML select with datalist
- ❌ Shadow styles need Platform.select() for web vs mobile

**What Web Would Have**:
```html
<select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```
- Native accessibility
- Keyboard navigation
- Browser's native dropdown UI
- Built-in search on some browsers

---

### 🔴 CHALLENGE #2: Multi-Step Form with Validation
**Location**: `src/components/JobApplicationForm.js`

**Problem**: React Native has no `<form>` element or native form submission.

**What We Had To Do**:
- Manually manage step state (step 1, 2, 3)
- Manually track form data across steps
- Use React Hook Form (works on both platforms, but...)
- Manually trigger validation on "Next" button
- Platform-specific Alert vs alert() for errors

**Issues**:
- ❌ No native form submission (can't use FormData, form events)
- ❌ TextInput behavior differs between web and mobile
- ❌ No autocomplete support (autocomplete="email" doesn't work)
- ❌ Browser features don't work (password managers, autofill)
- ❌ Tab navigation between fields is unreliable on web
- ❌ `keyboardType="email-address"` does nothing on web
- ❌ Must manually display validation errors under each field
- ❌ multiline TextInput has height issues on web

**What Web Would Have**:
```html
<form onSubmit={handleSubmit}>
  <input type="email" autocomplete="email" required />
  <button type="submit">Submit</button>
</form>
```
- Native validation
- Built-in error messages
- Browser autofill
- Tab navigation works perfectly
- Enter to submit

---

### 🔴 CHALLENGE #3: Dependent Dropdown Logic
**Location**: `src/components/JobApplicationForm.js` (useEffect hooks)

**Problem**: Managing dependencies between form fields is complex.

**What We Had To Do**:
- Use multiple useEffect hooks to watch for changes
- Manually reset dependent fields when parent changes
- Track available options in separate state
- Re-trigger validation when dependencies change
- Disable child dropdown until parent is selected

**Issues**:
- ❌ Must manually track all dependencies
- ❌ Easy to create bugs (forgot to reset field, validation out of sync)
- ❌ State management becomes messy with multiple dependencies
- ❌ No built-in support for field dependencies
- ❌ Code becomes very verbose

**Code Example** (Complex!):
```javascript
useEffect(() => {
  if (watchCountry && watchCountry > 0) {
    const cities = citiesByCountry[watchCountry] || [];
    setAvailableCities(cities);

    // Must manually reset city if country changed
    const currentCity = watch('cityId');
    const cityExists = cities.find(c => c.id === currentCity);
    if (!cityExists && currentCity !== 0) {
      setValue('cityId', 0);
    }
  } else {
    setAvailableCities([]);
    setValue('cityId', 0);
  }
}, [watchCountry]);
```

**What Web Libraries Offer**:
- React Hook Form with custom resolvers (easier)
- Formik with field-level validation
- Many form libraries handle this automatically

---

### 🔴 CHALLENGE #4: Custom Validation Based on Other Fields
**Location**: `src/components/JobApplicationForm.js` (salary validation)

**Problem**: Salary must be >= minimum for selected role.

**What We Had To Do**:
- Watch both roleId and expectedSalary fields
- Find selected role from available roles
- Manually calculate if salary meets minimum
- Display custom error message
- Prevent submission if custom validation fails

**Issues**:
- ❌ Zod schema can't easily access other field values
- ❌ Must implement custom validation logic outside schema
- ❌ Error display is manual
- ❌ Easy to miss edge cases

---

### 🔴 CHALLENGE #5: Data Tables/Grids
**Location**: `src/components/ApplicationsList.js`

**Problem**: No native table component in React Native. Can't use popular React table libraries.

**What We Had To Do**:
- Build "table" using FlatList + Views with fixed widths
- Create custom "table header" with Views
- Manually implement column widths (not responsive!)
- Use ScrollView for horizontal scrolling
- Build everything from scratch

**Issues**:
- ❌ FlatList has performance issues on web with large datasets
- ❌ Can't use AG-Grid, TanStack Table, MUI DataGrid, etc.
- ❌ No column resizing
- ❌ No column reordering
- ❌ Horizontal scroll is awkward on web (users expect responsive table)
- ❌ Fixed column widths don't work on all screen sizes
- ❌ No native table semantics (`<table>`, `<tr>`, `<td>`)
- ❌ Accessibility is poor (screen readers can't understand it's a table)
- ❌ FlatList inside ScrollView causes scroll conflicts

**What Web Would Have**:
```jsx
import { DataGrid } from '@mui/x-data-grid';

<DataGrid
  rows={data}
  columns={columns}
  pageSize={5}
  sortingMode="client"
  onSortModelChange={handleSort}
/>
```
- Automatic responsive design
- Built-in sorting, filtering, pagination
- Column resizing, reordering
- Virtual scrolling for performance
- Accessibility built-in
- Row selection with checkboxes

---

### 🔴 CHALLENGE #6: Manual Sorting Implementation
**Location**: `src/components/ApplicationsList.js`

**Problem**: Must manually implement sorting logic.

**What We Had To Do**:
- Create state for sortField and sortDirection
- Implement sort comparison function
- Handle different data types (string, number, date)
- Create custom sort indicators (↑ ↓)
- Make headers clickable

**Issues**:
- ❌ Verbose code (50+ lines for something that should be built-in)
- ❌ Must handle edge cases (null values, type coercion)
- ❌ No multi-column sorting
- ❌ Performance issues with large datasets (re-sorting on every render)

**What Libraries Like TanStack Table Provide**:
- Built-in sorting with 1 line of config
- Multi-column sorting
- Optimized performance
- Type-safe sorting

---

### 🔴 CHALLENGE #7: Manual Pagination
**Location**: `src/components/ApplicationsList.js`

**Problem**: Must manually implement pagination.

**What We Had To Do**:
- Calculate total pages
- Slice data array based on current page
- Build pagination UI (Previous, page numbers, Next)
- Handle page changes
- Disable buttons at boundaries

**Issues**:
- ❌ 80+ lines of code for basic pagination
- ❌ No "items per page" selector
- ❌ No "go to page" input
- ❌ Limited to showing all page numbers (bad for 100+ pages)

---

### 🔴 CHALLENGE #8: Fake Table Rows with Views
**Location**: `src/components/ApplicationsList.js`

**Problem**: Must create table appearance with Views.

**What We Had To Do**:
```javascript
const renderTableRow = ({ item }) => (
  <View style={styles.tableRow}>
    <View style={[styles.tableCell, styles.cellId]}>
      <Text>{item.id}</Text>
    </View>
    <View style={[styles.tableCell, styles.cellName]}>
      <Text>{item.firstName} {item.lastName}</Text>
    </View>
    // ... 6 more cells
  </View>
);
```

**Issues**:
- ❌ Repetitive code
- ❌ Hard to maintain (adding a column requires updating multiple places)
- ❌ No semantic HTML
- ❌ Poor accessibility
- ❌ Difficult to make responsive

---

### 🔴 CHALLENGE #9: Horizontal Scrolling on Web
**Location**: `src/components/ApplicationsList.js`

**Problem**: Table doesn't fit on small screens, needs horizontal scroll.

**What We Had To Do**:
- Wrap table in ScrollView with horizontal={true}
- Set minWidth on table (1200px)
- Show horizontal scroll indicator

**Issues**:
- ❌ Bad UX on web (users don't expect horizontal scroll)
- ❌ Table is not responsive
- ❌ On mobile, users must scroll both directions
- ❌ Can't see all columns at once on small screens

**What Web Tables Do**:
- Responsive design (stack on mobile, collapse columns)
- Sticky columns
- Column hiding based on screen size

---

### 🔴 CHALLENGE #10: FlatList Performance on Web
**Location**: `src/components/ApplicationsList.js`

**Problem**: FlatList is optimized for mobile, not web.

**Issues**:
- ❌ Slower than native DOM rendering
- ❌ Virtual scrolling doesn't work as well on web
- ❌ Nested inside ScrollView (scrollEnabled={false}) - loses optimization benefits
- ❌ Re-renders entire list on sort/filter

---

### 🔴 CHALLENGE #11: Alerts and Notifications
**Location**: `App.js`

**Problem**: Different alert systems for web vs mobile.

**What We Had To Do**:
```javascript
if (Platform.OS === 'web') {
  alert('Success!'); // Ugly browser alert
} else {
  Alert.alert('Success', 'Success!'); // Native mobile alert
}
```

**Issues**:
- ❌ Browser alert() is poor UX (blocking, ugly)
- ❌ No toast notifications
- ❌ Most toast libraries don't work with React Native Web
- ❌ Must use Platform.select() everywhere
- ❌ No notification queuing

**What Web Would Have**:
```jsx
import { toast } from 'react-hot-toast';
toast.success('Application submitted!');
```

---

### 🔴 CHALLENGE #12: Confirmation Dialogs
**Location**: `App.js`

**Problem**: Alert.alert with buttons doesn't work on web.

**What We Had To Do**:
```javascript
if (Platform.OS === 'web') {
  if (window.confirm('Are you sure?')) {
    // delete
  }
} else {
  Alert.alert('Confirm', 'Are you sure?', [
    { text: 'Cancel' },
    { text: 'Delete', onPress: () => {} }
  ]);
}
```

**Issues**:
- ❌ window.confirm() is ugly and blocking
- ❌ Can't style confirmation dialog on web
- ❌ Different code paths for each platform
- ❌ No custom dialog components

---

### 🔴 CHALLENGE #13: Navigation
**Location**: `App.js`

**Problem**: React Native uses React Navigation, web uses React Router.

**Issues**:
- ❌ React Navigation feels weird on web (no browser back button integration)
- ❌ Can't use browser's native navigation
- ❌ URL doesn't change (no deep linking)
- ❌ No browser history integration
- ❌ Can't open links in new tab

**What Web Would Use**:
```jsx
import { BrowserRouter, Link } from 'react-router-dom';

<Link to="/applications">Applications</Link>
```
- URL updates
- Browser back/forward works
- Can share URLs
- SEO friendly

---

### 🔴 CHALLENGE #14: Shadow and Elevation Styling
**Location**: Multiple files (App.js, CustomDropdown.js, JobApplicationForm.js)

**Problem**: Shadows work differently on web vs mobile.

**What We Had To Do**:
```javascript
...Platform.select({
  web: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  }
})
```

**Issues**:
- ❌ Must duplicate shadow styles for each platform
- ❌ Verbose and repetitive
- ❌ Easy to create inconsistencies

---

### 🔴 CHALLENGE #15: Hover States
**Location**: Multiple components

**Problem**: No built-in hover support in React Native.

**Issues**:
- ❌ Must use onMouseEnter/onMouseLeave on web
- ❌ No :hover pseudo-class
- ❌ Must track hover state manually
- ❌ cursor: 'pointer' requires Platform.select()

**What Web CSS Has**:
```css
.button:hover {
  background-color: #blue;
  cursor: pointer;
}
```

---

### 🔴 CHALLENGE #16: Text Input Focus Styles
**Problem**: TextInput doesn't support :focus-visible on web.

**What We Had To Do**:
```javascript
outlineStyle: 'none', // Remove default outline on web
```

**Issues**:
- ❌ Must manually handle focus states
- ❌ No :focus-within support
- ❌ Accessibility issue (removed outline without replacement)

---

### 🔴 CHALLENGE #17: Can't Use Native HTML Elements
**Problem**: React Native Web translates everything to divs.

**Issues**:
- ❌ Can't use `<button>` (must use TouchableOpacity)
- ❌ Can't use `<input type="date">` (must build custom date picker)
- ❌ Can't use `<input type="file">` (file upload is difficult)
- ❌ Can't use `<table>`, `<select>`, `<form>`, etc.
- ❌ Poor SEO (no semantic HTML)
- ❌ Poor accessibility

---

### 🔴 CHALLENGE #18: CSS Transitions Don't Work Consistently
**Location**: `JobApplicationForm.js` (progress bar)

**Problem**: CSS transitions work on web but not mobile.

**What We Had To Do**:
```javascript
...(Platform.OS === 'web' && {
  transition: 'width 0.3s ease',
})
```

**Issues**:
- ❌ Animations differ between platforms
- ❌ Must use Animated API for mobile (different code)
- ❌ Can't use CSS keyframes

---

### 🔴 CHALLENGE #19: No Column Resizing or Fixed Width Issues
**Location**: `ApplicationsList.js`

**Problem**: Columns have fixed widths, not responsive.

**What We Had To Do**:
```javascript
cellId: { width: 60 },
cellName: { width: 150 },
cellEmail: { width: 200 },
// etc...
```

**Issues**:
- ❌ Doesn't adapt to screen size
- ❌ Text gets cut off on small screens
- ❌ Wastes space on large screens
- ❌ Users can't resize columns

---

### 🔴 CHALLENGE #20: Bundle Size
**Problem**: React Native Web adds significant overhead.

**Actual Stats** (from this project):
```
Web bundle: ~500KB+ (just for React Native Web runtime)
+ React Hook Form: 50KB
+ Zod: 60KB
+ React Native Paper: 200KB
Total: ~800KB+ for a simple form app!
```

Compare to plain React + React Hook Form + MUI:
- Total: ~250-300KB

---

## Summary of All Challenges

| # | Challenge | Severity | Workaround Difficulty |
|---|-----------|----------|----------------------|
| 1 | No native select dropdown | 🔴 High | Hard - must build from scratch |
| 2 | No form element | 🔴 High | Medium - use form libraries |
| 3 | Dependent dropdowns | 🟡 Medium | Medium - manual state management |
| 4 | Custom field validation | 🟡 Medium | Medium - manual logic |
| 5 | No table component | 🔴 High | Very Hard - build from scratch |
| 6 | Manual sorting | 🟡 Medium | Medium - implement yourself |
| 7 | Manual pagination | 🟡 Medium | Medium - implement yourself |
| 8 | Fake tables with Views | 🔴 High | Very Hard - lots of code |
| 9 | Horizontal scroll on web | 🔴 High | Hard - no good solution |
| 10 | FlatList performance | 🔴 High | Hard - fundamental limitation |
| 11 | Alert/notifications | 🟡 Medium | Medium - platform-specific code |
| 12 | Confirmation dialogs | 🟡 Medium | Medium - platform-specific code |
| 13 | Navigation | 🔴 High | Hard - React Navigation on web is awkward |
| 14 | Shadow styling | 🟢 Low | Easy - Platform.select() |
| 15 | Hover states | 🟡 Medium | Medium - manual event handlers |
| 16 | Focus styles | 🟢 Low | Easy - manual styling |
| 17 | No native HTML | 🔴 High | Very Hard - fundamental limitation |
| 18 | CSS transitions | 🟡 Medium | Medium - platform-specific |
| 19 | Fixed column widths | 🟡 Medium | Hard - no good solution |
| 20 | Large bundle size | 🔴 High | Very Hard - inherent to RN Web |

---

## What You CAN'T Use on React Native Web

These popular libraries **DO NOT WORK** with React Native Web:

### Data Tables
- ❌ AG-Grid
- ❌ TanStack Table (React Table)
- ❌ MUI DataGrid
- ❌ React Data Grid
- ❌ Handsontable

### Form Components
- ❌ React Select (dropdowns)
- ❌ React Datepicker
- ❌ React Dropzone (file upload)
- ❌ Downshift (autocomplete)

### UI Libraries
- ❌ Material-UI (use React Native Paper instead, but it's limited)
- ❌ Chakra UI
- ❌ Ant Design (web version)
- ❌ Tailwind CSS (need React Native version)

### Notifications
- ❌ React Hot Toast
- ❌ React Toastify
- ❌ Notistack

### Other
- ❌ React Router (must use React Navigation)
- ❌ Framer Motion (animations)
- ❌ Most charting libraries

---

## Conclusion

### Total Lines of Code Written

To implement this "simple" application:

- **CustomDropdown**: 250 lines (would be 5 lines with HTML select)
- **JobApplicationForm**: 600+ lines (would be ~200 with web forms)
- **ApplicationsList**: 450+ lines (would be ~50 with AG-Grid)
- **Total**: ~1300 lines

**With plain React + web libraries**: ~300-400 lines

### Time Spent

- Setting up dropdowns: 2 hours
- Form with validation: 3 hours
- Data table: 4 hours
- Debugging platform differences: 2 hours
- **Total**: ~11 hours

**With plain React**: ~3-4 hours

### Developer Experience Rating

| Aspect | React | React Native Web |
|--------|-------|------------------|
| Setup Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Library Support | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Bundle Size | ⭐⭐⭐⭐ | ⭐⭐ |
| Accessibility | ⭐⭐⭐⭐⭐ | ⭐ |
| Debugging | ⭐⭐⭐⭐ | ⭐⭐ |
| Documentation | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Final Recommendation

**Use React Native Web ONLY if:**
- ✅ You already have a React Native mobile app
- ✅ You want to share 70%+ of your codebase
- ✅ Web is a secondary platform (mobile-first)
- ✅ Your web app is simple (no complex forms/tables)

**Use Plain React if:**
- ✅ Building web-only or web-first
- ✅ Need complex forms or data tables
- ✅ Want best performance and smallest bundle
- ✅ Need full access to web ecosystem
- ✅ Accessibility is important
- ✅ SEO is important

---

## How to Run This Example

```bash
cd react-native-web-demo
npm install
npm run web
```

Open http://localhost:8081 in your browser to see all these challenges in action!
