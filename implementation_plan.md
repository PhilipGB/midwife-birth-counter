# Implementation Plan

[Overview]
Implement a "Night Shift" (Warm Dark Theme) toggle for the birth counter application.

The goal is to provide a visually comfortable dark mode that remains thematically consistent with the current warm, natural aesthetic. This involves introducing a theme state, persisting this state to local storage, and updating the CSS/component styles to respond to this state. The implementation will focus on using a CSS variable-based approach or Tailwind dark mode classes to ensure a smooth transition.

[Types]  
Introduce a new theme type and update the tracker state to include theme preference.

- `ThemeMode`: `'light' | 'dark'`
- `TrackerState` (Interface): Add `theme: ThemeMode` field to persist the user's preference.

[Files]
Modify existing styles and core components to support the theme toggle.

- `src/index.css`: Define dark theme color variables and global styles for dark mode.
- `src/App.tsx`: Implement the theme state management, persistence logic, and add the theme toggle UI.
- `src/components/StatsPanel.tsx`: Update styles for dark mode compatibility.
- `src/components/Board.tsx`: Update styles and engraved text colors for dark mode.
- `src/components/DeliveryModal.tsx`: Update modal background and text colors for dark mode.
- `src/components/ResetConfirmation.tsx`: Update confirmation dialog styles for dark mode.
- `src/components/ClearSlotConfirmation.tsx`: Update confirmation dialog styles for dark mode.
- `src/hooks/useBirthTracker.ts`: Add theme state to the hook and update local storage sync logic.

[Functions]
Update hooks and components to handle theme switching.

- `useBirthTracker` (in `src/hooks/useBirthTracker.ts`):
  - Add `theme` state.
  - Update `useEffect` for loading from `localStorage` to include the theme.
  - Update `useEffect` for saving to `localStorage` to include the theme.
  - Add `setTheme` action to the returned actions object.
- `App` component (in `src/App.tsx`):
  - Implement a handler to toggle between 'light' and 'dark' themes.
  - Apply the theme class (e.g., `dark`) to the root wrapper element.

[Classes]
No new classes are being introduced. Modified Tailwind utility classes will be used for styling.

- Modified styles in `App.tsx`, `Board.tsx`, `StatsPanel.tsx`, and Modals to include `dark:` variant classes (e.g., `bg-white` becomes `bg-white dark:bg-stone-900`).

[Dependencies]
No new dependencies are required.

[Testing]
Verify visual consistency and persistence across sessions.

- Manual test: Toggle the theme and verify that colors transition correctly across the whole app.
- Persistence test: Enable night shift mode, refresh the page, and verify it remains active.
- Component check: Ensure the "engraved" text on the wood board remains legible in dark mode.

[Implementation Order]
Sequence of changes to ensure stable integration.

1. Update `src/types.ts` to include `ThemeMode`.
2. Update `src/hooks/useBirthTracker.ts` to manage and persist the theme state.
3. Update `src/index.css` to define dark mode base styles.
4. Implement the theme toggle UI and logic in `src/App.tsx`.
5. Progressively update `StatsPanel`, `Board`, and all Modal components with `dark:` utility classes.
6. Perform final visual verification of the "Warm Dark" palette.
