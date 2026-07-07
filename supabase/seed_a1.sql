-- ============================================================================
-- Datos semilla — Nivel A1 (55 términos oficiales, 6 idiomas)
-- Saludos, presentaciones, números, familia, colores, comida y verbos
-- frecuentes. Ejecutar después de supabase/schema.sql.
--
-- Para ampliar: añade más filas al VALUES de "datos" con un id que no
-- choque con los ya usados (por convención, los de A1 empiezan por "1000...").
-- Ver también supabase/seed_a1_ampliacion.sql (108 términos A1 adicionales).
-- No hace falta tocar nada más: terms y translations se rellenan solos.
-- ============================================================================

with datos (id, categoria, es, fr, pt, it, en, de) as (
  values
    -- Saludos y cortesía
    ('10000000-0000-0000-0000-000000000001'::uuid, 'saludos', 'Hola', 'Bonjour', 'Olá', 'Ciao', 'Hello', 'Hallo'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'saludos', 'Adiós', 'Au revoir', 'Adeus', 'Arrivederci', 'Goodbye', 'Auf Wiedersehen'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'saludos', 'Buenos días', 'Bonjour', 'Bom dia', 'Buongiorno', 'Good morning', 'Guten Morgen'),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'saludos', 'Buenas tardes', 'Bon après-midi', 'Boa tarde', 'Buon pomeriggio', 'Good afternoon', 'Guten Tag'),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'saludos', 'Buenas noches', 'Bonne nuit', 'Boa noite', 'Buonanotte', 'Good night', 'Gute Nacht'),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'saludos', 'Por favor', 'S''il vous plaît', 'Por favor', 'Per favore', 'Please', 'Bitte'),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'saludos', 'Gracias', 'Merci', 'Obrigado', 'Grazie', 'Thank you', 'Danke'),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'saludos', 'De nada', 'De rien', 'De nada', 'Prego', 'You''re welcome', 'Bitte schön'),

    -- Presentaciones
    ('10000000-0000-0000-0000-000000000009'::uuid, 'presentaciones', 'Me llamo...', 'Je m''appelle...', 'Chamo-me...', 'Mi chiamo...', 'My name is...', 'Ich heiße...'),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'presentaciones', '¿Cómo te llamas?', 'Comment tu t''appelles ?', 'Como te chamas?', 'Come ti chiami?', 'What''s your name?', 'Wie heißt du?'),
    ('10000000-0000-0000-0000-000000000011'::uuid, 'presentaciones', 'Mucho gusto', 'Enchanté', 'Muito prazer', 'Piacere', 'Nice to meet you', 'Freut mich'),
    ('10000000-0000-0000-0000-000000000012'::uuid, 'presentaciones', '¿Cómo estás?', 'Comment ça va ?', 'Como estás?', 'Come stai?', 'How are you?', 'Wie geht es dir?'),
    ('10000000-0000-0000-0000-000000000013'::uuid, 'presentaciones', 'Bien, gracias', 'Bien, merci', 'Bem, obrigado', 'Bene, grazie', 'Fine, thank you', 'Gut, danke'),
    ('10000000-0000-0000-0000-000000000014'::uuid, 'presentaciones', 'Hasta luego', 'À bientôt', 'Até logo', 'A dopo', 'See you later', 'Bis später'),

    -- Números 0-10
    ('10000000-0000-0000-0000-000000000015'::uuid, 'numeros', 'Cero', 'Zéro', 'Zero', 'Zero', 'Zero', 'Null'),
    ('10000000-0000-0000-0000-000000000016'::uuid, 'numeros', 'Uno', 'Un', 'Um', 'Uno', 'One', 'Eins'),
    ('10000000-0000-0000-0000-000000000017'::uuid, 'numeros', 'Dos', 'Deux', 'Dois', 'Due', 'Two', 'Zwei'),
    ('10000000-0000-0000-0000-000000000018'::uuid, 'numeros', 'Tres', 'Trois', 'Três', 'Tre', 'Three', 'Drei'),
    ('10000000-0000-0000-0000-000000000019'::uuid, 'numeros', 'Cuatro', 'Quatre', 'Quatro', 'Quattro', 'Four', 'Vier'),
    ('10000000-0000-0000-0000-000000000020'::uuid, 'numeros', 'Cinco', 'Cinq', 'Cinco', 'Cinque', 'Five', 'Fünf'),
    ('10000000-0000-0000-0000-000000000021'::uuid, 'numeros', 'Seis', 'Six', 'Seis', 'Sei', 'Six', 'Sechs'),
    ('10000000-0000-0000-0000-000000000022'::uuid, 'numeros', 'Siete', 'Sept', 'Sete', 'Sette', 'Seven', 'Sieben'),
    ('10000000-0000-0000-0000-000000000023'::uuid, 'numeros', 'Ocho', 'Huit', 'Oito', 'Otto', 'Eight', 'Acht'),
    ('10000000-0000-0000-0000-000000000024'::uuid, 'numeros', 'Nueve', 'Neuf', 'Nove', 'Nove', 'Nine', 'Neun'),
    ('10000000-0000-0000-0000-000000000025'::uuid, 'numeros', 'Diez', 'Dix', 'Dez', 'Dieci', 'Ten', 'Zehn'),

    -- Familia
    ('10000000-0000-0000-0000-000000000026'::uuid, 'familia', 'Madre', 'Mère', 'Mãe', 'Madre', 'Mother', 'Mutter'),
    ('10000000-0000-0000-0000-000000000027'::uuid, 'familia', 'Padre', 'Père', 'Pai', 'Padre', 'Father', 'Vater'),
    ('10000000-0000-0000-0000-000000000028'::uuid, 'familia', 'Hermano', 'Frère', 'Irmão', 'Fratello', 'Brother', 'Bruder'),
    ('10000000-0000-0000-0000-000000000029'::uuid, 'familia', 'Hermana', 'Sœur', 'Irmã', 'Sorella', 'Sister', 'Schwester'),
    ('10000000-0000-0000-0000-000000000030'::uuid, 'familia', 'Hijo', 'Fils', 'Filho', 'Figlio', 'Son', 'Sohn'),
    ('10000000-0000-0000-0000-000000000031'::uuid, 'familia', 'Hija', 'Fille', 'Filha', 'Figlia', 'Daughter', 'Tochter'),
    ('10000000-0000-0000-0000-000000000032'::uuid, 'familia', 'Abuelo', 'Grand-père', 'Avô', 'Nonno', 'Grandfather', 'Großvater'),
    ('10000000-0000-0000-0000-000000000033'::uuid, 'familia', 'Abuela', 'Grand-mère', 'Avó', 'Nonna', 'Grandmother', 'Großmutter'),

    -- Colores
    ('10000000-0000-0000-0000-000000000034'::uuid, 'colores', 'Rojo', 'Rouge', 'Vermelho', 'Rosso', 'Red', 'Rot'),
    ('10000000-0000-0000-0000-000000000035'::uuid, 'colores', 'Azul', 'Bleu', 'Azul', 'Blu', 'Blue', 'Blau'),
    ('10000000-0000-0000-0000-000000000036'::uuid, 'colores', 'Verde', 'Vert', 'Verde', 'Verde', 'Green', 'Grün'),
    ('10000000-0000-0000-0000-000000000037'::uuid, 'colores', 'Amarillo', 'Jaune', 'Amarelo', 'Giallo', 'Yellow', 'Gelb'),
    ('10000000-0000-0000-0000-000000000038'::uuid, 'colores', 'Blanco', 'Blanc', 'Branco', 'Bianco', 'White', 'Weiß'),
    ('10000000-0000-0000-0000-000000000039'::uuid, 'colores', 'Negro', 'Noir', 'Preto', 'Nero', 'Black', 'Schwarz'),

    -- Comida
    ('10000000-0000-0000-0000-000000000040'::uuid, 'comida', 'Agua', 'Eau', 'Água', 'Acqua', 'Water', 'Wasser'),
    ('10000000-0000-0000-0000-000000000041'::uuid, 'comida', 'Pan', 'Pain', 'Pão', 'Pane', 'Bread', 'Brot'),
    ('10000000-0000-0000-0000-000000000042'::uuid, 'comida', 'Leche', 'Lait', 'Leite', 'Latte', 'Milk', 'Milch'),
    ('10000000-0000-0000-0000-000000000043'::uuid, 'comida', 'Manzana', 'Pomme', 'Maçã', 'Mela', 'Apple', 'Apfel'),
    ('10000000-0000-0000-0000-000000000044'::uuid, 'comida', 'Arroz', 'Riz', 'Arroz', 'Riso', 'Rice', 'Reis'),
    ('10000000-0000-0000-0000-000000000045'::uuid, 'comida', 'Pollo', 'Poulet', 'Frango', 'Pollo', 'Chicken', 'Hähnchen'),
    ('10000000-0000-0000-0000-000000000046'::uuid, 'comida', 'Café', 'Café', 'Café', 'Caffè', 'Coffee', 'Kaffee'),
    ('10000000-0000-0000-0000-000000000047'::uuid, 'comida', 'Queso', 'Fromage', 'Queijo', 'Formaggio', 'Cheese', 'Käse'),

    -- Verbos frecuentes (infinitivo)
    ('10000000-0000-0000-0000-000000000048'::uuid, 'verbos', 'Ser', 'Être', 'Ser', 'Essere', 'To be', 'Sein'),
    ('10000000-0000-0000-0000-000000000049'::uuid, 'verbos', 'Estar', 'Être', 'Estar', 'Stare', 'To be', 'Sein'),
    ('10000000-0000-0000-0000-000000000050'::uuid, 'verbos', 'Tener', 'Avoir', 'Ter', 'Avere', 'To have', 'Haben'),
    ('10000000-0000-0000-0000-000000000051'::uuid, 'verbos', 'Comer', 'Manger', 'Comer', 'Mangiare', 'To eat', 'Essen'),
    ('10000000-0000-0000-0000-000000000052'::uuid, 'verbos', 'Beber', 'Boire', 'Beber', 'Bere', 'To drink', 'Trinken'),
    ('10000000-0000-0000-0000-000000000053'::uuid, 'verbos', 'Hablar', 'Parler', 'Falar', 'Parlare', 'To speak', 'Sprechen'),
    ('10000000-0000-0000-0000-000000000054'::uuid, 'verbos', 'Vivir', 'Vivre', 'Viver', 'Vivere', 'To live', 'Leben'),
    ('10000000-0000-0000-0000-000000000055'::uuid, 'verbos', 'Querer', 'Vouloir', 'Querer', 'Volere', 'To want', 'Wollen')
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
