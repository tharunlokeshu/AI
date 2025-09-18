import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      heroTitle: "Grow Smarter with AI",
      heroSubtitle: "Personalized crop advice, plans, and market insights for farmers",
      getStarted: "Get Started",
      home: "Home",
      features: "Features",
      about: "About",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      selectLanguage: "Select Language",
      welcomeBack: "Welcome Back",
      signInToAccount: "Sign in to your Smart Crop Advisory account",
      email: "Email",
      password: "Password",
      enterYourEmail: "Enter your email",
      enterYourPassword: "Enter your password",
      signIn: "Sign In",
      signingIn: "Signing in...",
      dontHaveAccount: "Don't have an account?",
      loginSuccess: "Login successful!",
      loginFailed: "Login failed. Please try again.",
      smartCropAdvisory: "Smart Crop Advisory",
      logout: "Logout",
      welcomeToFarmDashboard: "Welcome to Your Farm Dashboard",
      chooseComprehensiveServices: "Choose from our comprehensive agricultural services to optimize your farming operations",
      cropAdvisory: "Crop Advisory",
      getAiPoweredRecommendations: "Get AI-powered crop recommendations based on your farm conditions",
      accessService: "Access Service",
      cropPlan: "Crop Plan",
      createDetailedPlans: "Create detailed farming plans with step-by-step guidance",
      localMarketVendorDetails: "Local Market & Vendor Details",
      findNearbyMandis: "Find nearby mandis and vendors with current prices",
      governmentOrganizations: "Government Organizations",
      connectWithRythuBharosa: "Connect with Rythu Bharosa Kendras and agricultural offices",
      bankLoanSchemes: "Bank Loan Schemes",
      exploreAgriculturalLoans: "Explore agricultural loan schemes and financing options",
      cropDiseaseDetection: "Crop Disease Detection",
      uploadImagesDetectDiseases: "Upload crop images to detect diseases and get treatment advice",
      backToDashboard: "Back to Dashboard",
      aiPoweredRecommendations: "AI-Powered Crop Recommendations",
      basedOnSoilClimate: "Based on your soil type, climate conditions, and farming preferences",
      highlySuitable: "Highly Suitable",
      verySuitable: "Very Suitable",
      suitable: "Suitable",
      expectedProfitPerAcre: "Expected Profit per Acre",
      growingPeriod: "Growing Period",
      marketDemand: "Market Demand",
      high: "High",
      whyThisCropRecommended: "Why this crop is recommended:",
      createFarmingPlan: "Create Farming Plan for",
      selectCrop: "Select Crop",
      selected: "Selected",
      createFarmingPlanBtn: "Create Farming Plan",
      pleaseFillFarmDetailsFirst: "Please fill your farm details first",
      loading: "Loading",
      noRecommendations: "No recommendations available",
      suitabilityUnknown: "Suitability Unknown",
      investmentUnknown: "Unknown",
      profitUnknown: "Unknown",
      requiredInvestment: "Required Investment",
      expectedProfit: "Expected Profit",
      suitability: "Suitability",
      marketDemandHigh: "High",
    }
  },
  hi: {
    translation: {
      heroTitle: "AI के साथ स्मार्ट तरीके से बढ़ें",
      heroSubtitle: "किसानों के लिए व्यक्तिगत फसल सलाह, योजनाएं और बाजार अंतर्दृष्टि",
      getStarted: "शुरू करें",
      home: "होम",
      features: "सुविधाएं",
      about: "हमारे बारे में",
      contact: "संपर्क",
      login: "लॉग इन",
      signup: "साइन अप",
      selectLanguage: "भाषा चुनें",
    }
  },
  bn: {
    translation: {
      heroTitle: "AI দিয়ে স্মার্টভাবে বাড়ুন",
      heroSubtitle: "কৃষকদের জন্য ব্যক্তিগত ফসল পরামর্শ, পরিকল্পনা এবং বাজার অন্তর্দৃষ্টি",
      getStarted: "শুরু করুন",
      home: "হোম",
      features: "বৈশিষ্ট্য",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      login: "লগ ইন",
      signup: "সাইন আপ",
      selectLanguage: "ভাষা নির্বাচন করুন",
    }
  },
  te: {
    translation: {
      heroTitle: "AIతో స్మార్ట్‌గా పెరుగు",
      heroSubtitle: "రైతుల కోసం వ్యక్తిగత పంట సలహా, ప్రణాళికలు మరియు మార్కెట్ అంతర్దృష్టులు",
      getStarted: "ప్రారంభించు",
      home: "హోమ్",
      features: "విశేషాలు",
      about: "మా గురించి",
      contact: "సంప్రదించు",
      login: "లాగిన్",
      signup: "సైన్ అప్",
      selectLanguage: "భాష ఎంచుకోండి",
    }
  },
  mr: {
    translation: {
      heroTitle: "AI सोबत स्मार्टपणे वाढा",
      heroSubtitle: "शेतकऱ्यांसाठी वैयक्तिक पिक सल्ला, योजना आणि बाजार अंतर्दृष्टी",
      getStarted: "सुरू करा",
      home: "होम",
      features: "वैशिष्ट्ये",
      about: "आमच्याबद्दल",
      contact: "संपर्क",
      login: "लॉग इन",
      signup: "साइन अप",
      selectLanguage: "भाषा निवडा",
    }
  },
  ta: {
    translation: {
      heroTitle: "AI உடன் புத்திசாலித்தனமாக வளருங்கள்",
      heroSubtitle: "விவசாயிகளுக்கு தனிப்பட்ட பயிர் ஆலோசனை, திட்டங்கள் மற்றும் சந்தை நுண்ணறிவு",
      getStarted: "தொடங்கு",
      home: "ஹோம்",
      features: "அம்சங்கள்",
      about: "எங்களைப் பற்றி",
      contact: "தொடர்பு",
      login: "உள்நுழை",
      signup: "பதிவு செய்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    }
  },
  ur: {
    translation: {
      heroTitle: "AI کے ساتھ سمارٹ طریقے سے بڑھیں",
      heroSubtitle: "کسانوں کے لیے ذاتی فصل مشورہ، منصوبے اور مارکیٹ بصیرت",
      getStarted: "شروع کریں",
      home: "ہوم",
      features: "خصوصیات",
      about: "ہمارے بارے میں",
      contact: "رابطہ",
      login: "لاگ ان",
      signup: "سائن اپ",
      selectLanguage: "زبان منتخب کریں",
    }
  },
  gu: {
    translation: {
      heroTitle: "AI સાથે સ્માર્ટ રીતે વધો",
      heroSubtitle: "ખેડૂતો માટે વ્યક્તિગત પાક સલાહ, યોજનાઓ અને બજાર આંતરદૃષ્ટિ",
      getStarted: "શરૂ કરો",
      home: "હોમ",
      features: "લક્ષણો",
      about: "અમારા વિશે",
      contact: "સંપર્ક",
      login: "લૉગ ઇન",
      signup: "સાઇન અપ",
      selectLanguage: "ભાષા પસંદ કરો",
    }
  },
  kn: {
    translation: {
      heroTitle: "AI ಜೊತೆಗೆ ಸ್ಮಾರ್ಟ್ ಆಗಿ ಬೆಳೆಯಿರಿ",
      heroSubtitle: "ರೈತರಿಗೆ ವೈಯಕ್ತಿಕ ಬೆಳೆ ಸಲಹೆ, ಯೋಜನೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ",
      home: "ಹೋಮ್",
      features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
      about: "ನಮ್ಮ ಬಗ್ಗೆ",
      contact: "ಸಂಪರ್ಕ",
      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    }
  },
  or: {
    translation: {
      heroTitle: "AI ସହିତ ସ୍ମାର୍ଟ ଭାବରେ ବଢନ୍ତୁ",
      heroSubtitle: "ଚାଷୀମାନଙ୍କ ପାଇଁ ବ୍ୟକ୍ତିଗତ ଫସଲ ପରାମର୍ଶ, ଯୋଜନା ଏବଂ ବଜାର ଅନ୍ତର୍ଦୃଷ୍ଟି",
      getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
      home: "ହୋମ୍",
      features: "ବୈଶିଷ୍ଟ୍ୟ",
      about: "ଆମ ବିଷୟରେ",
      contact: "ଯୋଗାଯୋଗ",
      login: "ଲଗଇନ୍",
      signup: "ସାଇନ୍ ଅପ୍",
      selectLanguage: "ଭାଷା ଚୟନ କରନ୍ତୁ",
    }
  },
  ml: {
    translation: {
      heroTitle: "AI ഉടൻ സ്മാർട്ടായി വളരുക",
      heroSubtitle: "കർഷകർക്ക് വ്യക്തിഗത വിള സൽക്ഷണം, പദ്ധതികൾ, മാർക്കറ്റ് ഉൾക്കാഴ്ചകൾ",
      getStarted: "ആരംഭിക്കുക",
      home: "ഹോം",
      features: "സവിശേഷതകൾ",
      about: "ഞങ്ങളെക്കുറിച്ച്",
      contact: "ബന്ധപ്പെടുക",
      login: "ലോഗിൻ",
      signup: "സൈൻ അപ്പ്",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    }
  },
  pa: {
    translation: {
      heroTitle: "AI ਨਾਲ ਸਮਾਰਟ ਤਰੀਕੇ ਨਾਲ ਵਧੋ",
      heroSubtitle: "ਕਿਸਾਨਾਂ ਲਈ ਨਿੱਜੀ ਫਸਲ ਸਲਾਹ, ਯੋਜਨਾਵਾਂ ਅਤੇ ਮਾਰਕੀਟ ਦੀਆਂ ਸੂਝ",
      getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
      home: "ਹੋਮ",
      features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      about: "ਸਾਡੇ ਬਾਰੇ",
      contact: "ਸੰਪਰਕ",
      login: "ਲੌਗ ਇਨ",
      signup: "ਸਾਈਨ ਅੱਪ",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
