/**
 * i18n Service — Hindi/English toggle for MediCare
 * Persists language preference in localStorage
 */
const I18nService = (() => {
  const LANG_KEY = 'medicare_lang';
  const listeners = [];

  const translations = {
    en: {
      // Nav
      'nav.home': 'Home',
      'nav.booking': 'Booking',
      'nav.vault': 'Vault',
      'nav.ayushman': 'Ayushman',
      'nav.sos': 'SOS',

      // Login
      'login.welcome': 'Welcome back',
      'login.subtitle': 'Please enter your credentials to access your clinical dashboard.',
      'login.mobile_label': 'Mobile Number or ABHA ID',
      'login.mobile_placeholder': 'e.g. 9876543210 or 14-digit ID',
      'login.password': 'Password',
      'login.forgot': 'Forgot Password?',
      'login.submit': 'Login',
      'login.biometrics': 'Use Biometrics',
      'login.new_user': 'New to MediCare?',
      'login.create_account': 'Create an Account',
      'login.otp_sent': 'OTP sent to your mobile',
      'login.enter_otp': 'Enter OTP',
      'login.otp_placeholder': 'Enter 6-digit OTP',
      'login.verify_otp': 'Verify & Login',
      'login.resend': 'Resend OTP',
      'login.send_otp': 'Send OTP',
      'login.brand_headline': 'A Clinical Sanctuary\nfor Your Health.',
      'login.brand_desc': 'Access your medical vault, manage appointments, and connect with your care team in a secure, premium environment.',

      // Dashboard
      'dash.greeting_morning': 'Good Morning',
      'dash.greeting_afternoon': 'Good Afternoon',
      'dash.greeting_evening': 'Good Evening',
      'dash.subtitle': 'Your health sanctuary is ready. 3 appointments scheduled today.',
      'dash.quick_actions': 'Quick Actions',
      'dash.consult': 'Consult',
      'dash.pharmacy': 'Pharmacy',
      'dash.lab_test': 'Lab Test',
      'dash.vax_check': 'Vax Check',
      'dash.emergency_title': 'Emergency?',
      'dash.emergency_desc': 'Immediate medical dispatch within 10 mins in Patna city limits.',
      'dash.call_ambulance': 'Call Ambulance',
      'dash.top_hospitals': 'Top Hospitals in Patna',
      'dash.realtime_opd': 'Real-time OPD & Bed availability',
      'dash.view_all': 'VIEW ALL',
      'dash.medical_vault': 'Medical Vault',
      'dash.lab_reports': 'Lab Reports',
      'dash.prescriptions': 'Prescriptions',
      'dash.bills': 'Bills/Receipts',
      'dash.documents': 'documents',
      'dash.upload_new': 'Upload New',
      'dash.scan_store': 'Scan & Store',
      'dash.opd_available': 'OPD: AVAILABLE',
      'dash.opd_busy': 'OPD: BUSY',
      'dash.opd_full': 'OPD: FULL',
      'dash.wait_time': 'Wait time',
      'dash.mins': 'mins',
      'dash.reschedule': 'Reschedule Recommended',

      // Booking
      'book.step': 'Step',
      'book.of': 'of',
      'book.title1': 'Book your',
      'book.title1_highlight': 'Consultation.',
      'book.title2': 'Choose your',
      'book.title2_highlight': 'Hospital.',
      'book.title3': 'Pick a',
      'book.title3_highlight': 'Time Slot.',
      'book.desc1': 'Select your health requirements and location to find the most suitable medical expert in Patna.',
      'book.desc2': 'Choose from top hospitals matching your specialty.',
      'book.desc3': 'Select a convenient time for your appointment.',
      'book.select_specialty': 'SELECT SPECIALTY',
      'book.district': 'District',
      'book.block': 'Block / Circle',
      'book.panchayat': 'Panchayat / Ward Number',
      'book.panchayat_placeholder': 'Search your Panchayat or Ward...',
      'book.smart_match': 'Smart Match Enabled',
      'book.smart_desc': "We'll prioritize specialists currently available within 5km of your selected Patna Ward.",
      'book.find_doctors': 'Find Available Doctors',
      'book.select_time': 'Select Time Slot',
      'book.confirm': 'Confirm Booking',
      'book.back': 'Back',
      'book.available_slots': 'AVAILABLE SLOTS',
      'book.ayushman_note': 'No consultation fee charged for Ayushman Card holders.',

      // Vault
      'vault.title': 'Medical Vault',
      'vault.subtitle': 'Your secure digital sanctuary for all clinical records, organized for clarity and immediate access.',
      'vault.search_placeholder': 'Search reports by doctor or hospital...',
      'vault.date_range': 'Date Range',
      'vault.recent': 'Recent Records',
      'vault.recent_desc': 'Your latest medical updates at a glance',
      'vault.view_history': 'View History',
      'vault.upload_new': 'Upload New',
      'vault.upload_desc': 'Scan or upload clinical documents',
      'vault.files_found': 'Files Found',
      'vault.upload_pdf': 'Upload PDF',
      'vault.upload_photo': 'Take Photo',
      'vault.share_wa': 'Share via WhatsApp',

      // Emergency
      'sos.title': 'Immediate Assistance',
      'sos.ambulance_name': 'Patna Ambulance Services',
      'sos.tap_call': 'TAP TO CALL NOW',
      'sos.current': 'Current',
      'sos.live_gps': 'Live GPS',
      'sos.er_title': 'Nearby ER Availability',
      'sos.updated': 'Updated: 1m ago',
      'sos.blood_banks': 'Blood Bank Contacts',
      'sos.viewing_assets': 'Viewing nearby assets',

      // Ayushman
      'abha.govt_cert': 'Government Certified',
      'abha.title': 'Ayushman Bharat Health Account',
      'abha.desc': 'Your universal health identity for a seamless digital healthcare journey across India.',
      'abha.id_title': 'ABHA ID',
      'abha.digital_health': 'Digital Health Account',
      'abha.health_id_num': 'Health ID Number',
      'abha.account_holder': 'Account Holder',
      'abha.golden_card': 'Golden Card',
      'abha.pmjay': 'PM-JAY Enrollment',
      'abha.app_ref': 'Application Reference',
      'abha.track_status': 'Track Status',
      'abha.panchayat_benefits': 'Panchayat Level Benefits',
      'abha.free_screenings': 'Free Screenings',
      'abha.free_screenings_desc': 'Weekly checkups at your local Gram Panchayat Bhawan every Tuesday.',
      'abha.medicine_kit': 'Medicine Kit',
      'abha.medicine_kit_desc': 'Monthly essential medicines provided to all Golden Card holders.',
      'abha.priority108': '108 Priority',
      'abha.priority108_desc': 'Dedicated emergency transport priority for rural card holders.',
      'abha.asha_support': 'Asha Support',
      'abha.asha_support_desc': 'Direct home-visit coordination via your local ASHA worker.',
      'abha.how_it_works': 'How it works',
      'abha.step1_title': 'Generate ABHA',
      'abha.step1_desc': 'Link your Aadhaar or Mobile to create your unique digital identity.',
      'abha.step2_title': 'Verify at Center',
      'abha.step2_desc': 'Visit nearest Arogya Kendra for e-KYC and Golden Card eligibility.',
      'abha.step3_title': 'Claim Benefits',
      'abha.step3_desc': 'Access ₹5 Lakh coverage per year for secondary and tertiary care.',
      'abha.need_help': 'Need assistance?',
      'abha.helpline': '24/7 PM-JAY Helpline: 14555',
      'abha.contact_nha': 'Contact NHA',

      // Common
      'common.patna_bihar': 'Patna, Bihar',
      'common.verified': 'Verified Patient',
      'common.language': 'हिंदी',
      'common.logout': 'Logout',
    },

    hi: {
      // Nav
      'nav.home': 'होम',
      'nav.booking': 'बुकिंग',
      'nav.vault': 'वॉल्ट',
      'nav.ayushman': 'आयुष्मान',
      'nav.sos': 'SOS',

      // Login
      'login.welcome': 'स्वागत है',
      'login.subtitle': 'अपना क्लीनिकल डैशबोर्ड एक्सेस करने के लिए अपनी जानकारी दर्ज करें।',
      'login.mobile_label': 'मोबाइल नंबर या ABHA ID',
      'login.mobile_placeholder': 'जैसे 9876543210 या 14-अंक ID',
      'login.password': 'पासवर्ड',
      'login.forgot': 'पासवर्ड भूल गए?',
      'login.submit': 'लॉगिन करें',
      'login.biometrics': 'बायोमेट्रिक्स से लॉगिन',
      'login.new_user': 'MediCare पर नए हैं?',
      'login.create_account': 'अकाउंट बनाएं',
      'login.otp_sent': 'आपके मोबाइल पर OTP भेजा गया',
      'login.enter_otp': 'OTP दर्ज करें',
      'login.otp_placeholder': '6-अंक का OTP दर्ज करें',
      'login.verify_otp': 'OTP वेरिफाई करें',
      'login.resend': 'OTP दोबारा भेजें',
      'login.send_otp': 'OTP भेजें',
      'login.brand_headline': 'आपके स्वास्थ्य का\nसुरक्षित ठिकाना।',
      'login.brand_desc': 'अपना मेडिकल वॉल्ट एक्सेस करें, अप्वाइंटमेंट मैनेज करें, और अपनी केयर टीम से सुरक्षित रूप से जुड़ें।',

      // Dashboard
      'dash.greeting_morning': 'सुप्रभात',
      'dash.greeting_afternoon': 'नमस्कार',
      'dash.greeting_evening': 'शुभ संध्या',
      'dash.subtitle': 'आपका हेल्थ सैंक्चुअरी तैयार है। आज 3 अप्वाइंटमेंट हैं।',
      'dash.quick_actions': 'त्वरित कार्य',
      'dash.consult': 'परामर्श',
      'dash.pharmacy': 'दवाई',
      'dash.lab_test': 'लैब टेस्ट',
      'dash.vax_check': 'टीकाकरण',
      'dash.emergency_title': 'आपातकाल?',
      'dash.emergency_desc': 'पटना सिटी में 10 मिनट के अंदर मेडिकल डिस्पैच।',
      'dash.call_ambulance': 'एम्बुलेंस बुलाएं',
      'dash.top_hospitals': 'पटना के प्रमुख अस्पताल',
      'dash.realtime_opd': 'रियल-टाइम OPD और बेड उपलब्धता',
      'dash.view_all': 'सभी देखें',
      'dash.medical_vault': 'मेडिकल वॉल्ट',
      'dash.lab_reports': 'लैब रिपोर्ट',
      'dash.prescriptions': 'प्रिस्क्रिप्शन',
      'dash.bills': 'बिल/रसीदें',
      'dash.documents': 'दस्तावेज़',
      'dash.upload_new': 'नया अपलोड',
      'dash.scan_store': 'स्कैन और स्टोर',
      'dash.opd_available': 'OPD: उपलब्ध',
      'dash.opd_busy': 'OPD: व्यस्त',
      'dash.opd_full': 'OPD: भरा हुआ',
      'dash.wait_time': 'प्रतीक्षा समय',
      'dash.mins': 'मिनट',
      'dash.reschedule': 'पुनर्निर्धारण सुझाव',

      // Booking
      'book.step': 'चरण',
      'book.of': 'का',
      'book.title1': 'अपना',
      'book.title1_highlight': 'परामर्श बुक करें।',
      'book.title2': 'अपना',
      'book.title2_highlight': 'अस्पताल चुनें।',
      'book.title3': 'एक',
      'book.title3_highlight': 'समय स्लॉट चुनें।',
      'book.desc1': 'पटना में सबसे उपयुक्त चिकित्सा विशेषज्ञ खोजने के लिए अपनी स्वास्थ्य आवश्यकताएं और स्थान चुनें।',
      'book.desc2': 'आपकी विशेषज्ञता से मिलते-जुलते शीर्ष अस्पतालों में से चुनें।',
      'book.desc3': 'अपनी अप्वाइंटमेंट के लिए सुविधाजनक समय चुनें।',
      'book.select_specialty': 'विशेषज्ञता चुनें',
      'book.district': 'ज़िला',
      'book.block': 'ब्लॉक / सर्कल',
      'book.panchayat': 'पंचायत / वार्ड नंबर',
      'book.panchayat_placeholder': 'अपनी पंचायत या वार्ड खोजें...',
      'book.smart_match': 'स्मार्ट मैच सक्रिय',
      'book.smart_desc': 'हम आपके चयनित पटना वार्ड के 5km के भीतर उपलब्ध विशेषज्ञों को प्राथमिकता देंगे।',
      'book.find_doctors': 'उपलब्ध डॉक्टर खोजें',
      'book.select_time': 'समय स्लॉट चुनें',
      'book.confirm': 'बुकिंग कन्फ़र्म करें',
      'book.back': 'वापस',
      'book.available_slots': 'उपलब्ध स्लॉट',
      'book.ayushman_note': 'आयुष्मान कार्ड धारकों के लिए कोई परामर्श शुल्क नहीं।',

      // Vault
      'vault.title': 'मेडिकल वॉल्ट',
      'vault.subtitle': 'आपके सभी क्लीनिकल रिकॉर्ड्स का सुरक्षित डिजिटल ठिकाना।',
      'vault.search_placeholder': 'डॉक्टर या अस्पताल से रिपोर्ट खोजें...',
      'vault.date_range': 'तारीख़ रेंज',
      'vault.recent': 'हालिया रिकॉर्ड',
      'vault.recent_desc': 'आपके नवीनतम मेडिकल अपडेट',
      'vault.view_history': 'इतिहास देखें',
      'vault.upload_new': 'नया अपलोड',
      'vault.upload_desc': 'दस्तावेज़ स्कैन या अपलोड करें',
      'vault.files_found': 'फ़ाइलें मिलीं',
      'vault.upload_pdf': 'PDF अपलोड करें',
      'vault.upload_photo': 'फ़ोटो लें',
      'vault.share_wa': 'WhatsApp पर शेयर करें',

      // Emergency
      'sos.title': 'तत्काल सहायता',
      'sos.ambulance_name': 'पटना एम्बुलेंस सेवा',
      'sos.tap_call': 'कॉल करने के लिए टैप करें',
      'sos.current': 'वर्तमान',
      'sos.live_gps': 'लाइव GPS',
      'sos.er_title': 'निकटतम ER उपलब्धता',
      'sos.updated': 'अपडेट: 1 मिनट पहले',
      'sos.blood_banks': 'ब्लड बैंक संपर्क',
      'sos.viewing_assets': 'निकटतम संसाधन देख रहे हैं',

      // Ayushman
      'abha.govt_cert': 'सरकार प्रमाणित',
      'abha.title': 'आयुष्मान भारत हेल्थ अकाउंट',
      'abha.desc': 'भारत भर में डिजिटल स्वास्थ्य यात्रा के लिए आपकी सार्वभौमिक स्वास्थ्य पहचान।',
      'abha.id_title': 'ABHA ID',
      'abha.digital_health': 'डिजिटल हेल्थ अकाउंट',
      'abha.health_id_num': 'हेल्थ ID नंबर',
      'abha.account_holder': 'खाताधारक',
      'abha.golden_card': 'गोल्डन कार्ड',
      'abha.pmjay': 'PM-JAY नामांकन',
      'abha.app_ref': 'आवेदन संदर्भ',
      'abha.track_status': 'स्थिति ट्रैक करें',
      'abha.panchayat_benefits': 'पंचायत स्तर के लाभ',
      'abha.free_screenings': 'नि:शुल्क जांच',
      'abha.free_screenings_desc': 'हर मंगलवार आपके स्थानीय ग्राम पंचायत भवन में साप्ताहिक जांच।',
      'abha.medicine_kit': 'दवा किट',
      'abha.medicine_kit_desc': 'सभी गोल्डन कार्ड धारकों को मासिक आवश्यक दवाइयां।',
      'abha.priority108': '108 प्राथमिकता',
      'abha.priority108_desc': 'ग्रामीण कार्ड धारकों के लिए समर्पित आपातकालीन परिवहन प्राथमिकता।',
      'abha.asha_support': 'आशा सहायता',
      'abha.asha_support_desc': 'आपकी स्थानीय आशा कार्यकर्ता के माध्यम से सीधा घर-घर समन्वय।',
      'abha.how_it_works': 'कैसे काम करता है',
      'abha.step1_title': 'ABHA बनाएं',
      'abha.step1_desc': 'अपने आधार या मोबाइल को लिंक करके अपनी अद्वितीय डिजिटल पहचान बनाएं।',
      'abha.step2_title': 'केंद्र पर सत्यापन',
      'abha.step2_desc': 'e-KYC और गोल्डन कार्ड पात्रता के लिए निकटतम आरोग्य केंद्र जाएं।',
      'abha.step3_title': 'लाभ प्राप्त करें',
      'abha.step3_desc': 'माध्यमिक और तृतीयक देखभाल के लिए प्रति वर्ष ₹5 लाख कवरेज।',
      'abha.need_help': 'सहायता चाहिए?',
      'abha.helpline': '24/7 PM-JAY हेल्पलाइन: 14555',
      'abha.contact_nha': 'NHA से संपर्क',

      // Common
      'common.patna_bihar': 'पटना, बिहार',
      'common.verified': 'सत्यापित रोगी',
      'common.language': 'English',
      'common.logout': 'लॉगआउट',
    }
  };

  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'en';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    listeners.forEach(fn => fn(lang));
  }

  function toggle() {
    const next = getLang() === 'en' ? 'hi' : 'en';
    setLang(next);
    return next;
  }

  function t(key) {
    const lang = getLang();
    return translations[lang]?.[key] || translations.en?.[key] || key;
  }

  function subscribe(fn) { listeners.push(fn); }
  function isHindi() { return getLang() === 'hi'; }

  return { getLang, setLang, toggle, t, subscribe, isHindi };
})();

export default I18nService;
