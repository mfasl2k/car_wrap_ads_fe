# Toast Notification System

## Overview

This project now uses a modern **toast notification system** instead of browser alerts. Toasts are non-blocking, auto-dismissing notifications that appear in the top-right corner.

## Features

- ✅ **Non-blocking UI** - Doesn't pause code execution
- ✅ **Auto-dismiss** - Disappears after 3 seconds (customizable)
- ✅ **4 Types** - Success, Error, Info, Warning
- ✅ **Smooth animations** - Slides in from the right
- ✅ **Stackable** - Multiple toasts can appear simultaneously
- ✅ **Dismissible** - Click the X button to close early

## Usage

### Import the hook

```tsx
import { useToast } from "../../contexts/ToastContext";
```

### Use in your component

```tsx
export default function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  const handleInfo = () => {
    toast.info("Here is some information");
  };

  const handleWarning = () => {
    toast.warning("Please be careful!");
  };

  // Custom duration (in milliseconds)
  const handleCustomDuration = () => {
    toast.success("This will stay for 5 seconds", 5000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleWarning}>Show Warning</button>
    </div>
  );
}
```

## API Methods

### `toast.success(message, duration?)`

Shows a green success notification

- **message**: string - The message to display
- **duration**: number (optional) - Time in milliseconds (default: 3000)

### `toast.error(message, duration?)`

Shows a red error notification

### `toast.info(message, duration?)`

Shows a blue info notification

### `toast.warning(message, duration?)`

Shows a yellow warning notification

### `toast.showToast(message, type, duration?)`

Generic method that accepts any toast type

- **type**: 'success' | 'error' | 'info' | 'warning'

## Examples in Project

### Driver Profile (Profile Creation)

```tsx
// Old way ❌
alert("Profile created successfully!");

// New way ✅
toast.success("Profile created successfully!");
```

### Advertiser Profile (Update)

```tsx
// Old way ❌
alert("Profile updated successfully!");

// New way ✅
toast.success("Profile updated successfully!");
```

### Campaign Creation

```tsx
// Old way ❌
alert("Campaign created successfully!");

// New way ✅
toast.success("Campaign created successfully!");
```

### Error Handling

```tsx
// Old way ❌
alert("Failed to update campaign status");

// New way ✅
toast.error("Failed to update campaign status");
```

## Styling

Toast notifications are styled with Tailwind CSS and include:

- Color-coded backgrounds (green, red, yellow, blue)
- Appropriate icons for each type
- Smooth slide-in animation
- Drop shadow for depth
- Responsive sizing (min 300px, max 500px)

## Location

Toasts appear in the **top-right corner** of the screen and stack vertically if multiple notifications are shown.

## Implementation Files

- **Component**: `src/components/Toast.tsx`
- **Context**: `src/contexts/ToastContext.tsx`
- **Hook**: `useToast()` exported from ToastContext
- **Styles**: `src/index.css` (animation keyframes)
