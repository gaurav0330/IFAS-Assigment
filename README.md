# IFAS React Native Assessment — Profile & Online Test App

![Candidate](https://img.shields.io/badge/Candidate-Gaurav_Jikar-blue) ![License](https://img.shields.io/badge/Status-Completed-success)

A production-ready React Native (Expo) application built for the **IFAS Developer Take-Home Assessment**. It features a comprehensive **User Profile Form** with real-time validation, a background-resilient **Online Test Flow** (Start → Instructions → Test → Analysis), a **Progress & Performance Dashboard**, and an **Interactive Queries Support Assistant**.

---

### 👨‍💻 Developer Information
* **Developer**: Gaurav
* **GitHub Repository**: [https://github.com/gaurav0330/IFAS-Assigment](https://github.com/gaurav0330/IFAS-Assigment)
* **Tech Stack**: React Native, Expo, TypeScript, Zustand (AsyncStorage persistence), React Navigation v6, React Native SVG, Jest.

---

## 🚀 How to Run the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Expo Dev Server
```bash
npx expo start
```
* Press `a` to open on a connected Android phone (via USB debugging) or emulator.
* Press `i` to open on iOS Simulator.
* Scan the QR code using the **Expo Go** app on your physical mobile device.

### 3. Run Unit Test Suite
```bash
npm test
```
*(Executes Jest suite covering score calculations, MSQ exact-match rules, option state derivations, and timer accuracy — 15/15 tests passing).*

---

## ✨ Key Features & Architectural Overview

### 1. User Profile Form & Validation
* **Name Regex Validation**: Enforces valid name formatting (`/^[A-Za-z\s]{2,50}$/`) for First & Last name fields.
* **Email & Mock OTP Verification**: Email input with a interactive OTP modal (Mock Code: `1234`) featuring a **30-second resend timer countdown** and verified status badge.
* **DOB & Age Restriction**: Datepicker enforcing minimum **16+ age restriction** (`maxDate = 16 years ago`).
* **Custom Dropdowns**: Lightweight custom modal dropdowns for **Gender**, **Target Exam** (NEET UG, JEE Main, CUET UG, CAT, GATE), and **Qualification**.
* **Payload Logging**: Submit button remains disabled until all fields pass validation, and logs the submitted payload (`console.log('Profile submitted payload:', payload)`).

### 2. Online Test Flow
* **Test Metadata Screen**: Displays test title, total question count (60Q), duration (45m), and hero start CTA card.
* **Instructions Screen**: Rule set with a **mandatory agreement checkbox**; "Start Test" button remains disabled until agreed.
* **MCQ & MSQ Question Types**:
  * **MCQ (Single Choice)**: Radio-style option selection. Tapping an already selected option unselects it.
  * **MSQ (Multiple Choice)**: Checkbox-style multi-selection.
* **Answer Persistence**: Full Back/Next navigation state persistence powered by Zustand `AsyncStorage` hydration.
* **Question Palette Drawer**: Modal drawer grid displaying all questions (1 to 60) with color-coded status badges (*Answered*, *Unanswered*, *Current*) for instant jumping.
* **Submit Test & Confirmation**: Always-accessible "Submit Test" CTA in the footer with a confirmation modal showing answered vs unanswered counts.

### 3. Result & Interactive Analysis Screen
* **SVG Donut Performance Chart**: Multi-segment SVG Donut Chart visually displaying **Correct (Green)**, **Wrong (Red)**, and **Unattempted (Slate)** percentages with centered accuracy readout.
* **4-Option State Details Accordion**: Expandable question cards detailing every option's state:
  * `selected-correct`: Option selected by student and actually correct (Green + checkmark).
  * `selected-wrong`: Option selected by student but incorrect (Red + cross).
  * `correct-missed`: Correct option missed by student (Soft green border + missed tag).
  * `correct-irrelevant` / `neutral`: Correct option irrelevant for unattempted questions.

### 4. Progress Dashboard & Interactive Queries Assistant
* **Progress Analytics**: Displays accuracy rate %, test attempt count, streak counter, and subject mastery breakdown bars.
* **Queries Support Assistant**: AI/bot auto-reply assistant with 1-tap quick suggestion chips (`💰 Pricing`, `📝 Test Guide`, `📞 Call Us`) and automatic scroll-to-bottom on new messages.

---

## 🎯 MSQ Exact-Match Scoring Rule

For Multiple Select Questions (MSQ):
* A question is marked **correct** ONLY if the selected set of options **exactly matches** the correct set.
* **No partial credit** is awarded for selecting a subset of correct options.
* Selecting even a single wrong option, even alongside correct ones, marks the question as **incorrect**.
* Unanswered questions are marked as **unattempted** (0 marks) and do not incur negative marks.

*This rule is strictly enforced in `src/utils/scoring.ts` (`arraysEqualAsSets`) and covered in unit tests.*

---

## ⏱ Timestamp-Based Resilient Timer

To avoid timer freezing when mobile apps are backgrounded or force-closed:
* The app calculates remaining time dynamically using an absolute target timestamp (`endTimestamp = startedAt + durationMs`).
* On app resume or force-close rehydration (`AppState -> 'active'`), remaining time is recomputed against `Date.now()`.
* If time expires while backgrounded, the test is automatically auto-submitted the moment the app opens.

---

## ⚖️ Tradeoffs Made Given the Time Window

1. **Question Bank Seed Data**:
   * A curated set of 25 comprehensive science/medical NEET UG & JEE questions is used and repeated deterministically across 30Q & 60Q test modes.
2. **Custom Modal Pickers**:
   * Custom modal pickers were implemented for Gender, Exam, and Qualification dropdowns instead of pulling heavy third-party picker dependencies to maintain lightweight bundle performance.
3. **Mock OTP Authentication**:
   * Email verification utilizes a mock OTP validation modal (Code `1234`) with a 30s resend timer instead of integrating a live backend SMTP service.
4. **Focused Unit Testing**:
   * Unit test coverage focused heavily on the two most critical business logic areas: **MSQ Exact-Match scoring rules** and **Timestamp-based background resilient timers**.

---

## 📄 License
Created by **Gaurav** for the IFAS React Native Assessment.
