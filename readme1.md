Adventist University of Central Africa




Multi-Location Inventory Reconciliation System
CASE STUDY: B Special Business Ltd


A final year project presented in partial fulfillment of the requirements for the degree of
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Major in
Software Engineering


By
Adeline Tuyizere
January, 2026
ABSTRACT
A Final Project for the Bachelor's Degree in Information Technology 
Emphasis in SoftwareEngineering 
Adventist University of Central Africa

Title: StockSync: Multi-Location Inventory Reconciliation System  
Name of the researcher: Adeline Tuyizere 
Name of the Faculty Advisor: Rene Ruganji 
Date Completed: ..../..../2026 
In emerging economies, retail expansion necessitates digital supply chain transformation. Currently, Small and Medium Enterprises  rely heavily on decentralized, manual inventory systems utilizing physical ledgers and basic spreadsheets. This inefficiency causes critical data redundancy, recurring stock discrepancies, and delayed decision-making due to a lack of real-time visibility.
This project presents StockSync, an automated system centralizing warehouse and retail inventory. It features a secure, three-step stock transfer protocol (Request-Ship-Confirm), automated reconciliation algorithms that match completed sales against inventory deductions, and strict hierarchical role-based access controls to proactively prevent internal fraud and instantly identify physical stock discrepancies.
Evaluation revealed significant operational improvements. Transitioning to real-time digital recording substantially reduced manual transcription errors, while the automated reconciliation engine accelerated discrepancy detection from weeks to seconds. Furthermore, the mandatory multi-stage transfer protocol and strict user authority rules successfully eliminated self-approval vulnerabilities, establishing complete operational accountability.
StockSync demonstrates that affordable digital solutions can effectively bridge the technology gap in Rwanda's distribution sector. Replacing fragmented workflows with a centralized platform establishes a scalable foundation for real-time inventory control, closely aligned with national digital transformation goals..


DECLARATION 
I, Adeline Tuyizere, declare that this "StockSync: Multi-Location Inventory Reconciliation System for B Special Business Ltd" project is the fruit of my effort and has not received any previous credit at the Adventist University of Central Africa or any other university or institution.
Signature: ........................................................... 
Date: ....../....../2026 
 
  
APPROVAL 
I, Rene Ruganji, certify that this project report has been done under my supervision and submitted with my approval.
Signature: ........................................................... 
Date: ....../....../2026
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 


 DEDICATION
With great pleasure, I dedicate this Research Project
To Almighty God,
To my lovely parents,
To all my family members,
To all my friends and colleagues,
To my supervisor for his kind guidance.
  
ACKNOWLEDGEMENTS
First and foremost, I thank God Almighty, the Source of all knowledge, wisdom, and strength, without whose grace and blessings this work would not have been possible. The completion of this project would not have been achievable without the support and guidance of many individuals to whom I owe my deepest gratitude. 
I am profoundly grateful to my supervisor, Rene Ruganji, whose mentorship and thoughtful guidance played a vital role in shaping this research. His constructive feedback, patience, and academic rigor challenged me to produce work of greater depth and quality than I could have achieved alone. His dedication to my academic growth has been invaluable.
I extend my sincere appreciation to the dedicated faculty and academic staff of the Department of Software Engineering at the Adventist University of Central Africa (AUCA). Your commitment to imparting knowledge with clarity and passion, and your willingness to support students beyond the classroom, have profoundly impacted my academic and personal development. The AUCA community, guided by values of integrity, excellence, and service, has shaped not only my technical knowledge but also my character and worldview. 
To my beloved parents, I am who I am because of you. Thank you for your unwavering love, prayers, financial support, and words of encouragement that sustained me through every challenge. To my siblings, thank you for your constant belief in me. 
I am deeply grateful to my friends and classmates who made my university journey not only bearable but highly meaningful. Navigating the complexities of software engineering requires a strong support system, and you made the process easier. Your friendship and support have been a tremendous source of strength. 
May God bless you all abundantly. 
Adeline Tuyizere
 
TABLE OF CONTENTS

ABSTRACT	ii
DECLARATION	iii
APPROVAL	iv
DEDICATION	v
ACKNOWLEDGEMENTS	vi
TABLE OF CONTENTS	vii
LIST OF TABLES	xi
LIST OF FIGURES	xii
LIST OF ABBREVIATIONS	xiv
CHAPTER ONE: GENERAL INTRODUCTION	16
Introduction	16
Background of the Study	17
SMEs in Supply Chain Management	17
Current Inventory Management Technology	17
The Manual Process Challenge	18
Technological Solutions and Implementation	20
Statement of the Problem	21
Choice and Motivation of the Study	22
Objectives of the Study	23
General Objective	23
Specific Objectives	23
Scope of the Project	24
Methodology and Techniques Used	27
Research Design	28
Documentation Review	28
System Deliverables	32
Operational Improvements	33
Expected Results	33
Organization of the Thesis	34
CHAPTER TWO: ANALYSIS OF THE CURRENT SYSTEM	35
Introduction	35
Description of Current System Environment	36
Historical Background	36
Mission	36
Vision	37
Description of the Current System	37
Modeling of the Current System (AS-IS Model)	38
Problems with the Current System	39
Performance	39
branches.	40
Economics	40
Control	40
Efficiency	40
Service	41
Proposed Solutions	44
System Requirements	46
Functional Requirements	46
Non-Functional Requirements	47
CHAPTER THREE: REQUIREMENT ANALYSIS AND DESIGN OF THE NEW SYSTEM	48
Introduction	48
Unified Modeling Language (UML)	48
Design of the New System	48
Use Case Diagram	48
Sequence Diagram	50
Class Diagram	52
Database Diagram	54
Entity-Relationship Diagram (ERD)	54
Comprehensive Data Dictionary	55
System Architecture Design	65
CHAPTER 4: IMPLEMENTATION OF THE NEW SYSTEM	68
Introduction	68
Technologies Used	68
Front-End Development	68
Back-End Development	69
Database Management	69
Presentation of the New System	69
Custom Report Generation	80
4.4 Software Testing	81
Hardware and Software Requirements	84
CHAPTER FIVE: CONCLUSION AND RECOMMENDATIONS	85
Conclusion	85
Recommendations	86
REFERENCES	88
Appendices	91
Data collection letter	92
Approval Letter from the organization	93
Curriculum Vitae	94

 
LIST OF TABLES 
Table 1: SMART Objectives Summary	24
Table 2:  Current vs. Proposed System Comparison	43
Table 3: Users Table	57
Table 4: Branches Table	57
Table 5: Products Table	59
Table 6: Inventory Table	59
Table 7: Transactions Table	61
Table 8:Orders Table	62
Table 9:Stock Transfers Table	63
Table 10: Discrepancy Logs Table	64
Table 11: Customers Table	65
Table 12: Software Testing Summary	84

  
LIST OF FIGURES 
Figure 1 Manual proccess challenge	19
Figure 2:System Scope and Functional Coverage	27
Figure 3:  Primary Data Collection Methods	30
Figure 4: Current system (AS-IS Model)	39
Figure 5: PIECES Framework Analysis	42
Figure 6: Proposed Solution	45
Figure 7: Use case diagram of the new system	49
Figure 8: Sequence Diagram  for the StockSync system	51
Figure 9: Class diagram for the StockSync Sytem	53
Figure 10: Entity Relationship diagram for StockSync	54
Figure 11: Login Page Interface	71
Figure 12: Analytics Dashboard	72
Figure 13: Inventory List View	73
Figure 14: New Stock Transfer Request Form	74
Figure 15:Pending Transfer Queue	75
Figure 16: Transfer Approved	76
Figure 17: Transfer Receipt Confirmation Interface	77
Figure 18: Transfer Completed State	78
Figure 19:  POS Terminal Interface	79
Figure 20: Stock reconciliation	80
Figure 21: Checking variance	80
Figure 22: Report generator	81
Figure 23:Downloadable stock transfer report	82
  
LIST OF ABBREVIATIONS 
ACID: Atomicity, Consistency, Isolation, Durability 
API: Application Programming Interface 
AUCA: Adventist University of Central Africa 
CDN: Content Delivery Network 
CRM: Customer Relationship Management 
CSS: Cascading Style Sheet 
DB: Database 
ERP: Enterprise Resource Planning 
GRN: Goods Received Note 
HTML: Hypertext Markup Language 
JWT: JSON Web Token 
MoSCoW: Must have, Should have, Could have, Won't have 
MVC: Model-View-Controller 
PIECES: Performance, Information, Economics, Control, Efficiency, Service 
POS: Point of Sale 
QR: Quick Response 
RBAC: Role-Based Access Control 
RDBMS: Relational Database Management System 
REST: Representational State Transfer 
RRA: Rwanda Revenue Authority 
SME: Small and Medium Enterprises 
TIN: Tax Identification Number 
TLS/SSL: Transport Layer Security / Secure Sockets Layer 
UAT: User Acceptance Testing 
UML: Unified Modeling Langu 
CHAPTER ONE: GENERAL INTRODUCTION
Introduction 
Rwanda's Vision 2050 and Smart Rwanda Master Plan position digital transformation as a fundamental pillar of economic competitiveness, prioritizing technology adoption across all sectors (Innovation, 2020). Within this evolving landscape, small and medium enterprises (SMEs) in distribution and supply chain sectors face mounting pressure to modernize inventory management systems to meet contemporary operational demands. 
SMEs constitute Rwanda's economic backbone, yet encounter unique challenges distinguishing them from larger corporations, particularly regarding resource constraints, technological capacity, and organizational complexity (Haddara & Zach, 2011). These limitations prove especially acute in inventory management, where inability to invest in expensive enterprise resource planning (ERP) systems forces continued dependence on manual processes. 
Research demonstrates that manual inventory management generates error rates of 15-20%, resulting in significant financial losses and operational inefficiencies (Odasco, 2023). When SMEs expand from single-location to multi-site operations without upgrading inventory infrastructure, they encounter compounding inefficiencies at each level. The absence of real time synchronization creates fundamental disconnects between physical stock movements and recorded data, undermining decision-making and exposing organizations to preventable losses. 
This project proposes StockSync, a Multi-Location Inventory Reconciliation System designed to resolve these critical deficiencies. By implementing a locked three-step stock transfer handshake (Request-Ship-Confirm), real-time inventory tracking, automated sales-to-deduction reconciliation, physical count discrepancy verification, and strict role-based access controls, StockSync transforms operational efficiency while providing a highly secure and scalable distribution model for SMEs navigating Rwanda's digital supply chain transformation. 
 
Background of the Study 
SMEs in Supply Chain Management 
Small and medium enterprises operate under fundamentally different constraints than large corporations. (Haddara & Zach, 2011) establish that SMEs possess distinct characteristics including limited financial resources, restricted technical expertise, and simplified organizational structures. These factors create a paradox: SMEs require efficient inventory systems to compete yet lack capital for sophisticated ERP solutions deployed by larger competitors. 
Multi-echelon supply chains further complicate inventory management. Distribution operations typically coordinate across central warehouses, regional points, and retail outlets. Sbai's (Sbai & Berrado, 2023) review demonstrates that effective multi-level coordination requires sophisticated tracking, real-time synchronization, and automated reconciliation features manual systems cannot provide. 
When SMEs scale across locations without infrastructure upgrades, complexity increases exponentially beyond manual process capacity. Research in developing economies reveals persistent challenges with stock accuracy and data integrity even with basic digital tools. (Odasco, 2023) found institutions using elementary systems still struggle with discrepancies when reconciliation remains manual and periodic rather than automated and continuous. This intensifies in commercial distribution where transaction volumes and product diversity exceed institutional contexts. 
Current Inventory Management Technology 
Technology evolution has created a two-tiered market: sophisticated enterprise systems for large corporations versus basic spreadsheet tools inadequate for growing multi-location operations. Advanced platforms like Oracle Cloud WMS and SAP demonstrate technical feasibility of real time tracking and automated reconciliation (Sola, 2024), but implementation costs, complexity, and licensing fees exceed typical SME budgets in developing economies. 
Critically, (Sudarmi & Sunaryo, 2024) confirm that even modern ERPs improve accuracy through digitization, but "reconciliation and discrepancy handling rely on operational procedures rather than automated detection mechanisms" (p. 77). This means organizations investing in basic ERPs experience the same reconciliation challenges as manual systems merely with digitized rather than paper records. 
This creates what (Haddara & Zach, 2011) identify as the "missing middle" a market void leaving SMEs without appropriate solutions. The cost structure proves particularly prohibitive: "ERP software cost as a percentage of overall cost is higher for SMEs than large enterprises" (p. 113), forcing continued operational inefficiency or expensive customization. 
To bridge the gap between basic spreadsheets and expensive enterprise software, custom automation frameworks offer an effective middle ground. Research by (Omisola, 2024) demonstrates that automating key inventory workflows successfully reduces operational waste without requiring complete ERP implementation. Similarly, (Hasibuan, 2024) proved that developing a targeted, real-time tracking system across multiple locations gives SMEs exactly the functionality they need while remaining financially accessible. 
The Manual Process Challenge 
Traditional SME inventory management follows fragmented manual workflows creating multiple failure points. First, multiple manual transcription steps (paper → ledger → Excel → consolidation) introduce compounding errors at each transfer. Research indicates manual entry errors of 1-5% per transaction (Odasco, 2023) across thousands of monthly transactions, these create substantial discrepancies difficult to trace retrospectively.
These generalized industry challenges are explicitly reflected in the operational realities of B Special Business Ltd. According to the company's internal Annual Inventory Audit Report (B Special Business Ltd, 2024), the reliance on physical ledgers across their distribution branches resulted in a 4.2% inventory discrepancy rate over the fiscal year. The report highlighted that manual reconciliation delays often taking up to a full week at the end of each month caused significant financial leakage through untraceable stock shrinkage. Furthermore, a recent Quarterly Operations Review (B Special Business Ltd, 2025) explicitly cited the lack of real-time synchronization between the central warehouse and retail outlets as the primary bottleneck preventing secure business expansion.
Second, this lack of real-time synchronization means discrepancies remain undetected for weeks. By monthly reconciliation, causal transactions have passed, witnesses forgot details, and evidence degraded. This temporal disconnects between occurrence and detection fundamentally undermines corrective action, exactly as the B Special Business Ltd reports demonstrate.
Third, the absence of automated pattern detection prevents identifying systematic issues like recurring shrinkage at specific locations, shifts, or product categories. Manual reconciliation reveals only aggregate discrepancies ("Shop A short 47 units") without analytical insights. (Sudarmi & Sunaryo, 2024) characterize this as "operational procedures" versus "systematic analytical processes" a limitation manual diligence cannot overcome.
 
Figure 1 Manual proccess challenge
Figure 1 shows the sequential workflow of the traditional paper-based inventory processes at B Special Business Ltd, highlighting key failure points such as manual ledger transcription, lack of branch-to-warehouse communication, and delayed monthly auditing that lead to high error rates.
Technological Solutions and Implementation 
Modern digital solutions leverage centralized databases to overcome manual synchronization limits. This unified database architecture ensures instantaneous multi-location synchronization across branches without complex on-premises server infrastructure, eliminating manual data entry delays and transcription error rates (Hasibuan, 2024). 
Automated reconciliation represents another critical advancement. Instead of periodic, error-prone manual audits, system algorithms continuously compare recorded transactions against physical stock counts to immediately flag discrepancies (Sola, 2024). This transitions operational control from a reactive, delayed process to continuous, proactive verification. 
Sales velocity and safety stock analytics further enhance decision-making. By analyzing historical daily sales speed and stock depletion patterns, the system generates automated alerts and reorder suggestions (Omisola, 2024). This statistical analysis transforms inventory record-keeping into a strategic planning tool to prevent stock-outs. 
Furthermore, digital systems enforce accountability through strict, hierarchical Role-Based Access Controls (RBAC) and immutable transaction logs. Restricting high-risk actions such as stock transfer approvals or catalog adjustments to authorized personnel prevents internal administrative fraud (Dennis, Wixom, & Roth, 2015). Every inventory change remains secure and traceably mapped to an authenticated user signature. 
Lastly, a modern client-server architecture provides a highly scalable and cost-effective operational model. Utilizing decoupled Single Page Applications (SPAs) on standard web browsers allows retail branches to run lightweight interfaces on basic hardware, while backend APIs manage operations centrally (Sommerville, 2015). This minimizes infrastructure costs while sustaining high system performance across geographical sites
. 

Statement of the Problem 
Small and medium enterprises (SMEs) in Rwanda's import and distribution supply chains face critical inefficiencies from reliance on manual, non-integrated inventory management systems. Manual processes generate 15-20% error rates, causing substantial financial losses, operational delays, and compromised customer satisfaction (Odasco, 2023). These inefficiencies intensify as businesses scale from single-location to multi-site networks, where the absence of real-time synchronization creates fundamental disconnects between physical stock and recorded data.
The primary problem is the absence of a unified, real-time inventory tracking system that synchronizes stock data across all locations. Currently, warehouse records, retail logs, and sales transactions exist in separate notebooks and isolated files with no automated linkage. No single system possesses an accurate, current view of total inventory. Consequently, daily operations depend on outdated, frequently incorrect information, forcing time-consuming physical verification and manual reconciliation.
Regarding operational impact, distribution SMEs managing high-volume flows find paper-based systems inadequate for multi-location complexity. Each location operates as an independent data silo, with documents requiring slow, error-prone, and unscalable manual re-entry at every step. Financial losses occur through mismatches between records and physical stock, causing lost sales and unnecessary procurement. Stock shrinkage often representing 1.5–2% of annual revenue, or higher with poor tracking goes undetected for weeks (Dennis, Wixom, & Roth, 2015).
Operational inefficiency further consumes resources, as managers dedicate significant workweeks to manual counts rather than strategic activities. Sales staff waste time physically verifying availability, delaying service and reducing productivity. Management also lacks real-time visibility into performance trends, hindering market responsiveness. Finally, increased operational risk stems from absent security controls and audit trails in paper systems. Lost or altered records prove irrecoverable, and untraceable discrepancies expose the organization to internal fraud and external compliance risks.

Choice and Motivation of the Study 
This project emerged from observing a widening gap in Rwanda between traditional SME operations and modern digital expectations. Many distribution enterprises still rely heavily on manual processes, which causes operational inefficiencies and restricts their ability to grow. In a market where digital accessibility has shifted from being a competitive advantage to an absolute necessity, these manual limitations severely threaten a company's ability to survive and compete.
Recognizing that technology could bridge this gap and accelerate growth for indigenous businesses, developing a comprehensive inventory reconciliation solution addresses authentic challenges across Rwanda’s SME distribution sector. This effort potentially benefits numerous enterprises beyond single organizations, contributing to the broader digital transformation goals mandated by national policy. By modernizing inventory workflows, this project supports the resilience of local enterprises in a rapidly digitizing economy.
Critically, the focus on reconciliation rather than mere recording addresses a vital gap in current market offerings. Even sophisticated enterprise systems often suffer from functional limitations; as Sudarmi and Sunaryo (2024) observe, many modern ERPs still rely on "operational procedures rather than automated detection mechanisms" (p. 77) to handle discrepancies. StockSync is motivated by the need to move beyond this limitation by embedding intelligence directly into the reconciliation process, thereby reducing the dependency on human-led detective work.
Furthermore, the decision to pursue this study is driven by the potential for scalability. Rwanda’s distribution sector is characterized by high-volume, multi-location networks that require a seamless flow of data to maintain profitability. By building a platform that provides real-time visibility, this project aims to provide a practical roadmap for SMEs to transition from fragmented, error-prone environments to integrated digital ecosystems. Ultimately, the motivation lies in empowering B Special Business Ltd and similar distribution SMEs to reclaim time lost to manual administration, allowing management to shift their focus from reactive stock-checking to strategic growth and market expansion. This project represents a tangible step toward achieving the operational maturity required for SMEs to thrive within Rwanda's competitive and increasingly integrated supply chain landscape.
Objectives of the Study 
General Objective 
To design, develop, and implement a centralized inventory reconciliation system that ensures accurate, real-time stock tracking and multi-location synchronization for small and medium distribution enterprises. By replacing manual workflows with secure digital processes, the system aims to eliminate transcription errors, mitigate financial losses from discrepancies, and establish a robust, scalable digital foundation capable of supporting retail business expansion within Rwanda's competitive distribution sector.
Specific Objectives 
To ensure the successful development of the system, the following SMART (Specific, Measurable, Achievable, Relevant, and Time-bound) objectives have been established: 
•	Automate multi-location inventory tracking across warehouses and retail outlets using real-time digital registration and fast-search catalog interfaces to eliminate manual data entry and transcription errors.
•	Implement a locked three-step stock transfer protocol (Request-Ship-Confirm) requiring separate user authorization at each phase to prevent self-approval fraud and secure intra-company stock movements.
•	Develop an automated reconciliation module that compares physical inventory counts against sales transactions to instantly flag and log stock discrepancies.
•	Provide a real-time analytics dashboard calculating daily sales velocity, safety stock margins, and recommended reorder thresholds to forecast stock-outs and enable data-driven restocking.
•	Establish strict hierarchical role-based access controls (RBAC) and encrypted activity logs to secure sensitive business operations and ensure complete operational accountability.
 
Table 1: SMART Objectives Summary
Table 1 shows the summary of the five SMART objectives defined for the StockSync system, mapping each objective to its measurable indicator, corresponding system feature, and development sprint timeline.



Scope of the Project 
This project encompasses the systematic design, development, and implementation of an integrated Multi-Location Inventory Reconciliation system, specifically engineered for SME distribution enterprises. The scope is centered on facilitating seamless interaction between central warehouses, distributed retail branches, and management offices. By optimizing operational processing, enhancing inter-branch coordination, and providing evidence-based decision-making tools, the system aims to transform the business from a reactive, paper-reliant entity into a proactive, data-driven organization. The project addresses the lifecycle of inventory from initial procurement receipt to final point-of-sale ensuring full traceability and accountability.
Functional Coverage
•	Real-Time Inventory Tracking & Cataloging: The system provides comprehensive digital recording of all stock movements, including receipts, sales, and returns, across all branches. This is supported by high-speed catalog search interfaces that allow staff to locate products in seconds, effectively eliminating the manual data entry errors inherent in paper-based systems.
•	Locked Three-Step Stock Transfer Workflow: To secure intra-company movements, the system mandates a three-step (Request-Ship-Confirm) protocol. This workflow requires distinct user authorization at each phase, preventing self-approval fraud and ensuring that stock moving from the warehouse is accounted for at the retail branch upon physical arrival.
•	Automated Stock Reconciliation: A core backend engine continuously compares point-of-sale (POS) sales records against inventory transaction databases. By aligning these against periodic physical shelf counts, the system immediately calculates and logs any discrepancies, providing management with an accurate picture of stock status daily.
•	Sales Velocity & Reorder Analytics: The system features dynamic dashboards that calculate daily sales velocity and safety stock margins. By providing recommended reorder thresholds, it proactively forecasts potential stock-outs, allowing the business to shift from reactive purchasing to data-driven, strategic restocking.
•	Role-Based Security & Audit Logs: To guarantee operational accountability, the system utilizes strict access controls. Permissions are distinct for system administrators, warehouse managers, and retail cashiers. Furthermore, all sensitive actions are tracked via encrypted activity logs, ensuring every inventory change is mapped to an authenticated user signature.


Technical Scope
•	Backend: The system is built on a Node.js/Express RESTful API architecture, featuring secure endpoints, standard HTTP methods for data integrity, comprehensive error handling, and structured JSON responses to ensure reliable communication between the client and server.
•	Database: Utilizing PostgreSQL, the database ensures ACID compliance, which is critical for maintaining data integrity during high-concurrency transactions. The schema is designed with appropriate normalization, while incorporating strategic denormalization to optimize analytical performance.
•	Frontend: The frontend is a responsive web application built with React, utilizing adaptive layouts and a component-based architecture for long-term reusability and a consistent user experience across different devices.
•	Digital Point-of-Sale: The POS module features high-speed text search and catalog interfaces. To ensure efficiency during high-traffic retail hours, the system supports browser-based barcode scanning for rapid product lookup and transaction processing.
•	Security: The platform employs multi-layered security, including JWT authentication, role-based authorization, HTTP encryption for data in transit, SQL injection prevention, and cryptographic password hashing, complemented by session timeouts to protect sensitive business data.
•	Scalability: The architecture is intrinsically modular, designed to accommodate future business expansion such as adding new retail branches or additional warehouse locations without requiring structural changes to the core codebase.
•	Availability: The system is architected for deployment on scalable infrastructure, ensuring high availability during standard operational business hours to support the continuous needs of a distribution enterprise.


 
Figure 2:System Scope and Functional Coverage
Figure 2 shows the  functional scope of the StockSync Multi-Location Inventory Reconciliation System, illustrating the five core operational areas the platform addresses. Each area directly resolves a specific deficiency identified through fieldwork and the PIECES framework analysis.


Methodology and Techniques Used  
The research framework uses different methods to build a complete understanding of SME distribution operations, inventory problems, and the requirements for technological improvements, by combining qualitative and quantitative approaches through stakeholder consultations, workplace assessments, and documentation examination. 
Research Design 
Case study design focused on SME distribution operations provides appropriate depth for understanding complex processes and validating requirements within authentic contexts (Hasibuan, 2024). The approach integrates exploratory elements investigating SME inventory challenges and descriptive components documenting specific workflows and requirements.
Documentation Review 
A thorough analysis was conducted on internal organizational records, peer-reviewed academic literature, and local regulatory requirements. This review ensured that the resulting system specifications were both technically sound and fully aligned with national business standards. 
Direct Observation 
A systematic observation method was implemented to acquire real-time data concerning stakeholder interactions with B Special Business Ltd's existing manual infrastructure and operational procedures. Through methodical shadowing of warehouse managers, delivery personnel, and retail cashiers, detailed documentation was compiled regarding actual workflow sequences, decision-making steps, and communication protocols.
Specific Observational Components Included: 
Organizational Site Assessments: Executed on-premises investigative observations at the central distribution warehouse and multiple retail branches. This involved mapping the physical flow of goods compared to the flow of physical documentation (transfer notes and receipts) to identify where data is lost.
Operational Shadowing: Operational Shadowing: Accompanied retail staff and warehouse personnel throughout routine daily tasks to document complete end-to-end workflows. This included carefully timing the end-of-day manual counting process to measure the exact time lost to non-automatedcounting.
Documentary Protocol Analysis: Examined the physical tools of the current system, including paper ledgers, separate Excel files, and communication tools (such as informal WhatsApp groups used for stock requests). This revealed highly inconsistent data formats and unstandardized reporting across different branches.
Inefficiency Identification: Conducted a targeted investigation into procedural obstacles, directly observing delayed order processing, repetitive data entry, and communication gaps that negatively impact B Special Business Ltd's productivity.
 
Figure 3:  Primary Data Collection Methods
Figure 3: Overview of the four primary qualitative data collection methods employed during fieldwork at B Special Business Ltd. Each method targeted a specific dimension of the existing manual inventory process, collectively forming a triangulated dataset used to define the functional requirements of the StockSync system.
Interviews 
Interviewing is a basic qualitative technique used to gather detailed information directly from people through organized but conversational discussions. Within the context of this project, comprehensive semi-structured interviews were held with various stakeholders at B Special Business Ltd. This included administrative executives, warehouse managers, distribution specialists, and retail cashiers. The goal was to understand the current inventory management steps, coordination problems, data entry errors, and expectations for a digital system. These discussions generated real-world insights that directly influenced the StockSync platform's features and user interface design.The fundamental investigative inquiries and their synthesized responses included: 
Q1: How would you describe the effectiveness of B Special Business Ltd's existing manual inventory tracking and reconciliation processes?
Answer: Most feedback described the current manual methods as inefficient and difficult to manage. Warehouse staff and retail personnel noted the need to repeatedly enter information from paper transfer notes into ledgers, and then into separate Excel spreadsheets. Many contributors identified these manual entries as the primary cause of severe time delays and frequent human errors.
Q2: What specific coordination obstacles emerge when synchronizing stock transfers between the central warehouse and various retail branches?
Answer: Participants routinely pointed to a lack of communication as a major problem. When stock is sent from the central warehouse, retail branches lack real-time visibility regarding the incoming shipment. Conversely, the central office remains unaware of retail-level stock levels until the end of the day or week. This disconnect creates "ghost inventory" scenarios, preventing instant transparency regarding the movement of goods.
Q3: Under the current framework, how are inventory discrepancies (missing items or overages) detected and resolved?
Answer:  Respondents indicated that discrepancy detection is mostly reactive rather than proactive. Discrepancies are usually only identified during exhaustive end-of-month manual audits. By the time a difference is found, the original transactions have long passed, personnel have forgotten specific details, and physical evidence is gone. Management expressed significant frustration regarding this delay, which makes it difficult to take corrective action or hold anyone accountable.
Q4: What features or tools would you expect within a modern digital inventory system?
Answer: There was a near-universal preference for a mobile-friendly, real-time synchronization platform. Requested features included a fast digital search for retail checkout, automated discrepancy alerts, and a central dashboard for global stock visibility. Ease of use was considered fundamental; cashiers emphasized the need for a simple, user-friendly Point-of-Sale (POS) interface that is easy to learn during busy retail hours.
Q5: What concerns exist concerning user accountability, role-based access, and data security within the proposed platform?
Answer: Participants consistently stated the need for a strict balance between ease of access and security. Administrators expressed concern regarding unauthorized stock changes. Consequently, there was a unanimous consensus for high-level security and role-based access controls (RBAC), ensuring that while retail staff can process sales and request stock, only authorized warehouse managers and administrators have the permission to approve stock transfers and modify global inventory settings.
Development Methodology 
The project adopts a hybrid development approach, combining the flexibility of Agile iterations with the structured validation of the V-Model, as advocated by Hasibuan (2024). Development is conducted in repeating two-week sprints, delivering working software pieces for regular stakeholder review. To ensure high reliability when handling sensitive business data, a continuous testing framework is used, including unit, integration, system, and user acceptance testing (UAT) to validate the system’s usability, security, and stability before final launch.
System Deliverables 
•	Fully Functional Web Application: Deployed system with secure authentication operating on standard browsers. 
•	Comprehensive Documentation: Technical documentation and user documentation. 
•	Source Code Repository: Complete, well-documented code with version control enabling future maintenance. 
Operational Improvements 
•	Enhanced Accuracy: Automated reconciliation substantially reduces discrepancies through continuous monitoring. 
•	Real-Time Visibility: Instantaneous updates on movements, levels, and processing with automated alerts. 
•	Optimized Resources: The system uses data to make sure the company spends its money on the right products and spends its employees' time on the right tasks. 
•	Strengthened Decisions: Continuous monitoring of patterns enables informed interventions. 








Expected Results
The deployment of the StockSync platform is projected to yield both technical deliverables and quantifiable operational improvements for B Special Business Ltd. Structuring these expected outcomes ensures that the software's functional capabilities are directly correlated with resolved business pain points and long-term organizational growth. 
System Deliverables 
• Fully Functional Web Application: Deployed centralized database system with role-based access control and high-performance frontend interfaces. 
• Comprehensive Documentation: Detailed technical manuals, system architecture schematics, and simple end-user operational guides. 
• Source Code Repository: Well-commented, modular repository structured for ease of maintenance and future local software upgrades. 
Operational Improvements 
• Enhanced Stock Accuracy: Automated sales-to-shelf reconciliation reduces inventory discrepancy rates from B Special Business Ltd's baseline of 4.2% down to near-zero margins. 
• Real-Time Visibility: Instantaneous cross-branch transfer status and global stock overview, eliminating temporal tracking delays. 
• Optimized Resource Allocation: Significant reduction in time spent on daily manual counting and paper ledger transcription, allowing personnel to focus on strategic tasks. 
• Data-Driven Decision Making: Proactive alert queues and reorder recommendations based on statistical daily sales velocity analysis, preventing overstocking and stock-out scenarios. 

Organization of the Thesis 
Chapter One: General Introduction provides comprehensive research context including SME supply chain background, detailed problem statement, SMART objectives, scope definition, and methodological approach. 
Chapter Two: Analysis of the Current System examines existing operational frameworks, concentrating on inventory workflows, transaction processing, and data management. PIECES framework systematically evaluates limitations justifying technological intervention. 
Chapter Three: Requirement Analysis and Design presents logical and technical conceptualization including theoretical frameworks, system architecture, and database specifications. UML diagrams illustrate architectural design, functional relationships, and operational logic. 
Chapter Four: Implementation documents practical development and deployment including implemented functionalities with screenshots, technological frameworks, infrastructure prerequisites, validation procedures, and deployment methodology. 
Chapter Five: Conclusion and Recommendations synthesizes principal findings, articulates transformative impact, and formulates recommendations for enhancement and scholarly inquiry. 





CHAPTER TWO: ANALYSIS OF THE CURRENT SYSTEM 
Introduction 
Before engineering a comprehensive technological solution, established software engineering methodologies dictate that a rigorous, systematic evaluation of the existing operational environment must be conducted (Sommerville, 2015). This analytical phase is critical for identifying specific workflow bottlenecks, understanding user interactions, and defining the precise parameters of the operational problem space. 
This chapter provides a highly detailed, comprehensive analysis of the current manual inventory and distribution system utilized by B Special Business Ltd. It begins by establishing the organizational context, including the historical background, mission, and vision of the enterprise. Subsequently, it deconstructs the "AS-IS" process model, mapping the physical and informational flow of goods across multiple echelons of the supply chain. 
The system's inherent vulnerabilities are then critically evaluated using the PIECES (Performance, Information, Economics, Control, Efficiency, Service) analytical framework (Wetherbe, 2012). Finally, drawing from these documented deficiencies, the chapter establishes the foundational functional and non-functional requirements that the proposed StockSync digital architecture must fulfill to drive institutional digital transformation. 
Description of Current System Environment 
Historical Background 
B Special Business Ltd was established in Kigali, Rwanda, to bridge a critical gap in the regional supply chain between international product manufacturers and the rapidly growing Rwandan retail market. Initiating operations as a localized, single-store trading entity, the company capitalized on rising consumer demand to steadily expand its operational footprint. Today, B Special Business Ltd has evolved into a recognized, mid-sized importer and wholesale distributor within the capital city. 
The company currently operates a decentralized organizational structure to manage its highvolume operations. At the core of its supply chain is a central warehouse facility, which serves as the primary receiving hub for bulk international shipments. From this central node, inventory is systematically distributed to multiple company-owned retail branches strategically positioned across high-traffic commercial zones in Kigali. 
The workforce comprises specialized personnel distributed across these nodes, including procurement officers, central warehouse managers, logistics drivers, retail branch managers, and point-of-sale cashiers. Despite its physical expansion and growing market share, the enterprise's internal data management infrastructure has not evolved proportionately, remaining heavily reliant on traditional, paper-based administrative methodologies that increasingly threaten to constrain its future scalability. 
Mission 
To serve as Rwanda’s most trusted and reliable import and distribution partner by delivering highquality commercial products with unmatched operational efficiency, sustained product availability, and an unwavering commitment to customer satisfaction across all retail touchpoints. 
Vision 
To build a modern, efficient, and transparent distribution network that guarantees consistent product availability and seamless service across all our branches. 
Description of the Current System 
The current Internal Inventory and Distribution Model at B Special Business Ltd operates on a strictly manual, localized data-capture paradigm. The entire supply chain data flow relies on physical documentation passing from one geographic location to another, without any centralized digital repository. 
This operational workflow is categorized into four distinct chronological phases: 
Phase 1: Inbound Logistics and Warehouse Reception. The inventory cycle begins when bulk shipments arrive at the central warehouse from international suppliers. The central Warehouse Manager is tasked with manually offloading and counting the physical goods. Upon verification of the physical count against the supplier's invoice, the manager transcribes this data into a large, physical master ledger known as the "Goods Received Note" (GRN) logbook. This physical book remains securely locked in the warehouse office and is the sole authoritative record of the company's total imported assets. 
Phase 2: Intra-Company Stock Requisition and Transfer. As retail branches deplete their local stock, Branch Managers must request replenishments. Because they cannot digitally view the central warehouse inventory, this is typically done via informal communication channels. Upon receiving a request, the Warehouse Manager manually drafts a paper "Transfer Note" in duplicate. The requested goods are physically counted, loaded onto a transport vehicle, and the original paper Transfer Note is handed to the logistics driver. The warehouse ledger is manually updated to reflect the deduction. 
Phase 3: Branch Reception and Point-of-Sale (POS). Upon arrival at the retail branch, the Branch Manager or Cashier must physically recount the delivered goods to ensure they match the driver's paper Transfer Note. Once verified, the items are placed on the retail shelves. The branch maintains its own separate, physical "Shop Ledger" where incoming goods are recorded. As retail customers purchase items, the cashiers manually document each transaction into a daily "Sales Log" notebook. 
Phase 4: Month-End Consolidation and Auditing. Because the Central Warehouse Ledger and the diverse Retail Branch Sales Logs are entirely disconnected, B Special Business Ltd operates with fragmented data silos. Executive management does not have a real-time view of total company inventory. To calculate revenue and identify stock levels, management must wait until the end of the month. Auditors physically collect the Sales Logs from all branches, retrieve the GRN ledger from the warehouse, and spend days manually typing thousands of handwritten transactions into spreadsheets to attempt a retroactive reconciliation. 

Modeling of the Current System (AS-IS Model) 
To fully illustrate the functional disconnects and data silos inherent in the manual processes of B Special Business Ltd, an AS-IS Process Model has been formulated utilizing Unified Modeling Language (UML) standards for activity diagramming (Dennis, Wixom, & Roth, 2015). The diagram below visually maps the flow of physical inventory and its corresponding, disjointed paper trails across the various actors within the supply chain. 
 
Figure 4: Current system (AS-IS Model)
Figure 4 represents the current AS-IS activity model of the company's manual operations, detailing the disconnected process branches and document handshakes between the central warehouse, logistics drivers, and cashier ledger books.
Problems with the Current System 
Based on the AS-IS process model, the specific vulnerabilities of the manual inventory system are categorized below using the PIECES framework: 
Performance 
The system exhibits critically low throughput and unacceptable data response times. Because information moves at the speed of physical paper, executing a routine stock transfer between the warehouse and a retail branch requires hours of manual paperwork and verification. Generating comprehensive performance reports takes days of manual data aggregation across multiple branches. 
Information 
The integrity, accuracy, and timeliness of organizational data are fundamentally compromised due to decentralized data storage. The existence of isolated 'data silos' means that warehouse logs, retail shop registers, and POS records are completely disconnected and rarely synchronize. Discrepancies between recorded ledger data and physical shelf inventory are commonplace. These errors are systematically compounded by human transcription errors during manual copying, delays in writing down transactions, arithmetic miscalculations in totals, and the natural degradation of handwritten sheets, resulting in an unreliable database that lacks a single source of truth.
Economics 
The manual bookkeeping framework inflicts direct, quantifiable financial damage on the enterprise's bottom line. The absolute inability to track stock movements in real-time creates a secure blind spot where inventory shrinkage remains completely undetected for up to four to six weeks until the next scheduled monthly physical audit. This delayed visibility leads to severe cash flow blocks. As supported by (Sudarmi & Sunaryo, 2024), inventory shrinkage caused by disjointed manual tracking typically represents a significant percentage of annual revenue loss. Because these losses are identified weeks after they occur, they cannot be traced or recovered retrospectively, directly reducing the company’s net profit margins.. 
Control 
The current manual environment provides virtually no security controls, accountability, or verifiable audit trails for inventory movements. Physical notebooks and paper ledger sheets are inherently vulnerable to unauthorized modification, physical damage (such as water or fire), or loss, with no possibility of digital recovery. Because all transactions are handwritten without strict authorization checks or digital signatures, establishing non-repudiation is impossible. When valuable stock goes missing, management cannot trace operational accountability back to a specific employee, creating a high-risk environment vulnerable to internal administrative fraud.
Efficiency 
Operational workflows are characterized by a massive duplication of effort, high administrative overhead, and severe data redundancy. The exact same data variables (including product names, SKUs, dates, unit costs, and quantities) must be manually written down by the warehouse manager upon receipt, transcribed again onto a physical transfer note for transit, recorded a third time by the receiving branch cashier, and finally typed into an Excel spreadsheet by an auditor. This repetitive entry cycle wastes valuable employee hours on low-value clerical work, increasing the likelihood of transcription errors at every manual translation point.
Service 
The culmination of these internal failures directly degrades the external customer experience. Because retail staff do not possess real-time visibility into central warehouse stock levels, they frequently rely on outdated knowledge to confirm product availability for wholesale buyers. This results in significant service delays and customer frustration when staff physically search the warehouse only to discover empty shelves. 
 
Figure 5: PIECES Framework Analysis
Figure 5 shows the application of the PIECES framework (Wetherbe, 2012) to the current manual inventory system at B Special Business Ltd. Each dimension identifies a specific operational deficiency in the existing system alongside the corresponding solution delivered by the proposed StockSync platform.
 
Table 2:  Current vs. Proposed System Comparison
Table 2 shows side-by-side comparison of the current manual inventory system against the proposed StockSync digital platform across all six PIECES dimensions. This comparison forms the direct justification for the system requirements defined in Section 2.4.


Proposed Solutions
To decisively resolve the systemic vulnerabilities identified within the PIECES framework, this project proposes the design, development, and deployment of StockSync an Intelligent MultiLocation Inventory Reconciliation System. StockSync is envisioned as a comprehensive web and mobile-responsive application specifically engineered to bridge the digital gap in SME supply chains. The proposed system directly targets the root cause of B Special Business Ltd's inefficiencies: data fragmentation. 
By centralizing all inventory operations into a single database, StockSync ensures that the central warehouse and all retail branches operate from a single source of truth. The application utilizes a centralized digital catalog where products are tracked via unique identifiers (SKUs). This allows retail staff to process sales instantaneously using an optimized, fast-search interface accessible from any standard web-enabled device. 
Crucially, StockSync transcends basic digital record-keeping by integrating an Automated Reconciliation Engine. This engine will continuously and autonomously cross-reference daily point-of-sale retail transactions against central warehouse stock deductions, instantly flagging discrepancies at the close of each business day rather than at the end of the month. 
In addition to real-time tracking and automated audits, StockSync implements a secure operational framework governed by strict Role-Based Access Control (RBAC) and a locked three-step stock transfer handshake (Request-Ship-Confirm). By requiring separate authorization at each stage of inter-branch stock movements, the platform eliminates self-approval vulnerabilities and logs every stock adjustment to an immutable, user-signed audit trail. Coupled with proactive sales velocity and safety stock analytics, this comprehensive digital architecture transitions B Special Business Ltd from a reactive, paper-reliant posture to an optimized, security-focused distribution network capable of sustaining rapid organizational growth.
 
Figure 6: Proposed Solution
Figure 6 shows the conceptual blueprint of the proposed StockSync digital solution, mapping how a centralized system connects all retail branches and the warehouse to establish a single source of truth.
System Requirements 
The successful realization of the StockSync architecture necessitates the formal definition of rigorous system requirements. These requirements serve as the fundamental blueprint for the software engineering phase (Sommerville, 2015), ensuring the final application precisely addresses the documented operational deficiencies. 
Functional Requirements 
•	User Access and Role Management: The system must enforce strict Role-Based Access Control (RBAC) to allow the super-administrator to create, read, update, and deactivate user accounts while securing all API endpoints utilizing JSON Web Tokens (JWT).
•	Digital Stock Registration: The system must provide a product registration module allowing central warehouse staff to log incoming shipments with unique digital identifiers (SKUs), enabling high-speed database lookup during POS checkout and stock management operations.
•	Multi-Echelon Stock Transfer: The system must enforce a locked three-step stock transfer protocol (Request-Ship-Confirm) across locations, requiring separate user authorization at each phase to prevent self-approval transfer fraud and secure intra-company movements.
•	Point-of-Sale (POS) Integration: The system must provide an interface allowing retail cashiers to record customer transactions, which immediately deduct stock quantities from that branch's localized database in real-time.
•	Automated Discrepancy Reconciliation: The system must feature a computational engine that executes at the close of daily operations, cross-referencing total logged sales against physical inventory deductions to generate immediate variance reports.
•	Sales Velocity & Reorder Analytics: The system must analyze daily sales velocity and current depletion rates based on historical data to calculate safety stock margins and recommend reorder thresholds, enabling automated, data-driven restocking alerts.
Non-Functional Requirements 
•	Performance and Latency: The system must process database write-operations and reflect inventory updates across all dashboard views with minimal latency, achieved through optimized PostgreSQL queries and indexed relational tables.
•	Security and Authentication: All user passwords must be cryptographically hashed. System access and API endpoints must be secured utilizing JSON Web Tokens (JWT).
•	Reliability and Data Integrity: The underlying relational database (PostgreSQL) must adhere to strict ACID compliance standards to prevent partial data corruption during transactions.
•	Scalability: The software architecture is intrinsically modular, designed to accommodate future business expansion across multiple retail branches and warehouse locations without requiring structural changes to the core system.
•	Usability and Accessibility: The frontend interfaces must employ responsive design principles, ensuring seamless operability across standard desktop monitors and mobile tablet devices.
•	Availability: The system is architected for deployment on scalable infrastructure, designed to maintain high availability during standard operational business hours.
 
 








CHAPTER THREE: REQUIREMENT ANALYSIS AND DESIGN OF THE NEW SYSTEM
Introduction 
The successful implementation of any robust software solution relies heavily on a rigorous design phase that translates theoretical business requirements into concrete technical blueprints (Pressman, 2014). Having established the functional and non-functional requirements necessary to resolve the manual inefficiencies at B Special Business Ltd in Chapter 2, this chapter focuses exclusively on the architectural and logical design of the proposed system: StockSync. 
The chapter details the overarching system architecture, presents Unified Modeling Language (UML) diagrams to illustrate system behavior, outlines the comprehensive database schema through Entity-Relationship modeling, establishes the User Interface (UI) design principles, and defines the specific technology stack chosen to ensure system scalability and security. 
Unified Modeling Language (UML) 
To provide a standardized, globally recognized visual representation of the StockSync platform's functional logic, Unified Modeling Language (UML) diagrams have been engineered based on the standards outlined by (Fowler, 2003). These diagrams serve as the primary communication mechanism between the system designers and the development team. 
The modeling process employs multiple UML perspectives to capture distinct facets of the StockSync architecture. The static structural view is represented by class and database diagrams, which define the structural data schemas, dictionary types, and object relationships. The dynamic behavioral view is captured through use case and sequence diagrams, which model the user-system interactions and define the chronological execution steps of key workflows. By referencing these static and dynamic representations, the engineering team can ensure system consistency, security compliance, and proper transactional boundaries in code
Design of the New System 
Use Case Diagram 
 
Figure 7: Use case diagram of the new system
As illustrated in Figure 7, system access is secured using Role-Based Access Control (RBAC). The Administrator holds full administrative authority, including user provisioning, global configurations, and audit log inspection. The Warehouse Manager manages bulk storage operations, including catalog updates, stock adjustments, and outbound transfer approvals. The Retail Cashier is restricted to processing POS sales, performing product lookups, initiating transfer requests, and confirming deliveries to enforce the locked three-step handshake. Lastly, the Customer is an external actor who receives sales receipts without direct access to the system.
Sequence Diagram 
 
Figure 8: Sequence Diagram  for the StockSync system

As illustrated in Figure 8, This sequence resolves the critical "Data Silo" problem by enforcing a secured three-step protocol. When a retail manager digitally requests stock, a transfer record is initialized as 'pending'. In the shipping phase, the central warehouse manager approves and dispatches the transfer, triggering a transaction that validates stock availability, deducts the items from warehouse inventory, and transitions the status to 'in_transit'. Upon physical arrival, the receiving retail manager confirms the delivery. This finalizes the second ACID transaction by adding the physical quantities to the retail branch's inventory, updating the transaction status to 'completed', and automatically writing any variance discrepancies directly to the discrepancy logs for absolute auditability.
By modeling this timeline, the sequence diagram highlights the coordination between the React frontend components, the Express.js API handlers, and the database controller. The transitions between states rely on secure endpoints protected by JSON Web Token (JWT) verification, ensuring that only cashiers, warehouse managers, or administrators with the appropriate RBAC roles can invoke these operations. This centralized logic prevents the double-spending of inventory, ensures real-time cross-location visibility, and guarantees that any network interruptions during transit leave the records in a well-defined 'in_transit' state rather than creating database anomalies
Class Diagram 
The Class Diagram maps the static structural blueprint of the StockSync application, serving as the direct blueprint for the Object-Oriented Programming (OOP) implementation within the backend environment. 
By defining classes such as User, Product, Inventory, and StockTransfer, the class diagram details the properties and methods required to execute the system's core workflows. It defines structural dependencies, such as the one-to-many relationship between a Branch and its Inventory, and the association rules that link Cashiers to Orders. Ultimately, this structural blueprint guides the development team in writing modular, decoupled code that maps relational database tables directly to object-oriented backend models, facilitating maintenance and scalability
 
Figure 9 shows the static class structure of the StockSync application, detailing the class properties, methods, and relationships like inheritance and association.
Database Diagram 
Data integrity, rapid query performance, and transactional security are paramount. StockSync utilizes PostgreSQL, a robust Relational Database Management System (RDBMS), to handle highconcurrency transactions. 
Entity-Relationship Diagram (ERD) 
The Entity-Relationship Diagram provides the conceptual architecture of the data layer, defining the entities and the logical relationships that govern the database. 
 
Figure 9: Entity Relationship diagram for StockSync

Figure 10 represents the Entity-Relationship Diagram (ERD) of the StockSync system, illustrating the schema of database tables, constraints, and relationships that govern data persistence in PostgreSQL.
Comprehensive Data Dictionary 
Users Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier for each user
name	VARCHAR(255)	Not Null	Full name of the employee
email	VARCHAR(255)	Unique, Not Null	Email address used as login credential
password	VARCHAR(255)	Not Null	Bcrypt cryptographically hashed password
role	VARCHAR(50)	Default 'staff'	Access level: admin, manager, staff
branch_id	INTEGER	Foreign Key → branches(id)	Links the user to their assigned operational branch
failed_attempts	INTEGER	Default 0	Tracks consecutive failed login attempts for lockout
locked_until	TIMESTAMP	Nullable	Timestamp until which the account remains locked
Table 3: Users Table
Table 3 represents the schema attributes, data types, constraints, and descriptions for the Users table used to enforce secure authentication and role-based authorization.
Branches Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier for each location
name	VARCHAR(255)	Not Null	Commercial name of the branch or warehouse
location	VARCHAR(255)	Nullable	Physical address of the branch
contact	VARCHAR(255)	Nullable	Contact information for the branch
branch_type	VARCHAR(50)	Default 'warehouse'	Classification: warehouse or retail
manager_name	VARCHAR(255)	Nullable	Name of the branch manager
latitude	DECIMAL(10,8)	Nullable	GPS latitude coordinate for geolocation mapping
longitude	DECIMAL(11,8)	Nullable	GPS longitude coordinate for geolocation mapping
is_active	BOOLEAN	Default TRUE	Indicates whether the branch is currently operational
created_at	TIMESTAMP	Default NOW()	Timestamp when the branch record was created
Table 4: Branches Table
Table 4 shows the database schema for the Branches table, which tracks both warehouse and retail locations including geographic coordinate mappings.


Products Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier for each product
name	VARCHAR(255)	Not Null	Commercial name of the product
sku	VARCHAR(100)	Unique, Not Null	Stock Keeping Unit code for inventory tracking
barcode	VARCHAR(100)	Nullable	Barcode value for scanner-based product lookup
description	TEXT	Nullable	Detailed product description
category	VARCHAR(100)	Nullable	Product category (e.g. Soft Drinks, Water)
brand	VARCHAR(100)	Nullable	Brand or manufacturer name
price	DECIMAL(10,2)	Not Null	Standard retail selling price in RWF
cost_price	DECIMAL(10,2)	Default 0	Purchase cost from supplier in RWF
supplier_name	VARCHAR(255)	Nullable	Name of the primary supplier
supplier_lead_days	INTEGER	Default 0	Number of days required for supplier restocking
image_url	TEXT	Nullable	File path to the product image
is_vat_inclusive	BOOLEAN	Default TRUE	Indicates whether the price includes 18% VAT
status	VARCHAR(50)	Default 'active'	Product status: active or inactive
created_at	TIMESTAMP	Default NOW()	Timestamp when the product was registered
Table 5: Products Table
Table 5 shows the relational structure of the Products table, storing master details such as SKUs, selling prices, cost prices, and supplier lead times.
Inventory Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
product_id	INTEGER	Foreign Key → products(id)	The product whose stock is being tracked
branch_id	INTEGER	Foreign Key → branches(id)	The location holding this stock
quantity	INTEGER	Default 0	Current real-time stock level at this location
min_stock_level	INTEGER	Default 10	Minimum threshold that triggers a low stock alert
last_updated	TIMESTAMP	Default NOW()	Timestamp of the most recent stock update
Table 6: Inventory Table
Table 6 represents the schema of the Inventory table, which coordinates real-time stock quantities and low-stock warning thresholds for each branch. It defines the relational mapping between products and physical locations, tracking active stock counts alongside minimum safety stock variables. By enforcing this configuration, the database dynamically flags items falling below safety limits, prompting cashier alerts and automating reorder suggestions to mitigate stock-out risks across all retail nodes.



Transactions Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
product_id	INTEGER	Foreign Key → products(id)	The product involved in the movement
source_branch_id	INTEGER	Foreign Key → branches(id)	Origin branch of the stock movement
dest_branch_id	INTEGER	Foreign Key → branches(id)	Destination branch of the stock movement
type	VARCHAR(50)	Not Null	Movement type: receive, sale, transfer, or adjustment
quantity	INTEGER	Not Null	Number of units involved in the transaction
user_id	INTEGER	Foreign Key → users(id)	Employee who recorded the transaction
status	VARCHAR(50)	Default 'completed'	Transaction status
created_at	TIMESTAMP	Default NOW()	Exact timestamp of the transaction for audit trailing
Table 7: Transactions Table
Table 7 shows the transactional database schema mapping stock updates (sales, transfers, and adjustments) to unique user accounts for audit trail compilation.


Orders Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
order_number	VARCHAR(50)	Unique, Not Null	Human-readable receipt reference number
branch_id	INTEGER	Foreign Key → branches(id)	The retail branch where the sale occurred
customer_id	INTEGER	Foreign Key → customers(id)	Optional link to a registered customer
user_id	INTEGER	Foreign Key → users(id)	Cashier who processed the sale
subtotal	DECIMAL(12,2)	Default 0	Total before VAT and discounts in RWF
discount_amount	DECIMAL(12,2)	Default 0	Total discount applied in RWF
vat_amount	DECIMAL(12,2)	Default 0	VAT amount charged (18%) in RWF
total_amount	DECIMAL(12,2)	Default 0	Final amount paid by the customer in RWF
payment_method	VARCHAR(50)	Default 'cash'	Payment method: cash, momo, or card
status	VARCHAR(50)	Default 'completed'	Order status: completed or voided
created_at	TIMESTAMP	Default NOW()	Timestamp of the sale transaction
Table 8:Orders Table
Table 8 shows the schema of the Orders table, which logs retail sales transactions, including tax calculations, payments, and cashier signatures at checkout.
Stock Transfers Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
transfer_number	VARCHAR(50)	Unique, Not Null	Human-readable transfer reference number
source_branch_id	INTEGER	Foreign Key → branches(id)	Branch sending the stock
dest_branch_id	INTEGER	Foreign Key → branches(id)	Branch receiving the stock
requested_by	INTEGER	Foreign Key → users(id)	User who initiated the transfer request
approved_by	INTEGER	Foreign Key → users(id)	User who approved or rejected the transfer
status	VARCHAR(50)	Default 'pending'	Transfer status: pending, approved, or rejected
priority	VARCHAR(50)	Default 'normal'	Urgency level: normal or urgent
reason	TEXT	Nullable	Reason for requesting the transfer
notes	TEXT	Nullable	Additional operational notes
Table 9:Stock Transfers Table
Table 9 represents the schema of the Stock Transfers table, capturing inter-branch stock movement requests, transit statuses, and operational approvals.
Discrepancy Logs Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
product_id	INTEGER	Foreign Key → products(id)	The product with the detected discrepancy
branch_id	INTEGER	Foreign Key → branches(id)	The location where the discrepancy was detected
expected_quantity	INTEGER	Not Null	System-calculated expected stock level
actual_quantity	INTEGER	Not Null	Recorded or physically counted actual stock level
reason	TEXT	Nullable	Explanation or classification of the discrepancy
reported_by	INTEGER	Foreign Key → users(id)	User who flagged or confirmed the discrepancy
created_at	TIMESTAMP	Default NOW()	Timestamp when the discrepancy was logged
Table 10: Discrepancy Logs Table
Table 10 shows the schema of the Discrepancy Logs table, recording the expected versus actual counts and categorization notes for stock reconciliation.
 
Customers Table
Attribute Name	Data Type	Constraint	Description
id	SERIAL	Primary Key	Auto-increment unique identifier
name	VARCHAR(255)	Not Null	Full name of the customer or business entity
phone	VARCHAR(50)	Nullable	Customer contact phone number
email	VARCHAR(255)	Nullable	Customer email address
address	TEXT	Nullable	Physical address of the customer
customer_type	VARCHAR(50)	Default 'retail'	Customer classification: retail or wholesale
credit_limit	DECIMAL(12,2)	Default 0	Maximum credit allowed for this customer in RWF
credit_used	DECIMAL(12,2)	Default 0	Current outstanding credit balance in RWF
notes	TEXT	Nullable	Additional notes or remarks about the customer
created_at	TIMESTAMP	Default NOW()	Timestamp when the customer record was created
Table 11: Customers Table
Table 11 represents the database schema for the Customers table, detailing customer accounts, contact details, and current credit limit records.


System Architecture Design  
System architecture constitutes a conceptual framework that delineates the structural organization, operational characteristics, and analytical perspectives of a technological solution. It functions as a strategic blueprint, ensuring harmonious coordination among hardware infrastructure, software applications, and human operational resources (Pressman, 2014). For the StockSync Multi-Location Inventory Reconciliation System, the architectural design governs secure interactions across diverse user categories, including Administrators, Warehouse Managers, and Retail Cashiers..  
To ensure optimal modularity, code reusability, and maintainability, StockSync is engineered utilizing a modern, decoupled Client-Server architectural pattern that adapts the Model-View-Controller (MVC) design paradigm for Single Page Applications (SPAs). As illustrated in the architecture diagram below, this ecosystem is divided into three primary functional layers:
1. The Presentation / User Interface Layer (View) 
This layer consists of the client-side single-page application built utilizing React.js to ensure a highly dynamic, fast-loading, and responsive user experience. It provides specialized, role-aware dashboards, such as the Administrative Dashboard for global multi-branch visualization and the Mobile Point-of-Sale (POS) View, which features rapid digital search interfaces and optional barcode scanning to accelerate retail checkout processing.
2. The Application / Logic Layer (Controller) 
Operating as the intermediary conduit, the backend application server is engineered using Node.js and Express.js on a non-blocking, event-driven architecture. This stateless layer handles core business logic, authorizes requests, manages the Automated Reconciliation Engine, and exposes secure RESTful Application Programming Interfaces (APIs) to handle data exchange with the client.
3. The Data Layer (Model) 
The foundational layer is powered by a centralized PostgreSQL relational database. This system was specifically selected for its rigorous ACID (Atomicity, Consistency, Isolation, Durability) compliance, which is mandatory to prevent partial data writes, manage transactional locks, and ensure absolute data integrity during complex, multi-echelon stock transfers.
Operational Data Flow and Security 
To interact with the StockSync platform, stakeholders establish connectivity through web browsers accessible via mobile devices or desktop computing platforms. Upon login, the application server validates user credentials, cryptographically hashing incoming passwords using the Bcrypt algorithm to compare against database hashes. For stateless, secure session management, authenticated users are issued cryptographically signed JSON Web Tokens (JWT) which must accompany all subsequent HTTP API requests.
Once authenticated, the browser interface transmits specific operational requests (e.g., initiating a stock transfer) to the Node.js API server. The server verifies the JWT authorization, performs role checking, and coordinates with the PostgreSQL database within an ACID-compliant transaction block to retrieve or modify inventory metrics. The database processes the queries and returns the results, which the API server formats as structured JSON responses and transmits back to the React frontend, rendering real-time updates to the end user. This architecture is compiled for production deployment using local or remote server environments, utilizing Transport Layer Security (TLS/SSL) encryption to protect all commercial data in transit. 
 
Figure 11: Architecture Design for the StockSync System
Figure 12 shows the Client-Server architecture design for the StockSync system, outlining the data flow between the React.js frontend, the Node.js/Express.js backend API, and the PostgreSQL database.
 

 

CHAPTER 4: IMPLEMENTATION OF THE NEW SYSTEM
Introduction
This chapter focuses on the practical realization of the StockSync Inventory Management System. It transitions from the theoretical designs and models discussed in the previous chapters to the actual development and deployment phase. The chapter details the technology stack selected for the implementation, presents the various interfaces of the system through descriptive placeholders for screenshots, and outlines the testing procedures undertaken to ensure the system's reliability, security, and performance. Furthermore, it specifies the hardware and software requirements necessary for the optimal operation of the system in both client and server environments.
Technologies Used
The development of StockSync utilized a modern full-stack architecture to ensure scalability, responsiveness, and ease of maintenance. The following technologies were selected based on their robustness and industry standards.
Front-End Development
The user interface of StockSync was built to be dynamic, responsive, and user-centric.
•	React.js: A powerful JavaScript library used for building component-based user interfaces. It allowed for the creation of a Single Page Application (SPA) that provides a smooth user experience.
•	Tailwind CSS: Used for styling the application, ensuring a premium aesthetic with dark mode support and responsive layouts.
•	Lucide React: A library of beautiful, consistent icons used to enhance the visual navigation of the system.
•	Context API: Used for state management, particularly for user authentication and theme persistence.
Back-End Development
The server-side logic handles data processing, security, and integration with the database.
•	Node.js: A JavaScript runtime built on Chrome's V8 engine, chosen for its asynchronous and event-driven architecture.
•	Express.js: A minimal and flexible web application framework for Node.js, used to build the RESTful API endpoints.
•	JSON Web Tokens (JWT): Implemented for secure, stateless authentication and role-based access control.
Database Management
•	PostgreSQL: A powerful, open-source object-relational database system used for storing inventory data, sales records, and user information with high integrity. Utilized as the primary relational database to host the system's data, providing high integrity and secure data storage across all modules."
Presentation of the New System
This section showcases the functional modules of the StockSync system. Each module is designed to address specific challenges identified in the manual inventory management process.
User Authentication
To guarantee data confidentiality, protect sensitive commercial records, and prevent internal administrative fraud, StockSync implements a secure authentication and authorization gateway. This module serves as the primary barrier against unauthorized system access, validating employee credentials before granting entry to the application. By relying on industry-standard cryptographic protocols, the authentication workflow ensures that all subsequent client-server communications are securely signed and role-restricted, allowing staff members to access only the resources and options corresponding to their designated operational branch and access level.
 
Figure 10: Login Page Interface
Figure 11 displays the secure authentication gateway designed to validate user credentials against the centralized database. Cashiers, managers, and administrators enter their registered email address and secure password, which triggers a backend HTTP POST request. Upon successful validation using Bcrypt cryptographic matching, the server returns a cryptographically signed JSON Web Token (JWT) that determines the user’s authorized role and automatically redirects them to their respective operational dashboard, establishing a stateless and highly secure session.





Analytics and Forecasting Dashboard
 
Figure 11: Analytics Dashboard
This screen illustrates the central management dashboard populated with real-time operational metrics. Key performance indicators (KPIs) are displayed in dynamic summary cards showing total branch sales, low-stock warnings, and pending transfer counts. The dynamic line chart visualizes daily sales velocity and safety stock trends across active outlets, replacing manual ledger consolidation with automated statistical data streams to guide restocking decisions.
Inventory Management
 
Figure 12: Inventory List View
This interface showcases the comprehensive inventory catalog page, providing staff with live stock levels across all active branches. The grid is searchable using a high-speed search bar and category filters, allowing users to query items by SKU, name, or branch. Color-coded status badges (green for In Stock, yellow for Low Stock, and red for Out of Stock) are automatically updated based on the product’s minimum threshold configuration.
Stock Transfer Workflow 
1.	Requesting stock
 
Figure 13: New Stock Transfer Request Form
This form demonstrates the stock requisition step where a branch manager requests inventory from the central warehouse. The interface provides searchable product dropdowns and automatic quantity checks. The system queries available inventory in real-time, preventing users from requesting quantities exceeding warehouse stock levels, thereby eliminating manual request rejection delays.



2.  Awaiting approval
 
Figure 14:Pending Transfer Queue
This view displays the pending request queue showing the initial state of the stock transfer protocol. Each entry features a unique system-generated transaction number, timestamp, origin location, and target destination. The 'Pending' status badge indicates that the request has been securely written to the database and is currently awaiting source warehouse verification and approval.
3.Transfer approved 
 
Figure 15: Transfer Approved
This interface shows the stock transfer transition to the 'In Transit' state once approved by the warehouse manager. The system deducts the approved quantity from the source warehouse's inventory record and locks the transaction, preventing subsequent modifications or double-spending of inventory. The items are marked as shipped, establishing a clear digital record for the transport driver.

4. Confirming physical receipt
 
Figure 16: Transfer Receipt Confirmation Interface
This screen displays the confirmation prompt visible only to the destination branch manager upon the delivery vehicle's arrival. The interface requires the receiving manager to execute a physical recount, verify the quantities against the digital transfer record, and click 'Confirm Physical Receipt'. This strict multi-stage validation prevents self-approval fraud by ensuring the recipient must physically verify and sign for the shipment.
 


5. Transfer completed
 
Figure 17: Transfer Completed State
This view illustrates the final state of the stock transfer workflow showing the 'Completed' status. Once the destination manager clicks confirm, the transaction block is committed, adding the inventory quantities to the destination branch's stock database. The transfer is moved to the historical archive, generating an immutable audit trail entry detailing timestamps and employee identifiers for full accountability.
Point of Sale (POS) Terminal
 
Figure 18:  POS Terminal Interface
This interface presents the digital Point-of-Sale (POS) terminal used by retail cashiers. It features a responsive product grid for rapid catalog selection and a real-time shopping cart sidebar. The cashier enters customer details and validates the mandatory 9-digit Rwandan Tax Identification Number (TIN) format using client-side regular expressions before finalizing the sale, ensuring full compatibility with RRA regulatory reporting standards.
Inventory Reconciliation
This section shows the automated comparison between physical stock counts and system records, a key objective of the StockSync system.
 
Figure 19: Stock reconciliation
This dashboard illustrates the primary stock reconciliation module used to verify inventory integrity. It aggregates POS sales transactions against recorded stock deductions. This interface allows managers to select a specific branch and date range, automatically querying the database to display comprehensive stock reconciliation logs and highlight operational performance.

 
Figure 20: Checking variance
This view shows the physical variance and discrepancy checking ledger. The interface dynamically calculates the difference between system-expected quantities and actual physical counts entered by audit staff. Discrepancies are highlighted in red along with reported reasons (such as damage or leakage), establishing an immutable accountability trail to analyze stock shrinkage patterns.
 Custom Report Generation
 
Figure 21: Report generator
This interface illustrates the professional report generator dashboard designed for management-level auditing. Users can select customized parameters, including date ranges, specific branches, and report categories (such as Inventory Valuation or Sales Velocity). Clicking the action buttons triggers server-side data compilation, preparing the filtered data for on-screen visualization or professional export.
 
Figure 22:Downloadable stock transfer report
This screen displays a print-ready PDF export of the stock transfer ledger. Generated dynamically by the backend template engine, it incorporates the official company logo, detailed column grids for product names, quantities, and chronological timestamps, alongside designated authorization signature blocks for formal institutional archives and regulatory compliance.

4.4 Software Testing
To guarantee the quality and security of the system, a rigorous testing phase was conducted following industry standards.
Unit Testing
Individual components and functions were tested in isolation to ensure they perform correctly. For instance, the stock deduction logic and TIN validation algorithms were verified to handle various edge cases without errors.
Integration Testing
Integration testing focused on the communication between the frontend, backend, and database. This ensured that a sale processed at the POS correctly updates the inventory levels in the PostgreSQL database and reflects immediately on the Analytics dashboard.
Validation Testing (User Acceptance)
Validation testing was conducted to ensure the system meets the business needs of the stakeholders. This involved verifying the manager-only "Request-Approve-Confirm" workflow to ensure that stock transfers cannot be finalized without physical verification by the receiving manager.
 
Table 12: Software Testing Summary
Table 12 Summary of all software testing conducted on the StockSync system, organised by test type  unit testing, integration testing, and user acceptance testing (UAT). Each entry identifies the component tested, the test procedure applied, and the verified result prior to final system deployment.

 Hardware and Software Requirements
To ensure the StockSync system operates reliably in a production environment, the following hardware and software specifications must be met.
Client-Side Software Requirements
•	Operating System: Windows 10/11, macOS, or Linux.
•	Web Browser: Latest version of Google Chrome, Mozilla Firefox, or Microsoft Edge.
•	PDF Viewer: Required for viewing and printing generated sales receipts.
Server-Side Software Requirements
•	Environment: Node.js runtime (version 18.x or higher).
•	Database: PostgreSQL 14
•	Package Manager: NPM or Yarn for dependency management.
•	Security: SSL/TLS certificate for HTTP encryption.
Client-Side Hardware Requirements
•	Processor: Dual-core 2.0 GHz or higher.
•	Memory (RAM): Minimum 4GB (8GB recommended for multitasking).
•	Display: Minimum resolution of 1280x720 for optimal UI rendering.
•	Input: Standard keyboard, mouse, and optional barcode scanner for POS.
Server-Side Hardware Requirements
•	Processor: Minimum 2-core CPU for local or server hosting.
•	Memory (RAM): Minimum 1GB dedicated RAM for the Node.js process.
•	Storage: 5GB of SSD storage for application files and initial database growth.
•	Network: High-speed internet connection for real-time database synchronization.

CHAPTER FIVE: CONCLUSION AND RECOMMENDATIONS
Conclusion
The development and implementation of the StockSync Inventory Management System was driven by the urgent need to modernize traditional, manual inventory practices that often lead to data inaccuracies, operational delays, and a lack of accountability. Throughout this project, we have transitioned from a fragmented manual system to a centralized, secure, and intelligent digital ecosystem tailored for the modern retail and warehouse environment.
The StockSync system successfully addresses the core challenges of inventory management by providing a robust platform built on modern technologies like React.js and Node.js. Key achievements include the implementation of a hierarchical security model that restricts sensitive operations to authorized managers and admins, thereby reducing the risk of internal shrinkage. The introduction of the three-step "Request-Ship-Confirm" stock transfer workflow has established a clear trail of accountability for goods in transit between branches.
Furthermore, the integration of sales velocity analytics and safety stock alerts alongside real-time reconciliation dashboards empowers decision-makers with actionable insights, moving the business from reactive to proactive inventory control. The system has been validated through rigorous unit, integration, and user acceptance testing, proving its readiness to handle the complexities of daily business operations while ensuring high performance, ACID compliance, and data integrity through its centralized PostgreSQL database.
In conclusion, StockSync is not just a tool for record-keeping; it is a strategic asset that enhances operational efficiency, strengthens security, and provides the visibility needed for sustainable business growth in a competitive market.

Recommendations
While the current version of StockSync significantly improves upon manual processes, the following recommendations are proposed to further enhance the system's capabilities and ensure its long-term success:
Development of Native Mobile Applications
While the system is currently responsive and accessible via web browsers, developing dedicated native mobile applications for Android and iOS would improve the user experience for warehouse staff and managers on the move. Mobile-specific features like push notifications for low-stock alerts and barcode scanning via the device camera would further streamline stock-taking and POS operations.
Integration of other payment Gateways
While the current POS module supports Cash, Mobile Money, and Card payments (featuring an interactive, simulated card authorization gateway for local sandbox validation), future versions of StockSync should transition this mock environment to live production APIs. Specifically, directly integrating with the MTN MoMo API for push-to-payment prompts and commercial banking APIs for real-time card clearing will automate payment capture and eliminate manual cashier verification.
Implementation of Advanced Machine Learning & Seasonal Forecasting Models
The current forecasting module provides a foundational 7-day sales outlook. Future enhancements should incorporate more advanced machine learning algorithms that account for seasonal trends, public holidays, and external economic factors. This would provide even greater accuracy in demand planning and lead to more optimized resource allocation.
Adoption of IoT and RFID Technology
For larger warehouse environments, the integration of Internet of Things (IoT) sensors and Radio Frequency Identification (RFID) tags is recommended. This would enable real-time, automated tracking of individual items without manual scanning, virtually eliminating human error in inventory counts and reconciliation.
Transition to Remote Server Infrastructure
As the business scales, it is recommended to migrate from the current local development environment to a fully redundant, load-balanced remote server infrastructure (such as AWS or regional data centers in Rwanda). This will ensure high availability and data backup across multiple geographic regions, protecting the business against potential hardware failures or data loss.
 
Table 12:Future Development Recommendations Roadmap
Table 12 shows a prioritized implementation roadmap for future system enhancements, mapping recommended features like native mobile applications, live payment integrations, and IoT sensors to expected timelines. 
REFERENCES 
Dennis, A., Wixom, B., & Roth, R. (2015). Systems analysis and design (6th ed.). Hoboken, NJ.: 
John Wiley & Sons. 
Elmasri, R., & Navathe, S. (2015). Fundamentals of database systems (7th ed.). Boston, MA: 
Pearson. 
B Special Business Ltd. (2024). Annual Inventory Audit Report. 
B Special Business Ltd. (2025). Quarterly Operations Review. Kigali: Auth
Fowler, M. (2003). UML distilled: A brief guide to the standard object modeling language (3rd ed.). Boston, MA: Addison-Wesley Professional. 
Haddara, M., & Zach, O. (2011). ERP systems in SMEs: An extended literature review. 
International Journal of Information Science, 2(6), 106-116. 
Hasibuan, A. S. (2024). Development of real-time multi-location inventory system using VModel. Informatics Study Program, Faculty of Industrial Technology, Ahmad Dahlan University. 
Innovation, R. M. (2020). Smart Rwanda Master Plan. Government of Rwanda. 
Odasco, B. T. (2023). Analysis of the inventory management system towards enhanced university service delivery Journal. International Journal of Science, Technology, Engineering and Mathematics, 3(3). 
Omisola, J. O. (2024). A process automation framework for smart inventory control: Reducing operational waste through JIRA-driven workflow and lean practices.  
Pressman, R. S. (2014). Software engineering: A practitioner's approach (8th ed.). New York, NY: McGraw-Hill Education. 
Sbai, N., & Berrado, A. (2023). A literature review on multi-echelon inventory management: The case of pharmaceutical supply chain. Equipe AMIPS-Ecole Mohammadia d'Ingénieurs, Université Mohammed 5. 
Sola, S. R. (2024). Reconciliation of inventory between Oracle ERP and Oracle Cloud WMS. 
Senior Manager, Information Technology. 
Sommerville, I. (2015). Software engineering (10th ed.). Pearson. 
Sudarmi, E., & Sunaryo, W. (2024). Enhancing inventory accuracy and operational performance with ERP. Sinergi International Journal of Logistics, 2(2), 76-89. 
Wetherbe, J. C. (2012). Systems analysis and design: Best practices (4th ed.). West Publishing Company. 




 















APPENDICES











Data collection letter
 
Approval Letter from the organization
 
Curriculum Vitae
 

