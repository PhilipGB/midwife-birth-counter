# Midwife Birth Counter

A visually engaging, lightweight application designed for midwife students to track their delivery progress toward their qualification milestones.

## 🎯 Project Purpose

The Midwife Birth Counter provides a digital "progress board" that mimics a physical tracking board. It allows students to visually record each delivery, categorize them by gender, and track the date of each event. The primary goal is to provide a satisfying and intuitive way to visualize the journey toward completing the required 40 deliveries.

## 🛠 Technical Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (customized for a "wood board" aesthetic)
- **Animations**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) for delivery milestones
- **Persistence**: Browser `localStorage` API

## ✨ Core Features

- **Visual Progress Board**: A grid of 40 interactive footprint slots.
- **Delivery Tracking**:
  - Categorize deliveries as **Girl (Pink)**, **Boy (Blue)**, or **Empty**.
  - Record the specific date for each delivery.
- **Real-time Statistics**: Automatic calculation of total deliveries and gender distribution.
- **Milestone Celebrations**: High-energy confetti bursts triggered when reaching 10, 20, 30, and 40 deliveries.
- **Local Persistence**: All data is automatically saved to the browser's `localStorage`, ensuring progress is kept across sessions.
- **Data Portability**:
  - **Export**: Download current board state as a `.json` backup file.
  - **Import**: Restore progress from a previously exported backup file.
- **Customization**: Editable student name and academic year range.

## 🏗 Implementation Details

### State Management

The application uses a centralized state within the `App` component, managed via React's `useState` and `useEffect` hooks.

### Persistence Logic

Data is persisted using the `localStorage` key `midwife-tracker`.

- **Initialization**: On mount, the app attempts to load saved data. It includes a migration layer to handle older data formats (e.g., converting string-based slots to object-based slots).
- **Synchronization**: A `useEffect` hook monitors changes to the name, years, and slots, automatically updating `localStorage` whenever the state changes.

### Celebration System

The `triggerCelebration` function manages the visual reward system. When a delivery is added that hits a milestone (10, 20, 30, or 40), a multi-burst confetti sequence is initiated using `canvas-confetti`, creating a celebratory experience for the user.

## 🧩 Component Architecture

- **`App`**: The root component containing the application logic, state, and layout. It manages the board's state and handles the backup/restore and reset workflows.
- **`Footprint`**: A specialized SVG component that renders a footprint. It dynamically adjusts its fill color and styling based on the `SlotColor` prop, including subtle highlights and shadows for a polished look.

## 💾 Data Model

The application uses a simple but effective data structure to track progress:

### `SlotColor`

A union type defining the state of a footprint:

- `'empty'`: No delivery recorded.
- `'pink'`: Delivery of a girl.
- `'blue'`: Delivery of a boy.

### `SlotData`

An interface representing a single delivery slot:

```typescript
interface SlotData {
  color: SlotColor;
  date: string; // ISO date string (YYYY-MM-DD)
}
```

The complete application state is stored as:

```typescript
{
  name: string;
  startYear: string;
  endYear: string;
  slots: SlotData[]; // Array of 40 slots
}
```

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PhilipGB/midwife-birth-counter.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the browser to the URL provided by Vite (usually `http://localhost:5173`).
