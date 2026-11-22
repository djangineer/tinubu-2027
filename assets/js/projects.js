/* projects.js — project directory: search, filter by state / sector / status, detail dialog. DATA: edit PROJECTS below. */
(function () {
  'use strict';
  const root = document.getElementById('project-directory');
  if (!root) return;

  const STATES = ['Nationwide', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory'];
  const SECTORS = ['Roads & transport', 'Education', 'Healthcare', 'Agriculture', 'Power & energy', 'Water & sanitation', 'Digital & technology', 'Housing', 'Social welfare'];
  const STATUSES = ['Completed', 'Ongoing', 'Planned', 'Under review'];

  /* PROJECT RECORDS. `states` may list several states; use 'Nationwide' for national programmes. */
  const PROJECTS = [
    { id: 'p1', title: 'Lagos–Calabar Coastal Highway', states: ['Lagos', 'Ogun', 'Ondo', 'Edo', 'Delta', 'Bayelsa', 'Rivers', 'Akwa Ibom', 'Cross River'], sector: 'Roads & transport', status: 'Ongoing', location: '9 coastal states', date: '2024; first phase commissioned 31 May 2025', reported: 'Partly open; ongoing' },
    { id: 'p2', title: 'Sokoto–Badagry Superhighway', states: ['Sokoto', 'Kebbi', 'Niger', 'Kwara', 'Oyo', 'Ogun', 'Lagos'], sector: 'Roads & transport', status: 'Ongoing', location: 'Sokoto–Lagos corridor', date: '25 October 2024', reported: 'Ongoing' },
    { id: 'p3', title: 'Calabar–Ebonyi–Benue–Nasarawa–Abuja Superhighway', states: ['Cross River', 'Ebonyi', 'Benue', 'Nasarawa', 'Federal Capital Territory'], sector: 'Roads & transport', status: 'Ongoing', location: 'South-South to FCT', date: '16 April 2025', reported: 'Ongoing' },
    { id: 'p4', title: 'Akwanga–Jos–Bauchi–Gombe–Maiduguri Superhighway', states: ['Nasarawa', 'Plateau', 'Bauchi', 'Gombe', 'Borno'], sector: 'Roads & transport', status: 'Ongoing', location: 'North-Central / North-East', date: '4 June and 1 July 2026', reported: 'Flagged off; ongoing' },
    { id: 'p5', title: 'Ibadan–Ife–Ilesha–Akure–Benin Road', states: ['Oyo', 'Osun', 'Ondo', 'Edo'], sector: 'Roads & transport', status: 'Ongoing', location: 'Oyo, Osun, Ondo, Edo', date: '31 May 2025', reported: 'Flagged off' },
    { id: 'p6', title: 'Nembe–Brass Road', states: ['Bayelsa'], sector: 'Roads & transport', status: 'Ongoing', location: 'Bayelsa', date: '31 May 2025', reported: 'Flagged off' },
    { id: 'p7', title: 'Enugu–Onitsha Expressway', states: ['Enugu', 'Anambra'], sector: 'Roads & transport', status: 'Ongoing', location: 'Enugu, Anambra', date: '31 May 2025; first 15 km opened 2 April 2026', reported: 'Partly open; ongoing' },
    { id: 'p8', title: 'Kano–Maiduguri Road, Section I', states: ['Kano', 'Jigawa', 'Bauchi', 'Yobe', 'Borno'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kano, Jigawa, Bauchi, Yobe, Borno', date: '31 May 2025', reported: 'Ongoing' },
    { id: 'p9', title: 'Kano Northern Bypass', states: ['Kano'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kano', date: '31 May 2025', reported: 'Flagged off' },
    { id: 'p10', title: 'Maiduguri Bypass', states: ['Borno'], sector: 'Roads & transport', status: 'Ongoing', location: 'Borno', date: '31 May 2025', reported: 'Flagged off' },
    { id: 'p11', title: 'Abuja–Lokoja Highway reconstruction', states: ['Federal Capital Territory', 'Kogi'], sector: 'Roads & transport', status: 'Ongoing', location: 'FCT, Kogi', date: '2025–2026', reported: 'Ongoing' },
    { id: 'p12', title: 'Benin–Ore–Shagamu Expressway', states: ['Edo', 'Ondo', 'Ogun'], sector: 'Roads & transport', status: 'Ongoing', location: 'Edo, Ondo, Ogun', date: 'May 2025', reported: 'Ongoing' },
    { id: 'p13', title: 'Carter Bridge reconstruction', states: ['Lagos'], sector: 'Roads & transport', status: 'Ongoing', location: 'Lagos', date: '2026', reported: 'Under construction', img: 'assets/images/projects/carter-bridge.jpg', credit: 'Photo: OPNPhotography, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Carter_Bridge.jpg' },
    { id: 'p14', title: 'Eko Bridge rehabilitation', states: ['Lagos'], sector: 'Roads & transport', status: 'Ongoing', location: 'Lagos', date: '2026 emergency repairs', reported: 'Under construction', img: 'assets/images/projects/eko-bridge-lagos.jpg', credit: 'Photo: Solasly, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Eko_Bridge,_Lagos.jpg' },
    { id: 'p15', title: 'Kano–Maiduguri road, other sections', states: ['Kano', 'Jigawa', 'Bauchi', 'Yobe', 'Borno'], sector: 'Roads & transport', status: 'Ongoing', location: 'North-East', date: 'Earlier contracts; further work under Tinubu', reported: 'Partly open; ongoing' },
    { id: 'p16', title: 'Enugu–Port Harcourt Expressway', states: ['Enugu', 'Abia', 'Rivers'], sector: 'Roads & transport', status: 'Ongoing', location: 'Enugu, Abia, Rivers', date: 'Continued during 2023–2026', reported: 'Partly open; ongoing' },
    { id: 'p17', title: 'Suleja–Minna Road', states: ['Niger'], sector: 'Roads & transport', status: 'Ongoing', location: 'Niger', date: 'Emergency intervention announced 2025; new works in 2026', reported: 'Ongoing' },
    { id: 'p18', title: 'Kaduna Eastern Bypass', states: ['Kaduna'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kaduna', date: 'Work continued during 2023–2026', reported: 'Partly open; ongoing' },
    { id: 'p19', title: 'Obajana Junction–Okene–Auchi–Benin Road', states: ['Kogi', 'Edo'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kogi, Edo', date: 'February 2025', reported: 'Ongoing' },
    { id: 'p20', title: 'Third Mainland Bridge rehabilitation', states: ['Lagos'], sector: 'Roads & transport', status: 'Completed', location: 'Lagos', date: 'Further works completed in 2024', reported: 'Completed', img: 'assets/images/projects/third-mainland-bridge-lagos-2.jpg', credit: 'Photo: S.aderogba, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Third-mainland-bridge--lagos_2.jpg' },
    { id: 'p21', title: 'Apapa–Oshodi–Oworonshoki–Ojota Expressway', states: ['Lagos'], sector: 'Roads & transport', status: 'Completed', location: 'Lagos', date: 'Commissioned May 2024', reported: 'Completed', img: 'assets/images/projects/oshodi-apapa-expressway.jpg', credit: 'Photo: Ready Street, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Oshodi_Apapa_Expressway.jpg' },
    { id: 'p22', title: 'Abuja–Keffi–Akwanga–Lafia–Makurdi Road', states: ['Federal Capital Territory', 'Nasarawa', 'Benue'], sector: 'Roads & transport', status: 'Ongoing', location: 'FCT, Nasarawa, Benue', date: '2024', reported: 'Major sections completed; additional works ongoing' },
    { id: 'p23', title: 'Shendam Bridge', states: ['Plateau'], sector: 'Roads & transport', status: 'Completed', location: 'Plateau', date: '31 May 2025', reported: 'Commissioned' },
    { id: 'p24', title: 'Jimeta Bridge', states: ['Adamawa'], sector: 'Roads & transport', status: 'Completed', location: 'Adamawa', date: '31 May 2025', reported: 'Commissioned' },
    { id: 'p25', title: 'Akpoha Bridge', states: ['Ebonyi'], sector: 'Roads & transport', status: 'Completed', location: 'Ebonyi', date: '31 May 2025', reported: 'Commissioned' },
    { id: 'p26', title: 'New Artisan Market Enugu Bridge', states: ['Enugu'], sector: 'Roads & transport', status: 'Completed', location: 'Enugu', date: '31 May 2025', reported: 'Commissioned' },
    { id: 'p27', title: 'Abuja Rail Mass Transit', states: ['Federal Capital Territory'], sector: 'Roads & transport', status: 'Completed', location: 'Abuja, FCT', date: '29 May 2024', reported: 'Commercial operations relaunched' },
    { id: 'p28', title: 'Port Harcourt–Aba Rail', states: ['Rivers', 'Abia'], sector: 'Roads & transport', status: 'Completed', location: 'Rivers, Abia', date: '30 April 2024; commercial operations 7 May 2024', reported: 'Operational' },
    { id: 'p29', title: 'Kaduna–Kano Standard Gauge Railway', states: ['Kaduna', 'Kano'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kaduna, Kano', date: 'Continued under Tinubu; 90% reported 23 October 2026', reported: 'Ongoing' },
    { id: 'p30', title: 'Kano–Katsina–Maradi Railway', states: ['Kano', 'Katsina'], sector: 'Roads & transport', status: 'Ongoing', location: 'Kano, Katsina, Niger Republic', date: 'Construction continued; progress update August 2026', reported: 'Ongoing' },
    { id: 'p31', title: 'Eastern Railway rehabilitation', states: ['Rivers', 'Abia', 'Enugu', 'Benue', 'Nasarawa', 'Bauchi', 'Borno'], sector: 'Roads & transport', status: 'Ongoing', location: 'Port Harcourt–Maiduguri corridor', date: 'First 62 km section operational in April/May 2024', reported: 'Other sections ongoing' },
    { id: 'p32', title: 'Akanu Ibiam Airport PPP concession', states: ['Enugu'], sector: 'Roads & transport', status: 'Ongoing', location: 'Enugu', date: 'FEC approval 31 July 2025; handover June 2026', reported: 'Concession handed over; rehabilitation planned', img: 'assets/images/projects/akanu-ibiam-international-airport.jpg', credit: 'Photo: TheSokks, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Akanu_Ibiam_International_Airport.jpg' },
    { id: 'p33', title: 'Port Harcourt International Airport concession', states: ['Rivers'], sector: 'Roads & transport', status: 'Planned', location: 'Rivers', date: 'November 2025', reported: 'Approved', img: 'assets/images/projects/port-harcourt-international-airport-view.jpg', credit: 'Photo: Masssly, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Port_Harcourt_International_Airport_view.jpg' },
    { id: 'p34', title: 'Mallam Aminu Kano Airport domestic terminal remodelling', states: ['Kano'], sector: 'Roads & transport', status: 'Completed', location: 'Kano', date: 'July 2026', reported: 'Terminal commissioned', img: 'assets/images/projects/aminu-kano-international-airport-kano.jpg', credit: 'Photo: Solasly, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Aminu_Kano_International_Airport_Kano.jpg' },
    { id: 'p35', title: 'Mallam Aminu Kano Airport second runway', states: ['Kano'], sector: 'Roads & transport', status: 'Planned', location: 'Kano', date: '2026', reported: 'Reconstruction approved', img: 'assets/images/projects/aminu-kano-international-airport-kano.jpg', credit: 'Photo: Solasly, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Aminu_Kano_International_Airport_Kano.jpg' },
    { id: 'p36', title: 'Nnamdi Azikiwe Airport second runway', states: ['Federal Capital Territory'], sector: 'Roads & transport', status: 'Ongoing', location: 'Abuja', date: 'Contractor return approved in 2026', reported: 'Contract awarded; ongoing preparations', img: 'assets/images/projects/at-nnamdi-azikiwe-international-airport-02.jpg', credit: 'Photo: Kritzolina, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:At_Nnamdi_Azikiwe_International_Airport_02.jpg' },
    { id: 'p37', title: 'V-PASS biometric airport verification', states: ['Nationwide'], sector: 'Roads & transport', status: 'Ongoing', location: 'Nationwide', date: '2025–2026', reported: 'Deployment underway' },
    { id: 'p38', title: 'Presidential CNG Initiative', states: ['Nationwide'], sector: 'Power & energy', status: 'Ongoing', location: 'Nationwide', date: '2023', reported: 'Implementation underway' },
    { id: 'p39', title: 'Farin Ruwa 20MW Hydropower Project', states: ['Nasarawa'], sector: 'Power & energy', status: 'Ongoing', location: 'Nasarawa', date: 'October 2025', reported: 'Implementation underway' },
    { id: 'p40', title: 'Ikere Gorge 6MW Hydropower Plant', states: ['Oyo'], sector: 'Power & energy', status: 'Ongoing', location: 'Oyo', date: 'January 2026', reported: 'Handed to concessionaire' },
    { id: 'p41', title: 'Katsina Ala 460MW Hydropower Plant', states: ['Benue'], sector: 'Power & energy', status: 'Ongoing', location: 'Benue', date: 'May 2026', reported: 'Commercial close achieved' },
    { id: 'p42', title: 'Onne Port 50MW Independent Power Project', states: ['Rivers'], sector: 'Power & energy', status: 'Ongoing', location: 'Rivers', date: '2026', reported: 'Advancing' },
    { id: 'p43', title: 'Apapa Port 36MW Independent Power Project', states: ['Lagos'], sector: 'Power & energy', status: 'Ongoing', location: 'Lagos', date: '2026', reported: 'Advancing' },
    { id: 'p44', title: 'Kudenda 215MW Power Plant', states: ['Kaduna'], sector: 'Power & energy', status: 'Ongoing', location: 'Kaduna', date: 'Restarted under Tinubu; progress reported 2025', reported: 'Ongoing' },
    { id: 'p45', title: 'Ihovbor–Benin and Ihovbor–Ajaokuta 330kV transmission lines', states: ['Edo'], sector: 'Power & energy', status: 'Completed', location: 'Edo', date: '2026', reported: 'Completed' },
    { id: 'p46', title: 'Lagos transmission substation upgrades', states: ['Lagos'], sector: 'Power & energy', status: 'Completed', location: 'Lagos', date: '2026', reported: 'Completed' },
    { id: 'p47', title: 'Power Sector Debt Reduction Programme', states: ['Nationwide'], sector: 'Power & energy', status: 'Ongoing', location: 'Nationwide', date: 'July 2025', reported: 'Implementation underway' },
    { id: 'p48', title: 'Electricity Act state-market implementation', states: ['Nationwide'], sector: 'Power & energy', status: 'Ongoing', location: 'Nationwide', date: 'June 2023; first regulatory transfers October 2024', reported: 'Implementation ongoing' },
    { id: 'p49', title: 'Renewed Hope City, Karsana', states: ['Federal Capital Territory'], sector: 'Housing', status: 'Ongoing', location: 'Karsana, Abuja', date: '8 February 2024', reported: 'Under construction' },
    { id: 'p50', title: 'Renewed Hope City, Lagos', states: ['Lagos'], sector: 'Housing', status: 'Planned', location: 'Lagos', date: 'Announced under the 2024 housing programme', reported: 'Planned / under development' },
    { id: 'p51', title: 'Renewed Hope City, Kano', states: ['Kano'], sector: 'Housing', status: 'Planned', location: 'Kano', date: 'Announced under the 2024 housing programme', reported: 'Planned / under development' },
    { id: 'p52', title: 'Renewed Hope Estates', states: ['Nationwide'], sector: 'Housing', status: 'Ongoing', location: 'Various states', date: '2024 onward', reported: 'Implementation through state-level sites' },
    { id: 'p53', title: 'Renewed Hope Cities expansion', states: ['Borno', 'Enugu', 'Rivers'], sector: 'Housing', status: 'Planned', location: 'Maiduguri, Enugu, Port Harcourt', date: 'January 2026 announcement', reported: 'Planned' },
    { id: 'p54', title: 'Nigerian Education Loan Fund (NELFUND)', states: ['Nationwide'], sector: 'Education', status: 'Completed', location: 'Nationwide', date: 'Act signed 3 April 2024; portal opened May 2024', reported: 'Operational' },
    { id: 'p55', title: 'TETFund tertiary institution infrastructure projects', states: ['Nationwide'], sector: 'Education', status: 'Completed', location: 'Various institutions', date: '29 May 2026 commissioning programme', reported: 'Various facilities commissioned' },
    { id: 'p56', title: 'Student loan tuition support', states: ['Nationwide'], sector: 'Education', status: 'Completed', location: 'Eligible tertiary institutions', date: 'May 2024 onward', reported: 'Operational' },
    { id: 'p57', title: 'Student upkeep loan support', states: ['Nationwide'], sector: 'Education', status: 'Completed', location: 'Eligible students nationwide', date: 'May 2024 onward', reported: 'Operational' },
    { id: 'p58', title: 'Bola Tinubu Specialist Complex', states: ['Federal Capital Territory'], sector: 'Healthcare', status: 'Completed', location: 'FMC Jabi, Abuja', date: '29–30 May 2026', reported: 'Commissioned' },
    { id: 'p59', title: 'Laboratory Complex, University of Uyo Teaching Hospital', states: ['Akwa Ibom'], sector: 'Healthcare', status: 'Completed', location: 'University of Uyo Teaching Hospital', date: '30 May 2026', reported: 'Commissioned' },
    { id: 'p60', title: 'Administrative Complex, UNTH Enugu', states: ['Enugu'], sector: 'Healthcare', status: 'Completed', location: 'University of Nigeria Teaching Hospital, Enugu', date: '30 May 2026', reported: 'Commissioned' },
    { id: 'p61', title: 'Pharmacy Quality Control Laboratory', states: ['Kaduna'], sector: 'Healthcare', status: 'Completed', location: 'ABUTH, Zaria', date: '30 May 2026', reported: 'Commissioned', img: 'assets/images/projects/outer-view-of-ahmadu-bello-university-teaching-hospital-zari.jpg', credit: 'Photo: Armdy01, CC BY 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Outer_view_of_Ahmadu_Bello_University_Teaching_hospital_Zaria_Kaduna_state.jpg' },
    { id: 'p62', title: 'Mental Health and Drug Rehabilitation Centre', states: ['Borno'], sector: 'Healthcare', status: 'Completed', location: 'University of Maiduguri Teaching Hospital', date: '30 May 2026', reported: 'Commissioned', img: 'assets/images/projects/umth-auditorium.jpg', credit: 'Photo: De-Invincible, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:UMTH_Auditorium.jpg' },
    { id: 'p63', title: 'Lagos Immunisation Supply Chain Hub', states: ['Lagos'], sector: 'Healthcare', status: 'Completed', location: 'Oshodi, Lagos', date: '30 May 2026', reported: 'Commissioned' },
    { id: 'p64', title: 'NEMSAS Emergency Response Fleet', states: ['Nationwide'], sector: 'Healthcare', status: 'Ongoing', location: 'Nationwide', date: '30 May 2026', reported: 'Flagged off' },
    { id: 'p65', title: 'Primary healthcare revitalisation programme', states: ['Nationwide'], sector: 'Healthcare', status: 'Ongoing', location: 'Nationwide', date: '2024–2026', reported: 'Implementation ongoing' },
    { id: 'p66', title: 'IMPACT healthcare programme', states: ['Nationwide'], sector: 'Healthcare', status: 'Ongoing', location: 'Nationwide', date: '2024–2026', reported: 'Implementation ongoing' },
    { id: 'p67', title: 'MEDIPOOL medicines procurement PPP', states: ['Nationwide'], sector: 'Healthcare', status: 'Planned', location: 'Nationwide', date: '2026', reported: 'PPP development' },
    { id: 'p68', title: 'Sustainable Power and Irrigation for Nigeria (SPIN)', states: ['Nationwide'], sector: 'Agriculture', status: 'Ongoing', location: 'Nationwide', date: '10 March 2026', reported: 'Started' },
    { id: 'p69', title: 'Dasin Hausa Multipurpose Dam', states: ['Adamawa'], sector: 'Agriculture', status: 'Planned', location: 'Adamawa', date: '2025', reported: 'Planned / PPP development' },
    { id: 'p70', title: 'Bakolori Irrigation Scheme rehabilitation', states: ['Zamfara'], sector: 'Agriculture', status: 'Completed', location: 'Zamfara', date: 'Continued under Tinubu; 2024 milestone', reported: 'Reported rehabilitation scope completed' },
    { id: 'p71', title: 'Kano River Irrigation Scheme', states: ['Kano'], sector: 'Agriculture', status: 'Ongoing', location: 'Kano', date: 'Continued under Tinubu', reported: 'Rehabilitation programme' },
    { id: 'p72', title: 'Hadejia Valley Irrigation Scheme', states: ['Jigawa'], sector: 'Agriculture', status: 'Ongoing', location: 'Jigawa', date: 'Continued under Tinubu', reported: 'Rehabilitation programme' },
    { id: 'p73', title: 'Dadin Kowa Irrigation Scheme', states: ['Gombe'], sector: 'Agriculture', status: 'Ongoing', location: 'Gombe', date: 'Continued under Tinubu', reported: 'Rehabilitation programme' },
    { id: 'p74', title: 'Mechanised farming and tractor support', states: ['Nationwide'], sector: 'Agriculture', status: 'Ongoing', location: 'Nationwide', date: '2024–2025', reported: 'Implementation underway' },
    { id: 'p75', title: 'National fertiliser and agricultural input support', states: ['Nationwide'], sector: 'Agriculture', status: 'Ongoing', location: 'Nationwide', date: '2023 onward', reported: 'Programme implementation' },
    { id: 'p76', title: 'Apapa Port reconstruction', states: ['Lagos'], sector: 'Roads & transport', status: 'Planned', location: 'Lagos', date: '2026 financing secured', reported: 'Approved; physical works to be verified', img: 'assets/images/projects/apapa-port-lagos.jpg', credit: 'Photo: Quadrex24, CC BY-SA 4.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Apapa_port.lagos.jpg' },
    { id: 'p77', title: 'Tin Can Island Port reconstruction', states: ['Lagos'], sector: 'Roads & transport', status: 'Planned', location: 'Lagos', date: '2026 financing secured', reported: 'Approved; physical works to be verified' },
    { id: 'p78', title: 'Ondo Multipurpose Deep Seaport', states: ['Ondo'], sector: 'Roads & transport', status: 'Planned', location: 'Ondo', date: 'December 2025', reported: 'Approved' },
    { id: 'p79', title: 'Bakassi Deep Seaport', states: ['Cross River'], sector: 'Roads & transport', status: 'Planned', location: 'Cross River', date: 'December 2025', reported: 'Approved' },
    { id: 'p80', title: 'Federal Coastal Fishery Terminal', states: ['Rivers'], sector: 'Roads & transport', status: 'Planned', location: 'Borokiri, Rivers', date: 'May 2025', reported: 'Approved' },
    { id: 'p81', title: 'Deep-Sea Port Access Road', states: ['Lagos', 'Ogun'], sector: 'Roads & transport', status: 'Completed', location: 'Lagos / Ogun', date: '31 May 2025', reported: 'Commissioned project' },
    { id: 'p82', title: 'National Single Window trade platform', states: ['Nationwide'], sector: 'Digital & technology', status: 'Completed', location: 'Nationwide', date: 'Launched 2024; went live 27 March 2026', reported: 'Operational' },
    { id: 'p83', title: 'Project BRIDGE – National Fibre Backbone', states: ['Nationwide'], sector: 'Digital & technology', status: 'Planned', location: 'Nationwide', date: 'Financing and programme development 2025–2026', reported: 'Approved; physical rollout pending' },
    { id: 'p84', title: 'Product Authentication and Tracking System', states: ['Nationwide'], sector: 'Digital & technology', status: 'Ongoing', location: 'Nationwide', date: 'Commercial close March 2026', reported: 'Implementation development' },
    { id: 'p85', title: 'Smart National Transport Data Bank', states: ['Nationwide'], sector: 'Digital & technology', status: 'Planned', location: 'Nationwide', date: '2026', reported: 'Approved' },
    { id: 'p86', title: 'Digital public-sector modernisation', states: ['Nationwide'], sector: 'Digital & technology', status: 'Ongoing', location: 'Federal MDAs', date: '2023–2026', reported: 'Various implementations' },
    { id: 'p87', title: 'OB3 Gas Pipeline', states: ['Rivers', 'Edo'], sector: 'Power & energy', status: 'Ongoing', location: 'Rivers–Edo', date: '2025 commissioning milestone; Niger crossing completed 2026', reported: 'Partly operational' },
    { id: 'p88', title: 'Port Harcourt Refinery rehabilitation', states: ['Rivers'], sector: 'Power & energy', status: 'Under review', location: 'Rivers', date: 'Restart announced 26 November 2024', reported: 'Stalled again; rehabilitation arrangements under review' },
    { id: 'p89', title: 'Ajaokuta Steel revival', states: ['Kogi'], sector: 'Power & energy', status: 'Planned', location: 'Kogi', date: 'Technical audit and gas agreement in 2026', reported: 'Proposed revival; no completed revival' },
    { id: 'p90', title: 'Nigeria–Morocco Gas Pipeline', states: ['Nationwide'], sector: 'Power & energy', status: 'Planned', location: 'Nigeria–Morocco corridor', date: 'Intergovernmental agreement July 2026', reported: 'Planning / development stage' },
    { id: 'p91', title: 'NLNG Train 7', states: ['Rivers'], sector: 'Power & energy', status: 'Ongoing', location: 'Bonny Island, Rivers', date: 'Continued under Tinubu', reported: 'Under construction; inherited project', img: 'assets/images/projects/nigeria-lng-at-night.jpg', credit: 'Photo: Chike Roland ORAEKWUGHA, CC BY 2.0, via Wikimedia Commons', creditUrl: 'https://commons.wikimedia.org/wiki/File:Nigeria_LNG_at_Night.jpg' },
  ];

  const $ = (s, r = root) => r.querySelector(s);
  const listEl = $('[data-project-list]'), countEl = $('[data-count]'), emptyEl = $('[data-empty]');
  const qEl = $('[data-search]'), stateSel = $('[data-state]'), sectorSel = $('[data-sector]'), statusSel = $('[data-status]');
  const grid = $('[data-state-grid]'), dlg = document.getElementById('project-dialog');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let activeState = '', opener = null;

  stateSel.innerHTML = '<option value="">All states, FCT and nationwide</option>' + STATES.map((s) => '<option>' + esc(s) + '</option>').join('');
  sectorSel.innerHTML = '<option value="">All sectors</option>' + SECTORS.map((s) => '<option>' + esc(s) + '</option>').join('');
  statusSel.innerHTML = '<option value="">Any status</option>' + STATUSES.map((s) => '<option>' + esc(s) + '</option>').join('');

  function renderStateGrid() {
    const counts = {}; PROJECTS.forEach((p) => { p.states.forEach((x) => { counts[x] = (counts[x] || 0) + 1; }); });
    grid.innerHTML = STATES.map((s) =>
      '<button type="button" class="state-btn" data-s="' + esc(s) + '" aria-pressed="' + (activeState === s) + '">' + esc(s === 'Federal Capital Territory' ? 'FCT Abuja' : s) + '<small>' + (counts[s] || 0) + '</small></button>').join('');
  }
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]'); if (!b) return;
    activeState = activeState === b.dataset.s ? '' : b.dataset.s; stateSel.value = activeState; render();
  });

  function where(p) { return p.states.length > 3 ? p.states.length + ' states' : p.states.join(', '); }
  function render() {
    const q = qEl.value.trim().toLowerCase();
    activeState = stateSel.value;
    const hits = PROJECTS.filter((p) =>
      (!activeState || p.states.includes(activeState)) && (!sectorSel.value || p.sector === sectorSel.value) && (!statusSel.value || p.status === statusSel.value) &&
      (!q || (p.title + ' ' + p.states.join(' ') + ' ' + p.sector + ' ' + p.reported + ' ' + p.location).toLowerCase().includes(q)));
    listEl.innerHTML = hits.map((p) =>
      '<li class="card project-card"><button type="button" class="pc-open" data-id="' + p.id + '" aria-haspopup="dialog">' +
      (p.img ? '<figure class="ph r-16-9"><img src="' + esc(p.img) + '" alt="' + esc(p.title) + '" loading="lazy"></figure>' : '<figure class="ph r-16-9"><svg class="ph-ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 38h36M10 38V20l14-9 14 9v18M20 38V27h8v11"/></svg><figcaption><b>Placeholder</b> – project photograph</figcaption></figure>') +
      '<span class="card-body"><span class="meta"><span>' + esc(where(p)) + '</span><span>' + esc(p.sector) + '</span></span>' +
      '<h3>' + esc(p.title) + '</h3><span class="muted" style="font-size:.95rem">' + esc(p.reported) + ' · ' + esc(p.date) + '</span>' +
      '<span style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem"><span class="tag tag--info">' + esc(p.status) + '</span>' + '</span></span></button></li>').join('');
    listEl.style.cssText = 'list-style:none;padding:0;margin:0;display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))';
    countEl.textContent = hits.length ? hits.length + (hits.length === 1 ? ' project' : ' projects') + (activeState ? ' in ' + activeState : '') + '.' : 'No projects match.';
    emptyEl.hidden = hits.length > 0;
    renderStateGrid();
  }
  [qEl, stateSel, sectorSel, statusSel].forEach((el) => el.addEventListener(el === qEl ? 'input' : 'change', render));
  qEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
  $('[data-reset]').addEventListener('click', () => { qEl.value = ''; stateSel.value = sectorSel.value = statusSel.value = ''; render(); qEl.focus(); });

  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]'); if (!b) return;
    const p = PROJECTS.find((x) => x.id === b.dataset.id); opener = b;
    dlg.querySelector('[data-dlg]').innerHTML =
      (p.img ? '<figure class="ph r-16-9" style="margin-bottom:1.25rem"><img src="' + esc(p.img) + '" alt="' + esc(p.title) + '"><figcaption><a href="' + esc(p.creditUrl) + '" rel="noopener" style="color:inherit">' + esc(p.credit) + '</a></figcaption></figure>' : '<figure class="ph r-16-9" style="margin-bottom:1.25rem"><svg class="ph-ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 38h36M10 38V20l14-9 14 9v18M20 38V27h8v11"/></svg><figcaption><b>Placeholder</b> – replace with a dated, credited project photograph</figcaption></figure>') +
      '<div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.75rem"><span class="tag tag--info">' + esc(p.status) + '</span></div>' +
      '<h2 id="project-dialog-title" style="font-size:1.9rem">' + esc(p.title) + '</h2><p>' + esc(p.reported) + '.</p>' +
      '<dl class="rule-list" style="margin:0">' +
      '<div style="display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--line)"><dt><b>States</b></dt><dd style="margin:0">' + esc(p.states.join(', ')) + '</dd></div>' +
      '<div style="display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--line)"><dt><b>Location</b></dt><dd style="margin:0">' + esc(p.location) + '</dd></div>' +
      '<div style="display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--line)"><dt><b>Sector</b></dt><dd style="margin:0">' + esc(p.sector) + '</dd></div>' +
      '<div style="display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--line)"><dt><b>Key date</b></dt><dd style="margin:0">' + esc(p.date) + '</dd></div>' +
      '<div style="display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.7rem 0"><dt><b>Reported status</b></dt><dd style="margin:0">' + esc(p.reported) + '</dd></div></dl>';
    dlg.showModal(); dlg.querySelector('.dlg-close').focus();
  });
  dlg.querySelector('.dlg-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => opener && opener.focus());

  const pre = new URLSearchParams(location.search).get('state');
  if (pre && STATES.includes(pre)) stateSel.value = pre;
  render();
})();
