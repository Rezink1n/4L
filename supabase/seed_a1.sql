-- ============================================================================
-- Datos semilla — Nivel A1 (55 términos oficiales)
-- Saludos, presentaciones, números, familia, colores, comida y verbos
-- frecuentes. Ejecutar después de supabase/schema.sql.
--
-- Para ampliar: añade más filas al VALUES de "datos" con un id que no
-- choque con los ya usados (por convención, los de A1 empiezan por "1000...").
-- No hace falta tocar nada más: terms y translations se rellenan solos.
-- ============================================================================

with datos (id, categoria, es, fr, pt, it) as (
  values
    -- Saludos y cortesía
    ('10000000-0000-0000-0000-000000000001'::uuid, 'saludos', 'Hola', 'Bonjour', 'Olá', 'Ciao'),
    ('10000000-0000-0000-0000-000000000002'::uuid, 'saludos', 'Adiós', 'Au revoir', 'Adeus', 'Arrivederci'),
    ('10000000-0000-0000-0000-000000000003'::uuid, 'saludos', 'Buenos días', 'Bonjour', 'Bom dia', 'Buongiorno'),
    ('10000000-0000-0000-0000-000000000004'::uuid, 'saludos', 'Buenas tardes', 'Bon après-midi', 'Boa tarde', 'Buon pomeriggio'),
    ('10000000-0000-0000-0000-000000000005'::uuid, 'saludos', 'Buenas noches', 'Bonne nuit', 'Boa noite', 'Buonanotte'),
    ('10000000-0000-0000-0000-000000000006'::uuid, 'saludos', 'Por favor', 'S''il vous plaît', 'Por favor', 'Per favore'),
    ('10000000-0000-0000-0000-000000000007'::uuid, 'saludos', 'Gracias', 'Merci', 'Obrigado', 'Grazie'),
    ('10000000-0000-0000-0000-000000000008'::uuid, 'saludos', 'De nada', 'De rien', 'De nada', 'Prego'),

    -- Presentaciones
    ('10000000-0000-0000-0000-000000000009'::uuid, 'presentaciones', 'Me llamo...', 'Je m''appelle...', 'Chamo-me...', 'Mi chiamo...'),
    ('10000000-0000-0000-0000-000000000010'::uuid, 'presentaciones', '¿Cómo te llamas?', 'Comment tu t''appelles ?', 'Como te chamas?', 'Come ti chiami?'),
    ('10000000-0000-0000-0000-000000000011'::uuid, 'presentaciones', 'Mucho gusto', 'Enchanté', 'Muito prazer', 'Piacere'),
    ('10000000-0000-0000-0000-000000000012'::uuid, 'presentaciones', '¿Cómo estás?', 'Comment ça va ?', 'Como estás?', 'Come stai?'),
    ('10000000-0000-0000-0000-000000000013'::uuid, 'presentaciones', 'Bien, gracias', 'Bien, merci', 'Bem, obrigado', 'Bene, grazie'),
    ('10000000-0000-0000-0000-000000000014'::uuid, 'presentaciones', 'Hasta luego', 'À bientôt', 'Até logo', 'A dopo'),

    -- Números 0-10
    ('10000000-0000-0000-0000-000000000015'::uuid, 'numeros', 'Cero', 'Zéro', 'Zero', 'Zero'),
    ('10000000-0000-0000-0000-000000000016'::uuid, 'numeros', 'Uno', 'Un', 'Um', 'Uno'),
    ('10000000-0000-0000-0000-000000000017'::uuid, 'numeros', 'Dos', 'Deux', 'Dois', 'Due'),
    ('10000000-0000-0000-0000-000000000018'::uuid, 'numeros', 'Tres', 'Trois', 'Três', 'Tre'),
    ('10000000-0000-0000-0000-000000000019'::uuid, 'numeros', 'Cuatro', 'Quatre', 'Quatro', 'Quattro'),
    ('10000000-0000-0000-0000-000000000020'::uuid, 'numeros', 'Cinco', 'Cinq', 'Cinco', 'Cinque'),
    ('10000000-0000-0000-0000-000000000021'::uuid, 'numeros', 'Seis', 'Six', 'Seis', 'Sei'),
    ('10000000-0000-0000-0000-000000000022'::uuid, 'numeros', 'Siete', 'Sept', 'Sete', 'Sette'),
    ('10000000-0000-0000-0000-000000000023'::uuid, 'numeros', 'Ocho', 'Huit', 'Oito', 'Otto'),
    ('10000000-0000-0000-0000-000000000024'::uuid, 'numeros', 'Nueve', 'Neuf', 'Nove', 'Nove'),
    ('10000000-0000-0000-0000-000000000025'::uuid, 'numeros', 'Diez', 'Dix', 'Dez', 'Dieci'),

    -- Familia
    ('10000000-0000-0000-0000-000000000026'::uuid, 'familia', 'Madre', 'Mère', 'Mãe', 'Madre'),
    ('10000000-0000-0000-0000-000000000027'::uuid, 'familia', 'Padre', 'Père', 'Pai', 'Padre'),
    ('10000000-0000-0000-0000-000000000028'::uuid, 'familia', 'Hermano', 'Frère', 'Irmão', 'Fratello'),
    ('10000000-0000-0000-0000-000000000029'::uuid, 'familia', 'Hermana', 'Sœur', 'Irmã', 'Sorella'),
    ('10000000-0000-0000-0000-000000000030'::uuid, 'familia', 'Hijo', 'Fils', 'Filho', 'Figlio'),
    ('10000000-0000-0000-0000-000000000031'::uuid, 'familia', 'Hija', 'Fille', 'Filha', 'Figlia'),
    ('10000000-0000-0000-0000-000000000032'::uuid, 'familia', 'Abuelo', 'Grand-père', 'Avô', 'Nonno'),
    ('10000000-0000-0000-0000-000000000033'::uuid, 'familia', 'Abuela', 'Grand-mère', 'Avó', 'Nonna'),

    -- Colores
    ('10000000-0000-0000-0000-000000000034'::uuid, 'colores', 'Rojo', 'Rouge', 'Vermelho', 'Rosso'),
    ('10000000-0000-0000-0000-000000000035'::uuid, 'colores', 'Azul', 'Bleu', 'Azul', 'Blu'),
    ('10000000-0000-0000-0000-000000000036'::uuid, 'colores', 'Verde', 'Vert', 'Verde', 'Verde'),
    ('10000000-0000-0000-0000-000000000037'::uuid, 'colores', 'Amarillo', 'Jaune', 'Amarelo', 'Giallo'),
    ('10000000-0000-0000-0000-000000000038'::uuid, 'colores', 'Blanco', 'Blanc', 'Branco', 'Bianco'),
    ('10000000-0000-0000-0000-000000000039'::uuid, 'colores', 'Negro', 'Noir', 'Preto', 'Nero'),

    -- Comida
    ('10000000-0000-0000-0000-000000000040'::uuid, 'comida', 'Agua', 'Eau', 'Água', 'Acqua'),
    ('10000000-0000-0000-0000-000000000041'::uuid, 'comida', 'Pan', 'Pain', 'Pão', 'Pane'),
    ('10000000-0000-0000-0000-000000000042'::uuid, 'comida', 'Leche', 'Lait', 'Leite', 'Latte'),
    ('10000000-0000-0000-0000-000000000043'::uuid, 'comida', 'Manzana', 'Pomme', 'Maçã', 'Mela'),
    ('10000000-0000-0000-0000-000000000044'::uuid, 'comida', 'Arroz', 'Riz', 'Arroz', 'Riso'),
    ('10000000-0000-0000-0000-000000000045'::uuid, 'comida', 'Pollo', 'Poulet', 'Frango', 'Pollo'),
    ('10000000-0000-0000-0000-000000000046'::uuid, 'comida', 'Café', 'Café', 'Café', 'Caffè'),
    ('10000000-0000-0000-0000-000000000047'::uuid, 'comida', 'Queso', 'Fromage', 'Queijo', 'Formaggio'),

    -- Verbos frecuentes (infinitivo)
    ('10000000-0000-0000-0000-000000000048'::uuid, 'verbos', 'Ser', 'Être', 'Ser', 'Essere'),
    ('10000000-0000-0000-0000-000000000049'::uuid, 'verbos', 'Estar', 'Être', 'Estar', 'Stare'),
    ('10000000-0000-0000-0000-000000000050'::uuid, 'verbos', 'Tener', 'Avoir', 'Ter', 'Avere'),
    ('10000000-0000-0000-0000-000000000051'::uuid, 'verbos', 'Comer', 'Manger', 'Comer', 'Mangiare'),
    ('10000000-0000-0000-0000-000000000052'::uuid, 'verbos', 'Beber', 'Boire', 'Beber', 'Bere'),
    ('10000000-0000-0000-0000-000000000053'::uuid, 'verbos', 'Hablar', 'Parler', 'Falar', 'Parlare'),
    ('10000000-0000-0000-0000-000000000054'::uuid, 'verbos', 'Vivir', 'Vivre', 'Viver', 'Vivere'),
    ('10000000-0000-0000-0000-000000000055'::uuid, 'verbos', 'Querer', 'Vouloir', 'Querer', 'Volere')
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
on conflict (term_id, language_code) do nothing;
