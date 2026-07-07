-- ============================================================================
-- Contenido de las guías de "Alfabeto y pronunciación" y "Gramática básica"
-- (A1-A2) para los 6 idiomas. Ejecutar después de supabase/schema.sql.
-- ============================================================================
insert into public.guias_idioma (language_code, tipo, orden, titulo, explicacion, ejemplo) values
-- ---- Alfabeto y pronunciación ----
('es', 'alfabeto', 1, 'La Ñ', 'Letra propia del español, con un sonido parecido a "ny". No existe en francés, portugués ni italiano estándar.', 'año, niño'),
('es', 'alfabeto', 2, 'La RR fuerte', 'La doble erre (o la r al principio de palabra) se pronuncia con una vibración fuerte de la lengua, distinta de la r suave entre vocales.', 'perro vs. pero'),
('es', 'alfabeto', 3, 'Acentos y sílaba tónica', 'La tilde (´) marca qué sílaba se pronuncia con más fuerza y a veces cambia el significado de la palabra.', 'papá vs. papa'),
('es', 'alfabeto', 4, 'La H es muda', 'La letra h nunca se pronuncia en español.', 'hola, hielo'),
('es', 'alfabeto', 5, 'B y V suenan igual', 'En español no hay diferencia de pronunciación entre b y v.', 'botar y votar suenan igual'),
('es', 'alfabeto', 6, 'LL e Y', 'En la mayoría de dialectos, ll e y se pronuncian igual, como una "y" marcada.', 'lluvia, yo'),

('fr', 'alfabeto', 1, 'Vocales nasales', 'Cuando una vocal va seguida de n o m al final de sílaba, se pronuncia "por la nariz" sin cerrar del todo la n.', 'bon, vin, blanc'),
('fr', 'alfabeto', 2, 'Letras finales mudas', 'Muchas consonantes finales no se pronuncian, sobre todo -s, -t, -d, -x.', 'les, petit, grand'),
('fr', 'alfabeto', 3, 'La liaison', 'A veces se pronuncia una consonante final si la palabra siguiente empieza por vocal.', 'les amis (se pronuncia "lezami")'),
('fr', 'alfabeto', 4, 'La U francesa', 'El sonido "u" (como en tu) no existe en español: se pronuncia con los labios redondeados y la lengua adelantada.', 'tu, une'),
('fr', 'alfabeto', 5, 'La R gutural', 'La r francesa se pronuncia en la garganta, no con la punta de la lengua como en español.', 'Paris, rouge'),
('fr', 'alfabeto', 6, 'OU vs U', '"ou" suena como la u española; "u" sola es un sonido distinto que no existe en español.', 'vous (ou) vs tu (u)'),

('pt', 'alfabeto', 1, 'Vocales nasales ão/õe', 'Marcadas con tilde y n/m, se pronuncian nasalizadas, sin equivalente exacto en español.', 'pão, não, põe'),
('pt', 'alfabeto', 2, 'LH y NH', '"lh" suena parecido a la "ll" española antigua; "nh" suena como la ñ española.', 'trabalho, banho'),
('pt', 'alfabeto', 3, 'S entre vocales suena Z', 'La s entre vocales se pronuncia como una z suave.', 'casa'),
('pt', 'alfabeto', 4, 'R inicial fuerte', 'La r al principio de palabra suena como una j o h aspirada, sobre todo en portugués de Brasil.', 'rua, carro'),
('pt', 'alfabeto', 5, 'Vocales abiertas y cerradas', 'Muchas vocales tienen una versión abierta y otra cerrada que cambian el significado de la palabra.', 'avó (abuela, abierta) vs avô (abuelo, cerrada)'),
('pt', 'alfabeto', 6, 'X con varios sonidos', 'La x puede sonar "sh", "ks", "s" o "z" según la palabra.', 'caixa (sh), táxi (ks)'),

('it', 'alfabeto', 1, 'GLI y GN', '"gli" suena parecido a la "ll" española antigua; "gn" suena como la ñ española.', 'famiglia, gnocchi'),
('it', 'alfabeto', 2, 'Consonantes dobles', 'Las consonantes dobles se pronuncian más marcadas/largas que las simples, y cambian el significado.', 'sono (soy) vs sonno (sueño)'),
('it', 'alfabeto', 3, 'C y G suaves/duras', 'Antes de e/i suenan suaves (ch, y); antes de a/o/u suenan duras (k, g).', 'cena ("chena") vs casa ("kasa")'),
('it', 'alfabeto', 4, 'SC + E/I', 'La combinación "sc" antes de e/i suena como "sh".', 'sciare, pesce'),
('it', 'alfabeto', 5, 'Todas las vocales se pronuncian', 'El italiano no tiene vocales mudas: cada vocal escrita se pronuncia.', 'amore'),
('it', 'alfabeto', 6, 'Acento en la penúltima sílaba', 'La mayoría de palabras llevan el acento en la penúltima sílaba, salvo que lleven tilde.', 'amico vs città (tilde, última sílaba)'),

('en', 'alfabeto', 1, 'Vocales impredecibles', 'La misma letra puede sonar muy distinto según la palabra; no hay reglas tan fijas como en español.', 'food vs good vs door'),
('en', 'alfabeto', 2, 'TH: dos sonidos', 'El sonido "th" puede ser sordo (think) o sonoro (this); no existe en español.', 'think, this'),
('en', 'alfabeto', 3, 'Acento de palabra', 'El acento tónico puede caer en cualquier sílaba y a veces cambia el significado.', 'record (sustantivo) vs record (verbo)'),
('en', 'alfabeto', 4, 'R no vibrante', 'La r inglesa no vibra como en español; se pronuncia con la lengua curvada hacia atrás.', 'red, car'),
('en', 'alfabeto', 5, 'Consonantes finales marcadas', 'A diferencia del español, las consonantes finales se pronuncian con claridad.', 'cat, dog'),
('en', 'alfabeto', 6, 'W vs V', 'La w y la v suenan distinto en inglés, aunque en español a veces se confunden.', 'west vs vest'),

('de', 'alfabeto', 1, 'Los umlauts ä, ö, ü', 'Vocales con diéresis que cambian totalmente el sonido y el significado de la palabra.', 'schon (ya) vs schön (bonito)'),
('de', 'alfabeto', 2, 'La ß (Eszett)', 'Representa una s sorda y larga; equivale a "ss".', 'Straße, groß'),
('de', 'alfabeto', 3, 'CH: dos sonidos', 'Suena suave tras e/i (como en "ich") y fuerte/gutural tras a/o/u (como en "Bach").', 'ich, Bach'),
('de', 'alfabeto', 4, 'W suena como V', 'La w alemana se pronuncia como la v española/inglesa.', 'Wasser, wir'),
('de', 'alfabeto', 5, 'V suena como F', 'La v alemana normalmente suena como una f.', 'Vater'),
('de', 'alfabeto', 6, 'Mayúscula en los sustantivos', 'Todos los sustantivos se escriben con mayúscula inicial, no solo los nombres propios.', 'das Haus, die Zeit'),

-- ---- Gramática básica (A1-A2) ----
('es', 'gramatica', 1, 'Género de los sustantivos', 'Todos los sustantivos son masculinos o femeninos; el artículo y el adjetivo concuerdan con ellos.', 'el gato negro, la casa blanca'),
('es', 'gramatica', 2, 'Ser vs Estar', 'Ser se usa para características permanentes; estar para estados temporales o ubicación.', 'Soy alto / Estoy cansado'),
('es', 'gramatica', 3, 'Presente de verbos regulares', 'Los verbos en -ar, -er, -ir siguen patrones fijos de conjugación en presente.', 'hablo, como, vivo'),
('es', 'gramatica', 4, 'Plural con -s/-es', 'Se añade -s tras vocal y -es tras consonante.', 'casa/casas, papel/papeles'),
('es', 'gramatica', 5, 'Negación con "no"', 'Se coloca "no" antes del verbo para negar.', 'No entiendo'),
('es', 'gramatica', 6, 'Preguntas con signos dobles', 'Las preguntas llevan el signo de interrogación al principio y al final.', '¿Cómo estás?'),

('fr', 'gramatica', 1, 'Artículos y género', '"le/un" para masculino, "la/une" para femenino, "les/des" para plural.', 'le chat, la maison'),
('fr', 'gramatica', 2, 'Verbos être y avoir', 'Son los dos verbos más importantes e irregulares, base de muchos tiempos compuestos.', 'je suis, j''ai'),
('fr', 'gramatica', 3, 'Verbos en -er', 'El grupo más grande y regular de verbos franceses en presente.', 'je parle, tu parles'),
('fr', 'gramatica', 4, 'Negación ne...pas', 'La negación rodea al verbo: "ne" antes y "pas" después.', 'Je ne comprends pas'),
('fr', 'gramatica', 5, 'Plural con -s (mudo)', 'La mayoría de plurales añaden -s, pero no se pronuncia.', 'le livre / les livres'),
('fr', 'gramatica', 6, 'Preguntas con est-ce que', 'Es la forma más sencilla de convertir una frase en pregunta.', 'Est-ce que tu parles français ?'),

('pt', 'gramatica', 1, 'Artículos y género', '"o/um" para masculino, "a/uma" para femenino.', 'o livro, a casa'),
('pt', 'gramatica', 2, 'Ser vs Estar', 'Como en español: "ser" para lo permanente, "estar" para lo temporal.', 'Sou alto / Estou cansado'),
('pt', 'gramatica', 3, 'Presente de verbos en -ar/-er/-ir', 'Conjugación regular similar al español, con terminaciones propias.', 'falo, como, vivo'),
('pt', 'gramatica', 4, 'Plural con -s', 'La mayoría de palabras forman el plural añadiendo -s, con algunos cambios ortográficos.', 'casa/casas, animal/animais'),
('pt', 'gramatica', 5, 'Negación con "não"', 'Se coloca "não" antes del verbo.', 'Não percebo'),
('pt', 'gramatica', 6, 'Pronombres de tratamiento', 'Se usa "você" como forma común de "tú/usted" en el habla cotidiana.', 'Você fala inglês?'),

('it', 'gramatica', 1, 'Artículos y género', '"il/un" para masculino, "la/una" para femenino, con variantes como "lo", "gli", "le".', 'il libro, la casa'),
('it', 'gramatica', 2, 'Verbos essere y avere', 'Son los verbos irregulares más usados y la base de los tiempos compuestos.', 'sono, ho'),
('it', 'gramatica', 3, 'Presente de verbos en -are/-ere/-ire', 'Tres grupos regulares de conjugación en presente.', 'parlo, credo, dormo'),
('it', 'gramatica', 4, 'Plural cambiando la vocal final', 'El plural no se forma con -s sino cambiando la última vocal.', 'libro/libri, casa/case'),
('it', 'gramatica', 5, 'Negación con "non"', 'Se coloca "non" antes del verbo.', 'Non capisco'),
('it', 'gramatica', 6, 'Concordancia de adjetivos', 'El adjetivo concuerda en género y número con el sustantivo.', 'ragazzo alto, ragazza alta'),

('en', 'gramatica', 1, 'Sin género gramatical', 'Los sustantivos no tienen género; solo se usa un artículo "the" para todos.', 'the book, the house'),
('en', 'gramatica', 2, 'Verbo to be', 'Es el verbo más irregular y básico: am/is/are según el sujeto.', 'I am, she is, they are'),
('en', 'gramatica', 3, 'Presente simple: -s en 3ª persona', 'Solo se añade -s al verbo con he/she/it.', 'I play, she plays'),
('en', 'gramatica', 4, 'Negación con do/does not', 'Los verbos normales necesitan el auxiliar do/does para negar.', 'I don''t understand'),
('en', 'gramatica', 5, 'Preguntas con auxiliar', 'Se invierte el orden colocando do/does/is al principio de la pregunta.', 'Do you speak English?'),
('en', 'gramatica', 6, 'Plural con -s', 'La mayoría de sustantivos forman el plural añadiendo -s.', 'book/books, box/boxes'),

('de', 'gramatica', 1, 'Tres géneros y casos', '"der" (masculino), "die" (femenino), "das" (neutro); además los artículos cambian según el caso gramatical.', 'der Mann, die Frau, das Kind'),
('de', 'gramatica', 2, 'Verbos sein y haben', 'Los dos verbos irregulares más importantes.', 'ich bin, ich habe'),
('de', 'gramatica', 3, 'Verbo en segunda posición', 'En frases afirmativas, el verbo conjugado va siempre en segundo lugar.', 'Heute gehe ich nach Hause'),
('de', 'gramatica', 4, 'Sustantivos con mayúscula', 'Todos los sustantivos se escriben siempre con mayúscula inicial.', 'das Haus, die Zeit'),
('de', 'gramatica', 5, 'Negación con nicht o kein', '"nicht" niega verbos/adjetivos; "kein" niega sustantivos (como "ningún").', 'Ich verstehe nicht / Ich habe kein Auto'),
('de', 'gramatica', 6, 'Plural muy variable', 'El plural puede añadir -e, -er, -n, -s o cambiar la vocal; hay que aprenderlo con cada sustantivo.', 'das Kind/die Kinder, das Auto/die Autos')
on conflict (language_code, tipo, orden) do nothing;
