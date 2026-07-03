-- ============================================================================
-- Datos semilla — Nivel A2 (52 términos oficiales)
-- Frases útiles del día a día, verbos frecuentes, ropa, casa, clima y
-- adjetivos comunes. Ejecutar después de supabase/schema.sql (y de
-- seed_a1.sql, aunque el orden entre ambos no importa).
--
-- Por convención, los ids de A2 empiezan por "2000...", para no chocar con
-- los de A1 ("1000..."). Para B1+ en el futuro, usa un prefijo "3000...".
-- ============================================================================

with datos (id, categoria, es, fr, pt, it) as (
  values
    -- Frases útiles del día a día
    ('20000000-0000-0000-0000-000000000001'::uuid, 'frases_utiles', '¿Dónde está el baño?', 'Où sont les toilettes ?', 'Onde fica a casa de banho?', 'Dov''è il bagno?'),
    ('20000000-0000-0000-0000-000000000002'::uuid, 'frases_utiles', '¿Cuánto cuesta?', 'Combien ça coûte ?', 'Quanto custa?', 'Quanto costa?'),
    ('20000000-0000-0000-0000-000000000003'::uuid, 'frases_utiles', 'No entiendo', 'Je ne comprends pas', 'Não percebo', 'Non capisco'),
    ('20000000-0000-0000-0000-000000000004'::uuid, 'frases_utiles', '¿Puedes repetir, por favor?', 'Pouvez-vous répéter, s''il vous plaît ?', 'Pode repetir, por favor?', 'Può ripetere, per favore?'),
    ('20000000-0000-0000-0000-000000000005'::uuid, 'frases_utiles', 'Estoy perdido', 'Je suis perdu', 'Estou perdido', 'Sono perso'),
    ('20000000-0000-0000-0000-000000000006'::uuid, 'frases_utiles', '¿A qué hora abre?', 'À quelle heure ça ouvre ?', 'A que horas abre?', 'A che ora apre?'),
    ('20000000-0000-0000-0000-000000000007'::uuid, 'frases_utiles', 'La cuenta, por favor', 'L''addition, s''il vous plaît', 'A conta, por favor', 'Il conto, per favore'),
    ('20000000-0000-0000-0000-000000000008'::uuid, 'frases_utiles', '¿Hablas inglés?', 'Parlez-vous anglais ?', 'Fala inglês?', 'Parli inglese?'),
    ('20000000-0000-0000-0000-000000000009'::uuid, 'frases_utiles', 'Necesito ayuda', 'J''ai besoin d''aide', 'Preciso de ajuda', 'Ho bisogno di aiuto'),
    ('20000000-0000-0000-0000-000000000010'::uuid, 'frases_utiles', '¿Dónde está la estación?', 'Où est la gare ?', 'Onde fica a estação?', 'Dov''è la stazione?'),

    -- Verbos frecuentes (infinitivo)
    ('20000000-0000-0000-0000-000000000011'::uuid, 'verbos', 'Poder', 'Pouvoir', 'Poder', 'Potere'),
    ('20000000-0000-0000-0000-000000000012'::uuid, 'verbos', 'Hacer', 'Faire', 'Fazer', 'Fare'),
    ('20000000-0000-0000-0000-000000000013'::uuid, 'verbos', 'Ir', 'Aller', 'Ir', 'Andare'),
    ('20000000-0000-0000-0000-000000000014'::uuid, 'verbos', 'Venir', 'Venir', 'Vir', 'Venire'),
    ('20000000-0000-0000-0000-000000000015'::uuid, 'verbos', 'Saber', 'Savoir', 'Saber', 'Sapere'),
    ('20000000-0000-0000-0000-000000000016'::uuid, 'verbos', 'Ver', 'Voir', 'Ver', 'Vedere'),
    ('20000000-0000-0000-0000-000000000017'::uuid, 'verbos', 'Dar', 'Donner', 'Dar', 'Dare'),
    ('20000000-0000-0000-0000-000000000018'::uuid, 'verbos', 'Decir', 'Dire', 'Dizer', 'Dire'),
    ('20000000-0000-0000-0000-000000000019'::uuid, 'verbos', 'Salir', 'Sortir', 'Sair', 'Uscire'),
    ('20000000-0000-0000-0000-000000000020'::uuid, 'verbos', 'Trabajar', 'Travailler', 'Trabalhar', 'Lavorare'),

    -- Ropa
    ('20000000-0000-0000-0000-000000000021'::uuid, 'ropa', 'Camisa', 'Chemise', 'Camisa', 'Camicia'),
    ('20000000-0000-0000-0000-000000000022'::uuid, 'ropa', 'Pantalón', 'Pantalon', 'Calças', 'Pantaloni'),
    ('20000000-0000-0000-0000-000000000023'::uuid, 'ropa', 'Zapatos', 'Chaussures', 'Sapatos', 'Scarpe'),
    ('20000000-0000-0000-0000-000000000024'::uuid, 'ropa', 'Chaqueta', 'Veste', 'Casaco', 'Giacca'),
    ('20000000-0000-0000-0000-000000000025'::uuid, 'ropa', 'Vestido', 'Robe', 'Vestido', 'Vestito'),
    ('20000000-0000-0000-0000-000000000026'::uuid, 'ropa', 'Sombrero', 'Chapeau', 'Chapéu', 'Cappello'),
    ('20000000-0000-0000-0000-000000000027'::uuid, 'ropa', 'Calcetines', 'Chaussettes', 'Meias', 'Calzini'),
    ('20000000-0000-0000-0000-000000000028'::uuid, 'ropa', 'Abrigo', 'Manteau', 'Sobretudo', 'Cappotto'),

    -- Casa
    ('20000000-0000-0000-0000-000000000029'::uuid, 'casa', 'Cocina', 'Cuisine', 'Cozinha', 'Cucina'),
    ('20000000-0000-0000-0000-000000000030'::uuid, 'casa', 'Dormitorio', 'Chambre', 'Quarto', 'Camera da letto'),
    ('20000000-0000-0000-0000-000000000031'::uuid, 'casa', 'Baño', 'Salle de bain', 'Casa de banho', 'Bagno'),
    ('20000000-0000-0000-0000-000000000032'::uuid, 'casa', 'Salón', 'Salon', 'Sala de estar', 'Soggiorno'),
    ('20000000-0000-0000-0000-000000000033'::uuid, 'casa', 'Jardín', 'Jardin', 'Jardim', 'Giardino'),
    ('20000000-0000-0000-0000-000000000034'::uuid, 'casa', 'Puerta', 'Porte', 'Porta', 'Porta'),
    ('20000000-0000-0000-0000-000000000035'::uuid, 'casa', 'Ventana', 'Fenêtre', 'Janela', 'Finestra'),
    ('20000000-0000-0000-0000-000000000036'::uuid, 'casa', 'Mesa', 'Table', 'Mesa', 'Tavolo'),

    -- Clima
    ('20000000-0000-0000-0000-000000000037'::uuid, 'clima', 'Sol', 'Soleil', 'Sol', 'Sole'),
    ('20000000-0000-0000-0000-000000000038'::uuid, 'clima', 'Lluvia', 'Pluie', 'Chuva', 'Pioggia'),
    ('20000000-0000-0000-0000-000000000039'::uuid, 'clima', 'Nieve', 'Neige', 'Neve', 'Neve'),
    ('20000000-0000-0000-0000-000000000040'::uuid, 'clima', 'Viento', 'Vent', 'Vento', 'Vento'),
    ('20000000-0000-0000-0000-000000000041'::uuid, 'clima', 'Calor', 'Chaleur', 'Calor', 'Caldo'),
    ('20000000-0000-0000-0000-000000000042'::uuid, 'clima', 'Frío', 'Froid', 'Frio', 'Freddo'),
    ('20000000-0000-0000-0000-000000000043'::uuid, 'clima', 'Nube', 'Nuage', 'Nuvem', 'Nuvola'),
    ('20000000-0000-0000-0000-000000000044'::uuid, 'clima', 'Tormenta', 'Orage', 'Tempestade', 'Temporale'),

    -- Adjetivos comunes
    ('20000000-0000-0000-0000-000000000045'::uuid, 'adjetivos', 'Grande', 'Grand', 'Grande', 'Grande'),
    ('20000000-0000-0000-0000-000000000046'::uuid, 'adjetivos', 'Pequeño', 'Petit', 'Pequeno', 'Piccolo'),
    ('20000000-0000-0000-0000-000000000047'::uuid, 'adjetivos', 'Rápido', 'Rapide', 'Rápido', 'Veloce'),
    ('20000000-0000-0000-0000-000000000048'::uuid, 'adjetivos', 'Lento', 'Lent', 'Lento', 'Lento'),
    ('20000000-0000-0000-0000-000000000049'::uuid, 'adjetivos', 'Feliz', 'Heureux', 'Feliz', 'Felice'),
    ('20000000-0000-0000-0000-000000000050'::uuid, 'adjetivos', 'Triste', 'Triste', 'Triste', 'Triste'),
    ('20000000-0000-0000-0000-000000000051'::uuid, 'adjetivos', 'Fácil', 'Facile', 'Fácil', 'Facile'),
    ('20000000-0000-0000-0000-000000000052'::uuid, 'adjetivos', 'Difícil', 'Difficile', 'Difícil', 'Difficile')
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
on conflict (term_id, language_code) do nothing;
