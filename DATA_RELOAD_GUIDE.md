## Data Reload System Documentation

This document explains how to handle data reloading after mutations in your application.

### Overview

The data reload system consists of three main utilities:

1. **`useDataReload` hook** - For reloading SWR-managed data
2. **`handleMutation` function** - For handling mutations with automatic data reloading and toast notifications
3. **`mutation-handler` utilities** - Helper functions for form submissions and mutations

---

## Usage Examples

### 1. Using `handleMutation` (Recommended)

The `handleMutation` function is the simplest and most comprehensive way to handle mutations:

```typescript
// In your component or column definition
import { handleMutation } from "@/lib/mutation-handler";
import { updateById } from "@/lib/actions/product_actions";

const onSubmit = async (data: ProductUpdate) => {
  try {
    await handleMutation(
      () => updateById(productId, data),
      {
        successMessage: "Product updated successfully",
        errorMessage: "Failed to update product",
        reloadKey: "/products", // The SWR key to revalidate
      }
    );
  } catch {
    // Error is already handled by handleMutation
  }
};
```

### 2. Using `useDataReload` Hook

Use this hook when you need more control over data reloading:

```typescript
import { useDataReload } from "@/hooks/useDataReload";

export function MyComponent() {
  const { reloadProducts, reloadEmployees, reload } = useDataReload();

  const handleUpdate = async (data: ProductUpdate) => {
    const result = await updateById(productId, data);
    if (result.success) {
      await reloadProducts(); // Reload products data
      toast.success("Updated!");
    }
  };

  return (
    <button onClick={handleUpdate}>Update</button>
  );
}
```

### 3. Using `handleMutation` with Custom Callbacks

```typescript
await handleMutation(
  () => updateById(productId, data),
  {
    successMessage: "Product updated",
    reloadKey: "/products",
    onSuccess: () => {
      console.log("Update completed");
      // Additional actions after reload
    },
    onError: (error) => {
      console.error("Update failed:", error);
      // Custom error handling
    },
  }
);
```

### 4. Handling Form Submissions

```typescript
import { handleFormSubmit } from "@/lib/mutation-handler";

const onSubmit = async (formData: ProductUpdate) => {
  await handleFormSubmit(
    formData,
    async (data) => updateById(productId, data),
    {
      successMessage: "Product saved successfully",
      reloadKey: "/products",
    }
  );
};
```

---

## API Reference

### `useDataReload()` Hook

```typescript
interface DataReloadHook {
  reloadProducts: () => Promise<void>;
  reloadEmployees: () => Promise<void>;
  reload: (key: string) => Promise<void>;
  reloadMultiple: (keys: string[]) => Promise<void>;
}
```

**Methods:**
- `reloadProducts()` - Reloads all products data
- `reloadEmployees()` - Reloads all employees data
- `reload(key)` - Reloads data for a specific SWR key
- `reloadMultiple(keys)` - Reloads multiple data keys simultaneously

### `handleMutation(fn, options)`

```typescript
interface MutationOptions {
  successMessage?: string;        // Default: "Operation successful"
  errorMessage?: string;          // Default: "Operation failed"
  reloadKey?: string;             // SWR key to revalidate after success
  onSuccess?: () => void;         // Callback after successful mutation
  onError?: (error: Error) => void; // Callback if mutation fails
}
```

---

## Best Practices

1. **Always provide descriptive messages**
   ```typescript
   successMessage: "Product updated successfully",
   errorMessage: "Failed to update product",
   ```

2. **Use appropriate SWR keys for reload**
   - `/products` for product list
   - `/employees` for employee list
   - `/api/endpoint` for custom endpoints

3. **Handle multiple data reloads if needed**
   ```typescript
   const { reloadMultiple } = useDataReload();
   await reloadMultiple(["/products", "/categories"]);
   ```

4. **Use callbacks for side effects**
   ```typescript
   onSuccess: () => {
     closeDialog();
     navigateToNewPage();
   }
   ```

---

## Migration from `router.refresh()`

**Before (page reload):**
```typescript
const res = await updateById(id, data);
if (res.error) {
  toast.error(res.error);
  return;
}
toast.success(res.message);
router.refresh(); // Reloads entire page
```

**After (data revalidation only):**
```typescript
await handleMutation(
  () => updateById(id, data),
  {
    successMessage: res.message || "Updated successfully",
    reloadKey: "/products",
  }
);
```

---

## SWR Keys in Your App

Common SWR keys used in the application:
- `/products` - Product list
- `/employees` - Employee list
- `/api/categories` - Categories list

When adding new data fetching, ensure consistent SWR key naming for easy reloading.
