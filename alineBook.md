Adventist University of Central Africa
LOGISTICS AND DISTRIBUTION MANAGEMENT SYSTEM
Case Study: Bspecial Business Ltd 
A Final Year project presented in partial fulfilment of the requirements for the 
degree of 
BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Major in
Software Engineering
By
Uwineza Aline
June, 2024
i
ABSTRACT 
Research Project of the Bachelor degree in Information Technology
Emphasis in Software Engineering
Adventist University of Central Africa
(AUCA)
Title: LOGISTICS AND DISTRIBUTION MANAGEMENT SYSTEM (LDMS)
Name of Researcher: Uwineza Aline
Name of Faculty Advisor: Dr. SEBAGENZI Jason
Date Completed: July, 2024.
In the logistics and distribution sector, a Logistics and Distribution Management System (LDMS) 
acts as an intermediary between different stakeholders, including suppliers, warehouse managers, 
and clients, allowing them to communicate and interact effectively. LDMS defines a set of rules 
and protocols that govern how logistical processes should be managed, enabling companies to 
access certain functionalities or data from external services or systems.
A Comparative Study of Logistics and Distribution Management Systems, we delve into the world 
of distribution management and explore the crucial role that an effective LDMS plays in creating 
efficient and interconnected logistics operations.
The goal of this project is to improve the current logistics and distribution management system by 
addressing its existing issues and implementing a more efficient solution. We'll use UML for 
accurate system analysis and design, MySQL for scalable data storage, and React.js to create a 
dynamic user interface. Node.js will manage back-end operations, ensuring real-time data 
processing. The system will be deployed using a SaaS model to provide scalability and easy access. 
By conducting observations and interviews with stakeholders, we will define requirements and 
understand user needs. Comprehensive testing and validation will ensure that the system meets 
performance and functionality standards. 
ii
iii
DECLARATION
I, UWINEZA Aline, a software engineering student at Adventist University of Central Africa in 
the Faculty of Information Technology, with Registration No. 23678, declare that this research 
project report is solely based on my original work and experience. To my knowledge, it has not 
been previously presented, either in full or in part, at any university or higher education institution.
Signature………………... 
Date: …/……………/………………
iv
DEDICATION
With great pleasure, I dedicate this Research Project
To Almighty God,
To my lovely parents, 
To all my family members,
To all my friends and colleagues, 
To my supervisor for his kind guidance. 
v
APPROVAL
I, DR, SEBAGENZI Jason, hereby certify that this project report, has been done under my 
supervision and submitted with my approval. 
Signature: …………………………………………. 
Date: …/……………/………………
vi
TABLE OF CONTENTS 
ABSTRACT..................................................................................................................................... i
DECLARATION ...........................................................................................................................iii
DEDICATION............................................................................................................................... iv
APPROVAL ................................................................................................................................... v
TABLE OF CONTENTS............................................................................................................... vi
LIST OF FIGURES ........................................................................................................................ x
LIST OF TABLES......................................................................................................................... xi
LIST OF ABBREVIATIONS....................................................................................................... xii
ACKNOWLEDGEMENTS......................................................................................................... xiii
CHAPTER 1 ................................................................................................................................... 1
GENERAL INTRODUCTION....................................................................................................... 1
Introduction ................................................................................................................................. 1
Background of the Study............................................................................................................. 2
Problem Statement ...................................................................................................................... 3
Choice and Motivation in the Study............................................................................................ 3
Objectives of the study................................................................................................................ 4
General Objective .................................................................................................................... 4
Specific Objectives.................................................................................................................. 4
Scope of the Study....................................................................................................................... 4
Methodology and Techniques Used in the Study........................................................................ 4
Observation.............................................................................................................................. 5
Documentation......................................................................................................................... 5
vii
Interview.................................................................................................................................. 5
Expected Results......................................................................................................................... 5
Organization of the Report.......................................................................................................... 5
CHAPTER 2 ................................................................................................................................... 7
ANALYSIS OF EXISTING SYSTEM .......................................................................................... 7
Introduction ................................................................................................................................. 7
Description of Current System Environment.............................................................................. 7
History Background................................................................................................................. 7
Vision....................................................................................................................................... 8
Mission .................................................................................................................................... 8
Description of the Current System.............................................................................................. 8
Analysis of the Current System................................................................................................... 9
Modeling Current System........................................................................................................ 9
Design of Activities of the Existing System:........................................................................... 9
Problems of the Current System.............................................Error! Bookmark not defined.
Proposed Solutions.................................................................................................................... 12
System Requirements................................................................................................................ 13
Functional Requirements....................................................................................................... 13
Non-Functional Requirements:.............................................................................................. 14
CHAPTER 3 ................................................................................................................................. 16
REQUIREMENTS ANALYSIS AND DESIGN OF THE NEW SYSTEM................................ 16
Introduction ............................................................................................................................... 16
Unified Modeling Language (UML)......................................................................................... 16
Design of the new System......................................................................................................... 17
viii
Use Case Diagram ................................................................................................................. 19
Class Diagram........................................................................................................................ 29
Sequence Diagram................................................................................................................. 30
Activity Diagram................................................................................................................... 35
Database Schema Diagram.................................................................................................... 35
Data Dictionary...................................................................................................................... 36
Architecture Diagram Design................................................................................................ 41
CHAPTER 4 ................................................................................................................................. 42
IMPLEMENTATION OF THE NEW SYSTEM......................................................................... 42
Introduction ............................................................................................................................... 42
Tools and Technologies used .................................................................................................... 42
Frontend:................................................................................................................................ 42
Backend: ................................................................................................................................ 43
Presentation of the New System ............................................................................................... 43
Software Testing ....................................................................................................................... 49
The Unit Test......................................................................................................................... 49
The Integration test................................................................................................................ 49
The Validation test................................................................................................................. 50
Hardware and Software compatibility requirements................................................................. 50
Client-Side Software Requirements ...................................................................................... 50
Client-Side Hardware Requirements..................................................................................... 50
Server-Side Software Requirements...................................................................................... 51
Server-Side Hardware Requirements .................................................................................... 51
CHAPTER 5 ................................................................................................................................. 52
ix
CONCLUSION AND RECOMMENDATIONS ......................................................................... 52
Conclusion................................................................................................................................. 52
Recommendations..................................................................................................................... 53
REFERENCES ..............................................................................Error! Bookmark not defined.
Journal ........................................................................................Error! Bookmark not defined.
Websites.....................................................................................Error! Bookmark not defined.
APPENDICES .............................................................................................................................. 55
Curriculum Vitae....................................................................................................................... 56
x
LIST OF FIGURES
Figure 1: The Existing System........................................................................................................ 9
Figure 2: Use Case Diagram......................................................................................................... 19
Figure 3: Class Diagram ............................................................................................................... 29
Figure 4: User Login Sequence Diagram...................................................................................... 30
Figure 5: Browse Products Sequence Diagram ............................................................................ 30
Figure 6: Placing an order Sequence Diagram ............................................................................. 31
Figure 7: Feedback Sequence Diagram ........................................................................................ 31
Figure 8: Driver login and deliver product Sequence Diagram.................................................... 32
Figure 9 Stock Manager Updating order status Sequence Diagram............................................. 33
Figure 10 Admin Sequence Diagram............................................................................................ 34
Figure 11: Activity Diagram......................................................................................................... 35
Figure 12 Database Schema Diagram........................................................................................... 36
Figure 13 System Architecture Design ......................................................................................... 41
Figure 14: Landing Page............................................................................................................... 43
Figure 15: Login Page................................................................................................................... 44
Figure 16: Browse Products page ................................................................................................. 44
Figure 17: My Orders Page........................................................................................................... 45
Figure 18 Order Tracking Page..................................................................................................... 45
Figure 19: Feedback Threads Page ............................................................................................... 46
Figure 20: Thread Detail Page ...................................................................................................... 46
Figure 21: Manage Stock Page ..................................................................................................... 47
Figure 22: Manage Orders Page ................................................................................................... 47
Figure 23 :Update Order status by Stock Manager Page.............................................................. 48
xi
LIST OF TABLES
Table 1: Register and Login Use Case Description ...................................................................... 21
Table 2: Browse Product Use Case Description ........................................................................... 22
Table 3: Place an Order Use Case Description............................................................................. 22
Table 4: Track Order Use Case Description ................................................................................. 23
Table 5: Give Feedback Use Case Description............................................................................. 24
Table 6: Update Order Status Use Case Description.................................................................... 25
Table 7: Deliver the Product Use Case Description ..................................................................... 26
Table 8: Admin Use Case Description.......................................................................................... 26
Table 9 Manage Users and Transports Use Case Table Description........................................... 28
Table 10 Manage Orders Use Case Table Description................................................................. 29
Table 11: Users Table Data Dictionary ........................................................................................ 37
Table 12: Orders Table data dictionary ........................................................................................ 38
Table 13: Stocks table data dictionary.......................................................................................... 39
Table 14: Transports Table data dictionary .................................................................................. 40
Table 15: Feedbacks Table data dictionary ................................................................................. 40
Table 16: Surveys Table data dictionary ...................................................................................... 41
xii
LIST OF ABBREVIATIONS
AUCA Adventist University of Central Africa
CSS Cascading Style Sheet
DB Database
DBMS Database Management System
FK Foreign Key
GB Giga Byte
HTML Hyper Text Markup Language
ICT Information and Communications Technology
IDE Integrated Development Environment
IT Information Technology
MB Mega Byte
MySQL My Structured Query Language
OOA Object Oriented Analysis
OOD Object Oriented Design
OOM Object Oriented Methodology
PHP Hypertext Preprocessor
PK Primary Key
SRS Software Requirement Specifications
UML Unified Modeling Language
UP XML Unified Process - extensible Markup Language
xiii
ACKNOWLEDGEMENTS
I would like to extend my deepest gratitude to everyone who has contributed to the successful 
development and implementation of this project.
First and foremost, I offer my heartfelt thanks to the Almighty and faithful God for His unwavering 
guidance, blessings, and strength throughout this endeavor. His divine presence has been a 
constant source of comfort and inspiration.
I am profoundly grateful to my family, particularly my parents and siblings, for their steadfast 
support and understanding. Their love and encouragement have been the foundation of my 
achievements.
My sincere appreciation goes to my lecturers for their invaluable guidance, expertise, and patience. 
Their commitment to my growth and education has been truly commendable.
I also wish to acknowledge the significant contributions of my friends, whose companionship, 
insightful discussions, and teamwork have greatly enriched this project, making it a rewarding 
experience.
Lastly, I extend my gratitude to my supervisors for their ongoing support, encouragement, and 
insightful feedback. Their guidance has been crucial in shaping this project and enhancing its 
effectiveness.
To all of you, thank you for your indispensable contributions and support. Your involvement has 
had a profound impact, and I am genuinely appreciative of your presence in my life.
UWINEZA Aline
CHAPTER 1
GENERAL INTRODUCTION
Introduction
In today’s world, technology plays a crucial role in helping businesses manage their operations 
efficiently. It includes tools and systems that support customer interactions, production, logistics, 
and financial management. In the past, managing business information and tracking deliveries 
required a lot of time and effort. Now, thanks to advanced technology, these processes have 
become much simpler. (Lengow, 2024)
A Logistics and Distribution Management System is a software application that allows users to 
manage and monitor their business from anywhere with an internet connection. This system helps 
manage customers, orders, track shipments, oversee warehouses, and keep inventory records up 
to date. (Munro, 2024)
In this research, we focus on improving the logistics and distribution processes by implementing 
a modern Logistics and Distribution Management System. By adopting this advanced LDMS, we 
aim to streamline operations, ensure efficient transportation and warehouse management, and 
uphold the reputation of businesses as reliable distribution partners in Rwanda’s competitive 
market. This system will also facilitate better decision-making through real-time data analysis and 
reporting, ultimately leading to increased productivity and customer satisfaction.
Furthermore, the implementation of an LDMS can significantly reduce operational costs by 
optimizing resource allocation and minimizing errors associated with manual processes. 
Automation of routine tasks allows employees to focus on more strategic activities, driving 
innovation and business growth. 
As the market continues to evolve, having a robust Logistics Management System in place will 
provide businesses with the agility and scalability needed to adapt to changing demands and 
remain competitive and help them increase their sales and production, Business agility refers to 
the ability of an organization to adapt and respond rapidly to changes in the business environment.
It will also support proactive decision-making and enhance overall operational efficiency and bring 
money to the business. (Management, 2023)
1
Background of the Study
Bspecial business ltd is a leading distributor in Rwanda, offering a wide range of products sourced 
locally and internationally. However, behind its success lies a challenge – outdated methods of 
data management using books and papers. This traditional approach hampers efficiency and poses 
risks of data loss. Moreover, the lack of a modern system for tracking orders and ineffective 
communication methods add to the complexity. Customers often face delays in obtaining 
information about their packages, leading to frustration.
To overcome these challenges and maintain its competitive edge, special business ltd recognizes 
the need for a modern Logistics and Distribution Management System. Such a system will 
streamline operations, enhance data accuracy, and improve customer satisfaction.
A modern LDMS will allow Special Business Ltd to track orders in real-time, reducing delays and 
improving communication with customers. It will also help in keeping inventory records up to 
date, ensuring that products are always available when needed. By automating these processes, the 
company will save time and reduce errors, leading to more efficient operations.
Additionally, a new system will make it easier for Bspecial Business Ltd to manage its warehouses. 
With better organization and tracking, the company can quickly locate products and manage stock 
levels, avoiding both shortages and overstock situations. This will help in meeting customer 
demands more effectively and maintaining a smooth flow of goods.
Improved data management will also provide valuable insights into the company's operations. By 
analyzing data on sales, deliveries, and customer feedback, Bspecial Business Ltd can identify 
areas for improvement and make informed decisions to enhance its services. This will help the 
company stay competitive in the market and continue to grow. By leveraging technology to create 
a user-friendly platform, this system aims to empower clients with seamless access to goods, order 
fulfillment, and feedback mechanisms.
2
By investing in a modern Logistics and Distribution Management System, Bspecial Business Ltd 
will not only solve its current challenges but also set the stage for future success. The new system 
will make the company more efficient, reliable, and responsive to customer needs, ensuring 
continued growth and customer satisfaction.
`Problem Statement
In the past, it was hard to find information about goods and services, wasting a lot of time. Also, 
transporting goods is risky because accidents, theft, and damages can happen. Companies need to 
make sure their transportation is safe and reliable. My study found that there's a big gap in how 
companies connect events related to customers with different ways of moving goods. Bspecial 
business ltd has some problems too. They do things manually, which slows them down and makes 
customers unhappy because their orders are late. Plus, it costs them a lot of money to run their 
business smoothly. To fix these problems and make things better, we need to find out what's 
causing them and come up with solutions. That's what my research is all about.
To fix these problems and make things better, we need to find out what's causing them and come 
up with solutions. This involves identifying inefficiencies in the current processes and exploring 
how technology can address these issues. For instance, automating data management and order 
tracking can significantly reduce delays and errors. Improving communication channels will 
enhance customer satisfaction by providing timely updates and accurate information. Additionally, 
investing in safer and more reliable transportation methods will minimize risks and reduce 
operational costs. My research aims to provide practical recommendations to bridge the gaps 
identified, streamline operations, and ultimately help Bspecial Business Ltd operate more 
efficiently and effectively in a competitive market.
Choice and Motivation in the Study
Driven by a desire to transform challenges into opportunities, we embark on a mission to 
revolutionize the way Bspecial business ltd does business. Our motivation is clear—to leverage 
the power of technology to streamline operations, optimize efficiency, and enhance customer 
satisfaction. In doing so, we not only propel Bspecial business ltd to new heights but also contribute 
to Rwanda's broader vision of economic prosperity and growth.
3
Objectives of the study
General Objective
Our overarching goal is to engineer a Logistics and Distribution Management System that 
transcends mere adequacy, aiming to exceed expectations in enhancing operational efficiency, 
elevating customer satisfaction, and optimizing cost-effectiveness within logistics and 
distribution operations.
Specific Objectives
The specific objectives of this study are as follows:
⮚ Analyze current logistics and distribution processes at Bspecial business ltd to identify 
areas for improvement.
⮚ Design a tailored Logistics and Distribution Management System for Bspecial business 
ltd.
⮚ Develop and implement the designed system, ensuring smooth integration with existing 
processes.
⮚ Evaluate the implemented system's effectiveness in enhancing efficiency, satisfaction, 
and cost reduction.
Scope of the Study
The project revolves around the development of a web-based application tailored for addressing 
challenges in transporting goods and services both locally and globally within Rwanda. The 
research conducted aims to mitigate the issues prevalent in the existing transportation systems. 
Specifically, the project seeks to streamline logistics operations, enhance efficiency, and overcome 
common hurdles faced by transporters in their daily activities. However, the scope of the project 
is limited to addressing transportation-related challenges and does not extend to broader societal 
issues beyond the logistics domain.
Methodology and Techniques Used in the Study
To achieve the objectives of this study, the following methodologies and techniques were 
employed:
4
Observation
Observation involves visiting the store and stocks of the business to directly see the challenges 
that the business face in their logistics. This method provides first-hand insights into the current 
tools, techniques, and gaps in how they sell goods. The data gathered from these observations will 
help in designing the web-based application to meet the actual needs of the users.
Documentation
Data is systematically collected from already-existing records as part of document evaluation. This 
method assisted us in combing through all the information in numerous works on our subject to 
include the pertinent details.
Interview
An interview is a conversation used to obtain information. In a research interview, both the 
interviewee and the interviewer are present. While the interviewee responds to the questions, the 
interviewer manages the conversation and poses questions. Both in-person and telephone 
interviews are possible.
Expected Results
The new Logistics and Distribution Management System at Bspecial business ltd is expected to 
improve operational efficiency by streamlining processes and reducing manual work. Real-time 
tracking of inventory and orders will provide accurate information, enhancing decision-making 
and customer satisfaction. The system will also help reduce costs through optimized routes and 
fewer errors.
Additionally, better communication between suppliers, clients, and internal teams will minimize 
delays and improve collaboration. Enhanced data security and compliance will build trust among 
stakeholders. Overall, the system aims to make the business more efficient, customer-focused, and 
cost-effective.
Organization of the Report
This study is organized into five chapters:
5
Chapter 1 will offer fundamental information on the organizational structure and activities. It will 
identify the challenges facing management, discuss motivations, objectives, study methods and 
techniques, scope of the study, and anticipated outcomes.
Chapter 2 will focus on analyzing the current system in detail, identifying its challenges, and 
proposing solutions to address these issues. It will also describe the organizational environment in 
which the new system will be implemented.
Chapter 3 this chapter represents the logical conception of the proposed new system. It will outline 
the conceptual framework of the solutions aimed at addressing the issues identified in the existing 
system.
Chapter 4 will emphasize the technical aspects of the application and the interpretation of results. 
It will explain the system's conception, focusing on how the application was developed and the 
technologies used to build the software.
Chapter 5 will conclude our project by summarizing the key findings and outcomes. It will also 
offer comprehensive recommendations for future development, addressing potential 
improvements and enhancements to ensure the system's continued evolution and effectiveness.
6
7
CHAPTER 2
ANALYSIS OF EXISTING SYSTEM
Introduction
The primary objective of designing a new system is to replace the existing one to significantly 
enhance operational efficiency. By analyzing the current system, we can gain essential insights 
into its functionality and identify critical issues that require attention. This project specifically 
targets the logistics and distribution processes with the goal of optimizing operations and 
improving overall performance.
This chapter describes the existing logistics and distribution system at BSPECIAL, models it to 
identify its problems, and proposes solutions. Additionally, it outlines the functional and non￾functional requirements that will enhance the new Logistics and Distribution Management System 
(LDMS).
Description of Current System Environment
History Background
Bspecial business ltd was established in 2019 in Nyarugenge, Rwanda, emerged as a pivotal player 
in the country's logistics and distribution landscape. Specializing in the procurement and 
distribution of beverages from local and international sources, quickly established itself as a 
cornerstone in Rwanda's supply chain network. Driven by a commitment to excellence and 
strategic positioning, Bspecial business ltd has evolved into a trusted partner for suppliers and 
consumers alike. Leveraging its extensive network and advanced logistics capabilities, the 
company facilitates seamless transportation, storage, and delivery of goods across Rwanda.
As Rwanda's market demands grew, Bspecial Business Ltd expanded its services beyond 
beverages to encompass a wide array of industries. By 2021, the company had already diversified 
its offerings, catering to sectors such as agriculture, healthcare, technology, and consumer goods. 
This strategic expansion ensured growth and operational efficiency in Rwanda's ever-evolving 
market. By continuously adapting to market trends and customer needs, Bspecial Business Ltd has 
reinforced its reputation as a dynamic and innovative leader in the logistics and distribution 
industry. Bspecial Business Ltd remains dedicated to enhancing its services and meeting the 
evolving needs of its clients. With a focus on continuous improvement, the company is committed 
to maintaining high standards in its operations, ensuring that it remains a reliable and trusted 
partner in Rwanda's logistics and distribution sector.
Vision
Our vision is to be the premier great distribution company in Rwanda, recognized for our 
commitment to excellence and innovation. We aim to create a supportive and enjoyable workplace 
that empowers our employees to thrive. By continuously improving our operations and expanding 
our capabilities, we seek to meet the evolving needs of our clients and lead the industry in 
reliability and efficiency.
Mission
We are committed to strengthening our infrastructure and ensuring long-lasting success. We strive 
to provide an enriching work environment where our team can develop, enjoy their work, and grow 
alongside us. Our goal is to deliver exceptional logistics and distribution services, fostering strong 
partnerships and contributing to the economic development of Rwanda
Description of the Current System
The existing system involves manual logistics and distribution processes that begin with the 
reception of goods, verification of quantity and quality, and storage arrangement by warehouse 
employees. The warehouse manager assesses and updates inventory records, notifies suppliers 
about stock levels, and facilitates communication for order fulfillment. However, this system faces 
challenges such as inefficiencies in managing increasing volumes of orders, slow response times 
due to manual processes, inaccuracies in inventory data, increased operational costs, inadequate 
security measures, and service delivery delays. These inefficiencies undermine the company's 
ability to maintain its reputation as a reliable distribution partner in Rwanda's competitive market.
The analysis of the existing system involves a thorough examination of all activities and processes 
within the current logistics and distribution framework. This analysis aims to identify the 
capabilities of the system, its limitations, and the gaps and problems it presents. The goal is to 
8
9
design a solution specifically tailored to meet the unique needs of our customers, improving overall 
service delivery and operational efficiency.
Analysis of the Current System
The following is how the existing system operates: 
Delayed Goods Receipt Process: Upon goods arrival, the warehouse verifies quantity and quality 
manually, potentially causing delays in processing and informing suppliers. 
Manual Inventory Management: Warehouse staff manually arrange goods and update inventory 
records, which can lead to inefficiencies and errors in stock management.
Communication Challenges: Limited communication channels, suppliers, and clients can result 
in delays and misunderstandings, affecting coordination and service delivery
Lack of Automated Delivery Coordination: The absence of automated systems for checking 
delivery schedules can lead to conflicts and difficulties in coordinating multiple product deliveries.
Modeling Current System
Figure 1: The Existing System
Design of Activities of the Existing System: 
1
st step: Upon arrival, the warehouse receives goods from suppliers, verifying the quantity and 
quality of the items.
2
nd step: Warehouse employees meticulously arrange the received goods in designated stock areas, 
ensuring efficient storage and easy access.
3
rd step: The warehouse manager conducts a comprehensive assessment of the total stock on hand, 
ensuring accurate inventory management.
4
th step: The warehouse manager updates inventory records, reflecting the latest stock levels and 
any changes in the system.
5
th step: The warehouse manager notifies the supplier about the updated stock levels, providing 
essential information for inventory management.
6
th step: Upon receiving the notification, the supplier acknowledges the stock updates and prepares 
for further distribution or replenishment.
7
th step: The supplier informs the client about the availability of the goods, facilitating timely 
communication and coordination.
8
th step: The client completes the payment process for the selected goods, ensuring financial 
transactions are settled promptly.
9
th step: The client provides vehicle information for the goods' transportation, including vehicle 
type, registration details, and delivery preferences.
10th step: The supplier confirms that the goods are loaded onto the designated vehicle, ensuring 
accuracy and completeness before dispatch.
11th step: The supplier provides a receipt to the client, confirming the completion of the goods 
loading process and initiating the delivery phase.
12th step: The client receives the receipt from the supplier, verifying the transaction and ensuring 
documentation compliance.
13th step: Finally, the client receives the ordered goods, completing the distribution process and 
satisfying the customer's requirements.
Problem of the existing system
The current logistics and distribution management system at BSPECIAL BUSINESS LTD faces 
several significant challenges that hinder its operational efficiency and effectiveness in Rwanda's 
dynamic market. These challenges primarily revolve around throughput, response time, and 
information management. 
10
As the company strives to maintain its role as a reliable distribution partner for beverages sourced 
locally and internationally, it encounters issues with scalability during peak periods, delays in order 
processing, and inaccuracies in data handling. These shortcomings impact not only operational 
performance but also customer satisfaction and overall profitability. Addressing these issues is 
crucial to enhancing Bspecial businesses’ competitiveness and operational capabilities in the 
competitive Rwandan market.
The problems of logistics and distribution management presented below:
Inability to handle increasing order volumes: The system lacks scalability, struggling with 
increased order volumes and transactions, leading to decreased throughput during peak periods.
Manual order processing and fulfillment: Manual processes slow down order fulfillment, 
causing delays in processing orders and meeting customer demands. Inefficient communication 
with suppliers and a lack of real-time tracking further prolongs response times, impacting customer 
satisfaction and leading to potential lost business opportunities.
Inefficient transportation and inventory management: The system often has inaccuracies in 
inventory counts, outdated order statuses, and missing transportation details. It relies heavily on 
manual data entry, resulting in errors, delays, and inefficiencies.
Difficulty in retrieving specific information: There is a lack of automated reporting processes, 
causing delays and inconsistencies in data retrieval, which hinders timely and accurate decision￾making.
Time-consuming and error-prone manual reporting: Generating reports manually is inefficient 
and often inaccurate, delaying decision-making and management processes. This can lead to 
missed opportunities and poor resource allocation.
Lack of a centralized digital database: Fragmented data storage makes it difficult to access and 
coordinate inventory levels, order statuses, and transportation schedules. This disorganization 
leads to miscommunication, errors, and inefficiencies in managing logistics operations effectively
Storage: Data is stored using physical documents, handwritten records, or spreadsheets, leading 
to inventory management issues like stockouts, overstocking, and inefficient resource allocation.
11
The system incurs high operational costs due to inefficiencies in transportation, inventory 
management, and order fulfillment processes. Redundant activities, suboptimal routing, and 
underutilization of resources inflate costs and reduce profitability.
Proposed Solutions
This is combination of software, other products or equipment, and all services necessary to 
implement the solution to the problem statements.
• Scalability: Implement a scalable logistics management system that can handle increasing 
volumes of orders and transactions, ensuring consistent throughput during peak periods.
• Automation: Introduce automation for order processing and fulfillment to reduce delays 
and improve response times. Integrate real-time tracking and monitoring capabilities to 
enhance communication with suppliers and customers, providing timely updates and 
improving overall satisfaction.
• Automated Reporting: Implement an automated reporting system that generates formal 
and order reports quickly and accurately, facilitating timely decision-making and 
management.
• Centralized Database: Develop a centralized, digital database to store inventory levels, 
order statuses, and transportation schedules. This will enhance visibility and coordination 
within the distribution system.
• Automated Reporting: Implement an automated reporting system that generates formal 
and order reports quickly and accurately, facilitating timely decision-making and 
management.
• Operational Efficiency: Optimize transportation routes using route planning software to 
reduce delivery times and costs. Improve inventory management practices to minimize 
stockouts and overstocking.
• Automated Reporting: Implement an automated reporting system that generates formal 
and order reports quickly and accurately, facilitating timely decision-making and 
management.
• Easy to search: when we looking for specified information, with simple query, a database 
will pull up information needed immediately instead of running thought endless piles of 
12
paperwork. The new system will be able retrieve the information of sales and purchases 
and related support and how that management has been done in order to recall information
System Requirements
Functional Requirements
A software requirement is a statement detailing what the system must accomplish or the 
characteristics it must possess. During system development, requirements are defined based on 
business needs, user tasks, and desired system characteristics. Below, we specify the functional 
requirements (what the software should do) and non-functional requirements (behaviors and 
qualities the system should exhibit).
1. User:
1. REQ 1: Users should create an account in order to login to the system
2. REQ 2: Users should provide user name and password while logging in 
3. REQ 3: Users can browse the products which are available in the system.
4. REQ 4: Users can place order.
5. REQ 5: Users can Track his/her order.
6. REQ 6: Users can provide feedback.
2. Admin:
a) REQ 7: Admin should control and manage all LDMS activities done in the system 
b) REQ 8: Admin should view all registered users 
c) REQ 9: Admin should Manage all products
d) REQ 10: Admin should be able to control all orders
e) REQ 11: Admin should be able to see the report
f) REQ 12: Admin should be able to manage all transports.
3. Stock Manager:
a) REQ 13: Stock Manager should be able to login at any time.
b) REQ 14: Stock Manager should be able to logout at any time.
c) REQ 15: Stock Manager should be able to manage Stock.
d) REQ 16: Stock Manager should be able to Manage all orders.
e) REQ 17: Stock Manager should be able to update order status.
13
4. Driver:
a) REQ 18: The Driver should be able to login and logout at any time.
b) REQ 19: The Driver should be able to Deliver the product to the client.
Non-Functional Requirements:
is a requirement that specifies criteria that can be used to judge the operation of a system, rather 
than specific behaviors it specifies the quality attribute of a software system. They judge the 
software system based on responsiveness, usability, portability and other non-function standard 
are critical to the success of the software system.
➢ Maintainability: 
✓ the system should easily to maintain it, once is needed
➢ Security:
✓ the system must be able to hide the user’s information
✓ only manager of institutions can generate reports
✓ only supervisor can view personal record of the members and also 
✓ after the system will authenticate to check id the belong to the person 
➢ Operational:
✓ the system should be able to run on any OS 
➢ User friendly:
✓ the system should be user friendly; the system must be easy for a user to 
user
➢ Privacy:
✓ the system shall be able to protect the user’s privacy
➢ Availability:
✓ the system shall have high availability
✓ the system shall not have unexpected downtime
✓ the system shall have downtime most 2 hours/months
➢ Performance:
✓ the system must perform user request within 10 sec
✓ the system shouldn’t exceed 20 sec performances in case of downtime
✓ the user request will not exceed 2click in maximum to be completed
14
✓ the system running for 24 hours a day 
➢ Accessibility 
✓ The system should via laptop or other programmed electronic device such 
as computers, phones, and tablets 
✓ The system processes have to be accessible by all the authorized people
➢ Usability
✓ Users should be able to quickly understand how to use the 
product.
✓ The system must be Usable products provide clear feedback 
and guidance when users make errors or encounter difficulties.
15
CHAPTER 3
REQUIREMENTS ANALYSIS AND DESIGN OF THE NEW 
SYSTEM
Introduction
Creating a successful system takes a lot of effort to make sure it meets users' needs well. The main 
goal of a new system is to fix problems users have with the current one by providing solutions that 
work better for them. Understanding what users really need through thorough research is crucial.
It guides how the new system is built to be practical and functional, even though there's no perfect 
way to guarantee everything will be flawless.
To create a good computerized solution, it's important to carefully look at what's not working well 
in the current system. This chapter will explore how we analyze the current system's problems, 
figure out what's not working, and design a new system to fix those issues. We'll also plan out how 
the new system's database will work and start building its important features.
System analysis means thoroughly studying the current system, breaking it into smaller parts to 
understand it well. By documenting its specifications and needs, we gain a full understanding of 
how it works now. This is crucial for designing and creating a better solution.
Unified Modeling Language (UML)
UML, or Unified Modeling Language, serves as a graphical tool for documenting various aspects 
of software development. It encompasses a range of engineering techniques that have proven 
effective in representing complex systems. UML provides visual notations for creating models and 
is designed to be compatible with computer-assisted software engineering (CASE) tools. While 
UML offers a visual syntax for constructing models, it does not dictate specific modeling methods. 
Instead, the components of a UML model suggest certain methodology features, allowing 
flexibility in the modeling process. This versatility enables it to be applied across diverse industries 
and project types. Moreover, UML facilitates clearer communication among development teams 
by providing a standardized language for system representation. I used it to describe the graphs of 
my new system LDMS.
16
17
Design of the new System
Use-Case Diagrams
We will now concentrate on the use case diagram. A use case diagram delineates a system's 
functionality by illustrating the actors, their objectives as use cases, and the relationships between 
them. The key components of a use case model are.
The standard language for designing object-oriented systems is called the Unified Modelling 
Language (UML), and it is used to specify, view, change, construct, and document the artifacts of 
an object-oriented development. A common notation for modeling object-oriented systems is this 
one. Providing a robust and uniform design language for the developer community to utilize in the 
development and creation of computer applications was one of UML's objectives. (Lucichart, 
2024)
UML synthesized the notations of the Brooch method, the Object Modelling Technique (OMT) 
for Rumbaing and Object-Oriented Software Engineering (OOSE) for Jacobson by merging them 
into a single, common and widely usable modelling language. UML aims to be a standard 
modelling language capable of modelling competing and distributed systems. The three 
methodologists were collectively referred to as the Three Amigos. (Wikipedia, 2024)
Actor
When directly interacting with a system, an external entity takes on a designated role defined by 
an actor. This role might represent a user's function or a role fulfilled by another system that 
engages with the given system
actorName
Use case
18
The use case entails detailing the sequence of actions that a system can undertake while interacting 
with external actors. It encompasses tasks that the system should perform in response to an actor's 
request and is visually depicted as follows:
Relationship
In a Use Case Diagram, relationships play a crucial role in depicting the interactions between 
actors and use cases. These relationships provide a comprehensive view of the system’s 
functionality and its various scenarios. Let’s delve into the key types of relationships and explore 
examples to illustrate their usage.
System boundary
The system boundary is a visual representation of the scope or limits of the system you are 
modeling. It defines what is inside the system and what is outside. The boundary helps to establish 
a clear distinction between the elements that are part of the system and those that are external to 
it. The system boundary is typically represented by a rectangular box that surrounds all the use 
cases of the system.
A box is employed to visually delineate the boundary or extent of the modeled system around the 
use case.
System boundary
UseCaseName
Use Case Diagram
Figure 2: Use Case Diagram
Use-case description
Use Case description specifies what a use case accomplishes, and what it requires to be properly 
performed. Each use case looks like this:
⮚ Name: A name of a use case
19
20
⮚ Description: What a system aims to accomplish
⮚ Actor: The participant in the use case
⮚ Pre-condition: The system state is required before the use case may start.
⮚ Post-condition: When the use case is finished, the system states it.
⮚ Normal flow: The use case's real steps
⮚ Alternative flow: Steps that could be taken if a regular flow were to fail.
Register and Login use case Description
Use Case Number: UC-01
Use Case Name: Register and Login
Actor: Client
Description: Allows users to create an account and log into 
the system.
Pre-condition: Users must provide valid information while 
registering.
Post-condition: The system should display a message that an 
account is created or login is successful.
Normal Flow: 1. User accesses the system and selects 
the registration/login option.
2. The system displays the 
registration/login form.
3. User fills in the required information 
and submits the form.
4. The system validates the input fields.
5. For registration, the system saves the 
data in the database and displays a 
21
confirmation message. For login, the 
system checks the credentials and logs 
the user in.
6. System displays a welcome message or 
a login success message.
Alternative Flow: A. If the data inserted in the inputs is not 
valid, the system will show an error 
message.
B. User corrects the errors and submits 
the form again.
C. If there is a failure in saving the data 
or the data already exists in the 
database, the system will display an 
error message.
Table 1: Register and Login Use Case Description
Browse Products Use Case Description
Use Case Number: UC-02
Use Case Name: Browse Products
Actor: Client
Description: Allows users to view available products in the 
system.
Pre-condition: Users must be logged in to view products.
Post-condition: Users can see the list of products with details.
Normal Flow: 1. User logs into the system.
2. User selects the "Browse Products" 
option.
22
3. The system retrieves and displays a list 
of available products.
Alternative Flow: A. If the user is not logged in, the system 
prompts for login.
Table 2: Browse Product Use Case Description
Place an Order Use Case Description
Use Case Number: UC-03
Use Case Name: Place an Order
Actor: Client
Description: Enables users to place an order for selected 
products.
Pre-condition: User must be logged in and have selected 
products.
Post-condition: An order is created and confirmed.
Normal Flow: 1. User selects products to purchase.
2. User choose the quantity
3. User confirms the order.
4. The system creates an order.
5. The system displays an order 
confirmation message.
Alternative Flow: A. If there is a failor, the system 
displays an error message.
B. User checks and correct the error.
Table 3: Place an Order Use Case Description
23
Track Order Use Case Description
Use Case Number: UC-04
Use Case Name: Track Order
Actor: Client
Description: Allows users to track the status of their orders.
Pre-condition: User must have placed an order.
Post-condition: The system displays the order status to the 
user.
Normal Flow: 1. User navigates to the "Track Order" 
section.
2. The system retrieves the user's order 
details.
3. The system displays the current status 
of the orders.
Alternative Flow: A. If no orders are found, the system 
displays a message indicating no 
orders.
Table 4: Track Order Use Case Description
Give Feedback
Use Case Number: UC-05
Use Case Name: Give Feedback
Actor: Client
24
Description: Allows users to provide feedback on their 
experience or products.
Pre-condition: User must have interacted with the system or 
products.
Post-condition: Feedback is recorded in the system.
Normal Flow: 1. User logs into the system.
2. User navigates to the "Give Feedback" 
section.
3. User fills in the feedback form and 
submits it.
4. The system records the feedback and 
displays a confirmation message.
Alternative Flow: A. If the feedback form is incomplete, the 
system prompts the user to fill in the 
required fields.
Table 5: Give Feedback Use Case Description
Update Order Status Use Case Table Description
Use Case Number: UC-06
Use Case Name: Update Order Status
Actor: Stock Manager
Description: Allows the stock manager to update the status 
of orders.
Pre-condition: Orders must be in the system.
25
Post-condition: The system reflects the updated status of 
orders.
Normal Flow: 1. Stock Manager logs into the system.
2. The system displays the list of 
pending orders.
3. Stock Manager selects an order and 
updates its status.
4. The system records the update and 
displays a confirmation message.
Alternative Flow: A. If an order cannot be updated, the 
system displays an error message.
Table 6: Update Order Status Use Case Description
Deliver the Product Use Case Description
Use Case Number: UC-07
Use Case Name: Deliver the Product
Actor: Driver
Description: The driver delivers the ordered product to the 
client.
Pre-condition: An order must be ready for delivery.
Post-condition: The product is delivered to the client, and the 
delivery status is updated.
Normal Flow: 1. Driver logs into the system.
2. Driver selects an assigned delivery.
3. Driver delivers the product to the 
client's address.
26
4. The system updates the delivery status 
to "Delivered."
Alternative Flow: A. If the delivery cannot be completed, the 
system logs the issue and notifies the 
client.
Table 7: Deliver the Product Use Case Description
Manage Stock Use Case Description
Use Case Number: UC-08
Use Case Name: Manage Stock
Actor: Admin, Stock Manager
Description: Allows the stock manager and admin to 
manage inventory levels.
Pre-condition: The user must have stock management 
privileges.
Post-condition: Stock levels are updated in the system.
Normal Flow: 1. User logs into the system.
2. The system displays stock details.
3. User updates stock quantities or adds 
new items.
4. The system records the changes and 
updates the stock database.
Alternative Flow: 1. If the stock update fails, the system 
displays an error message.
Table 8: Admin Use Case Description
27
Manage Users
Use Case Number: UC-09
Use Case Name: Manage Users, Manage Transports
Actor: Admin
Description: Allows the admin to manage user accounts in 
the system and transportation logistics.
Pre-condition: The admin must have user management 
privileges and transportation available.
Post-condition: User accounts are created, updated, or deleted
and transport are updated and scheduled
Normal Flow: Manage Users
1. Admin logs into the system.
2. The system displays a list of users.
3. Admin selects a user account to 
manage.
4. Admin can create, update, or delete 
user accounts.
5. The system saves changes and displays 
a confirmation message.
Manage Transports
1. Admin logs into the system.
2. The system displays transport 
schedules and details.
3. Admin updates transport assignments 
or schedules.
28
4. The system records the changes and 
updates relevant schedules.
Alternative Flow: A. If the admin encounters an error while 
managing users and transports, the 
system displays an error message.
Table 9 Manage Users and Transports Use Case Table Description
Manage Orders Use Case Table Description
Use Case Number: UC-10
Use Case Name: Manage Orders
Actor: Admin, Stock Manager
Description: Allows the stock manager and admin to 
manage orders.
Pre-condition: The user must have stock management 
privileges.
Post-condition: Stock levels are updated in the system.
Normal Flow: 1. User logs into the system.
2. The system displays the list of all 
orders.
3. User can view, update, or cancel 
orders.
29
Alternative Flow: 1. A.If an error occurs during order 
management, the system displays an 
error message.
Table 10: Manage Orders Use Case Table Description
Class Diagram
A class diagram is a type of static structure diagram in the Unified Modeling Language (UML) 
that describes the structure of a system by showing its classes, attributes, methods (or operations), 
and the relationships among objects.
Figure 3: Class Diagram
Sequence Diagram
Sequence diagrams show the interaction between objects in a sequential order. They help visualize 
the flow of messages between objects and are useful for understanding the dynamic behavior of t
Sequence Diagram for User Register and Login
Figure 4: User Login Sequence Diagram
Sequence Diagram for Browse Products
Figure 5: Browse Products Sequence Diagram
30
Sequence Diagram for placing order
Figure 6: Placing an order Sequence Diagram
Sequence Diagram for Feedback
Figure 7: Feedback Sequence Diagram
31
Sequence Diagram for Driver login and deliver product
Figure 8: Driver login and deliver product Sequence Diagram
32
Sequence Diagram for Stock Manager and Admin to update order status
Figure 9: Stock Manager Updating order status Sequence Diagram
This diagram illustrates the process by which a stock manager or an admin updates the status of 
an order within the system. The stock manager or admin is responsible for changing the order 
status at various stages, such as marking an order as accepted, rejected, or sent. These status 
updates are critical for maintaining an accurate record of the order's progress, ensuring that all 
involved parties are informed about the current state of each order. By updating status this help 
client to get the status of his order.
33
Sequence Diagram for Admin
Figure 10 Admin Sequence Diagram
34
Activity Diagram
An activity diagram is a UML behavioral diagram that represents the flow of activities in a system, 
highlighting the sequence and conditions for coordinating tasks. It shows how activities start, 
progress, and end, often involving decisions that determine different paths.
Figure 11: Activity Diagram
Database Schema Diagram
The term "database schema" can refer to a visual representation of a database, a set of rules that 
govern a database, or to the entire set of objects belonging to a particular user. Read on to find out 
more about database schemas and how they are used. A schema diagram is a compelling visual 
representation of a database system's structure and organization. It functions as a blueprint for how 
entities, attributes, and relationships within a database are interconnected. (Sandoval, 2023)
The database schema diagram for the LDMS system shows the structure and relationships of the 
database. It includes tables for users, stocks, transports, surveys, feedbacks and orders highlighting 
how these entities interact.
This schema provides a clear and organized way to manage data efficiently in the LDMS system.
35
36
Figure 12: Database Schema Diagram
Data Dictionary
It describes the meanings and purposes of data elements within the context of a project, and 
provides guidance on interpretation, accepted meanings and representation. A Data Dictionary also 
provides metadata about data elements.
Users Table
Field Name Data Type Field 
Length
Constraints Description
id bigint PK, auto_increment Unique identifier for each user
name varchar 10 Name of the user
37
email varchar 10 UNIQUE Email address of the user
password varchar 10 Password for the user's account
role varchar 10 Role of the user (e.g., admin, user)
createdAt datetime 6 Timestamp when the user was created
updatedAt datetime 6 Timestamp when the user was last 
updated
stocks_id bigint FK Foreign key reference to the stocks table
feedbacks_id bigint FK Foreign key reference to the feedbacks 
table
Table 11: Users Table Data Dictionary
Orders Table
Field Name Data 
Type
Field length Constraints Description
id bigint PK, 
auto_increment
Unique identifier for each order
userId bigint FK Reference to the user placing the order
productId bigint FK Reference to the product being 
ordered
quantity int Quantity of the product ordered
status varchar 10 Current status of the order
38
createdAt datetime 6 Timestamp when the order was 
created
updatedAt datetime 6 Timestamp when the order was last 
updated
orderAcceptedAt datetime 6 Timestamp when the order was 
accepted
orderPackedAt datetime 6 Timestamp when the order was 
packed
orderShippedAt datetime 6 Timestamp when the order was 
shipped
orderDeliveredAt datetime 6 Timestamp when the order was 
delivered
transports_id bigint FK Foreign key reference to the 
transports table
Table 12: Orders Table data dictionary
Stocks Table
Field Name Data Type Field length Constraints Description
id bigint PK, 
auto_increment
Unique identifier for each stock item
name varchar 10 Name of the stock item
price Float Price of the stock item
createdAt datetime 6 Timestamp when the stock item was 
created
39
updatedAt datetime 6 Timestamp when the stock item was 
updated
description varchar 10 Description of the stock item
image longblob Image of the stock item
category varchar 10 Category of the stock item
upc varchar 10 UPC code for the stock item
inStock int Quantity of the stock item in inventory
totalValue float Total value of the stock item
status varchar 10 Status of the stock item
Table 13: Stocks table data dictionary
Transports Table
Field Name Data Type Field 
Length
Constraints Description
id bigint PK, auto_increment Unique identifier for each transport
driverId bigint FK Reference to the driver handling the 
transport
orderId bigint FK Reference to the order being transported
status varchar 10 Status of the transport
createdAt datetime 6 Timestamp when the transport was 
created
40
updatedAt datetime 6 Timestamp when the transport was last 
updated
Table 14: Transports Table data dictionary
Feedbacks Table
Field Name Data Type Field Length Constraints Description
id bigint PK, 
auto_increment
Unique identifier for each feedback
userId bigint FK Reference to the user providing 
feedback
orderId bigint FK Reference to the order the feedback is 
about
message text Feedback message
createdAt datetime 6 Timestamp when the feedback was 
created
updatedAt datetime 6 Timestamp when the feedback was last 
updated
Table 15: Feedbacks Table data dictionary
Surveys Table
Field Name Data Type Field Length Constraints Description
id bigint PK, autot Unique identifier for each survey
userId bigint FK Reference to the user taking the 
survey
41
answers json JSON object storing survey 
answers
createdAt datetime 6 Timestamp when the survey was 
created
updatedAt datetime 6 Timestamp when the survey was 
last updated
Table 16: Surveys Table data dictionary
Architecture Diagram Design
The Logistics and Distribution Management System (LDMS) is designed to manage and 
streamline logistics, inventory, orders, and distribution processes. The system architecture includes 
a User Interface Layer, which consists of web and mobile applications for clients, drivers, stock 
managers, and administrators. This layer allows users to interact with the system, such as browsing 
products, placing orders, tracking deliveries, and managing inventory. The Application Layer 
handles the core business logic, processing user requests and ensuring the proper flow of 
operations. It connects with the Data Layer, which stores and manages data related to users, 
products, orders, and other key information. This architecture ensures efficient and organized 
handling of all logistics and distribution activities within the system.
Figure 13 System Architecture Design
CHAPTER 4
IMPLEMENTATION OF THE NEW SYSTEM
Introduction
This chapter describes the development of the “LDMS”, in this chapter, the analysis in the third 
chapter will be used in developing a new system, the technologies used in implementation will be 
described, some of the developed system interfaces and different tests will be done. Last but not 
least, software and hardware compatibility requirements. 
Tools and Technologies used
In order to create this web and mobile application, I used a variety of tools and technologies, 
including:
Frontend:
✓ React.js: Renowned for its versatility and efficiency, React.js is a JavaScript library 
utilized extensively in LDMS Pro for crafting dynamic and intuitive user interfaces. 
(SANITY, 2024)
✓ Redux: Complementing React.js, Redux serves as a robust state management library 
within LDMS. 
✓ Material-UI (MUI): Drawing inspiration from Google's Material Design guidelines, 
Material-UI (MUI) is a comprehensive UI framework integrated into LDMS. (CORE, 
2024)
✓ Visual Code Studio: Visual Studio Code is a lightweight but powerful code editor 
developed by Microsoft. It is optimized for building and debugging modern web and cloud 
applications. VS Code supports a wide range of programming languages and comes with 
features like syntax highlighting, intelligent code completion, and built-in Git support. (Vs 
Code, 2024)
✓ JavaScript: JavaScript is a versatile, object-oriented programming language commonly 
used for creating dynamic and interactive content on websites. It is an essential technology 
of the World Wide Web, alongside HTML and CSS, and allows developers to implement 
42
complex features such as animations, form validation, and asynchronous content loading. 
(Propel, 2024)
Backend:
✓ Node.js: LDMS harnesses the power of Node.js, a versatile server-side JavaScript runtime, 
to construct scalable and event-driven applications. With its non-blocking I/O model, 
Node.js facilitates rapid and efficient handling of concurrent requests, ensuring optimal 
performance for LDMS’ back-end operations. (Hub, 2023)
✓ Express.js: For simplifying the creation of robust APIs and server-side logic, Express.js 
streamlines the handling of HTTP requests and responses, enhancing the responsiveness 
and reliability of LDMS's backend infrastructure. (Ahirav, 2024)
Presentation of the New System
This section shows the results of implementing this system. These are the user interfaces, web 
pages, and mobile app screens that result from running the code. Some of them are displayed as 
screenshots, but a few are explained in more detail in the following section.
Landing Page
This is the page that comes once user browse the system
Figure 14: Landing Page
43
Login Page
Page where user log into the system it can be admin, stock manager, driver or clients.
Figure 15: Login Page
Browse Product Page
This consist all products in database.
Figure 16: Browse Products page
44
My Orders Page
My orders which show the client his orders.
Figure 17: My Orders Page
Order Tracking Page
This page consists the tracking of order to show the client status of his order.
Figure 18: Order Tracking Page
45
Feedback Page
Figure 19: Feedback Threads Page
Admin Dashboard
Figure 20: Thread Detail Page
Manage Stock for Stock Manager
46
Figure 21: Manage Stock Page
Manage Orders 
Figure 22: Manage Orders Page
The image shows a "Manage Orders" page from a web application for a Stock Manager. It displays 
a list of orders, each with details such as Order ID, Product ID, Quantity, Status, and Assigned 
Driver. The page includes action buttons for accepting, updating, assigning, and deleting orders. 
The interface is simple, with a navigation menu on the left side for managing stock and orders, and 
a logout option at the bottom.
47
Update Order Status
Figure 23 :Update Order status by Stock Manager Page
Stock Manage Dashboard
Figure 24: Stock Manager Dashboard
“Stock Manager Dashboard" The dashboard displays visual data, including bar charts for "Low 
Stock Products" and "Pending Orders." The "Low Stock Products" highlights the quantity of 
products that are low in stock, with pending orders also.
48
Software Testing
The design of software benefits from the use of software tests. They aid in determining whether 
the software genuinely accomplishes the task it was designed to tackle.
When undertaking software testing, it's vital to keep the following things in mind:
✓ Is the application compliant with the standards that guided its design and development?
✓ Is the application functioning as it should?
✓ Is it possible to implement the application in the same way and satisfy the needs of the 
stakeholders?
The following are some software testing:
The Unit Test
Unit testing is a technique for ensuring the correct operation of a particular piece of software or a 
program. It is a method of evaluating the acceptability for use of individual pieces of source code, 
sets of one or more computer program modules, related control data, usage processes, and 
operating procedures. In other words, every little component that can be assembled with the aim 
of verifying that each part is in accordance with its specifications and checking for logical errors 
Unit testing is a powerful tool that allows for the most thorough error detection. At every point 
where code has been created, a unit test has been run on the application.
The Integration test 
is the stage of software testing where many software components are combined and tested together. 
This test is crucial for confirming the correct assembly of the software's numerous components. 
As more tests are run, the hardware and software components are gathered and tested, and 
eventually the full system is tested. The application modules were thoroughly tested one after 
another until they were finished to guarantee that the assembled software components met all of 
the necessary functional and technical requirements.
49
The Validation test
The software is validated in its external context during the final test step. To guarantee that it fully 
satisfies the requirements established in the beginning phase, the product has been tested in its 
final configuration. The validation test is essential to make sure that the setup of the application 
corresponds to the needs stated. For instance, the phone number must be 10 characters, and the 
email address must begin with @ and conclude with yahoo.com or gmail.com. The application 
was thoroughly tested, and it was during this process that we discovered that the operations' 
progress matched the functional requirements.
Hardware and Software compatibility requirements
Client-Side Software Requirements 
• Operating System: Compatible with Windows 10 or later, macOS 10.14 or later, and 
popular Linux distributions.
• Mobile Operating System: Compatible with Android 8.0 or later and iOS 12.0 or later.
• Web Browser: Supports the latest versions of Google Chrome, Mozilla Firefox, Microsoft 
Edge, and Safari (macOS). 
• Mobile Browser: Supports the latest versions of Google Chrome and Safari.
Client-Side Hardware Requirements 
• Processor: Minimum dual-core processor (Intel i3 or AMD equivalent), with a quad-core 
processor (Intel i5 or AMD equivalent) recommended.
• Mobile Processor: Minimum quad-core processor (ARM Cortex-A53 or equivalent), 
with an octa-core processor recommended.
• RAM: At least 4 GB, with 8 GB or more recommended.
• Mobile RAM: At least 2 GB, with 4 GB or more recommended.
• Storage: At least 256 GB HDD or SSD, with 512 GB SSD preferred.
• Mobile Storage: At least 16 GB, with 32 GB or more recommended.
• Display: Minimum resolution of 1280 x 720, with 1920 x 1080 or higher recommended.
• Mobile Display: Minimum resolution of 720 x 1280, with 1080 x 1920 or higher 
recommended.
50
• Network Connection: Stable internet with a minimum download speed of 5 Mbps, with 
10 Mbps or higher recommended.
• Mobile Network Connection: Stable 4G LTE or higher.
• Peripherals: Keyboard, mouse or trackpad, speakers or headphones, webcam, and 
microphone for video conferencing and collaboration.
• Mobile Peripherals: Touchscreen, speakers or headphones, and microphone.
Server-Side Software Requirements
• Backend Framework: Developed with Spring Boot, requiring the Java Development Kit 
(JDK).
• Database: Uses MySQL as the database server.
• Model Training: Performed using Google Collaboratory.
• Frontend Deployment: Hosted on Versel.
• Backend Hosting: Deployed on Hostinger with appropriate configuration.
• Version Control: Git for version control, with repositories hosted on platforms like 
GitHub.
Server-Side Hardware Requirements
• Processor: High-performance, multi-core processor.
• RAM: At least 4 GB.
• Storage: Minimum of 256 GB HDD.
• Network Connection: Reliable high-bandwidth internet connection.
51
CHAPTER 5
CONCLUSION AND RECOMMENDATIONS
Conclusion
LDMS, a logistic management system, was developed with the primary objective of improving
logistics process By analyzing the challenges faced in our business daily work, this project offers 
a comprehensive resource for admins, stock manager, and clients, allowing them to buy products 
for clients and for stock manager to manage orders and products.
The development process utilized various methodologies, including observation, documentation, 
interviews, and UML analysis, to understand current problems and design an effective solution. 
The platform, built using Node JS for the backend, react JS for the frontend and MySQL for the 
database, ensures a secure, user-friendly interface that is accessible both through web application. 
And give good experience to users.
LDMS successfully addresses the need for improved logistics process by integrating advanced 
data analytics, facilitating informed decision-making, and helping the business work and sell their 
products very well. The platform's ability to track user feedback and provides valuable insights, 
helping to continuously refine and improve its offerings.
Future updates will introduce Payment Methods for user to pay for product directly in the system, 
improving the platform's user experience. Business in Logistics and the one operating in selling 
and buying product should adopt LDMS for it to help them manage their products orders and give 
good user experience to their clients.
In summary, LDMS is a vital tool for modernizing logistics, providing a good user experience to 
the business and clients for users or clients to buy products and make orders, and they track their 
orders within the system, pay temporary because that feature is not in the system yet, and put their 
location for the drivers to deliver orders to them. Additionally, LDMS enhances operational 
efficiency by integrating real-time updates and seamless communication between customers, 
drivers, and the business.
52
Recommendations
I strongly recommend that all clients and logistics businesses adopt the Logistics Delivery 
Management System (LDMS). This platform is an invaluable tool for modernizing and 
streamlining logistics operations, providing a seamless and efficient experience for both businesses 
and their clients. LDMS offers comprehensive access to a wide range of products, enabling users 
to easily manage and track their orders, while also empowering stock managers to update order 
statuses in real-time. This real-time updating ensures that clients are always kept informed about 
the latest developments regarding their orders, enhancing transparency and trust.
LDMS is designed to bring a wave of innovation to the logistics sector by harnessing the power of 
technology. This platform makes it easier for everyone involved to benefit from the latest 
advancements in logistics, ensuring that the process of buying products, placing orders, and 
receiving deliveries is as smooth and efficient as possible. The platform's user-friendly interface 
is one of its standout features, making it simple and intuitive for users to navigate through various 
resources. Clients can easily access a wide array of products, place orders for the items they desire, 
track their orders throughout the delivery process, and even provide feedback and reviews to 
further improve the service. 
Looking ahead, future updates for LDMS will include the integration of additional payment 
methods, such as Mobile Money (MoMo) and bank cards. These enhancements will further 
streamline the payment process, allowing clients to complete transactions directly through the 
application. This added convenience will not only make the payment process faster and more 
secure but will also expand the accessibility of the platform to a broader range of users who prefer 
different payment methods.
Finally, I welcome contributions from anyone interested in improving the platform with new 
features and enhancements. Your participation will help continuously refine LDMS to better serve 
our businesses and our country. Whether you are a developer, researcher, or simply someone 
passionate about business, your input can make a significant difference. Together, we can ensure 
that LDMS remains a valuable resource for all and continues to drive innovation and improvement 
in logistics.
53
54
REFERENCES
Ahirav, D. (2024, May). Part 6: Introduction to Express.js – Simplifying Web Server Development 
in Node.js. Retrieved from DEV Community: https://dev.to/dipakahirav/part-6-
introduction-to-expressjs-simplifying-web-server-development-in-nodejs-5ba5
CORE, M. (2024). Material UI - Overview. Retrieved from MUI CORE: https://mui.com/material￾ui/getting-started/
Geeks, G. f. (2023, November 17). Apache Maven. Retrieved from Geeks for Geeks: 
https://www.geeksforgeeks.org/apache-maven/
Hub, A. D. (2023, December 21). Medium. Retrieved from What is Node.js and How it Work?: 
https://medium.com/@asiandigitalhub/what-is-node-js-and-how-it-work-490f5ecba665
Lengow. (2024). The Role of Technology in Inventory Management. Retrieved from Lengow: 
https://www.lengow.com/get-to-know-more/the-role-of-technology-in-inventory￾management/
Lucichart. (2024). What is Unified Modeling Language. Retrieved from Lucidchart: 
https://www.lucidchart.com/pages/what-is-UML-unified-modeling-language
Management, B. (2023, July 19). Business Agility: Adapting to Changing Markets. Retrieved from 
Prime Grouo: https://weareprimegroup.com/insights/business-agility-adapting-to￾changing-markets/
Munro, O. (2024, February 27). Warehouse Inventory Management: Processes & Best Practices. 
Retrieved from UNLEASHED: https://www.unleashedsoftware.com/blog/warehouse￾inventory-management
SANITY. (2024, January 15). React.js overview. Retrieved from SANITY: 
https://www.sanity.io/glossary/react-js
Wikipedia. (2024, June 15). Unified Modeling Language. Retrieved from WIKIPEDIA: 
https://en.wikipedia.org/wiki/Unified_Modeling_Language
APPENDICES
55
Curriculum Vitae
56