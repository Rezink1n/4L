-- ============================================================================
-- Ampliación de vocabulario — Nivel A2 (93 términos oficiales adicionales)
-- Trabajo, salud, tecnología, compras, emociones, tiempo/fechas, más frases
-- útiles, más verbos y transporte.
-- Ejecutar después de supabase/schema.sql y supabase/seed_a2.sql.
--
-- Los ids de esta ampliación empiezan por "2100...", para no chocar con los
-- 52 términos originales de seed_a2.sql ("2000...").
-- ============================================================================

with datos (id, categoria, es, fr, pt, it, en, de) as (
  values
    ('21000000-0000-0000-0000-000000000001'::uuid, 'trabajo', 'Oficina', 'Bureau', 'Escritório', 'Ufficio', 'Office', 'Büro'),
    ('21000000-0000-0000-0000-000000000002'::uuid, 'trabajo', 'Jefe', 'Chef', 'Chefe', 'Capo', 'Boss', 'Chef'),
    ('21000000-0000-0000-0000-000000000003'::uuid, 'trabajo', 'Empleado', 'Employé', 'Empregado', 'Impiegato', 'Employee', 'Angestellter'),
    ('21000000-0000-0000-0000-000000000004'::uuid, 'trabajo', 'Reunión', 'Réunion', 'Reunião', 'Riunione', 'Meeting', 'Besprechung'),
    ('21000000-0000-0000-0000-000000000005'::uuid, 'trabajo', 'Currículum', 'CV', 'Currículo', 'Curriculum', 'Résumé', 'Lebenslauf'),
    ('21000000-0000-0000-0000-000000000006'::uuid, 'trabajo', 'Entrevista', 'Entretien', 'Entrevista', 'Colloquio', 'Interview', 'Vorstellungsgespräch'),
    ('21000000-0000-0000-0000-000000000007'::uuid, 'trabajo', 'Salario', 'Salaire', 'Salário', 'Stipendio', 'Salary', 'Gehalt'),
    ('21000000-0000-0000-0000-000000000008'::uuid, 'trabajo', 'Empresa', 'Entreprise', 'Empresa', 'Azienda', 'Company', 'Firma'),
    ('21000000-0000-0000-0000-000000000009'::uuid, 'trabajo', 'Horario', 'Horaire', 'Horário', 'Orario', 'Schedule', 'Zeitplan'),
    ('21000000-0000-0000-0000-000000000010'::uuid, 'trabajo', 'Compañero de trabajo', 'Collègue', 'Colega de trabalho', 'Collega', 'Coworker', 'Kollege'),

    ('21000000-0000-0000-0000-000000000011'::uuid, 'salud', 'Médico', 'Médecin', 'Médico', 'Medico', 'Doctor', 'Arzt'),
    ('21000000-0000-0000-0000-000000000012'::uuid, 'salud', 'Enfermera', 'Infirmière', 'Enfermeira', 'Infermiera', 'Nurse', 'Krankenschwester'),
    ('21000000-0000-0000-0000-000000000013'::uuid, 'salud', 'Medicina', 'Médicament', 'Medicamento', 'Medicina', 'Medicine', 'Medizin'),
    ('21000000-0000-0000-0000-000000000014'::uuid, 'salud', 'Dolor', 'Douleur', 'Dor', 'Dolore', 'Pain', 'Schmerz'),
    ('21000000-0000-0000-0000-000000000015'::uuid, 'salud', 'Fiebre', 'Fièvre', 'Febre', 'Febbre', 'Fever', 'Fieber'),
    ('21000000-0000-0000-0000-000000000016'::uuid, 'salud', 'Receta', 'Ordonnance', 'Receita', 'Ricetta', 'Prescription', 'Rezept'),
    ('21000000-0000-0000-0000-000000000017'::uuid, 'salud', 'Farmacia', 'Pharmacie', 'Farmácia', 'Farmacia', 'Pharmacy', 'Apotheke'),
    ('21000000-0000-0000-0000-000000000018'::uuid, 'salud', 'Cita', 'Rendez-vous', 'Consulta', 'Appuntamento', 'Appointment', 'Termin'),
    ('21000000-0000-0000-0000-000000000019'::uuid, 'salud', 'Enfermedad', 'Maladie', 'Doença', 'Malattia', 'Illness', 'Krankheit'),
    ('21000000-0000-0000-0000-000000000020'::uuid, 'salud', 'Ambulancia', 'Ambulance', 'Ambulância', 'Ambulanza', 'Ambulance', 'Krankenwagen'),

    ('21000000-0000-0000-0000-000000000021'::uuid, 'tecnologia', 'Ordenador', 'Ordinateur', 'Computador', 'Computer', 'Computer', 'Computer'),
    ('21000000-0000-0000-0000-000000000022'::uuid, 'tecnologia', 'Teléfono móvil', 'Téléphone portable', 'Telemóvel', 'Cellulare', 'Mobile phone', 'Handy'),
    ('21000000-0000-0000-0000-000000000023'::uuid, 'tecnologia', 'Internet', 'Internet', 'Internet', 'Internet', 'Internet', 'Internet'),
    ('21000000-0000-0000-0000-000000000024'::uuid, 'tecnologia', 'Contraseña', 'Mot de passe', 'Palavra-passe', 'Password', 'Password', 'Passwort'),
    ('21000000-0000-0000-0000-000000000025'::uuid, 'tecnologia', 'Correo electrónico', 'E-mail', 'E-mail', 'E-mail', 'Email', 'E-Mail'),
    ('21000000-0000-0000-0000-000000000026'::uuid, 'tecnologia', 'Aplicación', 'Application', 'Aplicação', 'Applicazione', 'App', 'App'),
    ('21000000-0000-0000-0000-000000000027'::uuid, 'tecnologia', 'Pantalla', 'Écran', 'Ecrã', 'Schermo', 'Screen', 'Bildschirm'),
    ('21000000-0000-0000-0000-000000000028'::uuid, 'tecnologia', 'Batería', 'Batterie', 'Bateria', 'Batteria', 'Battery', 'Akku'),
    ('21000000-0000-0000-0000-000000000029'::uuid, 'tecnologia', 'Wifi', 'Wifi', 'Wifi', 'Wifi', 'Wifi', 'WLAN'),
    ('21000000-0000-0000-0000-000000000030'::uuid, 'tecnologia', 'Impresora', 'Imprimante', 'Impressora', 'Stampante', 'Printer', 'Drucker'),

    ('21000000-0000-0000-0000-000000000031'::uuid, 'compras', 'Precio', 'Prix', 'Preço', 'Prezzo', 'Price', 'Preis'),
    ('21000000-0000-0000-0000-000000000032'::uuid, 'compras', 'Oferta', 'Offre', 'Oferta', 'Offerta', 'Offer', 'Angebot'),
    ('21000000-0000-0000-0000-000000000033'::uuid, 'compras', 'Rebajas', 'Soldes', 'Saldos', 'Saldi', 'Sales', 'Ausverkauf'),
    ('21000000-0000-0000-0000-000000000034'::uuid, 'compras', 'Probador', 'Cabine d''essayage', 'Provador', 'Camerino', 'Fitting room', 'Umkleidekabine'),
    ('21000000-0000-0000-0000-000000000035'::uuid, 'compras', 'Talla', 'Taille', 'Tamanho', 'Taglia', 'Size', 'Größe'),
    ('21000000-0000-0000-0000-000000000036'::uuid, 'compras', 'Efectivo', 'Espèces', 'Dinheiro', 'Contanti', 'Cash', 'Bargeld'),
    ('21000000-0000-0000-0000-000000000037'::uuid, 'compras', 'Tarjeta de crédito', 'Carte de crédit', 'Cartão de crédito', 'Carta di credito', 'Credit card', 'Kreditkarte'),
    ('21000000-0000-0000-0000-000000000038'::uuid, 'compras', 'Recibo', 'Reçu', 'Recibo', 'Ricevuta', 'Receipt', 'Quittung'),
    ('21000000-0000-0000-0000-000000000039'::uuid, 'compras', 'Carrito', 'Chariot', 'Carrinho', 'Carrello', 'Cart', 'Einkaufswagen'),
    ('21000000-0000-0000-0000-000000000040'::uuid, 'compras', 'Cambio', 'Monnaie', 'Troco', 'Resto', 'Change', 'Wechselgeld'),

    ('21000000-0000-0000-0000-000000000041'::uuid, 'emociones', 'Alegría', 'Joie', 'Alegria', 'Gioia', 'Joy', 'Freude'),
    ('21000000-0000-0000-0000-000000000042'::uuid, 'emociones', 'Miedo', 'Peur', 'Medo', 'Paura', 'Fear', 'Angst'),
    ('21000000-0000-0000-0000-000000000043'::uuid, 'emociones', 'Sorpresa', 'Surprise', 'Surpresa', 'Sorpresa', 'Surprise', 'Überraschung'),
    ('21000000-0000-0000-0000-000000000044'::uuid, 'emociones', 'Enfado', 'Colère', 'Raiva', 'Rabbia', 'Anger', 'Wut'),
    ('21000000-0000-0000-0000-000000000045'::uuid, 'emociones', 'Amor', 'Amour', 'Amor', 'Amore', 'Love', 'Liebe'),
    ('21000000-0000-0000-0000-000000000046'::uuid, 'emociones', 'Aburrimiento', 'Ennui', 'Tédio', 'Noia', 'Boredom', 'Langeweile'),
    ('21000000-0000-0000-0000-000000000047'::uuid, 'emociones', 'Nervios', 'Nervosité', 'Nervosismo', 'Nervosismo', 'Nervousness', 'Nervosität'),
    ('21000000-0000-0000-0000-000000000048'::uuid, 'emociones', 'Orgullo', 'Fierté', 'Orgulho', 'Orgoglio', 'Pride', 'Stolz'),
    ('21000000-0000-0000-0000-000000000049'::uuid, 'emociones', 'Vergüenza', 'Honte', 'Vergonha', 'Vergogna', 'Shame', 'Scham'),
    ('21000000-0000-0000-0000-000000000050'::uuid, 'emociones', 'Tranquilidad', 'Calme', 'Tranquilidade', 'Tranquillità', 'Calm', 'Ruhe'),

    ('21000000-0000-0000-0000-000000000051'::uuid, 'tiempo_fechas', 'La semana pasada', 'La semaine dernière', 'A semana passada', 'La settimana scorsa', 'Last week', 'Letzte Woche'),
    ('21000000-0000-0000-0000-000000000052'::uuid, 'tiempo_fechas', 'El mes que viene', 'Le mois prochain', 'O próximo mês', 'Il prossimo mese', 'Next month', 'Nächsten Monat'),
    ('21000000-0000-0000-0000-000000000053'::uuid, 'tiempo_fechas', 'Siempre', 'Toujours', 'Sempre', 'Sempre', 'Always', 'Immer'),
    ('21000000-0000-0000-0000-000000000054'::uuid, 'tiempo_fechas', 'Nunca', 'Jamais', 'Nunca', 'Mai', 'Never', 'Nie'),
    ('21000000-0000-0000-0000-000000000055'::uuid, 'tiempo_fechas', 'A veces', 'Parfois', 'Às vezes', 'A volte', 'Sometimes', 'Manchmal'),
    ('21000000-0000-0000-0000-000000000056'::uuid, 'tiempo_fechas', 'Temprano', 'Tôt', 'Cedo', 'Presto', 'Early', 'Früh'),
    ('21000000-0000-0000-0000-000000000057'::uuid, 'tiempo_fechas', 'Tarde', 'Tard', 'Tarde', 'Tardi', 'Late', 'Spät'),
    ('21000000-0000-0000-0000-000000000058'::uuid, 'tiempo_fechas', 'Pronto', 'Bientôt', 'Em breve', 'Presto', 'Soon', 'Bald'),
    ('21000000-0000-0000-0000-000000000059'::uuid, 'tiempo_fechas', 'Ya', 'Déjà', 'Já', 'Già', 'Already', 'Schon'),
    ('21000000-0000-0000-0000-000000000060'::uuid, 'tiempo_fechas', 'Todavía', 'Encore', 'Ainda', 'Ancora', 'Still', 'Noch'),

    ('21000000-0000-0000-0000-000000000061'::uuid, 'frases_utiles', '¿Puede ayudarme?', 'Pouvez-vous m''aider ?', 'Pode ajudar-me?', 'Può aiutarmi?', 'Can you help me?', 'Können Sie mir helfen?'),
    ('21000000-0000-0000-0000-000000000062'::uuid, 'frases_utiles', '¿Dónde puedo comprar esto?', 'Où puis-je acheter ça ?', 'Onde posso comprar isto?', 'Dove posso comprare questo?', 'Where can I buy this?', 'Wo kann ich das kaufen?'),
    ('21000000-0000-0000-0000-000000000063'::uuid, 'frases_utiles', 'Lo siento', 'Je suis désolé', 'Desculpe', 'Mi dispiace', 'I''m sorry', 'Es tut mir leid'),
    ('21000000-0000-0000-0000-000000000064'::uuid, 'frases_utiles', 'Con permiso', 'Excusez-moi', 'Com licença', 'Permesso', 'Excuse me', 'Entschuldigung'),
    ('21000000-0000-0000-0000-000000000065'::uuid, 'frases_utiles', '¿Qué hora es?', 'Quelle heure est-il ?', 'Que horas são?', 'Che ore sono?', 'What time is it?', 'Wie spät ist es?'),
    ('21000000-0000-0000-0000-000000000066'::uuid, 'frases_utiles', 'Encantado de conocerte', 'Ravi de te rencontrer', 'Prazer em conhecer-te', 'Piacere di conoscerti', 'Pleased to meet you', 'Schön, dich kennenzulernen'),
    ('21000000-0000-0000-0000-000000000067'::uuid, 'frases_utiles', '¿Cuál es tu profesión?', 'Quelle est ta profession ?', 'Qual é a tua profissão?', 'Qual è la tua professione?', 'What is your profession?', 'Was ist dein Beruf?'),
    ('21000000-0000-0000-0000-000000000068'::uuid, 'frases_utiles', 'Estoy de acuerdo', 'Je suis d''accord', 'Concordo', 'Sono d''accordo', 'I agree', 'Ich stimme zu'),
    ('21000000-0000-0000-0000-000000000069'::uuid, 'frases_utiles', 'No estoy de acuerdo', 'Je ne suis pas d''accord', 'Não concordo', 'Non sono d''accordo', 'I disagree', 'Ich stimme nicht zu'),
    ('21000000-0000-0000-0000-000000000070'::uuid, 'frases_utiles', '¿Qué recomienda?', 'Que recommandez-vous ?', 'O que recomenda?', 'Cosa consiglia?', 'What do you recommend?', 'Was empfehlen Sie?'),

    ('21000000-0000-0000-0000-000000000071'::uuid, 'verbos', 'Viajar', 'Voyager', 'Viajar', 'Viaggiare', 'To travel', 'Reisen'),
    ('21000000-0000-0000-0000-000000000072'::uuid, 'verbos', 'Pagar', 'Payer', 'Pagar', 'Pagare', 'To pay', 'Bezahlen'),
    ('21000000-0000-0000-0000-000000000073'::uuid, 'verbos', 'Reservar', 'Réserver', 'Reservar', 'Prenotare', 'To book', 'Reservieren'),
    ('21000000-0000-0000-0000-000000000074'::uuid, 'verbos', 'Esperar', 'Attendre', 'Esperar', 'Aspettare', 'To wait', 'Warten'),
    ('21000000-0000-0000-0000-000000000075'::uuid, 'verbos', 'Encontrar', 'Trouver', 'Encontrar', 'Trovare', 'To find', 'Finden'),
    ('21000000-0000-0000-0000-000000000076'::uuid, 'verbos', 'Perder', 'Perdre', 'Perder', 'Perdere', 'To lose', 'Verlieren'),
    ('21000000-0000-0000-0000-000000000077'::uuid, 'verbos', 'Ganar', 'Gagner', 'Ganhar', 'Vincere', 'To win', 'Gewinnen'),
    ('21000000-0000-0000-0000-000000000078'::uuid, 'verbos', 'Empezar', 'Commencer', 'Começar', 'Iniziare', 'To start', 'Anfangen'),
    ('21000000-0000-0000-0000-000000000079'::uuid, 'verbos', 'Terminar', 'Terminer', 'Terminar', 'Finire', 'To finish', 'Beenden'),
    ('21000000-0000-0000-0000-000000000080'::uuid, 'verbos', 'Decidir', 'Décider', 'Decidir', 'Decidere', 'To decide', 'Entscheiden'),
    ('21000000-0000-0000-0000-000000000081'::uuid, 'verbos', 'Pensar', 'Penser', 'Pensar', 'Pensare', 'To think', 'Denken'),
    ('21000000-0000-0000-0000-000000000082'::uuid, 'verbos', 'Recordar', 'Se souvenir', 'Lembrar', 'Ricordare', 'To remember', 'Sich erinnern'),
    ('21000000-0000-0000-0000-000000000083'::uuid, 'verbos', 'Olvidar', 'Oublier', 'Esquecer', 'Dimenticare', 'To forget', 'Vergessen'),

    ('21000000-0000-0000-0000-000000000084'::uuid, 'transporte', 'Billete', 'Billet', 'Bilhete', 'Biglietto', 'Ticket', 'Fahrkarte'),
    ('21000000-0000-0000-0000-000000000085'::uuid, 'transporte', 'Estación de tren', 'Gare', 'Estação de comboio', 'Stazione ferroviaria', 'Train station', 'Bahnhof'),
    ('21000000-0000-0000-0000-000000000086'::uuid, 'transporte', 'Maleta', 'Valise', 'Mala', 'Valigia', 'Suitcase', 'Koffer'),
    ('21000000-0000-0000-0000-000000000087'::uuid, 'transporte', 'Pasaporte', 'Passeport', 'Passaporte', 'Passaporto', 'Passport', 'Reisepass'),
    ('21000000-0000-0000-0000-000000000088'::uuid, 'transporte', 'Vuelo', 'Vol', 'Voo', 'Volo', 'Flight', 'Flug'),
    ('21000000-0000-0000-0000-000000000089'::uuid, 'transporte', 'Conductor', 'Conducteur', 'Condutor', 'Autista', 'Driver', 'Fahrer'),
    ('21000000-0000-0000-0000-000000000090'::uuid, 'transporte', 'Parada de autobús', 'Arrêt de bus', 'Paragem de autocarro', 'Fermata dell''autobus', 'Bus stop', 'Bushaltestelle'),
    ('21000000-0000-0000-0000-000000000091'::uuid, 'transporte', 'Autopista', 'Autoroute', 'Autoestrada', 'Autostrada', 'Highway', 'Autobahn'),
    ('21000000-0000-0000-0000-000000000092'::uuid, 'transporte', 'Aparcamiento', 'Parking', 'Estacionamento', 'Parcheggio', 'Parking', 'Parkplatz'),
    ('21000000-0000-0000-0000-000000000093'::uuid, 'transporte', 'Semáforo', 'Feu de circulation', 'Semáforo', 'Semaforo', 'Traffic light', 'Ampel')
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
