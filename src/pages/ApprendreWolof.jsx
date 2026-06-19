import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { callAI } from '../utils/ai'

// ─── Prononciation ───────────────────────────────────────────────────────────
const PRONUNCIATION = [
  { letter: 'b (fin de mot)', rule: 'Prononcé bouche fermée', ex: 'sob (curieux)' },
  { letter: 'c', rule: 'Prononcé "ti" (tiède)', ex: 'céeb [riz] = [tièb]' },
  { letter: 'e', rule: 'Prononcé é (fère)', ex: 'ben (1) = [béen]' },
  { letter: 'ë', rule: 'Prononcé è (œ)', ex: 'kër (maison) = [keur]' },
  { letter: 'g', rule: 'Toujours "gue" (guenille)', ex: 'gëlëëm (chameau) = [gueléèm]' },
  { letter: 'j', rule: 'Prononcé "di" (dionysos)', ex: 'jaar (passer) = [diaar]' },
  { letter: 'ñ', rule: 'Prononcé "gn" (vigne)', ex: 'ñaar (2) = [gnaar]' },
  { letter: 'ŋ', rule: 'Nasalise la voyelle précédente : eŋ [ɛ̃], aŋ [ɑ̃], oŋ [õ]', ex: 'basseŋ = [bassang]' },
  { letter: 'q', rule: 'Du fond de la gorge', ex: 'daqar (tamarin)' },
  { letter: 'r', rule: 'Roulé', ex: '' },
  { letter: 'w', rule: 'Prononcé "ou"', ex: 'won (montrer) = [ouone]' },
  { letter: 'x', rule: 'Comme le "j" espagnol', ex: 'xaar (attendre) = [khaar]' },
]

// ─── Unités de grammaire ─────────────────────────────────────────────────────
const GRAMMAR_UNITS = [
  {
    id: 1,
    title: 'Pronoms personnels & Présent démonstratif',
    icon: '👤',
    desc: 'Les pronoms sujets et la conjugaison du présent',
    sections: [
      {
        title: 'Pronoms personnels sujets (formes isolées)',
        type: 'table',
        headers: ['Français', 'Wolof'],
        rows: [
          ['moi', 'man'], ['toi', 'yow'], ['il / elle', 'moom'],
          ['nous', 'ñun'], ['vous', 'yéen'], ['ils / elles', 'ñoom'],
        ]
      },
      {
        title: 'Présent démonstratif — contractions',
        type: 'info',
        content: `Construction : pronom + a + ngi/ngë + verbe + complément\nLes formes se contractent pour faciliter la prononciation.`
      },
      {
        title: 'Formes contractées',
        type: 'table',
        headers: ['Forme théorique', 'Forme contractée'],
        rows: [
          ['man a ngi', 'mangi'], ['yow a ngi', 'yangi'], ['moom a ngi', 'mungi'],
          ['ñun a ngi', 'ñungi'], ['yéen a ngi', 'yéénagi'], ['ñoom a ngi', 'ñungi'],
        ]
      },
      {
        title: 'Présent progressif (action en cours)',
        type: 'info',
        content: `Ajouter "di" après la forme contractée :\nmangi + di → mangiy | yangi + di → yangiy\nExemple : Mangi fi lekk = je suis ici en train de manger`
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Mangi fi', fr: 'Me voici ici / Je suis ici' },
          { wo: 'Yéénangiy toog', fr: 'Vous voici assis / Vous êtes assis' },
          { wo: 'Ñungé nellaw', fr: 'Les voilà qui dorment' },
          { wo: 'Mungë fë', fr: 'Le voilà là-bas / Il est là-bas' },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Pronoms objets & Présent progressif',
    icon: '🔄',
    desc: 'Les pronoms compléments et leur usage',
    sections: [
      {
        title: 'Pronoms personnels objets',
        type: 'table',
        headers: ['Français', 'Wolof'],
        rows: [
          ['me', 'më'], ['te', 'lë'], ['le / la', 'ko'],
          ['nous', 'ñu'], ['vous', 'léën'], ['les', 'léën'],
        ]
      },
      {
        title: 'Conjugaison du présent progressif',
        type: 'info',
        content: `Sujet + particule ngi/ngë + pronom objet + auxiliaire du progressif di + verbe\nLe "y" du progressif (abrév. de di) précède toujours le verbe.`
      },
      {
        title: 'Pronoms relatifs sujets (qui)',
        type: 'info',
        content: `Formé de la lettre attachée au substantif + terminaison "u".\nExemple : jiggéen (j) → jiggéen ju… = la fille qui…\n\n• Un adjectif : Jiggéen ju rafet = (une) jolie fille\n• Un verbe : Mangiy jënd cin lu yomb = je suis en train d'acheter une marmite bon marché`
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Yangi ko lëy wax', fr: 'Tu es en train de lui parler' },
          { wo: 'Joob añ koy def', fr: 'Diop est en train de le faire' },
          { wo: 'Maŋ lëy wax', fr: 'Je suis en train de te le dire' },
          { wo: 'ñun koy jang', fr: 'Nous sommes en train de le lire' },
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Le possessif & Le passé accompli',
    icon: '📌',
    desc: 'Exprimer la possession et les actions passées',
    sections: [
      {
        title: 'Pronoms possessifs',
        type: 'table',
        headers: ['Français', 'Singulier', 'Pluriel'],
        rows: [
          ['mon/ma', 'sumë', 'mes → sumey'],
          ['ton/ta', 'sa', 'tes → sey'],
          ['son/sa', '-am', 'ses → ay + substantif + -am'],
          ['notre', 'suñu', 'nos → suñuy'],
          ['votre/leur', 'séën', 'vos/leurs → séëni'],
        ]
      },
      {
        title: 'Passé accompli (action terminée)',
        type: 'table',
        headers: ['Personne', 'Terminaison'],
        rows: [
          ['je', '-naa'], ['tu', '-ngë'], ['il/elle', '-në'],
          ['nous', '-neñu'], ['vous', '-ngéën'], ['ils/elles', '-neñu'],
        ]
      },
      {
        title: 'Négation de l\'accompli',
        type: 'table',
        headers: ['Personne', 'Terminaison neg.'],
        rows: [
          ['je', '-uma'], ['tu', '-ulo'], ['il/elle', '-ul'],
          ['nous', '-uñu'], ['vous', '-uléën'], ['ils/elles', '-uñu'],
        ]
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Lekk-në', fr: 'Il/elle a mangé' },
          { wo: 'Dem-ngëën', fr: 'Vous êtes partis' },
          { wo: 'Degg-uma', fr: 'Je n\'ai pas compris' },
          { wo: 'Mangi jël sumë téeré', fr: 'Je prends mon livre' },
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Les interrogatifs, adverbes & Chiffres',
    icon: '❓',
    desc: 'Poser des questions et compter en wolof',
    sections: [
      {
        title: 'Pronoms interrogatifs — qui ?',
        type: 'info',
        content: `Formés à partir de la lettre du démonstratif + terminaison -an.\n• singulier : k + an → kan? (qui?)\n• pluriel : ñ + an → ñan? (qui?)\n• la chose : l + an → lan? (que/quoi?)\n\nExemples :\n• kan lë gis dëmbë? = qui as-tu vu hier?\n• lan lëñy def subë? = que ferons-nous demain?`
      },
      {
        title: 'Adverbes interrogatifs',
        type: 'info',
        content: `• Où : f → fan? (où allons-nous? = fan leñuy dem?)\n• Comment : n → nan? (comment vas-tu? = nan ngë fëy dem?)\n• Quand : kañ\n• Combien : ñaata`
      },
      {
        title: 'Les nombres',
        type: 'table',
        headers: ['Français', 'Wolof'],
        rows: [
          ['1', 'benn'], ['2', 'ñaar'], ['3', 'ñett'], ['4', 'ñent'],
          ['5', 'juroom'], ['6', 'juroom benn'], ['7', 'juroom ñaar'],
          ['8', 'juroom ñett'], ['9', 'juroom ñent'], ['10', 'fukk'],
          ['11', 'fukk ak benn'], ['12', 'fukk ak ñaar'], ['16', 'fukk ak juroom benn'],
          ['20', 'ñaar fukk'], ['30', 'ñett fukk'], ['50', 'juroom fukk'],
          ['100', 'teemeer'], ['1000', 'junni'], ['31', 'fanweer (jours du mois)'],
        ]
      },
      {
        title: 'Valeurs CFA',
        type: 'info',
        content: `10 F CFA = ñaari dërëm\n25 F CFA = juroom dërëm\n50 F CFA = fuki dërëm\n100 F CFA = ñaar téémeri dërëm\n500 F CFA = juroom téémeri dërëm\n1000 F CFA = ñaar téémeri dërëm\n5000 F CFA = junni dërëm`
      }
    ]
  },
  {
    id: 5,
    title: 'Pronom sujet dépendant & Relatives',
    icon: '🔗',
    desc: 'Les propositions subordonnées relatives',
    sections: [
      {
        title: 'Pronoms sujets dépendants',
        type: 'table',
        headers: ['Français', 'Pronom dépendant'],
        rows: [
          ['je', 'ma'], ['tu', 'ngë'], ['il/elle', 'mu'],
          ['nous', 'nu / ñu'], ['vous', 'ngéën'], ['ils/elles', 'ñu'],
        ]
      },
      {
        title: 'Usage',
        type: 'info',
        content: `Le pronom sujet dépendant s'emploie dans les propositions subordonnées (ex: j'ai vu qu'elle est partie → je veux qu'elle aille voir sa mère).\n\nNégation : ajouter -ul au verbe.\nExemple :\n• Wàaxnaa ko mu indi léen bissap ñu naan = je lui ai dit d'apporter du bissap à boire\n• Bëggnaa mu séeti yaayam = je veux qu'elle aille voir sa mère`
      },
      {
        title: 'Adverbes relatifs (où, comment)',
        type: 'info',
        content: `Formés à partir de la même lettre que l'adverbe interrogatif + terminaison -u :\n• fu (où) : xàmngë fu ñuy dem = tu sais où ils vont\n• nu (comment) : xàmnaa nan lëñu dem = je sais comment ils sont venus\n• kañ (quand)`
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Gisulo fu të nekk', fr: 'Tu n\'as pas vu où se trouve là-bas' },
          { wo: 'Wàaxnë mu ko gungë Ndar', fr: 'Il m\'a dit qu\'il t\'accompagnera à Saint-Louis' },
          { wo: 'Gisnaa li Joob di defar ci garaasam', fr: 'J\'ai vu ce que Diop est en train de fabriquer dans son garage' },
          { wo: 'Fóonnaa li më soga waax', fr: 'J\'ai oublié ce qu\'elle est en train de cuisiner' },
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Article indéfini, Impératif & Futur',
    icon: '⏭️',
    desc: 'Donner des ordres et parler du futur',
    sections: [
      {
        title: 'Article indéfini',
        type: 'info',
        content: `Formé en préfixant la consonne du démonstratif + la lettre "a-" :\n• siis b- → ab siis = une chaise\n• fas w- → aw fas = un cheval\n• cin l- → al cin = une marmite\n• gaal g- → ag gaal = une pirogue\n• saxar s- → as saxar = une fumée\nAu pluriel (consonne invariable y-) : jigéen y- → ay jigéen = des femmes`
      },
      {
        title: 'Impératif perfectif (ordre ponctuel)',
        type: 'table',
        headers: ['Personne', 'Forme'],
        rows: [
          ['2e pers. singulier', 'verbe + (a)l'],
          ['2e pers. pluriel', 'verbe + kéën'],
        ]
      },
      {
        title: 'Impératif progressif (action continue)',
        type: 'table',
        headers: ['Personne', 'Forme'],
        rows: [
          ['2e pers. singulier', 'di + l → dil'],
          ['2e pers. pluriel', 'di + kéën → diléën'],
        ]
      },
      {
        title: 'Le futur',
        type: 'table',
        headers: ['Personne', 'Futur affirmatif', 'Futur négatif'],
        rows: [
          ['je', 'di naa', 'duma'],
          ['tu', 'di ngë', 'do'],
          ['il/elle', 'di në', 'du'],
          ['nous', 'di néñu', 'duñu'],
          ['vous', 'di ngéën', 'dungéën'],
          ['ils/elles', 'di néñu', 'duñu'],
        ]
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Jël al!', fr: 'Prends !' },
          { wo: 'Demlééën!', fr: 'Partez !' },
          { wo: 'bul nellaw', fr: 'Ne dors pas !' },
          { wo: 'Duma dem ja subë', fr: 'Je n\'irai pas au marché demain' },
          { wo: 'Di naa jang téeré bi subë', fr: 'Je lirai ce livre demain' },
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Mode emphatique & Pronoms indéfinis',
    icon: '💪',
    desc: 'Mettre l\'accent sur le sujet ou l\'objet',
    sections: [
      {
        title: 'Mode emphatique sujet',
        type: 'table',
        headers: ['Français', 'Emphatique'],
        rows: [
          ['moi', 'maa'], ['toi', 'yaa'], ['il/elle', 'mo'],
          ['nous', 'ñu'], ['vous', 'yééna'], ['ils/elles', 'ño'],
        ]
      },
      {
        title: 'Contractions avec démonstratif',
        type: 'table',
        headers: ['Combinaison', 'Résultat'],
        rows: [
          ['bi + a', 'ba'], ['bë + a', 'baa'], ['boobu + a', 'boobuu'],
          ['bëlë + a', 'bëlëë'], ['yow + a', 'yaa'], ['moom + a', 'moo'],
        ]
      },
      {
        title: 'Pronoms indéfinis',
        type: 'info',
        content: `Formés à partir de la lettre indiquant la notion + suffixe -épp :\n• f- = lieu → fépp = partout\n• k- = personne (sg.) → képp = chaque personne\n• ñ- = personnes (plur.) → ñépp = tous\n• l- = animal, chose → lépp = tout, chaque chose\n\nExemples :\n• Képp warnë am kër = chacun doit avoir un logis\n• lépp warnë jeex = tout doit finir`
      },
      {
        title: 'Exemples emphatiques',
        type: 'examples',
        items: [
          { wo: 'Joob a raxas oto bi', fr: 'C\'est Diop qui a lavé cette voiture' },
          { wo: 'Taksi baa jël Marie-Louise dëmbë', fr: 'C\'est ce taxi-là qui a pris Marie-Louise hier' },
          { wo: 'Yow laay tanq', fr: 'C\'est toi que j\'attends' },
          { wo: 'Maa ko jël', fr: 'C\'est moi qui l\'ai pris' },
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'L\'auxiliaire "être" & Les états',
    icon: '🔵',
    desc: 'Exprimer l\'état et l\'identité en wolof',
    sections: [
      {
        title: 'L\'auxiliaire être (mode causatif)',
        type: 'table',
        headers: ['Français', 'Wolof'],
        rows: [
          ['je suis', 'dama'], ['tu es', 'dangë'], ['il/elle est', 'dafa'],
          ['nous sommes', 'dañu'], ['vous êtes', 'dangéën'], ['ils/elles sont', 'dañu'],
        ]
      },
      {
        title: 'Exemples d\'états',
        type: 'examples',
        items: [
          { wo: 'Tu es jolie : dangë rafet', fr: 'dangë rafet' },
          { wo: 'Cette bouteille est finie', fr: 'buteel bi, dafa jeex' },
          { wo: 'Ton visage est rouge', fr: 'sa kanam, dafa xonq' },
          { wo: 'Vous êtes pressés', fr: 'dangéën yakkamti' },
        ]
      },
      {
        title: 'États d\'actions accomplies',
        type: 'info',
        content: `être + verbe d'état ou d'action\n• Il est parti : dafa dem\n• Il est parti en voyage : dafa tukki\n\nAction non accomplie (inaccompli) :\n• être + marque du présent progressif (di) + verbe\n\nJob, dafay liggey = Diop est en train de travailler\nNewkat-u Sënégal, dañuy liggey bu baax = les couturiers du Sénégal travaillent bien`
      },
      {
        title: 'Vocabulaire utile',
        type: 'table',
        headers: ['Wolof', 'Français'],
        rows: [
          ['rafet', 'joli/beau'], ['yomb', 'bon marché/facile'], ['seer', 'cher/difficile'],
          ['mag', 'grand/vieux'], ['ndaw', 'petit/jeune'], ['baax', 'bon/bien'],
          ['feebar', 'être malade'], ['tukki', 'voyager'], ['liggey', 'travailler'],
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'Les passés & Le fréquentatif',
    icon: '⏪',
    desc: 'Le passé lointain et les habitudes passées',
    sections: [
      {
        title: 'Passé lointain',
        type: 'info',
        content: `Tournure régulière : verbe + oon + pronom accompli\n\nExemple :\n• Liggéy-oon-naa foofu = j'avais travaillé là-bas (dans le temps)\n\nForme négative : négation de l'accompli + woon\n• Liggéyumë-oon Ndakaru = je n'ai pas travaillé à Dakar\n\nProposition inversée (complément en tête) :\n• Foofu laa liggéyoon = c'est là-bas que j'avais travaillé`
      },
      {
        title: 'Passé lointain — contractions',
        type: 'table',
        headers: ['Personne', 'Affirmation', 'Négation'],
        rows: [
          ['je', 'verb+oon-naa', 'verb+uma+ul+woon'],
          ['tu', 'verb+oon-ngë', 'verb+ulo+ul+woon'],
          ['il/elle', 'verb+oon-në', 'verb+ul+ul+woon'],
          ['nous', 'verb+oon-neñu', '—'],
          ['vous', 'verb+oon-ngéën', '—'],
        ]
      },
      {
        title: 'Fréquentatif imparfait (habitude passée)',
        type: 'info',
        content: `Tournure régulière : être + daan + verbe\n\n• Affirmatif : At yooyu, dama daan jaay piis = ces années-là, je vendais du tissu habituellement\n• Négatif : être + dulwaan + verbe : At yooyu, dama dulwaan jaay piis = ces années-là, je ne vendais pas de tissu\n\nForme causative alternative : être + verbe + oon`
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Liggéy-oon-naa foofu', fr: 'J\'avais travaillé là-bas' },
          { wo: 'Foofu laa liggéyoon', fr: 'C\'est là-bas que j\'avais travaillé' },
          { wo: 'Dama défaroon kéram', fr: 'Il construisait sa maison' },
          { wo: 'Demumë fë-oon', fr: 'Je n\'étais pas allé là-bas' },
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Conditionnel & Comparatif',
    icon: '⚖️',
    desc: 'Les conditions et les comparaisons',
    sections: [
      {
        title: 'Conditionnel futur (quand / si futur)',
        type: 'info',
        content: `Bu + pronom + (verbe + terminaison ë) + complément\nLes pronoms sont les mêmes que pour les propositions relatives dépendantes.\n\nExemples :\n• Bu ma demë, dinaa lë ko waax = quand je partirai, je te le dirai\n• Bu ngéën ëggë, waaxléën ñu ko = quand vous arriverez, dites-le nous`
      },
      {
        title: 'Conditionnel passé (quand passé)',
        type: 'info',
        content: `Bi + pronom + verbe + complément (le pronom est le même que pour le quand futur)\n\nExemples :\n• Bi ma jëkk ñow, fekknaa fli laobë = quand je suis venu pour la première fois, j'ai trouvé ici un menuisier\n• Bi ma doon jang ci lekkol bi, amoonnë jangalëkat bu soxoor = quand j'étudiais dans cette école, il y avait un professeur méchant`
      },
      {
        title: 'Conditionnel irréel (si…)',
        type: 'info',
        content: `Bu + pronom + verbe au plus-que-parfait + complément\n\nBumë amoon xaalis, dinaa lë ci may tuuti = si j'avais de l'argent, je t'en donnerais un peu`
      },
      {
        title: 'Le comparatif',
        type: 'table',
        headers: ['Type', 'Structure', 'Exemple'],
        rows: [
          ['Plus que', 'Nom + pronom + géné + adjectif/verbe + complément', 'Céeb bi mo géné neex céeb boobu = ce riz-ci est meilleur que celui là'],
          ['Autant que', 'Nom + adjectif/verbe + ni + complément', 'Astu rafetñi rakkam bu jiggéën = Astou est aussi jolie que sa petite sœur'],
          ['Moins que', 'Nom + adjectif négatif + ni + complément', 'Wolof-u Ndakaru jafëwul ni wolof-u Kajoor = le wolof de Dakar est moins difficile que le wolof du Cayor'],
        ]
      },
      {
        title: 'Exemples',
        type: 'examples',
        items: [
          { wo: 'Man maa géné yakkamti yow', fr: 'Je suis plus pressé que toi' },
          { wo: 'Suñuy jabar ño géné am xam-xam séény jabar', fr: 'Nos femmes ont plus de connaissances que les leurs' },
          { wo: 'Bu ma demë, dinaa lë ko waax', fr: 'Quand je partirai, je te le dirai' },
          { wo: 'Céeb bi mo géné neex céeb boobu', fr: 'Ce riz-ci est meilleur que celui-là' },
        ]
      }
    ]
  },
]

const VOCAB = [
  // Salutations & Expressions de base
  { fr: 'Bonjour / Bonsoir', wo: 'Salamalekum', cat: 'Salutations' },
  { fr: 'Et la paix sur vous', wo: 'Malekum salaam', cat: 'Salutations' },
  { fr: 'Comment allez-vous ?', wo: 'Nanga def ?', cat: 'Salutations' },
  { fr: 'Très bien, et vous ?', wo: 'Mangi fi rekk', cat: 'Salutations' },
  { fr: 'Au revoir', wo: 'Mangi dem', cat: 'Salutations' },
  { fr: 'Bienvenue', wo: 'Akksil ak diam', cat: 'Salutations' },
  { fr: 'Bonne journée !', wo: 'Yendu ak jàmm', cat: 'Salutations' },

  // Politesse
  { fr: 'Merci (beaucoup)', wo: 'Jërëjëf', cat: 'Politesse' },
  { fr: 'Pardon', wo: 'Baal ma', cat: 'Politesse' },
  { fr: 'Excusez-moi / S\'il vous plaît', wo: 'Baal / Su la neexee', cat: 'Politesse' },
  { fr: 'De rien / Je vous en prie', wo: 'Amul solo / Niokobok', cat: 'Politesse' },
  { fr: 'Oui', wo: 'Waaw', cat: 'Politesse' },
  { fr: 'Non', wo: 'Deedeet', cat: 'Politesse' },
  { fr: 'Non merci', wo: 'Deedeet jërëjëf', cat: 'Politesse' },

  // Présentation
  { fr: 'Je m\'appelle…', wo: 'Mangi tuddu…', cat: 'Présentation' },
  { fr: 'Je suis Français(e)', wo: 'Mangi dëkk France', cat: 'Présentation' },
  { fr: 'Parlez-vous français ?', wo: 'Degg nga ?', cat: 'Présentation' },
  { fr: 'Je comprends', wo: 'Degg na', cat: 'Présentation' },
  { fr: 'Je ne comprends pas', wo: 'Deggu ma', cat: 'Présentation' },

  // Commerce
  { fr: 'Combien ça coûte ?', wo: 'Bi niata la / Nata la jar ?', cat: 'Commerce' },
  { fr: 'C\'est un bon prix', wo: 'Yomb na', cat: 'Commerce' },
  { fr: 'C\'est trop cher !', wo: 'Bare na !', cat: 'Commerce' },
  { fr: 'Pouvez-vous baisser le prix ?', wo: 'Wàññil ma njëg li', cat: 'Commerce' },
  { fr: 'Je voudrais acheter ceci', wo: 'Lii la bëgg', cat: 'Commerce' },
  { fr: 'J\'adore', wo: 'Neexa ma lool', cat: 'Commerce' },
  { fr: 'Je déteste', wo: 'Bëggu ko', cat: 'Commerce' },
  { fr: 'Argent', wo: 'Xaalis', cat: 'Commerce' },
  { fr: 'Je ne fais que regarder', wo: 'Demay Xool rek', cat: 'Commerce' },
  { fr: 'L\'addition, s\'il vous plaît', wo: 'Ñaata la ?', cat: 'Commerce' },

  // Transports
  { fr: 'Je voudrais aller à…', wo: 'Dama bëgga dem…', cat: 'Transports' },
  { fr: 'Avion', wo: 'Roppëlaan', cat: 'Transports' },
  { fr: 'Bateau', wo: 'Gaal', cat: 'Transports' },
  { fr: 'Train', wo: 'Saxaar', cat: 'Transports' },
  { fr: 'Taxi', wo: 'Taksi', cat: 'Transports' },
  { fr: 'Bus', wo: 'Kaar', cat: 'Transports' },
  { fr: 'Moto', wo: 'Moto', cat: 'Transports' },
  { fr: 'Voiture', wo: 'Oto / Nadaamar', cat: 'Transports' },
  { fr: 'Vélo', wo: 'Welo', cat: 'Transports' },

  // Directions
  { fr: 'Où se trouve… ?', wo: 'Ana…?', cat: 'Directions' },
  { fr: 'Banque', wo: 'Bank', cat: 'Directions' },
  { fr: 'Gare', wo: 'Gaar', cat: 'Directions' },
  { fr: 'Centre-ville', wo: 'Dëkk', cat: 'Directions' },
  { fr: 'Hôtel', wo: 'Oteel', cat: 'Directions' },
  { fr: 'Hôpital', wo: 'Opitaal', cat: 'Directions' },
  { fr: 'C\'est proche / loin ?', wo: 'Jege / Sore ?', cat: 'Directions' },
  { fr: 'Tout droit', wo: 'Talal', cat: 'Directions' },
  { fr: 'Gauche / Droite', wo: 'Cammooñ / Ndayjoor', cat: 'Directions' },
  { fr: 'Nord / Sud / Est / Ouest', wo: 'Bëj / Gannaar / Penku / Sowu', cat: 'Directions' },
  { fr: 'Je suis perdu(e)', wo: 'Dema reer', cat: 'Directions' },

  // Chiffres
  { fr: 'Un', wo: 'Benn', cat: 'Chiffres' },
  { fr: 'Deux', wo: 'Ñaar', cat: 'Chiffres' },
  { fr: 'Trois', wo: 'Ñett', cat: 'Chiffres' },
  { fr: 'Quatre', wo: 'Ñent', cat: 'Chiffres' },
  { fr: 'Cinq', wo: 'Juroom', cat: 'Chiffres' },
  { fr: 'Six', wo: 'Juroom benn', cat: 'Chiffres' },
  { fr: 'Sept', wo: 'Juroom ñaar', cat: 'Chiffres' },
  { fr: 'Huit', wo: 'Juroom ñett', cat: 'Chiffres' },
  { fr: 'Neuf', wo: 'Juroom ñent', cat: 'Chiffres' },
  { fr: 'Dix', wo: 'Fukk', cat: 'Chiffres' },
  { fr: 'Vingt', wo: 'Ñaar fukk', cat: 'Chiffres' },
  { fr: 'Trente', wo: 'Ñett fukk', cat: 'Chiffres' },
  { fr: 'Quarante', wo: 'Ñent fukk', cat: 'Chiffres' },
  { fr: 'Cinquante', wo: 'Juroom fukk', cat: 'Chiffres' },
  { fr: 'Cent', wo: 'Teemeer', cat: 'Chiffres' },

  // Jours & Temps
  { fr: 'Quelle heure est-il ?', wo: 'Ban waxtu mo jot ?', cat: 'Temps' },
  { fr: 'Quand ?', wo: 'Kañ ?', cat: 'Temps' },
  { fr: 'Aujourd\'hui', wo: 'Tey', cat: 'Temps' },
  { fr: 'Matin / Midi / Soir', wo: 'Suba / Bëcëk / Ngoon', cat: 'Temps' },
  { fr: 'Demain', wo: 'Ëllëk', cat: 'Temps' },
  { fr: 'Hier', wo: 'Dëmb', cat: 'Temps' },
  { fr: 'Lundi', wo: 'Altine', cat: 'Temps' },
  { fr: 'Mardi', wo: 'Talaata', cat: 'Temps' },
  { fr: 'Mercredi', wo: 'Allarba', cat: 'Temps' },
  { fr: 'Jeudi', wo: 'Alxames', cat: 'Temps' },
  { fr: 'Vendredi', wo: 'Ajjuma', cat: 'Temps' },
  { fr: 'Samedi', wo: 'Gaawu', cat: 'Temps' },
  { fr: 'Dimanche', wo: 'Dibeer', cat: 'Temps' },
  { fr: 'Je suis ici en vacances', wo: 'Dema fe ñëw wakansu', cat: 'Temps' },

  // À table / Nourriture
  { fr: 'J\'ai faim', wo: 'Dema Xiif', cat: 'À table' },
  { fr: 'J\'ai soif', wo: 'Dema Marr', cat: 'À table' },
  { fr: 'Bon appétit !', wo: 'Na rees ak diam', cat: 'À table' },
  { fr: 'Santé !', wo: 'Wër ngu yaram', cat: 'À table' },
  { fr: 'C\'était délicieux !', wo: 'Neex na torop !', cat: 'À table' },
  { fr: 'Que me recommandez-vous ?', wo: 'Lo may digël ?', cat: 'À table' },
  { fr: 'Je suis végétarien(ne)', wo: 'Du ma lek yapp', cat: 'À table' },
  { fr: 'Sans épice !', wo: 'Bëggu ma kaani !', cat: 'À table' },
  { fr: 'C\'est trop chaud !', wo: 'Tang na !', cat: 'À table' },
  { fr: 'Eau', wo: 'Ndox', cat: 'À table' },
  { fr: 'Offrez-moi de l\'eau', wo: 'May ma ndox ma naan', cat: 'À table' },
  { fr: 'Thé / Café', wo: 'Attaaya / Cafe', cat: 'À table' },
  { fr: 'Poisson', wo: 'Jën', cat: 'À table' },
  { fr: 'Pain', wo: 'Mburu', cat: 'À table' },
  { fr: 'Cacahuète', wo: 'Gerte', cat: 'À table' },
  { fr: 'Fruit de mer', wo: 'Geej', cat: 'À table' },
  { fr: 'Petit-déjeuner', wo: 'Ndeki', cat: 'À table' },
  { fr: 'Déjeuner', wo: 'Agn', cat: 'À table' },
  { fr: 'Dîner', wo: 'Reer', cat: 'À table' },
  { fr: 'Je suis allergique', wo: 'Sama yara nangu wu ko', cat: 'À table' },

  // Santé & Urgences
  { fr: 'J\'ai besoin d\'un médecin', wo: 'Dama bëgg giss doktoor', cat: 'Urgences' },
  { fr: 'Appelez une ambulance !', wo: 'Wootel ambulance !', cat: 'Urgences' },
  { fr: 'Où est l\'hôpital ?', wo: 'Ana loppital ?', cat: 'Urgences' },
  { fr: 'Je ne me sens pas bien', wo: 'Dama feebar', cat: 'Urgences' },
  { fr: 'J\'ai mal ici', wo: 'Fi moy meeti', cat: 'Urgences' },
  { fr: 'Où sont les toilettes ?', wo: 'Ana wanak wi ?', cat: 'Urgences' },
  { fr: 'À l\'aide !', wo: 'Wollu !', cat: 'Urgences' },
  { fr: 'Police', wo: 'Alkaati', cat: 'Urgences' },
  { fr: 'Danger', wo: 'Luy lore', cat: 'Urgences' },

  // Famille
  { fr: 'Famille', wo: 'Mbokk', cat: 'Famille' },
  { fr: 'Mère', wo: 'Yaay', cat: 'Famille' },
  { fr: 'Père', wo: 'Baay', cat: 'Famille' },
  { fr: 'Enfant', wo: 'Doom', cat: 'Famille' },
  { fr: 'Frère / Sœur', wo: 'Rakk / Khar', cat: 'Famille' },
  { fr: 'Grand-père', wo: 'Maam bu góor', cat: 'Famille' },
  { fr: 'Grand-mère', wo: 'Maam bu jigéen', cat: 'Famille' },
  { fr: 'Ami(e)', wo: 'Xarit', cat: 'Famille' },

  // Adjectifs & Sentiments
  { fr: 'Beau / Belle', wo: 'Rafet', cat: 'Adjectifs' },
  { fr: 'Grand', wo: 'Mag', cat: 'Adjectifs' },
  { fr: 'Petit', wo: 'Ndaw', cat: 'Adjectifs' },
  { fr: 'Amour', wo: 'Mbëgël', cat: 'Adjectifs' },
  { fr: 'C\'est magnifique !', wo: 'Dafa rafet !', cat: 'Adjectifs' },
  { fr: 'Heureux / Contente', wo: 'Dafa neex', cat: 'Adjectifs' },
]

const LESSONS = [
  {
    id: 1, title: 'Salutations de base', icon: '👋',
    desc: 'Apprenez à vous saluer comme un vrai Sénégalais',
    phrases: [
      { fr: 'Bonjour / Bonsoir (paix sur vous)', wo: 'Salamalekum', note: 'Salutation islamique universelle au Sénégal' },
      { fr: 'Et la paix sur vous aussi', wo: 'Malekum salaam', note: 'Réponse standard obligatoire' },
      { fr: 'Comment allez-vous ?', wo: 'Nanga def ?', note: 'Formule très courante' },
      { fr: 'Très bien, et vous ?', wo: 'Mangi fi rekk', note: 'Litt. "Je suis là simplement"' },
      { fr: 'Au revoir', wo: 'Mangi dem', note: 'Litt. "Je pars"' },
      { fr: 'Bienvenue', wo: 'Akksil ak diam', note: 'Litt. "Sois arrivé(e) en paix"' },
      { fr: 'Bonne journée !', wo: 'Yendu ak jàmm', note: '' },
    ]
  },
  {
    id: 2, title: 'Politesse & Présentations', icon: '🤝',
    desc: 'Les formules de politesse essentielles',
    phrases: [
      { fr: 'Merci beaucoup', wo: 'Jërëjëf', note: 'Le mot le plus utile !' },
      { fr: 'Pardon / Excusez-moi', wo: 'Baal ma', note: '' },
      { fr: 'S\'il vous plaît', wo: 'Su la neexee', note: 'Litt. "Si ça te plaît"' },
      { fr: 'De rien', wo: 'Amul solo', note: 'Litt. "Ça n\'a pas d\'importance"' },
      { fr: 'Oui', wo: 'Waaw', note: '' },
      { fr: 'Non', wo: 'Deedeet', note: '' },
      { fr: 'Je m\'appelle…', wo: 'Mangi tuddu…', note: '' },
      { fr: 'Je ne comprends pas', wo: 'Deggu ma', note: '' },
    ]
  },
  {
    id: 3, title: 'Au marché / Commerce', icon: '🛒',
    desc: 'Négociez et faites vos courses en wolof',
    phrases: [
      { fr: 'Combien ça coûte ?', wo: 'Bi niata la ?', note: 'Indispensable au marché !' },
      { fr: 'C\'est trop cher !', wo: 'Bare na !', note: 'Pour négocier' },
      { fr: 'Pouvez-vous baisser le prix ?', wo: 'Wàññil ma njëg li', note: '' },
      { fr: 'C\'est un bon prix', wo: 'Yomb na', note: '' },
      { fr: 'Je voudrais acheter ceci', wo: 'Lii la bëgg', note: '' },
      { fr: 'Je ne fais que regarder', wo: 'Demay Xool rek', note: '' },
      { fr: 'L\'addition, s\'il vous plaît', wo: 'Ñaata la ?', note: '' },
      { fr: 'Argent', wo: 'Xaalis', note: '' },
    ]
  },
  {
    id: 4, title: 'Transports & Directions', icon: '🚕',
    desc: 'Se déplacer et demander son chemin',
    phrases: [
      { fr: 'Je voudrais aller à…', wo: 'Dama bëgga dem…', note: '' },
      { fr: 'Où se trouve… ?', wo: 'Ana… ?', note: 'Très simple et efficace' },
      { fr: 'C\'est proche / loin ?', wo: 'Jege / Sore ?', note: '' },
      { fr: 'Tout droit', wo: 'Talal', note: '' },
      { fr: 'Gauche / Droite', wo: 'Cammooñ / Ndayjoor', note: '' },
      { fr: 'Taxi', wo: 'Taksi', note: '' },
      { fr: 'Bus', wo: 'Kaar', note: '' },
      { fr: 'Je suis perdu(e)', wo: 'Dema reer', note: '' },
    ]
  },
  {
    id: 5, title: 'Chiffres & Nombres', icon: '🔢',
    desc: 'Compter en wolof de 1 à 100',
    phrases: [
      { fr: '1 — Un', wo: 'Benn', note: '' },
      { fr: '2 — Deux', wo: 'Ñaar', note: '' },
      { fr: '3 — Trois', wo: 'Ñett', note: '' },
      { fr: '4 — Quatre', wo: 'Ñent', note: '' },
      { fr: '5 — Cinq', wo: 'Juroom', note: 'Litt. "cinq" = "main"' },
      { fr: '6 — Six', wo: 'Juroom benn', note: 'Litt. "cinq et un"' },
      { fr: '10 — Dix', wo: 'Fukk', note: '' },
      { fr: '20 — Vingt', wo: 'Ñaar fukk', note: 'Litt. "deux dix"' },
      { fr: '100 — Cent', wo: 'Teemeer', note: '' },
    ]
  },
  {
    id: 6, title: 'Jours & Horaires', icon: '📅',
    desc: 'Le temps, les jours de la semaine',
    phrases: [
      { fr: 'Quelle heure est-il ?', wo: 'Ban waxtu mo jot ?', note: '' },
      { fr: 'Aujourd\'hui', wo: 'Tey', note: '' },
      { fr: 'Matin / Midi / Soir', wo: 'Suba / Bëcëk / Ngoon', note: '' },
      { fr: 'Demain', wo: 'Ëllëk', note: '' },
      { fr: 'Hier', wo: 'Dëmb', note: '' },
      { fr: 'Lundi / Mardi / Mercredi', wo: 'Altine / Talaata / Allarba', note: 'Jours en arabe adapté' },
      { fr: 'Jeudi / Vendredi', wo: 'Alxames / Ajjuma', note: 'Ajjuma = jour de prière' },
      { fr: 'Samedi / Dimanche', wo: 'Gaawu / Dibeer', note: '' },
    ]
  },
  {
    id: 7, title: 'À table !', icon: '🍽️',
    desc: 'Manger et boire en wolof',
    phrases: [
      { fr: 'J\'ai faim', wo: 'Dema Xiif', note: '' },
      { fr: 'J\'ai soif', wo: 'Dema Marr', note: '' },
      { fr: 'Bon appétit !', wo: 'Na rees ak diam', note: 'Litt. "Mange en paix"' },
      { fr: 'C\'était délicieux !', wo: 'Neex na torop !', note: '' },
      { fr: 'Sans épice s\'il vous plaît !', wo: 'Bëggu ma kaani !', note: '' },
      { fr: 'De l\'eau, s\'il vous plaît', wo: 'May ma ndox ma naan', note: '' },
      { fr: 'Je suis végétarien(ne)', wo: 'Du ma lek yapp', note: 'Litt. "Je ne mange pas de viande"' },
      { fr: 'Thé (ataya)', wo: 'Attaaya', note: 'Le thé à la menthe sénégalais' },
    ]
  },
  {
    id: 8, title: 'Santé & Urgences', icon: '🏥',
    desc: 'Les mots essentiels en cas de problème',
    phrases: [
      { fr: 'À l\'aide !', wo: 'Wollu !', note: 'Cri d\'urgence' },
      { fr: 'J\'ai besoin d\'un médecin', wo: 'Dama bëgg giss doktoor', note: '' },
      { fr: 'Appelez une ambulance !', wo: 'Wootel ambulance !', note: '' },
      { fr: 'Où est l\'hôpital ?', wo: 'Ana loppital ?', note: '' },
      { fr: 'Je ne me sens pas bien', wo: 'Dama feebar', note: '' },
      { fr: 'J\'ai mal ici', wo: 'Fi moy meeti', note: '' },
      { fr: 'Où sont les toilettes ?', wo: 'Ana wanak wi ?', note: '' },
      { fr: 'Police', wo: 'Alkaati', note: '' },
    ]
  },
]

export default function ApprendreWolof() {
  const [tab, setTab] = useState('lecons')
  const [lesson, setLesson] = useState(null)
  const [grammarUnit, setGrammarUnit] = useState(null)
  const [showPronunc, setShowPronunc] = useState(false)
  const [msgs, setMsgs] = useState([{ role: 'assistant', text: 'Salaam alekum ! Je suis Lamine, votre professeur de Wolof. Comment puis-je vous aider aujourd\'hui ? 🦁' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [xp, setXp] = useState(0)
  const [vocabFilter, setVocabFilter] = useState('Tous')

  const cats = ['Tous', ...new Set(VOCAB.map(v => v.cat))]

  const sendMsg = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)
    try {
      const reply = await callAI([
        { role: 'system', content: `Tu es Lamine, un professeur de Wolof chaleureux, expert et encourageant. Tu enseignes la langue wolof du Sénégal avec passion. Réponds toujours en français avec des exemples en Wolof, des traductions et des conseils de prononciation. Sois clair, précis et motivant. Utilise des emojis 🇸🇳🦁.

=== GUIDE DE PRONONCIATION ===
- b (fin de mot) : prononcé bouche fermée. ex: sob (curieux)
- c : prononcé "ti" (tiède). ex: céeb [riz] = [tièb]
- e : prononcé é. ex: ben (1) = [béen]
- ë : prononcé è/eu. ex: kër (maison) = [keur]
- g : toujours "gue". ex: gëlëëm (chameau) = [gueléèm]
- j : prononcé "di" (dionysios). ex: jaar (passer) = [diaar]
- ñ : prononcé "gn" (vigne). ex: ñaar (2) = [gnaar]
- ŋ : nasalise la voyelle précédente. ex: basseŋ = [bassang]
- q : du fond de la gorge. ex: daqar (tamarin)
- w : prononcé "ou". ex: won (montrer) = [ouone]
- x : comme le "j" espagnol. ex: xaar (attendre) = [khaar]
- r : roulé
Toute voyelle ou consonne doublée = son allongé.

=== UNITÉ 1 — PRONOMS & PRÉSENT DÉMONSTRATIF ===
Pronoms sujets isolés : man(je), yow(tu), moom(il/elle), ñun(nous), yéen(vous), ñoom(ils/elles)
Présent démonstratif — formes contractées :
  man a ngi → mangi | yow a ngi → yangi | moom a ngi → mungi
  ñun a ngi → ñungi | yéen a ngi → yéénagi | ñoom a ngi → ñungi
Progressif (action en cours) : ajouter "di" → mangi+di = mangiy
  Mangi fi = Me voici ici | Yéénangiy toog = Vous êtes assis
  Mungi nellaw = Il dort | Mungë fë = Il est là-bas
Noms : chaque nom a une consonne de classe qui forme le démonstratif.
  bunt(b)+i → bunt bi (cette porte ci) | cin(l)+i → cin li (cette marmite ci)
  jigéen(y) pluriel → ay jigéen (des femmes)

=== UNITÉ 2 — PRONOMS OBJETS & PRÉSENT PROGRESSIF ===
Pronoms objets : më(me), lë(te), ko(le/la), ñu(nous), léën(vous/les)
Conjugaison progressive : Sujet + ngi/ngë + pronom objet + di + verbe
  yangi ko lëy wax = tu es en train de lui parler
  Joob añ koy def = Diop est en train de le faire
  maŋ lëy wax = je suis en train de te le dire
Pronoms relatifs sujets (qui) : lettre classe + u
  jiggéen(j) → jiggéen ju... = la fille qui...
  Jiggéen ju rafet = une jolie fille
  Mangiy jënd cin lu yomb = je suis en train d'acheter une marmite bon marché

=== UNITÉ 3 — POSSESSIF & PASSÉ ACCOMPLI ===
Possessifs : sumë(mon/ma), sa(ton/ta), -am(son/sa), suñu(notre), séën(votre/leur)
  sumey(mes), sey(tes), suñuy(nos), séëni(vos/leurs)
  Mangi jël sumë téeré = je prends mon livre
  La maison de mon ami : Kër-u sumë xarit → Sumë kër-u xarit
Passé accompli (terminaisons) :
  je(-naa), tu(-ngë), il/elle(-në), nous(-neñu), vous(-ngéën), ils(-neñu)
  lekk→lekk-në = il/elle a mangé | dem→dem-ngéën = vous êtes partis
Négation de l'accompli : -uma(je), -ulo(tu), -ul(il/elle), -uñu(nous/ils), -uléën(vous)
  Degg-uma = je n'ai pas compris | dem-ul = il n'est pas parti
  Yomb-ul: c'est bon marché | Céëb bi bari-ul: ce riz n'est pas abondant

=== UNITÉ 4 — INTERROGATIFS, ADVERBES & CHIFFRES ===
Pronoms interrogatifs : lettre classe + an
  kan(qui, sg) | ñan(qui, pl) | lan(que/quoi)
  kan lë gis dëmbë? = qui as-tu vu hier?
  lan lëñy def subë? = que ferons-nous demain?
Adverbes interrogatifs :
  où = fan? | comment = nan? | quand = kañ? | combien = ñaata?
  fan leñuy dem? = où allons-nous? | nan ngë fëy dem? = comment vas-tu?
Chiffres : benn(1), ñaar(2), ñett(3), ñent(4), juroom(5), juroom benn(6), juroom ñaar(7), juroom ñett(8), juroom ñent(9), fukk(10)
  fukk ak benn(11), fukk ak ñaar(12), ñaar fukk(20), ñett fukk(30), ñent fukk(40), juroom fukk(50)
  teemeer(100), junni(1000), ñaar téémeri(200), fanweer(31, jours du mois)
CFA : 5F=juroom, 10F=ñaari dërëm, 25F=juroom dërëm, 50F=fuki dërëm, 100F=ñaar téémeri dërëm, 500F=juroom téémeri dërëm, 1000F=junni dërëm

=== UNITÉ 5 — PRONOM DÉPENDANT & RELATIVES ===
Pronoms sujets dépendants (subordonnées) :
  ma(je), ngë(tu), mu(il/elle), nu/ñu(nous), ngéën(vous), ñu(ils/elles)
  Wàaxnaa ko mu indi léen bissap ñu naan = je lui ai dit d'apporter du bissap à boire
  Bëggnaa mu séeti yaayam = je veux qu'elle aille voir sa mère
Adverbes relatifs : fu(où), nu(comment), kañ(quand)
  xàmngë fu ñuy dem = tu sais où ils vont
  xàmnaa nan lëñu dem = je sais comment ils sont venus

=== UNITÉ 6 — ARTICLE INDÉFINI, IMPÉRATIF & FUTUR ===
Article indéfini : consonne classe + "a-"
  b→ab, w→aw, l→al, g→ag, s→as, k→ak | pluriel: y→ay
  ab siis(une chaise), aw fas(un cheval), al cin(une marmite), ag gaal(une pirogue)
  ay jigéen(des femmes)
Impératif perfectif (ordre ponctuel) :
  singulier: verbe+(a)l | pluriel: verbe+léën
  jël+al=jëlal(prends!) | dem+léën=demléën(partez!)
Impératif progressif (action continue) :
  singulier: di+l=dil | pluriel: di+léën=diléën
  dil def spoor bés bu nekk = fais du sport chaque jour
Forme négative impérative : bul + verbe (sg) | buléën + verbe (pl)
  bul nellaw = ne dors pas! | buléën dem foofu = ne partez pas là-bas!
Le futur affirmatif : di naa(je), di ngë(tu), di në(il/elle), di néñu(nous), di ngéën(vous), di néñu(ils)
  Di naa jang téeré bi subë = je lirai ce livre demain
Futur négatif : duma(je), do(tu), du(il/elle), duñu(nous/ils), dungéën(vous)
  Duma dem ja subë = je n'irai pas au marché demain

=== UNITÉ 7 — MODE EMPHATIQUE & PRONOMS INDÉFINIS ===
Emphatique sujet (pour mettre l'accent sur qui fait l'action) :
  maa(moi), yaa(toi), mo(il/elle), ñu(nous), yééna(vous), ño(ils/elles)
  Joob a raxas oto bi = c'est Diop qui a lavé cette voiture
  Maa ko jël = c'est moi qui l'ai pris
Contractions emphatiques+démonstratif :
  bi+a=ba, bë+a=baa, boobu+a=boobuu, yow+a=yaa, moom+a=moo
  Progressif: a+di contracté en ay. Marèem ay dem ja subë = c'est Marème qui ira au marché demain
Pronoms indéfinis (suffixe -épp) :
  f(lieu)+épp=fépp(partout) | k(personne sg)+épp=képp(chaque personne)
  ñ(personnes)+épp=ñépp(tous) | l(chose)+épp=lépp(tout/chaque chose)
  Képp warnë am kër = chacun doit avoir un logis

=== UNITÉ 8 — AUXILIAIRE ÊTRE & ÉTATS ===
Être (mode causatif) : dama(je suis), dangë(tu es), dafa(il/elle est), dañu(nous/ils sommes), dangéën(vous êtes)
  dangë rafet = tu es jolie | dafa dem = il est parti | dafa tukki = il est parti en voyage
Action non accomplie : être + di + verbe
  Job dafay liggey = Diop est en train de travailler
  Newkat-u Sënégal dañuy liggey bu baax = les couturiers du Sénégal travaillent bien
Vocabulaire états : rafet(beau), yomb(facile/bon marché), seer(cher/difficile), mag(grand/vieux), ndaw(petit/jeune), baax(bon/bien), feebar(malade), tukki(voyager), liggey(travailler)

=== UNITÉ 9 — PASSÉS LOINTAINS & FRÉQUENTATIF ===
Passé lointain : verbe + oon + pronom accompli
  Liggéy-oon-naa foofu = j'avais travaillé là-bas
  Foofu laa liggéyoon = c'est là-bas que j'avais travaillé (proposition inversée)
Négatif : négation accompli + woon
  Liggéyumë-oon Ndakaru = je n'ai pas travaillé à Dakar
  Demumë fë-oon = je n'étais pas allé là-bas
Causatif alternatif : être + verbe + oon
  Dama jaay-oon oto bi = je vendais cette voiture | Dafa défaroon kéram = il construisait sa maison
Fréquentatif imparfait (habitude passée) : être + daan + verbe
  At yooyu, dama daan jaay piis = ces années-là je vendais du tissu habituellement
  Négatif : être + dulwaan + verbe

=== UNITÉ 10 — CONDITIONNEL & COMPARATIF ===
Conditionnel futur (quand+futur) : Bu + pronom dépendant + (verbe+ë) + complément
  Bu ma demë, dinaa lë ko waax = quand je partirai, je te le dirai
  Bu ngéën ëggë, waaxléën ñu ko = quand vous arriverez, dites-le nous
Conditionnel passé (quand+passé) : Bi + pronom + verbe + complément
  Bi ma jëkk ñow, fekknaa fli laobë = quand je suis venu la première fois, j'ai trouvé un menuisier
Conditionnel irréel (si) : Bu + pronom + verbe au plus-que-parfait + complément
  Bumë amoon xaalis, dinaa lë ci may tuuti = si j'avais de l'argent, je t'en donnerais un peu
Comparatif :
  Plus que : Nom + pronom + géné + adjectif/verbe + complément
    Céeb bi mo géné neex céeb boobu = ce riz-ci est meilleur que celui-là
  Autant que : Nom + adjectif/verbe + ni + complément
    Astu rafetñi rakkam bu jiggéën = Astou est aussi jolie que sa petite sœur
  Moins que : Nom + adjectif négatif + ni + complément
    Wolof-u Ndakaru jafëwul ni wolof-u Kajoor = le wolof de Dakar est moins difficile que le wolof du Cayor

=== VOCABULAIRE THÉMATIQUE ===
Salutations : Salamalekum(bonjour), Malekum salaam(réponse), Nanga def?(comment allez-vous?), Mangi fi rekk(très bien), Jërëjëf(merci), Baal ma(pardon), Mangi dem(au revoir), Akksil ak diam(bienvenue), Yendu ak jàmm(bonne journée)
Politesse : Waaw(oui), Deedeet(non), Su la neexee(s'il vous plaît), Amul solo(de rien), Mangi tuddu(je m'appelle), Degg na(je comprends), Deggu ma(je ne comprends pas)
Commerce : Bi niata la?(combien?), Bare na!(trop cher!), Wàññil ma njëg li(baissez le prix), Yomb na(c'est bon prix), Xaalis(argent), Ñaata la?(l'addition?)
Transports : Roppëlaan(avion), Gaal(bateau), Saxaar(train), Taksi(taxi), Kaar(bus), Oto/Nadaamar(voiture), Welo(vélo), Dama bëgga dem...(je voudrais aller à...)
Directions : Ana...?(où se trouve?), Talal(tout droit), Cammooñ(gauche), Ndayjoor(droite), Jege(proche), Sore(loin), Dema reer(je suis perdu)
À table : Dema Xiif(j'ai faim), Dema Marr(j'ai soif), Na rees ak diam(bon appétit), Neex na torop!(délicieux!), Bëggu ma kaani!(sans épice), May ma ndox ma naan(de l'eau svp), Attaaya(thé), Ndeki(petit-déj), Agn(déjeuner), Reer(dîner)
Urgences : Wollu!(à l'aide!), Dama feebar(je ne me sens pas bien), Ana loppital?(où est l'hôpital?), Alkaati(police), Ana wanak wi?(où sont les toilettes?), Fi moy meeti(j'ai mal ici)
Famille : Yaay(mère), Baay(père), Doom(enfant), Mbokk(famille), Maam(grand-parent), Xarit(ami)
Temps : Tey(aujourd'hui), Ëllëk(demain), Dëmb(hier), Suba(matin), Bëcëk(midi), Ngoon(soir)
Jours : Altine(lundi), Talaata(mardi), Allarba(mercredi), Alxames(jeudi), Ajjuma(vendredi), Gaawu(samedi), Dibeer(dimanche)

Utilise toutes ces connaissances pour répondre aux questions des apprenants. Donne toujours : la règle, un exemple en wolof en gras, sa traduction française, et un conseil pratique.` },
        ...msgs.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text })),
        { role: 'user', content: userMsg }
      ])
      setMsgs(m => [...m, { role: 'assistant', text: reply }])
      setXp(x => x + 10)
    } catch {
      setMsgs(m => [...m, { role: 'assistant', text: '❌ Désolé, une erreur est survenue. Réessayez.' }])
    } finally { setLoading(false) }
  }

  const filteredVocab = vocabFilter === 'Tous' ? VOCAB : VOCAB.filter(v => v.cat === vocabFilter)
  const level = Math.floor(xp / 100) + 1

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 bogolan min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(13,122,62,0.1)', color: '#0D7A3E', border: '1px solid rgba(13,122,62,0.2)' }}>
              🦁 Tuteur de Langue
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-playfair text-brown mb-3">Parler Wolof</h1>
            <p className="text-brown/60">La langue du cœur du Sénégal — 40% de la population la parle quotidiennement</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm font-semibold" style={{ color: '#E8A830' }}>Niveau {level}</span>
              <div className="w-32 h-2 rounded-full bg-sand overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${xp % 100}%`, background: 'linear-gradient(90deg, #E8A830, #C8552A)' }} />
              </div>
              <span className="text-sm text-brown/50">{xp} XP</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {[['lecons','📚 Leçons'],['grammaire','📐 Grammaire'],['vocabulaire','📖 Vocabulaire'],['conversation','💬 Conversation IA']].map(([k,l]) => (
              <button key={k} onClick={() => { setTab(k); setLesson(null); setGrammarUnit(null) }}
                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                style={{ background: tab === k ? 'linear-gradient(135deg,#0D7A3E,#0A5C2E)' : 'rgba(245,230,204,0.6)', color: tab === k ? '#fff' : '#5C2D0A', border: tab === k ? 'none' : '1px solid rgba(232,168,48,0.2)' }}>
                {l}
              </button>
            ))}
          </div>

          {tab === 'lecons' && (
            lesson ? (
              <div className="glass-card p-6">
                <button onClick={() => setLesson(null)} className="text-sm text-brown/60 hover:text-brown mb-4 flex items-center gap-1">← Retour aux leçons</button>
                <div className="text-4xl mb-3">{lesson.icon}</div>
                <h2 className="text-2xl font-black font-playfair text-brown mb-1">{lesson.title}</h2>
                <p className="text-brown/60 mb-6">{lesson.desc}</p>
                <div className="space-y-3">
                  {lesson.phrases.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(245,230,204,0.5)', border: '1px solid rgba(232,168,48,0.15)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm text-brown/60">{p.fr}</div>
                          <div className="text-lg font-bold font-playfair" style={{ color: '#0D7A3E' }}>{p.wo}</div>
                          {p.note && <div className="text-xs text-brown/40 mt-0.5 italic">{p.note}</div>}
                        </div>
                        <button onClick={() => setXp(x => x + 5)} className="text-xs px-3 py-1 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(13,122,62,0.1)', color: '#0D7A3E' }}>
                          ✅ Appris
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setTab('conversation'); setLesson(null) }}
                  className="mt-6 btn-green w-full py-3 text-white text-sm">
                  🤖 Pratiquer avec l'IA
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {LESSONS.map(l => (
                  <button key={l.id} onClick={() => { setLesson(l); setXp(x => x + 5) }}
                    className="glass-card p-6 text-left game-card-hover">
                    <div className="text-4xl mb-3">{l.icon}</div>
                    <h3 className="font-bold font-playfair text-brown text-lg mb-2">{l.title}</h3>
                    <p className="text-brown/60 text-sm">{l.desc}</p>
                    <div className="mt-3 text-xs font-semibold" style={{ color: '#0D7A3E' }}>{l.phrases.length} phrases →</div>
                  </button>
                ))}
              </div>
            )
          )}

          {tab === 'grammaire' && (
            grammarUnit ? (
              /* ─── Détail d'une unité ─── */
              <div>
                <button onClick={() => setGrammarUnit(null)}
                  className="text-sm mb-5 flex items-center gap-1"
                  style={{ color: '#0D7A3E', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ← Retour aux unités
                </button>
                <div className="glass-card p-6 mb-4">
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{grammarUnit.icon}</div>
                  <h2 className="text-2xl font-black font-playfair text-brown mb-1">
                    Unité {grammarUnit.id} — {grammarUnit.title}
                  </h2>
                  <p className="text-brown/60 mb-6">{grammarUnit.desc}</p>

                  {grammarUnit.sections.map((sec, si) => (
                    <div key={si} className="mb-6">
                      <h3 className="font-bold text-brown mb-3" style={{ fontSize: 15, borderLeft: '3px solid #0D7A3E', paddingLeft: 10 }}>
                        {sec.title}
                      </h3>

                      {sec.type === 'table' && (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                              <tr>
                                {sec.headers.map((h, hi) => (
                                  <th key={hi} style={{ background: '#0D7A3E', color: '#fff', padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sec.rows.map((row, ri) => (
                                <tr key={ri} style={{ background: ri % 2 === 0 ? 'rgba(245,230,204,0.4)' : 'white' }}>
                                  {row.map((cell, ci) => (
                                    <td key={ci} style={{ padding: '8px 12px', color: ci === 1 ? '#0D7A3E' : '#5C2D0A', fontWeight: ci === 1 ? 700 : 400, borderBottom: '1px solid rgba(232,168,48,0.15)' }}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {sec.type === 'info' && (
                        <div style={{ background: 'rgba(13,122,62,0.06)', border: '1px solid rgba(13,122,62,0.15)', borderRadius: 12, padding: '14px 16px' }}>
                          {sec.content.split('\n').map((line, li) => (
                            <p key={li} style={{ fontSize: 13, color: '#5C2D0A', lineHeight: 1.7, margin: 0 }}>
                              {line || <br />}
                            </p>
                          ))}
                        </div>
                      )}

                      {sec.type === 'examples' && (
                        <div className="space-y-2">
                          {sec.items.map((item, ii) => (
                            <div key={ii} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '10px 14px', background: 'rgba(245,230,204,0.5)', borderRadius: 10, border: '1px solid rgba(232,168,48,0.15)' }}>
                              <div style={{ minWidth: 180 }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#0D7A3E', fontFamily: 'Playfair Display, serif' }}>{item.wo}</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'rgba(92,45,10,0.7)', fontStyle: 'italic' }}>{item.fr}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <button onClick={() => { setTab('conversation'); setGrammarUnit(null) }}
                    className="mt-4 w-full py-3 text-white text-sm font-semibold rounded-xl"
                    style={{ background: 'linear-gradient(135deg,#0D7A3E,#0A5C2E)' }}>
                    🤖 Pratiquer avec le professeur IA
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Liste des unités ─── */
              <div>
                {/* Prononciation */}
                <div className="glass-card p-5 mb-6">
                  <button onClick={() => setShowPronunc(!showPronunc)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 28 }}>🔊</span>
                      <div style={{ textAlign: 'left' }}>
                        <div className="font-bold text-brown font-playfair" style={{ fontSize: 17 }}>Guide de prononciation</div>
                        <div style={{ fontSize: 12, color: 'rgba(92,45,10,0.55)' }}>La transcription phonétique du wolof expliquée</div>
                      </div>
                    </div>
                    <span style={{ color: '#0D7A3E', fontSize: 20 }}>{showPronunc ? '▲' : '▼'}</span>
                  </button>

                  {showPronunc && (
                    <div style={{ marginTop: 16, overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr>
                            <th style={{ background: '#0D7A3E', color: '#fff', padding: '8px 12px', textAlign: 'left' }}>Lettre</th>
                            <th style={{ background: '#0D7A3E', color: '#fff', padding: '8px 12px', textAlign: 'left' }}>Prononciation</th>
                            <th style={{ background: '#0D7A3E', color: '#fff', padding: '8px 12px', textAlign: 'left' }}>Exemple</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PRONUNCIATION.map((p, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(245,230,204,0.4)' : 'white' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0D7A3E', borderBottom: '1px solid rgba(232,168,48,0.1)' }}>{p.letter}</td>
                              <td style={{ padding: '8px 12px', color: '#5C2D0A', borderBottom: '1px solid rgba(232,168,48,0.1)' }}>{p.rule}</td>
                              <td style={{ padding: '8px 12px', color: 'rgba(92,45,10,0.65)', fontStyle: 'italic', borderBottom: '1px solid rgba(232,168,48,0.1)' }}>{p.ex}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p style={{ fontSize: 12, color: 'rgba(92,45,10,0.5)', marginTop: 10, fontStyle: 'italic' }}>
                        Source : Initiation au Wolof — Xavier BRY. Toute voyelle ou consonne peut être redoublée (allonge le son).
                      </p>
                    </div>
                  )}
                </div>

                {/* Les 10 unités */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {GRAMMAR_UNITS.map(unit => (
                    <button key={unit.id} onClick={() => { setGrammarUnit(unit); setXp(x => x + 5) }}
                      className="glass-card text-left game-card-hover p-5"
                      style={{ border: 'none', cursor: 'pointer', background: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(13,122,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {unit.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#0D7A3E', marginBottom: 2 }}>UNITÉ {unit.id}</div>
                          <div className="font-bold text-brown font-playfair" style={{ fontSize: 15, lineHeight: 1.3 }}>{unit.title}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(92,45,10,0.6)', lineHeight: 1.6, margin: 0 }}>{unit.desc}</p>
                      <div style={{ marginTop: 10, fontSize: 12, color: '#0D7A3E', fontWeight: 600 }}>
                        {unit.sections.length} sections → Voir le cours
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {tab === 'vocabulaire' && (
            <div className="glass-card p-6">
              <div className="flex flex-wrap gap-2 mb-5">
                {cats.map(c => (
                  <button key={c} onClick={() => setVocabFilter(c)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{ background: vocabFilter === c ? '#0D7A3E' : 'rgba(245,230,204,0.6)', color: vocabFilter === c ? '#fff' : '#5C2D0A', border: '1px solid rgba(232,168,48,0.2)' }}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredVocab.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(245,230,204,0.5)', border: '1px solid rgba(232,168,48,0.15)' }}>
                    <div className="text-sm text-brown/60 mb-1">{v.fr}</div>
                    <div className="text-xl font-bold font-playfair" style={{ color: '#0D7A3E' }}>{v.wo}</div>
                    <div className="text-xs text-brown/40 mt-1">{v.cat}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'conversation' && (
            <div className="glass-card overflow-hidden" style={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
              <div className="p-4 border-b" style={{ borderColor: 'rgba(232,168,48,0.15)', background: 'rgba(245,230,204,0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg,#0D7A3E,#0A5C2E)' }}>🦁</div>
                  <div>
                    <div className="font-bold text-brown text-sm">Lamine</div>
                    <div className="text-xs text-green-600">● Disponible</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs md:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={m.role === 'user' ? { background: 'linear-gradient(135deg,#C8552A,#A83820)', color: '#fff', borderBottomRightRadius: 4 } : { background: 'rgba(245,230,204,0.7)', color: '#5C2D0A', borderBottomLeftRadius: 4 }}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(245,230,204,0.7)' }}>
                      <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#5C2D0A', animationDelay: `${i*0.15}s` }} />)}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t" style={{ borderColor: 'rgba(232,168,48,0.15)' }}>
                <div className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
                    placeholder="Posez votre question en français..."
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(245,230,204,0.5)', border: '1.5px solid rgba(232,168,48,0.3)', color: '#5C2D0A' }} />
                  <button onClick={sendMsg} disabled={loading || !input.trim()} className="btn-green px-4 py-2.5 text-white text-sm disabled:opacity-50">
                    ➤
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
