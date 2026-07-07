# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
LogicAI_LMS
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ src
│  ├─ api
│  │  └─ functions.js
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ img
│  │  │  └─ hero.png
│  │  ├─ react.svg
│  │  └─ vite.svg
│  ├─ components
│  │  ├─ fields
│  │  │  ├─ DateInput.jsx
│  │  │  ├─ SelectInput.jsx
│  │  │  ├─ TextInput.jsx
│  │  │  └─ UploadInput.jsx
│  │  ├─ forms
│  │  │  ├─ AddressInfo .jsx
│  │  │  ├─ BankInfo.jsx
│  │  │  ├─ GuarantorInfo.jsx
│  │  │  ├─ KycInfo.jsx
│  │  │  └─ PersonalInfo.jsx
│  │  ├─ Table.jsx
│  │  └─ utils
│  │     ├─ Accordion.jsx
│  │     ├─ Button.jsx
│  │     ├─ ErrorMsg.jsx
│  │     ├─ Icon.jsx
│  │     └─ Modal.jsx
│  ├─ content
│  │  ├─ data.js
│  │  └─ masterData.jsx
│  ├─ index.css
│  ├─ layout
│  │  ├─ Layout.jsx
│  │  ├─ Navbar.jsx
│  │  └─ Sidebar.jsx
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ auth
│  │  │  └─ Login.jsx
│  │  ├─ formPages
│  │  │  └─ ApplyLoan.jsx
│  │  ├─ main
│  │  │  └─ Dashboard.jsx
│  │  └─ master
│  │     ├─ BranchList.jsx
│  │     ├─ BranchManagers.jsx
│  │     ├─ CityList.jsx
│  │     ├─ FinantialYears.jsx
│  │     ├─ Occupations.jsx
│  │     ├─ Relationships.jsx
│  │     └─ StateList.jsx
│  └─ provider
│     └─ userContext.jsx
└─ vite.config.js

```