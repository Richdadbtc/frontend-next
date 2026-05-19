'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const SUPPORTED_LANGS = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'th', label: 'ไทย' },
  { code: 'ko', label: '한국어' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'pl', label: 'Polski' },
  { code: 'vi', label: 'Tiếng Việt' },
];

const STORAGE_KEY = 'av_lang';

const MESSAGES = {
  en: {
    nav_language: 'Language',
    nav_home: 'Home',
    nav_why: 'Why Gold?',
    nav_how: 'How It Works',
    nav_pricing: 'Pricing',
    nav_security: 'Security',
    nav_faq: 'FAQ',
    nav_sign_in: 'Sign In',
    nav_get_started: 'Get Started',

    label_email: 'Email',
    label_password: 'Password',

    action_show: 'Show',
    action_hide: 'Hide',
    action_sign_in: 'Sign In',
    action_create_one: 'Create one',

    err_email_required: 'Email address is required',
    err_email_invalid: 'Please enter a valid email address',
    err_password_required: 'Password is required',
    err_password_min_6: 'Password must be at least 6 characters',
    err_unable_to_sign_in: 'Unable to sign in',
    err_network_try_again: 'Network error. Please try again.',

    login_title: 'Welcome back',
    login_subtitle: 'Sign in to view your vault and manage your gold.',
    login_signing_in: 'Signing in…',
    login_no_account: 'Don’t have an account?',
    login_success_redirect: 'Signed in successfully! Redirecting…',

    quote_gold_money: '“Gold is money. Everything else is credit.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Real gold. Allocated. Insured.',
    hero_title_1: 'The asset that',
    hero_title_2: 'built',
    hero_title_3: 'empires,',
    hero_title_4: 'now builds yours',
    hero_sub_1: 'Pharaohs stacked it. Central banks hoard it.',
    hero_sub_2: 'Own real gold from $1,000 — tracked by serial number, stored in a certified vault.',
    hero_cta_primary: 'Start buying gold',
    hero_cta_secondary: 'See how it works',
  },
  pt: {
    nav_language: 'Idioma',
    nav_home: 'Início',
    nav_why: 'Por que ouro?',
    nav_how: 'Como funciona',
    nav_pricing: 'Preços',
    nav_security: 'Segurança',
    nav_faq: 'FAQ',
    nav_sign_in: 'Entrar',
    nav_get_started: 'Começar',

    label_email: 'E-mail',
    label_password: 'Senha',

    action_show: 'Mostrar',
    action_hide: 'Ocultar',
    action_sign_in: 'Entrar',
    action_create_one: 'Criar conta',

    err_email_required: 'O e-mail é obrigatório',
    err_email_invalid: 'Digite um e-mail válido',
    err_password_required: 'A senha é obrigatória',
    err_password_min_6: 'A senha deve ter pelo menos 6 caracteres',
    err_unable_to_sign_in: 'Não foi possível entrar',
    err_network_try_again: 'Erro de rede. Tente novamente.',

    login_title: 'Bem-vindo de volta',
    login_subtitle: 'Entre para ver seu cofre e gerenciar seu ouro.',
    login_signing_in: 'Entrando…',
    login_no_account: 'Não tem uma conta?',
    login_success_redirect: 'Login efetuado! Redirecionando…',

    quote_gold_money: '“O ouro é dinheiro. Todo o resto é crédito.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Ouro real. Alocado. Segurado.',
    hero_title_1: 'O ativo que',
    hero_title_2: 'construiu',
    hero_title_3: 'impérios,',
    hero_title_4: 'agora constrói o seu',
    hero_sub_1: 'Faraós acumularam. Bancos centrais guardam.',
    hero_sub_2: 'Tenha ouro real a partir de US$ 1.000 — rastreado por número de série, guardado em um cofre certificado.',
    hero_cta_primary: 'Começar a comprar ouro',
    hero_cta_secondary: 'Veja como funciona',
  },
  es: {
    nav_language: 'Idioma',
    nav_home: 'Inicio',
    nav_why: '¿Por qué oro?',
    nav_how: 'Cómo funciona',
    nav_pricing: 'Precios',
    nav_security: 'Seguridad',
    nav_faq: 'FAQ',
    nav_sign_in: 'Iniciar sesión',
    nav_get_started: 'Empezar',

    label_email: 'Correo electrónico',
    label_password: 'Contraseña',

    action_show: 'Mostrar',
    action_hide: 'Ocultar',
    action_sign_in: 'Iniciar sesión',
    action_create_one: 'Crear una',

    err_email_required: 'El correo electrónico es obligatorio',
    err_email_invalid: 'Introduce un correo electrónico válido',
    err_password_required: 'La contraseña es obligatoria',
    err_password_min_6: 'La contraseña debe tener al menos 6 caracteres',
    err_unable_to_sign_in: 'No se pudo iniciar sesión',
    err_network_try_again: 'Error de red. Inténtalo de nuevo.',

    login_title: 'Bienvenido de nuevo',
    login_subtitle: 'Inicia sesión para ver tu bóveda y gestionar tu oro.',
    login_signing_in: 'Iniciando sesión…',
    login_no_account: '¿No tienes una cuenta?',
    login_success_redirect: '¡Inicio de sesión correcto! Redirigiendo…',

    quote_gold_money: '“El oro es dinero. Todo lo demás es crédito.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Oro real. Asignado. Asegurado.',
    hero_title_1: 'El activo que',
    hero_title_2: 'construyó',
    hero_title_3: 'imperios,',
    hero_title_4: 'ahora construye el tuyo',
    hero_sub_1: 'Los faraones lo acumulaban. Los bancos centrales lo atesoran.',
    hero_sub_2: 'Posee oro real desde $1,000 — rastreado por número de serie, almacenado en una bóveda certificada.',
    hero_cta_primary: 'Empieza a comprar oro',
    hero_cta_secondary: 'Ver cómo funciona',
  },
  zh: {
    nav_language: '语言',
    nav_home: '首页',
    nav_why: '为什么选择黄金？',
    nav_how: '如何运作',
    nav_pricing: '定价',
    nav_security: '安全',
    nav_faq: '常见问题',
    nav_sign_in: '登录',
    nav_get_started: '开始使用',

    label_email: '邮箱',
    label_password: '密码',

    action_show: '显示',
    action_hide: '隐藏',
    action_sign_in: '登录',
    action_create_one: '创建账号',

    err_email_required: '请输入邮箱地址',
    err_email_invalid: '请输入有效的邮箱地址',
    err_password_required: '请输入密码',
    err_password_min_6: '密码至少需要 6 个字符',
    err_unable_to_sign_in: '无法登录',
    err_network_try_again: '网络错误，请重试。',

    login_title: '欢迎回来',
    login_subtitle: '登录以查看你的金库并管理黄金。',
    login_signing_in: '正在登录…',
    login_no_account: '还没有账号？',
    login_success_redirect: '登录成功！正在跳转…',

    quote_gold_money: '“黄金才是真正的货币，其它皆为信用。”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: '真实黄金。分配到位。已投保。',
    hero_title_1: '打造',
    hero_title_2: '帝国',
    hero_title_3: '的资产，',
    hero_title_4: '如今也能打造你的未来',
    hero_sub_1: '法老囤积它。央行储备它。',
    hero_sub_2: '从 $1,000 起拥有真实黄金——可追踪序列号，存放于认证金库。',
    hero_cta_primary: '开始购买黄金',
    hero_cta_secondary: '了解如何运作',
  },
  de: {
    nav_language: 'Sprache',
    nav_home: 'Start',
    nav_why: 'Warum Gold?',
    nav_how: 'So funktioniert’s',
    nav_pricing: 'Preise',
    nav_security: 'Sicherheit',
    nav_faq: 'FAQ',
    nav_sign_in: 'Anmelden',
    nav_get_started: 'Loslegen',

    label_email: 'E-Mail',
    label_password: 'Passwort',

    action_show: 'Anzeigen',
    action_hide: 'Ausblenden',
    action_sign_in: 'Anmelden',
    action_create_one: 'Konto erstellen',

    err_email_required: 'E-Mail-Adresse ist erforderlich',
    err_email_invalid: 'Bitte eine gültige E-Mail-Adresse eingeben',
    err_password_required: 'Passwort ist erforderlich',
    err_password_min_6: 'Passwort muss mindestens 6 Zeichen haben',
    err_unable_to_sign_in: 'Anmeldung nicht möglich',
    err_network_try_again: 'Netzwerkfehler. Bitte versuche es erneut.',

    login_title: 'Willkommen zurück',
    login_subtitle: 'Melde dich an, um deinen Tresor zu sehen und dein Gold zu verwalten.',
    login_signing_in: 'Anmelden…',
    login_no_account: 'Noch kein Konto?',
    login_success_redirect: 'Erfolgreich angemeldet! Weiterleitung…',

    quote_gold_money: '„Gold ist Geld. Alles andere ist Kredit.“',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Echtes Gold. Zugeteilt. Versichert.',
    hero_title_1: 'Der Vermögenswert, der',
    hero_title_2: 'Reiche',
    hero_title_3: 'aufbaute,',
    hero_title_4: 'baut jetzt deins',
    hero_sub_1: 'Pharaonen horteten es. Zentralbanken lagern es.',
    hero_sub_2: 'Besitze echtes Gold ab 1.000 $ — mit Seriennummer nachverfolgbar, in einem zertifizierten Tresor gelagert.',
    hero_cta_primary: 'Mit Goldkauf starten',
    hero_cta_secondary: 'So funktioniert’s',
  },
  fr: {
    nav_language: 'Langue',
    nav_home: 'Accueil',
    nav_why: 'Pourquoi l’or ?',
    nav_how: 'Comment ça marche',
    nav_pricing: 'Tarifs',
    nav_security: 'Sécurité',
    nav_faq: 'FAQ',
    nav_sign_in: 'Se connecter',
    nav_get_started: 'Commencer',

    label_email: 'E-mail',
    label_password: 'Mot de passe',

    action_show: 'Afficher',
    action_hide: 'Masquer',
    action_sign_in: 'Se connecter',
    action_create_one: 'En créer un',

    err_email_required: 'L’adresse e-mail est requise',
    err_email_invalid: 'Veuillez saisir une adresse e-mail valide',
    err_password_required: 'Le mot de passe est requis',
    err_password_min_6: 'Le mot de passe doit contenir au moins 6 caractères',
    err_unable_to_sign_in: 'Impossible de se connecter',
    err_network_try_again: 'Erreur réseau. Veuillez réessayer.',

    login_title: 'Bon retour',
    login_subtitle: 'Connectez-vous pour voir votre coffre et gérer votre or.',
    login_signing_in: 'Connexion…',
    login_no_account: 'Vous n’avez pas de compte ?',
    login_success_redirect: 'Connexion réussie ! Redirection…',

    quote_gold_money: '« L’or est de la monnaie. Tout le reste est du crédit. »',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'De l’or réel. Alloué. Assuré.',
    hero_title_1: 'L’actif qui',
    hero_title_2: 'a bâti',
    hero_title_3: 'des empires,',
    hero_title_4: 'bâtit maintenant le vôtre',
    hero_sub_1: 'Les pharaons l’empilaient. Les banques centrales l’accumulent.',
    hero_sub_2: 'Possédez de l’or réel dès 1 000 $ — suivi par numéro de série, stocké dans un coffre certifié.',
    hero_cta_primary: 'Commencer à acheter de l’or',
    hero_cta_secondary: 'Voir comment ça marche',
  },
  th: {
    nav_language: 'ภาษา',
    nav_home: 'หน้าแรก',
    nav_why: 'ทำไมต้องทองคำ?',
    nav_how: 'ทำงานอย่างไร',
    nav_pricing: 'ราคา',
    nav_security: 'ความปลอดภัย',
    nav_faq: 'คำถามที่พบบ่อย',
    nav_sign_in: 'เข้าสู่ระบบ',
    nav_get_started: 'เริ่มต้น',

    label_email: 'อีเมล',
    label_password: 'รหัสผ่าน',

    action_show: 'แสดง',
    action_hide: 'ซ่อน',
    action_sign_in: 'เข้าสู่ระบบ',
    action_create_one: 'สร้างบัญชี',

    err_email_required: 'กรุณากรอกอีเมล',
    err_email_invalid: 'กรุณากรอกอีเมลให้ถูกต้อง',
    err_password_required: 'กรุณากรอกรหัสผ่าน',
    err_password_min_6: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    err_unable_to_sign_in: 'ไม่สามารถเข้าสู่ระบบได้',
    err_network_try_again: 'เครือข่ายมีปัญหา กรุณาลองอีกครั้ง',

    login_title: 'ยินดีต้อนรับกลับ',
    login_subtitle: 'เข้าสู่ระบบเพื่อดูห้องนิรภัยและจัดการทองคำของคุณ',
    login_signing_in: 'กำลังเข้าสู่ระบบ…',
    login_no_account: 'ยังไม่มีบัญชีใช่ไหม?',
    login_success_redirect: 'เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า…',

    quote_gold_money: '“ทองคำคือเงิน ทุกอย่างที่เหลือคือเครดิต”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'ทองคำจริง จัดสรรแล้ว มีประกัน',
    hero_title_1: 'สินทรัพย์ที่',
    hero_title_2: 'สร้าง',
    hero_title_3: 'อาณาจักร,',
    hero_title_4: 'วันนี้สร้างของคุณ',
    hero_sub_1: 'ฟาโรห์สะสม ธนาคารกลางกักตุน',
    hero_sub_2: 'เป็นเจ้าของทองคำจริงเริ่มที่ $1,000 — ติดตามด้วยเลขซีเรียล เก็บในคลังที่ได้รับการรับรอง',
    hero_cta_primary: 'เริ่มซื้อทองคำ',
    hero_cta_secondary: 'ดูวิธีการทำงาน',
  },
  ko: {
    nav_language: '언어',
    nav_home: '홈',
    nav_why: '왜 금인가요?',
    nav_how: '작동 방식',
    nav_pricing: '가격',
    nav_security: '보안',
    nav_faq: 'FAQ',
    nav_sign_in: '로그인',
    nav_get_started: '시작하기',

    label_email: '이메일',
    label_password: '비밀번호',

    action_show: '표시',
    action_hide: '숨기기',
    action_sign_in: '로그인',
    action_create_one: '계정 만들기',

    err_email_required: '이메일 주소를 입력하세요',
    err_email_invalid: '유효한 이메일 주소를 입력하세요',
    err_password_required: '비밀번호를 입력하세요',
    err_password_min_6: '비밀번호는 최소 6자 이상이어야 합니다',
    err_unable_to_sign_in: '로그인할 수 없습니다',
    err_network_try_again: '네트워크 오류입니다. 다시 시도해 주세요.',

    login_title: '다시 오신 것을 환영합니다',
    login_subtitle: '로그인하여 금고를 확인하고 금을 관리하세요.',
    login_signing_in: '로그인 중…',
    login_no_account: '계정이 없으신가요?',
    login_success_redirect: '로그인 성공! 이동 중…',

    quote_gold_money: '“금은 돈이다. 나머지는 모두 신용이다.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: '실물 금. 할당. 보험.',
    hero_title_1: '제국을',
    hero_title_2: '세운',
    hero_title_3: '자산,',
    hero_title_4: '이제 당신의 자산이 됩니다',
    hero_sub_1: '파라오는 쌓았고, 중앙은행은 보유합니다.',
    hero_sub_2: '$1,000부터 실물 금을 소유하세요 — 시리얼 번호로 추적, 인증된 금고에 보관.',
    hero_cta_primary: '금 구매 시작하기',
    hero_cta_secondary: '작동 방식 보기',
  },
  hi: {
    nav_language: 'भाषा',
    nav_home: 'होम',
    nav_why: 'सोना क्यों?',
    nav_how: 'यह कैसे काम करता है',
    nav_pricing: 'मूल्य',
    nav_security: 'सुरक्षा',
    nav_faq: 'FAQ',
    nav_sign_in: 'साइन इन',
    nav_get_started: 'शुरू करें',

    label_email: 'ईमेल',
    label_password: 'पासवर्ड',

    action_show: 'दिखाएँ',
    action_hide: 'छिपाएँ',
    action_sign_in: 'साइन इन',
    action_create_one: 'खाता बनाएं',

    err_email_required: 'ईमेल आवश्यक है',
    err_email_invalid: 'कृपया मान्य ईमेल दर्ज करें',
    err_password_required: 'पासवर्ड आवश्यक है',
    err_password_min_6: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    err_unable_to_sign_in: 'साइन इन नहीं हो सका',
    err_network_try_again: 'नेटवर्क त्रुटि। कृपया फिर से प्रयास करें।',

    login_title: 'फिर से स्वागत है',
    login_subtitle: 'अपना वॉल्ट देखने और सोना प्रबंधित करने के लिए साइन इन करें।',
    login_signing_in: 'साइन इन हो रहा है…',
    login_no_account: 'खाता नहीं है?',
    login_success_redirect: 'साइन इन सफल! रीडायरेक्ट हो रहा है…',

    quote_gold_money: '“सोना पैसा है। बाकी सब क्रेडिट है।”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'असली सोना। आवंटित। बीमाकृत।',
    hero_title_1: 'वह संपत्ति जिसने',
    hero_title_2: 'साम्राज्य',
    hero_title_3: 'बनाए,',
    hero_title_4: 'अब आपका बनाती है',
    hero_sub_1: 'फ़राओ ने इसे जमा किया। केंद्रीय बैंक इसे रखते हैं।',
    hero_sub_2: '$1,000 से असली सोना खरीदें — सीरियल नंबर से ट्रैक, प्रमाणित वॉल्ट में सुरक्षित।',
    hero_cta_primary: 'सोना खरीदना शुरू करें',
    hero_cta_secondary: 'देखें कैसे काम करता है',
  },
  el: {
    nav_language: 'Γλώσσα',
    nav_home: 'Αρχική',
    nav_why: 'Γιατί χρυσός;',
    nav_how: 'Πώς λειτουργεί',
    nav_pricing: 'Τιμολόγηση',
    nav_security: 'Ασφάλεια',
    nav_faq: 'Συχνές ερωτήσεις',
    nav_sign_in: 'Σύνδεση',
    nav_get_started: 'Ξεκινήστε',

    label_email: 'Email',
    label_password: 'Κωδικός πρόσβασης',

    action_show: 'Εμφάνιση',
    action_hide: 'Απόκρυψη',
    action_sign_in: 'Σύνδεση',
    action_create_one: 'Δημιουργία',

    err_email_required: 'Απαιτείται email',
    err_email_invalid: 'Παρακαλώ εισάγετε έγκυρο email',
    err_password_required: 'Απαιτείται κωδικός',
    err_password_min_6: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες',
    err_unable_to_sign_in: 'Αδυναμία σύνδεσης',
    err_network_try_again: 'Σφάλμα δικτύου. Δοκιμάστε ξανά.',

    login_title: 'Καλώς ήρθατε ξανά',
    login_subtitle: 'Συνδεθείτε για να δείτε το θησαυροφυλάκιό σας και να διαχειριστείτε τον χρυσό σας.',
    login_signing_in: 'Σύνδεση…',
    login_no_account: 'Δεν έχετε λογαριασμό;',
    login_success_redirect: 'Επιτυχής σύνδεση! Ανακατεύθυνση…',

    quote_gold_money: '«Ο χρυσός είναι χρήμα. Όλα τα άλλα είναι πίστωση.»',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Αληθινός χρυσός. Κατανεμημένος. Ασφαλισμένος.',
    hero_title_1: 'Το περιουσιακό στοιχείο που',
    hero_title_2: 'έχτισε',
    hero_title_3: 'αυτοκρατορίες,',
    hero_title_4: 'τώρα χτίζει τη δική σας',
    hero_sub_1: 'Οι Φαραώ τον στοίβαζαν. Οι κεντρικές τράπεζες τον αποθησαυρίζουν.',
    hero_sub_2: 'Αποκτήστε πραγματικό χρυσό από $1,000 — με σειριακό αριθμό, σε πιστοποιημένο θησαυροφυλάκιο.',
    hero_cta_primary: 'Ξεκινήστε να αγοράζετε χρυσό',
    hero_cta_secondary: 'Δείτε πώς λειτουργεί',
  },
  pl: {
    nav_language: 'Język',
    nav_home: 'Strona główna',
    nav_why: 'Dlaczego złoto?',
    nav_how: 'Jak to działa',
    nav_pricing: 'Cennik',
    nav_security: 'Bezpieczeństwo',
    nav_faq: 'FAQ',
    nav_sign_in: 'Zaloguj',
    nav_get_started: 'Zacznij',

    label_email: 'E-mail',
    label_password: 'Hasło',

    action_show: 'Pokaż',
    action_hide: 'Ukryj',
    action_sign_in: 'Zaloguj',
    action_create_one: 'Utwórz konto',

    err_email_required: 'Adres e-mail jest wymagany',
    err_email_invalid: 'Wpisz poprawny adres e-mail',
    err_password_required: 'Hasło jest wymagane',
    err_password_min_6: 'Hasło musi mieć co najmniej 6 znaków',
    err_unable_to_sign_in: 'Nie można się zalogować',
    err_network_try_again: 'Błąd sieci. Spróbuj ponownie.',

    login_title: 'Witaj ponownie',
    login_subtitle: 'Zaloguj się, aby zobaczyć swój skarbiec i zarządzać złotem.',
    login_signing_in: 'Logowanie…',
    login_no_account: 'Nie masz konta?',
    login_success_redirect: 'Zalogowano! Przekierowanie…',

    quote_gold_money: '„Złoto to pieniądz. Reszta to kredyt.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Prawdziwe złoto. Przydzielone. Ubezpieczone.',
    hero_title_1: 'Aktywum, które',
    hero_title_2: 'budowało',
    hero_title_3: 'imperia,',
    hero_title_4: 'teraz buduje Twoje',
    hero_sub_1: 'Faraonowie je gromadzili. Banki centralne je przechowują.',
    hero_sub_2: 'Posiadaj prawdziwe złoto od $1,000 — śledzone numerem seryjnym, przechowywane w certyfikowanym skarbcu.',
    hero_cta_primary: 'Zacznij kupować złoto',
    hero_cta_secondary: 'Zobacz jak to działa',
  },
  vi: {
    nav_language: 'Ngôn ngữ',
    nav_home: 'Trang chủ',
    nav_why: 'Vì sao vàng?',
    nav_how: 'Cách hoạt động',
    nav_pricing: 'Giá',
    nav_security: 'Bảo mật',
    nav_faq: 'FAQ',
    nav_sign_in: 'Đăng nhập',
    nav_get_started: 'Bắt đầu',

    label_email: 'Email',
    label_password: 'Mật khẩu',

    action_show: 'Hiện',
    action_hide: 'Ẩn',
    action_sign_in: 'Đăng nhập',
    action_create_one: 'Tạo tài khoản',

    err_email_required: 'Email là bắt buộc',
    err_email_invalid: 'Vui lòng nhập email hợp lệ',
    err_password_required: 'Mật khẩu là bắt buộc',
    err_password_min_6: 'Mật khẩu phải có ít nhất 6 ký tự',
    err_unable_to_sign_in: 'Không thể đăng nhập',
    err_network_try_again: 'Lỗi mạng. Vui lòng thử lại.',

    login_title: 'Chào mừng bạn quay lại',
    login_subtitle: 'Đăng nhập để xem kho và quản lý vàng của bạn.',
    login_signing_in: 'Đang đăng nhập…',
    login_no_account: 'Chưa có tài khoản?',
    login_success_redirect: 'Đăng nhập thành công! Đang chuyển hướng…',

    quote_gold_money: '“Vàng là tiền. Mọi thứ khác là tín dụng.”',
    quote_jp_morgan: '— J.P. Morgan',

    hero_eyebrow: 'Vàng thật. Được phân bổ. Có bảo hiểm.',
    hero_title_1: 'Tài sản đã',
    hero_title_2: 'xây',
    hero_title_3: 'nên đế chế,',
    hero_title_4: 'giờ xây dựng của bạn',
    hero_sub_1: 'Pharaoh tích trữ. Ngân hàng trung ương nắm giữ.',
    hero_sub_2: 'Sở hữu vàng thật từ $1,000 — theo dõi bằng số seri, lưu trữ trong kho được chứng nhận.',
    hero_cta_primary: 'Bắt đầu mua vàng',
    hero_cta_secondary: 'Xem cách hoạt động',
  },
};

function normalizeLang(code) {
  const c = String(code || '').trim().toLowerCase();
  return SUPPORTED_LANGS.some((l) => l.code === c) ? c : 'en';
}

const I18nContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLangState(normalizeLang(stored));
    } catch {}
  }, []);

  const setLang = (next) => {
    const n = normalizeLang(next);
    setLangState(n);
    try { window.localStorage.setItem(STORAGE_KEY, n); } catch {}
  };

  const t = (key) => {
    const k = String(key || '');
    return MESSAGES[lang]?.[k] || MESSAGES.en?.[k] || k;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
