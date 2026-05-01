Adventist University of Central Africa
Multi-Location Inventory Reconciliation System
CASE STUDY: B Special Business Ltd
A final year project presented in partial fulfillment of the requirements for the 
degree of
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Major in
Software Engineering
By
Adeline Tuyizere
January, 2026
ABSTRACT
A Final Project for the Bachelor's Degree in Information Technology Emphasis in Software 
Engineering Adventist University of Central Africa
Title: StockSync: Multi-Location Inventory Reconciliation System 
Name of the researcher: Adeline Tuyizere
Name of the Faculty Advisor: Rene Ruganji
Date Completed: ..../..../2026
In emerging economies, retail expansion necessitates digital transformation in supply chains. 
Currently, Small and Medium Enterprises (SMEs) rely heavily on decentralized, manual inventory 
systems using physical notebooks and spreadsheets. This inefficiency causes critical data 
redundancy, recurring stock discrepancies, and delayed decision-making due to a lack of real-time 
visibility.
This project presents StockSync, a multi-location inventory reconciliation system for SMEs. 
StockSync centralizes warehouse and retail data into a unified platform. It streamlines operations 
through highly efficient digital data entry, automated reconciliation algorithms to instantly detect 
stock anomalies, and predictive analytics to forecast inventory depletion.
[Paragraph3&4 (findings and conclusion) => AFTER CHAPTER 4 As discussed]
i
DECLARATION
I, Adeline Tuyizere, declare that this "StockSync: Multi-Location Inventory Reconciliation 
System for B Special Business Ltd" project is the fruit of my effort and has not received any 
previous credit at the Adventist University of Central Africa or any other university or institution.
Signature: ...........................................................
Date: ....../....../2026
ii
APPROVAL
I, Rene Ruganji, certify that this project report has been done under my supervision and submitted 
with my approval.
Signature: ...........................................................
Date: ....../....../2026
iii
DEDICATION
With great pleasure, I dedicate this Research Project
To Almighty God,
To my lovely parents,
To all my family members,
To all my friends and colleagues,
To my supervisor for his kind guidance.
iv
ACKNOWLEDGEMENTS
First and foremost, I thank God Almighty, the Source of all knowledge, wisdom, and strength, 
without whose grace and blessings this work would not have been possible. The completion of this 
project would not have been achievable without the support and guidance of many individuals to 
whom I owe my deepest gratitude.
I am profoundly grateful to my supervisor, Rene Ruganji, whose mentorship and thoughtful 
guidance played a vital role in shaping this research. His constructive feedback, patience, and 
academic rigor challenged me to produce work of greater depth and quality than I could have 
achieved alone. His dedication to my academic growth has been invaluable.
I extend my sincere appreciation to the dedicated faculty and academic staff of the Department of 
Software Engineering at the Adventist University of Central Africa (AUCA). Your commitment 
to imparting knowledge with clarity and passion, and your willingness to support students beyond 
the classroom, have profoundly impacted my academic and personal development. The AUCA 
community, guided by values of integrity, excellence, and service, has shaped not only my 
technical knowledge but also my character and worldview.
To my beloved parents, I am who I am because of you. Thank you for your unwavering love, 
prayers, financial support, and words of encouragement that sustained me through every challenge. 
To my siblings, thank you for your constant belief in me.
I am deeply grateful to my friends and classmates who made my university journey not only 
bearable but highly meaningful. Navigating the complexities of software engineering requires a 
strong support system, and you made the process easier. Your friendship and support have been a 
tremendous source of strength.
May God bless you all abundantly.
Adeline Tuyizere
v
TABLE OF CONTENTS
ABSTRACT..................................................................................................................................... i
DECLARATION ............................................................................................................................ ii
APPROVAL ..................................................................................................................................iii
DEDICATION............................................................................................................................... iv
ACKNOWLEDGEMENTS............................................................................................................ v
TABLE OF CONTENTS............................................................................................................... vi
LIST OF TABLES......................................................................................................................... ix
LIST OF FIGURES ........................................................................................................................ x
LIST OF ABBREVIATIONS........................................................................................................ xi
CHAPTER ONE: GENERAL INTRODUCTION ......................................................................... 1
Introduction................................................................................................................................. 1
Background of the Study ............................................................................................................ 2
SMEs in Supply Chain Management...................................................................................... 2
Current Inventory Management Technology.......................................................................... 2
The Manual Process Challenge............................................................................................... 3
Technological Solutions and Implementation ........................................................................ 4
Statement of the Problem............................................................................................................ 4
Operational Impact and Manifestations.................................................................................. 5
Choice and Motivation of the Study ........................................................................................... 6
Objectives of the Study............................................................................................................... 6
General Objective ................................................................................................................... 6
Specific Objectives ................................................................................................................. 7
Scope of the Project .................................................................................................................... 7
vi
Functional Coverage ............................................................................................................... 8
Technical Scope ...................................................................................................................... 8
Excluded from Scope.............................................................................................................. 9
Methodology and Techniques Used............................................................................................ 9
Research Design...................................................................................................................... 9
Documentation Review......................................................................................................... 10
Structured Interviews............................................................................................................ 10
Direct Observation................................................................................................................ 10
System Requirements Analysis............................................................................................. 10
Development Methodology .................................................................................................. 10
Expected Results....................................................................................................................... 11
System Deliverables.............................................................................................................. 11
Operational Improvements.................................................................................................... 11
Scalability and Future Integration......................................................................................... 11
Organization of the Thesis........................................................................................................ 12
CHAPTER TWO: ANALYSIS OF THE CURRENT SYSTEM................................................. 13
Introduction............................................................................................................................... 13
Description of Current System Environment............................................................................ 13
Historical Background .......................................................................................................... 13
Mission.................................................................................................................................. 14
Vision.................................................................................................................................... 14
Description of the Current System............................................................................................ 14
Modeling of the Current System (AS-IS Model)...................................................................... 16
Problems with the Current System ........................................................................................... 17
Performance .......................................................................................................................... 17
vii
Information ........................................................................................................................... 17
Economics............................................................................................................................. 17
Control .................................................................................................................................. 17
Efficiency.............................................................................................................................. 18
Service................................................................................................................................... 18
Proposed Solutions.................................................................................................................... 18
System Requirements................................................................................................................ 19
Functional Requirements...................................................................................................... 19
Non-Functional Requirements.............................................................................................. 20
CHAPTER THREE: REQUIREMENT ANALYSIS AND DESIGN OF THE NEW SYSTEM 21
Introduction............................................................................................................................... 21
Unified Modeling Language (UML) ........................................................................................ 21
Design of the New System........................................................................................................ 21
Use Case Diagram..................................................................................................................... 21
Sequence Diagram .................................................................................................................... 23
Class Diagram........................................................................................................................... 25
Database Diagram..................................................................................................................... 27
Entity-Relationship Diagram (ERD)..................................................................................... 27
Comprehensive Data Dictionary............................................................................................... 27
System Architecture Design ..................................................................................................... 42
References..................................................................................................................................... 45
viii
ix
LIST OF TABLES
Table 1: Users Table ..................................................................................................................... 29
Table 2: Branches Table ............................................................................................................... 30
Table 3: Products Table ................................................................................................................ 33
Table 4: Inventory Table............................................................................................................... 34
Table 5:Transactions Table........................................................................................................... 35
Table 6: Orders Table ................................................................................................................... 37
Table 7: Stock Transfers Table ..................................................................................................... 39
Table 8:Discrepancy Logs Table .................................................................................................. 40
Table 9: Customers Table ............................................................................................................. 42
 
LIST OF FIGURES
Figure 1: AS-IS Process Model and Data Flow for B Special Business Ltd................................ 16
Figure 2: UML Use Case Diagram for the StockSync System..................................................... 22
Figure 3: Sequence Diagram for the StockSync system............................................................. 24
Figure 4 Class diagram for the StockSync Sytem ........................................................................ 26
Figure 5: Entity Relationship diagram for StockSync .................................................................. 27
Figure 6: Architecture Design for the StockSync System ............................................................ 44
x
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
xi
REST: Representational State Transfer
RRA: Rwanda Revenue Authority
SME: Small and Medium Enterprises
TIN: Tax Identification Number
TLS/SSL: Transport Layer Security / Secure Sockets Layer
UAT: User Acceptance Testing
UML: Unified Modeling Language
xii
CHAPTER ONE: GENERAL INTRODUCTION 
Introduction
Rwanda's Vision 2050 and Smart Rwanda Master Plan position digital transformation as a 
fundamental pillar of economic competitiveness, prioritizing technology adoption across all 
sectors (Innovation, 2020). Within this evolving landscape, small and medium enterprises (SMEs) 
in distribution and supply chain sectors face mounting pressure to modernize inventory 
management systems to meet contemporary operational demands.
SMEs constitute Rwanda's economic backbone, yet encounter unique challenges distinguishing 
them from larger corporations, particularly regarding resource constraints, technological capacity, 
and organizational complexity (Haddara & Zach, 2011). These limitations prove especially acute 
in inventory management, where inability to invest in expensive enterprise resource planning 
(ERP) systems forces continued dependence on manual processes.
Research demonstrates that manual inventory management generates error rates of 15-20%, 
resulting in significant financial losses and operational inefficiencies (Odasco, 2023). When SMEs 
expand from single-location to multi-site operations without upgrading inventory infrastructure, 
they encounter compounding inefficiencies at each level. The absence of real time synchronization 
creates fundamental disconnects between physical stock movements and recorded data, 
undermining decision-making and exposing organizations to preventable losses.
This project proposes StockSync, a Multi-Location Inventory Reconciliation System addressing 
these critical deficiencies. By implementing automated reconciliation algorithms, real-time 
tracking, and predictive analytics, StockSync transforms operational efficiency while providing a 
scalable model for SMEs navigating Rwanda's digital transformation.
1
Background of the Study
SMEs in Supply Chain Management
Small and medium enterprises operate under fundamentally different constraints than large 
corporations. (Haddara & Zach, 2011) establish that SMEs possess distinct characteristics 
including limited financial resources, restricted technical expertise, and simplified organizational 
structures. These factors create a paradox: SMEs require efficient inventory systems to compete, 
yet lack capital for sophisticated ERP solutions deployed by larger competitors.
Multi-echelon supply chains further complicate inventory management. Distribution operations 
typically coordinate across central warehouses, regional points, and retail outlets. Sbai's (Sbai & 
Berrado, 2023) review demonstrates that effective multi-level coordination requires sophisticated 
tracking, real-time synchronization, and automated reconciliation features manual systems cannot 
provide.
When SMEs scale across locations without infrastructure upgrades, complexity increases 
exponentially beyond manual process capacity. Research in developing economies reveals 
persistent challenges with stock accuracy and data integrity even with basic digital tools. (Odasco, 
2023) found institutions using elementary systems still struggle with discrepancies when 
reconciliation remains manual and periodic rather than automated and continuous. This intensifies 
in commercial distribution where transaction volumes and product diversity exceed institutional 
contexts.
Current Inventory Management Technology
Technology evolution has created a two-tiered market: sophisticated enterprise systems for large 
corporations versus basic spreadsheet tools inadequate for growing multi-location operations. 
Advanced platforms like Oracle Cloud WMS and SAP demonstrate technical feasibility of real 
time tracking and automated reconciliation (Sola, 2024), but implementation costs, complexity, 
and licensing fees exceed typical SME budgets in developing economies.
Critically, (Sudarmi & Sunaryo, 2024) confirm that even modern ERPs improve accuracy through 
digitization, but "reconciliation and discrepancy handling rely on operational procedures rather 
2
than automated detection mechanisms" (p. 77). This means organizations investing in basic ERPs 
experience the same reconciliation challenges as manual systems merely with digitized rather than 
paper records.
This creates what (Haddara & Zach, 2011) identify as the "missing middle" a market void leaving 
SMEs without appropriate solutions. The cost structure proves particularly prohibitive: "ERP 
software cost as a percentage of overall cost is higher for SMEs than large enterprises" (p. 113), 
forcing continued operational inefficiency or expensive customization.
To bridge the gap between basic spreadsheets and expensive enterprise software, custom 
automation frameworks offer an effective middle ground. Research by (Omisola, 2024)
demonstrates that automating key inventory workflows successfully reduces operational waste 
without requiring complete ERP implementation. Similarly, (Hasibuan, 2024) proved that 
developing a targeted, real-time tracking system across multiple locations gives SMEs exactly the 
functionality they need while remaining financially accessible.
The Manual Process Challenge
Traditional SME inventory management follows fragmented manual workflows creating multiple 
failure points. This standard manual workflow exhibits critical deficiencies. First, multiple manual 
transcription steps (paper → ledger → Excel → consolidation) introduce compounding errors at 
each transfer. Research indicates manual entry errors of 1-5% per transaction (Odasco, 2023)
across thousands of monthly transactions, these create substantial discrepancies difficult to trace 
retrospectively.
Second, lack of real-time synchronization means discrepancies remain undetected for weeks. By 
monthly reconciliation, causal transactions have passed, witnesses forgot details, and evidence 
degraded. This temporal disconnect between occurrence and detection fundamentally undermines 
corrective action.
Third, absence of automated pattern detection prevents identifying systematic issues like recurring 
shrinkage at specific locations, shifts, or product categories. Manual reconciliation reveals only 
aggregate discrepancies ("Shop A short 47 units") without analytical insights. (Sudarmi & 
3
Sunaryo, 2024) characterize this as "operational procedures" versus "systematic analytical 
processes" a limitation manual diligence cannot overcome.
Technological Solutions and Implementation
Modern systems leverage key technologies overcoming manual limitations. Real-time tracking via 
scanning and mobile entry eliminates transcription errors while providing immediate visibility 
(Hasibuan, 2024). Cloud-based databases ensure multi-location synchronization without complex 
on-premise infrastructure, eliminating needs for dedicated IT staff, server maintenance, and 
backup management while providing growth scalability. (Hasibuan, 2024) demonstrate cloud 
systems achieve real-time synchronization in seconds versus days or weeks for manual 
consolidation.
Automated reconciliation represents perhaps the most critical advancement. Rather than monthly 
audits, systems continuously compare expected stock (from receipts, transfers, sales) against actual 
quantities, immediately flagging discrepancies (Sola, 2024) This shift from periodic reactive 
detection to continuous proactive monitoring fundamentally changes inventory control dynamics.
Predictive analytics further enhance value. Analyzing historical sales velocity, seasonal trends, and 
depletion rates enables stock-out forecasting and proactive restocking alerts (Omisola, 2024), 
transforming inventory management from reactive recording to strategic planning supporting 
growth and competitive advantage. The V-Model development approach, successfully applied by 
(Hasibuan, 2024), provides structured validation at each development stage, reducing 
implementation risks and increasing adoption likelihood in SME contexts with limited technical 
expertise.
Statement of the Problem
Small and medium enterprises in Rwanda's import and distribution supply chains face critical 
inefficiencies from reliance on manual, non-integrated inventory management systems. Manual 
processes generate 15-20% error rates, causing substantial financial losses, operational delays, and 
compromised customer satisfaction (Odasco, 2023). These inefficiencies intensify as businesses 
4
scale from single-location to multi-site networks, where absence of real-time synchronization 
creates fundamental disconnects between physical stock and recorded data.
The primary problem is absence of unified, real-time inventory tracking systems synchronizing 
stock data across all locations. Warehouse records, retail logs, and sales transactions exist in 
separate notebooks and isolated files with no automated linkage. No single person or system 
possesses accurate, current total inventory view. Daily operations depend on outdated, frequently 
incorrect information, forcing time-consuming physical verification and manual reconciliation.
Operational Impact and Manifestations
Distribution SMEs managing high-volume flows from international suppliers through central 
warehouses to retail outlets find paper-based systems adequate for single-store operations but 
wholly inadequate for multi-location complexity. Each location operates as independent data silo, 
with paper documents requiring manual re-entry at each step slow, error-prone, and completely 
unscalable.
Financial losses occur through "phantom inventory" where records and physical stock mismatch, 
causing lost sales and unnecessary procurement. Stock shrinkage from theft, damage, or 
misplacement goes undetected for weeks, with inventory shrinkage typically representing 1.5-2% 
annual revenue higher with poor tracking (Dennis, Wixom, & Roth, 2015).
Operational inefficiency consumes resources as managers dedicate a significant portion of their 
workweeks to manual counts and data entry instead of strategic activities. Sales staff waste time 
physically verifying availability, delaying service and reducing productivity. Compromised 
decision-making results from absent timely, accurate data. Procurement operates reactively on 
estimation rather than analysis, causing stock-outs of popular items and overstocking slow-movers.
Management lacks real-time visibility into performance, trends, or patterns, hindering market 
responsiveness. Competitive disadvantage emerges as rivals adopt digital tools for superior 
experiences. SMEs unable to guarantee availability or provide efficient service risk losing 
customer trust and market share. Increased operational risk stems from absent security controls, 
audit trails, and fraud prevention in paper systems. Lost or altered records prove irrecoverable, and 
5
discrepancies become untraceable, exposing organizations to internal fraud and external 
compliance risks.
Choice and Motivation of the Study
This project emerged from observing a widening gap in Rwanda between traditional SME 
operations and modern digital expectations. Many distribution enterprises still rely heavily on 
manual processes, which causes operational inefficiencies and restricts their ability to grow. In a 
market where digital accessibility has shifted from being a competitive advantage to an absolute 
necessity, these manual limitations severely threaten a company's ability to survive and compete.
Recognizing technology could bridge this gap and catalyze growth for indigenous businesses, 
developing a comprehensive inventory reconciliation solution addresses authentic challenges 
across Rwanda's SME distribution sector, potentially benefiting numerous enterprises beyond 
single organizations and contributing to broader sectoral transformation.
This aligns with Adventist University of Central Africa's philosophy of cultivating graduates 
leveraging technical expertise to resolve substantive societal challenges. AUCA's Software 
Engineering curriculum emphasizes practical application of technological solutions advancing 
socioeconomic progress. This project manifests the university's vision of nurturing innovation 
serving public interests and contributing to national development objectives.
Critically, the focus on reconciliation not just recording addresses a gap where even modern ERPs 
rely on "operational procedures rather than automated detection mechanisms" (Sudarmi & 
Sunaryo, 2024).
Objectives of the Study
General Objective
To design, develop, and implement a centralized inventory reconciliation system ensuring 
accurate, real-time tracking and synchronization across multiple warehouse and retail locations for 
SMEs distribution operations, eliminating manual errors, reducing inefficiencies, preventing 
6
financial losses from discrepancies, and establishing scalable digital foundations supporting 
business expansion within Rwanda's competitive retail sector.
Specific Objectives
To ensure the successful development of the system, the following SMART (Specific, Measurable, 
Achievable, Relevant, and Time-bound) objectives have been established:
• Automate inventory tracking across warehouse and outlets using optimized digital search 
interfaces and stock registration, ensuring every stock movement is digitally recorded in 
real-time, eliminating manual entry errors.
• Develop automated reconciliation module continuously comparing sales against inventory, 
immediately flagging discrepancies, replacing monthly manual processes with daily 
automated reporting. 
• Provide real-time dashboard offering complete inventory visibility, stock valuation, and 
performance metrics across locations, enabling data-driven decisions without manual 
compilation. 
• Implement predictive analytics analyzing historical trends and product velocity to forecast 
depletion and generate proactive restocking alerts. 
• Create a secure customer database with TIN number storage for RRA compliance record￾keeping, automating audit trails and reducing legal/financial risk.
• To establish role-based access controls protecting sensitive data, maintaining encrypted 
audit logs, ensuring appropriate permissions across roles.
Scope of the Project
This project encompasses systematic design, development, and implementation of integrated 
Multi-Location Inventory Reconciliation for SME distribution enterprises, facilitating seamless 
warehouse, retail, and management interactions through optimized processing, enhanced 
coordination, and evidence-based decision-making.
7
Functional Coverage
• Inventory & Transaction Tracking: Comprehensive digital recording of all stock 
movements (receipts, transfers, sales, returns). The system generates complete audit trails 
with precise timestamps, user attribution, and location data to ensure operational 
accountability. 
• Automated Reconciliation Engine: algorithms that continuously cross-reference 
expected stock against actual recorded quantities. The system immediately flags 
discrepancies and generates daily categorization reports based on variance type and 
financial impact. 
• Multi-Location Synchronization and dashboards: Real-time data synchronization 
across the central warehouse and all retail outlets. This module establishes a single, 
unified source of truth and provides managers with real-time visual dashboards 
summarizing global inventory valuation. 
• Predictive Analytics: Integration of sales trend analysis and depletion forecasting to 
generate smart alerts. By analyzing historical data and product velocity, the system 
predicts stock-outs before they occur to optimize procurement. 
• Role-Based Security and administration: Strict access control mechanisms providing 
distinct, secure permissions for system administrators, warehouse managers, and retail 
cashiers. This ensures users only interact with data relevant to their specific operational 
tier. 
• Regulatory and Tax Compliance: Standardized transaction recording that captures 
necessary metadata (such as TIN formatting and official receipt structures) to ensure the 
business's digital records remain compliant with local tax and auditing standards. 
Technical Scope
• Backend: Node.js/Express RESTful API with secure endpoints, standard HTTP methods, 
comprehensive error handling, and structured responses.
• Database: PostgreSQL with ACID compliance, appropriate normalization, strategic 
denormalization for analytics, and optimized indexing.
8
• Frontend: React responsive web application with adaptive layouts, component 
architecture for reusability, and consistent UX.
• Digital Point-of-Sale: High-speed text search and catalog interfaces, supported by 
optional browser-based barcode scanning for rapid product lookup during sales and stock 
operations. 
• Security: JWT authentication, role-based authorization, HTTPS encryption, SQL injection 
prevention, encrypted audit logs, password complexity, and session timeouts.
• Scalability: The software architecture is intrinsically modular, designed to accommodate 
future business expansion across multiple retail branches and warehouse locations without 
requiring structural changes to the core system.
• Availability: The system is architected for deployment on scalable infrastructure, designed 
to maintain high availability during standard operational business hours.
Excluded from Scope
Hardware procurement, customer-facing e-commerce, comprehensive accounting integration, 
advanced ERP modules (HR, payroll, supplier management), and active third-party logistics 
integration (architecture supports future integration).
Methodology and Techniques Used 
The research framework synthesizes diverse methodologies establishing thorough comprehension 
of SME distribution operations, inventory deficiencies, and technological advancement 
requirements, combining qualitative and quantitative approaches through stakeholder 
consultations, workplace assessments, and documentation examination.
Research Design
Case study design focused on SME distribution operations provides appropriate depth for 
understanding complex processes and validating requirements within authentic contexts
(Hasibuan, 2024). The approach integrates exploratory elements investigating SME inventory 
challenges and descriptive components documenting specific workflows and requirements.
9
Documentation Review
A comprehensive analysis was conducted on internal organizational records, peer-reviewed 
academic literature, and local regulatory requirements. This review ensured that the resulting 
system specifications were both technically sound and fully aligned with national business 
standards.
Structured Interviews
Semi-structured interviews captured diverse perspectives from management, warehouse staff, 
retail personnel, and administrative staff. Consistent frameworks explored workflows, frustrations, 
time allocation, error frequencies, functionality requirements, and transformation expectations.
Direct Observation
Primary data was gathered by observing daily operations in person. This involved shadowing 
employees through their workflows, timing specific manual processes, and documenting the 
frequency of human error. Additionally, an assessment of staff interaction with existing technology 
was conducted to ensure the new system would be user-friendly and appropriate for their technical 
skill levels.
System Requirements Analysis
The project utilized an organized synthesis process to translate raw data into technical 
specifications. This involved developing detailed use cases to map user interactions and applying 
the MoSCoW methodology to prioritize core functionalities over secondary features. Additionally, 
technical and operational constraints were identified and reviewed during validation sessions with 
stakeholders to ensure the proposed solution was both feasible and effective.
Development Methodology
The project adopts a hybrid development approach, combining the flexibility of Agile iterations 
with the structured validation of the V-Model, as advocated by (Hasibuan, 2024). Development is 
conducted in iterative two-week sprints, delivering functional software increments for regular 
10
stakeholder review. To ensure high reliability, a continuous testing framework is employed, 
encompassing unit, integration, system, and user acceptance testing (UAT) to validate the system’s 
usability and stability before final deployment.
Expected Results
System Deliverables
• Fully Functional Web Application: Deployed system with secure authentication 
operating on standard browsers.
• Comprehensive Documentation: Technical documentation and user documentation.
• Source Code Repository: Complete, well-documented code with version control enabling 
future maintenance.
Operational Improvements
• Enhanced Accuracy: Automated reconciliation substantially reduces discrepancies 
through continuous monitoring.
• Real-Time Visibility: Instantaneous updates on movements, levels, and processing with 
automated alerts.
• Optimized Resources: The system uses data to make sure the company spends its money 
on the right products and spends its employees' time on the right tasks.
• Strengthened Decisions: Continuous monitoring of patterns enables informed 
interventions.
• Improved Compliance: Customer TIN storage and automated audit trails ensure 
regulatory compliance.
Scalability and Future Integration
Modular architecture supports progressive integration of mobile applications, CRM systems, 
logistics protocols, and ERP connectivity as needs evolve. This ensures operational relevance and 
adaptability aligned with innovations and growth trajectories.
11
Organization of the Thesis
Chapter One: General Introduction provides comprehensive research context including SME 
supply chain background, detailed problem statement, SMART objectives, scope definition, and 
methodological approach.
Chapter Two: Analysis of the Current System examines existing operational frameworks, 
concentrating on inventory workflows, transaction processing, and data management. PIECES 
framework systematically evaluates limitations justifying technological intervention.
Chapter Three: Requirement Analysis and Design presents logical and technical 
conceptualization including theoretical frameworks, system architecture, and database 
specifications. UML diagrams illustrate architectural design, functional relationships, and 
operational logic.
Chapter Four: Implementation documents practical development and deployment including 
implemented functionalities with screenshots, technological frameworks, infrastructure 
prerequisites, validation procedures, and deployment methodology.
Chapter Five: Conclusion and Recommendations synthesizes principal findings, articulates 
transformative impact, and formulates recommendations for enhancement and scholarly inquiry.
12
CHAPTER TWO: ANALYSIS OF THE CURRENT SYSTEM
Introduction
Before engineering a comprehensive technological solution, established software engineering 
methodologies dictate that a rigorous, systematic evaluation of the existing operational 
environment must be conducted (Sommerville, 2015). This analytical phase is critical for 
identifying specific workflow bottlenecks, understanding user interactions, and defining the 
precise parameters of the operational problem space.
This chapter provides a highly detailed, comprehensive analysis of the current manual inventory 
and distribution system utilized by B Special Business Ltd. It begins by establishing the 
organizational context, including the historical background, mission, and vision of the enterprise. 
Subsequently, it deconstructs the "AS-IS" process model, mapping the physical and informational 
flow of goods across multiple echelons of the supply chain.
The system's inherent vulnerabilities are then critically evaluated using the PIECES (Performance, 
Information, Economics, Control, Efficiency, Service) analytical framework (Wetherbe, 2012). 
Finally, drawing from these documented deficiencies, the chapter establishes the foundational 
functional and non-functional requirements that the proposed StockSync digital architecture must 
fulfill to drive institutional digital transformation.
Description of Current System Environment
Historical Background
B Special Business Ltd was established in Kigali, Rwanda, to bridge a critical gap in the regional 
supply chain between international product manufacturers and the rapidly growing Rwandan retail 
market. Initiating operations as a localized, single-store trading entity, the company capitalized on 
rising consumer demand to steadily expand its operational footprint. Today, B Special Business 
Ltd has evolved into a recognized, mid-sized importer and wholesale distributor within the capital 
city.
13
The company currently operates a decentralized organizational structure to manage its high￾volume operations. At the core of its supply chain is a central warehouse facility, which serves as 
the primary receiving hub for bulk international shipments. From this central node, inventory is 
systematically distributed to multiple company-owned retail branches strategically positioned 
across high-traffic commercial zones in Kigali.
The workforce comprises specialized personnel distributed across these nodes, including 
procurement officers, central warehouse managers, logistics drivers, retail branch managers, and 
point-of-sale cashiers. Despite its physical expansion and growing market share, the enterprise's 
internal data management infrastructure has not evolved proportionately, remaining heavily reliant 
on traditional, paper-based administrative methodologies that increasingly threaten to constrain its 
future scalability.
Mission
To serve as Rwanda’s most trusted and reliable import and distribution partner by delivering high￾quality commercial products with unmatched operational efficiency, sustained product 
availability, and an unwavering commitment to customer satisfaction across all retail touchpoints.
Vision
To build a modern, efficient, and transparent distribution network that guarantees consistent 
product availability and seamless service across all our branches.
Description of the Current System
The current Internal Inventory and Distribution Model at B Special Business Ltd operates on a 
strictly manual, localized data-capture paradigm. The entire supply chain data flow relies on 
physical documentation passing from one geographic location to another, without any centralized 
digital repository.
This operational workflow is categorized into four distinct chronological phases:
14
Phase 1: Inbound Logistics and Warehouse Reception. The inventory cycle begins when bulk 
shipments arrive at the central warehouse from international suppliers. The central Warehouse 
Manager is tasked with manually offloading and counting the physical goods. Upon verification 
of the physical count against the supplier's invoice, the manager transcribes this data into a large, 
physical master ledger known as the "Goods Received Note" (GRN) logbook. This physical book 
remains securely locked in the warehouse office and is the sole authoritative record of the 
company's total imported assets.
Phase 2: Intra-Company Stock Requisition and Transfer. As retail branches deplete their local 
stock, Branch Managers must request replenishments. Because they cannot digitally view the 
central warehouse inventory, this is typically done via informal communication channels. Upon 
receiving a request, the Warehouse Manager manually drafts a paper "Transfer Note" in duplicate. 
The requested goods are physically counted, loaded onto a transport vehicle, and the original paper 
Transfer Note is handed to the logistics driver. The warehouse ledger is manually updated to reflect 
the deduction.
Phase 3: Branch Reception and Point-of-Sale (POS). Upon arrival at the retail branch, the 
Branch Manager or Cashier must physically recount the delivered goods to ensure they match the 
driver's paper Transfer Note. Once verified, the items are placed on the retail shelves. The branch 
maintains its own separate, physical "Shop Ledger" where incoming goods are recorded. As retail 
customers purchase items, the cashiers manually document each transaction into a daily "Sales 
Log" notebook.
Phase 4: Month-End Consolidation and Auditing. Because the Central Warehouse Ledger and 
the diverse Retail Branch Sales Logs are entirely disconnected, B Special Business Ltd operates 
with fragmented data silos. Executive management does not have a real-time view of total 
company inventory. To calculate revenue and identify stock levels, management must wait until 
the end of the month. Auditors physically collect the Sales Logs from all branches, retrieve the 
GRN ledger from the warehouse, and spend days manually typing thousands of handwritten 
transactions into spreadsheets to attempt a retroactive reconciliation.
15
Modeling of the Current System (AS-IS Model)
To fully illustrate the functional disconnects and data silos inherent in the manual processes of B 
Special Business Ltd, an AS-IS Process Model has been formulated utilizing Unified Modeling 
Language (UML) standards for activity diagramming (Dennis, Wixom, & Roth, 2015). The 
diagram below visually maps the flow of physical inventory and its corresponding, disjointed 
paper trails across the various actors within the supply chain.
Figure 1: AS-IS Process Model and Data Flow for B Special Business Ltd
16
Problems with the Current System
Based on the AS-IS process model, the specific vulnerabilities of the manual inventory system are 
categorized below using the PIECES framework:
Performance
The system exhibits critically low throughput and unacceptable data response times. Because 
information moves at the speed of physical paper, executing a routine stock transfer between the 
warehouse and a retail branch requires hours of manual paperwork and verification. Generating 
comprehensive performance reports takes days of manual data aggregation across multiple 
branches.
Information
The integrity, accuracy, and timeliness of organizational data are fundamentally compromised. 
The existence of decentralized "data silos" means that warehouse ledgers and shop sales logs rarely 
synchronize perfectly. Discrepancies between the recorded ledger data and physical shelf counts 
are commonplace, driven by human transcription errors, delayed ledger entries, and arithmetic 
miscalculations.
Economics
The manual system inflicts direct, quantifiable financial damage on the enterprise. The inability to 
track stock movements in real-time creates an environment where inventory shrinkage remains 
completely undetected for up to four to six weeks until the next monthly audit. As supported by 
(Sudarmi & Sunaryo, 2024), inventory shrinkage caused by disjointed manual tracking typically 
represents significant annual revenue loss that cannot be recovered retrospectively.
Control
The current operational environment provides virtually no security, accountability, or verifiable 
audit trails. Physical notebooks and paper ledgers are inherently vulnerable; they can be easily 
misplaced, intentionally altered, or physically damaged without any possibility of digital recovery. 
17
Because entries are handwritten without robust authentication, it is nearly impossible to trace 
accountability back to a specific employee when valuable stock goes missing.
Efficiency
The workflow is characterized by a massive duplication of effort and severe data redundancy. The 
exact same data variables (product name, SKU, date, quantity) are written manually by the 
warehouse manager upon receipt, transcribed again onto a transfer note, written again by the 
receiving branch manager, and finally typed into an Excel spreadsheet by an auditor.
Service
The culmination of these internal failures directly degrades the external customer experience. 
Because retail staff do not possess real-time visibility into central warehouse stock levels, they 
frequently rely on outdated knowledge to confirm product availability for wholesale buyers. This 
results in significant service delays and customer frustration when staff physically search the 
warehouse only to discover empty shelves.
Proposed Solutions
To decisively resolve the systemic vulnerabilities identified within the PIECES framework, this 
project proposes the design, development, and deployment of StockSync an Intelligent Multi￾Location Inventory Reconciliation System. StockSync is envisioned as a comprehensive web and 
mobile-responsive application specifically engineered to bridge the digital gap in SME supply 
chains. The proposed system directly targets the root cause of B Special Business Ltd's 
inefficiencies: data fragmentation.
By centralizing all inventory operations into a single database, StockSync ensures that the central 
warehouse and all retail branches operate from a single source of truth. The application utilizes a 
centralized digital catalog where products are tracked via unique identifiers (SKUs). This allows 
retail staff to process sales instantaneously using an optimized, fast-search interface accessible 
from any standard web-enabled device.
18
Crucially, StockSync transcends basic digital record-keeping by integrating an Automated 
Reconciliation Engine. This engine will continuously and autonomously cross-reference daily 
point-of-sale retail transactions against central warehouse stock deductions, instantly flagging 
discrepancies at the close of each business day rather than at the end of the month.
System Requirements
The successful realization of the StockSync architecture necessitates the formal definition of 
rigorous system requirements. These requirements serve as the fundamental blueprint for the 
software engineering phase (Sommerville, 2015), ensuring the final application precisely 
addresses the documented operational deficiencies.
Functional Requirements
• User Access and Role Management: The system must allow the super-administrator to 
create, read, update, and deactivate user accounts with strict Role-Based Access Control 
(RBAC).
• Digital Stock Registration: The system includes a product registration module allowing 
warehouse staff to log incoming shipments with digital identifiers, enabling rapid database 
lookup at the point of sale and during stock operations.
• Multi-Echelon Stock Transfer: The system must facilitate digital transfer requisitions, 
allowing retail branches to request stock digitally.
• Point-of-Sale (POS) Integration: The system must provide a mobile-responsive interface 
allowing retail cashiers to record customer transactions, which immediately deduct stock 
quantities from that branch's localized database.
• Automated Discrepancy Reconciliation: The system must feature an autonomous 
computational engine that executes at the close of daily operations, cross-referencing total 
logged sales against physical inventory deductions to generate immediate variance reports.
• Predictive Restocking Alerts: The system must analyze historical sales data and current 
depletion rates to forecast stock-outs.
19
• Compliance and Customer Data: The system must securely store wholesale customer 
profiles and validate the format of Rwandan Tax Identification Numbers.
Non-Functional Requirements
• Performance and Latency: The system must process database write-operations and 
reflect inventory updates across all dashboard views with minimal latency, achieved 
through optimized PostgreSQL queries and indexed relational tables.
• Security and Authentication: All user passwords must be cryptographically hashed. 
System access and API endpoints must be secured utilizing JSON Web Tokens (JWT).
• Reliability and Data Integrity: The underlying relational database (PostgreSQL) must 
adhere to strict ACID compliance standards to prevent partial data corruption.
• Scalability: The software architecture is intrinsically modular, designed to accommodate 
future business expansion across multiple retail branches and warehouse locations without 
requiring structural changes to the core system.
• Usability and Accessibility: The frontend interfaces must employ responsive design 
principles, ensuring seamless operability across standard desktop monitors and mobile 
tablet devices.
• Availability: The system is architected for deployment on scalable infrastructure, designed 
to maintain high availability during standard operational business hours.
20
CHAPTER THREE: REQUIREMENT ANALYSIS AND DESIGN 
OF THE NEW SYSTEM
Introduction
The successful implementation of any robust software solution relies heavily on a rigorous design 
phase that translates theoretical business requirements into concrete technical blueprints 
(Pressman, 2014). Having established the functional and non-functional requirements necessary 
to resolve the manual inefficiencies at B Special Business Ltd in Chapter 2, this chapter focuses 
exclusively on the architectural and logical design of the proposed system: StockSync.
The chapter details the overarching system architecture, presents Unified Modeling Language 
(UML) diagrams to illustrate system behavior, outlines the comprehensive database schema 
through Entity-Relationship modeling, establishes the User Interface (UI) design principles, and 
defines the specific technology stack chosen to ensure system scalability and security.
Unified Modeling Language (UML)
To provide a standardized, globally recognized visual representation of the StockSync platform's 
functional logic, Unified Modeling Language (UML) diagrams have been engineered based on the 
standards outlined by (Fowler, 2003). These diagrams serve as the primary communication 
mechanism between the system designers and the development team.
Design of the New System
Use Case Diagram
The Use Case diagram defines the operational boundaries of the system and illustrates the specific 
functional interactions between external actors and internal processes.
21
Figure 2: UML Use Case Diagram for the StockSync System
22
As illustrated in Figure 2, the operational privileges are strictly segregated. The Administrator 
holds overarching privileges, including system configuration, user management, audit log access, 
and reconciliation oversight. The Warehouse Manager is authorized to manage inventory, register 
products, and approve multi-echelon stock transfers. The Retail Cashier's interactions are 
intentionally restricted to the point-of-sale interface. The Customer is represented as an external 
actor who initiates purchases and receives receipts but does not interact directly with the system..
Sequence Diagram
While the Use Case diagram illustrates what the system does, the Sequence Diagram maps how 
objects interact within the system chronologically to execute a specific function.
23
Figure 3: Sequence Diagram for the StockSync system
24
This sequence resolves the critical "Data Silo" problem. When a Branch Manager digitally requests 
stock, the Warehouse Manager initiates a transfer. The backend API updates the database, placing 
stock into "Transit". Upon physical arrival, the Branch Manager confirms receipt in the system, 
triggering a database transaction that simultaneously deducts items from the warehouse and 
appends them to the retail branch, ensuring ACID compliance and eliminating manual 
transcription errors.
Class Diagram
The Class Diagram maps the static structural blueprint of the StockSync application, serving as 
the direct blueprint for the Object-Oriented Programming (OOP) implementation within the 
backend environment.
25
Figure 4 Class diagram for the StockSync Sytem
26
Database Diagram
Data integrity, rapid query performance, and transactional security are paramount. StockSync 
utilizes PostgreSQL, a robust Relational Database Management System (RDBMS), to handle high￾concurrency transactions.
Entity-Relationship Diagram (ERD)
The Entity-Relationship Diagram provides the conceptual architecture of the data layer, defining 
the entities and the logical relationships that govern the database.
Figure 5: Entity Relationship diagram for StockSync
Comprehensive Data Dictionary
To ensure precise database instantiation, the physical schema has been strictly normalized to the 
Third Normal Form (3NF) to eliminate data redundancy and prevent insertion anomalies (Elmasri 
27
28
& Navathe, 2015). Below are the structural definitions of the 9 core tables constituting the 
StockSync system.
Users Table
Attribute 
Name
Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier 
for each user
name VARCHAR(255) Not Null Full name of the employee
email VARCHAR(255) Unique, Not Null Email address used as login 
credential
password VARCHAR(255) Not Null Bcrypt cryptographically hashed 
password
role VARCHAR(50) Default 'staff' Access level: admin, manager, 
staff
branch_id INTEGER Foreign Key → 
branches(id)
Links the user to their assigned 
operational branch
29
failed_attempts INTEGER Default 0 Tracks consecutive failed login 
attempts for lockout
locked_until TIMESTAMP Nullable Timestamp until which the 
account remains locked
last_login TIMESTAMP Nullable Timestamp of the user's most 
recent successful login
created_at TIMESTAMP Default NOW() Timestamp when the account 
was created
Table 1: Users Table
Branches Table
Attribute 
Name
Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier for 
each location
name VARCHAR(255) Not Null Commercial name of the branch or 
warehouse
30
location VARCHAR(255) Nullable Physical address of the branch
contact VARCHAR(255) Nullable Contact information for the branch
branch_type VARCHAR(50) Default 
'warehouse'
Classification: warehouse or retail
manager_name VARCHAR(255) Nullable Name of the branch manager
latitude DECIMAL(10,8) Nullable GPS latitude coordinate for 
geolocation mapping
longitude DECIMAL(11,8) Nullable GPS longitude coordinate for 
geolocation mapping
is_active BOOLEAN Default TRUE Indicates whether the branch is 
currently operational
created_at TIMESTAMP Default NOW() Timestamp when the branch record 
was created
Table 2: Branches Table
31
Products Table
Attribute Name Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier 
for each product
name VARCHAR(255) Not Null Commercial name of the product
sku VARCHAR(100) Unique, Not 
Null
Stock Keeping Unit code for 
inventory tracking
barcode VARCHAR(100) Nullable Barcode value for scanner-based 
product lookup
description TEXT Nullable Detailed product description
category VARCHAR(100) Nullable Product category (e.g. Soft Drinks, 
Water, Sparkling Juice)
32
brand VARCHAR(100) Nullable Brand or manufacturer name
price DECIMAL(10,2) Not Null Standard retail selling price in 
RWF
cost_price DECIMAL(10,2) Default 0 Purchase cost from supplier in 
RWF
supplier_name VARCHAR(255) Nullable Name of the primary supplier
supplier_lead_days INTEGER Default 0 Number of days required for 
supplier restocking
image_url TEXT Nullable File path to the product image
is_vat_inclusive BOOLEAN Default 
TRUE
Indicates whether the price 
includes 18% VAT
status VARCHAR(50) Default 
'active'
Product status: active or inactive
created_at TIMESTAMP Default 
NOW()
Timestamp when the product was 
registered
33
Table 3: Products Table
Inventory Table
Attribute 
Name
Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier
product_id INTEGER Foreign Key → 
products(id)
The product whose stock is being 
tracked
branch_id INTEGER Foreign Key → 
branches(id)
The location holding this stock
quantity INTEGER Default 0 Current real-time stock level at 
this location
min_stock_level INTEGER Default 10 Minimum threshold that triggers 
a low stock alert
34
last_updated TIMESTAMP Default NOW() Timestamp of the most recent 
stock update
Table 4: Inventory Table
: 
Transaction Table
Attribute Name Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique 
identifier
product_id INTEGER Foreign Key → 
products(id)
The product involved in the 
movement
source_branch_id INTEGER Foreign Key → 
branches(id)
Origin branch of the stock 
movement
dest_branch_id INTEGER Foreign Key → 
branches(id)
Destination branch of the stock 
movement
type VARCHAR(50) Not Null Movement type: receive, sale, 
transfer, or adjustment
35
quantity INTEGER Not Null Number of units involved in the 
transaction
user_id INTEGER Foreign Key → 
users(id)
Employee who recorded the 
transaction
status VARCHAR(50) Default 'completed' Transaction status
created_at TIMESTAMP Default NOW() Exact timestamp of the 
transaction for audit trailing
Table 5:Transactions Table
Orders Table
Attribute Name Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique 
identifier
order_number VARCHAR(50) Unique, Not Null Human-readable receipt 
reference number
36
branch_id INTEGER Foreign Key → 
branches(id)
The retail branch where the 
sale occurred
customer_id INTEGER Foreign Key → 
customers(id)
Optional link to a registered 
customer
user_id INTEGER Foreign Key → 
users(id)
Cashier who processed the 
sale
subtotal DECIMAL(12,2) Default 0 Total before VAT and 
discounts in RWF
discount_amount DECIMAL(12,2) Default 0 Total discount applied in 
RWF
vat_amount DECIMAL(12,2) Default 0 VAT amount charged (18%) 
in RWF
total_amount DECIMAL(12,2) Default 0 Final amount paid by the 
customer in RWF
payment_method VARCHAR(50) Default 'cash' Payment method: cash, 
momo, or card
37
amount_tendered DECIMAL(12,2) Default 0 Amount given by the 
customer in RWF
change_amount DECIMAL(12,2) Default 0 Change returned to the 
customer in RWF
status VARCHAR(50) Default 'completed' Order status: completed or 
voided
created_at TIMESTAMP Default NOW() Timestamp of the sale 
transaction
Table 6: Orders Table
Stock Transfers Table
Attribute Name Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique 
identifier
transfer_number VARCHAR(50) Unique, Not Null Human-readable transfer 
reference number
38
source_branch_id INTEGER Foreign Key → 
branches(id)
Branch sending the stock
dest_branch_id INTEGER Foreign Key → 
branches(id)
Branch receiving the stock
requested_by INTEGER Foreign Key → 
users(id)
User who initiated the transfer 
request
approved_by INTEGER Foreign Key → 
users(id)
User who approved or rejected 
the transfer
status VARCHAR(50) Default 'pending' Transfer status: pending, 
approved, or rejected
priority VARCHAR(50) Default 'normal' Urgency level: normal or 
urgent
reason TEXT Nullable Reason for requesting the 
transfer
notes TEXT Nullable Additional operational notes
39
rejected_reason TEXT Nullable Reason provided if the transfer 
was rejected
created_at TIMESTAMP Default NOW() Timestamp when the transfer 
was requested
updated_at TIMESTAMP Default NOW() Timestamp of the most recent 
status update
Table 7: Stock Transfers Table
Discrepancy logs table
Attribute Name Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier
product_id INTEGER Foreign Key → 
products(id)
The product with the detected 
discrepancy
branch_id INTEGER Foreign Key → 
branches(id)
The location where the 
discrepancy was detected
40
expected_quantity INTEGER Not Null System-calculated expected 
stock level
actual_quantity INTEGER Not Null Recorded or physically counted 
actual stock level
reason TEXT Nullable Explanation or classification of 
the discrepancy
reported_by INTEGER Foreign Key → 
users(id)
User who flagged or confirmed 
the discrepancy
created_at TIMESTAMP Default NOW() Timestamp when the 
discrepancy was logged
Table 8:Discrepancy Logs Table
Customers Table
Attribute 
Name
Data Type Constraint Description
id SERIAL Primary Key Auto-increment unique identifier
41
name VARCHAR(255) Not Null Full name of the customer or business 
entity
phone VARCHAR(50) Nullable Customer contact phone number
email VARCHAR(255) Nullable Customer email address
tin VARCHAR(50) Nullable Rwanda Revenue Authority Tax 
Identification Number
tin_verified BOOLEAN Default 
FALSE
Indicates whether the TIN has been 
verified
address TEXT Nullable Physical address of the customer
customer_type VARCHAR(50) Default 
'retail'
Customer classification: retail or 
wholesale
credit_limit DECIMAL(12,2) Default 0 Maximum credit allowed for this 
customer in RWF
credit_used DECIMAL(12,2) Default 0 Current outstanding credit balance in 
RWF
42
notes TEXT Nullable Additional notes or remarks about the 
customer
created_at TIMESTAMP Default 
NOW()
Timestamp when the customer record 
was created
Table 9: Customers Table
System Architecture Design
System architecture constitutes a conceptual framework that delineates the structural 
organization, operational characteristics, and analytical perspectives of a technological solution. 
It functions as a strategic blueprint, ensuring harmonious coordination among hardware 
infrastructure, software applications, and human operational resources (Pressman, 2014). For the 
StockSync Multi-Location Inventory Reconciliation System, the architectural design governs 
secure interactions across diverse user categories, including Administrators, Warehouse 
Managers, and Retail Cashiers. 
To ensure optimal modularity, code reusability, and maintainability, StockSync is engineered 
utilizing a modern, decoupled Client-Server architectural pattern that strictly adheres to the 
Model-View-Controller (MVC) design paradigm. As illustrated in the architecture diagram 
below, this ecosystem is divided into three primary functional layers: 
1. The Presentation / User Interface Layer (View)
This layer consists of the frontend client applications built utilizing React.js to ensure a highly 
dynamic, fast-loading user experience. It provides specialized interfaces tailored to user roles, 
such as the Administrative Dashboard for global multi-branch visualization and the Mobile 
Point-of-Sale (POS) View, which features rapid digital search interfaces and optional barcode 
scanning to accelerate retail checkout processing. 
2. The Application / Logic Layer (Controller)
Operating as the intermediary conduit, the backend server is engineered using NodeJS and 
Express.js on a non-blocking architecture. This layer handles core business logic, processes 
incoming HTTP requests via secure RESTful Application Programming Interfaces (APIs) and
manages the Automated Reconciliation Engine. 
3. The Data Layer (Model)
The foundational layer is powered by a centralized PostgreSQL relational database. This system 
was specifically selected for its rigorous ACID (Atomicity, Consistency, Isolation, Durability) 
compliance, which is mandatory to prevent partial data writes and ensure data integrity during 
complex, multi-echelon stock transfers. 
Operational Data Flow and Security
To interact with the StockSync platform, stakeholders establish connectivity through web 
browsers accessible via mobile devices or desktop computing platforms. Upon platform access, 
all user credentials are cryptographically hashed using the Bcrypt algorithm. The application 
server processes these authentication requests, utilizing JSON Web Tokens (JWT) to ensure 
strict, stateless authorization. 
Once authenticated, the browser interface transmits specific operational requests (e.g., initiating 
a stock transfer) to the application server. The server coordinates with the PostgreSQL database 
to retrieve or modify pertinent inventory metrics. The database subsequently extracts the 
requested information and transmits the response back through the API to the frontend, 
delivering real-time processed data to the user. This architecture is compiled for production 
deployment via a Content Delivery Network (CDN) and scalable cloud hosting, utilizing 
Transport Layer Security (TLS/SSL) encryption to protect all commercial data in transit. 
43
Figure 6: Architecture Design for the StockSync System
44
REFERENCES
Dennis, A., Wixom, B., & Roth, R. (2015). Systems analysis and design (6th ed.). Hoboken, NJ.: 
John Wiley & Sons.
Elmasri, R., & Navathe, S. (2015). Fundamentals of database systems (7th ed.). Boston, MA: 
Pearson.
Fowler, M. (2003). UML distilled: A brief guide to the standard object modeling language (3rd 
ed.). Boston, MA: Addison-Wesley Professional.
Haddara, M., & Zach, O. (2011). ERP systems in SMEs: An extended literature review. 
International Journal of Information Science, 2(6), 106-116.
Hasibuan, A. S. (2024). Development of real-time multi-location inventory system using V￾Model. Informatics Study Program, Faculty of Industrial Technology, Ahmad Dahlan 
University.
Innovation, R. M. (2020). Smart Rwanda Master Plan. Government of Rwanda.
Odasco, B. T. (2023). Analysis of the inventory management system towards enhanced 
university service delivery Journal. International Journal of Science, Technology, 
Engineering and Mathematics, 3(3).
Omisola, J. O. (2024). A process automation framework for smart inventory control: Reducing 
operational waste through JIRA-driven workflow and lean practices.
Pressman, R. S. (2014). Software engineering: A practitioner's approach (8th ed.). New York, 
NY: McGraw-Hill Education.
Sbai, N., & Berrado, A. (2023). A literature review on multi-echelon inventory management: The 
case of pharmaceutical supply chain. Equipe AMIPS-Ecole Mohammadia d'Ingénieurs, 
Université Mohammed 5.
Sola, S. R. (2024). Reconciliation of inventory between Oracle ERP and Oracle Cloud WMS.
Senior Manager, Information Technolog.
Sommerville, I. (2015). Software engineering (10th ed.). Pearson.
Sudarmi, E., & Sunaryo, W. (2024). Enhancing inventory accuracy and operational performance 
with ERP. Sinergi International Journal of Logistics, 2(2), 76-89.
Wetherbe, J. C. (2012). Systems analysis and design: Best practices (4th ed.). West Publishing 
Company.
45