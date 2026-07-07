// Sistema de traducción de la interfaz. El idioma de la interfaz es el mismo
// que el "idioma principal" que el usuario elige (ver js/api/ajustesUsuario.js):
// por defecto se detecta de navigator.language, pero el usuario lo puede
// cambiar en Ajustes u Onboarding.
//
// Uso:
//   import { t, aplicarTraducciones, establecerIdiomaInterfaz } from './i18n.js';
//   t('nav_explorar')                        -> texto traducido
//   t('tarjeta_marcar_aprendido', { idioma }) -> con variables {clave}
//   aplicarTraducciones()                    -> rellena [data-i18n] del DOM

export const IDIOMAS_INTERFAZ_SOPORTADOS = ['es', 'en', 'fr', 'pt', 'it', 'de'];

// Cada clave tiene un texto por idioma. Si falta alguno, se usa el español
// como último recurso (ver t()).
const TRADUCCIONES = {
  nav_explorar: { es: 'Explorar', en: 'Explore', fr: 'Explorer', pt: 'Explorar', it: 'Esplora', de: 'Entdecken' },
  nav_progreso: { es: 'Mi progreso', en: 'My progress', fr: 'Ma progression', pt: 'O meu progresso', it: 'I miei progressi', de: 'Mein Fortschritt' },
  nav_mispalabras: { es: 'Mis palabras', en: 'My words', fr: 'Mes mots', pt: 'As minhas palavras', it: 'Le mie parole', de: 'Meine Wörter' },
  nav_ajustes: { es: 'Ajustes', en: 'Settings', fr: 'Paramètres', pt: 'Definições', it: 'Impostazioni', de: 'Einstellungen' },
  nav_salir: { es: 'Salir', en: 'Log out', fr: 'Déconnexion', pt: 'Sair', it: 'Esci', de: 'Abmelden' },

  app_subtitulo: { es: 'Aprende varios idiomas a la vez', en: 'Learn several languages at once', fr: 'Apprends plusieurs langues à la fois', pt: 'Aprende vários idiomas ao mesmo tempo', it: 'Impara più lingue contemporaneamente', de: 'Lerne mehrere Sprachen gleichzeitig' },

  login_label_email: { es: 'Correo electrónico', en: 'Email address', fr: 'Adresse e-mail', pt: 'Endereço de email', it: 'Indirizzo email', de: 'E-Mail-Adresse' },
  login_label_password: { es: 'Contraseña', en: 'Password', fr: 'Mot de passe', pt: 'Palavra-passe', it: 'Password', de: 'Passwort' },
  login_boton_iniciar: { es: 'Iniciar sesión', en: 'Log in', fr: 'Se connecter', pt: 'Iniciar sessão', it: 'Accedi', de: 'Anmelden' },
  login_boton_crear: { es: 'Crear cuenta', en: 'Create account', fr: 'Créer un compte', pt: 'Criar conta', it: 'Crea account', de: 'Konto erstellen' },
  login_enlace_a_registro: { es: '¿No tienes cuenta? Regístrate', en: "Don't have an account? Sign up", fr: "Pas de compte ? Inscris-toi", pt: 'Não tens conta? Regista-te', it: 'Non hai un account? Registrati', de: 'Kein Konto? Registrieren' },
  login_enlace_a_login: { es: '¿Ya tienes cuenta? Inicia sesión', en: 'Already have an account? Log in', fr: 'Déjà un compte ? Connecte-toi', pt: 'Já tens conta? Inicia sessão', it: 'Hai già un account? Accedi', de: 'Schon ein Konto? Anmelden' },
  login_separador_o: { es: 'o', en: 'or', fr: 'ou', pt: 'ou', it: 'o', de: 'oder' },
  login_boton_magico: { es: 'Enviarme un enlace mágico', en: 'Send me a magic link', fr: "M'envoyer un lien magique", pt: 'Enviar-me uma ligação mágica', it: 'Inviami un link magico', de: 'Magischen Link senden' },
  login_ayuda_magico: { es: 'Te llegará un correo con un enlace para entrar sin contraseña.', en: "You'll get an email with a link to sign in without a password.", fr: "Tu recevras un e-mail avec un lien pour te connecter sans mot de passe.", pt: 'Vais receber um email com uma ligação para entrares sem palavra-passe.', it: "Riceverai un'email con un link per accedere senza password.", de: 'Du erhältst eine E-Mail mit einem Link, um dich ohne Passwort anzumelden.' },
  login_momento: { es: 'Un momento…', en: 'One moment…', fr: 'Un instant…', pt: 'Um momento…', it: 'Un momento…', de: 'Einen Moment…' },
  login_mensaje_cuenta_creada: { es: 'Cuenta creada. Revisa tu correo si Supabase pide confirmación.', en: 'Account created. Check your email if Supabase asks for confirmation.', fr: "Compte créé. Vérifie ton e-mail si Supabase demande une confirmation.", pt: 'Conta criada. Verifica o teu email se o Supabase pedir confirmação.', it: 'Account creato. Controlla la tua email se Supabase richiede conferma.', de: 'Konto erstellt. Prüfe deine E-Mails, falls Supabase eine Bestätigung verlangt.' },
  login_mensaje_enlace_enviado: { es: 'Te hemos enviado un enlace a tu correo. Ábrelo desde este dispositivo.', en: "We've sent a link to your email. Open it from this device.", fr: "Nous t'avons envoyé un lien par e-mail. Ouvre-le depuis cet appareil.", pt: 'Enviámos uma ligação para o teu email. Abre-a a partir deste dispositivo.', it: "Ti abbiamo inviato un link via email. Aprilo da questo dispositivo.", de: 'Wir haben dir einen Link per E-Mail geschickt. Öffne ihn auf diesem Gerät.' },
  login_error_sin_email: { es: 'Escribe primero tu correo electrónico.', en: 'Enter your email address first.', fr: "Saisis d'abord ton adresse e-mail.", pt: 'Escreve primeiro o teu email.', it: 'Inserisci prima il tuo indirizzo email.', de: 'Gib zuerst deine E-Mail-Adresse ein.' },

  error_credenciales: { es: 'Correo o contraseña incorrectos.', en: 'Incorrect email or password.', fr: "E-mail ou mot de passe incorrect.", pt: 'Email ou palavra-passe incorretos.', it: 'Email o password errati.', de: 'E-Mail oder Passwort falsch.' },
  error_ya_registrado: { es: 'Ya existe una cuenta con ese correo. Prueba a iniciar sesión.', en: 'An account with that email already exists. Try logging in.', fr: "Un compte existe déjà avec cet e-mail. Essaie de te connecter.", pt: 'Já existe uma conta com esse email. Tenta iniciar sessão.', it: 'Esiste già un account con questa email. Prova ad accedere.', de: 'Es gibt bereits ein Konto mit dieser E-Mail. Versuche dich anzumelden.' },
  error_password_corta: { es: 'La contraseña debe tener al menos 6 caracteres.', en: 'Password must be at least 6 characters.', fr: "Le mot de passe doit contenir au moins 6 caractères.", pt: 'A palavra-passe deve ter pelo menos 6 caracteres.', it: 'La password deve avere almeno 6 caratteri.', de: 'Das Passwort muss mindestens 6 Zeichen haben.' },
  error_email_invalido: { es: 'El formato del correo no es válido.', en: 'The email format is not valid.', fr: "Le format de l'e-mail n'est pas valide.", pt: 'O formato do email não é válido.', it: "Il formato dell'email non è valido.", de: 'Das E-Mail-Format ist ungültig.' },
  error_generico: { es: 'Ha ocurrido un error. Inténtalo de nuevo.', en: 'An error occurred. Please try again.', fr: "Une erreur est survenue. Réessaie.", pt: 'Ocorreu um erro. Tenta novamente.', it: 'Si è verificato un errore. Riprova.', de: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' },

  explorar_titulo: { es: 'Explorar vocabulario', en: 'Explore vocabulary', fr: 'Explorer le vocabulaire', pt: 'Explorar vocabulário', it: 'Esplora il vocabolario', de: 'Vokabeln entdecken' },
  explorar_subtitulo: { es: 'Busca términos y escucha su pronunciación en cada idioma.', en: 'Search terms and listen to their pronunciation in each language.', fr: "Cherche des mots et écoute leur prononciation dans chaque langue.", pt: 'Procura termos e escuta a pronúncia em cada idioma.', it: 'Cerca termini e ascolta la pronuncia in ogni lingua.', de: 'Suche Begriffe und höre dir die Aussprache in jeder Sprache an.' },
  explorar_placeholder_busqueda: { es: 'Buscar una palabra o frase…', en: 'Search a word or phrase…', fr: 'Rechercher un mot ou une phrase…', pt: 'Procurar uma palavra ou frase…', it: 'Cerca una parola o una frase…', de: 'Wort oder Satz suchen…' },
  explorar_filtro_todos_niveles: { es: 'Todos los niveles', en: 'All levels', fr: 'Tous les niveaux', pt: 'Todos os níveis', it: 'Tutti i livelli', de: 'Alle Niveaus' },
  explorar_filtro_todo_contenido: { es: 'Todo el contenido', en: 'All content', fr: 'Tout le contenu', pt: 'Todo o conteúdo', it: 'Tutti i contenuti', de: 'Alle Inhalte' },
  explorar_filtro_solo_oficial: { es: 'Solo oficial', en: 'Official only', fr: 'Officiel uniquement', pt: 'Apenas oficial', it: 'Solo ufficiale', de: 'Nur offiziell' },
  explorar_filtro_solo_propio: { es: 'Solo mis palabras', en: 'My words only', fr: 'Mes mots uniquement', pt: 'Apenas as minhas palavras', it: 'Solo le mie parole', de: 'Nur meine Wörter' },
  explorar_filtro_todas_categorias: { es: 'Todas las categorías', en: 'All categories', fr: 'Toutes les catégories', pt: 'Todas as categorias', it: 'Tutte le categorie', de: 'Alle Kategorien' },
  explorar_cargando: { es: 'Cargando vocabulario…', en: 'Loading vocabulary…', fr: 'Chargement du vocabulaire…', pt: 'A carregar vocabulário…', it: 'Caricamento del vocabolario…', de: 'Vokabeln werden geladen…' },
  explorar_error: { es: 'No se pudo cargar el vocabulario. Comprueba tu conexión e inténtalo de nuevo.', en: "Couldn't load the vocabulary. Check your connection and try again.", fr: "Impossible de charger le vocabulaire. Vérifie ta connexion et réessaie.", pt: 'Não foi possível carregar o vocabulário. Verifica a tua ligação e tenta novamente.', it: 'Impossibile caricare il vocabolario. Controlla la connessione e riprova.', de: 'Vokabeln konnten nicht geladen werden. Prüfe deine Verbindung und versuche es erneut.' },
  explorar_sin_resultados: { es: 'No hay ningún término que coincida con estos filtros.', en: 'No term matches these filters.', fr: 'Aucun terme ne correspond à ces filtres.', pt: 'Nenhum termo corresponde a estes filtros.', it: 'Nessun termine corrisponde a questi filtri.', de: 'Kein Begriff passt zu diesen Filtern.' },

  progreso_titulo: { es: 'Mi progreso', en: 'My progress', fr: 'Ma progression', pt: 'O meu progresso', it: 'I miei progressi', de: 'Mein Fortschritt' },
  progreso_subtitulo: { es: 'Porcentaje de vocabulario aprendido, por idioma y por nivel.', en: 'Percentage of vocabulary learned, by language and level.', fr: 'Pourcentage de vocabulaire appris, par langue et par niveau.', pt: 'Percentagem de vocabulário aprendido, por idioma e nível.', it: 'Percentuale di vocabolario appreso, per lingua e livello.', de: 'Prozentsatz des gelernten Wortschatzes nach Sprache und Niveau.' },
  progreso_calculando: { es: 'Calculando tu progreso…', en: 'Calculating your progress…', fr: 'Calcul de ta progression…', pt: 'A calcular o teu progresso…', it: 'Calcolo dei tuoi progressi…', de: 'Dein Fortschritt wird berechnet…' },
  progreso_error: { es: 'No se pudo calcular tu progreso. Inténtalo de nuevo más tarde.', en: "Couldn't calculate your progress. Try again later.", fr: 'Impossible de calculer ta progression. Réessaie plus tard.', pt: 'Não foi possível calcular o teu progresso. Tenta mais tarde.', it: 'Impossibile calcolare i tuoi progressi. Riprova più tardi.', de: 'Dein Fortschritt konnte nicht berechnet werden. Versuche es später erneut.' },
  progreso_sin_datos: { es: 'Todavía no hay vocabulario para calcular tu progreso.', en: "There's no vocabulary yet to calculate your progress.", fr: "Il n'y a pas encore de vocabulaire pour calculer ta progression.", pt: 'Ainda não há vocabulário para calcular o teu progresso.', it: 'Non c\'è ancora vocabolario per calcolare i tuoi progressi.', de: 'Es gibt noch keinen Wortschatz, um deinen Fortschritt zu berechnen.' },
  progreso_nivel: { es: 'Nivel', en: 'Level', fr: 'Niveau', pt: 'Nível', it: 'Livello', de: 'Niveau' },

  mispalabras_titulo: { es: 'Mis palabras', en: 'My words', fr: 'Mes mots', pt: 'As minhas palavras', it: 'Le mie parole', de: 'Meine Wörter' },
  mispalabras_subtitulo: { es: 'Añade tu propio vocabulario. Solo tú puedes verlo y editarlo.', en: 'Add your own vocabulary. Only you can see and edit it.', fr: 'Ajoute ton propre vocabulaire. Toi seul peux le voir et le modifier.', pt: 'Adiciona o teu próprio vocabulário. Só tu podes vê-lo e editá-lo.', it: 'Aggiungi il tuo vocabolario personale. Solo tu puoi vederlo e modificarlo.', de: 'Füge deinen eigenen Wortschatz hinzu. Nur du kannst ihn sehen und bearbeiten.' },
  mispalabras_label_nivel: { es: 'Nivel', en: 'Level', fr: 'Niveau', pt: 'Nível', it: 'Livello', de: 'Niveau' },
  mispalabras_label_categoria: { es: 'Categoría (opcional)', en: 'Category (optional)', fr: 'Catégorie (facultatif)', pt: 'Categoria (opcional)', it: 'Categoria (opzionale)', de: 'Kategorie (optional)' },
  mispalabras_placeholder_categoria: { es: 'p. ej. trabajo, viajes…', en: 'e.g. work, travel…', fr: 'ex. travail, voyages…', pt: 'ex. trabalho, viagens…', it: 'es. lavoro, viaggi…', de: 'z. B. Arbeit, Reisen…' },
  mispalabras_placeholder_opcional: { es: 'opcional', en: 'optional', fr: 'facultatif', pt: 'opcional', it: 'opzionale', de: 'optional' },
  mispalabras_boton_anadir: { es: 'Añadir palabra', en: 'Add word', fr: 'Ajouter un mot', pt: 'Adicionar palavra', it: 'Aggiungi parola', de: 'Wort hinzufügen' },
  mispalabras_boton_guardar_cambios: { es: 'Guardar cambios', en: 'Save changes', fr: 'Enregistrer les modifications', pt: 'Guardar alterações', it: 'Salva modifiche', de: 'Änderungen speichern' },
  mispalabras_boton_cancelar: { es: 'Cancelar', en: 'Cancel', fr: 'Annuler', pt: 'Cancelar', it: 'Annulla', de: 'Abbrechen' },
  mispalabras_cargando: { es: 'Cargando tus palabras…', en: 'Loading your words…', fr: 'Chargement de tes mots…', pt: 'A carregar as tuas palavras…', it: 'Caricamento delle tue parole…', de: 'Deine Wörter werden geladen…' },
  mispalabras_sin_palabras: { es: 'Todavía no has añadido ninguna palabra propia.', en: "You haven't added any of your own words yet.", fr: "Tu n'as pas encore ajouté de mots.", pt: 'Ainda não adicionaste nenhuma palavra tua.', it: 'Non hai ancora aggiunto parole tue.', de: 'Du hast noch keine eigenen Wörter hinzugefügt.' },
  mispalabras_error_carga: { es: 'No se pudieron cargar tus palabras.', en: "Couldn't load your words.", fr: 'Impossible de charger tes mots.', pt: 'Não foi possível carregar as tuas palavras.', it: 'Impossibile caricare le tue parole.', de: 'Deine Wörter konnten nicht geladen werden.' },
  mispalabras_confirmar_borrado: { es: '¿Seguro que quieres borrar esta palabra?', en: 'Are you sure you want to delete this word?', fr: 'Es-tu sûr de vouloir supprimer ce mot ?', pt: 'Tens a certeza de que queres apagar esta palavra?', it: 'Sei sicuro di voler eliminare questa parola?', de: 'Möchtest du dieses Wort wirklich löschen?' },
  mispalabras_toast_anadida: { es: 'Palabra añadida.', en: 'Word added.', fr: 'Mot ajouté.', pt: 'Palavra adicionada.', it: 'Parola aggiunta.', de: 'Wort hinzugefügt.' },
  mispalabras_toast_actualizada: { es: 'Palabra actualizada.', en: 'Word updated.', fr: 'Mot mis à jour.', pt: 'Palavra atualizada.', it: 'Parola aggiornata.', de: 'Wort aktualisiert.' },
  mispalabras_toast_borrada: { es: 'Palabra borrada.', en: 'Word deleted.', fr: 'Mot supprimé.', pt: 'Palavra apagada.', it: 'Parola eliminata.', de: 'Wort gelöscht.' },
  mispalabras_toast_error_guardar: { es: 'No se pudo guardar la palabra.', en: "Couldn't save the word.", fr: "Impossible d'enregistrer le mot.", pt: 'Não foi possível guardar a palavra.', it: 'Impossibile salvare la parola.', de: 'Wort konnte nicht gespeichert werden.' },
  mispalabras_toast_error_borrar: { es: 'No se pudo borrar la palabra.', en: "Couldn't delete the word.", fr: 'Impossible de supprimer le mot.', pt: 'Não foi possível apagar a palavra.', it: 'Impossibile eliminare la parola.', de: 'Wort konnte nicht gelöscht werden.' },
  mispalabras_texto_obligatorio: { es: 'El texto en {idioma} es obligatorio.', en: 'The text in {idioma} is required.', fr: 'Le texte en {idioma} est obligatoire.', pt: 'O texto em {idioma} é obrigatório.', it: 'Il testo in {idioma} è obbligatorio.', de: 'Der Text auf {idioma} ist erforderlich.' },

  ajustes_titulo: { es: 'Ajustes', en: 'Settings', fr: 'Paramètres', pt: 'Definições', it: 'Impostazioni', de: 'Einstellungen' },
  ajustes_subtitulo: { es: 'Recordatorios de repaso y apariencia de la aplicación.', en: 'Review reminders and app appearance.', fr: "Rappels de révision et apparence de l'application.", pt: 'Lembretes de revisão e aparência da aplicação.', it: "Promemoria di ripasso e aspetto dell'app.", de: 'Wiederholungserinnerungen und App-Erscheinungsbild.' },
  ajustes_recordatorio_titulo: { es: 'Recordatorio diario', en: 'Daily reminder', fr: 'Rappel quotidien', pt: 'Lembrete diário', it: 'Promemoria giornaliero', de: 'Tägliche Erinnerung' },
  ajustes_label_hora: { es: 'Hora del recordatorio', en: 'Reminder time', fr: 'Heure du rappel', pt: 'Hora do lembrete', it: 'Orario del promemoria', de: 'Erinnerungszeit' },
  ajustes_label_activo: { es: 'Recordatorio activado', en: 'Reminder enabled', fr: 'Rappel activé', pt: 'Lembrete ativado', it: 'Promemoria attivo', de: 'Erinnerung aktiviert' },
  ajustes_boton_guardar: { es: 'Guardar', en: 'Save', fr: 'Enregistrer', pt: 'Guardar', it: 'Salva', de: 'Speichern' },
  ajustes_ayuda_recordatorio: { es: '⚠️ Este recordatorio se comprueba cuando abres la aplicación (al entrar o al volver a la pestaña). Los navegadores no permiten programar avisos exactos con la app completamente cerrada: para eso haría falta un servidor de notificaciones push (ver más abajo, "Fase 2").', en: '⚠️ This reminder is checked when you open the app (on entry or when returning to the tab). Browsers don\'t allow scheduling exact alerts with the app fully closed: that would need a push notification server (see "Phase 2" below).', fr: "⚠️ Ce rappel est vérifié lorsque tu ouvres l'application. Les navigateurs ne permettent pas de programmer des alertes exactes avec l'application fermée : il faudrait un serveur de notifications push (voir « Phase 2 » ci-dessous).", pt: '⚠️ Este lembrete é verificado quando abres a aplicação. Os navegadores não permitem programar avisos exatos com a aplicação fechada: seria preciso um servidor de notificações push (ver "Fase 2" abaixo).', it: "⚠️ Questo promemoria viene verificato quando apri l'app. I browser non permettono di programmare avvisi esatti ad app chiusa: servirebbe un server di notifiche push (vedi \"Fase 2\" più sotto).", de: '⚠️ Diese Erinnerung wird beim Öffnen der App geprüft. Browser erlauben keine exakt geplanten Benachrichtigungen bei geschlossener App: dafür wäre ein Push-Server nötig (siehe "Phase 2" unten).' },
  ajustes_apariencia_titulo: { es: 'Apariencia', en: 'Appearance', fr: 'Apparence', pt: 'Aparência', it: 'Aspetto', de: 'Erscheinungsbild' },
  ajustes_label_tema: { es: 'Tema', en: 'Theme', fr: 'Thème', pt: 'Tema', it: 'Tema', de: 'Design' },
  ajustes_tema_auto: { es: 'Automático (según el sistema)', en: 'Automatic (system)', fr: 'Automatique (système)', pt: 'Automático (sistema)', it: 'Automatico (sistema)', de: 'Automatisch (System)' },
  ajustes_tema_claro: { es: 'Claro', en: 'Light', fr: 'Clair', pt: 'Claro', it: 'Chiaro', de: 'Hell' },
  ajustes_tema_oscuro: { es: 'Oscuro', en: 'Dark', fr: 'Sombre', pt: 'Escuro', it: 'Scuro', de: 'Dunkel' },
  ajustes_push_titulo: { es: 'Notificaciones push reales (Fase 2)', en: 'Real push notifications (Phase 2)', fr: 'Notifications push réelles (Phase 2)', pt: 'Notificações push reais (Fase 2)', it: 'Notifiche push reali (Fase 2)', de: 'Echte Push-Benachrichtigungen (Phase 2)' },
  ajustes_push_texto: { es: 'El recordatorio local de arriba solo funciona con la app abierta en algún momento del día. Para recibir un aviso real aunque el navegador esté cerrado, hace falta un push server-side con claves VAPID: el proyecto ya incluye el código preparado en supabase/functions/send-push/index.ts y la tabla push_subscriptions, pero requiere pasos manuales (generar claves VAPID, desplegar la función y programarla con pg_cron) que no se activan por defecto. Consulta los comentarios de ese archivo para la guía paso a paso.', en: 'The local reminder above only works while you open the app at some point in the day. For a real alert even with the browser closed, a server-side push with VAPID keys is needed: the project already includes ready code in supabase/functions/send-push/index.ts and the push_subscriptions table, but it requires manual steps not enabled by default. See that file\'s comments for the step-by-step guide.', fr: "Le rappel local ci-dessus ne fonctionne que si tu ouvres l'application dans la journée. Pour une vraie alerte navigateur fermé, il faut un push serveur avec des clés VAPID : le code est déjà prêt dans supabase/functions/send-push/index.ts et la table push_subscriptions, mais des étapes manuelles non activées par défaut sont nécessaires. Voir les commentaires de ce fichier.", pt: 'O lembrete local acima só funciona se abrires a app em algum momento do dia. Para um aviso real com o navegador fechado, é preciso um push do lado do servidor com chaves VAPID: o código já está pronto em supabase/functions/send-push/index.ts e na tabela push_subscriptions, mas requer passos manuais não ativados por predefinição. Consulta os comentários desse ficheiro.', it: "Il promemoria locale sopra funziona solo se apri l'app durante la giornata. Per un avviso reale a browser chiuso serve un push lato server con chiavi VAPID: il codice è già pronto in supabase/functions/send-push/index.ts e nella tabella push_subscriptions, ma richiede passaggi manuali non attivi di default. Consulta i commenti di quel file.", de: 'Die obige lokale Erinnerung funktioniert nur, wenn du die App irgendwann am Tag öffnest. Für eine echte Benachrichtigung bei geschlossenem Browser braucht es serverseitigen Push mit VAPID-Schlüsseln: Der Code ist bereits fertig in supabase/functions/send-push/index.ts und der Tabelle push_subscriptions, erfordert aber standardmäßig nicht aktive manuelle Schritte. Siehe die Kommentare dieser Datei.' },
  ajustes_idiomas_titulo: { es: 'Idiomas', en: 'Languages', fr: 'Langues', pt: 'Idiomas', it: 'Lingue', de: 'Sprachen' },
  ajustes_label_idioma_principal: { es: 'Idioma principal', en: 'Primary language', fr: 'Langue principale', pt: 'Idioma principal', it: 'Lingua principale', de: 'Hauptsprache' },
  ajustes_ayuda_idioma_principal: { es: 'Se usa como idioma de la interfaz y como término principal en las tarjetas.', en: 'Used as the interface language and as the main term on cards.', fr: "Utilisée comme langue de l'interface et comme terme principal sur les cartes.", pt: 'Usado como idioma da interface e como termo principal nos cartões.', it: "Usata come lingua dell'interfaccia e come termine principale nelle schede.", de: 'Wird als Oberflächensprache und als Hauptbegriff auf den Karten verwendet.' },
  ajustes_label_idiomas_activos: { es: 'Idiomas que quiero aprender ahora', en: 'Languages I want to learn now', fr: 'Langues que je veux apprendre maintenant', pt: 'Idiomas que quero aprender agora', it: 'Lingue che voglio imparare ora', de: 'Sprachen, die ich jetzt lernen möchte' },
  ajustes_ayuda_idiomas_activos: { es: 'Elige al menos uno. Puedes cambiarlo cuando quieras.', en: 'Choose at least one. You can change it anytime.', fr: 'Choisis-en au moins une. Tu peux changer à tout moment.', pt: 'Escolhe pelo menos um. Podes alterar quando quiseres.', it: 'Scegline almeno una. Puoi cambiarla quando vuoi.', de: 'Wähle mindestens eine aus. Du kannst das jederzeit ändern.' },
  ajustes_boton_guardar_idiomas: { es: 'Guardar idiomas', en: 'Save languages', fr: 'Enregistrer les langues', pt: 'Guardar idiomas', it: 'Salva lingue', de: 'Sprachen speichern' },
  ajustes_toast_guardado: { es: 'Ajustes guardados.', en: 'Settings saved.', fr: 'Paramètres enregistrés.', pt: 'Definições guardadas.', it: 'Impostazioni salvate.', de: 'Einstellungen gespeichert.' },
  ajustes_toast_error_cargar: { es: 'No se pudo cargar tu recordatorio guardado.', en: "Couldn't load your saved reminder.", fr: 'Impossible de charger ton rappel enregistré.', pt: 'Não foi possível carregar o teu lembrete guardado.', it: 'Impossibile caricare il promemoria salvato.', de: 'Deine gespeicherte Erinnerung konnte nicht geladen werden.' },
  ajustes_toast_error_guardar: { es: 'No se pudieron guardar los ajustes.', en: "Couldn't save the settings.", fr: "Impossible d'enregistrer les paramètres.", pt: 'Não foi possível guardar as definições.', it: 'Impossibile salvare le impostazioni.', de: 'Einstellungen konnten nicht gespeichert werden.' },
  ajustes_toast_idiomas_guardados: { es: 'Idiomas actualizados.', en: 'Languages updated.', fr: 'Langues mises à jour.', pt: 'Idiomas atualizados.', it: 'Lingue aggiornate.', de: 'Sprachen aktualisiert.' },
  ajustes_error_ningun_idioma: { es: 'Elige al menos un idioma para aprender.', en: 'Choose at least one language to learn.', fr: 'Choisis au moins une langue à apprendre.', pt: 'Escolhe pelo menos um idioma para aprender.', it: 'Scegli almeno una lingua da imparare.', de: 'Wähle mindestens eine Sprache zum Lernen aus.' },
  ajustes_aviso_sin_notificaciones: { es: 'Tu navegador no admite notificaciones.', en: "Your browser doesn't support notifications.", fr: 'Ton navigateur ne prend pas en charge les notifications.', pt: 'O teu navegador não suporta notificações.', it: 'Il tuo browser non supporta le notifiche.', de: 'Dein Browser unterstützt keine Benachrichtigungen.' },
  ajustes_aviso_pedir_permiso: { es: 'Necesitamos tu permiso para poder avisarte. Se pedirá al guardar.', en: 'We need your permission to notify you. It will be requested on save.', fr: 'Nous avons besoin de ta permission pour te prévenir. Elle sera demandée à l\'enregistrement.', pt: 'Precisamos da tua autorização para te avisar. Vai ser pedida ao guardar.', it: 'Abbiamo bisogno del tuo permesso per avvisarti. Verrà richiesto al salvataggio.', de: 'Wir brauchen deine Erlaubnis, um dich zu benachrichtigen. Sie wird beim Speichern angefragt.' },
  ajustes_no_concedido: { es: 'No has concedido permiso: el recordatorio no podrá avisarte.', en: "You haven't granted permission: the reminder won't be able to notify you.", fr: "Tu n'as pas accordé la permission : le rappel ne pourra pas te prévenir.", pt: 'Não deste autorização: o lembrete não vai conseguir avisar-te.', it: 'Non hai concesso il permesso: il promemoria non potrà avvisarti.', de: 'Du hast keine Erlaubnis erteilt: Die Erinnerung kann dich nicht benachrichtigen.' },

  tarjeta_sin_traduccion: { es: 'Sin traducción todavía', en: 'No translation yet', fr: 'Pas encore de traduction', pt: 'Ainda sem tradução', it: 'Nessuna traduzione ancora', de: 'Noch keine Übersetzung' },
  tarjeta_title_escuchar: { es: 'Escuchar pronunciación', en: 'Listen to pronunciation', fr: 'Écouter la prononciation', pt: 'Ouvir a pronúncia', it: 'Ascolta la pronuncia', de: 'Aussprache anhören' },
  tarjeta_title_sin_voz: { es: 'No hay voz disponible para este idioma en tu navegador', en: 'No voice available for this language in your browser', fr: 'Aucune voix disponible pour cette langue dans ton navigateur', pt: 'Não há voz disponível para este idioma no teu navegador', it: 'Nessuna voce disponibile per questa lingua nel tuo browser', de: 'Für diese Sprache ist in deinem Browser keine Stimme verfügbar' },
  tarjeta_termino_completo: { es: 'Término completo aprendido', en: 'Whole term learned', fr: 'Terme entier appris', pt: 'Termo completo aprendido', it: 'Termine completo appreso', de: 'Ganzer Begriff gelernt' },
  tarjeta_title_editar: { es: 'Editar', en: 'Edit', fr: 'Modifier', pt: 'Editar', it: 'Modifica', de: 'Bearbeiten' },
  tarjeta_title_borrar: { es: 'Borrar', en: 'Delete', fr: 'Supprimer', pt: 'Apagar', it: 'Elimina', de: 'Löschen' },
  tarjeta_insignia_mia: { es: 'Mía', en: 'Mine', fr: 'À moi', pt: 'Minha', it: 'Mia', de: 'Meins' },
  tarjeta_marcar_aprendido: { es: 'Marcar como aprendido en {idioma}', en: 'Mark as learned in {idioma}', fr: 'Marquer comme appris en {idioma}', pt: 'Marcar como aprendido em {idioma}', it: 'Segna come appreso in {idioma}', de: 'Als gelernt auf {idioma} markieren' },

  onboarding_titulo: { es: '¡Bienvenido a 4L!', en: 'Welcome to 4L!', fr: 'Bienvenue sur 4L !', pt: 'Bem-vindo ao 4L!', it: 'Benvenuto su 4L!', de: 'Willkommen bei 4L!' },
  onboarding_intro: { es: 'Antes de empezar, cuéntanos un poco sobre cómo quieres aprender.', en: 'Before you start, tell us a bit about how you want to learn.', fr: 'Avant de commencer, dis-nous comment tu veux apprendre.', pt: 'Antes de começares, conta-nos um pouco sobre como queres aprender.', it: 'Prima di iniziare, raccontaci come vuoi imparare.', de: 'Bevor du startest, erzähl uns kurz, wie du lernen möchtest.' },
  onboarding_label_principal: { es: '¿Cuál es tu idioma principal?', en: "What's your primary language?", fr: 'Quelle est ta langue principale ?', pt: 'Qual é o teu idioma principal?', it: 'Qual è la tua lingua principale?', de: 'Was ist deine Hauptsprache?' },
  onboarding_ayuda_principal: { es: 'Se usará para la interfaz y como término principal en las tarjetas.', en: 'It will be used for the interface and as the main term on cards.', fr: "Elle sera utilisée pour l'interface et comme terme principal sur les cartes.", pt: 'Vai ser usado para a interface e como termo principal nos cartões.', it: "Sarà usata per l'interfaccia e come termine principale nelle schede.", de: 'Sie wird für die Oberfläche und als Hauptbegriff auf den Karten verwendet.' },
  onboarding_label_activos: { es: '¿Qué idiomas quieres aprender a la vez?', en: 'Which languages do you want to learn at once?', fr: 'Quelles langues veux-tu apprendre en même temps ?', pt: 'Que idiomas queres aprender ao mesmo tempo?', it: 'Quali lingue vuoi imparare contemporaneamente?', de: 'Welche Sprachen möchtest du gleichzeitig lernen?' },
  onboarding_ayuda_activos: { es: 'Elige uno o varios. Podrás cambiarlo después en Ajustes.', en: 'Choose one or more. You can change this later in Settings.', fr: 'Choisis-en une ou plusieurs. Tu pourras changer cela plus tard dans Paramètres.', pt: 'Escolhe um ou mais. Podes alterar isto depois em Definições.', it: 'Scegline una o più. Potrai cambiarlo più tardi in Impostazioni.', de: 'Wähle eine oder mehrere aus. Du kannst das später in den Einstellungen ändern.' },
  onboarding_boton_continuar: { es: 'Empezar a aprender', en: 'Start learning', fr: 'Commencer à apprendre', pt: 'Começar a aprender', it: 'Inizia a imparare', de: "Los geht's" },
  onboarding_error_ningun_idioma: { es: 'Elige al menos un idioma para aprender.', en: 'Choose at least one language to learn.', fr: 'Choisis au moins une langue à apprendre.', pt: 'Escolhe pelo menos um idioma para aprender.', it: 'Scegli almeno una lingua da imparare.', de: 'Wähle mindestens eine Sprache zum Lernen aus.' },

  categoria_saludos: { es: 'Saludos', en: 'Greetings', fr: 'Salutations', pt: 'Cumprimentos', it: 'Saluti', de: 'Begrüßungen' },
  categoria_presentaciones: { es: 'Presentaciones', en: 'Introductions', fr: 'Présentations', pt: 'Apresentações', it: 'Presentazioni', de: 'Vorstellungen' },
  categoria_numeros: { es: 'Números', en: 'Numbers', fr: 'Nombres', pt: 'Números', it: 'Numeri', de: 'Zahlen' },
  categoria_familia: { es: 'Familia', en: 'Family', fr: 'Famille', pt: 'Família', it: 'Famiglia', de: 'Familie' },
  categoria_colores: { es: 'Colores', en: 'Colors', fr: 'Couleurs', pt: 'Cores', it: 'Colori', de: 'Farben' },
  categoria_comida: { es: 'Comida', en: 'Food', fr: 'Nourriture', pt: 'Comida', it: 'Cibo', de: 'Essen' },
  categoria_verbos: { es: 'Verbos', en: 'Verbs', fr: 'Verbes', pt: 'Verbos', it: 'Verbi', de: 'Verben' },
  categoria_tiempo_fechas: { es: 'Tiempo y fechas', en: 'Time & dates', fr: 'Temps et dates', pt: 'Tempo e datas', it: 'Tempo e date', de: 'Zeit und Daten' },
  categoria_cuerpo: { es: 'Cuerpo', en: 'Body', fr: 'Corps', pt: 'Corpo', it: 'Corpo', de: 'Körper' },
  categoria_lugares: { es: 'Lugares', en: 'Places', fr: 'Lieux', pt: 'Lugares', it: 'Luoghi', de: 'Orte' },
  categoria_transporte: { es: 'Transporte', en: 'Transport', fr: 'Transport', pt: 'Transporte', it: 'Trasporti', de: 'Verkehrsmittel' },
  categoria_animales: { es: 'Animales', en: 'Animals', fr: 'Animaux', pt: 'Animais', it: 'Animali', de: 'Tiere' },
  categoria_frases_utiles: { es: 'Frases útiles', en: 'Useful phrases', fr: 'Phrases utiles', pt: 'Frases úteis', it: 'Frasi utili', de: 'Nützliche Sätze' },
  categoria_ropa: { es: 'Ropa', en: 'Clothes', fr: 'Vêtements', pt: 'Roupa', it: 'Vestiti', de: 'Kleidung' },
  categoria_casa: { es: 'Casa', en: 'Home', fr: 'Maison', pt: 'Casa', it: 'Casa', de: 'Zuhause' },
  categoria_clima: { es: 'Clima', en: 'Weather', fr: 'Météo', pt: 'Clima', it: 'Meteo', de: 'Wetter' },
  categoria_adjetivos: { es: 'Adjetivos', en: 'Adjectives', fr: 'Adjectifs', pt: 'Adjetivos', it: 'Aggettivi', de: 'Adjektive' },
  categoria_trabajo: { es: 'Trabajo', en: 'Work', fr: 'Travail', pt: 'Trabalho', it: 'Lavoro', de: 'Arbeit' },
  categoria_salud: { es: 'Salud', en: 'Health', fr: 'Santé', pt: 'Saúde', it: 'Salute', de: 'Gesundheit' },
  categoria_tecnologia: { es: 'Tecnología', en: 'Technology', fr: 'Technologie', pt: 'Tecnologia', it: 'Tecnologia', de: 'Technologie' },
  categoria_compras: { es: 'Compras', en: 'Shopping', fr: 'Achats', pt: 'Compras', it: 'Shopping', de: 'Einkaufen' },
  categoria_emociones: { es: 'Emociones', en: 'Emotions', fr: 'Émotions', pt: 'Emoções', it: 'Emozioni', de: 'Emotionen' },
  categoria_mis_palabras: { es: 'Mis palabras', en: 'My words', fr: 'Mes mots', pt: 'As minhas palavras', it: 'Le mie parole', de: 'Meine Wörter' },
  categoria_general: { es: 'General', en: 'General', fr: 'Général', pt: 'Geral', it: 'Generale', de: 'Allgemein' },
};

let idiomaActual = null;

/** Deduce el idioma más adecuado a partir de navigator.language(s). */
export function detectarIdiomaNavegador() {
  const candidatos =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'];
  for (const candidato of candidatos) {
    const base = candidato.slice(0, 2).toLowerCase();
    if (IDIOMAS_INTERFAZ_SOPORTADOS.includes(base)) return base;
  }
  return 'es';
}

/** Idioma de interfaz activo: primero la caché local, si no, el del navegador. */
export function obtenerIdiomaInterfaz() {
  if (idiomaActual) return idiomaActual;
  const guardado = localStorage.getItem('idioma_interfaz');
  idiomaActual =
    guardado && IDIOMAS_INTERFAZ_SOPORTADOS.includes(guardado) ? guardado : detectarIdiomaNavegador();
  return idiomaActual;
}

/** Cambia el idioma de interfaz (llamado tras cargar user_settings o desde Ajustes/Onboarding). */
export function establecerIdiomaInterfaz(codigo) {
  idiomaActual = IDIOMAS_INTERFAZ_SOPORTADOS.includes(codigo) ? codigo : 'es';
  localStorage.setItem('idioma_interfaz', idiomaActual);
  document.documentElement.lang = idiomaActual;
}

/** Traduce una clave, con interpolación simple de variables {nombre}. */
export function t(clave, variables) {
  const entrada = TRADUCCIONES[clave];
  if (!entrada) return clave;
  const idioma = obtenerIdiomaInterfaz();
  let texto = entrada[idioma] ?? entrada.es ?? clave;
  if (variables) {
    for (const [nombre, valor] of Object.entries(variables)) {
      texto = texto.replaceAll(`{${nombre}}`, valor);
    }
  }
  return texto;
}

/** Nombre legible de una categoría; si no está traducida, se muestra tal cual. */
export function nombreCategoria(categoria) {
  return TRADUCCIONES[`categoria_${categoria}`] ? t(`categoria_${categoria}`) : categoria;
}

/** Aplica las traducciones a todo el DOM marcado con data-i18n(-placeholder|-title). */
export function aplicarTraducciones(raiz = document) {
  document.documentElement.lang = obtenerIdiomaInterfaz();
  raiz.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  raiz.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  raiz.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
}
