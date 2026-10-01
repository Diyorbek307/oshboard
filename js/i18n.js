/* ============================================================
   OSHBOARD — интернационализация (RU по умолчанию, UZ, EN).
   Перевод хранится по исходной русской строке: T["<ru>"] = ["<uz>", "<en>"].
   Меняются только текстовые узлы — иконки и разметка не трогаются.
   Строки без перевода остаются на русском (безопасный фолбэк).
   ============================================================ */
(function () {
  'use strict';

  var LANGS = ['ru', 'uz', 'en'];
  var KEY = 'oshboard-lang';

  var T = {
    "Виды дела": ["Ish turlari","Business types"],
    "Возможности": ["Imkoniyatlar","Features"],
    "Гид": ["Gid","Guide"],
    "Тарифы": ["Tariflar","Pricing"],
    "Вопросы": ["Savollar","FAQ"],
    "Получить демо": ["Demo olish","Get a demo"],
    "Сделано в Самарканде": ["Samarqandda yaratilgan","Made in Samarkand"],
    "Всё ваше дело —": ["Butun ishingiz —","Your whole business —"],
    "в одной программе": ["bitta dasturda","in one app"],
    "OSHBOARD ведёт кассу, склад, сотрудников, зарплаты и отчёты. Четыре готовых уклада: ресторан и кафе, магазин и аптека, гостиница, клининговая компания.": ["OSHBOARD kassa, ombor, xodimlar, ish haqi va hisobotlarni yuritadi. Toʻrtta tayyor yoʻnalish: restoran va kafe, doʻkon va dorixona, mehmonxona, klining kompaniyasi.","OSHBOARD runs your till, stock, staff, payroll and reports. Four ready-made setups: restaurant and café, shop and pharmacy, hotel, cleaning company."],
    "Смотреть, что умеет": ["Nimalar qila olishini koʻrish","See what it does"],
    "Касса работает без интернета": ["Kassa internetsiz ishlaydi","The till works without internet"],
    "Русский, узбекский, английский": ["Rus, oʻzbek, ingliz tillari","Russian, Uzbek, English"],
    "Телефон, планшет и Windows": ["Telefon, planshet va Windows","Phone, tablet and Windows"],
    "Итог дня": ["Kun yakuni","Day summary"],
    "Выручка": ["Tushum","Revenue"],
    "Чеков": ["Cheklar","Receipts"],
    "Средний чек": ["O‘rtacha chek","Average check"],
    "Выручка по часам": ["Soatlar boʻyicha tushum","Revenue by hour"],
    "Себестоимость проданного": ["Sotilgan mahsulot tannarxi","Cost of goods sold"],
    "Расходы": ["Xarajatlar","Expenses"],
    "Зарплаты": ["Ish haqi","Wages"],
    "Чистая прибыль": ["Sof foyda","Net profit"],
    "Интернет пропал": ["Internet uzildi","Internet is down"],
    "касса работает, 3 чека ждут связи": ["kassa ishlayapti, 3 ta chek aloqani kutmoqda","the till keeps working, 3 receipts waiting to sync"],
    "Новая бронь из гида": ["Giddan yangi bron","New booking from the guide"],
    "Стандарт · 2 ночи": ["Standart · 2 kecha","Standard · 2 nights"],
    "Рестораны": ["Restoranlar","Restaurants"],
    "Кофейни": ["Qahvaxonalar","Coffee shops"],
    "Чайханы": ["Choyxonalar","Teahouses"],
    "Фастфуд": ["Fastfud","Fast food"],
    "Продуктовые": ["Oziq-ovqat doʻkonlari","Grocery shops"],
    "Аптеки": ["Dorixonalar","Pharmacies"],
    "Одежда": ["Kiyim doʻkonlari","Clothing shops"],
    "Стройматериалы": ["Qurilish mollari","Hardware store"],
    "Гостиницы": ["Mehmonxonalar","Hotels"],
    "Хостелы": ["Hostellar","Hostels"],
    "Клининг": ["Klining","Cleaning"],
    "Проблема": ["Muammo","The problem"],
    "Деньги уходят там, куда не смотрят": ["Pul eʼtibor berilmagan joydan ketadi","Money leaves where nobody looks"],
    "Пока учёт лежит в тетради и в голове, решения принимаются на ощупь. И беда не в том, что цифр нет совсем, — беда в том, что они есть, но неверные.": ["Hisob daftarda va boshda turar ekan, qarorlar paypaslab qabul qilinadi. Yomoni raqamlar yoʻqligida emas — yomoni ular bor, lekin notoʻgʻri.","While the books live in a notebook and in your head, decisions are made by feel. The trouble is not that there are no numbers — the trouble is that there are, and they are wrong."],
    "Наценка вместо прибыли": ["Foyda oʻrniga ustama","Markup instead of profit"],
    "Кажется, что заработали": ["Ishlab topganday koʻrinadi","It looks like you earned"],
    "Касса показывает выручку минус закупку и называет это прибылью. Аренда, свет и зарплаты в счёт не идут — и месяц, закрытый в минус, выглядит удачным.": ["Kassa tushumdan xaridni ayirib, buni foyda deb ataydi. Ijara, chiroq va ish haqi hisobga kirmaydi — va zarar bilan yopilgan oy muvaffaqiyatli koʻrinadi.","The register shows revenue minus purchases and calls it profit. Rent, electricity and wages are not counted — and a month closed at a loss looks like a good one."],
    "Остатки только на бумаге": ["Qoldiqlar faqat qogʻozda","Stock only on paper"],
    "Кажется, что товар есть": ["Tovar borday koʻrinadi","It looks like the goods are there"],
    "Продали, но не списали; списали, но не записали. К инвентаризации сходится далеко не всё, а разницу списывают на «усушку».": ["Sotildi — hisobdan chiqarilmadi; chiqarildi — yozilmadi. Inventarizatsiyada hammasi ham toʻgʻri kelmaydi, farqni esa «qurib qolgan» deb yozib qoʻyishadi.","Sold but not written off; written off but not recorded. At stocktaking far from everything adds up, and the gap is blamed on “shrinkage”."],
    "Зарплаты в отдельной тетради": ["Ish haqi alohida daftarda","Payroll in a separate notebook"],
    "Кажется, что расходы известны": ["Xarajatlar maʼlumday koʻrinadi","It looks like you know your costs"],
    "Людям платят каждый месяц, а в отчёте этих денег нет. Самая большая трата фирмы оказывается единственной, которую никто не считает.": ["Odamlarga har oy toʻlanadi, hisobotda esa bu pul yoʻq. Firmaning eng katta xarajati hech kim sanamaydigan yagona xarajat boʻlib chiqadi.","People are paid every month, yet that money is missing from the report. The firm's biggest cost turns out to be the only one nobody counts."],
    "Четыре уклада": ["Toʻrtta yoʻnalish","Four setups"],
    "Одна программа, но говорит на языке вашего дела": ["Bitta dastur, lekin sizning ishingiz tilida gapiradi","One program that speaks the language of your trade"],
    "При заведении вы выбираете вид дела — и программа перестраивается целиком: разделы, слова, отчёты и даже названия должностей.": ["Muassasa qoʻshishda ish turini tanlaysiz — va dastur butunlay moslashadi: boʻlimlar, soʻzlar, hisobotlar va hatto lavozim nomlari ham.","When you add a business you pick its type — and the whole app adapts: sections, wording, reports and even job titles."],
    "Ресторан и кафе": ["Restoran va kafe","Restaurant and cafe"],
    "Магазин и аптека": ["Doʻkon va dorixona","Shop and pharmacy"],
    "Гостиница": ["Mehmonxona","Hotel"],
    "Новое": ["Yangi","New"],
    "Ресторан, кафе, чайхана": ["Restoran, kafe, choyxona","Restaurant, café, teahouse"],
    "Зал, кухня и склад связаны между собой. Официант пробил блюдо — повар увидел его на экране, продукты списались по тех-карте, себестоимость попала в отчёт.": ["Zal, oshxona va ombor bir-biriga bogʻlangan. Ofitsiant taomni urdi — oshpaz uni ekranda koʻrdi, mahsulotlar texnologik karta boʻyicha hisobdan chiqdi, tannarx hisobotga tushdi.","The hall, kitchen and stock are linked. A waiter rings up a dish — the cook sees it on screen, ingredients are written off by the recipe card, and the cost lands in the report."],
    "План зала со столами и счетами, разделение чека": ["Stollar va hisoblar bilan zal rejasi, chekni boʻlish","Floor plan with tables and bills, split checks"],
    "Экран кухни: заказы приходят сами, без бумажек": ["Oshxona ekrani: buyurtmalar oʻzi keladi, qogʻozsiz","Kitchen screen: orders arrive by themselves, no paper slips"],
    "Бронь столов и банкеты": ["Stol bron qilish va banketlar","Table bookings and banquets"],
    "QR-меню с фото и онлайн-заказы на доставку и самовывоз": ["Rasmli QR-menyu va yetkazib berish hamda olib ketish uchun onlayn buyurtmalar","QR menu with photos and online orders for delivery and pickup"],
    "Тех-карты: себестоимость каждого блюда по продуктам": ["Texnologik kartalar: har bir taomning mahsulotlar boʻyicha tannarxi","Recipe cards: the cost of every dish by ingredient"],
    "Фудкост: видно, какое блюдо готовить невыгодно": ["Fudkost: qaysi taomni tayyorlash foydasizligi koʻrinadi","Food cost: see which dish isn’t worth cooking"],
    "Склад, списания и инвентаризация": ["Ombor, hisobdan chiqarish va inventarizatsiya","Stock, write-offs and stocktaking"],
    "Кассовая смена с пересчётом денег": ["Pulni qayta sanash bilan kassa smenasi","Cash shifts with a money count"],
    "Зал": ["Zal","Hall"],
    "Свободен": ["Boʻsh","Free"],
    "Гости": ["Mehmonlar","Guests"],
    "Ждут счёт": ["Hisob kutmoqda","Waiting for bill"],
    "Бронь": ["Bron","Booked"],
    "Стол 4": ["4-stol","Table 4"],
    "8 гостей": ["8 mehmon","8 guests"],
    "Плов": ["Palov","Plov"],
    "Шашлык": ["Shashlik","Shashlik"],
    "Чай": ["Choy","Tea"],
    "Итого": ["Jami","Total"],
    "Магазин, аптека, одежда, стройматериалы": ["Doʻkon, dorixona, kiyim, qurilish mollari","Shop, pharmacy, clothing, hardware"],
    "Касса со сканером, склад и долги покупателей в одном месте. Продали — остаток уменьшился сам, наценка и прибыль посчитались.": ["Skanerli kassa, ombor va xaridorlar qarzlari bir joyda. Sotdingiz — qoldiq oʻzi kamaydi, ustama va foyda hisoblandi.","A till with a scanner, stock and customer debts in one place. Make a sale — the stock goes down by itself, markup and profit are counted."],
    "Касса со сканером штрихкодов и денежным ящиком": ["Shtrix-kod skaneri va pul qutisi bilan kassa","A till with a barcode scanner and cash drawer"],
    "Оптовые цены: чек переключается в «оптом» одной кнопкой": ["Ulgurji narxlar: chek bitta tugma bilan «ulgurji»ga oʻtadi","Wholesale prices: one button switches a receipt to wholesale"],
    "Продажа в долг и учёт долгов покупателей": ["Qarzga sotish va xaridorlar qarzlarini hisobga olish","Selling on credit and tracking customer debts"],
    "Приёмка по накладной, поставщики и заявки поставщику": ["Yuk xati boʻyicha qabul qilish, yetkazib beruvchilar va ularga arizalar","Receiving by invoice, suppliers and purchase orders"],
    "Инвентаризация, оборотная ведомость, печать ценников": ["Inventarizatsiya, aylanma qaydnoma, narx yorliqlarini chop etish","Stocktaking, stock turnover sheet, price label printing"],
    "Сроки годности для аптеки, размеры и модели для одежды": ["Dorixona uchun yaroqlilik muddatlari, kiyim uchun oʻlcham va modellar","Expiry dates for pharmacies, sizes and models for clothing"],
    "Фискальная касса и коды ИКПУ": ["Fiskal kassa va IKPU kodlari","Fiscal register and IKPU codes"],
    "Возврат товара — сразу и на складе, и в деньгах": ["Tovar qaytarilishi — darhol omborda ham, pulda ham","Returns show up at once — in stock and in money"],
    "Чек № 1048": ["Chek № 1048","Receipt No. 1048"],
    "Розница": ["Chakana","Retail"],
    "Оптом": ["Ulgurji","Wholesale"],
    "Сканер готов": ["Skaner tayyor","Scanner ready"],
    "Молоко 1 л": ["Sut 1 l","Milk 1 l"],
    "Хлеб": ["Non","Bread"],
    "Чай зелёный": ["Koʻk choy","Green tea"],
    "Сахар 1 кг": ["Shakar 1 kg","Sugar 1 kg"],
    "Наличные": ["Naqd","Cash"],
    "Карта": ["Karta","Card"],
    "В долг": ["Qarzga","On credit"],
    "Долг покупателя «Гулнора»": ["Xaridor «Gulnora» qarzi","Customer debt: Gulnora"],
    "Гостиница, мини-отель, хостел": ["Mehmonxona, mini-otel, hostel","Hotel, mini-hotel, hostel"],
    "Ресепшен, шахматка и уборка номеров в одной программе. Номер не продастся дважды: программа проверяет каждую ночь брони.": ["Resepshn, shaxmatka va xonalarni tozalash bitta dasturda. Xona ikki marta sotilmaydi: dastur bronning har bir kechasini tekshiradi.","Front desk, room chart and housekeeping in one app. A room is never sold twice: the app checks every night of a booking."],
    "Шахматка: все номера и брони на одном календаре": ["Shaxmatka: barcha xonalar va bronlar bitta taqvimda","Room chart: all rooms and bookings on one calendar"],
    "Ресепшен: кто сегодня заезжает и кто выезжает": ["Resepshn: bugun kim keladi va kim ketadi","Front desk: who checks in and who checks out today"],
    "Заселение, выселение, ранний выезд и продление": ["Joylashtirish, chiqarish, erta ketish va uzaytirish","Check-in, check-out, early departure and extensions"],
    "Счёт гостя: проживание, оплаты и возвраты": ["Mehmon hisobi: yashash, toʻlovlar va qaytarishlar","Guest folio: stay, payments and refunds"],
    "Экран горничной: какие номера убрать — без имён гостей": ["Xizmatchi ekrani: qaysi xonalarni tozalash kerak — mehmonlar ismisiz","Housekeeping screen: which rooms to clean — no guest names"],
    "Категории номеров и цены за ночь": ["Xona toifalari va bir kecha narxi","Room types and nightly rates"],
    "Загрузка, средняя цена и доход на номер — только владельцу": ["Bandlik, oʻrtacha narx va xonaga toʻgʻri keladigan daromad — faqat egasiga","Occupancy, average rate and revenue per room — for the owner only"],
    "Брони из гид-приложения приходят сами": ["Gid-ilovadan bronlar oʻzi keladi","Bookings from the guide app arrive by themselves"],
    "Шахматка": ["Shaxmatka","Room chart"],
    "Живут": ["Yashamoqda","In house"],
    "Из гида": ["Giddan","From guide"],
    "Пн": ["Du","Mon"],
    "Вт": ["Se","Tue"],
    "Ср": ["Ch","Wed"],
    "Чт": ["Pa","Thu"],
    "Пт": ["Ju","Fri"],
    "Сб": ["Sh","Sat"],
    "Вс": ["Ya","Sun"],
    "Азиз К.": ["Aziz K.","Aziz K."],
    "Анна С.": ["Anna S.","Anna S."],
    "Ли Вэй": ["Li Vey","Li Wei"],
    "Шахзод Р.": ["Shahzod R.","Shahzod R."],
    "Дилноза": ["Dilnoza","Dilnoza"],
    "Убрать сегодня": ["Bugun tozalash","Clean today"],
    "Клининговая компания": ["Klining kompaniyasi","Cleaning company"],
    "Каждая уборка — от звонка клиента до акта с подписью. Бригады, инвентарь, материалы и зарплаты под контролем.": ["Har bir tozalash — mijoz qoʻngʻiroq qilganidan imzoli dalolatnomagacha. Brigadalar, inventar, materiallar va ish haqi nazorat ostida.","Every job — from the client’s call to a signed completion report. Crews, equipment, supplies and pay under control."],
    "Заявки и маршрут дня для каждой бригады": ["Har bir brigada uchun arizalar va kunlik yoʻnalish","Jobs and a daily route for every crew"],
    "Договоры на постоянные объекты — заявки создаются сами": ["Doimiy obyektlar uchun shartnomalar — arizalar oʻzi yaratiladi","Contracts for regular sites — jobs are created automatically"],
    "Воронка клиентов: от первого звонка до постоянного договора": ["Mijozlar voronkasi: birinchi qoʻngʻiroqdan doimiy shartnomagacha","Client funnel: from the first call to a regular contract"],
    "Акт выполненных работ с подписью клиента на экране": ["Mijoz ekranda imzolaydigan bajarilgan ishlar dalolatnomasi","Completion report signed by the client on screen"],
    "Бригады с инвентарём и вечерней перекличкой вещей": ["Inventarli brigadalar va kechki buyumlar roʻyxati tekshiruvi","Crews with their equipment and an evening equipment check"],
    "Расход материалов по дням и загруженность бригад": ["Kunlar boʻyicha materiallar sarfi va brigadalar bandligi","Supplies used per day and crew workload"],
    "Зарплата уборщиц — даже тех, у кого нет входа в программу": ["Farroshlar ish haqi — dasturga kirishi yoʻqlarniki ham","Cleaners’ pay — even for those without a login"],
    "Отзывы клиентов и управляющий с правами владельца": ["Mijozlar sharhlari va egasi huquqlariga ega boshqaruvchi","Client reviews and a head manager with owner rights"],
    "Маршрут на сегодня": ["Bugungi yoʻnalish","Today’s route"],
    "3 заявки": ["3 ta ariza","3 jobs"],
    "Квартира после ремонта": ["Taʼmirdan keyingi kvartira","Flat after renovation"],
    "Бригада 1 · 3 человека": ["1-brigada · 3 kishi","Crew 1 · 3 people"],
    "Готово": ["Tayyor","Done"],
    "Офис, еженедельная уборка": ["Ofis, haftalik tozalash","Office, weekly cleaning"],
    "Бригада 2 · по договору": ["2-brigada · shartnoma boʻyicha","Crew 2 · under contract"],
    "В работе": ["Jarayonda","In progress"],
    "Генеральная уборка дома": ["Uyni umumiy tozalash","Deep clean of a house"],
    "Бригада 1 · 4 человека": ["1-brigada · 4 kishi","Crew 1 · 4 people"],
    "Ждёт": ["Kutmoqda","Waiting"],
    "Акт подписан клиентом на экране": ["Dalolatnoma mijoz tomonidan ekranda imzolandi","Report signed by the client on screen"],
    "Одна учётная запись — сколько угодно заведений разного вида. Переключение сверху, в одно нажатие: утром смотрите ресторан, днём магазин.": ["Bitta hisob — turli xildagi istalgancha muassasa. Yuqoridan bir bosishda almashtiriladi: ertalab restoranni, kunduzi doʻkonni koʻrasiz.","One account, as many businesses of different kinds as you like. Switch at the top in one tap: look at the restaurant in the morning, the shop at midday."],
    "Честная прибыль": ["Halol foyda","Honest profit"],
    "Прибыль, которую можно проверить сложением": ["Qoʻshish bilan tekshirsa boʻladigan foyda","Profit you can check by simple addition"],
    "Многие кассы называют прибылью наценку. OSHBOARD вычитает всё — и показывает каждый вычет отдельной строкой.": ["Koʻp kassalar ustamani foyda deb ataydi. OSHBOARD hammasini ayiradi — va har bir ayirmani alohida qatorda koʻrsatadi.","Many tills call markup “profit”. OSHBOARD subtracts everything — and shows each deduction on its own line."],
    "всё, что пробито на кассе": ["kassada urilgan hamma narsa","everything rung up at the till"],
    "по тех-картам и закупочным ценам": ["texnologik kartalar va xarid narxlari boʻyicha","by recipe cards and purchase prices"],
    "аренда, свет, материалы": ["ijara, elektr, materiallar","rent, power, supplies"],
    "оклады, смены, проценты, авансы": ["maoshlar, smenalar, foizlar, avanslar","salaries, shifts, commissions, advances"],
    "то, что реально осталось": ["haqiqatda qolgani","what is really left"],
    "Закрытие дня и архив отчётов": ["Kunni yopish va hisobotlar arxivi","Day close and report archive"],
    "Таблица для бухгалтера, Excel и печать": ["Buxgalter uchun jadval, Excel va chop etish","A table for the accountant, Excel and printing"],
    "Возвраты сразу уменьшают доход": ["Qaytarishlar darhol daromadni kamaytiradi","Refunds reduce income right away"],
    "И всё, что нужно каждому делу": ["Va har bir ishga kerak boʻlgan hamma narsa","And everything every business needs"],
    "Касса, склад, люди, деньги и отчёты связаны между собой. Пробили чек — уменьшился остаток на складе, посчиталась себестоимость, изменилась прибыль в отчёте. Ничего не нужно переносить руками.": ["Kassa, ombor, odamlar, pul va hisobotlar bir-biriga bogʻlangan. Chek urildi — omborda qoldiq kamaydi, tannarx hisoblandi, hisobotdagi foyda oʻzgardi. Hech narsani qoʻlda koʻchirish kerak emas.","The register, the stock, the people, the money and the reports are tied together. Ring up a sale and stock goes down, cost is worked out, profit in the report changes. Nothing has to be copied by hand."],
    "Работа каждый день": ["Har kungi ish","Everyday work"],
    "Касса, которая не встанет": ["Toʻxtamaydigan kassa","A register that does not stop"],
    "Пропал интернет — касса продолжает работать и запоминает чеки. Связь вернулась — всё догоняется само, и ни одна продажа не спишется дважды.": ["Internet uzildi — kassa ishlashda davom etadi va cheklarni eslab qoladi. Aloqa tiklandi — hammasi oʻzi yetib oladi va birorta savdo ikki marta hisobdan chiqmaydi.","Internet down — the till keeps working and remembers receipts. When the connection is back everything catches up by itself, and no sale is counted twice."],
    "Вход по PIN-коду": ["PIN-kod bilan kirish","PIN login"],
    "На общей кассе сотрудник не вводит пароль — набирает свой короткий PIN. Всегда видно, кто пробил чек и кто открыл смену.": ["Umumiy kassada xodim parol kiritmaydi — oʻzining qisqa PIN kodini teradi. Chekni kim urgani va smenani kim ochgani doim koʻrinadi.","On a shared till staff don’t type a password — they enter their short PIN. You always see who rang up a receipt and who opened the shift."],
    "Смены, явка и зарплата": ["Smenalar, davomat va ish haqi","Shifts, attendance and pay"],
    "Кто на смене, кто опоздал, план смен на месяц. Оклад, ставка за смену или процент; авансы и выплаты сразу попадают в отчёт.": ["Kim smenada, kim kechikdi, oylik smena rejasi. Maosh, smena uchun stavka yoki foiz; avans va toʻlovlar darhol hisobotga tushadi.","Who’s on shift, who was late, the monthly rota. Salary, per-shift rate or commission; advances and payouts go straight into the report."],
    "Задачи и личный кабинет": ["Vazifalar va shaxsiy kabinet","Tasks and personal page"],
    "Руководитель ставит задачу — сотрудник видит её у себя. В личном кабинете каждый видит свои смены, выплаты и расходы.": ["Rahbar vazifa qoʻyadi — xodim uni oʻzida koʻradi. Shaxsiy kabinetda har kim oʻz smenalari, toʻlovlari va xarajatlarini koʻradi.","A manager sets a task — the employee sees it on their page. Everyone sees their own shifts, payouts and expenses there."],
    "Telegram-уведомления": ["Telegram xabarnomalari","Telegram notifications"],
    "Новая заявка или бронь приходит сотруднику прямо в Telegram, руководитель получает сводку за день.": ["Yangi ariza yoki bron xodimga toʻgʻridan-toʻgʻri Telegramga keladi, rahbar kunlik xulosani oladi.","A new job or booking reaches the employee straight in Telegram; the manager gets a daily summary."],
    "Экраны обновляются сами": ["Ekranlar oʻzi yangilanadi","Screens update by themselves"],
    "Пробили чек на кассе — у руководителя на телефоне цифры поменялись сразу. Ничего не нужно перезагружать.": ["Kassada chek urildi — rahbarning telefonida raqamlar darhol oʻzgardi. Hech narsani qayta yuklash shart emas.","A receipt is rung up — the numbers on the manager’s phone change at once. No need to reload anything."],
    "Деньги и отчёты": ["Pul va hisobotlar","Money and reports"],
    "Закрытие дня и архив": ["Kunni yopish va arxiv","Day close and archive"],
    "В конце дня отчёт закрывается и уходит в архив. Любой прошлый день можно открыть и посмотреть, как всё было.": ["Kun oxirida hisobot yopiladi va arxivga tushadi. Istalgan oʻtgan kunni ochib, qanday boʻlganini koʻrish mumkin.","At the end of the day the report is closed and archived. Open any past day and see exactly how it went."],
    "Для бухгалтера — таблицей": ["Buxgalter uchun — jadval","For your accountant, as a table"],
    "Приход и расход по дням, расходы по статьям, зарплаты за период. Выгрузка в Excel и печать. Это не декларация — это понятная таблица с расшифровкой, которую бухгалтер переносит куда ему нужно.": ["Kunlar boʻyicha kirim va chiqim, moddalar boʻyicha xarajatlar, davr uchun ish haqi. Excelga yuklash va chop etish. Bu deklaratsiya emas — bu buxgalter oʻziga kerakli joyga koʻchiradigan, izohli tushunarli jadval.","Money in and out by day, costs by category, wages for the period. Export to Excel and print. This is not a tax return: it is a clear table with a breakdown that your accountant moves wherever they need it."],
    "Взгляд вперёд": ["Oldinga nazar","A look ahead"],
    "Программа подскажет, какой товар скоро закончится и кто из постоянных клиентов давно не появлялся.": ["Dastur qaysi tovar tez orada tugashini va doimiy mijozlardan kim uzoq vaqt koʻrinmaganini aytib beradi.","The app tells you which goods will soon run out and which regular customers haven’t been back for a while."],
    "Планы продаж": ["Sotuv rejalari","Sales plans"],
    "Ставите цель на месяц — и видите, сколько уже сделано и сколько осталось каждому сотруднику.": ["Oylik maqsad qoʻyasiz — va har bir xodim qancha bajargani va qancha qolganini koʻrasiz.","Set a monthly target — and see how much each employee has done and how much is left."],
    "Что продаётся, а что лежит": ["Nima sotiladi, nima yotibdi","What sells and what sits"],
    "Хиты и аутсайдеры, наценка по каждой позиции. Понятно, что убрать из меню, а что поставить на видное место. Для магазина отдельно видно, сколько денег лежит на складе по себестоимости.": ["Yaxshi ketayotgan va yotib qolgan pozitsiyalar, har biri boʻyicha ustama. Menyudan nimani olib tashlash, nimani koʻzga koʻringan joyga qoʻyish aniq. Doʻkon uchun alohida: omborda tannarx boʻyicha qancha pul yotgani koʻrinadi.","Best sellers and dead weight, the mark-up on each line. It is clear what to drop from the menu and what to put in plain sight. For shops there is also how much money is sitting in stock at cost."],
    "AI-помощник": ["AI-yordamchi","AI assistant"],
    "Спрашиваете обычными словами: «почему упала выручка на этой неделе», «какие блюда убрать», «сколько фирма должна вернуть сотрудникам» — и получаете ответ по своим цифрам.": ["Oddiy soʻzlar bilan soʻraysiz: «bu hafta tushum nega tushdi», «qaysi taomlarni olib tashlash kerak», «firma xodimlarga qancha qaytarishi kerak» — va oʻz raqamlaringiz boʻyicha javob olasiz.","You ask in plain words: why did takings fall this week, which dishes should go, how much does the firm owe its staff. The answer comes from your own numbers."],
    "Контроль и безопасность": ["Nazorat va xavfsizlik","Control and security"],
    "Роли и права": ["Rollar va huquqlar","Roles and permissions"],
    "Кассир видит только кассу, менеджер — работу без финансов, а полные отчёты открыты владельцу. В гостинице свои роли: ресепшен и горничная.": ["Kassir faqat kassani, menejer — moliyasiz ishni koʻradi, toʻliq hisobotlar esa egasiga ochiq. Mehmonxonada oʻz rollari bor: resepshn va xizmatchi.","A cashier sees only the till, a manager sees the work without the finances, and full reports are open to the owner. Hotels have their own roles: front desk and housekeeper."],
    "Журнал действий": ["Harakatlar jurnali","Activity log"],
    "Кто, когда и что изменил или удалил — всё записано. Удалённую по ошибке запись можно вернуть прямо из журнала.": ["Kim, qachon va nimani oʻzgartirgani yoki oʻchirgani — hammasi yozilgan. Xato bilan oʻchirilgan yozuvni toʻgʻridan-toʻgʻri jurnaldan qaytarish mumkin.","Who changed or deleted what, and when — it’s all recorded. A record deleted by mistake can be restored right from the log."],
    "Камеры и события": ["Kameralar va hodisalar","Cameras and events"],
    "Камеры заведения в одном окне с программой. Важные события с камер собираются в отдельный список.": ["Muassasa kameralari dastur bilan bitta oynada. Kameralardagi muhim hodisalar alohida roʻyxatga yigʻiladi.","Your cameras in the same window as the app. Important camera events are collected in a separate list."],
    "Личные данные под защитой": ["Shaxsiy maʼlumotlar himoyada","Personal data protected"],
    "Ушёл сотрудник — его телефон, фото и PIN стираются одной кнопкой, а смены и зарплаты остаются для бухгалтерии.": ["Xodim ketdi — uning telefoni, surati va PIN kodi bitta tugma bilan oʻchiriladi, smenalar va ish haqi esa buxgalteriya uchun qoladi.","When someone leaves, their phone, photo and PIN are erased with one button, while shifts and pay stay for the accounts."],
    "Копии базы и проверки": ["Baza nusxalari va tekshiruvlar","Backups and checks"],
    "Копии базы снимаются регулярно. Перед каждым обновлением — больше 600 автоматических проверок: не разошлись ли отчёты, не потерялись ли деньги.": ["Baza nusxalari muntazam olinadi. Har bir yangilanishdan oldin — 600 dan ortiq avtomatik tekshiruv: hisobotlar mos keladimi, pul yoʻqolmadimi.","The database is backed up regularly. Before every update — over 600 automatic checks: do the reports agree, has any money gone missing."],
    "Всё видно с телефона": ["Hammasi telefondan koʻrinadi","See it all from your phone"],
    "Выручка, смены и брони — в кармане. Руководителю не нужно сидеть в заведении, чтобы знать, как идут дела.": ["Tushum, smenalar va bronlar — choʻntagingizda. Ishlar qanday ketayotganini bilish uchun rahbar muassasada oʻtirishi shart emas.","Revenue, shifts and bookings — in your pocket. You don’t have to sit in the venue to know how things are going."],
    "Новое · гид-приложение": ["Yangi · gid-ilova","New · guide app"],
    "Гости находят вас сами — через гид": ["Mehmonlar sizni oʻzlari topadi — gid orqali","Guests find you themselves — through the guide"],
    "OSHBOARD подключается к гид-приложению по городу. Гид показывает людям, где сейчас есть свободный номер или стол, и сам оформляет бронь — а она сразу появляется у вас.": ["OSHBOARD shahar boʻyicha gid-ilovaga ulanadi. Gid odamlarga hozir qayerda boʻsh xona yoki stol borligini koʻrsatadi va bronni oʻzi rasmiylashtiradi — u esa darhol sizda paydo boʻladi.","OSHBOARD connects to a city guide app. The guide shows people where a room or table is free right now and makes the booking itself — and it appears in your system at once."],
    "Свободные номера и столы видны в гиде прямо сейчас": ["Boʻsh xonalar va stollar gidda hozirning oʻzida koʻrinadi","Free rooms and tables show in the guide in real time"],
    "Бронь сразу попадает на ресепшен и в шахматку с пометкой «Гид»": ["Bron darhol resepshn va shaxmatkaga «Gid» belgisi bilan tushadi","The booking lands on the front desk and room chart at once, marked “Guide”"],
    "Номер не продастся дважды — проверяется каждая ночь": ["Xona ikki marta sotilmaydi — har bir kecha tekshiriladi","A room is never sold twice — every night is checked"],
    "Включает только владелец — одной кнопкой в настройках": ["Faqat egasi yoqadi — sozlamalarda bitta tugma bilan","Only the owner turns it on — one switch in settings"],
    "Гид не видит ваши деньги, сотрудников и других гостей": ["Gid sizning pulingiz, xodimlaringiz va boshqa mehmonlarni koʻrmaydi","The guide never sees your money, staff or other guests"],
    "Гостиница «Бахор»": ["«Bahor» mehmonxonasi","Hotel Bahor"],
    "Свободно: 3 номера": ["Boʻsh: 3 ta xona","Available: 3 rooms"],
    "Стандарт": ["Standart","Standard"],
    "300 000 сум за ночь": ["bir kecha 300 000 soʻm","300,000 sum per night"],
    "12 окт": ["12-okt","Oct 12"],
    "14 окт": ["14-okt","Oct 14"],
    "Забронировать": ["Bron qilish","Book now"],
    "Ресепшен": ["Resepshn","Front desk"],
    "Новая бронь": ["Yangi bron","New booking"],
    "Свободно на все ночи": ["Barcha kechalarga boʻsh","Free for every night"],
    "Записано в журнал действий": ["Harakatlar jurnaliga yozildi","Recorded in the activity log"],
    "Уникальная фишка": ["Noyob xususiyat","Unique feature"],
    "Тепло-навигатор зала через камеру": ["Kamera orqali zal issiqlik-navigatori","Hall heat navigator via camera"],
    "Подключаем датчик к вашей камере — и в приложении вы видите не просто трекинг, а тепловую карту зала: где скапливаются гости, какие столы «горячие», а какие простаивают.": ["Kameringizga datchik ulaymiz — ilovada oddiy kuzatuvni emas, zal issiqlik xaritasini ko‘rasiz: mehmonlar qayerda to‘planadi, qaysi stollar «issiq», qaysilari bo‘sh turadi.","We connect a sensor to your camera — and in the app you see not just tracking, but a heat map of the hall: where guests gather, which tables are “hot” and which sit idle."],
    "Тепловая карта посадки и проходимости в реальном времени": ["Joylashuv va o‘tuvchanlik issiqlik xaritasi real vaqtda","Real-time heat map of seating and footfall"],
    "Видно «мёртвые» зоны зала — можно переставить столы": ["Zalning «o‘lik» zonalari ko‘rinadi — stollarni qayta joylash mumkin","See the hall’s “dead” zones — you can rearrange tables"],
    "Подключается к обычной камере — без дорогого оборудования": ["Oddiy kameraga ulanadi — qimmat jihozsiz","Connects to an ordinary camera — no expensive hardware"],
    "Докупается к «Старт» и «Бизнес», в «Премиум» — уже включён": ["«Start» va «Biznes»ga qo‘shimcha olinadi, «Premium»da — allaqachon kiritilgan","An add-on for “Start” and “Business”, already included in “Premium”"],
    "Почему мы": ["Nega biz","Why us"],
    "Сделано под то, как работают здесь": ["Bu yerda qanday ishlashlariga moslab yaratilgan","Built for how business works here"],
    "Программу делают здесь, в Самарканде, под то, как дело ведут в Узбекистане: с перебоями связи, с наличными, на трёх языках и без дорогого оборудования.": ["Dastur shu yerda, Samarqandda, Oʻzbekistonda ish yuritish tarziga moslab qilinadi: aloqa uzilishlari bilan, naqd pul bilan, uch tilda va qimmat jihozsiz.","The program is made here in Samarkand, for the way business is actually run in Uzbekistan: with patchy connections, with cash, in three languages and without expensive equipment."],
    "Телефон и планшет": ["Telefon va planshet","Phone and tablet"],
    "Ставится значком прямо из браузера — как обычное приложение, без магазина приложений.": ["Toʻgʻridan-toʻgʻri brauzerdan belgi sifatida oʻrnatiladi — oddiy ilova kabi, ilovalar doʻkonisiz.","Installs as an icon straight from the browser — like a normal app, no app store needed."],
    "Программа для Windows": ["Windows uchun dastur","Windows app"],
    "Для кассы — отдельная программа: своё окно, свой значок, можно поставить в автозапуск.": ["Kassa uchun — alohida dastur: oʻz oynasi, oʻz belgisi, avtomatik ishga tushirishga qoʻyish mumkin.","For the till there’s a separate program: its own window and icon, and it can start automatically."],
    "Три языка целиком": ["Uch til toʻliq","Three languages, all the way through"],
    "Не только меню, но и каждая ошибка, каждая подсказка, каждая строка отчёта. Кассир-узбек работает по-узбекски, а не догадывается по кнопкам.": ["Faqat menyu emas, har bir xatolik, har bir izoh, hisobotning har bir qatori ham. Oʻzbek kassir oʻzbekchada ishlaydi, tugmalarga qarab taxmin qilmaydi.","Not only the menu, but every error, every hint, every line of a report. An Uzbek cashier works in Uzbek instead of guessing from the buttons."],
    "Поддержка на месте": ["Yordam shu yerda","Support on the ground"],
    "Мы в Самарканде. Не колл-центр в другой стране и не переписка на чужом языке — приедем и покажем.": ["Biz Samarqanddamiz. Boshqa mamlakatdagi qoʻngʻiroq markazi ham, begona tildagi yozishma ham emas — kelamiz va koʻrsatamiz.","We are in Samarkand. Not a call centre in another country, not a chat in a language you do not speak: we come over and show you."],
    "вида дела: ресторан, магазин, гостиница, клининг": ["ish turi: restoran, doʻkon, mehmonxona, klining","business types: restaurant, shop, hotel, cleaning"],
    "языка: русский, узбекский, английский": ["til: rus, oʻzbek, ingliz","languages: Russian, Uzbek, English"],
    "автоматических проверок перед каждым обновлением": ["har bir yangilanishdan oldin avtomatik tekshiruv","automatic checks before every update"],
    "поддержка без выходных": ["dam olishsiz qo‘llab-quvvatlash","support with no days off"],
    "Сравнение": ["Taqqoslash","Comparison"],
    "OSHBOARD против обычной кассы": ["OSHBOARD oddiy kassaga qarshi","OSHBOARD vs a plain register"],
    "Обычная касса просто принимает оплату. OSHBOARD ещё и показывает, где вы теряете, а где зарабатываете.": ["Oddiy kassa faqat to‘lovni qabul qiladi. OSHBOARD esa qayerda yo‘qotayotganingiz va topayotganingizni ko‘rsatadi.","A plain register just takes payment. OSHBOARD also shows where you lose and where you earn."],
    "Возможность": ["Imkoniyat","Feature"],
    "Обычная касса": ["Oddiy kassa","Plain register"],
    "Приём оплаты и печать чека": ["Toʻlovni qabul qilish va chek chiqarish","Taking payment and printing a receipt"],
    "Работает, когда пропал интернет": ["Internet uzilganda ishlaydi","Works when the internet is gone"],
    "Остатки на складе меняются сами": ["Ombordagi qoldiqlar oʻzi oʻzgaradi","Stock levels change by themselves"],
    "Себестоимость проданного в прибыли": ["Foydada sotilganning tannarxi","Cost of goods sold counted in profit"],
    "Зарплаты и авансы внутри отчёта": ["Hisobot ichida ish haqi va avanslar","Wages and advances inside the report"],
    "Готовая таблица для бухгалтера": ["Buxgalter uchun tayyor jadval","A ready table for the accountant"],
    "Журнал действий с возвратом удалённого": ["Oʻchirilganni qaytarish imkoni bilan harakatlar jurnali","Activity log with restore of deleted records"],
    "Три языка целиком, а не только меню": ["Faqat menyu emas, uch til toʻliq","Three languages throughout, not just the menu"],
    "Ресторан, магазин, гостиница и клининг в одном входе": ["Restoran, doʻkon, mehmonxona va klining bitta kirishda","Restaurant, shop, hotel and cleaning under one login"],
    "Брони из гид-приложения": ["Gid-ilovadan bronlar","Bookings from the guide app"],
    "AI-помощник по своим цифрам": ["Oʻz raqamlaringiz boʻyicha AI-yordamchi","An AI assistant on your own numbers"],
    "Тепловая карта зала через камеру": ["Kamera orqali zal issiqlik xaritasi","A heat map of the room through a camera"],
    "Тариф под размер вашего дела": ["Ishingiz hajmiga mos tarif","A plan that fits the size of your business"],
    "Цены ориентировочные. Точную стоимость считаем под ваше дело: сколько точек, сколько людей, нужны ли камеры. Оставьте заявку — посчитаем.": ["Narxlar taxminiy. Aniq narxni ishingizga qarab hisoblaymiz: nechta nuqta, nechta odam, kameralar kerakmi. Ariza qoldiring — hisoblab beramiz.","Prices are approximate. We work out the exact cost for your business: how many outlets, how many people, whether you need cameras. Leave a request — we’ll calculate it."],
    "Старт": ["Start","Start"],
    "Одна точка: кафе, магазин у дома, мини-отель, малая бригада": ["Bitta nuqta: kafe, uy yonidagi doʻkon, mini-otel, kichik brigada","One outlet: a café, a corner shop, a mini-hotel, a small crew"],
    "от 690 000": ["690 000 dan","from 690,000"],
    "сум/мес": ["so‘m/oy","UZS/mo"],
    "небольшое дело, одна точка": ["kichik ish, bitta nuqta","a small business, one outlet"],
    "Касса и работа без интернета": ["Kassa va internetsiz ish","The till, working with no internet"],
    "Склад, остатки, себестоимость": ["Ombor, qoldiqlar, tannarx","Stock, levels, cost"],
    "Смены, явка и зарплаты": ["Smenalar, davomat va ish haqi","Shifts, attendance and pay"],
    "Отчёт с настоящей прибылью": ["Haqiqiy foyda koʻrsatiladigan hisobot","A report with real profit in it"],
    "Тепло-навигатор (докупается)": ["Issiqlik-navigator (qo‘shimcha)","Heat navigator (add-on)"],
    "Выбрать «Старт»": ["«Start»ni tanlash","Choose “Start”"],
    "Рекомендуем": ["Tavsiya etamiz","Recommended"],
    "Бизнес": ["Biznes","Business"],
    "До двух точек: ресторан, сеть лавок, гостиница, клининг": ["Ikki nuqtagacha: restoran, doʻkonlar tarmogʻi, mehmonxona, klining","Up to two outlets: a restaurant, a few shops, a hotel, a cleaning firm"],
    "от 1 190 000": ["1 190 000 dan","from 1,190,000"],
    "среднее дело, до двух точек": ["oʻrtacha ish, ikkitagacha nuqta","a mid-size business, up to two outlets"],
    "Всё из «Старт»": ["«Start»dagi hammasi","Everything in “Start”"],
    "Таблица для бухгалтера и Excel": ["Buxgalter uchun jadval va Excel","A table for the accountant, and Excel"],
    "Несколько заведений в одном входе": ["Bitta kirishda bir nechta muassasa","Several businesses under one login"],
    "AI-помощник и Telegram-уведомления": ["AI-yordamchi va Telegram xabarnomalari","The AI assistant and Telegram alerts"],
    "Выбрать «Бизнес»": ["«Biznes»ni tanlash","Choose “Business”"],
    "Премиум": ["Premium","Premium"],
    "Сеть точек, большие площади, много бригад": ["Nuqtalar tarmogʻi, katta maydonlar, koʻp brigada","A chain of outlets, large floors, many crews"],
    "Индивидуально": ["Individual","Custom"],
    "сеть, много точек и людей": ["tarmoq, koʻp nuqta va odam","a chain, many outlets and people"],
    "Всё из «Бизнес»": ["«Biznes»dagi hammasi","Everything in “Business”"],
    "Тепло-навигатор включён": ["Issiqlik-navigator kiritilgan","Heat navigator included"],
    "Сколько угодно точек и людей": ["Istalgancha nuqta va odam","As many outlets and people as you like"],
    "Поддержка вне очереди": ["Navbatsiz yordam","Support that jumps the queue"],
    "Персональный менеджер": ["Shaxsiy menejer","Personal manager"],
    "Обсудить «Премиум»": ["«Premium»ni muhokama qilish","Discuss “Premium”"],
    "Доп. модуль: датчик «Тепло-навигатор»": ["Qoʻshimcha modul: «Issiqlik-navigator» datchigi","Add-on: the “Heat navigator” sensor"],
    "Подключается к камере и превращает обычный трекинг в тепловую карту зала. Доступен к тарифам «Старт» и «Бизнес», в «Премиум» уже входит бесплатно.": ["Kameraga ulanadi va oddiy kuzatuvni zal issiqlik xaritasiga aylantiradi. «Start» va «Biznes» tariflariga mavjud, «Premium»ga bepul kiradi.","Connects to the camera and turns basic tracking into a hall heat map. Available for “Start” and “Business”, free in “Premium”."],
    "В «Премиум» — включён": ["«Premium»da — kiritilgan","Included in “Premium”"],
    "Как начать": ["Qanday boshlash","How to start"],
    "Запуск за 4 простых шага": ["4 oddiy qadamda ishga tushirish","Launch in 4 simple steps"],
    "Заявка": ["Ariza","Request"],
    "Оставляете заявку — связываемся и показываем программу на ваших цифрах, а не на выдуманном примере.": ["Ariza qoldirasiz — bogʻlanamiz va dasturni oʻylab topilgan misolda emas, sizning raqamlaringizda koʻrsatamiz.","You leave a request, we get in touch and show the program on your own numbers, not on a made-up example."],
    "Перенос": ["Koʻchirish","Moving your data"],
    "Заносим то, что у вас уже есть: меню или товары, столы, номера или объекты, людей и их оклады. Тетрадь переписывать не придётся.": ["Sizda bor narsani kiritamiz: menyu yoki tovarlar, stollar, xonalar yoki obyektlar, odamlar va ularning maoshlari. Daftarni koʻchirib yozish shart emas.","We enter what you already have: menu or products, tables, rooms or sites, people and their salaries. No need to copy out your notebook."],
    "Обучение": ["O‘qitish","Training"],
    "Показываем команде на её же языке. Кассиру хватает получаса: экран кассы сделан так, чтобы в него не надо было вчитываться.": ["Jamoaga oʻz tilida koʻrsatamiz. Kassirga yarim soat yetadi: kassa ekrani unga tikilib oʻqish kerak boʻlmaydigan qilib ishlangan.","We show the team in their own language. Half an hour is enough for a cashier: the till screen is built so you do not have to read into it."],
    "Работа": ["Ishlash","Work"],
    "Работаете и видите цифры сразу. Мы рядом: вопросы решаем без выходных, раз в месяц смотрим, всё ли в порядке.": ["Ishlaysiz va raqamlarni darrov koʻrasiz. Biz yonimizdamiz: savollarni dam olish kunlarisiz hal qilamiz, oyiga bir marta hammasi joyidami deb qaraymiz.","You work and see the numbers straight away. We are close by: questions are answered any day of the week, and once a month we check that all is well."],
    "Частые вопросы": ["Ko‘p beriladigan savollar","Frequently asked questions"],
    "Подойдёт ли для магазина, гостиницы или клининга, а не для ресторана?": ["Restoran emas, doʻkon, mehmonxona yoki klining uchun ham mos keladimi?","Will it suit a shop, hotel or cleaning firm, not just a restaurant?"],
    "Да. При заведении вы выбираете вид дела, и программа перестраивается целиком: у магазина появляется сканер штрихкодов и приёмка, у гостиницы — шахматка и ресепшен, у клининга — заявки, бригады и акты. Слова и отчёты тоже меняются: в клининге это «объект» и «заявка», а не «стол» и «заказ».": ["Ha. Muassasa qoʻshishda ish turini tanlaysiz va dastur butunlay moslashadi: doʻkonda shtrix-kod skaneri va qabul qilish, mehmonxonada — shaxmatka va resepshn, kliningda — arizalar, brigadalar va dalolatnomalar paydo boʻladi. Soʻzlar va hisobotlar ham oʻzgaradi: kliningda bu «stol» va «buyurtma» emas, «obyekt» va «ariza».","Yes. When you add a business you pick its type and the whole app adapts: a shop gets a barcode scanner and receiving, a hotel gets a room chart and front desk, a cleaning firm gets jobs, crews and completion reports. Wording and reports change too: in cleaning it’s “site” and “job”, not “table” and “order”."],
    "Что будет, если пропадёт интернет?": ["Internet uzilsa nima boʻladi?","What happens if the internet goes down?"],
    "Касса продолжит работать. Чеки пробиваются и складываются у неё, а когда связь вернётся — уходят на сервер сами. Одна и та же продажа при этом не спишется дважды: у каждой есть свой признак, по которому сервер узнаёт повтор.": ["Kassa ishlashda davom etadi. Cheklar urilib, oʻzida saqlanadi, aloqa tiklanganda esa serverga oʻzi ketadi. Bitta sotuv ikki marta yozilmaydi: har birining oʻz belgisi bor, server takrorni shu orqali taniydi.","The register keeps working. Sales are rung up and held there, and when the line is back they go to the server by themselves. The same sale is never recorded twice: each one carries a mark by which the server recognises a repeat."],
    "Как работает гостиница в OSHBOARD?": ["OSHBOARDda mehmonxona qanday ishlaydi?","How does the hotel setup work in OSHBOARD?"],
    "Ресепшен видит, кто сегодня заезжает и выезжает, шахматка показывает все номера на календаре, горничная — какие номера убрать. Оплаты гостя записываются в день оплаты, поэтому доход в отчёте сходится с кассой. Номер не продастся дважды: программа проверяет каждую ночь брони.": ["Resepshn bugun kim kelishi va ketishini koʻradi, shaxmatka barcha xonalarni taqvimda koʻrsatadi, xizmatchi — qaysi xonalarni tozalashni. Mehmon toʻlovlari toʻlov kunida yoziladi, shuning uchun hisobotdagi daromad kassa bilan mos keladi. Xona ikki marta sotilmaydi: dastur bronning har bir kechasini tekshiradi.","The front desk sees who checks in and out today, the room chart shows every room on a calendar, the housekeeper sees which rooms to clean. Guest payments are recorded on the day they’re paid, so income in the report matches the till. A room is never sold twice: the app checks every night of a booking."],
    "Что такое гид-приложение и что оно увидит?": ["Gid-ilova nima va u nimani koʻradi?","What is the guide app and what will it see?"],
    "Гид показывает людям свободные номера и столы и сам оформляет брони. Ваше заведение появится там, только если вы сами включите это в настройках. Гид видит лишь свободные места и цены — ни денег, ни сотрудников, ни других гостей.": ["Gid odamlarga boʻsh xonalar va stollarni koʻrsatadi va bronlarni oʻzi rasmiylashtiradi. Muassasangiz u yerda faqat sozlamalarda oʻzingiz yoqsangiz paydo boʻladi. Gid faqat boʻsh joylar va narxlarni koʻradi — na pulni, na xodimlarni, na boshqa mehmonlarni.","The guide shows people free rooms and tables and makes bookings itself. Your business appears there only if you turn it on in settings. The guide sees only free places and prices — no money, no staff, no other guests."],
    "Нужно ли покупать дорогое оборудование?": ["Qimmat jihoz sotib olish kerakmi?","Do I need to buy expensive equipment?"],
    "Нет. Достаточно обычного компьютера или планшета. Программа ставится значком из браузера — как приложение, без магазина приложений. Для кассы есть отдельная программа под Windows. Сканер штрихкодов и принтер чеков — если они вам нужны, подойдут обычные.": ["Yoʻq. Oddiy kompyuter yoki planshet yetarli. Dastur brauzerdan belgi boʻlib oʻrnatiladi — ilova kabi, ilovalar doʻkonisiz. Kassa uchun Windows ostida alohida dastur bor. Shtrix-kod skaneri va chek printeri kerak boʻlsa — oddiylari mos keladi.","No. An ordinary computer or tablet is enough. The program installs from the browser as an icon, like an app, with no app store. For the till there is a separate Windows program. If you need a barcode scanner and a receipt printer, ordinary ones will do."],
    "Мои сотрудники плохо знают русский. Смогут работать?": ["Xodimlarim rus tilini yaxshi bilmaydi. Ishlay oladimi?","My staff do not speak Russian well. Will they manage?"],
    "Да. Программа переведена целиком на узбекский и английский — не только меню, но и каждая подсказка, каждое сообщение об ошибке, каждая строка отчёта. Человек нажимает флажок вверху и видит всё на своём языке.": ["Ha. Dastur oʻzbek va ingliz tillariga toʻliq tarjima qilingan — faqat menyu emas, har bir izoh, har bir xatolik xabari, hisobotning har bir qatori ham. Odam yuqoridagi bayroqchani bosadi va hammasini oʻz tilida koʻradi.","Yes. The program is fully translated into Uzbek and English: not only the menu, but every hint, every error message, every line of a report. A person taps the flag at the top and sees it all in their own language."],
    "Кто увидит мои деньги?": ["Mening pulimni kim koʻradi?","Who gets to see my money?"],
    "Вы решаете сами. Кассир видит только кассу, менеджер — работу без финансов, а полные отчёты открыты вам. В клининге есть управляющий — он видит фирму как вы, но не может назначать других управляющих и не может тронуть ваш вход.": ["Oʻzingiz hal qilasiz. Kassir faqat kassani koʻradi, menejer — moliyasiz ishni, toʻliq hisobotlar esa sizga ochiq. Kliningda boshqaruvchi bor — u firmani siz kabi koʻradi, lekin boshqa boshqaruvchi tayinlay olmaydi va sizning kirishingizga tegolmaydi.","You decide. A cashier sees only the till, a manager sees the work without the money, and the full reports are yours. In cleaning there is a head manager: he sees the firm as you do, but cannot appoint other head managers and cannot touch your own login."],
    "Что, если сотрудник что-то удалил?": ["Agar xodim biror narsani oʻchirib yuborsa-chi?","What if an employee deletes something?"],
    "Каждое удаление и изменение записывается в журнал действий: кто, когда и что. Удалённую запись можно вернуть оттуда же.": ["Har bir oʻchirish va oʻzgartirish harakatlar jurnaliga yoziladi: kim, qachon va nima. Oʻchirilgan yozuvni oʻsha yerdan qaytarish mumkin.","Every deletion and change is written to the activity log: who, when and what. A deleted record can be restored from there."],
    "Чем ваш отчёт лучше того, что показывает касса?": ["Sizning hisobotingiz kassanikidan nimasi bilan yaxshi?","How is your report better than what a till shows?"],
    "Тем, что в нём вычтено всё. Из выручки уходит себестоимость проданного, расходы и зарплаты — и каждый вычет стоит отдельной строкой, чтобы итог можно было проверить сложением. Многие программы называют прибылью наценку, и владелец считает себя богаче, чем есть.": ["Unda hammasi ayirilgani bilan. Tushumdan sotilganning tannarxi, xarajatlar va ish haqi chiqadi — har bir ayiruv alohida qatorda, natijani qoʻshib tekshirish uchun. Koʻp dasturlar ustamani foyda deb ataydi va ega oʻzini bor-yoʻgʻidan boyroq deb hisoblaydi.","Because everything has been taken out of it. Revenue loses the cost of what was sold, the expenses and the wages, and each deduction has its own line so the total can be checked by adding up. Many programs call the mark-up profit, and the owner believes he is richer than he is."],
    "Мои данные никуда не денутся?": ["Maʼlumotlarim yoʻqolib qolmaydimi?","Will my data stay safe?"],
    "База хранится на защищённом сервере, копии снимаются регулярно. Каждое обновление проходит больше 600 автоматических проверок — в том числе на то, не разошлись ли отчёты и не потерялись ли деньги. Не прошло проверки — не выкладывается.": ["Baza himoyalangan serverda saqlanadi, nusxalari muntazam olinadi. Har bir yangilanish 600 dan ortiq avtomatik tekshiruvdan oʻtadi — jumladan, hisobotlar mos keladimi va pul yoʻqolmadimi. Tekshiruvdan oʻtmasa — chiqarilmaydi.","The database lives on a secure server and is backed up regularly. Every update passes over 600 automatic checks — including whether the reports agree and whether any money has gone missing. If it fails, it doesn’t ship."],
    "Что такое тепло-навигатор?": ["Issiqlik-navigator nima?","What is the heat navigator?"],
    "Он подключается к вашей камере и строит тепловую карту зала: видно, где гости садятся охотнее, а какие столы простаивают. В тарифе «Премиум» включён, к остальным докупается.": ["U kameraga ulanadi va zalning issiqlik xaritasini tuzadi: mehmonlar qayerga koʻproq oʻtirishi va qaysi stollar boʻsh turishi koʻrinadi. «Premium» tarifiga kiradi, qolganlariga alohida sotib olinadi.","It connects to your camera and builds a heat map of the room: you see where guests prefer to sit and which tables stand idle. Included in the Premium plan, bought separately with the others."],
    "Сколько стоит и есть ли скрытые платежи?": ["Narxi qancha va yashirin to‘lovlar bormi?","How much is it and are there hidden fees?"],
    "Цена зависит от тарифа и размера дела. Поддержка и ежемесячный техосмотр входят в стоимость. Отдельно оплачивается только тепло-навигатор — и то лишь в тарифах «Старт» и «Бизнес».": ["Narx tarifga va ish hajmiga bogʻliq. Yordam va oylik texnik koʻrik narxga kiradi. Alohida faqat issiqlik-navigator toʻlanadi — u ham «Start» va «Biznes» tariflarida.","The price depends on the plan and the size of the business. Support and the monthly check-up are included. Only the heat navigator is paid for separately, and then only on the Start and Business plans."],
    "Вы работаете по всему Узбекистану?": ["Butun Oʻzbekiston boʻylab ishlaysizmi?","Do you work across Uzbekistan?"],
    "Да. Мы из Самарканда, подключаем по всей стране. Это наше, местное: мы знаем, что связь бывает плохой, что платят наличными и что в зале говорят по-узбекски.": ["Ha. Biz Samarqanddanmiz, butun mamlakat boʻylab ulaymiz. Bu bizning, mahalliy ishimiz: aloqa yomon boʻlishini, naqd toʻlanishini va zalda oʻzbekcha gapirilishini bilamiz.","Yes. We are from Samarkand and connect businesses all over the country. This is ours, made locally: we know the line can be bad, that people pay cash, and that the dining room speaks Uzbek."],
    "Новости": ["Yangiliklar","News"],
    "Новости и обновления": ["Yangiliklar va yangilanishlar","News & updates"],
    "Готовы навести порядок в цифрах?": ["Raqamlarni tartibga solishga tayyormisiz?","Ready to put your numbers in order?"],
    "Оставьте заявку — покажем OSHBOARD на примере вашего дела и посчитаем точную цену.": ["Ariza qoldiring — OSHBOARDni oʻz ishingiz misolida koʻrsatamiz va aniq narxni hisoblaymiz.","Leave a request — we’ll show OSHBOARD on your own business and work out the exact price."],
    "Бесплатная демонстрация на ваших данных": ["Sizning maʼlumotlaringizda bepul namoyish","A free demo on your own data"],
    "Перезвоним в течение 15 минут": ["15 daqiqa ichida qo‘ng‘iroq qilamiz","We’ll call back within 15 minutes"],
    "Поможем с запуском и обучением команды": ["Ishga tushirish va jamoani o‘qitishda yordam beramiz","We’ll help with launch and team training"],
    "Ваше имя": ["Ismingiz","Your name"],
    "Телефон": ["Telefon","Phone"],
    "Название дела": ["Ish nomi","Business name"],
    "Вид дела": ["Ish turi","Kind of business"],
    "Ресторан": ["Restoran","Restaurant"],
    "Кофейня": ["Qahvaxona","Coffee shop"],
    "Чайхана": ["Choyxona","Teahouse"],
    "Продуктовый магазин": ["Oziq-ovqat doʻkoni","Grocery shop"],
    "Аптека": ["Dorixona","Pharmacy"],
    "Магазин одежды": ["Kiyim doʻkoni","Clothing shop"],
    "Другое": ["Boshqa","Other"],
    "Отправить заявку": ["Ariza yuborish","Send request"],
    "Нажимая кнопку, вы соглашаетесь на обработку данных. Без спама.": ["Tugmani bosish orqali ma’lumotlarni qayta ishlashga rozilik bildirasiz. Spamsiz.","By clicking, you agree to data processing. No spam."],
    "Спасибо! Заявка принята — свяжемся с вами очень скоро.": ["Rahmat! Ariza qabul qilindi — tez orada siz bilan bogʻlanamiz.","Thank you! Your request is in — we’ll be in touch very soon."],
    "Программа учёта для ресторана, магазина, гостиницы и клининговой фирмы: касса, склад, персонал и отчёты в одном месте. Самарканд, Узбекистан.": ["Restoran, doʻkon, mehmonxona va klining firmasi uchun hisob dasturi: kassa, ombor, xodimlar va hisobotlar bir joyda. Samarqand, Oʻzbekiston.","Business software for restaurants, shops, hotels and cleaning firms: till, stock, staff and reports in one place. Samarkand, Uzbekistan."],
    "Продукт": ["Mahsulot","Product"],
    "Тепло-навигатор": ["Issiqlik-navigator","Heat navigator"],
    "Клиентам": ["Mijozlarga","For clients"],
    "Демо": ["Demo","Demo"],
    "Контакты": ["Kontaktlar","Contacts"],
    "© 2026 OSHBOARD. Все права защищены.": ["© 2026 OSHBOARD. Barcha huquqlar himoyalangan.","© 2026 OSHBOARD. All rights reserved."],
    "Азиз": ["Aziz","Aziz"],
    "Напр. Chaykhana Registon или «Дилноза» на Дагбитской": ["Masalan, Chaykhana Registon yoki Dagʻbit koʻchasidagi «Dilnoza»","e.g. Chaykhana Registon, or Dilnoza on Dagbitskaya"]
  };

  var OVERRIDES = {};   // правки из админки: { "<ru>": { ru, uz, en } }
  var currentLang = 'ru';

  function tr(ru, lang) {
    var ov = OVERRIDES[ru];
    if (ov && typeof ov[lang] === 'string' && ov[lang] !== '') return ov[lang];
    if (lang === 'ru') return ru;      // русский без правки — исходный текст
    var e = T[ru];
    if (!e) return ru;                 // нет перевода — остаётся русский
    return lang === 'uz' ? e[0] : e[1];
  }

  // --- собираем переводимые текстовые узлы (один раз, после отрисовки DOM) ---
  var nodes = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      var p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      var tag = p.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
      if (p.closest('#lang')) return NodeFilter.FILTER_REJECT;        // сам переключатель
      if (p.closest('.logo')) return NodeFilter.FILTER_REJECT;        // логотип (задаётся из админки)
      if (p.closest('[data-count]')) return NodeFilter.FILTER_REJECT; // анимированные числа
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  for (var n; (n = walker.nextNode());) {
    nodes.push({ node: n, ru: n.nodeValue });
  }

  var inputs = [];
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function (el) {
    inputs.push({ el: el, ru: el.getAttribute('placeholder') });
  });

  function apply(lang) {
    if (LANGS.indexOf(lang) === -1) lang = 'ru';
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    nodes.forEach(function (o) {
      var lead = o.ru.match(/^\s*/)[0];
      var trail = o.ru.match(/\s*$/)[0];
      var core = o.ru.trim();
      o.node.nodeValue = lead + tr(core, lang) + trail;
    });
    inputs.forEach(function (o) {
      o.el.setAttribute('placeholder', tr(o.ru.trim(), lang));
    });

    document.querySelectorAll('#lang [data-lang]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });

    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  // --- переключатель ---
  var sw = document.getElementById('lang');
  if (sw) {
    sw.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (b) apply(b.dataset.lang);
    });
  }

  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || 'ru');

  // подтягиваем правки текстов из админки и применяем поверх
  fetch('/api/content').then(function (r) { return r.json(); }).then(function (d) {
    if (d && d.ok && d.texts && Object.keys(d.texts).length) {
      OVERRIDES = d.texts;
      apply(currentLang);
    }
  }).catch(function () { /* сервер не запущен — базовых переводов достаточно */ });
})();
