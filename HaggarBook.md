Adventist University of Central Africa
E-Commerce and Customer Management Solution
CASE STUDY: La Rosée Mineral Water
A final year project presented in partial fulfillment of the requirements for the 
degree of BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
Major in Software Engineering
By
Djamal Mahamat Nour Idriss Haggar November, 2025
ABSTRACT
A Final Project for the Bachelor's Degree in Information Technology Emphasis in Software
Engineering Adventist University of Central Africa
Title: E-Commerce and Customer Management Solution for La Rosée Mineral Water
Name of the researcher: Djamal Mahamat Nour Idriss Haggar
Name of the Faculty Advisor: Nsengiyumva Juvenal
Date Completed: ……/……/2025
The bottled water industry in Chad faces increasing demand for digital transformation to improve 
customer engagement, streamline sales operations, and strengthen brand visibility. La Rosée 
Mineral Water, a local brand among others in the race of acquiring the name of the leading brand, 
currently operates with an outdated static website that lacks e-commerce functionality, 
multilingual support, and real-time analytics limiting its competitiveness in a digital-first market.
To address these challenges, this project presents an E-Commerce and Customer Management 
Solution for La Rosée Mineral Water: a modern, secure, and user-centric web platform. The system 
integrates e-commerce capabilities, content management, and data analytics to optimize the 
company's digital operations and customer experience. Through a responsive and interactive user 
interface, customers can browse products, make purchases, and track orders, while administrators 
can manage content, monitor sales, and analyze business performance.
The platform's frontend is built using React, Tailwind CSS, and JavaScript, while the backend 
leverages Spring Boot and MySQL for reliable and scalable operations. Security measures 
including SSL encryption, user authentication, and role-based access control ensure safe and 
trustworthy transactions.
This project demonstrates how modern web technologies can transform a traditional business 
website into a fully functional digital commerce platform. By integrating multilingual support, 
analytics, and a CMS, the enhanced system strengthens La Rosée's online presence, improves 
operational efficiency, and expands its market reach both locally and internationally.
i
ii
DECLARATION
I, Djamal Mahamat Nour Idriss Haggar, declare that this "E-Commerce and Customer 
Management Solution for La Rosée Mineral Water" project is the fruit of my effort and has not 
received any previous credit at the Adventist University of Central Africa or any other university 
or institution.
Signature…………………………
Date: ……/……/2025
iii
APPROVAL
I, Nsengiyumva Juvenal, certify that this project report has been done under my supervision and 
submitted with my approval.
Signature…………………………
Date: ……/……/2025
iv
DEDICATION
To the memory of my beloved father,
To my mother for her unwavering support, and to my family for their constant encouragement.
All praise is due to Allah.
TABLE OF CONTENTS
ABSTRACT..................................................................................................................................... i
DECLARATION ............................................................................................................................ ii
APPROVAL ..................................................................................................................................iii
DEDICATION............................................................................................................................... iv
TABLE OF CONTENTS................................................................................................................ v
LIST OF FIGURES ..................................................................................................................... viii
LIST OF TABLES......................................................................................................................... ix
LIST OF ABBREVIATIONS......................................................................................................... x
ACKNOWLEDGEMENTS........................................................................................................... xi
CHAPTER 1 ................................................................................................................................... 1
GENERAL INTRODUCTION....................................................................................................... 1
Introduction ................................................................................................................................. 1
Background of the Study............................................................................................................. 2
Statement of the Problem............................................................................................................ 3
Choice and Motivation in the Study............................................................................................ 5
Objectives of the Study ............................................................................................................... 6
General Objective .................................................................................................................... 6
Specific Objectives.................................................................................................................. 7
Scope of the Study....................................................................................................................... 7
Methodology and Techniques Used in Study ............................................................................. 8
Documentation Review ........................................................................................................... 9
Interview................................................................................................................................ 10
Observation ............................................................................................................................... 13
Expected Results....................................................................................................................... 14
Organization of the Work.......................................................................................................... 16
CHAPTER 2 ................................................................................................................................. 18
ANALYSIS OF THE CURRENT SYSTEM ............................................................................... 18
Introduction ............................................................................................................................... 18
Description of Current System Environment............................................................................ 18
Historical Background........................................................................................................... 18
Mission .................................................................................................................................. 19
Vision..................................................................................................................................... 20
v
Description of the Current System............................................................................................ 20
Analysis of the Current System................................................................................................. 22
Efficiency............................................................................................................................... 23
Complexity and Usability...................................................................................................... 23
Automation ............................................................................................................................ 24
Information & Visibility........................................................................................................ 24
Integration.............................................................................................................................. 25
Record Keeping & Compliance............................................................................................. 25
Cost Impact............................................................................................................................ 26
Modeling of the Current System ........................................................................................... 26
Problems with the existing system............................................................................................ 28
Performance........................................................................................................................... 28
Information ............................................................................................................................ 28
Economics ............................................................................................................................. 29
Control................................................................................................................................... 29
Efficiency............................................................................................................................... 29
Service ................................................................................................................................... 29
Proposed Solutions.................................................................................................................... 29
System Requirements................................................................................................................ 30
Functional Requirements....................................................................................................... 30
Non-Functional Requirements............................................................................................... 31
CHAPTER 3 ................................................................................................................................. 33
REQUIREMENT ANALYSIS AND DESIGN OF THE NEW SYSTEM.................................. 33
Introduction ............................................................................................................................... 33
Unified Modeling Language (UML)......................................................................................... 34
Design of the New System........................................................................................................ 34
Use-Case Diagrams................................................................................................................... 35
Class Diagrams.......................................................................................................................... 48
Sequence Diagrams................................................................................................................... 51
Database Diagram ..................................................................................................................... 56
Data Dictionary ......................................................................................................................... 58
System Architecture Design...................................................................................................... 60
CHAP 4......................................................................................................................................... 63
IMPLEMENTATION AND TESTING OF THE SYSTEM........................................................ 63
vi
vii
Introduction ............................................................................................................................... 63
Development Technologies and Tools...................................................................................... 63
Presentation of the New System ............................................................................................... 66
Security Testing Procedures...................................................................................................... 73
Technical Infrastructure and Operational Requirements .......................................................... 73
Client Access Device Specifications..................................................................................... 74
Server Infrastructure Specifications ...................................................................................... 74
CHAP 5......................................................................................................................................... 76
CONCLUSION AND RECOMMENDATIONS ......................................................................... 76
Conclusion................................................................................................................................. 76
Recommendations..................................................................................................................... 77
REFERENCES.......................................................................................................................... 78
Books..................................................................................................................................... 78
Websites................................................................................................................................. 78
APPENDICES .............................................................................................................................. 79
viii
LIST OF FIGURES
Figure 1 Modeling of the current system...................................................................................... 26
Figure 2 Use Case Diagram.......................................................................................................... 37
Figure 3 Customer Purchase Product Sequence Diagram ............................................................ 53
Figure 4 Administrator Manage Products Sequence Diagram ..................................................... 54
Figure 5 Manager Process Orders Sequence Diagram ................................................................ 54
Figure 6 Customer Track Order Sequence Diagram..................................................................... 55
Figure 7 Manager View Analytics Sequence Diagram................................................................. 55
Figure 8 Customer Submit Review Sequence Diagram ............................................................... 56
Figure 9 Database Diagram .......................................................................................................... 57
Figure 10 Architecture Design...................................................................................................... 61
Figure 11 Landing Page ................................................................................................................ 66
Figure 12 Product Catalog Display............................................................................................... 66
Figure 13 User Authentication Page ............................................................................................. 67
Figure 14 Two-Factor Authentication .......................................................................................... 67
Figure 15 Administrative Dashboard............................................................................................ 68
Figure 16 Order Processing Dashboard ........................................................................................ 68
Figure 17 Product Catalog Administration................................................................................... 69
Figure 18 Product Grid View........................................................................................................ 69
Figure 19 Category Administration .............................................................................................. 70
Figure 20 Delivery Tracking Dashboard ...................................................................................... 70
Figure 21 Customer Database....................................................................................................... 71
Figure 22 Product Catalog ............................................................................................................ 71
Figure 23 Customer Shopping Cart .............................................................................................. 72
Figure 24 Customer Wishlist Management .................................................................................. 72
Figure 25 Account Profile Management....................................................................................... 73
ix
LIST OF TABLES
Table 1 Actors and Description of the E-Commerce and Customer Management Solution........ 37
Table 2 Manage User Accounts.................................................................................................... 39
Table 3 Configure System Settings............................................................................................... 40
Table 4 Manage Product Catalog.................................................................................................. 40
Table 5 Manage Orders................................................................................................................. 41
Table 6 Manage Inventory............................................................................................................ 42
Table 7 View Analytics & Reports............................................................................................... 43
Table 8 Manage Promotions......................................................................................................... 44
Table 9 Browse Products.............................................................................................................. 44
Table 10 Place Order .................................................................................................................... 45
Table 11 Track Order Status......................................................................................................... 46
Table 12 Submit Product Review ................................................................................................. 47
Table 13 Manage Account............................................................................................................ 48
Table 14 Class diagram tools Description .................................................................................... 50
Table 15 Class Diagram................................................................................................................ 51
Table 16 Sequence diagram definition ......................................................................................... 53
Table 17 User Data Dictionary ..................................................................................................... 58
Table 18 Product Data Dictionary ................................................................................................ 58
Table 19 ProductCategory Data Dictionary.................................................................................. 58
Table 20 Order Data Dictionary ................................................................................................... 59
Table 21 OrderItem Data Dictionary ............................................................................................ 59
Table 22 Payment Data Dictionary............................................................................................... 59
Table 23 ShoppingCart Data Dictionary....................................................................................... 59
Table 24 Review Data Dictionary................................................................................................. 60
Table 25 Inventory Data Dictionary ............................................................................................. 60
x
LIST OF ABBREVIATIONS
AUCA: Adventist University Of Central Africa
CSS: Cascading Style Sheet
DB: Database
HTML: Hypertext Markup Language
UML: Unified Modeling Language
XAMPP: Cross-Platform, Apache, Mysql, Php, Perl
ACKNOWLEDGEMENTS
First and foremost, I thank Allah, the Most Gracious and Most Merciful, the Source of all 
knowledge and strength, without whose blessings this work would not have been possible.
The completion of this project would not have been achievable without the support and guidance 
of many individuals to whom I owe my deepest gratitude.
I am profoundly grateful to my supervisor, Mr. Nsengiyumva Juvenal, whose mentorship and 
thoughtful guidance played a vital role in shaping this research. His constructive feedback, 
patience, and academic rigor challenged me to produce work of greater depth and quality than I 
could have achieved alone. His dedication to my academic growth has been invaluable.
I extend my sincere appreciation to the dedicated faculty and academic staff of the Department of 
Software Engineering at Adventist University of Central Africa (AUCA). Your commitment to 
imparting knowledge with clarity and passion, and your willingness to support students beyond 
the classroom, have profoundly impacted my academic and personal development. The AUCA 
community, guided by values of integrity, excellence, and service, has shaped not only my 
technical knowledge but also my character and worldview.
To my late father, whose memory continues to inspire me, I wish you were here to witness this 
achievement. I hope you are proud. To my beloved mother, I am who I am because of you. Thank 
you for your unwavering love, prayers, financial support, and words of encouragement that 
sustained me through every challenge. To my siblings: Baba Naim, Edy Mahamat Nour, Pilote, 
and Madaya, thank you for your constant belief in me.
I am deeply grateful to my friends and brothers who made my journey of studying abroad not only 
bearable but meaningful. Studying abroad encompasses more than academics; it involves 
navigating life in unfamiliar territory, and you made both aspects easier. Special thanks to Hamit, 
Hachim, Steve Korei, Grand Salah, Soumaine, Nassour, Ahmed, Abba Dahap, and Guisimenti, 
your friendship and support have been a source of strength.
May Allah accept this work as a sincere effort and continue to guide me on the path of knowledge 
and truth. Ameen.
Djamal Mahamat Nour Idriss Haggar
xi
CHAPTER 1
GENERAL INTRODUCTION
Introduction
La Rosée Minerals Naturelle is a leading producer of high-quality mineral water in Chad, 
committed to promoting health, hydration, and well-being through safe and naturally sourced 
drinking water. Despite its growing reputation and strong offline presence, the company faces 
significant challenges in maintaining digital visibility, expanding its market reach, and engaging 
effectively with modern consumers. 
Traditional sales and marketing methods limit accessibility, hinder real-time communication, and 
reduce the efficiency of customer service and product delivery. These constraints make it 
increasingly difficult for La Rosée to compete in today's digital marketplace, where user 
experience and online convenience have become critical factors for business growth and 
sustainability. 
To address these challenges, an E-Commerce and Customer Management Solution for La Rosée 
Minerals Naturelle has been developed as a comprehensive, technology-driven platform designed 
to modernize the company's operations and strengthen its digital footprint. 
The solution introduces e-commerce functionality for direct online sales, multilingual support to 
serve diverse audiences, and a content management system (CMS) that enables seamless product 
updates and promotional content management. 
Furthermore, it integrates search engine optimization (SEO) techniques to boost online visibility 
and incorporates real-time analytics dashboards to enable data-informed decision-making. 
Security and trust are core priorities of the platform. By implementing data encryption, secure 
payment gateways, and role-based access control, the system ensures the confidentiality and 
integrity of customer transactions and personal information. Additionally, features such as live 
chat support, contact forms, and email subscription services foster interactive engagement and help 
build long-term customer relationships. Through this digital transformation, La Rosée Minerals 
Naturelle is strategically positioned to enhance its brand presence, improve operational efficiency, 
and increase customer satisfaction. 
1
The platform not only streamlines business processes but also empowers the company to respond 
swiftly to evolving market trends and consumer needs. Ultimately, this initiative reflects La 
Rosée's commitment to innovation, quality, and customer trust, setting a new benchmark for digital 
excellence within the Chadian beverage industry.
Background of the Study
La Rosée Minerals Naturelle was established to meet the growing demand for high-quality, 
naturally sourced mineral water in Chad. Since its inception, the company has built a strong 
reputation for delivering safe and healthy drinking water to consumers across the region. However, 
like many traditional businesses in Chad's beverage industry, La Rosée has historically relied on 
conventional business practices that were effective in earlier decades but have become increasingly 
inadequate in the modern digital era.
Traditionally, the operations of La Rosée Minerals Naturelle depended heavily on manual business 
practices such as in-person sales, paper-based record keeping, phone orders, and face-to-face 
customer communication. For years, these methods facilitated direct and personal interactions with 
customers, allowing the company to build trust and loyalty within local communities. Sales 
representatives visited retail outlets, orders were recorded manually in logbooks, and customer 
feedback was collected through phone calls or in-person conversations. While this approach 
fostered close customer relationships, it was inherently limited in scope and efficiency.
As Chad's economy evolved and consumer behavior shifted toward digital platforms, the 
limitations of these traditional methods became increasingly evident. Processes such as order 
management, product promotion, and customer feedback collection still handled primarily through 
offline channels, began to create operational bottlenecks. Manual documentation proved time￾consuming and error-prone, physical retail transactions restricted market reach, and phone-based 
coordination resulted in delays and miscommunication. The absence of a centralized system meant 
that critical business data was scattered across multiple sources, making it difficult to track sales 
trends, monitor inventory levels, or respond promptly to customer inquiries.
The emergence of e-commerce and digital marketing in Chad's business landscape exposed a 
significant competitive gap. Consumers increasingly expected the convenience of browsing 
products online, placing orders from their mobile devices, and tracking deliveries in real time. 
2
Competing brands that embraced digital transformation began capturing market share, particularly 
among younger, tech-savvy consumers who preferred online shopping to traditional retail 
channels. La Rosée's static website, limited to basic company information without transactional 
capabilities, failed to meet these evolving expectations.
Furthermore, the lack of real-time inventory management and automated sales tracking created 
inefficiencies in coordinating between production, sales, and delivery departments. Sales teams 
often lacked up-to-date information on product availability, leading to unfulfilled orders and 
customer dissatisfaction. Marketing efforts remained confined to traditional media such as radio 
and print advertisements, limiting the company's ability to reach broader audiences both locally 
and internationally. The absence of multilingual support also restricted La Rosée's potential to 
engage with Chad's diverse linguistic communities and expand into regional markets.
The reliance on paper records and phone-based communication not only increased the risk of data 
loss and human error but also hindered the company's capacity to scale operations efficiently. As 
demand for La Rosée's products grew, the manual systems in place proved inadequate for 
managing higher transaction volumes, tracking customer orders, and maintaining consistent 
service quality. These challenges underscored the urgent need for a comprehensive digital solution 
that could modernize business operations, enhance customer engagement, and position La Rosée 
competitively in an increasingly digital marketplace.
Given this context, the development of an E-Commerce and Customer Management Solution for 
La Rosée Minerals Naturelle became imperative. This project was conceived to address the 
historical inefficiencies and operational gaps identified above, leveraging modern web 
technologies to transform La Rosée's business model. The solution aims to bridge the gap between 
traditional practices and contemporary consumer expectations, enabling the company to compete 
effectively in Chad's evolving beverage industry while maintaining its commitment to quality and 
customer trust.
Statement of the Problem
Despite La Rosée Minerals Naturelle's established reputation and product quality, the company's 
current operational systems face critical inefficiencies that significantly limit its effectiveness, 
competitiveness, and growth potential in Chad's evolving beverage market.
The primary challenge is the inefficiency of manual order processing and service delivery. 
3
The absence of an integrated digital system results in prolonged order fulfillment cycles, delayed 
customer responses, and frequent miscommunication between departments. These operational 
delays directly impact customer satisfaction, diminish sales opportunities, and compromise the 
company's ability to respond swiftly to market demands and competitive pressures.
A second major issue is the lack of online accessibility and digital customer engagement. Without 
a functional e-commerce platform, customers cannot browse products, place orders, or interact 
with the company online. This limitation severely restricts La Rosée's market reach, excludes 
digitally-oriented consumers, and weakens the company's competitive position against rivals who 
have established robust online presence. In an increasingly digital marketplace where consumers 
expect 24/7 accessibility and instant transactions, this gap represents a critical vulnerability.
Furthermore, the absence of centralized data management and inter-departmental coordination 
creates significant operational challenges. Sales, production, and delivery departments operate in 
silos with limited information sharing, leading to communication gaps, inaccurate record keeping, 
inventory discrepancies, and duplicated efforts. This fragmentation results in inconsistent service 
quality, inefficient resource allocation, and missed opportunities for process optimization.
Additionally, the current system lacks essential digital capabilities such as real-time inventory 
tracking, automated sales analytics, multilingual content support, and secure online payment 
processing. These deficiencies prevent the company from making data-driven decisions, 
expanding into diverse linguistic markets, and providing customers with the convenience and 
security they expect from modern e-commerce platforms.
As a result, La Rosée Minerals Naturelle struggles to meet the evolving expectations of modern 
consumers and fails to capitalize on digital opportunities for business expansion. The company 
risks losing market share to competitors who leverage technology to deliver superior customer 
experiences, operational efficiency, and market responsiveness.
These challenges underscore the urgent need for a comprehensive, secure, and customer-focused 
e-commerce and customer management solution that can modernize La Rosée's operations, 
enhance efficiency, improve inter-departmental coordination, strengthen customer engagement, 
and position the company competitively in Chad's digital marketplace.
4
Choice and Motivation in the Study
The impetus for undertaking this project emerged from a critical observation of Chad's 
contemporary business landscape: a widening disparity between conventional operational 
methodologies and the increasingly sophisticated digital expectations of modern consumers. 
Numerous Chadian enterprises, particularly well-established entities within the beverage sector, 
maintain substantial dependence on manual processes for managing sales transactions, inventory 
control, and customer relationship management. This persistent reliance on antiquated systems 
engenders significant operational inefficiencies, constrains market penetration capabilities, and 
diminishes competitive viability in an economic environment where digital accessibility has 
evolved from a differentiating factor to a fundamental consumer expectation. Recognizing that 
technological innovation could effectively bridge this chasm and catalyze substantial growth 
trajectories for indigenous businesses, I was compelled to develop a comprehensive solution that
would substantiate the transformative capacity of digital platforms in addressing these multifaceted 
challenges.
This endeavor demonstrates substantial congruence with the pedagogical philosophy of Adventist 
University of Central Africa (AUCA), which aspires to cultivate graduates proficient in leveraging 
their technical acumen to resolve substantive societal challenges. AUCA's Software Engineering 
curriculum emphasizes not merely theoretical comprehension but also the pragmatic application 
of technological solutions to advance socioeconomic progress and sustainable development. 
Through the development of this integrated e-commerce and customer management solution, I am 
manifesting the university's vision of nurturing innovation that serves broader public interests and 
contributes meaningfully to national development objectives. This project constitutes a concrete 
exemplification of how rigorous academic preparation in web application development, relational 
database systems, and software architecture can be strategically channeled toward creating 
functional tools that address authentic business imperatives and contribute substantively to Chad's 
economic advancement.
La Rosée Minerals Naturelle emerged as an exemplary case study precisely because it epitomizes 
the challenges confronting traditional businesses navigating the complexities of digital 
transformation. Notwithstanding its production of premium-quality mineral water and 
considerable brand equity, the organization grappled with inefficient order fulfillment processes, 
5
inadequate digital footprint, and insufficient infrastructure for customer engagement and business 
intelligence. Through systematic engagement with organizational stakeholders and clientele, I 
acquired comprehensive insights into specific operational deficiencies: consumers articulated 
demand for convenient online purchasing capabilities, executive management required enhanced 
visibility into sales metrics and inventory analytics, and sales personnel necessitated improved 
coordination mechanisms with logistics teams. The system's multilingual architecture and secure 
payment processing infrastructure further position La Rosée to compete effectively across both 
domestic and regional markets.
From a scholarly perspective, this project has proven instrumental in augmenting my applied 
understanding of software engineering principles and professional practice. While formal 
coursework established foundational competencies in programming paradigms, development 
frameworks, and systems design methodologies, this practical application necessitated critical 
decision-making regarding technology stack selection, security protocol implementation, user 
experience optimization, and architectural scalability considerations. Navigating authentic 
business requirements and operational constraints has substantially refined my capacity to 
transmute abstract technical concepts into deployable solutions that generate quantifiable 
organizational value. Furthermore, this undertaking has reinforced my conviction that technology, 
when judiciously applied within appropriate contextual frameworks, functions as a potent catalyst 
for economic opportunity creation and enterprise development in emerging market contexts. 
Through this scholarly contribution, I endeavor to participate in a broader movement toward digital 
innovation throughout Chad, encouraging fellow students and practitioners to channel their 
technical competencies toward developing solutions that fortify indigenous enterprises and 
cultivate sustainable socioeconomic development trajectories.
Objectives of the Study
General Objective
To develop and implement an integrated e-commerce and customer management solution that 
modernizes La Rosée Minerals Naturelle's business operations, enhances digital accessibility, 
strengthens customer engagement, and enables data-driven decision-making to support sustainable 
competitive growth in Chad's beverage industry.
6
Specific Objectives
• To deploy comprehensive e-commerce functionality with secure payment processing, 
including shopping cart capabilities, product variations, order tracking, and SSL/PCI-DSS 
compliant payment gateway integration.
• To implement multilingual content support in French, English, and Arabic, combined with 
search engine optimization techniques to enhance online visibility and expand market 
reach.
• To integrate real-time customer engagement tools, including live chat support, contact 
forms, and newsletter subscription services, synchronized with La Rosée's social media 
platforms for cohesive brand communication.
• To develop interactive product showcase pages featuring high-resolution imagery, 
comprehensive descriptions, customer reviews, and advanced filtering and sorting 
functionalities to optimize user navigation and purchasing decisions.
• To enable comprehensive performance analytics and business intelligence capabilities 
through integrated dashboards that track sales trends, customer behavior, website key 
performance indicators, and generate automated management reports.
• To ensure robust platform security, data privacy, and regulatory compliance through 
HTTPS encryption, secure database management, role-based authentication, and 
adherence to international data protection standards.
• To design a scalable, modular system architecture that supports future integration with 
mobile applications, third-party logistics systems, customer relationship management 
platforms, and inventory management solutions.
Scope of the Study
The scope of this project encompasses the systematic design, development, and implementation of 
an integrated E-Commerce and Customer Management Solution for La Rosée Minerals Naturelle, 
aimed at transforming the organization's digital infrastructure and enhancing its competitive 
positioning within Chad's beverage sector. The platform will facilitate seamless interactions 
among customers, administrative personnel, and organizational stakeholders by optimizing online 
commercial operations, fostering enhanced customer engagement, and enabling evidence-based 
strategic decision-making.
7
Key functional domains addressed include:
• Comprehensive e-commerce architecture featuring secure online transaction processing, 
dynamic product catalog administration, shopping cart functionality, streamlined checkout 
workflows, and real-time order tracking mechanisms.
• Multilingual content architecture accommodating French, English, and Arabic linguistic 
frameworks to penetrate diverse market segments and expand regional accessibility.
• Search engine optimization (SEO) integration designed to elevate digital visibility, 
enhance search engine rankings, and drive organic user acquisition.
• Interactive customer engagement infrastructure incorporating live chat support 
systems, inquiry submission forms, newsletter subscription services, and strategic social 
media platform integration.
• Content Management System (CMS) implementation empowering non-technical 
administrative users to efficiently manage product inventories, promotional materials, and 
corporate communications.
• Real-time business intelligence and analytics dashboards monitoring sales performance 
metrics, consumer behavioral patterns, website traffic analytics, and critical business 
performance indicators.
• Enterprise-grade security framework featuring SSL encryption protocols, PCI-DSS 
compliant payment gateway integration, role-based authentication mechanisms, and 
adherence to data protection regulatory standards.
By transitioning from La Rosée's legacy static web presence and manual operational workflows to 
a sophisticated integrated digital ecosystem, this solution enhances organizational efficiency, 
broadens market penetration, elevates customer satisfaction, and establishes a foundation for 
sustained competitive advantage within Chad's progressively digitalized commercial landscape.
Methodology and Techniques Used in Study
The research framework employed for this investigation synthesizes diverse data gathering and 
evaluative methodologies to establish a thorough comprehension of La Rosée Minerals Naturelle's 
business operations, customer interaction deficiencies, and the necessity for technological 
advancement within Chad's commercial beverage landscape. To acquire relevant empirical 
evidence, various investigative instruments and information sources were utilized, encompassing 
8
structured stakeholder consultations, empirical workplace assessments, web-based performance 
metrics analysis, and thorough examination of organizational documentation alongside sector￾specific comparative studies.
These investigative approaches enabled the delineation of existing procedural frameworks, 
identification of pervasive operational constraints adversely affecting consumer experiences, and 
determination of strategic domains necessitating technological enhancement through 
comprehensive digital commerce and clientele administration infrastructure. The integrated 
qualitative-quantitative research paradigm implemented throughout this investigation ensures the 
convergence of experiential narratives with empirical performance data, thereby furnishing a 
multidimensional and equilibrated comprehension of how the envisioned technological solution 
can elevate transactional efficiency, stakeholder interaction quality, and intelligence-driven 
strategic planning at La Rosée Minerals Naturelle.
This investigative architecture finds widespread application within information technology 
development scholarship, as it amalgamates statistical evidence with contextual human insight to 
engineer solutions characterized by both technical sophistication and practical applicability 
(Avison & Fitzgerald, 2006).
Documentation Review
Within this research endeavor, rigorous examination of organizational and scholarly 
documentation served as a critical foundational element for understanding the mechanisms through 
which digital transactional technologies can revolutionize conventional commercial beverage 
operations and augment marketplace competitiveness. An extensive corpus of materials underwent 
analytical scrutiny, encompassing scholarly discourse on electronic commerce architectures, 
software development paradigms, peer-reviewed publications addressing customer engagement 
optimization, sectoral case analyses, and antecedent investigations into technological 
modernization within developing economic contexts. Supplementary intelligence was extracted 
from authoritative academic publications, state-sponsored enterprise development documentation, 
and multinational institutions concentrated on fostering digital capabilities within small-to￾medium enterprise ecosystems.
9
Sophisticated analytical instrumentation, incorporating computational text extraction and 
structured qualitative assessment platforms, was deployed to methodically aggregate, classify, and 
derive meaning from assembled documentation. The examined corpus spanned both electronic and 
physical reference materials elucidating deployment strategies for unified information 
infrastructures within commercial organizations aimed at facilitating procedural optimization, 
stakeholder interaction enhancement, and strategic intelligence generation (McCulloch, 2004).
Through methodological triangulation, integrating documentary analysis with participatory 
consultations and empirical observational datasets, this investigation cultivated a panoramic 
understanding of La Rosée Minerals Naturelle's prevailing approaches to consumer relationship 
stewardship, transaction execution, and operational record maintenance. The analytical outcomes 
revealed fundamental organizational constraints including dependence upon manual record￾keeping protocols, departmental communication fragmentation, deficiency in instantaneous 
analytical infrastructure, and insufficient digital stakeholder engagement mechanisms. These 
discoveries directly shaped the conceptual and technical architecture of the E-Commerce and 
Customer Management Solution, an advanced technological ecosystem engineered to transform 
commercial processes and strengthen competitive positioning throughout Chad's beverage 
marketplace.
Interview
Interviewing represents a qualitative investigative technique utilized for extracting nuanced 
intelligence directly from research subjects via systematically organized yet adaptively 
conversational interrogative frameworks (Holstein & Gubrium, 2001). Within the context of this 
scholarly undertaking, I, Djamal Mahamat Nour Idriss Haggar, enrolled within the Software 
Engineering concentration, Faculty of Science and Technology at the Adventist University of 
Central Africa (AUCA), executed an exhaustive investigative study designated "E-Commerce and 
Customer Management Solution for La Rosée Mineral Water."
Partially-structured consultative sessions were orchestrated across heterogeneous stakeholder 
constituencies encompassing promotional strategy executives, commercial transaction 
representatives, distribution coordination specialists, client assistance personnel, commercial 
partnership affiliates, wholesale distribution entities, and sustained patronage consumers of La 
10
Rosée Minerals Naturelle. The investigative intent centered upon elucidating operational 
procedural sequences, interdepartmental coordination impediments, client service delivery 
obstacles, and technological anticipations regarding an integrated digital transaction ecosystem. 
These dialogues generated authentic experiential intelligence that fundamentally influenced the 
platform's functional specification framework and interaction design architecture.
The fundamental investigative inquiries articulated included:
Q1: How would you characterize the operational effectiveness of La Rosée's existing digital 
transaction and client assistance infrastructure?
Answer: Predominant respondent feedback depicted contemporary operational mechanisms as 
substantially deficient and procedurally encumbering. Commercial transaction and client support 
personnel systematically documented repetitive information registration across incompatible 
technological systems, precipitating considerable temporal inefficiencies. Numerous contributors 
identified extended temporal intervals for transactional verification and assistance query 
resolution, signaling fundamental procedural constraints that diminish service excellence and 
consumer contentment.
Q2: What apprehensions exist concerning information confidentiality and protective 
measures within the technological platform?
Answer: Participant constituencies uniformly articulated preoccupations regarding the 
equilibrium between digital accessibility advantages and information security imperatives. While 
recognizing that web-based account capabilities and technological interactions amplify operational 
convenience, contributors conveyed trepidation regarding prospective security deficiencies. 
Personnel emphasized that notwithstanding existing protective frameworks, any confidentiality 
compromise could categorically erode consumer confidence. The inherent tension between 
furnishing customized service experiences and preserving sensitive clientele information 
materialized as a persistent thematic apprehension.
Q3: What interdepartmental coordination obstacles emerge when synchronizing 
transactions, logistics fulfillment, or consumer inquiries?
11
Answer: Consultation participants routinely designated informational compartmentalization as a 
principal impediment to operational cohesion. Client assistance issue resolutions frequently 
transpired absent corresponding intelligence dissemination to distribution or commercial units, 
generating incongruent stakeholder communications. Physical documentation protocols, dispersed 
electronic correspondence, and technologically disconnected infrastructures predominated, 
eliminating instantaneous transparency regarding transactional progression or complaint 
adjudication status. Workforce members articulated considerable exasperation originating from 
procedural postponements and the nonexistence of harmonized communication architectures.
Q4: What functional capabilities or technological instruments would constitute expectations 
within a contemporary digital transaction ecosystem?
Answer: Essentially universal participant preference gravitated toward a security-reinforced, 
device-adaptive platform accessible through browser and mobile interfaces that optimizes 
transaction initiation and stakeholder interaction sequences. Advocated functionalities 
encompassed mechanized transactional acknowledgment notifications, intelligent data acquisition 
prompts guaranteeing exhaustive information collection, instantaneous progression monitoring 
capabilities, and performance visualization instruments for trend surveillance. Operational 
intuitiveness emerged as fundamental: stakeholder constituencies underscored requirements for 
streamlined navigational pathways, explicit procedural documentation, and extensive polyglot 
accessibility provisions.
Q5: What catalysts would stimulate expanded customer or partnership utilization of La 
Rosée's technological platform?
Answer: Contributor perspectives accentuated confidence establishment and awareness 
cultivation as decisive adoption determinants. Transparent operational documentation, focused 
consumer educational programming, and deliberate promotional initiatives would strengthen user 
assurance regarding digital participation. Multiple contributors underscored that mobile-optimized 
architectural design, unambiguous transactional transparency mechanisms, comprehensive 
information security guarantees, and multilingual interface availability would substantially 
expedite technological adoption trajectories. Strategic collaborative frameworks with retail 
distribution networks, civic stakeholders, and environmental stewardship advocates were 
12
designated as vehicles for amplifying user confidence and enhancing platform legitimacy.
Observation
Systematic observational methodology was implemented to acquire real-time empirical data 
concerning stakeholder interactions with La Rosée Minerals Naturelle's existing digital 
infrastructure and operational procedural frameworks. Qualified research personnel executed 
organizational site assessments and empirical field investigations at commercial retail 
establishments, distribution logistics facilities, and client assistance operational centers. Through 
methodical shadowing of commercial transaction representatives, distribution coordination 
specialists, and customer support operatives, comprehensive documentation was compiled 
regarding authentic workflow sequences, decisional junctures, and communication protocols 
traversing the complete customer engagement lifecycle. Observational activities adhered to 
standardized documentation templates and exhaustive field notation protocols designed to capture 
both physical operational interactions and digital system engagements across all organizational 
touchpoints.
Complementary digital surveillance mechanisms were deployed through analytical examination 
of data streams originating from website performance monitoring systems, electronic transaction 
repositories, and customer communication infrastructures (encompassing electronic 
correspondence, real-time chat interfaces, and social media engagement platforms). This 
surveillance framework enabled quantification of critical performance indicators including 
webpage interaction metrics, transactional processing duration, and stakeholder response latency 
measurements. The convergence of qualitative observational intelligence with quantitative 
performance metrics facilitated identification of operational deficiencies including redundant 
manual procedural sequences, transactional fulfillment postponements, and inconsistent 
stakeholder communication patterns that remained obscured within aggregated statistical datasets.
Specific Observational Components:
• Organizational Site Assessments: Executed on-premises investigative observations at 
commercial partnership locations, distribution logistics infrastructure, and corporate 
administrative facilities. Employed structured evaluative checklists and digital field 
documentation instruments (with explicit participant authorization) to chronicle 
13
stakeholder inquiry management protocols, transactional order processing sequences, and 
delivery coordination mechanisms.
• Operational Shadowing: Accompanied distribution logistics teams, commercial sales 
representatives, and client assistance personnel throughout routine operational cycles to 
document comprehensive end-to-end procedural workflows. Meticulously recorded 
utilization patterns of manual documentation systems, telephonic communication 
protocols, and digital technological instruments including customer relationship 
management platforms and order administration systems.
• Digital Performance Metrics Extraction: Systematically extracted and analytically 
processed data from web-based platforms, electronic commercial storefronts, and 
communication technology infrastructures (incorporating user traffic volumetrics, 
transactional order quantities, stakeholder response temporal measurements) to discern 
engagement behavioral patterns and identify systemic performance constraints.
• Operational Inefficiency Identification: Conducted targeted investigation for procedural 
impediments including postponed order processing cycles, duplicative data registration 
activities, irregular follow-up communication sequences, and interdepartmental 
information transmission deficiencies that adversely impact operational productivity and 
stakeholder satisfaction outcomes.
Through this comprehensive observational framework, the research systematically captured the 
operational reality of La Rosée Minerals Naturelle's current business processes, revealing critical 
gaps between intended procedures and actual practice. These empirical findings provided essential 
contextual intelligence that informed the architectural design requirements and functional 
specifications for the proposed E-Commerce and Customer Management Solution, ensuring the 
platform addresses genuine operational challenges rather than theoretical assumptions.
Expected Results
Predicated upon the aggregated empirical evidence and comprehensive analytical investigation, 
the proposed E-Commerce and Customer Management Solution for La Rosée Minerals Naturelle 
is anticipated to generate substantive and enduring enhancements to the organization's commercial 
operations, market competitiveness, and stakeholder engagement capacity within Chad's beverage 
industry. The platform is architected to modernize conventional business methodologies, amplify 
14
transactional efficiency, and fortify the company's digital market presence.
• Enhanced Operational Efficiency: The digital commerce solution will mechanize 
transactional data acquisition and analytical processing across sales channels, customer 
touchpoints, and distribution networks, facilitating accelerated and precision-enhanced 
decision-making protocols. This automation will diminish organizational dependence upon 
manual documentation workflows and substantially elevate the accuracy of commercial 
intelligence utilized for strategic planning and performance monitoring.
• Real-time Transaction Monitoring and Notifications: Stakeholders including 
customers, administrators, and logistics personnel will receive instantaneous updates 
concerning critical operational factors such as order confirmation status, inventory 
availability levels, delivery progression tracking, and promotional campaign activations. 
Additionally, the platform will generate automated alert mechanisms for scenarios 
including inventory depletion thresholds, delayed shipment notifications, or payment 
processing anomalies, enabling proactive intervention and risk mitigation strategies.
• Optimized Resource Allocation: Through sophisticated data analytics capabilities, the E￾Commerce and Customer Management Solution will empower organizational leadership 
in deploying essential operational resources including marketing budgets, inventory 
capital, and personnel allocation with heightened efficiency. This optimization will 
facilitate reduction of unnecessary expenditure, diminish operational overhead costs, and 
enhance aggregate productivity across diverse commercial departments.
• Strengthened Customer Engagement Tracking: The platform will continuously monitor 
customer interaction patterns, purchasing behavioral trends, and market demand 
fluctuations in real time. This intelligence will enable marketing teams and executive 
leadership to implement informed strategic interventions aimed at enhancing customer 
retention, expanding market penetration, and ensuring consistent brand engagement across 
demographic segments.
• Evidence-Based Strategic Decision Support: By aggregating and synthesizing data from 
heterogeneous commercial sources, the system will furnish precise and centralized 
business intelligence to underpin superior decision-making frameworks. Executive 
leadership, marketing strategists, and operational managers will formulate strategic 
initiatives predicated upon empirical evidence and quantifiable performance trends rather 
15
than intuitive assumptions.
• Brand Sustainability and Market Positioning: The digital platform will promote 
sustainable business growth trajectories by analyzing consumer preference data and 
competitive market dynamics to recommend adaptive commercial strategies that 
strengthen brand equity. The system's analytical insights will guide La Rosée toward 
adoption of customer-centric practices that contribute to enduring market leadership and 
competitive differentiation.
• Architectural Scalability and Technological Integration: Ultimately, the solution is 
engineered with architectural flexibility and expansion capacity as foundational design 
principles. The platform can accommodate progressive integration of supplementary 
technological modules including mobile application interfaces, advanced customer 
relationship management systems, third-party logistics integration protocols, and 
enterprise resource planning connectivity, ensuring the E-Commerce and Customer 
Management Solution maintains operational relevance and technological adaptability 
aligned with evolving digital commerce innovations.
Organization of the Work
Chapter One: This inaugural chapter constitutes a comprehensive introduction to the research 
investigation, furnishing essential contextual intelligence regarding Chad's beverage industry 
landscape, contemporary challenges confronting traditional mineral water commerce and 
stakeholder management, and providing a thorough exposition of the system's strategic objectives 
and operational functionalities.
Chapter Two: This chapter delivers an exhaustive analytical examination of prevailing 
operational frameworks within La Rosée Minerals Naturelle's commercial ecosystem, 
concentrating upon customer interaction protocols, transactional processing sequences, inventory 
administration mechanisms, and digital engagement infrastructure. It systematically identifies the 
organizational strengths and operational deficiencies characterizing existing business practices and 
articulates comprehensive solutions designed to address identified limitations. This chapter 
establishes the analytical foundation for delineating the essential architectural components and 
functional specifications of the proposed digital platform.
16
17
Chapter Three: This chapter is dedicated to the logical conceptualization of the integrated digital 
solution. It presents the theoretical framework undergirding the proposed technological 
interventions, encompassing envisioned procedural workflows and operational sequences 
engineered to resolve challenges identified within the existing operational paradigm. The 
exposition employs diverse Unified Modeling Language (UML) diagrams to illustrate the 
platform's architectural design, functional relationships, and operational logic.
Chapter Four: This chapter encompasses the practical development and deployment dimensions 
of the E-Commerce and Customer Management Solution. It incorporates thorough documentation 
of the platform's functional capabilities, complemented by visual interface representations and 
detailed explanatory narratives. Furthermore, it examines the technological frameworks employed, 
delineates hardware and software infrastructural prerequisites, describes validation and quality 
assurance procedures executed, and provides insights regarding the system's deployment 
methodology and operational initialization.
Chapter Five: The concluding chapter synthesizes the research investigation's principal findings, 
articulates the transformative impact of the implemented digital platform, and formulates 
recommendations for subsequent enhancement initiatives and scholarly inquiry. This chapter 
additionally consolidates bibliographic references and documentary sources utilized throughout 
the investigative process.
This methodologically structured approach ensures coherent intellectual progression from 
challenge identification through solution conceptualization, substantiated by rigorous analytical 
examination, architectural specification, practical implementation, and reflective synthesis, 
thereby fulfilling both scholarly standards and practical applicability for digital commerce 
advancement within Chad's mineral water industry.
CHAPTER 2
ANALYSIS OF THE CURRENT SYSTEM
Introduction
La Rosée Minerals Naturelle operates within Chad's expanding bottled water industry as an 
emerging brand seeking to establish competitive market positioning through digital 
transformation. This chapter presents a comprehensive analysis of the organization's current 
operational infrastructure, examining existing workflows, technological capabilities, and 
stakeholder engagement mechanisms to identify systemic inefficiencies requiring remediation.
The examination reveals that contemporary business processes remain substantially manual and 
fragmented, relying upon spreadsheet documentation, telephonic communication, and 
disconnected digital instruments. These operational constraints generate significant challenges 
including protracted transaction cycles, interdepartmental coordination deficiencies, inadequate 
real-time visibility, and limited analytical capabilities collectively undermining both operational 
efficiency and customer satisfaction.
This analysis systematically evaluates La Rosée's existing system architecture, workflow 
procedures, technological infrastructure, and identified operational limitations. The investigation 
provides empirical foundation for subsequent chapters detailing the conceptual design, technical 
architecture, and implementation strategy of the proposed E-Commerce and Customer 
Management Solution. Through rigorous assessment of current-state deficiencies, this chapter 
establishes the strategic rationale and functional requirements necessary for developing an 
integrated digital platform capable of modernizing La Rosée's commercial operations and 
strengthening its competitive market presence.
Description of Current System Environment
Historical Background
La Rosée Minerals Naturelle represents an evolving enterprise within Chad's bottled water sector, 
committed to delivering premium-quality natural mineral water while cultivating enduring 
customer relationships. Established in response to escalating consumer demand for superior 
18
hydration products, the organization has maintained operational presence for multiple years, 
extending product distribution across diverse geographic territories and engaging clientele through 
hybrid retail and digital commercial channels.
Notwithstanding substantial achievements in brand recognition and market penetration, La Rosée's 
existing infrastructure for administering online transactions, stakeholder interactions, and logistics 
coordination confronts critical operational impediments. The organization demonstrates persistent 
dependence upon semi-manual procedural frameworks including spreadsheet-based record 
management, telephonic order acquisition, and fragmented interdepartmental communication 
protocols. These methodologies systematically generate processing delays, redundant task 
execution, and incomplete transactional visibility, thereby constraining organizational capacity for 
responsive and efficient customer service delivery.
The conspicuous absence of centralized data repositories, synchronous communication 
technologies, and unified digital ecosystems constitutes a fundamental constraint upon operational 
productivity and stakeholder satisfaction. Numerous commercial opportunities remain unrealized 
attributable to limited platform accessibility and systemic fragmentation. Additionally, critical 
sales intelligence and inventory data frequently suffer loss or retrieval complications resulting 
from deficient documentation practices and unstructured workflow architectures. These structural 
limitations fundamentally impede the organization's strategic commitment to delivering 
expeditious service, sustaining exemplary customer experiences, and facilitating sustainable 
enterprise expansion.
Mission
La Rosée Minerals Naturelle's organizational mission centers upon guaranteeing seamless, 
dependable, and engaging stakeholder experiences through provision of a secure, accessible, and 
operationally efficient digital infrastructure for transaction administration, product information 
dissemination, and customer interaction management. Through development of the E-Commerce 
and Customer Management Solution, the enterprise endeavors to modernize operational 
frameworks by enhancing transactional processing efficiency, implementing multilingual and 
intuitively navigable interface architectures, and facilitating collaborative synergy among internal 
operational divisions, distribution networks, and retail partnership entities.
19
Vision
La Rosée Minerals Naturelle envisions a transformative future wherein every customer benefits 
from frictionless, reliable, and enriching brand interactions, liberated from procedural delays, 
operational inefficiencies, and navigational ambiguities in product accessibility and service 
delivery. Through strategic technological adoption and integrated digital platform development, 
La Rosée aspires toward market leadership in redefining stakeholder-brand interaction paradigms, 
transactional processes, and support service excellence. The visionary objective encompasses 
creating scalable and sustainable operational models that transcend immediate challenge 
remediation, establishing innovative benchmarks for efficiency, accessibility, and customer 
satisfaction throughout Chad's bottled water industry landscape.
Description of the Current System
• Usability: La Rosée Minerals Naturelle's contemporary business operations rely heavily 
upon non-digital methodologies encompassing handwritten ledgers, electronic messaging 
applications, and interpersonal verbal exchanges between staff members. The organization 
lacks a cohesive technological platform for aggregating or governing essential commercial 
intelligence including product stock levels, client transaction archives, or shipment 
tracking metrics. These antiquated procedural approaches consume excessive temporal 
resources, demonstrate heightened vulnerability to inaccuracies, and severely restrict 
capacity for systematic oversight and cross-functional knowledge transfer. Sales associates 
and client support specialists routinely confront impediments when attempting to monitor 
transaction lifecycles or preemptively recognize performance constraints, given the 
nonexistence of accessible digital solutions designed to streamline operational 
complexities. As a direct consequence, strategic responsiveness diminishes while efficacy 
suffers deterioration, especially within market territories exhibiting sparse technological 
penetration.
• Control: The organization's standing governance architecture exhibits pronounced 
deficiencies in collaborative synchronization and centralized authority mechanisms. 
Discrete functional divisions—encompassing revenue generation teams, distribution 
management units, and clientele assistance departments—autonomously gather and 
maintain business records, resulting in data multiplication, organizational disorientation, 
20
and informational reliability discrepancies. In the absence of mechanized processes or 
electronic surveillance capabilities, managerial perspective regarding essential functions 
such as transaction sequencing protocols, shipment orchestration, or stock restoration 
remains markedly limited. Supervisory authorities and executive decision-makers cannot 
expeditiously identify procedural irregularities or validate documentation precision within 
contemporaneous timeframes. This undermined governance framework detrimentally 
influences tactical preparation and asset allocation, given that institutional determinations 
regularly stem from fragmentary or chronologically outdated intelligence.
• Information: Knowledge transmission throughout the prevailing commercial structure 
demonstrates marked compartmentalization and maintains primary dependence upon 
tangible record-keeping methods. Intelligence pertaining to revenue activities, clientele 
characteristics, and merchandise circulation configurations exists across isolated 
repositories or personal staff documentation, thereby preventing streamlined aggregation, 
modification, or institutional dissemination. The enterprise possesses no unified 
information warehouse enabling analytical examination or amalgamation with modern 
business technology solutions such as clientele relationship orchestration frameworks or 
forecasting analytical engines. This structural inadequacy compromises operational clarity 
and markedly complicates delivery of precise, punctual commercial intelligence to invested 
parties. Subsequently, corporate commercial strategizing adopts responsive versus 
proactive orientations, hindering progression toward enduring competitive expansion 
goals.
• Security: The present non-automated operational paradigm introduces substantial 
susceptibilities concerning both information safeguarding and transactional authenticity. 
Lacking digital provenance capabilities or protected data custody mechanisms, vital 
business knowledge encompassing revenue achievement metrics, customer exchange 
documentation, and collaborative partnership accords remains exposed to disappearance or 
illicit alteration. The organization employs no cryptographic techniques, hierarchical 
authorization frameworks, or methodical information redundancy protocols to protect 
confidential institutional assets. Additionally, the deficit of electronic oversight 
infrastructure magnifies probabilities of erroneous documentation and considerably 
obstructs authentication of commercial data legitimacy—elements capable of negatively 
21
influencing strategic initiative formulation and stakeholder trust maintenance.
• Storage: Complete commercial and operational intelligence presently exists within 
tangible documentation formats, tabular computation files, or elementary digital archives 
devoid of methodical structuring. This traditional approach demonstrates susceptibility to 
physical degradation, complete information forfeiture, and retrieval limitations. The 
organization maintains no centralized or internet-hosted architecture guaranteeing 
extended-duration data conservation, duplicative safeguard mechanisms, or rapid access 
functionalities when intelligence necessities surface. Resultantly, executing retrospective 
performance evaluations, discerning revenue trajectory configurations, or appraising 
operational productivity across chronological intervals becomes functionally 
impracticable. The absence of organized data preservation infrastructure categorically 
constrains both institutional clarity and procedural effectiveness throughout La Rosée's 
commercial administration and strategic development operations.
Analysis of the Current System
La Rosée Minerals Naturelle presently orchestrates product transaction administration, stakeholder 
engagement protocols, and service fulfillment operations through predominantly manual 
methodologies, encountering substantial operational impediments attributable to communication 
deficiencies, coordination inadequacies, and workflow management constraints.
The enterprise operates across diversified commercial paradigms encompassing direct 
merchandise sales, clientele assistance provisions, and distribution logistics coordination. This 
investigation concentrates upon the transactional processing and customer service administration 
framework, given its pivotal significance in guaranteeing punctual delivery execution and elevated 
stakeholder satisfaction outcomes.
Notwithstanding its organizational centrality, the prevailing operational model suffers from 
protracted processing durations, deficient integration among sales divisions, logistics operations, 
and support service units, alongside complications in monitoring transaction progression or 
customer inquiry status. These systemic inefficiencies routinely precipitate fulfillment 
postponements, diminish service excellence, and constrain organizational responsiveness. 
Restricted technological infrastructure support and persistent dependence upon paper-based or 
technologically disconnected systems substantially intensify these operational challenges.
22
La Rosée's existing transactional and customer administration infrastructure necessitates 
immediate enhancement to ensure operational productivity, expeditious order completion, and 
frictionless stakeholder experiences. Digital transformation through contemporary platform 
implementation will remediate these deficiencies, augmenting interdepartmental collaboration, 
procedural efficiency, and comprehensive service quality delivery.
Efficiency
• Current Situation: Within La Rosée Minerals Naturelle's commercial ecosystem, 
operational activities pertaining to order surveillance, resource deployment, and customer 
data aggregation remain predominantly executed through non-automated approaches. 
Sales personnel, customer service representatives, and logistics coordinators depend upon 
handwritten documentation and verbal information exchange, substantially decelerating 
decision-making velocity and diminishing organizational productivity. This antiquated 
operational paradigm generates postponements in addressing critical business exigencies 
including inventory depletion, delivery complications, and customer satisfaction concerns. 
The nonexistence of digital technological instruments simultaneously elevates probability 
of documentation inaccuracies and constrains aggregate efficiency throughout commercial 
administration frameworks.
• Proposed Solution: The envisioned E-Commerce and Customer Management Solution 
will mechanize data acquisition, analytical processing, and intelligence reporting 
functionalities. Through deployment of integrated digital instruments and instantaneous 
performance visualization dashboards, administrative personnel and sales teams can 
formulate accelerated and precision-enhanced strategic determinations. This technological 
intervention will minimize procedural delays, optimize interdepartmental coordination, 
and substantially elevate aggregate productivity across commercial operational activities.
Complexity and Usability
• Current Situation: Prevailing commercial procedures exhibit excessive operational 
intricacy, incorporating multiple technologically isolated departmental units and manual 
coordination protocols among sales teams, distribution networks, and corporate 
administrative offices. No centralized tracking infrastructure or unified communication 
ecosystem exists, substantially complicating progress monitoring capabilities and 
23
information dissemination efficiency. This procedural complexity frequently discourages 
data utilization within routine decision-making contexts and imposes superfluous 
administrative burdens upon commercial personnel.
• Proposed Solution: The E-Commerce and Customer Management Solution will furnish 
an intuitive and user-accessible digital interface operable via desktop workstations and 
mobile computing devices. The platform will consolidate comprehensive commercial 
intelligence including order status indicators, inventory availability metrics, and customer 
interaction histories within a singular integrated system, thereby facilitating simplified 
management and monitoring capabilities for both internal personnel and external 
stakeholders.
Automation
• Current Situation: Absent automation capabilities, commercial administration remains 
predominantly reactive in operational orientation. Organizational authorities and service 
personnel respond to challenges including order cancellations or delivery failures 
exclusively following occurrence. This reactive methodology precipitates revenue losses, 
inefficient resource deployment, and elevated operational expenditure.
• Proposed Solution: The proposed technological solution will introduce automation 
through predictive analytics engines and intelligent monitoring mechanisms. By analyzing 
behavioral and transactional data patterns, the platform can generate proactive notifications 
regarding potential complications such as inventory shortfalls or delivery disruptions. This 
anticipatory approach will enable personnel to implement preventive interventions, thereby 
reducing financial losses and enhancing aggregate operational productivity.
Information & Visibility
• Current Situation: Intelligence concerning inventory availability, sales performance 
trajectories, and customer preference patterns remains dispersed across disconnected 
sources and frequently demonstrates temporal obsolescence. Decision-makers and 
operational personnel lack instantaneous visibility into commercial performance metrics 
or market demand fluctuations. This constrained access to current and precise data 
culminates in suboptimal strategic planning and resource misallocation.
• Proposed Solution: The E-Commerce and Customer Management Solution will establish 
24
centralized real-time business intelligence infrastructure accessible through intuitive digital 
interfaces. The platform will aggregate critical commercial data including transactional 
volumes, customer engagement metrics, and inventory status indicators within a unified 
analytical ecosystem, thereby empowering both administrative leadership and operational 
staff to execute informed management decisions and monitor organizational performance 
efficiently.
Integration
• Current Situation: The existing operational framework demonstrates substantial 
fragmentation and lacks technological integration with complementary digital platforms 
including payment processing gateways, third-party logistics providers, or customer 
relationship management systems. This technological disconnection precipitates decision￾making delays and diminishes capacity for coordinating strategic responses to commercial 
challenges effectively.
• Proposed Solution: The E-Commerce and Customer Management Solution will integrate 
seamlessly with external technological ecosystems encompassing secure payment 
processing services, logistics tracking platforms, and marketing automation tools. This 
interconnected digital infrastructure will ensure comprehensive commercial intelligence 
synchronization, facilitating accelerated and reliability-enhanced stakeholder decision￾making processes.
Record Keeping & Compliance
• Current Situation: Manual record maintenance protocols throughout commercial 
operations result in recurrent data forfeiture, informational inconsistency, and 
complications during regulatory audits or performance evaluations. Numerous 
transactional records manifest incompleteness, physical misplacement, or perpetual 
absence of updates, substantially impeding capacity for tracking sales volumes or assessing 
organizational progress.
• Proposed Solution: The platform will deliver secure digital record administration 
infrastructure featuring automated redundancy protocols and standardized documentation 
frameworks. This capability will enhance data precision, ensure regulatory compliance 
with commercial standards and data protection legislation, and streamline reporting 
25
26
obligations for both internal stakeholders and external regulatory authorities.
Cost Impact
• Current Situation: Manual operational procedures and delayed response protocols 
generate elevated transactional costs, resource wastage, and diminished revenue 
generation. The deficiency of efficient administrative systems compels the organization to 
allocate excessive expenditure toward customer service interventions and operational 
remediation, thereby reducing overall profitability margins.
• Proposed Solution: Through automation of commercial monitoring functions, 
optimization of resource allocation strategies, and reduction of operational losses, the E￾Commerce and Customer Management Solution will substantially decrease organizational 
expenditure. The system will amplify procedural efficiency, minimize resource waste, and 
elevate return on investment metrics for both the enterprise and its commercial partnership 
network.
Modeling of the Current System
 
Figure 1 Modeling of the current system
The current operational workflow at La Rosée Minerals Naturelle follows a sequential process 
encompassing order acquisition, internal validation, manual documentation, and fulfillment 
coordination. This section delineates the procedural stages characterizing the existing order and 
customer management infrastructure.
Order Initiation: The operational sequence commences when a customer submits a product order 
for La Rosée mineral water. Order placement occurs through multiple communication channels 
including the organization's static website interface, mobile-responsive web portal, telephonic 
inquiries, or electronic mail correspondence. This multi-channel accessibility, while 
accommodating diverse customer preferences, introduces fragmentation in order capture and 
subsequent processing workflows.
Order Review and Validation: Upon order receipt, a designated organizational representative, 
typically a sales associate or customer service specialist; conducts preliminary review of the 
submitted order details. This verification process examines order accuracy, product specification 
completeness, delivery address validity, and quantity confirmation. The absence of automated 
validation mechanisms necessitates manual scrutiny of each transaction, introducing temporal 
delays and potential for human oversight.
Manual Documentation and System Entry: Following initial validation, the responsible team 
member manually transcribes order information into the organization's internal tracking systems, 
which predominantly consist of electronic spreadsheets, handwritten logbooks, or basic digital 
repositories. This manual data entry process serves as the primary mechanism for order tracking 
and fulfillment monitoring. The reliance upon disparate documentation systems without 
centralized integration creates informational silos and increases vulnerability to transcription 
errors. 
Immediate Order Closure (Conditional): Certain orders meeting specific criteria, including 
confirmed inventory availability, standard product configurations, and verified payment status, 
may be designated for immediate processing and closure without requiring additional supervisory 
intervention. These straightforward transactions, typically involving in-stock merchandise 
available for same-day fulfillment, progress directly to the logistics preparation phase, bypassing 
extended verification protocols. 
27
Escalated Review and Supervisory Approval: Orders necessitating supplementary validation 
undergo escalation to supervisory or managerial personnel for comprehensive review. This 
escalation occurs under circumstances including inventory verification requirements, customized 
product requests, payment authentication concerns, bulk order processing, or discrepancies 
identified during initial validation. The escalation mechanism, while ensuring transactional 
integrity, introduces additional processing delays and coordination complexities within the 
operational workflow.
Order Fulfillment and Customer Follow-up: Upon successful validation and approval, 
operational personnel initiate fulfillment procedures encompassing product retrieval, quality 
verification, packaging preparation, and dispatch coordination. Concurrently, customer service 
representatives maintain communication with clientele regarding delivery scheduling, payment 
processing updates, or order modification requests. This post-approval phase relies heavily upon 
manual coordination among warehouse staff, logistics personnel, and customer service agents, 
with limited systematic oversight or progress tracking capabilities.
Problems with the existing system
Performance
Throughput
• The current system handles requests and orders slowly, relying on paper-based or manual 
tracking methods that are difficult to organize, monitor, and manage efficiently.
Response Time
• Customers experience long delays before their orders or inquiries are addressed due to slow 
manual processing and lack of real-time visibility into status updates.
Information
• Input: Customer orders and inquiries are primarily submitted manually through phone 
calls, emails, or in-person requests, which can discourage timely submissions and limit 
order visibility.
• Output: There is no centralized system to track orders or customer interactions, making it 
difficult for staff to follow up efficiently or provide real-time updates. 
28
• Storage: Order and customer records are stored in physical files or scattered spreadsheets, 
increasing the risk of loss, misplacement, or inconsistent data.
Economics
• Manual processes create high operational costs due to inefficiencies, redundant paperwork, 
and unnecessary labor for order processing and tracking.
Control
• Oversight and accountability are limited; orders and customer requests can be mishandled 
without clear tracking or audit trails.
Efficiency
• Reliance on unstructured documentation and manual workflows leads to errors, duplicated 
efforts, and avoidable delays in order processing.
Service
• Accessibility for customers is restricted, as current submission methods do not provide 
convenient, secure, or anonymous options for placing orders, tracking requests, or 
reporting issues.
Proposed Solutions
The proposed solution is a comprehensive e-commerce and customer management platform that 
enables secure, efficient, and scalable online transactions while streamlining business operations 
for all stakeholders. Designed for use by customers, administrators, sales personnel, and business 
partners, the system features an intuitive interface that ensures ease of use and protects sensitive 
data.
Built on a modular, scalable architecture, the platform leverages modern web technologies 
including Spring Boot, PostgreSQL, Thymeleaf, HTML, CSS, and JavaScript within an Agile 
development approach. This allows rapid iteration, continuous enhancement, and adaptation to 
changing market demands and operational challenges.
By centralizing e-commerce operations and customer data management, the solution addresses 
issues of limited digital presence and fragmented communication. It improves the ability of La 
29
Rosée Minerals Naturelle to compete effectively in Chad's digital marketplace, respond quickly to 
customer needs, and make data-driven decisions, strengthening market position and fostering 
sustainable business growth.
System Requirements
System requirements define the essential specifications needed for the E-Commerce and Customer 
Management Solution to operate reliably and efficiently. Proper configuration ensures stability, 
fast response times, and uninterrupted service. These requirements are categorized into Functional 
and Non-Functional needs.
Functional Requirements
User Account Management: Administrators can create, manage, and deactivate user accounts, 
assigning roles to customers, sales representatives, inventory managers, and supervisory staff with 
appropriate access permissions.
E-Commerce Module: Customers can browse product catalogs, view detailed product 
information, add items to shopping carts, apply promotional codes, and complete secure checkout 
processes via web and mobile platforms.
Product Management System: Authorized personnel can add, update, and remove products, 
manage variations, set pricing, configure inventory levels, and schedule promotions through an 
intuitive Content Management System (CMS).
Order Management and Tracking: Staff can view, process, update, and fulfill orders through a 
centralized dashboard. Customers receive real-time status updates and can track deliveries, 
ensuring transparency throughout the fulfillment process.
Multilingual Support: All interfaces and communications (web, mobile, emails) are available in 
French, English, and Arabic, making the system accessible to diverse linguistic communities.
Real-Time Notifications and Alerts: Automated notifications are sent to customers for order 
confirmations, payment receipts, and shipping updates. Administrative alerts notify staff of low 
inventory, pending orders, and critical system events.
30
Customer Engagement Tools: Integrated live chat support, contact forms, newsletter 
subscriptions, customer reviews, and social media connectivity enable seamless customer 
interaction and brand engagement.
Analytics and Reporting Dashboard: Real-time insights into sales performance, customer 
behavior, website traffic, and revenue trends enable data-driven decision-making. Automated 
reports can be generated for management review.
Secure Data Management: Sensitive data, including customer information, payment details, and 
transaction histories, is encrypted and stored in compliance with data protection standards.
Non-Functional Requirements
Performance
• The system must handle concurrent user access without performance degradation during 
peak shopping periods.
• Key operations, such as product searches, checkout processing, and order retrieval, should 
maintain response times under 3 seconds, even under high traffic loads.
Scalability
• The platform should accommodate increasing transaction volumes, expanding product 
catalogs, and growing customer databases without requiring system redesign.
• It must support horizontal scaling through load balancing across distributed servers to 
ensure consistent performance.
Usability
• Interfaces should be intuitive and accessible for both technical and non-technical users, 
including customers with varying digital literacy levels.
• The system must be mobile-friendly, multilingual (French, English, Arabic), with clear 
menus, navigation, and form fields.
Reliability
• High availability and fault tolerance are essential to ensure continuous operation.
• Automated backup and recovery mechanisms must prevent data loss in the event of system 
failure.
31
32
Security
• All sensitive data must be encrypted both during transmission and at rest.
• Robust access controls, SSL/HTTPS protocols, role-based authentication, and defenses 
against cyberattacks or unauthorized access are mandatory.
Compatibility
• The platform should function seamlessly across major operating systems (Windows, 
Android, iOS) and modern web browsers (Chrome, Firefox, Safari, Edge).
Maintainability
• The system architecture should be modular and easy to maintain, allowing updates to 
functionality, security protocols, or features with minimal downtime.
CHAPTER 3
REQUIREMENT ANALYSIS AND DESIGN OF THE NEW 
SYSTEM
Introduction
Conventional commercial methodologies employed within Chad's beverage industry exhibit 
substantial limitations, characterized by manual transaction processing, fragmented customer data 
management, and disconnected operational workflows. These deficiencies compromise market 
competitiveness, customer engagement effectiveness, and strategic business intelligence 
capabilities, underscoring the critical necessity for a modernized digital commerce infrastructure. 
This chapter presents the requirements analysis and system architecture for the E-Commerce and 
Customer Management Solution for La Rosée Minerals Naturelle, a comprehensive digital 
platform engineered to enhance commercial efficiency, customer experience optimization, and 
support the company's strategic vision for sustainable market expansion.
This chapter delineates a systematic methodology for establishing the platform's functional and 
non-functional specifications, grounded in comprehensive evaluation of La Rosée's operational 
imperatives and the inadequacies of existing business processes. The requirements analysis derives 
from exhaustive assessment of commercial workflows, customer engagement challenges, and 
stakeholder expectations, ensuring the solution addresses critical domains including data-driven 
strategic planning, real-time inventory management, and multi-channel customer interaction. The 
system architecture translates these specifications into a robust technical framework, leveraging 
Spring Boot with Java for scalable backend operations, React for dynamic and responsive user 
interface development, and PostgreSQL for reliable data management. Supported by Unified 
Modeling Language (UML) diagrams and architectural specifications, this chapter furnishes a 
structured implementation roadmap for the E-Commerce and Customer Management Solution, 
aligning with La Rosée's commercial objectives and contributing to the broader digital 
transformation of Chad's beverage sector.
33
Unified Modeling Language (UML)
The Unified Modeling Language (UML) constitutes a standardized visual modeling methodology 
that empowers software architects to represent complex systems through a comprehensive suite of 
diagrammatic notations. As articulated by Fowler, UML functions as an essential instrument for 
documenting and conceptualizing software architectures by capturing both structural composition 
and behavioral dynamics. Its principal advantage lies in facilitating clear and effective 
communication of system design among diverse stakeholders participating in the development 
lifecycle (Fowler, 2003).
Fowler emphasizes that UML encompasses an integrated collection of graphical conventions, each 
offering distinct perspectives on system organization. Class diagrams, for instance, articulate the 
static architecture and relationships among system entities, whereas sequence diagrams depict 
temporal interactions between objects during execution. Additional UML diagram categories 
include use case diagrams for specifying functional capabilities, activity diagrams for modeling 
procedural flows, and state machine diagrams for representing object lifecycle transitions.
Within the framework of the E-Commerce and Customer Management Solution for La Rosée 
Minerals Naturelle, UML provides a standardized approach to visualize, specify, construct, and 
document the platform's architectural elements. By utilizing UML's diverse diagramming 
capabilities, development teams can effectively communicate the fundamental components, 
behaviors, and interactions of the e-commerce system, ensuring comprehensive understanding of 
its design principles. This clarity proves essential for aligning the platform with La Rosée's 
business objectives, enhancing customer engagement mechanisms, optimizing commercial 
workflows, and guaranteeing seamless integration across multiple stakeholder interfaces. UML's 
structured framework enables productive collaboration among business managers, technical 
developers, marketing personnel, and customer service teams, ensuring the E-Commerce and 
Customer Management Solution addresses the multifaceted challenges of digital commerce and 
customer relationship management in a coherent and methodical manner (Fowler, 2003).
Design of the New System
System design represents the foundational phase of the development lifecycle, promoting 
stakeholder collaboration to achieve comprehensive understanding of operational requirements. 
34
This process involves defining the architecture, components, modules, interfaces, and data 
structures necessary to satisfy specified requirements. For the E-Commerce and Customer 
Management Solution, the system design provides a detailed blueprint that guides subsequent 
development and deployment phases, ensuring precise alignment with La Rosée's digital 
transformation goals, customer satisfaction imperatives, and sustainable growth objectives.
Use-Case Diagrams
Use case diagrams, classified as UML behavioral diagrams, deliver visual representation of system 
functionality from the perspective of interacting entities. These diagrams incorporate actors, 
representing roles or external systems engaging with the platform, and use cases, which specify 
particular tasks or functions these actors execute. Connecting lines between actors and their 
corresponding use cases illustrate interaction patterns, offering a structured overview of system 
capabilities. This methodology ensures effective communication of functional requirements to 
stakeholders, emphasizing high-level perspective without addressing technical implementation 
specifics.
Within the context of the E-Commerce and Customer Management Solution for La Rosée Minerals 
Naturelle's digital commerce operations, use case diagrams serve a vital role in capturing 
functional requirements of online transaction and customer management processes. They identify 
key actors, including Customers, Administrators, and Managers, and their interactions with 
essential functions such as product browsing, secure checkout, order tracking, content 
management, inventory oversight, analytics review, and system configuration. By highlighting 
these interactions, the diagrams provide clear and accessible representation of how the platform 
supports commercial transactions, enhances customer engagement, and ensures effective business 
operations. Designed for comprehensibility, these diagrams present system behavior in a manner 
accessible to non-technical stakeholders, focusing on user-driven functionality while abstracting 
internal architectural details.
Actor
35
36
An actor designates a specific role assumed by an external entity that interacts directly with the 
system, which may represent a user role or a function executed by another system engaging with 
the platform under consideration.
Use Case
A use case furnishes detailed specification of an action sequence that the system can execute while 
interacting with external actors, delineating specific functionality that an actor requests from the 
platform. This is conventionally depicted as follows, with the associated figure presented above.
Relationship
Essential connections between actors and use cases, represented by a UML association symbol.
System Boundary
A rectangular container drawn around the use case diagram to visually demarcate the boundary or 
scope of the system being analyzed. This boundary explicitly defines which functionalities, actors, 
and interactions are encompassed within the system's domain, distinguishing them from external 
elements or systems that interact with but remain outside the platform itself. By encapsulating the 
use cases within this container, stakeholders can readily comprehend the extent of the system's 
responsibilities and identify interfaces with external actors or systems. This approach maintains 
focus on the system's designated functionality and prevents scope expansion during design and 
development phases.
Use
37
Actors and Description
Actor Description
Administrator Manages user accounts, configures system settings, and maintains the product 
catalog with full administrative privileges.
Manager Manages inventory, processes orders, oversees promotions, and reviews 
analytics and business performance reports.
Customer Browses products, manages shopping cart, places orders, tracks order status, 
submits product reviews, and manages personal account.
Table 1 Actors and Description of the E-Commerce and Customer Management Solution
Use Case Diagram
Figure 2 Use Case Diagram
38
Description of Use Case Diagrams
The Use Case diagrams within the E-Commerce and Customer Management Solution for La Rosée 
Minerals Naturelle delineate comprehensive functional specifications and behavioral 
characteristics of distinct system operations. Each operational scenario is documented through the 
following standardized elements:
• Name: The formal identifier assigned to the operational scenario. 
• Description: A comprehensive explanation detailing the intended system functionality and 
operational objective. 
• Actor: The role or stakeholder category engaging with the specified functionality. 
• Pre-condition: Mandatory system conditions that must exist prior to operational scenario 
initiation. 
• Post-condition: The conclusive system condition following successful operational 
scenario completion. 
• Normal flow: The sequential procedural steps constituting standard operational scenario 
execution within digital commerce workflows. 
• Alternative flow: Supplementary procedural sequences activated when primary 
workflows encounter anomalies, exceptional circumstances, or operational deviations.
Managing Users Table
Use Case Manage User Accounts
Actor Administrator
Description Administrator manages user data including adding, updating, and 
removing user accounts across different roles (Customer, Manager, 
Administrator) in the system.
Pre-condition Administrator must be logged in with proper credentials and 
administrative privileges.
Post-condition User data is updated and stored in the system database.
Main / Normal Flow 1. Administrator logs into the system. 
2. Administrator navigates to user management section. 
3. Administrator selects add/edit/delete user option. 
4. Administrator fills out user information form (username, email, full 
39
name, phone number, role, account status). 
5. Administrator submits the form. 
6. System validates the input data. 
7. User data is stored in the database. 
8. Updated user list is displayed.
Alternative Flow 6.1 A. If validation fails, error message is displayed.
6.1 B. If database storage fails, system displays error message. 
4.1 A. If administrator cancels operation, return to main menu.
Table 2 Manage User Accounts
Configuring System Settings
Use Case Configure System Settings
Actor Administrator
Description Administrator configures system-wide settings including payment 
gateway integration, multilingual support, security protocols, 
notification preferences, and platform operational parameters.
Pre-condition Administrator must be logged in with administrative privileges.
Post-condition System configuration changes are applied and logged.
Main / Normal Flow 1. Administrator logs into the system.
2. Administrator accesses system configuration module.
3. Administrator selects configuration category (payment, security, 
notifications, languages).
4. Administrator modifies configuration parameters.
5. Administrator saves configuration changes.
6. System validates configuration settings.
7. System applies new configuration.
8. System displays configuration update confirmation.
Alternative Flow 6.1.A. If validation fails, system displays error and retains previous 
settings.
6.1.B. If configuration conflicts exist, system displays warning 
message.
40
4.1 A. If administrator cancels, system reverts to previous settings.
Table 3 Configure System Settings
Managing Product Catalog
Use Case Manage Product Catalog
Actor Administrator
Description Administrator manages product inventory including adding new 
products, updating product information, setting prices, managing 
product variations, and configuring promotional offers.
Pre-condition Administrator must be logged in with catalog management privileges.
Post-condition Product catalog is updated and changes are reflected on the e￾commerce platform.
Main / Normal Flow 1. Administrator accesses product catalog management module.
2. Administrator selects add/edit/delete product option.
3. Administrator inputs product information (name, description, price, 
images, stock quantity, category).
4. Administrator uploads product images.
5. Administrator sets product availability and promotional pricing.
6. System validates product data.
7. Product information is stored in database.
8. Updated product catalog is displayed on customer interface.
Alternative Flow 6.1.A. If validation fails, error message is displayed indicating missing 
or invalid fields.
6.1.B. If image upload fails, system allows administrator to retry or 
skip.
3.1.A. If administrator cancels operation, return to catalog 
management dashboard.
Table 4 Manage Product Catalog
Managing Orders
Use Case Manage Orders
Actor Manager
41
Description Manager processes, fulfills, and tracks customer orders including order 
verification, status updates, delivery coordination, and order history 
management.
Pre-condition Manager must be logged in and customer orders must exist in the 
system.
Post-condition Order status is updated and customers are notified of changes.
Main / Normal Flow 1. Manager logs into the system.
2. Manager accesses order management dashboard.
3. Manager views pending orders list.
4. Manager selects specific order for processing.
5. Manager verifies order details and payment status.
6. Manager updates order status (confirmed, preparing, shipped, 
delivered).
7. System sends automated notification to customer.
8. Order status is updated in database and displayed on customer 
interface.
Alternative Flow 5.1 A. If payment verification fails, manager contacts customer and 
places order on hold.
6.1 B. If inventory is insufficient, manager notifies customer and offers 
alternatives.
4.1 A. If manager cancels status update, return to order management 
dashboard.
Table 5 Manage Orders
Managing Inventory
Use Case Manage Inventory
Actor Manager
Description Manager monitors product stock levels, updates inventory quantities, 
sets reorder thresholds, and manages stock alerts to ensure product 
availability.
Pre-condition Manager must be logged in and product catalog must exist.
42
Post-condition Inventory data is updated and low-stock alerts are generated as needed.
Main / Normal Flow 1. Manager accesses inventory management module.
2. Manager views current stock levels for all products.
3. Manager selects product to update inventory.
4. Manager enters new stock quantity and adjusts reorder threshold.
5. Manager saves inventory changes.
6. System validates inventory data.
7. Inventory levels are updated in database.
8. System generates low-stock alerts if thresholds are breached.
Alternative Flow 6.1 A. If validation fails, system displays error message. 
6.1 B. If stock quantity is below threshold, system immediately 
generates alert.
4.1 A. If manager cancels operation, return to inventory dashboard.
Table 6 Manage Inventory
Viewing Analytics and Reports
Use Case View Analytics & Reports
Actor Manager
Description Manager accesses business intelligence dashboards displaying sales 
performance, customer behavior analytics, revenue trends, and 
generates comprehensive business reports.
Pre-condition Manager must be logged in and transaction data must exist in the 
system.
Post-condition Analytics are viewed and reports can be exported for strategic 
decision-making.
Main / Normal Flow 1. Manager logs into the system.
2. Manager navigates to analytics and reports section.
3. Manager selects report type (sales, inventory, customer analytics). 
4. Manager sets report parameters (date range, product category, 
region).
5. System processes analytics request.
43
6. System generates visualizations and statistical summaries.
7. Manager reviews analytics dashboard.
8. Manager exports report for management review.
Alternative Flow 5.1 A. If insufficient data exists for selected parameters, system 
displays warning message.
6.1 B. If report generation fails, system offers alternative date range or 
format.
4.1 A. If manager cancels operation, return to analytics dashboard.
Table 7 View Analytics & Reports
Managing Promotions
Use Case Manage Promotions
Actor Manager
Description Manager creates, configures, and monitors promotional campaigns 
including discount codes, seasonal offers, bundle deals, and marketing 
campaigns.
Pre-condition Manager must be logged in with promotional management privileges.
Post-condition Promotional campaigns are activated and available to customers on the 
e-commerce platform.
Main / Normal Flow 1. Manager accesses promotions management module.
2. Manager selects create/edit/delete promotion option.
3. Manager configures promotion details (discount percentage, 
validity period, applicable products, usage limits).
4. Manager activates promotion campaign.
5. System validates promotion parameters.
6. Promotion is stored in database and applied to eligible products.
7. Promotional offers are displayed on customer interface.
8. System tracks promotion usage and generates performance metrics.
Alternative Flow 5.1 A. If validation fails due to conflicting promotions, system displays 
error message. 
6.1 B. If activation fails, system displays error and allows retry. 
44
3.1 A. If manager cancels operation, return to promotions dashboard.
Table 8 Manage Promotions
Browsing Products
Use Case Browse Products
Actor Customer
Description Customer explores product catalog with search and filtering 
capabilities, views detailed product information, compares products, 
and accesses product recommendations.
Pre-condition Customer must access the e-commerce platform (login optional for 
browsing).
Post-condition Customer has viewed products and may proceed to add items to cart.
Main / Normal Flow 1. Customer accesses the e-commerce website.
2. Customer browses product categories or uses search functionality. 
3. Customer applies filters (price range, product type, availability).
4. System displays filtered product list with images and basic 
information.
5. Customer selects specific product to view details.
6. System displays comprehensive product information, pricing, and 
customer reviews.
7. Customer views related product recommendations.
8. Customer may add product to cart or continue browsing.
Alternative Flow 4.1 A. If no products match search criteria, system suggests alternative 
keywords or categories.
2.1 B. If product images fail to load, system displays placeholder 
images.
5.1 A. If customer navigates away, browsing session is saved for return 
visit.
Table 9 Browse Products
Placing Order
Use Case Place Order
45
Actor Customer
Description Customer adds selected products to shopping cart, proceeds through 
checkout process, provides delivery information, selects payment 
method, and completes order placement.
Pre-condition Customer must be logged in and shopping cart must contain at least 
one product.
Post-condition Order is confirmed, payment is processed, and customer receives order 
confirmation.
Main / Normal Flow 1. Customer adds desired products to shopping cart.
2. Customer reviews cart contents and quantities.
3. Customer proceeds to checkout.
4. Customer provides or confirms delivery address.
5. Customer selects preferred payment method.
6. Customer reviews order summary including total cost.
7. Customer confirms order placement.
8. System processes payment transaction.
9. System generates order confirmation and sends notification.
10. Order is stored in database and assigned unique tracking number.
Alternative Flow 8.1 A. If payment processing fails, system displays error and offers 
retry or alternative payment method.
4.1 B. If delivery address is outside service area, system notifies 
customer and suggests alternatives.
2.1 A. If product becomes unavailable during checkout, system alerts 
customer and updates cart.
7.1 A. If customer cancels before confirmation, cart is saved for future 
session.
Table 10 Place Order
Tracking Order Status
Use Case Track Order Status
Actor Customer
46
Description Customer monitors real-time order progress from confirmation 
through delivery, receives status update notifications, and accesses 
detailed shipment information.
Pre-condition Customer must be logged in and must have placed at least one order.
Post-condition Customer has viewed current order status and delivery information.
Main / Normal Flow 1. Customer logs into account.
2. Customer navigates to order history section. 
3. Customer selects specific order to track.
4. System retrieves order details and current status.
5. System displays order timeline with status updates (confirmed, 
preparing, shipped, delivered).
6. Customer views estimated delivery date and shipment tracking 
information.
7. System displays any delivery instructions or special notes.
Alternative Flow 4.1 A. If order information is unavailable, system displays error and 
suggests contacting support. 
6.1 B. If delivery is delayed, system displays updated estimated 
delivery date and reason.
3.1 A. If customer has no orders, system displays message and 
suggests browsing products.
Table 11 Track Order Status
Submitting Product Review
Use Case Submit Product Review
Actor Customer
Description Customer provides product ratings, writes detailed reviews, uploads 
images, and shares feedback to help other customers make informed 
purchasing decisions.
Pre-condition Customer must be logged in and must have received and confirmed 
delivery of the product.
Post-condition Product review is submitted, stored in database, and displayed on 
47
product page after moderation.
Main / Normal Flow 1. Customer accesses purchased product page.
2. Customer clicks on "Write Review" option.
3. System verifies customer has received the product.
4. Customer assigns star rating (1-5 stars).
5. Customer writes review text and optionally uploads product images. 
6. Customer submits review.
7. System validates review content.
8. Review is stored in database pending moderation.
9. System displays confirmation message and estimated publication 
time.
Alternative Flow 7.1 A. If review contains inappropriate content, system flags for 
moderation or rejects submission.
3.1 B. If product has not been delivered, system restricts review 
submission until delivery confirmation.
6.1 A. If customer cancels submission, draft is saved for later 
completion.
Table 12 Submit Product Review
Managing Account
Use Case Manage Account
Actor Customer
Description Customer manages personal profile information, updates contact 
details, modifies delivery addresses, changes password, and configures 
notification preferences.
Pre-condition Customer must be logged into their account.
Post-condition Account information is updated and changes are saved in the database.
Main / Normal Flow 1. Customer logs into account.
2. Customer navigates to account settings.
3. Customer selects information category to update (personal info, 
addresses, password, preferences).
48
4. Customer modifies desired information fields.
5. Customer saves changes.
6. System validates updated information.
7. Changes are stored in database.
8. System displays confirmation message.
Alternative Flow 6.1 A. If validation fails (e.g., weak password, invalid email), system 
displays specific error message.
6.1 B. If email or phone number is already registered, system alerts 
customer.
5.1 A. If customer cancels changes, system reverts to previous 
information.
Table 13 Manage Account
Class Diagrams
Class diagrams constitute essential structural elements within the Unified Modeling Language 
(UML) framework, a systematized visual representation methodology employed throughout 
software engineering disciplines to delineate system architectural composition. These diagrams 
furnish a static architectural perspective of computational systems, presenting the constituent 
classes comprising the system infrastructure, their characteristic properties, operational 
capabilities, and interconnections with complementary system components.
Fundamentally, class diagrams embody the architectural foundations of object-oriented software 
development paradigms, functioning as comprehensive design specifications for conceptualizing 
and comprehending sophisticated software ecosystems such as the E-Commerce and Customer 
Management Solution for La Rosée Minerals Naturelle. Individual classes within these 
diagrammatic representations encapsulate cohesive collections of defining characteristics and 
functional behaviors, establishing the fundamental properties and operational capabilities of 
instantiated objects within the digital commerce management infrastructure.
Within the operational context of La Rosée's E-Commerce and Customer Management Solution 
serving Chad's beverage industry, class diagrams articulate critical system constituents including 
User, Administrator, Manager, Customer, Product, ProductCategory, Order, OrderItem, 
49
ShoppingCart, Payment, Transaction, Review, Rating, Inventory, Promotion, Notification, 
Address, and Analytics classes. Each class manifestation within the diagram appears as a 
rectangular construct, positioning the class designation at the superior margin, succeeded by 
segregated compartments accommodating attributes (encompassing user identification, product 
designation, inventory quantities, transaction valuations, order status indicators) and methods 
(encompassing user authentication, catalog administration, transaction processing, inventory 
monitoring, analytics generation). Directional connectors between class entities signify 
associations or relational dependencies, demonstrating how classes interact and collaborate 
throughout the digital commerce operational ecosystem.
Collectively, class diagrams function as sophisticated visual instruments for software architects, 
system designers, and development practitioners engaged with La Rosée's E-Commerce and 
Customer Management Solution to conceptualize, communicate, and refine the structural 
composition of the digital commerce infrastructure, cultivating comprehensive understanding of 
system architecture while facilitating productive collaboration among stakeholders participating 
in La Rosée's digital transformation initiative within Chad's commercial marketplace.
Class diagram tools description 
Symbols Description 
Classes represent an abstraction of entities with 
common characteristics. 
Active classes initiate and control the flow of 
activity while passive classes store data and 
serve other classes. 
50
Associations represent static relationships 
between classes. 
Multiplicity notations near the ends of an 
association. These symbols indicate the 
number of instances of one class linked to one 
instance of the other class. 
Decomposition is a restricted form of 
aggregation in which two entities are 
dependent on each other. 
Aggregation is a unidirectional relationship 
between classes. You can call it a has a or is 
part of a relationship. 
Table 14 Class diagram tools Description
Class Diagram
Table 15 Class Diagram
Sequence Diagrams
Sequence diagrams serve as essential visualization instruments within software development, 
illustrating temporal interactions between system components throughout operational execution. 
These diagrams present chronological representations of message exchanges among objects as 
they collaborate to fulfill specific functional requirements within the E-Commerce and Customer 
Management Solution for La Rosée Minerals Naturelle.
51
52
Fundamental elements include objects representing participating entities such as Customer, 
Administrator, Manager, Product, Order, and Payment components; messages depicting 
communication flows between these entities; and activation bars indicating processing duration. 
Within La Rosée's digital commerce platform, sequence diagrams prove particularly valuable for 
visualizing critical workflows including product browsing, order placement, payment processing, 
inventory management, and order tracking operations.
These diagrams facilitate comprehension of system behavior patterns, reveal potential operational 
bottlenecks, and validate architectural design decisions. They function as effective communication 
mechanisms enabling developers, business stakeholders, and system administrators to 
collaboratively understand and refine the platform's interactive processes, ensuring the solution 
effectively addresses La Rosée's commercial requirements and customer engagement objectives.
Term and definition Symbol 
An actor: 
• It can be a person or system that derives benefit from and is 
external to the system. 
• It participates in a sequence by sending and/or receiving 
messages. 
• It is placed across the top of the diagram. 
Actor 
An object lifeline: 
• It participates in a sequence by sending and/or receiving 
messages. 
• It is placed across the top of the diagram. 
53
An activation: 
• It is a long narrow rectangle placed on top of a lifeline. 
• It denotes when an object is sending or receiving messages 
A message: 
• It conveys information from one object to another one. 
• An operation call is labelled with the message being sent and 
a solid arrow, whereas a return is labelled with the value being 
returned and shown as a dashed arrow. 
Table 16 Sequence diagram definition
Customer Purchase Product
Figure 3 Customer Purchase Product Sequence Diagram
❖ Customer browses products, adds items to cart, and completes purchase. The system retrieves 
products from the database, saves cart items, processes payment, and creates an order record.
Administrator Manage Products
Figure 4 Administrator Manage Products Sequence Diagram
❖ Administrator logs in and adds or edits products. The system validates and saves product 
information to the database, then confirms success or displays errors.
Manager Process Orders
Figure 5 Manager Process Orders Sequence Diagram
❖ Manager views pending orders, selects one, and updates its status. The system checks 
inventory, updates the order, and sends automatic notifications to customers.
54
Customer Track Order
Figure 6 Customer Track Order Sequence Diagram
❖ Customer logs in to view order history and selects an order to track. The system retrieves 
current status and displays the delivery timeline.
Manager View Analytics
Figure 7 Manager View Analytics Sequence Diagram
❖ Manager accesses analytics dashboard showing sales and inventory metrics. Can generate 
custom reports by setting parameters, which the system compiles and provides for download.
55
Customer Submit Review
Figure 8 Customer Submit Review Sequence Diagram
❖ Customer submits a product review after purchase verification. The system validates the 
content, saves it to the database pending moderation, and confirms submission to the customer.
Database Diagram
The database diagram for the E-Commerce and Customer Management Solution for La Rosée 
Minerals Naturelle presents a comprehensive visual representation of the system's relational data 
architecture, delineating the structural relationships among database entities and their constituent 
attributes. This diagrammatic representation functions as a fundamental instrument for 
understanding the systematic organization of commercial data within the platform, supporting 
effective database schema design, implementation, and ongoing maintenance activities.
By providing a structured graphical depiction of the data model, the diagram enables software 
developers, database administrators, and business stakeholders to comprehend the intricate 
relationships between customers, products, orders, payments, inventory, and analytics 
components. This visualization facilitates efficient data management practices, ensures referential 
56
57
integrity across related entities, and supports streamlined operational workflows within La Rosée's 
digital commerce ecosystem.
The database schema encompasses critical entities including User accounts with role-based 
distinctions (Administrator, Manager, Customer), Product catalog with category associations, 
Order management with line-item details, Shopping cart functionality, Payment transaction 
records, Inventory tracking mechanisms, Customer reviews and ratings, Promotional campaigns, 
and Analytics data repositories. Each entity contains carefully defined attributes that capture 
essential business information while maintaining normalized data structures to optimize query 
performance and data consistency throughout the E-Commerce and Customer Management 
Solution.
Figure 9 Database Diagram
58
Data Dictionary
User
Name Constraints Data Type
user_id Primary Key, Not Null BIGINT
username Not Null, Unique VARCHAR (50)
email Not Null, Unique VARCHAR (100)
password Not Null VARCHAR (255)
role Not Null ENUM('ADMIN','MANAGER','CUSTOMER')
created_at Not Null TIMESTAMP
Table 17 User Data Dictionary
Product Table
Name Constraints Data Type
product_id Primary Key, Not Null BIGINT
name Not Null VARCHAR (200)
price Not Null DECIMAL (10,2)
stock_quantity Not Null INT
category_id Foreign Key, Not Null BIGINT
is_available Not Null BOOLEAN
Table 18 Product Data Dictionary
ProductCategory Table
Name Constraints Data Type
category_id Primary Key, Not Null BIGINT
category_name Not Null, Unique VARCHAR (100)
description Optional TEXT
Table 19 ProductCategory Data Dictionary
Order Table
Name Constraints Data Type
order_id Primary 
Key, Not 
Null
BIGINT
59
customer_id Foreign Key, 
Not Null
BIGINT
order_date Not Null TIMESTAMP
total_amount Not Null DECIMAL (10,2)
order_status Not Null ENUM('PENDING','CONFIRMED','SHIPPED','DELIVERED')
Table 20 Order Data Dictionary
OrderItem Table
Name Constraints Data Type
order_item_id Primary Key, Not Null BIGINT
order_id Foreign Key, Not Null BIGINT
product_id Foreign Key, Not Null BIGINT
quantity Not Null INT
unit_price Not Null DECIMAL (10,2)
Table 21 OrderItem Data Dictionary
Payment Table
Name Constraints Data Type
payment_id Primary Key, Not Null BIGINT
order_id Foreign Key, Not Null BIGINT
amount Not Null DECIMAL (10,2)
payment_method Not Null VARCHAR (50)
payment_status Not Null ENUM('PENDING','COMPLETED','FAILED')
Table 22 Payment Data Dictionary
ShoppingCart Table
Name Constraints Data Type
cart_id Primary Key, Not Null BIGINT
customer_id Foreign Key, Not Null BIGINT
product_id Foreign Key, Not Null BIGINT
quantity Not Null INT
Table 23 ShoppingCart Data Dictionary
60
Review Table
Name Constraints Data Type
review_id Primary Key, Not Null BIGINT
product_id Foreign Key, Not Null BIGINT
customer_id Foreign Key, Not Null BIGINT
rating Not Null INT
review_text Optional TEXT
review_date Not Null TIMESTAMP
Table 24 Review Data Dictionary
Inventory Table
Name Constraints Data Type
inventory_id Primary Key, Not Null BIGINT
product_id Foreign Key, Not Null BIGINT
current_stock Not Null INT
reorder_threshold Not Null INT
Table 25 Inventory Data Dictionary
System Architecture Design
System architecture constitutes a conceptual framework that delineates the structural organization, 
operational characteristics, and analytical perspectives of technological solutions, functioning as a 
strategic blueprint guiding developmental trajectories and integration protocols. This framework 
ensures harmonious coordination among hardware infrastructure, software applications, and 
human operational resources to fulfill designated system objectives. As articulated by Shellwood 
(2019), architectural documentation formally captures design specifications, facilitating 
comprehensive analysis of constituent components and their interactive dynamics.
Within the operational context of the E-Commerce and Customer Management Solution for La 
Rosée Minerals Naturelle, architectural design governs stakeholder interactions across diverse user 
categories including Customers, Administrators, and Managers engaging with the digital 
commerce platform. The architecture encompasses fundamental technological components 
including the Spring Boot backend framework, PostgreSQL relational database infrastructure, and 
Thymeleaf-driven frontend interface, systematically interconnected to support core functionalities 
such as product catalog management, secure transaction processing, inventory administration, 
real-time order tracking, and comprehensive business analytics. These architectural elements 
collectively establish a unified ecosystem that streamlines commercial operations and enhances 
customer engagement mechanisms, as delineated throughout Chapter 3's technical specifications.
The architectural framework additionally addresses critical operational considerations including 
system scalability, information security protocols, performance optimization, and long-term 
maintainability, ensuring La Rosée's digital platform can accommodate expanding transaction 
volumes, protect sensitive commercial data, and adapt to evolving market requirements. The 
design defines systematic data workflows, encompassing real-time inventory updates, automated 
customer notifications, and promotional campaign management, alongside component interaction 
patterns as illustrated within the sequence and class diagrams. This methodologically structured 
approach supports La Rosée's strategic objectives of strengthening market presence, operational 
efficiency, and adherence to e-commerce security standards, cultivating a robust and adaptive 
infrastructure aligned with digital transformation imperatives and customer satisfaction 
requirements within Chad's beverage industry.
Figure 10 Architecture Design
To interact with the E-Commerce and Customer Management Solution for La Rosée Minerals 
Naturelle, stakeholders establish connectivity through web browser applications accessible via 
mobile devices or desktop computing platforms. Upon platform access, users authenticate through 
credential validation procedures. The browser interface functions as an intermediary conduit 
61
62
between end-users and the application server, which processes authentication requests and 
coordinates with the database infrastructure to retrieve pertinent commercial data, including 
product catalog information, order status records, or inventory availability metrics. The database 
system subsequently extracts requested information and transmits responses to the application 
server, which delivers processed data or appropriate system feedback to authenticated users.
CHAP 4
IMPLEMENTATION AND TESTING OF THE SYSTEM
Introduction
This chapter delineates the practical realization of the E-Commerce and Customer Management 
Solution for La Rosée Minerals Naturelle, documenting the transformation of conceptual 
architectural specifications into a fully operational digital commerce platform. The exposition 
encompasses comprehensive examination of the technological infrastructure, development 
ecosystem configuration, functional capability demonstration, rigorous quality assurance 
methodologies, and deployment specifications essential for productive operational utilization 
within Chad's beverage industry marketplace.
The implementation phase represents the critical juncture where theoretical design principles 
crystallize into tangible technological artifacts capable of delivering measurable business value. 
Through systematic construction of frontend user interfaces, backend service architectures, 
database schemas, and integration frameworks, the E-Commerce and Customer Management 
Solution materializes La Rosée's digital transformation objectives. This chapter provides detailed 
documentation of technology selection rationale, development tool utilization, implementation 
strategies, validation procedures, and deployment protocols that collectively ensure the platform's 
technical robustness, operational reliability, and strategic alignment with La Rosée's commercial 
imperatives and customer satisfaction goals.
Development Technologies and Tools
Constructing the E-Commerce and Customer Management Solution for La Rosée Minerals 
Naturelle necessitated meticulous assessment and strategic selection of technological components 
capable of supporting secure online transactions, real-time inventory management, multilingual 
content delivery, and comprehensive business analytics. The assembled technology ecosystem 
achieves equilibrium between immediate performance requirements and long-term sustainability 
considerations, incorporating established frameworks recognized for reliability, scalability, and 
maintainability within enterprise digital commerce environments.
63
Front-End Technologies
• React Library: Constitutes the foundational JavaScript library orchestrating the 
construction of sophisticated, component-based user interfaces throughout the E￾Commerce and Customer Management Solution. This declarative framework, developed 
and maintained by Meta (formerly Facebook), enables creation of reusable interface 
components that encapsulate both presentation logic and interactive behaviors. React's 
virtual DOM implementation optimizes rendering performance by minimizing direct 
browser DOM manipulations, ensuring fluid user experiences even when managing 
complex state transitions across product catalogs, shopping cart operations, and checkout 
workflows.
• JavaScript (ES6+ with JSX): Serves as the primary programming language implementing 
all interactive functionality and business logic within client-side application components. 
Modern ECMAScript specifications provide advanced language features including arrow 
functions, destructuring assignments, template literals, async/await patterns, and module 
systems that enhance code expressiveness and maintainability. JSX (JavaScript XML) 
syntax extension enables intuitive component composition by allowing HTML-like 
markup directly within JavaScript code, substantially improving developer productivity 
and code readability. 
• Tailwind CSS Framework: Implements comprehensive styling infrastructure through 
utility-first CSS methodology that promotes rapid interface development and consistent 
design implementation. Rather than traditional CSS approaches requiring custom class 
creation for each styling requirement, Tailwind provides an extensive collection of atomic 
utility classes directly applicable within component markup. This paradigm enables precise 
visual control while maintaining design system consistency across the entire platform. The 
framework's responsive design utilities facilitate seamless interface adaptation across 
diverse viewport dimensions, ensuring optimal user experiences whether customers access 
La Rosée's platform via mobile smartphones, tablets, or desktop workstations. 
• React Router: Provides client-side navigation infrastructure enabling seamless transitions 
between application views without traditional page reloads. This routing library manages 
URL-based navigation patterns, implements nested route configurations, handles route 
64
parameters for dynamic content display, and supports programmatic navigation logic 
essential for e-commerce workflows. React Router facilitates intuitive browsing 
experiences as customers navigate between product categories, individual product details, 
shopping cart reviews, checkout processes, order confirmations, and account management 
interfaces.
Back-End Technologies
• Spring Boot Framework: Constitutes the architectural foundation of the server-side 
application logic, providing comprehensive infrastructure for constructing enterprise-grade 
RESTful web services. This Java-based framework embodies convention-over￾configuration principles that accelerate development velocity while maintaining 
production-ready reliability, security provisions, and scalability characteristics. Spring 
Boot's extensive ecosystem encompasses dependency injection containers, transaction 
management, security frameworks, data access abstractions, and monitoring capabilities 
essential for commercial digital platforms.
• Java Programming Language: Provides the foundational programming environment for 
implementing backend business logic, data processing algorithms, and service layer 
operations. Java's strong typing system, object-oriented design principles, robust exception 
handling mechanisms, and mature ecosystem of libraries ensure code reliability and 
maintainability.
• MySQL Database System: Selected as the relational data management infrastructure 
based on comprehensive evaluation of performance characteristics, widespread industry 
adoption, proven reliability, and robust community ecosystem. This open-source database 
management system stores all critical commercial intelligence encompassing customer 
account profiles, product catalog specifications, order transaction records, inventory 
tracking data, payment processing information, promotional campaign configurations, and 
business analytics metrics. MySQL's optimized query execution engine, efficient indexing 
mechanisms, ACID compliance guarantees, and transaction management capabilities 
ensure data integrity and consistency throughout La Rosée's digital commerce operations.
65
Presentation of the New System
Home Page Interface
Figure 11 Landing Page
The home page displays La Rosée's brand identity with a hero section featuring the company name, 
alpine origin tagline, and product description against a blue gradient background. 
Products Page Interface
Figure 12 Product Catalog Display
The products page presents La Rosée's mineral water range through a clean card-based layout 
featuring three product variations: Classic 500ml (Best Seller), Family 1L (New), and Premium 
Glass (Eco Choice). Each card displays product imagery with promotional badges to highlight 
distinctive features.
66
Login Page Interface
Figure 13 User Authentication Page
The login interface features a split-screen design with brand imagery on the left and authentication 
form on the right. Users enter email and password credentials, with options for password recovery, 
account creation, or returning to the home page. The form includes a password visibility toggle for 
enhanced usability.
OTP Verification Page Interface
Figure 14 Two-Factor Authentication
The OTP verification page implements secure two-factor authentication, requiring users to enter a 
6-digit code sent to their registered email address. The interface includes six input fields for code 
entry, a verify button, and an option to resend the code if not received.
67
Admin Dashboard Interface
Figure 15 Administrative Dashboard
The admin dashboard shows key metrics (Revenue, Orders, Customers, Average Order Value) 
with growth indicators. The sidebar enables navigation to Orders, Products, Categories, Shopping 
Carts, Deliveries, and Customers sections.
Orders Management Interface
Figure 16 Order Processing Dashboard
The orders page shows summary statistics and a table of all orders with customer information, 
amounts, and statuses. Administrators can search, filter, and manage orders through view, edit, 
confirm, or delete actions.
68
Products Management Interface
Figure 17 Product Catalog Administration
The products page shows inventory statistics and a grid of product cards with images and status 
badges (Low Stock, Featured). Administrators can search, filter, and add new products.
Products Management Interface
Figure 18 Product Grid View
The products grid shows product cards with images, prices (FCFA), stock levels, and action 
buttons for view, edit, inventory, and delete operations.
69
Categories Management Interface
Figure 19 Category Administration
The categories page shows metrics and a table of product categories with details like ID, name, 
slug, parent, status, and creation date. Administrators can add, search, filter, and manage 
categories.
Deliveries Management Interface
Figure 20 Delivery Tracking Dashboard
The deliveries page shows delivery status metrics and a table with tracking numbers, order IDs, 
recipients, statuses, locations, and estimated delivery times. Administrators can add, search, filter, 
and manage deliveries.
70
Customers Management Interface
Figure 21 Customer Database
The customers table lists users with their contact information, roles (Manager, Customer, Admin), 
status, and registration dates. Action buttons enable view, edit, permissions, password reset, and 
delete operations.
Browse Products Interface (Customer View)
Figure 22 Product Catalog
The product browsing page shows a price filter slider and product cards with images, prices, stock 
availability, and "Add to Cart" buttons. Customers can also add items to their wishlist.
71
Shopping Cart Interface
Figure 23 Customer Shopping Cart
The shopping cart displays selected products with images, quantities, and prices. The order 
summary on the right shows customer information, subtotal, shipping costs, tax, and total amount. 
Customers can adjust quantities, remove items, or proceed to checkout.
Customer Wishlist Interface
Figure 24 Customer Wishlist Management
The wishlist page displays saved products with images, prices, and descriptions. Customers can 
remove items or browse recommended products based on their wishlist preferences.
72
Customer Profile Interface
Figure 25 Account Profile Management
The profile page displays user account information including name, email, phone number, and 
address. Customers can view their account status, membership date, account type, and edit their 
personal information through the Edit button.
Security Testing Procedures
The security assessment framework evaluated authentication systems, permission management, 
information protection mechanisms, and defensive capabilities against potential threats. 
Comprehensive security audits were conducted to detect vulnerabilities that unauthorized parties 
might exploit. Role-based access verification ensured users could only interact with functionalities 
and information corresponding to their designated permissions. Password integrity, session 
administration, and encrypted data transmission protocols were thoroughly validated to safeguard 
sensitive commercial information. The security evaluation additionally assessed the platform's 
resilience against prevalent threat vectors including database injection attacks, malicious script 
insertion, and unauthorized application programming interface exploitation.
Technical Infrastructure and Operational Requirements
The successful deployment and sustained operation of the E-Commerce and Customer 
Management Solution for La Rosée Minerals Naturelle requires appropriate infrastructure 
73
conforming to both technical specifications and operational imperatives. This section delineates 
the hardware configurations, software prerequisites, and network connectivity requirements for 
client access devices and server infrastructure.
Client Access Device Specifications
End-user access devices must satisfy minimum technical specifications to ensure optimal 
performance and satisfactory user experience.
• Web Browser Compatibility: The platform supports modern web browsers including 
Google Chrome version 90 or subsequent releases, Mozilla Firefox version 88 or later, 
Microsoft Edge version 90 or higher, and Safari version 14 or more recent iterations.
• Operating System Requirements: Desktop compatibility encompasses Windows 10 or 
subsequent versions, macOS 10.15 or later releases, and Ubuntu 20.04 Long-Term Support 
or newer distributions. Mobile device compatibility includes Android operating system 
version 9.0 or higher and iOS version 13.0 or subsequent releases.
• Hardware Configuration: Client devices require a minimum of 4 gigabytes of random￾access memory and dual-core processor architecture for seamless operational performance. 
A reliable internet connection providing at least 2 megabits per second bandwidth is 
essential for real-time functionality and data synchronization operations.
• Display Specifications: Desktop browser interfaces require minimum screen resolution of 
1024x768 pixels for optimal content presentation. The adaptive interface design 
automatically adjusts to mobile display dimensions, ensuring consistent usability across 
diverse device configurations.
Server Infrastructure Specifications
The production server environment must furnish adequate computational resources to 
accommodate anticipated user traffic volumes and data processing demands.
• Server Operating System: Ubuntu Server 22.04 Long-Term Support or comparable 
Linux distribution with extended maintenance support provides a reliable operational 
foundation.
• Web Server Platform: Nginx version 1.20 or subsequent releases, alternatively Apache 
HTTP Server version 2.4 or later, configured for reverse proxy functionality and traffic 
74
75
distribution management.
• Database Management System: MySQL version 8.0 or later releases, alternatively 
MariaDB version 10.6 or subsequent versions, with adequate storage capacity for 
commercial data retention.
• Computational Resources: A minimum of 8 central processing unit cores operating at 2.0 
gigahertz or higher frequency is necessary for managing simultaneous requests and 
background computational tasks.
• Memory Allocation: The application server infrastructure requires a minimum of 16 
gigabytes of random-access memory. Database server infrastructure necessitates a 
minimum of 8 gigabytes of random-access memory.
• Storage Configuration: Solid-state drive storage technology is strongly recommended for 
database repositories and application files to ensure expeditious read and write operations.
• Security Framework: Network firewall configurations restrict connectivity to essential 
communication ports, enhancing platform security. Secure Sockets Layer certificates 
facilitate encrypted communication channels between client devices and server 
infrastructure.
CHAP 5
CONCLUSION AND RECOMMENDATIONS
Conclusion
The E-Commerce and Customer Management Solution for La Rosée Minerals Naturelle 
constitutes a comprehensive digital platform engineered to transform commercial operations and 
strengthen competitive positioning within Chad's mineral water industry. The system integrates 
multiple interconnected functionalities that support customers, administrators, managers, and 
business stakeholders throughout the complete digital commerce lifecycle.
The platform delivers capabilities encompassing product catalog management, secure online 
transactions, inventory administration, order tracking, customer engagement tools, and business 
intelligence analytics. The system's user interfaces have been developed with meticulous attention 
to usability and aesthetic appeal. Utilizing React, JavaScript, Tailwind CSS, and modern frontend 
frameworks, the platform provides responsive designs that adapt seamlessly across desktop 
computers, tablets, and mobile devices. This ensures that stakeholders can access critical 
commercial information whether operating from corporate offices or engaging remotely through 
personal devices.
The platform's operational workflow encompasses user account management, product browsing 
and selection, shopping cart operations, secure checkout processes, order fulfillment tracking, 
customer review submission, and comprehensive performance monitoring. The system promotes 
efficient collaboration among diverse organizational stakeholders by implementing role-based 
access control mechanisms that ensure each user accesses appropriate functionalities while 
maintaining data security and system integrity.
The E-Commerce and Customer Management Solution aims to enhance operational efficiency, 
strengthen digital market presence, and provide a centralized infrastructure for data-driven 
commercial decision-making across La Rosée Minerals Naturelle. It supports the implementation 
of real-time inventory management systems, enables evidence-based strategic planning through 
comprehensive analytics dashboards, and facilitates transparent customer interactions connecting 
the company directly with consumers.
76
77
Recommendations
Based on the comprehensive development and implementation of the E-Commerce and Customer 
Management Solution for La Rosée Minerals Naturelle, several strategic recommendations emerge 
to maximize the platform's effectiveness and ensure sustained competitive advantage within 
Chad's evolving digital marketplace.
While the current web-based platform demonstrates responsive design capabilities across diverse 
device configurations, the development of dedicated native mobile applications for Android and 
iOS operating systems would substantially enhance customer accessibility and engagement. 
Mobile applications offer superior performance characteristics, offline functionality capabilities, 
and streamlined user experiences optimized specifically for smartphone interactions. Given the 
increasing prevalence of mobile commerce throughout Chad and the broader African region, native 
mobile applications would position La Rosée to capture market segments that predominantly 
access digital services through mobile devices. These applications should incorporate push 
notification systems for real-time order updates, personalized promotional campaigns, and 
customer engagement initiatives.
To optimize order fulfillment efficiency and enhance customer satisfaction, La Rosée should 
pursue strategic integration partnerships with established logistics and delivery service providers 
operating within Chad's commercial infrastructure. Implementing application programming 
interface connections with third-party delivery platforms would enable automated shipment 
tracking, real-time delivery status updates, and optimized route planning that reduces delivery 
times and operational costs. This integration would additionally facilitate expanded geographic 
market penetration by leveraging established delivery networks capable of reaching remote or 
underserved regions where La Rosée currently maintains limited distribution presence.
The existing analytics dashboard provides foundational business intelligence capabilities; 
however, substantial opportunities exist for implementing more sophisticated analytical 
frameworks that leverage machine learning algorithms and predictive modeling techniques. 
Advanced analytics implementations should incorporate customer behavior prediction models that 
identify purchasing patterns, forecast demand fluctuations, and enable proactive inventory 
management strategies. 
78
REFERENCES
Books
✓ Fowler, M. (2003). UML Distilled: A Brief Guide to the Standard Object Modeling 
Language (3rd ed.). Addison-Wesley Professional. 
✓ Sommerville, I. (2015). Software Engineering (10th ed.). Pearson Education. 
✓ Pressman, R. S., & Maxim, B. R. (2014). Software Engineering: A Practitioner's Approach
(8th ed.). McGraw-Hill Education. 
✓ Laudon, K. C., & Traver, C. G. (2020). E-Commerce: Business, Technology, Society (16th 
ed.). Pearson.
✓ Chaffey, D., & Ellis-Chadwick, F. (2019). Digital Marketing: Strategy, Implementation 
and Practice (7th ed.). Pearson Education.
Websites
✓ Spring Framework Documentation. (2025). Spring Boot Reference Guide. Retrieved from 
https://spring.io/projects/spring-boot
✓ Mozilla Developer Network. (2025). React JavaScript Library Documentation. Retrieved 
from https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client￾side_JavaScript_frameworks/React_getting_started
✓ MySQL Documentation. (2025). MySQL 8.0 Reference Manual. Retrieved from 
https://dev.mysql.com/doc/refman/8.0/en/
✓ World Bank Group. (2024). Digital Development in Sub-Saharan Africa. Retrieved from 
https://www.worldbank.org/en/topic/digitaldevelopment
✓ United Nations Conference on Trade and Development (UNCTAD). (2024). E-Commerce 
and Digital Economy Reports. Retrieved from https://unctad.org/topic/ecommerce-and￾digital-economy
79
APPENDICES
80
81