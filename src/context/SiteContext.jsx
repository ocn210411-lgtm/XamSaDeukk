import { createContext, useContext, useState, useEffect } from 'react'

// Entrées encyclopédie par défaut — données culturelles sénégalaises
const defaultEncyclopedie = [
  {
    id: 1, category: 'personnalite',
    title: 'Cheikh Anta Diop',
    subtitle: 'Historien, Anthropologue, Physicien (1923–1986)',
    image: '👨🏾‍🔬',
    description: `Cheikh Anta Diop est l'une des plus grandes figures intellectuelles africaines du XXe siècle. Né à Diourbel au Sénégal, il a consacré sa vie à démontrer que l'Égypte ancienne était une civilisation negro-africaine, et que l'Afrique est le berceau de l'humanité et de la civilisation.

Sa thèse "Nations Nègres et Culture" (1954) a révolutionné l'histoire africaine en prouvant, par l'anthropologie, la linguistique et la physique nucléaire, les liens entre l'Égypte pharaonique et l'Afrique subsaharienne. Il a fondé le laboratoire de datation par radiocarbone à l'IFAN à Dakar.

Son œuvre majeure "Antériorité des civilisations nègres" démontre que les Grecs eux-mêmes reconnaissaient leur dette envers l'Égypte africaine. Cheikh Anta Diop est aujourd'hui considéré comme le "pharaon du savoir" africain.`,
    tags: ['Science', 'Histoire', 'Panafricanisme'],
    period: '1923–1986'
  },
  {
    id: 2, category: 'personnalite',
    title: 'Léopold Sédar Senghor',
    subtitle: 'Poète, Philosophe, Premier Président du Sénégal (1906–2001)',
    image: '✍🏾',
    description: `Léopold Sédar Senghor est le père de la nation sénégalaise et l'un des plus grands poètes de langue française. Né à Joal, il fut le premier africain agrégé de l'Université de France et devint le premier président du Sénégal indépendant en 1960.

Cofondateur du mouvement de la Négritude avec Aimé Césaire et Léon-Gontran Damas, il a affirmé la beauté et la valeur des cultures africaines face au colonialisme culturel. Sa poésie célèbre la terre africaine, les ancêtres, la femme noire et l'âme de l'Afrique.

Premier africain élu à l'Académie française en 1983, Senghor a également développé le concept de "Civilisation de l'Universel" — une vision d'un monde où toutes les cultures se rencontrent dans un dialogue enrichissant. Il a quitté volontairement le pouvoir en 1980, rare exemple de démocrate en Afrique.`,
    tags: ['Politique', 'Poésie', 'Négritude'],
    period: '1906–2001'
  },
  {
    id: 3, category: 'personnalite',
    title: 'El Hadj Umar Tall',
    subtitle: 'Conquérant, Théologien, Chef militaire (1794–1864)',
    image: '⚔️',
    description: `El Hadj Umar Tall est l'une des figures les plus puissantes de l'histoire ouest-africaine du XIXe siècle. Né à Halwar dans le Fouta Toro, il fut un éminent théologien de la confrérie Tijaniyya et un redoutable chef de guerre.

Après un long pèlerinage à La Mecque où il fut nommé calife de l'Afrique de l'Ouest par la confrérie Tijaniyya, il revint au Sénégal et entreprit une guerre sainte (jihad) pour islamiser et unifier les royaumes animistes et traditionnels. Il construisit un vaste empire qui couvrait les actuels Sénégal, Mali et Guinée.

Sa résistance contre la colonisation française fit de lui un symbole de la lutte pour la dignité africaine. Disparu en 1864 lors de la bataille de Degembéré, il reste une figure tutélaire pour des millions de Tidianes en Afrique de l'Ouest.`,
    tags: ['Islam', 'Résistance', 'Tijaniyya'],
    period: '1794–1864'
  },
  {
    id: 4, category: 'personnalite',
    title: 'Aline Sitoé Diatta',
    subtitle: 'Reine résistante de Casamance (1920–1944)',
    image: '👸🏾',
    description: `Aline Sitoé Diatta, surnommée la "Reine de Kabrousse", est l'héroïne nationale de Casamance et l'une des figures féminines les plus inspirantes de l'histoire sénégalaise. Issue du peuple Diola, elle fut une prophétesse, prêtresse et chef de guerre.

Dans les années 1940, elle mobilisa son peuple contre l'oppression coloniale française, refusant de payer les impôts et s'opposant aux réquisitions de riz imposées par les autorités coloniales pendant la Seconde Guerre mondiale. Elle organisait des cérémonies religieuses interdites et appelait à la résistance pacifique mais ferme.

Arrêtée par les Français en 1943 et déportée au Mali, elle mourut en déportation à Tombouctou en 1944 à seulement 24 ans. Elle est aujourd'hui une icône nationale, symbole de la résistance féminine et de la fierté diola.`,
    tags: ['Résistance', 'Casamance', 'Féminisme'],
    period: '1920–1944'
  },
  {
    id: 5, category: 'lieu',
    title: "L'Île de Gorée",
    subtitle: 'Mémoire de la traite négrière — Dakar',
    image: '🏝️',
    description: `L'île de Gorée, classée au Patrimoine Mondial de l'UNESCO depuis 1978, est l'un des lieux les plus chargés d'histoire et d'émotion en Afrique. Située à 3 km des côtes de Dakar, cette île de seulement 28 hectares fut pendant plus de trois siècles l'un des principaux centres de la traite négrière transatlantique.

La Maison des Esclaves, construite en 1776, est le symbole le plus poignant de cette période sombre. Sa "Porte du Voyage sans Retour" par laquelle des millions d'Africains ont embarqué de force vers les Amériques est devenue un lieu de pèlerinage mondial.

Aujourd'hui, Gorée est aussi un lieu de réconciliation et de beauté. Ses maisons colorées, ses ruelles fleuries, ses musées et ses artistes en font un joyau culturel. De nombreux dirigeants mondiaux, dont Barack Obama et Jean Paul II, ont fait le pèlerinage à la Maison des Esclaves.`,
    tags: ['UNESCO', 'Histoire', 'Mémoire'],
    period: 'XVe–XIXe siècle'
  },
  {
    id: 6, category: 'lieu',
    title: 'La Grande Mosquée de Touba',
    subtitle: 'Cœur spirituel mouride — Touba',
    image: '🕌',
    description: `La Grande Mosquée de Touba est la plus grande mosquée d'Afrique de l'Ouest et le cœur spirituel de la confrérie Mouride. Fondée par Cheikh Ahmadou Bamba, le Khalife général des Mourides, sa construction débuta en 1932 et elle fut inaugurée en 1963.

Avec ses cinq minarets dont le plus haut atteint 87 mètres, et sa capacité d'accueillir plus d'un million de fidèles, elle est un chef-d'œuvre architectural et spirituel. La ville de Touba elle-même est considérée comme une ville sainte, administrée directement par la confrérie Mouride.

Chaque année, le Grand Magal de Touba — le plus grand rassemblement religieux d'Afrique — attire plus de cinq millions de pèlerins du monde entier. Cet événement commémore le départ en exil de Cheikh Ahmadou Bamba par les autorités coloniales françaises en 1895.`,
    tags: ['Islam', 'Mouride', 'Architecture'],
    period: 'Fondée 1932'
  },
  {
    id: 7, category: 'evenement',
    title: 'Indépendance du Sénégal',
    subtitle: '4 avril 1960 — Naissance d\'une nation',
    image: '🇸🇳',
    description: `Le 4 avril 1960, le Sénégal proclame son indépendance de la France après des décennies de colonisation. Cette date est aujourd'hui la fête nationale sénégalaise, célébrée avec éclat à Dakar et dans tout le pays.

L'indépendance fut le fruit d'un long processus politique mené par des militants comme Léopold Sédar Senghor et Mamadou Dia. Le Sénégal avait d'abord formé la Fédération du Mali avec le Soudan français avant de s'en séparer pour former un État indépendant.

Ce qui rend l'indépendance sénégalaise remarquable dans le contexte africain, c'est la transition pacifique du pouvoir colonial et l'établissement d'institutions démocratiques solides dès les premières années. Le Sénégal n'a jamais connu de coup d'État militaire réussi, ce qui en fait l'une des démocraties les plus stables d'Afrique.`,
    tags: ['Politique', 'Histoire', 'Démocratie'],
    period: '4 avril 1960'
  },
  {
    id: 8, category: 'evenement',
    title: 'Le Grand Magal de Touba',
    subtitle: 'Plus grand rassemblement religieux d\'Afrique',
    image: '🤲🏾',
    description: `Le Grand Magal de Touba est le pèlerinage annuel mouride qui commémore le départ en exil de Cheikh Ahmadou Bamba Mbacké par les autorités coloniales françaises le 10 septembre 1895. C'est l'événement religieux le plus important d'Afrique subsaharienne.

Chaque année, plus de cinq millions de fidèles convergent vers la ville sainte de Touba, venant du Sénégal, d'Afrique et du monde entier. Pendant quelques jours, Touba devient la deuxième ville la plus peuplée du Sénégal après Dakar.

L'organisation du Magal est entièrement assurée par la confrérie Mouride et ses talibés — un exemple remarquable d'organisation communautaire à grande échelle. Les millions de pèlerins reçoivent hébergement et nourriture gratuitement, grâce aux dons et à la solidarité mouride. L'événement génère une activité économique considérable et est un puissant symbole de la foi et de la culture sénégalaise.`,
    tags: ['Islam', 'Mouride', 'Pèlerinage'],
    period: 'Annuel (75e jour du calendrier musulman)'
  },
  {
    id: 9, category: 'culture',
    title: 'La Teranga',
    subtitle: "L'hospitalité comme art de vivre",
    image: '🤝🏾',
    description: `La Teranga — mot wolof signifiant "hospitalité" — est l'âme du Sénégal et la valeur culturelle la plus fondamentale de la société sénégalaise. Ce n'est pas simplement une règle de politesse : c'est une philosophie de vie profondément ancrée qui définit l'identité sénégalaise.

Au Sénégal, l'étranger est toujours accueilli comme un roi. On lui offre à manger avant même de connaître son nom. Le bol de thiéboudiènne partagé en famille, la tasse de thé (ataya) offerte à tout visiteur, le sourire chaleureux à l'inconnu — ce sont les manifestations quotidiennes de la teranga.

Cette valeur dépasse les frontières culturelles et religieuses. Chrétiens et musulmans, Wolofs et Sérères, riches et pauvres — tous partagent et pratiquent la teranga. Elle a valu au Sénégal sa réputation de "pays de la Teranga" dans le monde entier. L'équipe nationale de football elle-même porte le surnom de "Lions de la Teranga".`,
    tags: ['Valeurs', 'Société', 'Identité'],
    period: 'Depuis toujours'
  },
  {
    id: 10, category: 'culture',
    title: 'Le Thiéboudiènne',
    subtitle: 'Plat national, patrimoine UNESCO',
    image: '🍚',
    description: `Le Thiéboudiènne (ou Ceebu Jën en wolof, littéralement "riz au poisson") est le plat national du Sénégal, inscrit au Patrimoine Culturel Immatériel de l'UNESCO en 2021. C'est un festin de riz cuit dans une sauce tomate parfumée avec du poisson, des légumes (manioc, aubergine, carotte, gombo) et des épices.

Créé dans la ville de Saint-Louis au XIXe siècle par la grande cuisinière Penda Mbaye, le thiéboudiènne est aujourd'hui le lien culturel le plus fort qui unit tous les Sénégalais. Le repas du midi — partagé en famille ou entre amis autour d'un grand plat commun — est un rituel social fondamental.

Il existe de nombreuses variantes : le thiébouguinar (riz au poulet), le thiébouyapp (riz à la viande), le thiéboudiènne rouge ou blanc... Chaque région, chaque famille a sa propre recette jalousement gardée. Mais partout, le thiéboudiènne rassemble, réunit et incarne la teranga sénégalaise.`,
    tags: ['Gastronomie', 'UNESCO', 'Tradition'],
    period: 'XIXe siècle'
  },
  {
    id: 11, category: 'defi',
    title: "L'Exode Rural et l'Urbanisation",
    subtitle: 'Le défi des villes en croissance rapide',
    image: '🏗️',
    description: `Le Sénégal, comme de nombreux pays africains, fait face à une urbanisation massive et rapide. Dakar concentre à elle seule près de 25% de la population nationale sur moins de 1% du territoire national. Cette concentration crée des défis énormes : logement, emploi, mobilité, accès aux services de base.

Les quartiers périphériques de Dakar (Pikine, Guédiawaye, Rufisque) se développent souvent de manière anarchique, sans planification urbaine ni infrastructures adéquates. Les embouteillages monumentaux paralysent la capitale quotidiennement.

Mais le Sénégal fait face à ce défi avec ambition. Le projet du Train Express Régional (TER) reliant Dakar à l'Aéroport AIBD, la construction de la nouvelle ville de Diamniadio à 30 km de Dakar, et le programme de logements sociaux sont des réponses concrètes à ce défi. La question centrale reste : comment construire une urbanisation inclusive qui profite à tous les citoyens ?`,
    tags: ['Développement', 'Société', 'Urbanisme'],
    period: 'XXe–XXIe siècle'
  },
  {
    id: 12, category: 'defi',
    title: "La Migration des Jeunes",
    subtitle: "L'émigration comme déchirement et espoir",
    image: '🌊',
    description: `La migration est l'un des phénomènes les plus douloureux et complexes de la société sénégalaise contemporaine. Chaque année, des milliers de jeunes Sénégalais tentent la traversée périlleuse de l'Atlantique ou de la Méditerranée, fuyant le chômage, le manque de perspectives et l'espoir d'une vie meilleure en Europe.

Les pirogues de pêcheurs transformées en embarcations de fortune, les décès en mer, les familles en deuil — ces images poignantes sont malheureusement récurrentes. Pourtant, la diaspora sénégalaise envoie chaque année des milliards de francs CFA au pays — les "transferts de fonds" représentent une part majeure du PIB sénégalais.

Le défi est double : créer des opportunités économiques suffisantes pour les jeunes au Sénégal (l'entrepreneuriat, l'agriculture moderne, le numérique) tout en reconnaissant le droit à la mobilité. Des initiatives comme le programme YOONU YOKKUTE ("la voie du succès") tentent de promouvoir une migration ordonnée et des alternatives locales.`,
    tags: ['Jeunesse', 'Économie', 'Diaspora'],
    period: 'XXe–XXIe siècle'
  },
  {
    id: 13, category: 'culture',
    title: 'La Lutte Sénégalaise',
    subtitle: 'Sport roi, patrimoine vivant',
    image: '🤼',
    description: `La lutte traditionnelle sénégalaise (Laamb en wolof) est bien plus qu'un sport — c'est une institution culturelle, un spectacle, une religion laïque qui rassemble tous les Sénégalais sans distinction d'ethnie, de classe ou de religion. Les lutteurs (laambaars) sont les véritables stars nationales, parfois plus célèbres que les footballeurs.

Les combats se déroulent dans l'arène, précédés de rituels mystiques (gris-gris, bénédictions des marabouts, danses guerrières) qui font partie intégrante du spectacle. Les plus grands lutteurs comme Balla Gaye 2, Modou Lô, Eumeu Sène et feu Tyson sont des légendes vivantes.

La lutte sénégalaise avec frappe (où les lutteurs peuvent frapper avec les poings, comme la boxe) est unique en Afrique. Le Comité National de Gestion de la Lutte (CNG) organise des combats dans l'arène nationale de Demba Diop. Ces événements génèrent des enjeux financiers considérables, les cachets des lutteurs vedettes pouvant atteindre des centaines de millions de francs CFA.`,
    tags: ['Sport', 'Culture', 'Tradition'],
    period: 'Depuis les origines'
  },
  {
    id: 14, category: 'lieu',
    title: 'Le Lac Rose (Lac Retba)',
    subtitle: 'Merveille naturelle rose unique au monde',
    image: '🌸',
    description: `Le Lac Retba, surnommé "Lac Rose", est l'une des merveilles naturelles les plus spectaculaires d'Afrique. Situé à 35 km au nord-est de Dakar, sa couleur rose — variant du rose pâle au rouge sang selon les saisons et l'ensoleillement — est due à une algue microscopique, Dunaliella salina, qui produit un pigment rose en réponse à la forte concentration en sel.

Avec une teneur en sel parfois supérieure à 40% (contre 3,5% pour l'océan), le Lac Rose est plus salé que la mer Morte. Cette salinité fait flotter naturellement les baigneurs et explique l'activité principale qui se déroule sur ses rives : l'extraction du sel.

Des milliers de collecteurs de sel — hommes et femmes — s'activent chaque jour dans ces eaux rosées, récoltant à la main le sel qui cristallise naturellement. Ils enduisent leur corps de beurre de karité pour se protéger du sel. Ce paysage unique, entre ciel rose et eau cramoisie, attire des photographes et touristes du monde entier. Le Lac Rose a aussi accueilli l'arrivée du célèbre Rallye Dakar.`,
    tags: ['Nature', 'Tourisme', 'Merveille'],
    period: 'Merveille naturelle'
  },
  {
    id: 15, category: 'personnalite',
    title: 'Cheikh Ahmadou Bamba',
    subtitle: 'Fondateur du Mouridisme (1853–1927)',
    image: '🕊️',
    description: `Cheikh Ahmadou Bamba Mbacké, le "Khadimou Rassoul" (Serviteur du Prophète), est le fondateur de la confrérie Mouride — l'une des confréries soufies les plus importantes d'Afrique. Né à Mbacké-Baol, il fut un érudit islamique, un poète prolifique et un résistant non-violent face à la colonisation française.

Sa philosophie du travail comme forme de prière — "Ora et Labora" version soufie — a fait des Mourides de remarquables entrepreneurs. Les marchands mourides sont présents dans les plus grandes villes du monde, de New York à Tokyo en passant par Paris. Ils incarnent une forme d'entrepreneuriat africain mondialisé unique.

Exilé deux fois par les Français (au Gabon puis en Mauritanie), Cheikh Bamba revint au Sénégal auréolé de la conviction de ses fidèles que sa foi l'avait protégé de toutes les tentatives de le faire taire. Il est représenté dans la seule photo qui existe de lui — une image dont l'authenticité est sacrée pour les Mourides. Sa ville sainte, Touba, est aujourd'hui la deuxième ville du Sénégal.`,
    tags: ['Islam', 'Spiritualité', 'Résistance'],
    period: '1853–1927'
  },

  // ══════════════════════════════════════════════
  // PERSONNALITÉS SUPPLÉMENTAIRES
  // ══════════════════════════════════════════════
  {
    id: 16, category: 'personnalite',
    title: 'Lat Dior Diop',
    subtitle: 'Dernier Damel du Cayor, héros de la résistance (1842–1886)',
    image: '⚔️',
    description: `Lat Dior Ngoné Latyr Diop est le symbole absolu de la résistance sénégalaise contre la colonisation française. Damel (roi) du Cayor — le plus puissant royaume wolof —, il fut le premier à refuser catégoriquement la construction du chemin de fer Dakar-Saint-Louis, symbole de la pénétration coloniale dans les terres africaines.

Pendant près de vingt ans, Lat Dior mena une guérilla épuisante contre les troupes françaises, alternant résistance armée, alliances stratégiques et exils. Musulman fervent, il se convertit à l'islam sous l'influence d'El Hadj Umar Tall et fit du djihad sa cause.

Le 27 octobre 1886, refusant de capituler, Lat Dior mourut au combat à Dekhle, à cheval, faisant face à l'ennemi. Sa mort au combat plutôt qu'en captivité fit de lui une légende immortelle. Son cheval Malaw est autant célébré que lui dans la mémoire sénégalaise. Aujourd'hui, l'avenue Lat Dior à Dakar et de nombreux établissements portent son nom.`,
    tags: ['Résistance', 'Cayor', 'Royauté wolof'],
    period: '1842–1886'
  },
  {
    id: 17, category: 'personnalite',
    title: 'Blaise Diagne',
    subtitle: 'Premier député africain à l\'Assemblée nationale française (1872–1934)',
    image: '🏛️',
    description: `Blaise Diagne est une figure historique majeure et controversée de l'histoire sénégalaise et africaine. Né à Gorée, il devint en 1914 le premier africain noir à être élu à l'Assemblée nationale française, représentant les "quatre communes" du Sénégal (Dakar, Gorée, Rufisque, Saint-Louis).

Son élection fut une révolution politique : il battit les candidats blancs et métis en mobilisant massivement les électeurs africains. Il obtint la citoyenneté française pleine et entière pour les habitants des quatre communes — une victoire historique pour les droits des Africains.

Cependant, son rôle pendant la Première Guerre mondiale est ambigu : il recruta de force des milliers de tirailleurs sénégalais (les "Tirailleurs sénégalais") pour combattre pour la France, ce qui lui valut de vives critiques. Son parcours illustre la complexité des rapports entre l'Afrique et la France coloniale.`,
    tags: ['Politique', 'France', 'Droits civiques'],
    period: '1872–1934'
  },
  {
    id: 18, category: 'personnalite',
    title: 'Youssou Ndour',
    subtitle: 'Voix de l\'Afrique, ambassadeur culturel mondial (1959–)',
    image: '🎵',
    description: `Youssou Ndour est sans conteste l'artiste africain le plus célèbre et le plus influent de sa génération. Né à Dakar dans une famille de griots, sa voix — un ténor extraordinaire couvrant plusieurs octaves — lui a valu d'être qualifié par le magazine Time de l'"une des artistes les plus importants du XXe siècle".

Inventeur du mbalax — fusion explosive de percussions traditionnelles sabar, de guitare électrique et de pop moderne —, il a fait danser le monde entier depuis les années 1980. Son album "The Guide" avec Neneh Cherry et le titre "7 Seconds" fut un succès planétaire en 1994.

Mais Youssou Ndour est aussi un homme engagé. Il a milité pour l'annulation de la dette africaine avec Bono et Bob Geldof, cofondé Africa Live pour promouvoir la musique africaine, et s'est engagé en politique en devenant Ministre du Tourisme et de la Culture sous Macky Sall (2012-2013). Son groupe le Super Étoile de Dakar est une institution nationale.`,
    tags: ['Musique', 'Mbalax', 'Culture mondiale'],
    period: '1959–présent'
  },
  {
    id: 19, category: 'personnalite',
    title: 'Kocc Barma Fall',
    subtitle: 'Grand philosophe wolof (XVIIe siècle)',
    image: '🧠',
    description: `Kocc Barma Fall est considéré comme le plus grand philosophe de la tradition orale wolof, une sorte de Socrate africain dont la sagesse traverse les siècles. Il vécut au XVIIe siècle dans le Cayor et est célèbre pour ses xam-xam (paroles de sagesse) qui constituent un véritable système de pensée éthique et philosophique.

Ses aphorismes — transmis oralement de génération en génération — traitent de la condition humaine, de la justice, de l'hypocrisie sociale, des rapports de pouvoir et de la nature de la vérité. Parmi ses sentences les plus célèbres : "L'homme est la médecine de l'homme" (Nit nit ay garabam) — devenue le symbole de la solidarité sénégalaise.

Ce que Kocc Barma représente va au-delà de la philosophie : il incarne la capacité des cultures africaines à produire une pensée sophistiquée et universelle, sans avoir recours à l'écriture. Sa tradition orale est une forme de patrimoine immatériel d'une richesse inestimable.`,
    tags: ['Philosophie', 'Wolof', 'Sagesse'],
    period: 'XVIIe siècle'
  },
  {
    id: 20, category: 'personnalite',
    title: 'El Hadj Malick Sy',
    subtitle: 'Khalife Tijaniyya, bâtisseur de paix (1855–1922)',
    image: '📿',
    description: `El Hadj Malick Sy est l'une des figures islamiques les plus vénérées du Sénégal et de toute l'Afrique de l'Ouest. Grand érudit islamique, poète et pédagogue, il fut le propagateur de la confrérie Tijaniyya au Sénégal et fonda la ville sainte de Tivaouane qui porte son empreinte spirituelle jusqu'à aujourd'hui.

Contrairement à Cheikh Ahmadou Bamba qui s'opposa frontalement à la colonisation, El Hadj Malick Sy adopta une position de collaboration pragmatique avec l'administration coloniale française — non par soumission, mais par volonté de protéger ses fidèles et de développer l'éducation islamique. Cette position nuancée lui permit d'obtenir des concessions importantes pour les musulmans sénégalais.

Son oeuvre poétique en arabe est considérée comme l'une des plus belles de la littérature islamique ouest-africaine. Chaque année, le Gamou de Tivaouane — pèlerinage commémorant sa naissance — rassemble des millions de Tidianes du monde entier. Sa ville sainte, Tivaouane, est le pendant Tidiane de la ville mouride de Touba.`,
    tags: ['Islam', 'Tijaniyya', 'Éducation'],
    period: '1855–1922'
  },
  {
    id: 21, category: 'personnalite',
    title: 'Mamadou Dia',
    subtitle: 'Premier ministre, économiste visionnaire (1910–2009)',
    image: '📋',
    description: `Mamadou Dia fut le premier Premier ministre du Sénégal indépendant (1960-1962) et l'un des pères fondateurs de la nation. Économiste et socialiste convaincu, il rêvait d'un Sénégal à la voie africaine du socialisme — une troisième voie entre capitalisme et communisme soviétique.

Son projet de société était ambitieux : nationaliser les ressources, développer les coopératives rurales, redistribuer les terres et réduire la dépendance aux anciens colonisateurs. Ces idées, avant-gardistes pour l'époque, lui valurent des inimitiés puissantes.

En décembre 1962, un bras de fer l'opposa à Senghor autour d'une motion de censure à l'Assemblée nationale. L'épisode, resté obscur dans l'histoire officielle, aboutit à son arrestation pour "tentative de coup d'État" — accusation qu'il a toujours niée. Condamné, il resta en prison jusqu'en 1974. Sa réhabilitation partielle et ses mémoires publiés tardivement ont remis en question le récit officiel de cet épisode fondateur.`,
    tags: ['Politique', 'Socialisme', 'Indépendance'],
    period: '1910–2009'
  },
  {
    id: 22, category: 'personnalite',
    title: 'Abdou Diouf',
    subtitle: 'Deuxième Président du Sénégal (1935–)',
    image: '🇸🇳',
    description: `Abdou Diouf succéda à Léopold Sédar Senghor en 1981 — un passage de pouvoir pacifique remarquable en Afrique — et gouverna le Sénégal pendant vingt ans jusqu'en 2000. Technocrate brillant formé à Sciences Po Paris, il hérita d'un pays en crise économique profonde, aggravée par la chute des prix des matières premières.

Sous sa présidence, le Sénégal connut le Programme d'Ajustement Structurel imposé par le FMI, la dévaluation douloureuse du franc CFA en 1994 (de 50%), et la guerre en Casamance qui éclata en 1982. Mais il maintint aussi les libertés politiques et économiques fondamentales.

En 2000, il accepta sa défaite électorale face à Abdoulaye Wade — alternance démocratique historique et rare en Afrique — et quitta le pouvoir pacifiquement. Cette transmission du pouvoir par les urnes a consolidé la réputation du Sénégal comme modèle démocratique africain. Il devint ensuite Secrétaire général de l'Organisation Internationale de la Francophonie (2003-2014).`,
    tags: ['Politique', 'Démocratie', 'Francophonie'],
    period: '1935–présent'
  },
  {
    id: 23, category: 'personnalite',
    title: 'Abdoulaye Wade',
    subtitle: 'Troisième Président, "Sopi" (1926–)',
    image: '🌊',
    description: `Abdoulaye Wade est l'une des figures les plus complexes et fascinantes de la politique sénégalaise contemporaine. Après vingt-six ans d'opposition acharnée — perdant élection après élection contre Senghor puis Diouf —, il remporta la présidentielle de 2000 sur le cri de ralliement "Sopi" (changement en wolof). Son élection fut une libération populaire immense.

Juriste de formation, fondateur du Parti Démocratique Sénégalais (PDS), Wade se présenta comme le champion de la démocratie et du développement. Sous sa présidence, le Sénégal connut de grands travaux d'infrastructure : autoroutes, aéroport, monuments architecturaux controversés comme le Monument de la Renaissance africaine — statue de 52 mètres inaugurée en 2010 à Dakar.

Mais son règne fut aussi marqué par des accusations de dérive autoritaire, de corruption et de tentative de faire succéder son fils Karim. Sa tentative d'un troisième mandat en 2012 provoqua une insurrection populaire — la "révolution du 23 juin 2011" — qui força sa renonciation. Il perdit l'élection de 2012 face à Macky Sall.`,
    tags: ['Politique', 'Alternance', 'Sopi'],
    period: '1926–présent'
  },
  {
    id: 24, category: 'personnalite',
    title: 'Ibrahima Niasse',
    subtitle: 'Shaykh de Kaolack, guide spirituel de millions (1900–1975)',
    image: '✨',
    description: `Cheikh Ibrahima Niasse, connu sous le titre de "Baye" (Père), fut le grand khalife de la Tijaniyya de Kaolack et l'un des personnages spirituels les plus influents de l'Islam africain au XXe siècle. Son mouvement, la Fayda Tijaniyya (le Flot, la Grâce divine), toucha des dizaines de millions de fidèles à travers l'Afrique de l'Ouest, de l'Afrique du Nord et jusqu'au Sénégal, Nigéria, Ghana, Niger...

Érudit islamique de haut rang, il fut reconnu par les autorités religieuses du monde arabe comme un maître soufi d'exception. Sa ville de Médina Baye à Kaolack est aujourd'hui un centre de pèlerinage mondial qui attire des fidèles de 30 pays lors du Gamou annuel.

Sa relation avec le Nigéria est particulièrement forte : il y convertit des millions de personnes à la Tijaniyya dans les années 1940-50. Aujourd'hui, sa voie compte plus de 100 millions de fidèles dans le monde, faisant de lui l'un des leaders religieux africains dont l'influence mondiale est la plus grande.`,
    tags: ['Islam', 'Tijaniyya', 'Spiritualité mondiale'],
    period: '1900–1975'
  },
  {
    id: 25, category: 'personnalite',
    title: 'Ousmane Sembène',
    subtitle: 'Père du cinéma africain (1923–2007)',
    image: '🎬',
    description: `Ousmane Sembène est le "père du cinéma africain" — titre qu'il mérite pleinement. Né à Ziguinchor en Casamance, il fut docker à Marseille, syndicaliste, romancier, puis cinéaste — un parcours extraordinaire qui illustre la richesse des cultures africaines.

Son roman "Les Bouts de bois de Dieu" (1960), qui raconte la grande grève des cheminots Dakar-Niger de 1947-1948, est considéré comme l'un des chefs-d'œuvre de la littérature africaine francophone. Il dépeint avec une précision et une humanité rares la résistance ouvrière et la lutte pour la dignité.

Comme cinéaste, il réalisa des films devenus classiques : "Xala" (1975) — satire acide de la bourgeoisie africaine post-indépendance —, "Ceddo" (1977) — sur la résistance à l'islamisation forcée —, et "Moolaadé" (2004) — contre l'excision féminine, primé à Cannes. Ses films en wolof, en diola, en mandingue brisèrent le monopole du français dans la culture africaine.`,
    tags: ['Cinéma', 'Littérature', 'Résistance culturelle'],
    period: '1923–2007'
  },
  {
    id: 26, category: 'personnalite',
    title: 'Fatou Sow',
    subtitle: 'Sociologue féministe pionnière (1947–)',
    image: '👩🏾‍🎓',
    description: `Fatou Sow est l'une des grandes intellectuelles africaines, sociologue et féministe dont le travail a profondément marqué les études de genre en Afrique. Professeure à l'Université Cheikh Anta Diop de Dakar et chercheuse au CNRS, elle a consacré sa carrière à analyser la condition des femmes en Afrique et à promouvoir leurs droits.

Cofondatrice du réseau AFARD (Association of African Women for Research and Development) et de nombreuses associations de défense des droits des femmes, elle a lié la pensée académique à l'action militante. Elle a également joué un rôle clé dans les débats internationaux sur les droits reproductifs, la violence de genre et la laïcité en contexte africain.

Son travail démontre que le féminisme africain a ses propres racines et ne peut se résumer à l'importation de concepts occidentaux. Elle a théorisé un féminisme ancré dans les réalités africaines, tenant compte des héritages culturels tout en les questionnant critiquement.`,
    tags: ['Féminisme', 'Sociologie', 'Droits des femmes'],
    period: '1947–présent'
  },
  {
    id: 27, category: 'personnalite',
    title: 'Boubacar Boris Diop',
    subtitle: 'Écrivain, journaliste, penseur politique (1946–)',
    image: '✍🏾',
    description: `Boubacar Boris Diop est l'un des intellectuels sénégalais les plus engagés et les plus prolifiques de sa génération. Romancier, essayiste et journaliste, il est l'auteur de "Murambi, le livre des ossements" — roman bouleversant sur le génocide rwandais qu'il écrivit après avoir séjourné au Rwanda en 1998 dans le cadre du projet "Rwanda : écrire par devoir de mémoire".

Militant convaincu de l'écriture en langues africaines, il est l'un des rares intellectuels francophones à avoir décidé d'écrire principalement en wolof. Son roman "Doomi Golo" (Les fils du caméléon, 2003) est considéré comme le premier grand roman modern en wolof. Ce choix linguistique radical est à la fois un acte politique et une conviction profonde sur la survie des cultures africaines.

Ses analyses politiques, notamment sur la situation africaine contemporaine, sont suivies par des millions de lecteurs. Ses positions courageuses sur des sujets tabous — les dérives des élites africaines, la complicité des intellectuels, la nécessité d'une pensée décoloniale — font de lui une voix incontournable.`,
    tags: ['Littérature', 'Wolof', 'Engagement politique'],
    period: '1946–présent'
  },

  // ══════════════════════════════════════════════
  // LIEUX SUPPLÉMENTAIRES
  // ══════════════════════════════════════════════
  {
    id: 28, category: 'lieu',
    title: 'Saint-Louis du Sénégal',
    subtitle: 'Ancienne capitale coloniale, ville UNESCO',
    image: '🌉',
    description: `Saint-Louis est l'une des villes les plus chargées d'histoire de l'Afrique de l'Ouest. Fondée en 1659 par les Français sur une île du fleuve Sénégal, elle fut la première ville coloniale d'Afrique subsaharienne et servit de capitale de l'Afrique Occidentale Française (AOF) jusqu'en 1902, puis du Sénégal jusqu'en 1958.

Son architecture coloniale unique — maisons à arcades, balcons en fer forgé, pont Faidherbe long de 500 mètres inauguré en 1897 — lui a valu d'être classée au Patrimoine Mondial de l'UNESCO en 2000. La ville respire l'histoire à chaque coin de rue : l'influence française, l'héritage métis des familles signares (femmes d'affaires afro-européennes), la culture du Fouta Toro.

Mais Saint-Louis est aussi une ville en danger. La montée des eaux de l'Atlantique et les inondations saisonnières du fleuve menacent son existence même. Le quartier de Guet N'Dar, habité par les pêcheurs Lébous, est particulièrement vulnérable. Saint-Louis est l'une des villes africaines les plus menacées par le changement climatique.`,
    tags: ['UNESCO', 'Histoire coloniale', 'Architecture'],
    period: 'Fondée 1659'
  },
  {
    id: 29, category: 'lieu',
    title: 'La Casamance',
    subtitle: 'Région verte, paradis naturel, identité forte',
    image: '🌿',
    description: `La Casamance est la région la plus méridionale du Sénégal, séparée du reste du pays par la Gambie. Avec ses forêts tropicales luxuriantes, ses rizières en terrasses, ses plages immaculées et ses mangroves, elle contraste radicalement avec le reste du Sénégal plus aride. C'est souvent appelé le "pays des cases à impluvium", ces maisons traditionnelles diola à cour intérieure ouverte sur le ciel.

Les peuples diola, qui constituent la majorité de la population, ont une culture profondément ancrée dans la riziculture et des traditions spirituelles animistes complexes. Leur organisation sociale horizontale — sans roi ni chef centralisé — est unique en Afrique de l'Ouest. Le roi du riz, le boekin (autel sacré) et les initiations masculines (bukut) sont au cœur de l'identité diola.

La Casamance a aussi connu un long conflit armé depuis 1982, mené par le MFDC (Mouvement des Forces Démocratiques de Casamance) qui réclame l'indépendance. Ce conflit, le plus long d'Afrique de l'Ouest, a causé des milliers de morts et des centaines de milliers de déplacés. Des accords de paix fragiles ont été signés, mais la situation reste complexe.`,
    tags: ['Nature', 'Diola', 'Conflit', 'Biodiversité'],
    period: 'Région historique'
  },
  {
    id: 30, category: 'lieu',
    title: 'Le Delta du Saloum',
    subtitle: 'Réserve de biosphère, UNESCO (1981)',
    image: '🦅',
    description: `Le Delta du Saloum est l'un des joyaux naturels du Sénégal et d'Afrique de l'Ouest. Classé Réserve de Biosphère par l'UNESCO en 1981 et Patrimoine Mondial en 2011, cet écosystème de 180 000 hectares est un labyrinthe de bras de mer, de mangroves, d'îles et de marigots d'une richesse exceptionnelle.

La région abrite une faune extraordinaire : flamants roses, pélicans, lamantins, dauphins, tortues marines, et des centaines d'espèces d'oiseaux migrateurs qui font de ce delta un paradis pour les ornithologues du monde entier. Les mangroves — parmi les mieux préservées d'Afrique — jouent un rôle crucial comme nurserie pour les poissons et comme rempart contre l'érosion côtière.

Les populations Sérères Niominkas et les Lébous qui habitent les îles ont développé une culture maritime unique, avec une relation intime à la mer et des techniques de pêche artisanale transmises depuis des générations. Les amas coquilliers (amas de coquilles millénaires) témoignent d'une occupation humaine de la zone depuis au moins 2 000 ans.`,
    tags: ['UNESCO', 'Nature', 'Biodiversité'],
    period: 'Patrimoine naturel'
  },
  {
    id: 31, category: 'lieu',
    title: 'Ziguinchor',
    subtitle: 'Capitale de Casamance, carrefour culturel',
    image: '🏙️',
    description: `Ziguinchor, fondée en 1645 par les Portugais, est la capitale de la région de Casamance et la principale ville du sud du Sénégal. Son nom viendrait d'une exclamation portugaise face aux populations locales qui criaient "Tchiona" (viens, traverse !). La ville conserve de nombreuses traces de son passé portugais, ainsi qu'une architecture coloniale française distincte.

Carrefour de nombreuses ethnies — Diola, Mandingue, Balante, Peul, Manjack — Ziguinchor est une ville cosmopolite et culturellement riche. Sa gastronomie, influencée par ces multiples cultures, est réputée pour ses poissons fumés, son riz aux arachides, son palme et ses nombreux fruits tropicaux.

Malgré les difficultés liées au conflit casamançais qui a longtemps freiné son développement, Ziguinchor connaît aujourd'hui un renouveau. L'art y est vivant : musique, danse, théâtre, peinture — la ville a produit de nombreux artistes et intellectuels. Le Festival du Diola et les cérémonies d'initiation bukut attirent les visiteurs curieux des cultures traditionnelles.`,
    tags: ['Casamance', 'Multiculturalisme', 'Histoire portugaise'],
    period: 'Fondée 1645'
  },
  {
    id: 32, category: 'lieu',
    title: 'Tivaouane',
    subtitle: 'Ville sainte Tijaniyya',
    image: '🕌',
    description: `Tivaouane est la deuxième grande ville sainte du Sénégal, après Touba. C'est le cœur spirituel de la confrérie Tijaniyya au Sénégal, fondé par El Hadj Malick Sy. Située à 80 km au nord de Dakar, la ville se transforme chaque année lors du Gamou (Mawlid) — la commémoration de la naissance du Prophète Mohammed — en un des plus grands rassemblements religieux d'Afrique.

La Grande Mosquée de Tivaouane, construite autour du mausolée d'El Hadj Malick Sy, est le centre de pèlerinage de millions de Tidianes. Les cérémonies du Gamou, avec leurs chants de zikar (invocations), leurs processions nocturnes et leur atmosphère de ferveur collective, sont d'une beauté et d'une intensité rare.

La ville est aussi un centre d'excellence islamique avec ses nombreuses daaras (écoles coraniques) et son université islamique. Les griots tidianes, les poèmes en arabe d'El Hadj Malick Sy récités en choeur, et la tradition de générosité et d'hospitalité font de Tivaouane un lieu à part dans le paysage religieux et culturel sénégalais.`,
    tags: ['Islam', 'Tijaniyya', 'Ville sainte'],
    period: 'Ville sainte'
  },
  {
    id: 33, category: 'lieu',
    title: 'La Médina de Dakar',
    subtitle: 'Quartier historique, coeur populaire',
    image: '🏘️',
    description: `La Médina de Dakar fut créée en 1914 par l'administration coloniale française après une épidémie de peste — les autorités coloniales en profitèrent pour déplacer les populations africaines du plateau de Dakar (réservé aux Blancs) vers ce nouveau quartier. Acte de ségrégation raciale, la création de la Médina fut une blessure dans la conscience collective dakaroise.

Mais la Médina s'est transformée en haut lieu de la culture et de l'identité africaine à Dakar. C'est là que vivaient les familles wolof les plus anciennes de la capitale, que les artisans perpétuent leurs métiers, que les femmes préparent le thiéboudiènne le mieux assaisonné. Ses ruelles, ses marchés animés, ses concessions familiales multigénérationnelles sont le visage authentique de Dakar populaire.

La Médina est aussi un haut lieu du football, des arts martiaux, de la lutte et de la musique. De nombreux artistes, musiciens et lutteurs célèbres en sont originaires. Aujourd'hui, ce quartier historique fait face à une intense pression immobilière qui menace son tissu social et architectural unique.`,
    tags: ['Dakar', 'Histoire coloniale', 'Culture populaire'],
    period: 'Fondée 1914'
  },
  {
    id: 34, category: 'lieu',
    title: 'Le Cap-Vert et la Presqu\'île',
    subtitle: 'Péninsule, Dakar, point le plus occidental d\'Afrique',
    image: '🌊',
    description: `La Presqu'île du Cap-Vert, sur laquelle s'étend la ville de Dakar, est le point le plus occidental du continent africain. Ce fait géographique majeur a façonné l'histoire du Sénégal : c'est ici que les Européens — Portugais d'abord, puis Français — établirent leurs premières bases commerciales en Afrique subsaharienne.

Les Lébous, peuple de pêcheurs et de marins, sont les habitants originels de la presqu'île. Leur organisation sociale et politique particulière — une sorte de démocratie traditionnelle —, leur spiritualité autour des rab (génies) et leurs cérémonies de ndëpp (exorcisme) sont un patrimoine vivant fascinant. Les Lébous ont farouchement résisté à la prise de Dakar par les Français en 1857.

Dakar, née de ce terreau, est devenue l'une des métropoles les plus dynamiques d'Afrique. Mégapole de 4 millions d'habitants, capitale économique, culturelle et politique, elle concentre des inégalités extrêmes : les palaces des Almadies voisinent avec les bidonvilles de Pikine. Cette tension entre richesse et pauvreté est le défi central de la ville.`,
    tags: ['Géographie', 'Lébou', 'Dakar'],
    period: 'Peuplée depuis des millénaires'
  },

  // ══════════════════════════════════════════════
  // ÉVÉNEMENTS SUPPLÉMENTAIRES
  // ══════════════════════════════════════════════
  {
    id: 35, category: 'evenement',
    title: 'La Grande Grève des Cheminots (1947–1948)',
    subtitle: 'La résistance ouvrière qui secoua l\'empire colonial',
    image: '🚂',
    description: `La grève des cheminots de la ligne Dakar-Niger, qui débuta le 10 octobre 1947 et dura cinq mois et demi, est l'un des moments les plus héroïques de la lutte anticoloniale en Afrique de l'Ouest. Quelque 20 000 travailleurs africains cessèrent le travail pour exiger l'égalité de salaires et d'avantages sociaux avec leurs collègues français.

Le mot d'ordre était simple mais révolutionnaire : "À travail égal, salaire égal." Les cheminots africains réclamaient les mêmes droits que leurs homologues européens — allocations familiales, avancement à l'ancienneté, droits à la retraite. L'administration coloniale refusa, organisa des briseurs de grève et coupa les vivres aux familles des grévistes.

La grève tint. Pendant 160 jours, hommes, femmes et enfants résistèrent à la faim et à la répression. Elle se termina en mars 1948 par une victoire partielle mais symbolique des travailleurs. Ousmane Sembène en a fait le sujet de son roman magistral "Les Bouts de bois de Dieu" (1960), qui reste la meilleure chronique de cet événement fondateur.`,
    tags: ['Travail', 'Résistance', 'Anticolonialisme'],
    period: 'Octobre 1947 – Mars 1948'
  },
  {
    id: 36, category: 'evenement',
    title: 'L\'Alternance démocratique de 2000',
    subtitle: 'Wade élu, la démocratie triomphe',
    image: '🗳️',
    description: `L'élection présidentielle du 19 mars 2000 représente un tournant historique pour le Sénégal et pour toute l'Afrique : pour la première fois depuis l'indépendance, le parti au pouvoir — le Parti Socialiste de Diouf, au pouvoir depuis 40 ans — perdait une élection présidentielle et acceptait pacifiquement sa défaite.

Abdoulaye Wade, après vingt-six ans d'opposition et quatre tentatives présidentielles infructueuses, remporta au second tour avec 58% des voix. La nuit du 19 mars fut une explosion de joie populaire dans les rues de Dakar. Les gens pleuraient, dansaient, s'embrassaient — beaucoup n'avaient jamais connu d'autre parti au pouvoir.

Le plus remarquable fut le comportement d'Abdou Diouf : reconnaissant sa défaite avant même la proclamation officielle des résultats, il appela Wade pour le féliciter et organisa une transition pacifique exemplaire. Ce moment a inscrit le Sénégal comme phare de la démocratie africaine. L'alternance de 2000 reste un modèle pour tout le continent.`,
    tags: ['Démocratie', 'Alternance', 'Histoire politique'],
    period: '19 mars 2000'
  },
  {
    id: 37, category: 'evenement',
    title: 'La CAN 2021 — Victoire des Lions',
    subtitle: 'Le Sénégal champion d\'Afrique pour la première fois',
    image: '🏆',
    description: `Le 6 février 2022 à Yaoundé au Cameroun, l'équipe nationale de football du Sénégal — les "Lions de la Teranga" — remporta pour la première fois de son histoire la Coupe d'Afrique des Nations (CAN 2021, disputée en janvier-février 2022). Ce titre longtemps attendu fut une explosion de joie nationale sans précédent.

La finale contre l'Égypte fut un duel tendu aux tirs au but. Sadio Mané — capitaine de l'équipe et meilleur joueur africain — manqua son penalty en début de match, se releva et inscrivit le tir au but décisif. Le Sénégal gagna 4-2 aux tirs au but. Dans tout le pays, ce fut un délire collectif.

Cette victoire dépasse le sport. Pour des millions de Sénégalais, elle représente la reconnaissance internationale de leur nation, la fierté retrouvée, la preuve que le Sénégal peut être numéro un. L'équipe nationale, portée par des joueurs évoluant dans les plus grands clubs européens (Mané à Liverpool, Koulibaly à Chelsea, Gana Guèye à Everton...), est le symbole d'une génération sénégalaise qui réussit sur la scène mondiale.`,
    tags: ['Football', 'Sport', 'Fierté nationale'],
    period: '6 février 2022'
  },
  {
    id: 38, category: 'evenement',
    title: 'La Révolution du 23 Juin 2011',
    subtitle: 'Le peuple dit Non au troisième mandat',
    image: '✊🏾',
    description: `Le 23 juin 2011 est une date gravée dans la mémoire collective sénégalaise comme le jour où le peuple descendit dans la rue pour défendre la démocratie. Abdoulaye Wade, déjà à son deuxième mandat, tenta de faire adopter une réforme constitutionnelle permettant d'être élu à la présidence avec 25% des voix — ouvrant la voie à un troisième mandat et à l'élection de son fils Karim.

Le peuple répondit massivement. Des centaines de milliers de Sénégalais — jeunes, vieux, femmes, intellectuels, artistes — envahirent les places publiques à travers tout le pays. Le mouvement citoyen "Y'en a Marre" (composé de rappeurs et de journalistes) et la coalition de l'opposition organisèrent la résistance.

Wade renonça à sa réforme en direct à la télévision. Ce recul fut une victoire historique de la société civile sur le pouvoir personnel. Le 23 juin est désormais célébré comme la "journée de la démocratie sénégalaise". Il démontra que le peuple sénégalais reste le gardien ultime des valeurs démocratiques que le pays a bâties depuis l'indépendance.`,
    tags: ['Démocratie', 'Société civile', 'Résistance populaire'],
    period: '23 juin 2011'
  },
  {
    id: 39, category: 'evenement',
    title: 'La Dévaluation du Franc CFA (1994)',
    subtitle: 'Le choc économique qui transforma la société',
    image: '💰',
    description: `Le 11 janvier 1994, le franc CFA fut dévalué de 50% sur décision concertée de la France et des institutions de Bretton Woods (FMI, Banque Mondiale). Du jour au lendemain, les prix de tous les produits importés doublèrent. Ce fut un choc économique brutal pour des millions de Sénégalais.

La dévaluation fut présentée comme un remède à la compétitivité perdue des économies africaines de la zone franc. Pour les populations, elle signifiait que le prix du riz, du sucre, de l'huile, des médicaments, des vêtements — tout doubla en une nuit. Les ménages les plus modestes furent les plus durement touchés.

L'événement relança le débat sur la souveraineté monétaire africaine et le rôle du franc CFA — héritage colonial que beaucoup considèrent comme un instrument de domination économique de la France sur ses anciennes colonies. Ce débat reste vivace aujourd'hui, avec des voix de plus en plus nombreuses qui réclament la fin du franc CFA et la création de monnaies africaines souveraines.`,
    tags: ['Économie', 'Franc CFA', 'Souveraineté'],
    period: '11 janvier 1994'
  },
  {
    id: 40, category: 'evenement',
    title: 'Le Naufrage du Joola (2002)',
    subtitle: 'La plus grande tragédie maritime sénégalaise',
    image: '⚓',
    description: `Le 26 septembre 2002, le ferry "Le Joola" — navire de liaison entre Dakar et Ziguinchor en Casamance — chavira au large des côtes gambiennes. Ce naufrage, l'un des plus meurtriers de l'histoire maritime mondiale, fit officiellement 1 863 morts — un chiffre probablement sous-estimé car le navire transportait bien plus de passagers que sa capacité autorisée de 580 personnes.

Seules 64 personnes survécurent. Les secours mirent plusieurs heures à arriver. Des familles entières périrent, des villages de Casamance perdirent la quasi-totalité de leurs jeunes. Le Joola avait quitté Ziguinchor surchargé, dans la nuit du 26 septembre, alors que les conditions météorologiques se dégradaient.

Le drame révéla des défaillances graves dans la gestion des transports maritimes, la corruption dans l'attribution des billets, et l'absence de réglementation effective. Aucun responsable ne fut sérieusement poursuivi — ce qui alimenta une colère durable dans la population casamançaise. La tragédie du Joola reste une plaie ouverte dans la conscience nationale sénégalaise.`,
    tags: ['Tragédie', 'Casamance', 'Mémoire'],
    period: '26 septembre 2002'
  },

  // ══════════════════════════════════════════════
  // CULTURE SUPPLÉMENTAIRE
  // ══════════════════════════════════════════════
  {
    id: 41, category: 'culture',
    title: 'Le Mbalax',
    subtitle: 'Rythme national, identité sonore du Sénégal',
    image: '🥁',
    description: `Le mbalax est la musique populaire nationale du Sénégal, née dans les années 1970 de la fusion explosive entre les percussions traditionnelles wolof (sabar, tama, bougarabou) et la guitare électrique, la basse et les cuivres de la musique cubaine et américaine. Le terme "mbalax" désigne à la fois un rythme de sabar et toute la musique populaire sénégalaise moderne.

Youssou Ndour et son Super Étoile de Dakar sont les principaux artisans de l'internationalisation du mbalax dans les années 1980-90. Mais d'autres artistes majeurs ont contribué à sa richesse : Baaba Maal (blues du Fleuve), Ismaël Lô (folk mbalax), Wally Seck, Viviane Ndour...

Ce qui rend le mbalax unique est son rapport particulier au rythme : les percussionnistes (sabarlats) dialoguent avec les danseurs et les chanteurs dans une improvisation codifiée. Les danses du sabar — spectaculaires et acrobatiques, dominées par les femmes — sont indissociables de la musique. Le mbalax est joué à tous les événements de la vie sénégalaise : baptêmes, mariages, soirées, fêtes nationales.`,
    tags: ['Musique', 'Sabar', 'Culture populaire'],
    period: 'Né dans les années 1970'
  },
  {
    id: 42, category: 'culture',
    title: 'Les Griots (Gewel)',
    subtitle: 'Gardiens de la mémoire, maîtres de la parole',
    image: '🎤',
    description: `Les griots — appelés gewel en wolof, jali en mandingue — sont l'une des institutions culturelles les plus importantes et les plus méconnues de l'Afrique de l'Ouest. Bien plus que des "musiciens ambulants", ils sont les gardiens vivants de l'histoire, les généalogistes des familles, les médiateurs sociaux et les maîtres de la parole (le "griot de parole").

Dans la société wolof traditionnelle, les griots constituent une caste héréditaire avec des fonctions précises : conserver et transmettre l'histoire orale des familles nobles et royales, célébrer les naissances et les mariages, assurer la médiation lors des conflits, accompagner les guerriers au combat avec leurs chants et leurs tambours. Leur mémoire est prodigieuse — certains peuvent réciter des généalogies remontant sur quinze générations.

Aujourd'hui, les griots ont évolué. Beaucoup sont des artistes de scène professionnels, des chanteurs pop, des animateurs de fêtes. Mais leur rôle social reste central : pas de grand événement au Sénégal sans un griot pour "chanter" les hôtes importants, rappeler leur lignage et créer l'atmosphère festive. La relation entre le griot et le "maître" qu'il célèbre reste une institution vivante.`,
    tags: ['Tradition orale', 'Société', 'Musique'],
    period: 'Tradition millénaire'
  },
  {
    id: 43, category: 'culture',
    title: 'Le Baobab',
    subtitle: 'Arbre sacré, symbole du Sénégal',
    image: '🌳',
    description: `Le baobab (Adansonia digitata) est bien plus qu'un arbre au Sénégal — c'est un symbole national, un être vivant sacré, un lieu de rassemblement social et une pharmacopée entière. Ses formes fantastiques — tronc gonflé stockant des milliers de litres d'eau, branches qui ressemblent à des racines renversées — lui ont valu la légende selon laquelle Dieu l'aurait planté à l'envers.

Pouvant vivre plus de 2 000 ans, le baobab est le témoin et la mémoire vivante des civilisations qui se sont succédé sur le territoire sénégalais. Ses fruits — les "pains de singe" — sont une source de vitamine C extraordinaire, cinq fois plus que l'orange. Ses feuilles se cuisinent en sauce (lalo), son écorce sert à fabriquer des cordes et des tissus, son tronc peut servir de citerne ou d'abri.

Socialement, le baobab est le lieu de l'arbre à palabres : c'est sous son ombre que les anciens se réunissent pour résoudre les conflits, que les jeunes se retrouvent, que les histoires sont racontées. Dans la tradition wolof, certains baobabs sont habités par des génies (rab) et leurs troncs servent de sépulture aux griots, dont les corps ne peuvent être enterrés dans la terre.`,
    tags: ['Nature', 'Symbolisme', 'Pharmacopée'],
    period: 'Depuis des millénaires'
  },
  {
    id: 44, category: 'culture',
    title: 'Le Sabar et la Danse',
    subtitle: 'Percussions sacrées, corps libéré',
    image: '🪘',
    description: `Le sabar est l'ensemble de percussions le plus important de la culture wolof. Composé de plusieurs tambours de différentes tailles (faranfana, nder, mbung-mbung, talmbat, gorong...), il constitue un véritable orchestre rythmique dont les patterns complexes ont mis des années à être décryptés par les ethnomusicologues occidentaux.

Les cérémonies de sabar — appelées sabars tout court — sont des moments de fête, de séduction et de compétition sociale. Les femmes y sont les reines absolues : elles se lèvent tour à tour pour danser au centre du cercle, montrant leur virtuosité dans des mouvements de hanches, de fesses et de jambes d'une précision acrobatique. Le meilleur danseur ou danseuse reçoit des billets collés sur le front.

Le sabar a une dimension sociale profonde : il est joué lors des baptêmes (ngente), des mariages, des cérémonies de circoncision, mais aussi lors de simples soirées de quartier. En ville, les sabars de nuit sont des événements festifs très attendus. Les sabarlats (joueurs de sabar) sont des artistes respectés dont l'apprentissage prend des années — le sabar est leur gagne-pain et leur art.`,
    tags: ['Musique', 'Danse', 'Tradition wolof'],
    period: 'Tradition séculaire'
  },
  {
    id: 45, category: 'culture',
    title: 'L\'Ataya — Le Thé à la Menthe',
    subtitle: 'Rituel social, philosophie de la lenteur',
    image: '🍵',
    description: `L'ataya — thé à la menthe préparé à la sénégalaise — est bien plus qu'une boisson : c'est un rituel social, un art de vivre, une philosophie. Sa préparation, qui prend de 30 minutes à plus d'une heure pour trois services successifs, est en elle-même une invitation à ralentir, à s'asseoir, à parler, à être ensemble.

La préparation de l'ataya suit un protocole précis : le thé vert (souvent Gunpowder) est infusé longuement sur un petit fourneau à charbon de bois. Le premier service (premier verre) est fort et amer — comme la vie, dit-on. Le deuxième est sucré et fort à la fois — comme l'amour. Le troisième, très sucré avec beaucoup de menthe, est doux et parfumé — comme la mort qu'on souhaite douce.

Préparer l'ataya est un geste de bienvenue et d'amitié. Refuser une tasse d'ataya peut être perçu comme une impolitesse. Dans les concessions, les boutiques, les rues, les bureaux — partout au Sénégal, l'ataya est la colle sociale qui maintient les liens humains. La mondialisation n'a pas entamé ce rituel qui reste au cœur de la sociabilité sénégalaise.`,
    tags: ['Gastronomie', 'Rituel social', 'Teranga'],
    period: 'Tradition centenaire'
  },
  {
    id: 46, category: 'culture',
    title: 'Le Basketball Sénégalais',
    subtitle: 'Nation de basket, ambassadeurs mondiaux',
    image: '🏀',
    description: `Le Sénégal est l'une des grandes nations du basketball africain et mondial. La Fédération Sénégalaise de Basketball (FSBB) a produit des générations de joueurs et joueuses qui ont rayonné sur les scènes internationale et NBA américaine. Mais c'est surtout les femmes qui ont écrit les plus belles pages de cette histoire.

Les Lionnes du Sénégal sont championnes d'Afrique en titre à plusieurs reprises — leur domination du basketball féminin africain est sans équivalent. Astou Ndour (Chicago Sky, WNBA), Maimouna Diarra et leurs coéquipières ont représenté le Sénégal aux Jeux Olympiques, plaçant le pays dans l'élite mondiale.

Chez les hommes, le Sénégal a produit des talents remarquables dont Gorgui Dieng (NBA, Minnesota Timberwolves) et Maurice Ndour. La culture du basketball est profondément ancrée dans les quartiers de Dakar où les terrains de basket de quartier voient fleurir les futurs champions. Le basketball est devenu au Sénégal un vecteur d'ascension sociale pour la jeunesse des banlieues.`,
    tags: ['Sport', 'NBA', 'Lionnes'],
    period: 'Depuis les années 1960'
  },
  {
    id: 47, category: 'culture',
    title: 'La Korité et la Tabaski',
    subtitle: 'Fêtes islamiques, célébrations nationales',
    image: '🌙',
    description: `La Korité (Aid el-Fitr, fin du Ramadan) et la Tabaski (Aid el-Adha, fête du sacrifice) sont les deux grandes fêtes islamiques du Sénégal. Dans ce pays à 95% musulman, ces célébrations transcendent le religieux pour devenir de véritables fêtes nationales qui concernent tous les Sénégalais, croyants ou non.

La Tabaski est la fête la plus importante. Chaque famille qui en a les moyens sacrifie un mouton — acte qui commémore le sacrifice d'Abraham. Dans les semaines précédant la Tabaski, les marchés à moutons envahissent les quartiers, les prix s'envolent, et chaque chef de famille fait tout pour acheter le plus beau bélier. Le mouton de la Tabaski est une affaire de dignité familiale.

Le matin de la fête, après la grande prière collective, les familles se réunissent pour le sacrifice rituel, puis le repas commence — viande grillée, brochettes, thiébou yapp (riz à la viande). L'après-midi est consacré aux visites : on rend visite aux parents, aux anciens, aux voisins, à tout le monde. Le Sénégal entier est en mouvement. Ces fêtes sont des moments de réconciliation, de pardon et de renforcement des liens sociaux.`,
    tags: ['Islam', 'Fêtes', 'Traditions familiales'],
    period: 'Traditions annuelles'
  },

  // ══════════════════════════════════════════════
  // DÉFIS SUPPLÉMENTAIRES
  // ══════════════════════════════════════════════
  {
    id: 48, category: 'defi',
    title: 'Le Conflit en Casamance',
    subtitle: 'Plus long conflit armé d\'Afrique de l\'Ouest',
    image: '🕊️',
    description: `Depuis décembre 1982, la Casamance — région méridionale du Sénégal séparée du reste du pays par la Gambie — est le théâtre d'un conflit armé entre l'État sénégalais et le Mouvement des Forces Démocratiques de Casamance (MFDC), qui réclame l'indépendance de la région.

Ce conflit, le plus long d'Afrique de l'Ouest, a causé plusieurs milliers de morts (chiffres difficiles à établir) et des centaines de milliers de déplacés internes. Les causes sont profondes : sentiment d'abandon et de marginalisation économique de la région, différences culturelles marquées entre les peuples diola et le reste du Sénégal, ressentiment historique lié à l'intégration forcée dans l'État colonial français.

Le conflit n'est pas une guerre totale — il prend plutôt la forme d'une guérilla intermittente avec des périodes de relative accalmie et des poussées de violence. Des mines antipersonnel parsèment encore certaines zones rurales. Plusieurs accords de paix ont été signés (1991, 2004, 2014) sans résolution définitive. La Casamance reste une plaie ouverte qui nécessite une solution politique respectant les identités locales.`,
    tags: ['Conflit', 'Casamance', 'Paix'],
    period: '1982–présent'
  },
  {
    id: 49, category: 'defi',
    title: 'Les Inondations de Dakar',
    subtitle: 'Urbanisation non maîtrisée, drame récurrent',
    image: '🌊',
    description: `Chaque saison des pluies (juillet-septembre), des quartiers entiers de la banlieue dakaroise sont submergés. Pikine, Guédiawaye, Keur Massar, Yeumbeul — des dizaines de milliers de familles voient leurs maisons inondées, leurs meubles détruits, leurs enfants malades. Ce phénomène récurrent est l'une des crises humanitaires urbaines les plus graves du Sénégal.

Les causes sont multiples et liées : une urbanisation explosive et non planifiée qui a recouvert les zones naturellement inondables (cuvettes, bas-fonds), un réseau d'assainissement inexistant ou insuffisant dans les banlieues, le réchauffement climatique qui intensifie les pluies, et une corruption qui a permis la construction illégale dans des zones interdites.

Des plans d'urgence successifs ont été lancés par l'État (Plan JAXAAY en 2005, Programme Décennal de Lutte contre les Inondations en 2012...) avec des résultats mitigés. Certains quartiers ont été améliorés, mais la pression démographique et l'étalement urbain continuent d'aggraver le problème. Les inondations de Dakar sont à la fois un défi technique, politique et de justice sociale.`,
    tags: ['Urbanisme', 'Climat', 'Banlieues'],
    period: 'Phénomène récurrent'
  },
  {
    id: 50, category: 'defi',
    title: 'La Pêche Artisanale en Crise',
    subtitle: 'Pillage des océans, menace pour un million de Sénégalais',
    image: '🐟',
    description: `La pêche artisanale est l'un des piliers de l'économie et de la culture sénégalaise. Plus d'un million de personnes en dépendent directement — pêcheurs, transformatrices de poisson, mareyeurs, vendeurs. Le Sénégal est l'un des pays africains dont la consommation de poisson par habitant est la plus élevée au monde — le poisson est la principale source de protéines de la population.

Mais ce secteur vital est en crise profonde. Les ressources halieutiques s'effondrent à une vitesse alarmante. La cause principale : la surpêche par des flottes industrielles étrangères — chinoises, européennes, russes — qui opèrent dans les eaux sénégalaises grâce à des accords de pêche controversés. Ces énormes chalutiers ratissent les fonds marins en quelques heures ce qu'il faudrait des semaines aux pirogues artisanales pour capturer.

Les pêcheurs sénégalais voient leurs prises diminuer d'année en année, contraints d'aller de plus en plus loin en mer au péril de leur vie. La surpêche est aussi l'un des facteurs qui poussent les jeunes vers la migration clandestine. La lutte pour la souveraineté maritime sénégalaise sur ses propres ressources est devenue une cause nationale et un enjeu de justice globale.`,
    tags: ['Pêche', 'Économie', 'Souveraineté'],
    period: 'Crise contemporaine'
  },
  {
    id: 51, category: 'defi',
    title: 'L\'Accès à l\'Éducation',
    subtitle: 'Entre ambition nationale et réalités du terrain',
    image: '📖',
    description: `L'éducation est constitutionnellement gratuite et obligatoire au Sénégal jusqu'à 16 ans. Dans les faits, le système éducatif sénégalais est à la croisée des chemins entre progrès réels et défis énormes. Le taux de scolarisation primaire a considérablement progressé (plus de 90%), mais le taux d'achèvement du primaire et les performances restent préoccupants.

Le système éducatif est dual : d'un côté, l'école française héritée de la colonisation, enseignement en français d'une langue que la plupart des enfants ne parlent pas à la maison. De l'autre, le système des daaras (écoles coraniques) qui scolarise des centaines de milliers d'enfants dans l'enseignement islamique. Ces deux systèmes coexistent sans vraiment se parler.

La question des langues nationales dans l'enseignement est centrale. Pourquoi enseigner aux enfants sénégalais à lire et écrire en français avant leur propre langue ? Le débat sur la wolofisation ou l'enseignement en langues nationales est vif depuis l'indépendance. Des expériences pilotes en wolof, pulaar, sérère et mandingue ont montré de meilleurs résultats d'apprentissage, mais le changement systémique reste difficile politiquement.`,
    tags: ['Éducation', 'Langues', 'Développement'],
    period: 'Défi permanent'
  },
  {
    id: 52, category: 'evenement',
    title: 'La Bataille de Guilé (1865)',
    subtitle: 'Lat Dior résiste, le Cayor tient',
    image: '⚔️',
    description: `La bataille de Guilé, livrée en 1865, est l'un des moments les plus dramatiques de la résistance sénégalaise à la colonisation française. Lat Dior, Damel du Cayor, affronta les troupes françaises commandées par le gouverneur Faidherbe dans cette bataille qui démontra la détermination du peuple cayor à défendre sa liberté.

Guilé s'inscrit dans un contexte de longue résistance : les Français voulaient construire la ligne de chemin de fer Dakar-Saint-Louis à travers le Cayor, symbole de leur emprise territoriale. Lat Dior voyait dans ce projet une menace directe à la souveraineté de son royaume et une facilitation de la pénétration militaire française.

Cette bataille fut l'une des nombreuses que Lat Dior mena sur deux décennies. Elle symbolise la résistance acharnée et les tactiques de guérilla utilisées par les résistants sénégalais face à une armée coloniale techniquement supérieure. Même défait militairement, Lat Dior refusa de capituler — illustrant l'esprit de Jom (dignité, honneur) qui est au cœur des valeurs wolof.`,
    tags: ['Résistance', 'Cayor', 'Colonisation'],
    period: '1865'
  },
  {
    id: 53, category: 'personnalite',
    title: 'Sadio Mané',
    subtitle: 'Meilleur joueur africain, Lion de la Teranga (1992–)',
    image: '⚽',
    description: `Sadio Mané est l'enfant prodige de Bambali (Sédhiou, Casamance) devenu l'un des meilleurs footballeurs du monde. Son parcours — du petit village de brousse casamançais aux plus grands stades européens — est un conte moderne qui inspire des millions de jeunes Africains.

Formé à l'Académie Générations Foot de Thiès, puis au Metz, puis à Southampton et Liverpool, Mané est devenu à Anfield l'un des joueurs les plus explosifs et efficaces de sa génération. Champion d'Angleterre, champion d'Europe et champion du monde des clubs avec Liverpool, il fut élu Ballon d'Or africain en 2019 et 2022.

Mais ce qui rend Mané exceptionnel ne se limite pas au terrain. Il est connu pour sa générosité : il a financé la construction d'un hôpital, d'une école et d'une mosquée dans son village natal de Bambali. Il reverse une grande partie de son salaire à sa communauté. En 2022, il souleva la Coupe d'Afrique des Nations avec le Sénégal — accomplissant le rêve de toute une génération. Sa sobriété, son humilité et sa foi (il est musulman pratiquant fervent) font de lui un modèle au-delà du sport.`,
    tags: ['Football', 'Casamance', 'Inspiration'],
    period: '1992–présent'
  },
  {
    id: 54, category: 'culture',
    title: 'Le Wolof — Langue du Peuple',
    subtitle: 'Lingua franca, identité nationale',
    image: '🗣️',
    description: `Le wolof est la langue la plus parlée au Sénégal, utilisée comme lingua franca par environ 90% de la population, même si seulement 40% en sont locuteurs natifs. Cette expansion remarquable s'explique par le rôle historique des Wolofs dans le commerce, la politique et la culture, et par l'urbanisation qui a fait de Dakar une ville majoritairement wolofophone.

Le wolof est une langue agglutinante au système de classes nominales complexe, aux tons mélodiques et à la richesse lexicale remarquable. Elle possède des concepts philosophiques et sociaux intraduisibles en français : la teranga (hospitalité), le jom (honneur-dignité), le kersa (pudeur-respect), le sutura (discrétion), le yaru (l'éducation au sens large)...

Paradoxalement, malgré son statut de langue nationale au Sénégal, le wolof n'est pas langue d'enseignement officielle — c'est le français, langue d'une minorité de Sénégalais, qui reste langue officielle de l'État, de la justice et de l'éducation. Le débat sur le statut des langues nationales est l'un des sujets les plus importants et les moins résolus de la société sénégalaise depuis l'indépendance.`,
    tags: ['Langue', 'Identité', 'Culture wolof'],
    period: 'Langue vivante'
  },
  {
    id: 55, category: 'lieu',
    title: 'Le Monument de la Renaissance Africaine',
    subtitle: 'Statue géante, symbole et controverse',
    image: '🗽',
    description: `Le Monument de la Renaissance Africaine est une statue de bronze de 52 mètres de hauteur inaugurée en 2010 à Dakar par le président Abdoulaye Wade. Dominant la presqu'île depuis les Mamelles — deux collines volcaniques à l'entrée de Dakar —, elle est visible à plusieurs kilomètres en mer et a immédiatement suscité une immense controverse.

La statue représente un homme africain tenant une femme et un enfant, regardant vers l'Atlantique. Wade la décrivait comme le symbole de la renaissance de l'Afrique, de sa sortie de siècles de colonisation et d'esclavage. Construite par des entreprises nord-coréennes (Mansudae Overseas Projects), elle coûta 27 milliards de francs CFA.

Les controverses furent nombreuses : le coût exorbitant dans un pays pauvre, le recours à des ouvriers nord-coréens plutôt que sénégalais, la représentation d'une femme aux épaules dénudées jugée choquante par les milieux islamiques conservateurs, et la décision de Wade de s'attribuer 35% des droits d'auteur sur le monument. Pour certains, elle symbolise l'hubris de Wade ; pour d'autres, elle est un monument africain légitime dont il faut s'approprier le sens.`,
    tags: ['Dakar', 'Art', 'Controverse politique'],
    period: 'Inaugurée 2010'
  }
]

const defaultData = {
  hero: {
    badge: '🌍 Xam Sa Boppam, Xam Sa Reewam',
    title: 'XAM SA',
    titleHighlight: 'DEUKK',
    subtitle: 'Découvrez la richesse culturelle du Sénégal à travers des jeux interactifs, une encyclopédie vivante et un voyage au cœur de notre héritage.',
    ctaMain: 'Explorer la Culture',
    ctaSecond: 'Jouer Maintenant',
    stats: [
      { value: '14+', label: 'Régions', icon: '🗺️' },
      { value: '50+', label: 'Ethnies', icon: '👥' },
      { value: '3000+', label: 'Ans d\'Histoire', icon: '📜' },
      { value: '16M+', label: 'Sénégalais', icon: '🌟' }
    ]
  },
  announcement: {
    visible: true,
    text: '🦁 Nouveau ! Apprenez à parler Wolof avec notre tuteur IA interactif',
    link: '/apprendre-wolof',
    linkText: 'Commencer gratuitement →'
  },
  games: [
    { id: 1, icon: '🧩', title: 'Puzzle Culturel', desc: 'Reconstituez les photos du patrimoine sénégalais ajoutées par l\'admin', color: '#C8552A', link: '/jeux/puzzle', badge: 'Populaire', difficulty: '⭐⭐' },
    { id: 2, icon: '🃏', title: 'Mémoire Wolof', desc: 'Associez les mots français et wolof en paires', color: '#0D7A3E', link: '/jeux/memoire-wolof', badge: 'Éducatif', difficulty: '⭐⭐⭐' },
    { id: 3, icon: '🗺️', title: 'Géographie', desc: 'Localisez les villes et sites historiques', color: '#E8A830', link: '/jeux/carte', badge: 'Géo', difficulty: '⭐⭐' },
    { id: 4, icon: '👨‍🍳', title: 'Chef Sénégalais', desc: 'Préparez les plats traditionnels sénégalais', color: '#B22222', link: '/jeux/cuisine', badge: 'Cuisine', difficulty: '⭐' },
    { id: 5, icon: '🏛️', title: 'Culture Memory', desc: 'Retrouvez les paires de photos culturelles', color: '#5C2D0A', link: '/jeux/memoire-culture', badge: 'Culture', difficulty: '⭐⭐' },
    { id: 6, icon: '📚', title: 'Encyclopédie', desc: 'Personnalités, lieux, événements et culture du Sénégal', color: '#6B3FA0', link: '/encyclopedie', badge: 'Savoir', difficulty: '📖' },
    { id: 7, icon: '🧠', title: 'Quiz Culture', desc: 'Testez vos connaissances avec l\'IA', color: '#1A6B8A', link: '/jeux/quiz', badge: 'IA', difficulty: '⭐⭐⭐' }
  ],
  wolofBanner: {
    visible: true,
    title: 'Parlez Wolof',
    subtitle: 'Maîtrisez la langue nationale avec notre tuteur IA. Leçons interactives, exercices et conversations.',
    badge: 'IA',
    cta: 'Démarrer les leçons'
  },
  testimonials: [
    { id: 1, name: 'Aminata Diallo', role: 'Enseignante, Dakar', text: 'XamSaDeukk a transformé ma façon d\'enseigner la culture sénégalaise. Mes élèves adorent les jeux interactifs !', avatar: '👩🏾‍🏫', stars: 5 },
    { id: 2, name: 'Moussa Ndiaye', role: 'Étudiant, Saint-Louis', text: 'J\'ai appris plus sur notre histoire en jouant qu\'en lisant des livres. Le quiz IA est incroyable.', avatar: '👨🏾‍🎓', stars: 5 },
    { id: 3, name: 'Fatou Sow', role: 'Diaspora, Paris', text: 'Vivant en France, cette plateforme me reconnecte à mes racines. Le tuteur Wolof est exceptionnel.', avatar: '👩🏾', stars: 5 }
  ],
  siteStats: [
    { value: '12,450', label: 'Joueurs actifs', icon: '🎮' },
    { value: '98,320', label: 'Parties jouées', icon: '🏆' },
    { value: '4.9/5', label: 'Note moyenne', icon: '⭐' },
    { value: '150+', label: 'Pays représentés', icon: '🌍' }
  ],
  themeColors: {
    terra: '#C8552A', gold: '#E8A830', green: '#0D7A3E', red: '#B22222', cream: '#FDF6EC', brown: '#5C2D0A'
  },
  siteSettings: {
    siteName: 'XamSaDeukk',
    tagline: 'Xam Sa Boppam, Xam Sa Reewam',
    footerText: '© 2025 XamSaDeukk. Fait avec ❤️ pour la culture sénégalaise.'
  },
  // Puzzles — chaque puzzle est une photo uploadée par l'admin
  // { id, title, description, image (base64 dataURL), gridOptions: [3,4,5] }
  puzzles: [],
  // Encyclopédie — entrées culturelles
  encyclopedie: defaultEncyclopedie
}

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('xamSaDeukk_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge avec defaultData pour avoir les nouvelles clés
        return {
          ...defaultData,
          ...parsed,
          encyclopedie: parsed.encyclopedie || defaultData.encyclopedie,
          puzzles: parsed.puzzles || []
        }
      }
      return defaultData
    } catch { return defaultData }
  })
  const [adminAuth, setAdminAuth] = useState(() => sessionStorage.getItem('xsd_admin') === 'true')
  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('xamSaDeukk_log') || '[]') } catch { return [] }
  })

  const update = (section, value) => {
    setData(prev => {
      const next = { ...prev, [section]: value }
      localStorage.setItem('xamSaDeukk_data', JSON.stringify(next))
      return next
    })
    addLog(`Section "${section}" mise à jour`)
  }

  const addLog = (msg) => {
    setActivityLog(prev => {
      const next = [{ msg, time: new Date().toISOString(), id: Date.now() }, ...prev].slice(0, 50)
      localStorage.setItem('xamSaDeukk_log', JSON.stringify(next))
      return next
    })
  }

  const login = (pwd) => {
    if (pwd === 'admin2050') {
      sessionStorage.setItem('xsd_admin', 'true')
      setAdminAuth(true)
      addLog('Connexion admin')
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('xsd_admin')
    setAdminAuth(false)
  }

  const reset = () => {
    setData(defaultData)
    localStorage.setItem('xamSaDeukk_data', JSON.stringify(defaultData))
    addLog('Données réinitialisées')
  }

  return (
    <SiteContext.Provider value={{ data, update, adminAuth, login, logout, activityLog, addLog, reset }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
