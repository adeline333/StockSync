# CHAPTER 4: IMPLEMENTATION OF THE NEW SYSTEM

## 4.1 Introduction
This chapter focuses on the practical realization of the StockSync Inventory Management System. It transitions from the theoretical designs and models discussed in the previous chapters to the actual development and deployment phase. The chapter details the technology stack selected for the implementation, presents the various interfaces of the system through descriptive placeholders for screenshots, and outlines the testing procedures undertaken to ensure the system's reliability, security, and performance. Furthermore, it specifies the hardware and software requirements necessary for the optimal operation of the system in both client and server environments.

## 4.2 Technologies Used
The development of StockSync utilized a modern full-stack architecture to ensure scalability, responsiveness, and ease of maintenance. The following technologies were selected based on their robustness and industry standards.

### 4.2.1 Front-End Development
The user interface of StockSync was built to be dynamic, responsive, and user-centric.
*   **React.js**: A powerful JavaScript library used for building component-based user interfaces. It allowed for the creation of a Single Page Application (SPA) that provides a smooth user experience.
*   **Vanilla CSS / Tailwind CSS**: Used for styling the application, ensuring a premium aesthetic with dark mode support and responsive layouts.
*   **Lucide React**: A library of beautiful, consistent icons used to enhance the visual navigation of the system.
*   **Context API**: Used for state management, particularly for user authentication and theme persistence.

### 4.2.2 Back-End Development
The server-side logic handles data processing, security, and integration with the database.
*   **Node.js**: A JavaScript runtime built on Chrome's V8 engine, chosen for its asynchronous and event-driven architecture.
*   **Express.js**: A minimal and flexible web application framework for Node.js, used to build the RESTful API endpoints.
*   **JSON Web Tokens (JWT)**: Implemented for secure, stateless authentication and role-based access control.

### 4.2.3 Database Management
*   **PostgreSQL**: A powerful, open-source object-relational database system used for storing inventory data, sales records, and user information with high integrity.
*   **PostgreSQL**: Utilized as the primary relational database to host the system's data, providing high integrity and secure data storage across all modules.

## 4.3 Presentation of the New System
This section showcases the functional modules of the StockSync system. Each module is designed to address specific challenges identified in the manual inventory management process.

### 4.3.1 User Authentication
The login interface ensures that only authorized personnel can access the system. It supports role-based redirection for Admins, Managers, and Staff.

> **[PLACEHOLDER: Figure 4.1 - Login Page Interface]**
> *Description: The login screen featuring secure input fields for email and password, with a modern, high-contrast design.*

### 4.3.2 Analytics and Sales Velocity Dashboard
The dashboard provides Managers and Admins with a high-level overview of inventory health, recent sales, and statistical sales velocity and safety stock analytics.

> **[PLACEHOLDER: Figure 4.2 - Analytics Dashboard]**
> *Description: A visual dashboard showing stock levels, low-stock alerts, and a 7-day sales velocity chart.*

### 4.3.3 Inventory Management
This module allows authorized users to register new products, adjust stock levels, and view detailed product information.

> **[PLACEHOLDER: Figure 4.3 - Inventory List View]**
> *Description: A searchable table of all products with status badges (In Stock, Low Stock, Out of Stock).*

### 4.3.4 Stock Transfer Workflow (Locked Protocol)
To ensure accountability, the stock transfer process follows a secure, locked three-step "Request-Ship-Confirm" transfer protocol.

> **[PLACEHOLDER: Figure 4.4 - New Stock Transfer Form]**
> *Description: Interface for requesting stock movement between branches.*

> **[PLACEHOLDER: Figure 4.5 - Transfer Confirmation Button]**
> *Description: The "Confirm Physical Receipt" interface visible to the destination manager.*

### 4.3.5 Point of Sale (POS) Terminal
The POS module allows cashiers to process sales quickly, validate customer TIN numbers, select payment methods (Cash, Mobile Money, or Card), and generate digital receipts.

> **[PLACEHOLDER: Figure 4.6 - POS Terminal Interface]**
> *Description: A grid of products with a shopping cart sidebar and customer search functionality.*

#### Integrated Credit/Debit Card Gateway (Sandbox Mode)
To support a realistic demonstration during the thesis project defense, a secure credit/debit card payment gateway integration (Sandbox mode) has been built into the POS checkout flow:
* **Secure Card Input Form:** When the cashier selects the "Card Payment" option, the POS system displays a modern billing integration panel where the cashier or customer inputs the Cardholder Name, Card Number, Expiry Date, CVV, and secure Card PIN.
* **Payment Processing Lifecycle:** Upon submitting the payment, the frontend triggers a secure gateway authorization process, displaying standard transaction messages: "Initiating secure handshake..." -> "Verifying security credentials..." -> "Authorizing transaction with issuer...".
* **Interactive Test Scenarios:** The gateway implements standard sandbox routing rules: entering a card ending in `0000` or a CVV of `999` triggers an "Insufficient Funds / Declined" response for demo purposes, while valid entries return a 6-digit transaction authorization code and record the sale in the system under the `'card'` payment method.

### 4.3.6 Inventory Reconciliation
This section shows the automated comparison between physical stock counts and system records, a key objective of the StockSync system.

> **[PLACEHOLDER: Figure 4.7 - Reconciliation Dashboard]**
> *Description: The interface showing discrepancies between sales and actual stock on hand.*

### 4.3.7 Custom Report Generation
The system includes a professional reporting engine that allows managers to generate formal business documents for sales performance and inventory valuation, ready for print or export.

> **[PLACEHOLDER: Figure 4.8 - Professional Business Report]**
> *Description: A generated Sales Performance report featuring the company logo, specific date periods, and detailed financial columns.*

## 4.4 Software Testing
To guarantee the quality and security of the system, a rigorous testing phase was conducted following industry standards.

### 4.4.1 Unit Testing
Individual components and functions were tested in isolation to ensure they perform correctly. For instance, the stock deduction logic and TIN validation algorithms were verified to handle various edge cases without errors.

### 4.4.2 Integration Testing
Integration testing focused on the communication between the frontend, backend, and database. This ensured that a sale processed at the POS correctly updates the inventory levels in the PostgreSQL database and reflects immediately on the Analytics dashboard.

### 4.4.3 Validation Testing (User Acceptance)
Validation testing was conducted to ensure the system meets the business needs of the stakeholders. This involved verifying the manager-only "Request-Approve-Confirm" workflow to ensure that stock transfers cannot be finalized without physical verification by the receiving manager.

## 4.5 Hardware and Software Requirements
To ensure the StockSync system operates reliably in a production environment, the following hardware and software specifications must be met.

### 4.5.1 Client-Side Software Requirements
*   **Operating System**: Windows 10/11, macOS, or Linux.
*   **Web Browser**: Latest version of Google Chrome, Mozilla Firefox, or Microsoft Edge.
*   **PDF Viewer**: Required for viewing and printing generated sales receipts.

### 4.5.2 Server-Side Software Requirements
*   **Environment**: Node.js runtime (version 18.x or higher).
*   **Database**: PostgreSQL 14+ (hosted locally for the implementation phase).
*   **Package Manager**: NPM or Yarn for dependency management.
*   **Security**: SSL/TLS certificate for HTTPS encryption.

### 4.5.3 Client-Side Hardware Requirements
*   **Processor**: Dual-core 2.0 GHz or higher.
*   **Memory (RAM)**: Minimum 4GB (8GB recommended for multitasking).
*   **Display**: Minimum resolution of 1280x720 for optimal UI rendering.
*   **Input**: Standard keyboard, mouse, and optional barcode scanner for POS.

### 4.5.4 Server-Side Hardware Requirements
*   **Processor**: Minimum 2-core CPU for local or server hosting.
*   **Memory (RAM)**: Minimum 1GB dedicated RAM for the Node.js process.
*   **Storage**: 5GB of SSD storage for application files and initial database growth.
*   **Network**: High-speed internet connection for real-time database synchronization.
