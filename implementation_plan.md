# Implementation Plan: Reflective Practice Integration

## [Overview]

Integrate an optional Reflective Practice text field into the birth delivery recording process.

The goal is to allow midwives to record reflective notes for each delivery. This field will be integrated into the `DeliveryModal` as an optional, initially hidden section that expands with an animation when the user clicks a toggle button. This ensures the modal remains concise for quick entries while providing space for detailed reflection when needed.

## [Types]

Update the `SlotData` interface to support reflective notes.

- `SlotData` interface in `src/types.ts`:
  - Add `reflectivePractice?: string`: An optional string to store the reflective notes for a specific delivery slot.

## [Files]

Modify existing files to implement the new field and its animation.

- `src/types.ts`: Update `SlotData` interface.
- `src/components/DeliveryModal.tsx`:
  - Add state for the reflective practice text.
  - Add state for the expansion toggle.
  - Implement the animated UI section using `motion`.
  - Update save and initialization logic.

## [Functions]

Modify functions within `DeliveryModal.tsx` to handle the new data.

- `DeliveryModal` (component):
  - `useEffect`: Update to initialize `localReflectivePractice` from `slot.reflectivePractice`.
  - `handleSave`: Update to include `reflectivePractice: localReflectivePractice` in the `onUpdate` call.

## [Classes]

No class modifications required.

## [Dependencies]

Utilize existing dependencies for animation.

- `motion`: Use the already installed `motion` (Framer Motion) library to handle the smooth expansion and collapse of the reflective practice text area.

## [Testing]

Verify the feature through manual UI testing and state persistence.

- **UI Testing**:
  - Open `DeliveryModal` and verify the Reflective Practice section is hidden by default.
  - Click the expand button and verify the text area appears with a smooth animation.
  - Enter text and save; verify the modal closes.
  - Re-open the same slot and verify the reflective notes are preserved and can be edited.
- **Persistence**: Verify that the data is correctly saved to `localStorage` via the `useBirthTracker` hook.

## [Implementation Order]

Sequential steps to ensure stability.

1. **Type Update**: Add `reflectivePractice` to `SlotData` in `src/types.ts`.
2. **State Integration**: Add `localReflectivePractice` and `isExpanded` states to `DeliveryModal.tsx`.
3. **Initialization Logic**: Update `useEffect` in `DeliveryModal.tsx` to load existing reflective notes.
4. **UI Implementation**:
   - Add the toggle button in `DeliveryModal.tsx`.
   - Implement the animated `motion.div` containing the `textarea`.
5. **Persistence Logic**: Update `handleSave` in `DeliveryModal.tsx` to persist the reflective notes.
6. **Final Polish**: Style the text area and button to match the existing aesthetic (stone/pink/blue theme).
