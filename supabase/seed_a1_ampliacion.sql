-- ============================================================================
-- Ampliación de vocabulario — Nivel A1 (108 términos oficiales adicionales)
-- Números 11-100, familia extendida, más colores y comida, verbos frecuentes,
-- tiempo y fechas, cuerpo, lugares, transporte y animales.
-- Ejecutar después de supabase/schema.sql y supabase/seed_a1.sql.
--
-- Los ids de esta ampliación empiezan por "1100...", para no chocar con los
-- 55 términos originales de seed_a1.sql ("1000...").
-- ============================================================================

with datos (id, categoria, es, fr, pt, it, en, de) as (
  values
    ('11000000-0000-0000-0000-000000000001'::uuid, 'numeros', 'Once', 'Onze', 'Onze', 'Undici', 'Eleven', 'Elf'),
    ('11000000-0000-0000-0000-000000000002'::uuid, 'numeros', 'Doce', 'Douze', 'Doze', 'Dodici', 'Twelve', 'Zwölf'),
    ('11000000-0000-0000-0000-000000000003'::uuid, 'numeros', 'Trece', 'Treize', 'Treze', 'Tredici', 'Thirteen', 'Dreizehn'),
    ('11000000-0000-0000-0000-000000000004'::uuid, 'numeros', 'Catorce', 'Quatorze', 'Catorze', 'Quattordici', 'Fourteen', 'Vierzehn'),
    ('11000000-0000-0000-0000-000000000005'::uuid, 'numeros', 'Quince', 'Quinze', 'Quinze', 'Quindici', 'Fifteen', 'Fünfzehn'),
    ('11000000-0000-0000-0000-000000000006'::uuid, 'numeros', 'Dieciséis', 'Seize', 'Dezasseis', 'Sedici', 'Sixteen', 'Sechzehn'),
    ('11000000-0000-0000-0000-000000000007'::uuid, 'numeros', 'Diecisiete', 'Dix-sept', 'Dezassete', 'Diciassette', 'Seventeen', 'Siebzehn'),
    ('11000000-0000-0000-0000-000000000008'::uuid, 'numeros', 'Dieciocho', 'Dix-huit', 'Dezoito', 'Diciotto', 'Eighteen', 'Achtzehn'),
    ('11000000-0000-0000-0000-000000000009'::uuid, 'numeros', 'Diecinueve', 'Dix-neuf', 'Dezanove', 'Diciannove', 'Nineteen', 'Neunzehn'),
    ('11000000-0000-0000-0000-000000000010'::uuid, 'numeros', 'Veinte', 'Vingt', 'Vinte', 'Venti', 'Twenty', 'Zwanzig'),
    ('11000000-0000-0000-0000-000000000011'::uuid, 'numeros', 'Treinta', 'Trente', 'Trinta', 'Trenta', 'Thirty', 'Dreißig'),
    ('11000000-0000-0000-0000-000000000012'::uuid, 'numeros', 'Cuarenta', 'Quarante', 'Quarenta', 'Quaranta', 'Forty', 'Vierzig'),
    ('11000000-0000-0000-0000-000000000013'::uuid, 'numeros', 'Cincuenta', 'Cinquante', 'Cinquenta', 'Cinquanta', 'Fifty', 'Fünfzig'),
    ('11000000-0000-0000-0000-000000000014'::uuid, 'numeros', 'Sesenta', 'Soixante', 'Sessenta', 'Sessanta', 'Sixty', 'Sechzig'),
    ('11000000-0000-0000-0000-000000000015'::uuid, 'numeros', 'Setenta', 'Soixante-dix', 'Setenta', 'Settanta', 'Seventy', 'Siebzig'),
    ('11000000-0000-0000-0000-000000000016'::uuid, 'numeros', 'Ochenta', 'Quatre-vingts', 'Oitenta', 'Ottanta', 'Eighty', 'Achtzig'),
    ('11000000-0000-0000-0000-000000000017'::uuid, 'numeros', 'Noventa', 'Quatre-vingt-dix', 'Noventa', 'Novanta', 'Ninety', 'Neunzig'),
    ('11000000-0000-0000-0000-000000000018'::uuid, 'numeros', 'Cien', 'Cent', 'Cem', 'Cento', 'Hundred', 'Hundert'),

    ('11000000-0000-0000-0000-000000000019'::uuid, 'familia', 'Esposo', 'Mari', 'Marido', 'Marito', 'Husband', 'Ehemann'),
    ('11000000-0000-0000-0000-000000000020'::uuid, 'familia', 'Esposa', 'Épouse', 'Esposa', 'Moglie', 'Wife', 'Ehefrau'),
    ('11000000-0000-0000-0000-000000000021'::uuid, 'familia', 'Tío', 'Oncle', 'Tio', 'Zio', 'Uncle', 'Onkel'),
    ('11000000-0000-0000-0000-000000000022'::uuid, 'familia', 'Tía', 'Tante', 'Tia', 'Zia', 'Aunt', 'Tante'),
    ('11000000-0000-0000-0000-000000000023'::uuid, 'familia', 'Primo', 'Cousin', 'Primo', 'Cugino', 'Cousin', 'Cousin'),
    ('11000000-0000-0000-0000-000000000024'::uuid, 'familia', 'Prima', 'Cousine', 'Prima', 'Cugina', 'Cousin', 'Cousine'),
    ('11000000-0000-0000-0000-000000000025'::uuid, 'familia', 'Nieto', 'Petit-fils', 'Neto', 'Nipote', 'Grandson', 'Enkel'),
    ('11000000-0000-0000-0000-000000000026'::uuid, 'familia', 'Nieta', 'Petite-fille', 'Neta', 'Nipote', 'Granddaughter', 'Enkelin'),
    ('11000000-0000-0000-0000-000000000027'::uuid, 'familia', 'Bebé', 'Bébé', 'Bebé', 'Bebè', 'Baby', 'Baby'),

    ('11000000-0000-0000-0000-000000000028'::uuid, 'colores', 'Rosa', 'Rose', 'Rosa', 'Rosa', 'Pink', 'Rosa'),
    ('11000000-0000-0000-0000-000000000029'::uuid, 'colores', 'Marrón', 'Marron', 'Castanho', 'Marrone', 'Brown', 'Braun'),
    ('11000000-0000-0000-0000-000000000030'::uuid, 'colores', 'Gris', 'Gris', 'Cinzento', 'Grigio', 'Grey', 'Grau'),
    ('11000000-0000-0000-0000-000000000031'::uuid, 'colores', 'Naranja', 'Orange', 'Laranja', 'Arancione', 'Orange', 'Orange'),
    ('11000000-0000-0000-0000-000000000032'::uuid, 'colores', 'Morado', 'Violet', 'Roxo', 'Viola', 'Purple', 'Lila'),

    ('11000000-0000-0000-0000-000000000033'::uuid, 'comida', 'Huevo', 'Œuf', 'Ovo', 'Uovo', 'Egg', 'Ei'),
    ('11000000-0000-0000-0000-000000000034'::uuid, 'comida', 'Pescado', 'Poisson', 'Peixe', 'Pesce', 'Fish', 'Fisch'),
    ('11000000-0000-0000-0000-000000000035'::uuid, 'comida', 'Verdura', 'Légume', 'Legume', 'Verdura', 'Vegetable', 'Gemüse'),
    ('11000000-0000-0000-0000-000000000036'::uuid, 'comida', 'Fruta', 'Fruit', 'Fruta', 'Frutta', 'Fruit', 'Obst'),
    ('11000000-0000-0000-0000-000000000037'::uuid, 'comida', 'Sal', 'Sel', 'Sal', 'Sale', 'Salt', 'Salz'),
    ('11000000-0000-0000-0000-000000000038'::uuid, 'comida', 'Azúcar', 'Sucre', 'Açúcar', 'Zucchero', 'Sugar', 'Zucker'),
    ('11000000-0000-0000-0000-000000000039'::uuid, 'comida', 'Mantequilla', 'Beurre', 'Manteiga', 'Burro', 'Butter', 'Butter'),
    ('11000000-0000-0000-0000-000000000040'::uuid, 'comida', 'Jamón', 'Jambon', 'Presunto', 'Prosciutto', 'Ham', 'Schinken'),
    ('11000000-0000-0000-0000-000000000041'::uuid, 'comida', 'Sopa', 'Soupe', 'Sopa', 'Zuppa', 'Soup', 'Suppe'),
    ('11000000-0000-0000-0000-000000000042'::uuid, 'comida', 'Plátano', 'Banane', 'Banana', 'Banana', 'Banana', 'Banane'),

    ('11000000-0000-0000-0000-000000000043'::uuid, 'verbos', 'Dormir', 'Dormir', 'Dormir', 'Dormire', 'To sleep', 'Schlafen'),
    ('11000000-0000-0000-0000-000000000044'::uuid, 'verbos', 'Entender', 'Comprendre', 'Entender', 'Capire', 'To understand', 'Verstehen'),
    ('11000000-0000-0000-0000-000000000045'::uuid, 'verbos', 'Estudiar', 'Étudier', 'Estudar', 'Studiare', 'To study', 'Studieren'),
    ('11000000-0000-0000-0000-000000000046'::uuid, 'verbos', 'Caminar', 'Marcher', 'Caminhar', 'Camminare', 'To walk', 'Laufen'),
    ('11000000-0000-0000-0000-000000000047'::uuid, 'verbos', 'Escuchar', 'Écouter', 'Escutar', 'Ascoltare', 'To listen', 'Hören'),
    ('11000000-0000-0000-0000-000000000048'::uuid, 'verbos', 'Mirar', 'Regarder', 'Olhar', 'Guardare', 'To look', 'Schauen'),
    ('11000000-0000-0000-0000-000000000049'::uuid, 'verbos', 'Escribir', 'Écrire', 'Escrever', 'Scrivere', 'To write', 'Schreiben'),
    ('11000000-0000-0000-0000-000000000050'::uuid, 'verbos', 'Leer', 'Lire', 'Ler', 'Leggere', 'To read', 'Lesen'),
    ('11000000-0000-0000-0000-000000000051'::uuid, 'verbos', 'Jugar', 'Jouer', 'Jogar', 'Giocare', 'To play', 'Spielen'),
    ('11000000-0000-0000-0000-000000000052'::uuid, 'verbos', 'Comprar', 'Acheter', 'Comprar', 'Comprare', 'To buy', 'Kaufen'),
    ('11000000-0000-0000-0000-000000000053'::uuid, 'verbos', 'Ayudar', 'Aider', 'Ajudar', 'Aiutare', 'To help', 'Helfen'),
    ('11000000-0000-0000-0000-000000000054'::uuid, 'verbos', 'Llegar', 'Arriver', 'Chegar', 'Arrivare', 'To arrive', 'Ankommen'),
    ('11000000-0000-0000-0000-000000000055'::uuid, 'verbos', 'Abrir', 'Ouvrir', 'Abrir', 'Aprire', 'To open', 'Öffnen'),
    ('11000000-0000-0000-0000-000000000056'::uuid, 'verbos', 'Cerrar', 'Fermer', 'Fechar', 'Chiudere', 'To close', 'Schließen'),

    ('11000000-0000-0000-0000-000000000057'::uuid, 'tiempo_fechas', 'Hoy', 'Aujourd''hui', 'Hoje', 'Oggi', 'Today', 'Heute'),
    ('11000000-0000-0000-0000-000000000058'::uuid, 'tiempo_fechas', 'Mañana', 'Demain', 'Amanhã', 'Domani', 'Tomorrow', 'Morgen'),
    ('11000000-0000-0000-0000-000000000059'::uuid, 'tiempo_fechas', 'Ayer', 'Hier', 'Ontem', 'Ieri', 'Yesterday', 'Gestern'),
    ('11000000-0000-0000-0000-000000000060'::uuid, 'tiempo_fechas', 'Semana', 'Semaine', 'Semana', 'Settimana', 'Week', 'Woche'),
    ('11000000-0000-0000-0000-000000000061'::uuid, 'tiempo_fechas', 'Mes', 'Mois', 'Mês', 'Mese', 'Month', 'Monat'),
    ('11000000-0000-0000-0000-000000000062'::uuid, 'tiempo_fechas', 'Año', 'Année', 'Ano', 'Anno', 'Year', 'Jahr'),
    ('11000000-0000-0000-0000-000000000063'::uuid, 'tiempo_fechas', 'Día', 'Jour', 'Dia', 'Giorno', 'Day', 'Tag'),
    ('11000000-0000-0000-0000-000000000064'::uuid, 'tiempo_fechas', 'Hora', 'Heure', 'Hora', 'Ora', 'Hour', 'Stunde'),
    ('11000000-0000-0000-0000-000000000065'::uuid, 'tiempo_fechas', 'Minuto', 'Minute', 'Minuto', 'Minuto', 'Minute', 'Minute'),
    ('11000000-0000-0000-0000-000000000066'::uuid, 'tiempo_fechas', 'Lunes', 'Lundi', 'Segunda-feira', 'Lunedì', 'Monday', 'Montag'),
    ('11000000-0000-0000-0000-000000000067'::uuid, 'tiempo_fechas', 'Martes', 'Mardi', 'Terça-feira', 'Martedì', 'Tuesday', 'Dienstag'),
    ('11000000-0000-0000-0000-000000000068'::uuid, 'tiempo_fechas', 'Miércoles', 'Mercredi', 'Quarta-feira', 'Mercoledì', 'Wednesday', 'Mittwoch'),
    ('11000000-0000-0000-0000-000000000069'::uuid, 'tiempo_fechas', 'Jueves', 'Jeudi', 'Quinta-feira', 'Giovedì', 'Thursday', 'Donnerstag'),
    ('11000000-0000-0000-0000-000000000070'::uuid, 'tiempo_fechas', 'Viernes', 'Vendredi', 'Sexta-feira', 'Venerdì', 'Friday', 'Freitag'),
    ('11000000-0000-0000-0000-000000000071'::uuid, 'tiempo_fechas', 'Sábado', 'Samedi', 'Sábado', 'Sabato', 'Saturday', 'Samstag'),
    ('11000000-0000-0000-0000-000000000072'::uuid, 'tiempo_fechas', 'Domingo', 'Dimanche', 'Domingo', 'Domenica', 'Sunday', 'Sonntag'),

    ('11000000-0000-0000-0000-000000000073'::uuid, 'cuerpo', 'Cabeza', 'Tête', 'Cabeça', 'Testa', 'Head', 'Kopf'),
    ('11000000-0000-0000-0000-000000000074'::uuid, 'cuerpo', 'Mano', 'Main', 'Mão', 'Mano', 'Hand', 'Hand'),
    ('11000000-0000-0000-0000-000000000075'::uuid, 'cuerpo', 'Pie', 'Pied', 'Pé', 'Piede', 'Foot', 'Fuß'),
    ('11000000-0000-0000-0000-000000000076'::uuid, 'cuerpo', 'Ojo', 'Œil', 'Olho', 'Occhio', 'Eye', 'Auge'),
    ('11000000-0000-0000-0000-000000000077'::uuid, 'cuerpo', 'Boca', 'Bouche', 'Boca', 'Bocca', 'Mouth', 'Mund'),
    ('11000000-0000-0000-0000-000000000078'::uuid, 'cuerpo', 'Nariz', 'Nez', 'Nariz', 'Naso', 'Nose', 'Nase'),
    ('11000000-0000-0000-0000-000000000079'::uuid, 'cuerpo', 'Oreja', 'Oreille', 'Orelha', 'Orecchio', 'Ear', 'Ohr'),
    ('11000000-0000-0000-0000-000000000080'::uuid, 'cuerpo', 'Brazo', 'Bras', 'Braço', 'Braccio', 'Arm', 'Arm'),
    ('11000000-0000-0000-0000-000000000081'::uuid, 'cuerpo', 'Pierna', 'Jambe', 'Perna', 'Gamba', 'Leg', 'Bein'),
    ('11000000-0000-0000-0000-000000000082'::uuid, 'cuerpo', 'Pelo', 'Cheveux', 'Cabelo', 'Capelli', 'Hair', 'Haar'),

    ('11000000-0000-0000-0000-000000000083'::uuid, 'lugares', 'Casa', 'Maison', 'Casa', 'Casa', 'House', 'Haus'),
    ('11000000-0000-0000-0000-000000000084'::uuid, 'lugares', 'Escuela', 'École', 'Escola', 'Scuola', 'School', 'Schule'),
    ('11000000-0000-0000-0000-000000000085'::uuid, 'lugares', 'Ciudad', 'Ville', 'Cidade', 'Città', 'City', 'Stadt'),
    ('11000000-0000-0000-0000-000000000086'::uuid, 'lugares', 'Calle', 'Rue', 'Rua', 'Strada', 'Street', 'Straße'),
    ('11000000-0000-0000-0000-000000000087'::uuid, 'lugares', 'Parque', 'Parc', 'Parque', 'Parco', 'Park', 'Park'),
    ('11000000-0000-0000-0000-000000000088'::uuid, 'lugares', 'Tienda', 'Magasin', 'Loja', 'Negozio', 'Shop', 'Geschäft'),
    ('11000000-0000-0000-0000-000000000089'::uuid, 'lugares', 'Hospital', 'Hôpital', 'Hospital', 'Ospedale', 'Hospital', 'Krankenhaus'),
    ('11000000-0000-0000-0000-000000000090'::uuid, 'lugares', 'Restaurante', 'Restaurant', 'Restaurante', 'Ristorante', 'Restaurant', 'Restaurant'),
    ('11000000-0000-0000-0000-000000000091'::uuid, 'lugares', 'Aeropuerto', 'Aéroport', 'Aeroporto', 'Aeroporto', 'Airport', 'Flughafen'),
    ('11000000-0000-0000-0000-000000000092'::uuid, 'lugares', 'Hotel', 'Hôtel', 'Hotel', 'Hotel', 'Hotel', 'Hotel'),

    ('11000000-0000-0000-0000-000000000093'::uuid, 'transporte', 'Coche', 'Voiture', 'Carro', 'Macchina', 'Car', 'Auto'),
    ('11000000-0000-0000-0000-000000000094'::uuid, 'transporte', 'Autobús', 'Bus', 'Autocarro', 'Autobus', 'Bus', 'Bus'),
    ('11000000-0000-0000-0000-000000000095'::uuid, 'transporte', 'Tren', 'Train', 'Comboio', 'Treno', 'Train', 'Zug'),
    ('11000000-0000-0000-0000-000000000096'::uuid, 'transporte', 'Avión', 'Avion', 'Avião', 'Aereo', 'Plane', 'Flugzeug'),
    ('11000000-0000-0000-0000-000000000097'::uuid, 'transporte', 'Bicicleta', 'Vélo', 'Bicicleta', 'Bicicletta', 'Bicycle', 'Fahrrad'),
    ('11000000-0000-0000-0000-000000000098'::uuid, 'transporte', 'Taxi', 'Taxi', 'Táxi', 'Taxi', 'Taxi', 'Taxi'),
    ('11000000-0000-0000-0000-000000000099'::uuid, 'transporte', 'Barco', 'Bateau', 'Barco', 'Barca', 'Boat', 'Boot'),
    ('11000000-0000-0000-0000-000000000100'::uuid, 'transporte', 'Metro', 'Métro', 'Metro', 'Metropolitana', 'Subway', 'U-Bahn'),

    ('11000000-0000-0000-0000-000000000101'::uuid, 'animales', 'Perro', 'Chien', 'Cão', 'Cane', 'Dog', 'Hund'),
    ('11000000-0000-0000-0000-000000000102'::uuid, 'animales', 'Gato', 'Chat', 'Gato', 'Gatto', 'Cat', 'Katze'),
    ('11000000-0000-0000-0000-000000000103'::uuid, 'animales', 'Pájaro', 'Oiseau', 'Pássaro', 'Uccello', 'Bird', 'Vogel'),
    ('11000000-0000-0000-0000-000000000104'::uuid, 'animales', 'Pez', 'Poisson', 'Peixe', 'Pesce', 'Fish', 'Fisch'),
    ('11000000-0000-0000-0000-000000000105'::uuid, 'animales', 'Caballo', 'Cheval', 'Cavalo', 'Cavallo', 'Horse', 'Pferd'),
    ('11000000-0000-0000-0000-000000000106'::uuid, 'animales', 'Vaca', 'Vache', 'Vaca', 'Mucca', 'Cow', 'Kuh'),
    ('11000000-0000-0000-0000-000000000107'::uuid, 'animales', 'Ratón', 'Souris', 'Rato', 'Topo', 'Mouse', 'Maus'),
    ('11000000-0000-0000-0000-000000000108'::uuid, 'animales', 'León', 'Lion', 'Leão', 'Leone', 'Lion', 'Löwe')
),
insertar_terminos as (
  insert into public.terms (id, level, category, is_official, owner_id)
  select id, 'A1', categoria, true, null from datos
  on conflict (id) do nothing
  returning id
)
insert into public.translations (term_id, language_code, text)
select id, 'es', es from datos
union all select id, 'fr', fr from datos
union all select id, 'pt', pt from datos
union all select id, 'it', it from datos
union all select id, 'en', en from datos
union all select id, 'de', de from datos
on conflict (term_id, language_code) do nothing;
