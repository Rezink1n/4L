-- ============================================================================
-- Datos semilla — Nivel A2 (52 términos oficiales, 6 idiomas)
-- Frases útiles del día a día, verbos frecuentes, ropa, casa, clima y
-- adjetivos comunes. Ejecutar después de supabase/schema.sql (y de
-- seed_a1.sql, aunque el orden entre ambos no importa).
--
-- Por convención, los ids de A2 empiezan por "2000...", para no chocar con
-- los de A1 ("1000..."). Para B1+ en el futuro, usa un prefijo "3000...".
-- Ver también supabase/seed_a2_ampliacion.sql (93 términos A2 adicionales).
-- ============================================================================

with datos (id, categoria, es, fr, pt, it, en, de) as (
  values
    -- Frases útiles del día a día
    ('20000000-0000-0000-0000-000000000001'::uuid, 'frases_utiles', '¿Dónde está el baño?', 'Où sont les toilettes ?', 'Onde fica a casa de banho?', 'Dov''è il bagno?', 'Where is the bathroom?', 'Wo ist die Toilette?'),
    ('20000000-0000-0000-0000-000000000002'::uuid, 'frases_utiles', '¿Cuánto cuesta?', 'Combien ça coûte ?', 'Quanto custa?', 'Quanto costa?', 'How much does it cost?', 'Wie viel kostet das?'),
    ('20000000-0000-0000-0000-000000000003'::uuid, 'frases_utiles', 'No entiendo', 'Je ne comprends pas', 'Não percebo', 'Non capisco', 'I don''t understand', 'Ich verstehe nicht'),
    ('20000000-0000-0000-0000-000000000004'::uuid, 'frases_utiles', '¿Puedes repetir, por favor?', 'Pouvez-vous répéter, s''il vous plaît ?', 'Pode repetir, por favor?', 'Può ripetere, per favore?', 'Can you repeat, please?', 'Kannst du das bitte wiederholen?'),
    ('20000000-0000-0000-0000-000000000005'::uuid, 'frases_utiles', 'Estoy perdido', 'Je suis perdu', 'Estou perdido', 'Sono perso', 'I am lost', 'Ich habe mich verlaufen'),
    ('20000000-0000-0000-0000-000000000006'::uuid, 'frases_utiles', '¿A qué hora abre?', 'À quelle heure ça ouvre ?', 'A que horas abre?', 'A che ora apre?', 'What time does it open?', 'Wann öffnet es?'),
    ('20000000-0000-0000-0000-000000000007'::uuid, 'frases_utiles', 'La cuenta, por favor', 'L''addition, s''il vous plaît', 'A conta, por favor', 'Il conto, per favore', 'The bill, please', 'Die Rechnung, bitte'),
    ('20000000-0000-0000-0000-000000000008'::uuid, 'frases_utiles', '¿Hablas inglés?', 'Parlez-vous anglais ?', 'Fala inglês?', 'Parli inglese?', 'Do you speak English?', 'Sprichst du Englisch?'),
    ('20000000-0000-0000-0000-000000000009'::uuid, 'frases_utiles', 'Necesito ayuda', 'J''ai besoin d''aide', 'Preciso de ajuda', 'Ho bisogno di aiuto', 'I need help', 'Ich brauche Hilfe'),
    ('20000000-0000-0000-0000-000000000010'::uuid, 'frases_utiles', '¿Dónde está la estación?', 'Où est la gare ?', 'Onde fica a estação?', 'Dov''è la stazione?', 'Where is the station?', 'Wo ist der Bahnhof?'),

    -- Verbos frecuentes (infinitivo)
    ('20000000-0000-0000-0000-000000000011'::uuid, 'verbos', 'Poder', 'Pouvoir', 'Poder', 'Potere', 'To be able to', 'Können'),
    ('20000000-0000-0000-0000-000000000012'::uuid, 'verbos', 'Hacer', 'Faire', 'Fazer', 'Fare', 'To do', 'Machen'),
    ('20000000-0000-0000-0000-000000000013'::uuid, 'verbos', 'Ir', 'Aller', 'Ir', 'Andare', 'To go', 'Gehen'),
    ('20000000-0000-0000-0000-000000000014'::uuid, 'verbos', 'Venir', 'Venir', 'Vir', 'Venire', 'To come', 'Kommen'),
    ('20000000-0000-0000-0000-000000000015'::uuid, 'verbos', 'Saber', 'Savoir', 'Saber', 'Sapere', 'To know', 'Wissen'),
    ('20000000-0000-0000-0000-000000000016'::uuid, 'verbos', 'Ver', 'Voir', 'Ver', 'Vedere', 'To see', 'Sehen'),
    ('20000000-0000-0000-0000-000000000017'::uuid, 'verbos', 'Dar', 'Donner', 'Dar', 'Dare', 'To give', 'Geben'),
    ('20000000-0000-0000-0000-000000000018'::uuid, 'verbos', 'Decir', 'Dire', 'Dizer', 'Dire', 'To say', 'Sagen'),
    ('20000000-0000-0000-0000-000000000019'::uuid, 'verbos', 'Salir', 'Sortir', 'Sair', 'Uscire', 'To go out', 'Ausgehen'),
    ('20000000-0000-0000-0000-000000000020'::uuid, 'verbos', 'Trabajar', 'Travailler', 'Trabalhar', 'Lavorare', 'To work', 'Arbeiten'),

    -- Ropa
    ('20000000-0000-0000-0000-000000000021'::uuid, 'ropa', 'Camisa', 'Chemise', 'Camisa', 'Camicia', 'Shirt', 'Hemd'),
    ('20000000-0000-0000-0000-000000000022'::uuid, 'ropa', 'Pantalón', 'Pantalon', 'Calças', 'Pantaloni', 'Trousers', 'Hose'),
    ('20000000-0000-0000-0000-000000000023'::uuid, 'ropa', 'Zapatos', 'Chaussures', 'Sapatos', 'Scarpe', 'Shoes', 'Schuhe'),
    ('20000000-0000-0000-0000-000000000024'::uuid, 'ropa', 'Chaqueta', 'Veste', 'Casaco', 'Giacca', 'Jacket', 'Jacke'),
    ('20000000-0000-0000-0000-000000000025'::uuid, 'ropa', 'Vestido', 'Robe', 'Vestido', 'Vestito', 'Dress', 'Kleid'),
    ('20000000-0000-0000-0000-000000000026'::uuid, 'ropa', 'Sombrero', 'Chapeau', 'Chapéu', 'Cappello', 'Hat', 'Hut'),
    ('20000000-0000-0000-0000-000000000027'::uuid, 'ropa', 'Calcetines', 'Chaussettes', 'Meias', 'Calzini', 'Socks', 'Socken'),
    ('20000000-0000-0000-0000-000000000028'::uuid, 'ropa', 'Abrigo', 'Manteau', 'Sobretudo', 'Cappotto', 'Coat', 'Mantel'),

    -- Casa
    ('20000000-0000-0000-0000-000000000029'::uuid, 'casa', 'Cocina', 'Cuisine', 'Cozinha', 'Cucina', 'Kitchen', 'Küche'),
    ('20000000-0000-0000-0000-000000000030'::uuid, 'casa', 'Dormitorio', 'Chambre', 'Quarto', 'Camera da letto', 'Bedroom', 'Schlafzimmer'),
    ('20000000-0000-0000-0000-000000000031'::uuid, 'casa', 'Baño', 'Salle de bain', 'Casa de banho', 'Bagno', 'Bathroom', 'Badezimmer'),
    ('20000000-0000-0000-0000-000000000032'::uuid, 'casa', 'Salón', 'Salon', 'Sala de estar', 'Soggiorno', 'Living room', 'Wohnzimmer'),
    ('20000000-0000-0000-0000-000000000033'::uuid, 'casa', 'Jardín', 'Jardin', 'Jardim', 'Giardino', 'Garden', 'Garten'),
    ('20000000-0000-0000-0000-000000000034'::uuid, 'casa', 'Puerta', 'Porte', 'Porta', 'Porta', 'Door', 'Tür'),
    ('20000000-0000-0000-0000-000000000035'::uuid, 'casa', 'Ventana', 'Fenêtre', 'Janela', 'Finestra', 'Window', 'Fenster'),
    ('20000000-0000-0000-0000-000000000036'::uuid, 'casa', 'Mesa', 'Table', 'Mesa', 'Tavolo', 'Table', 'Tisch'),

    -- Clima
    ('20000000-0000-0000-0000-000000000037'::uuid, 'clima', 'Sol', 'Soleil', 'Sol', 'Sole', 'Sun', 'Sonne'),
    ('20000000-0000-0000-0000-000000000038'::uuid, 'clima', 'Lluvia', 'Pluie', 'Chuva', 'Pioggia', 'Rain', 'Regen'),
    ('20000000-0000-0000-0000-000000000039'::uuid, 'clima', 'Nieve', 'Neige', 'Neve', 'Neve', 'Snow', 'Schnee'),
    ('20000000-0000-0000-0000-000000000040'::uuid, 'clima', 'Viento', 'Vent', 'Vento', 'Vento', 'Wind', 'Wind'),
    ('20000000-0000-0000-0000-000000000041'::uuid, 'clima', 'Calor', 'Chaleur', 'Calor', 'Caldo', 'Heat', 'Hitze'),
    ('20000000-0000-0000-0000-000000000042'::uuid, 'clima', 'Frío', 'Froid', 'Frio', 'Freddo', 'Cold', 'Kälte'),
    ('20000000-0000-0000-0000-000000000043'::uuid, 'clima', 'Nube', 'Nuage', 'Nuvem', 'Nuvola', 'Cloud', 'Wolke'),
    ('20000000-0000-0000-0000-000000000044'::uuid, 'clima', 'Tormenta', 'Orage', 'Tempestade', 'Temporale', 'Storm', 'Sturm'),

    -- Adjetivos comunes
    ('20000000-0000-0000-0000-000000000045'::uuid, 'adjetivos', 'Grande', 'Grand', 'Grande', 'Grande', 'Big', 'Groß'),
    ('20000000-0000-0000-0000-000000000046'::uuid, 'adjetivos', 'Pequeño', 'Petit', 'Pequeno', 'Piccolo', 'Small', 'Klein'),
    ('20000000-0000-0000-0000-000000000047'::uuid, 'adjetivos', 'Rápido', 'Rapide', 'Rápido', 'Veloce', 'Fast', 'Schnell'),
    ('20000000-0000-0000-0000-000000000048'::uuid, 'adjetivos', 'Lento', 'Lent', 'Lento', 'Lento', 'Slow', 'Langsam'),
    ('20000000-0000-0000-0000-000000000049'::uuid, 'adjetivos', 'Feliz', 'Heureux', 'Feliz', 'Felice', 'Happy', 'Glücklich'),
    ('20000000-0000-0000-0000-000000000050'::uuid, 'adjetivos', 'Triste', 'Triste', 'Triste', 'Triste', 'Sad', 'Traurig'),
    ('20000000-0000-0000-0000-000000000051'::uuid, 'adjetivos', 'Fácil', 'Facile', 'Fácil', 'Facile', 'Easy', 'Einfach'),
    ('20000000-0000-0000-0000-000000000052'::uuid, 'adjetivos', 'Difícil', 'Difficile', 'Difícil', 'Difficile', 'Difficult', 'Schwierig')
),
insertar_terminos as (
  insert into public.terms (id, level, category, is_official, owner_id)
  select id, 'A2', categoria, true, null from datos
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
