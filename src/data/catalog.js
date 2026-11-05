export const themes = [
  {
    id: "cartes",
    label: "Jeux de carte",
    harbor: 0xe7c27a,
    pitch: "Le jeu est déjà sur la table. Ici, seulement la règle.",
  },
  {
    id: "interactif",
    label: "Jeux intéractif",
    harbor: 0x7eeadf,
    pitch: "Le pont devient le plateau. On joue à l'écran.",
  },
  {
    id: "noeuds",
    label: "Nœuds",
    harbor: 0xc9b0f5,
    pitch: "Une corde, des étapes. Le manuel remplace la règle.",
  },
];

const card = (id, name, players, duration, summary, rules) => ({
  id,
  theme: "cartes",
  kind: "rules",
  name,
  players,
  duration,
  summary,
  rules,
});

const play = (id, name, players, duration, summary, playId, help) => ({
  id,
  theme: "interactif",
  kind: "play",
  name,
  players,
  duration,
  summary,
  playId,
  help,
});

function rope(d, color) {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function figure(parts, badge) {
  return `<svg class="knot" viewBox="0 0 200 140" role="img" aria-label="Étape ${badge}">
    <rect width="200" height="140" rx="12" fill="#f7f3ec"/>
    <circle cx="22" cy="22" r="12" fill="#087f86"/>
    <text x="22" y="26" text-anchor="middle" font-size="13" fill="#f3fffc" font-family="Segoe UI, sans-serif">${badge}</text>
    ${parts}
  </svg>`;
}

const dormant = "#3d2a22";
const courant = "#087f86";

const knot = (id, name, summary, steps) => ({
  id,
  theme: "noeuds",
  kind: "knot",
  name,
  players: "1",
  duration: "2 min",
  summary,
  steps,
});

export const games = [
  card("bataille", "La Bataille", "2", "10 min", "On retourne une carte. La plus forte ramasse le pli.", [
    { h: "Mise en place", p: "Un jeu de 52 cartes, sans jokers. On le mélange et on le partage en deux paquets égaux, face cachée. Chacun garde son paquet sans le regarder." },
    { h: "Le tour", p: "Les deux joueurs retournent en même temps la première carte de leur paquet. La plus forte emporte les deux : as au-dessus du roi, puis dame, valet, 10, et ainsi de suite jusqu'au 2. Le gagnant glisse les cartes sous son paquet." },
    { h: "La bataille", p: "Si les deux cartes sont égales, chaque joueur pose une carte face cachée, puis une carte face visible. La plus forte des cartes visibles remporte tout le tas. On recommence autant de fois que l'égalité se répète." },
    { h: "Fin", p: "Le premier qui n'a plus de carte a perdu. On peut aussi arrêter au bout d'un temps et compter les cartes : le plus gros paquet gagne." },
  ]),
  card("belote", "La Belote", "4", "30 min", "Partenaire en face, atout annoncé, plis et annonces.", [
    { h: "Mise en place", p: "32 cartes, du 7 à l'as. Quatre joueurs, le partenaire est en face. On donne 6 cartes chacun, puis on retourne une carte qui propose l'atout. Chacun, à tour de rôle, peut prendre ou passer. Si tout le monde passe, on propose une autre couleur." },
    { h: "Compléter la donne", p: "Quand l'atout est choisi, on donne encore 3 cartes au preneur et 2 aux autres. Le preneur récupère aussi la carte retournée." },
    { h: "Annonces", p: "Avant le premier pli, on peut annoncer un carré ou une suite d'au moins trois cartes de la même couleur. La plus forte annonce du camp marque, l'autre est annulée. Belote et rebelote : roi et dame d'atout dans la même main, annoncés au moment où on les joue." },
    { h: "Les plis", p: "On doit fournir la couleur demandée. Si on ne l'a pas, on coupe à l'atout si on en a, et on doit monter sur un atout déjà posé quand c'est possible. L'atout est plus fort que la couleur demandée. Ordre à l'atout : valet, 9, as, 10, roi, dame, 8, 7. Hors atout : as, 10, roi, dame, valet, 9, 8, 7." },
    { h: "Fin de la donne", p: "Le camp qui a pris doit faire plus de points que l'autre. Sinon il est dedans : l'adversaire marque tout. Dix de der, le dernier pli, vaut 10 points. On joue plusieurs donnes jusqu'à un total convenu, souvent autour de 1000 ou 1500." },
  ]),
  card("holdem", "Poker fermé à cinq cartes communes", "2-8", "20 min", "Deux cartes en main, cinq cartes au milieu, on compare la meilleure main de cinq cartes.", [
    { h: "Mise en place", p: "Un jeu de 52 cartes et des jetons de comptoir, sans valeur d'argent. À chaque donne, deux joueurs voisins posent une mise obligatoire, petite puis grosse. Le donneur tourne après chaque donne." },
    { h: "Les cartes", p: "Chacun reçoit deux cartes fermées. On mise, puis on découvre trois cartes communes, puis une quatrième, puis une cinquième. Un tour de mises suit chaque découverte. On peut suivre, relancer ou se coucher." },
    { h: "La main", p: "Au showdown, chaque joueur encore en lice compose sa meilleure main de cinq cartes parmi ses deux cartes et les cinq communes. De la plus forte à la plus faible : quinte flush, carré, full, couleur, suite, brelan, deux paires, paire, carte haute. L'as peut fermer une suite haute ou basse." },
    { h: "Fin", p: "Le meilleur jeu remporte le pot du coup. Si deux mains sont égales, on partage. On fixe à l'avance la durée ou le moment où l'on compte les jetons." },
  ]),
  card("vingt-et-un", "Le Vingt-et-un", "2-7", "15 min", "S'approcher de 21 sans le dépasser. La banque tire jusqu'à 17.", [
    { h: "Mise en place", p: "Un jeu de 52 cartes. Les figures valent 10, l'as vaut 1 ou 11, les autres leur valeur. Une personne tient la banque et donne deux cartes à chacun, dont une face visible. La banque ne montre qu'une carte." },
    { h: "Le tour du joueur", p: "À son tour, on demande une carte ou on s'arrête. On peut demander plusieurs cartes. Dépasser 21 fait perdre la main tout de suite. Deux cartes qui font 21, un as et une figure ou un dix, battent un 21 obtenu avec plus de cartes." },
    { h: "La banque", p: "Quand tout le monde s'est arrêté, la banque retourne sa carte cachée et tire jusqu'à atteindre au moins 17. Si elle dépasse 21, les mains encore en jeu gagnent. Sinon, on compare : plus proche de 21 l'emporte, l'égalité rend la mise." },
    { h: "Fin", p: "On joue des jetons de comptoir. La banque tourne après un tour de table, ou reste à celui qui a perdu la dernière main. On s'arrête quand la soirée change de jeu." },
  ]),
  card("rami", "Le Rami", "2-4", "25 min", "Combinaisons de trois cartes : brelans ou suites de la même couleur.", [
    { h: "Mise en place", p: "52 cartes. Deux joueurs reçoivent 10 cartes, trois ou quatre joueurs en reçoivent 7. Le reste forme la pioche, face cachée. On retourne une carte pour ouvrir la défausse." },
    { h: "Le tour", p: "On pioche soit la première carte de la pioche, soit la carte visible de la défausse. Puis on pose une combinaison si on le peut : trois cartes de même rang, ou trois cartes qui se suivent dans la même couleur. On peut aussi ajouter une carte à une combinaison déjà sur la table. On termine en défaussant une carte." },
    { h: "Fin de la donne", p: "Le premier qui pose sa dernière carte gagne la donne. Les cartes restantes dans les mains des autres comptent contre eux : les figures 10, l'as 1, le reste à sa valeur. On additionne plusieurs donnes." },
  ]),
  card("huit", "Le Huit", "2-6", "15 min", "On pose la même couleur ou le même rang. Le 8 change la couleur.", [
    { h: "Mise en place", p: "52 cartes. On en donne 7 à chacun, ou 5 si vous êtes cinq ou six. Le reste est la pioche. On retourne une carte pour commencer la défausse. Si c'est un 8, on en retourne une autre." },
    { h: "Le tour", p: "On pose une carte de la couleur demandée ou du même rang que la carte visible. Un 8 se pose sur n'importe quoi : on annonce la couleur que le suivant devra jouer. Si on ne peut pas jouer, on pioche une carte. Si elle est jouable, on peut la poser tout de suite. Sinon, on passe." },
    { h: "Fin", p: "Le premier qui vide sa main gagne la donne. On peut compter les cartes restantes des autres, 50 pour un 8 et 10 pour une figure, et jouer jusqu'à 100." },
  ]),
  card("coeurs", "Les Cœurs", "4", "30 min", "On évite les cœurs, et surtout la dame de pique.", [
    { h: "Mise en place", p: "52 cartes, quatre joueurs, 13 cartes chacun. Avant le premier pli, chacun passe trois cartes à son voisin de gauche. À la donne suivante on passe à droite, puis en face, puis on ne passe rien, et on recommence." },
    { h: "Les plis", p: "Le joueur à gauche du donneur entame. On fournit la couleur si on peut. On ne peut pas entamer un cœur tant qu'un cœur n'a pas été joué sur un pli précédent, sauf si on n'a que des cœurs. La plus forte carte de la couleur demandée remporte le pli. Il n'y a pas d'atout." },
    { h: "Les points", p: "Chaque cœur pris dans ses plis vaut 1 point. La dame de pique vaut 13. Le but est d'en avoir le moins. Si un joueur ramasse tous les cœurs et la dame, il marque 0 et les trois autres marquent 26." },
    { h: "Fin", p: "On joue jusqu'à ce qu'un joueur atteigne ou dépasse 100. Le score le plus bas gagne." },
  ]),
  card("president", "Le Président", "3-7", "20 min", "On se débarrasse de ses cartes. Le rang de la manche suivante se joue maintenant.", [
    { h: "Mise en place", p: "52 cartes, distribuées une par une jusqu'à épuisement. Certains joueurs peuvent avoir une carte de plus : ils commencent. Les cartes se battent à rang égal, peu importe la couleur. L'as est le plus fort, le 2 est le plus faible, sauf la règle de la bombe ci-dessous." },
    { h: "Le tour", p: "Le premier pose une carte, une paire, un brelan ou un carré. Le suivant pose le même nombre de cartes, d'un rang strictement supérieur, ou passe. Quand tout le monde passe, le dernier à avoir posé repart comme il veut. Un 2 isolé ne bat pas un as : en revanche, un 2 posé seul efface le tas et rend la main à celui qui l'a joué." },
    { h: "Les rôles", p: "Le premier qui vide sa main devient président. Le dernier devient le trou. À la donne suivante, le trou donne sa meilleure carte au président et reçoit en échange la carte que le président veut bien lui laisser. On peut ajouter un vice-président et un vice-trou s'il y a assez de monde." },
  ]),
  card("tarot", "Le Tarot à quatre", "4", "40 min", "Un preneur contre trois, un chien, et trois bouts à chasser.", [
    { h: "Mise en place", p: "Jeu de 78 cartes. On donne 18 cartes à chacun et 6 au chien, face cachée. Chacun peut passer, prendre, garder ou garder sans le chien. Le plus haut contrat l'emporte. Le preneur joue seul contre les trois autres." },
    { h: "Le chien", p: "Sauf s'il garde sans, le preneur montre le chien, l'intègre à sa main et écarte 6 cartes face cachée. On ne peut pas écarter un bout ni un roi. Les cartes écartées comptent pour lui à la fin." },
    { h: "Les plis", p: "On doit fournir la couleur, puis surcouper si un atout est déjà sur le pli et qu'on peut. Les atouts vont du 1 au 21. L'excuse se joue à la place de n'importe quelle carte et revient à son camp, sauf si elle est jouée au dernier pli. Les trois bouts sont le 1, le 21 et l'excuse." },
    { h: "Fin de la donne", p: "Le preneur compte ses points de cartes. Il doit atteindre un contrat qui dépend du nombre de bouts qu'il possède : 56 avec trois bouts, 51 avec deux, 41 avec un, 36 sans. S'il réussit, il marque, sinon il chute et les défenseurs marquent. On joue un nombre de donnes convenu." },
  ]),
  card("whist", "Le Whist", "4", "30 min", "Quatre joueurs, un atout, treize plis, le partenaire en face.", [
    { h: "Mise en place", p: "52 cartes, 13 par joueur. La dernière carte du donneur est retournée : sa couleur est l'atout pour la donne. Le joueur à gauche du donneur entame." },
    { h: "Les plis", p: "On fournit la couleur demandée si on le peut. Sinon on peut couper ou jeter une autre couleur. L'atout l'emporte sur la couleur demandée. À hauteur égale, la première carte jouée de cette force gagne le pli. Il n'y a pas d'obligation de couper." },
    { h: "Le score", p: "Chaque camp compte ses plis. Les six premiers plis ne marquent rien : chaque pli au-dessus de six vaut 1 point. Le premier camp à 5 points gagne la partie. On peut convenir d'un autre total." },
  ]),
  card("menteur", "Le Menteur", "3-6", "15 min", "On annonce un rang, on pose face cachée, et quelqu'un peut crier menteur.", [
    { h: "Mise en place", p: "52 cartes, distribuées entièrement. Le joueur à gauche du donneur commence par les as, puis les deux, les trois, et ainsi de suite jusqu'aux rois, puis on revient aux as." },
    { h: "Le tour", p: "Le joueur dont c'est le rang annoncé pose une ou plusieurs cartes face cachée en disant combien il en pose de ce rang. Il peut dire vrai ou bluffer. Le suivant peut accepter et jouer le rang d'après, ou retourner le tas en criant menteur." },
    { h: "La contestation", p: "Si les cartes retournées correspondent exactement à l'annonce, le joueur qui a crié ramasse tout le tas. Sinon, c'est le joueur qui a menti qui le ramasse. Celui qui a crié juste repart, sur le rang suivant." },
    { h: "Fin", p: "Le premier qui vide sa main gagne. S'il pose ses dernières cartes et que personne ne le conteste, la manche s'arrête là." },
  ]),
  card("pouilleux", "Le Pouilleux", "3-6", "10 min", "On forme des paires. Celui qui garde le valet de pique a perdu.", [
    { h: "Mise en place", p: "52 cartes plus un joker, ou 51 cartes en retirant un valet autre que le valet de pique. On retire donc un valet rouge ou le valet de trèfle, pour qu'il reste un valet sans paire : le valet de pique, le pouilleux. On distribue tout." },
    { h: "Le tour", p: "Chacun pose devant lui, face visible, toutes les paires de même rang qu'il a en main. Puis il pioche une carte au hasard dans la main de son voisin de gauche, sans la voir choisir. S'il forme une paire, il la pose. Sinon la carte reste dans sa main." },
    { h: "Fin", p: "On continue jusqu'à ce qu'il ne reste plus que le valet de pique. Celui qui l'a en main a perdu. Les autres ont gagné ensemble." },
  ]),
  card("nain-jaune", "Le Nain jaune", "3-5", "20 min", "Cinq cartes spéciales, des mises au centre, et le droit de rejouer quand on pose la plus forte.", [
    { h: "Mise en place", p: "52 cartes. On place cinq mises au centre, une devant chaque symbole : le valet de carreau est le nain jaune, puis viennent le roi, la dame, le valet et le 10, toutes couleurs confondues pour ces quatre-là. Chacun reçoit autant de cartes que le permet un partage égal." },
    { h: "Le tour", p: "On joue une carte. Si elle est du même rang ou de la même couleur que la précédente, rien de spécial. Si on joue un rang supérieur dans la couleur demandée, on rejoue. Poser un des cinq symboles du centre ramasse la mise correspondante, à condition de l'avoir joué à son tour normal." },
    { h: "Le nain", p: "Le valet de carreau peut être posé sur n'importe quelle carte. Il fait ramasser la mise du nain et donne le droit de rejouer. Si un joueur termine avec le nain jaune encore en main, il paie une mise à tout le monde." },
    { h: "Fin", p: "Le premier qui n'a plus de carte ramasse ce qui reste au centre. On rejoue plusieurs donnes et on compte les jetons." },
  ]),
  card("barbu", "Le Barbu", "4", "40 min", "Sept contrats tournants. On fuit le roi de cœur, puis on chasse les plis.", [
    { h: "Mise en place", p: "52 cartes, quatre joueurs, 13 cartes chacun. Chacun sera tour à tour le meneur, et choisira dans l'ordre les contrats qui restent : pas de pli, pas de cœur, pas de dame, pas de roi de cœur, et trois contrats de plis, d'atout ou de dernière." },
    { h: "Sans le roi", p: "Au contrat « barbu », celui qui ramasse le roi de cœur dans un pli marque 20 points de pénalité. Aux contrats « pas de cœur », « pas de dame » et « pas de pli », chaque cœur, chaque dame ou chaque pli pris marque des points de pénalité." },
    { h: "Les contrats positifs", p: "Au contrat de plis, chaque pli marque 5 points pour celui qui le gagne. À l'atout, le meneur annonce la couleur, et chaque pli gagné marque aussi. Au dernier, seul le treizième pli marque, davantage." },
    { h: "Fin", p: "Quand chacun a mené les sept contrats, on additionne. Le score le plus haut gagne. Il n'y a pas d'équipe : chacun joue pour soi, et l'on doit fournir la couleur demandée." },
  ]),
  card("scopa", "La Scopa", "2-4", "20 min", "On capture au milieu les cartes dont la valeur égale celle qu'on pose.", [
    { h: "Mise en place", p: "Jeu italien de 40 cartes : on retire les 8, les 9 et les 10 d'un jeu de 52. Le valet vaut 8, la dame 9, le roi 10, l'as 1. On donne trois cartes à chacun et quatre cartes face visible au milieu." },
    { h: "Le tour", p: "On joue une carte. Si elle a la même valeur qu'une carte du milieu, on capture les deux. On peut aussi capturer plusieurs cartes dont la somme égale la carte jouée. S'il existe une capture, on doit la faire. Si on vide le milieu d'un coup, on annonce une scopa, qui vaut un point." },
    { h: "La donne", p: "Quand les mains sont vides, on redonne trois cartes, sans remettre de cartes au milieu. On épuise ainsi la pioche. Les dernières cartes du milieu vont à celui qui a capturé en dernier." },
    { h: "Fin", p: "On marque 1 point pour le plus de cartes, 1 pour le plus de carreaux, 1 pour le 7 de carreaux, 1 pour la meilleure prime (le plus de sept, puis de six), et 1 par scopa. Le premier à 11 gagne." },
  ]),
  card("briscola", "La Briscola", "2-4", "20 min", "L'atout est une carte retournée. On cherche les as, les trois et les figures.", [
    { h: "Mise en place", p: "40 cartes, comme à la scopa. On donne trois cartes à chacun. On retourne une carte : sa couleur est l'atout, et le reste du paquet est posé à moitié dessus. À quatre, on joue en deux équipes." },
    { h: "Le tour", p: "L'entame est libre. On n'est pas obligé de fournir la couleur ni de couper. La plus forte carte de la couleur demandée gagne, sauf si un atout a été joué : le plus fort atout gagne alors. Après chaque pli, chacun repioche une carte pour revenir à trois, le gagnant du pli d'abord. La carte d'atout retournée est piochée en dernier." },
    { h: "Les points", p: "As 11, trois 10, roi 4, dame 3, valet 2. Les autres cartes ne valent rien mais servent à gagner un pli. Il y a 120 points dans le jeu." },
    { h: "Fin", p: "Après le dernier pli, on compte. Plus de 60 points gagne. 60 partout, la donne est nulle." },
  ]),
  card("klondike", "La Réussite", "1", "15 min", "Sept colonnes, on construit en descendant et en alternant les couleurs.", [
    { h: "Mise en place", p: "52 cartes. Sept colonnes : une carte à la première, deux à la deuxième, jusqu'à sept à la dernière. Seule la dernière carte de chaque colonne est face visible. Le reste est la pioche. Quatre cases vides en haut attendent les as." },
    { h: "Les colonnes", p: "Sur une colonne, on pose une carte de couleur opposée et d'un rang immédiatement inférieur : un 6 rouge sur un 7 noir. On peut déplacer une suite déjà bien construite. Une case vide ne reçoit qu'un roi. Le talon se retourne trois cartes par trois. La carte visible du talon peut être jouée." },
    { h: "Les fondations", p: "Dès qu'un as est libre, on le monte dans une case. On empile ensuite la couleur en montant : as, 2, 3, jusqu'au roi." },
    { h: "Fin", p: "La réussite est faite quand les quatre couleurs sont montées jusqu'au roi. Si plus aucun mouvement n'existe, la donne est perdue. On peut s'autoriser à retourner le talon autant de fois qu'on veut." },
  ]),
  card("freecell", "La Cellule libre", "1", "15 min", "Toutes les cartes sont visibles. Quatre cases libres servent de réserve.", [
    { h: "Mise en place", p: "52 cartes, toutes face visible, réparties en huit colonnes : quatre colonnes de sept et quatre de six. Quatre cellules vides et quatre fondations attendent à côté. Il n'y a pas de pioche." },
    { h: "Les coups", p: "On déplace une carte visible vers une colonne, sur une carte de couleur opposée et d'un rang juste au-dessus. Une colonne vide accepte n'importe quelle carte. Une cellule libre ne garde qu'une seule carte, que l'on peut reprendre plus tard. On ne déplace une suite que si l'on a assez de cellules et de colonnes vides pour la porter carte par carte." },
    { h: "Les fondations", p: "Les as partent sur les fondations. On les recouvre ensuite dans l'ordre croissant, couleur par couleur, jusqu'aux rois." },
    { h: "Fin", p: "La partie est gagnée quand les quatre fondations sont complètes. Comme tout est visible, on peut défaire un coup si l'on s'est trompé : la mémoire n'est pas le sujet, le rangement l'est." },
  ]),
  card("gin", "Le Gin", "2", "20 min", "Dix cartes. On frappe quand les cartes hors combinaisons valent peu.", [
    { h: "Mise en place", p: "52 cartes. On donne 10 cartes à chacun. Le talon est face cachée, une carte ouvre la défausse. Une combinaison est un brelan, un carré, ou une suite d'au moins trois cartes de la même couleur." },
    { h: "Le tour", p: "Chacun pioche soit la défausse, soit le talon, puis défausse une carte. Les cartes qui ne sont dans aucune combinaison sont le bois mort. Leur valeur : les figures 10, l'as 1, les autres leur rang." },
    { h: "Frapper", p: "On peut frapper en défaussant si son bois mort, sans compter la carte que l'on jette, vaut 10 ou moins. L'adversaire montre alors sa main et peut ajouter ses cartes aux combinaisons de celui qui a frappé. S'il n'a plus de bois mort du tout au moment de frapper, c'est un gin." },
    { h: "Fin", p: "Si celui qui a frappé a le bois mort le plus léger, il marque la différence. S'il a le gin, il marque la différence plus 25. Si l'autre a autant ou moins, il marque la différence plus 25. Le premier à 100 gagne." },
  ]),
  card("piquet", "Le Piquet", "2", "30 min", "Trente-deux cartes, douze chacune, et des annonces avant les plis.", [
    { h: "Mise en place", p: "32 cartes, du 7 à l'as. On en donne 12 à chacun, par trois et deux, et on laisse 8 cartes au talon. L'aîné, celui qui n'a pas distribué, peut écarter jusqu'à 5 cartes et en reprendre autant au talon. Le plus jeune écarte ensuite, au plus autant qu'il reste de cartes." },
    { h: "Les annonces", p: "Avant de jouer, on compare trois choses, dans l'ordre : la plus longue suite de la même couleur, puis le plus fort brelan ou carré, puis le plus fort ensemble de cartes de la même couleur. En cas d'égalité de longueur, le rang le plus haut l'emporte. Seul le gagnant de chaque comparaison marque." },
    { h: "Les plis", p: "Il n'y a pas d'atout. On doit fournir la couleur et monter si on le peut. Chaque pli vaut 1 point, et le dernier pli en vaut un de plus. Faire les douze plis marque un bonus." },
    { h: "Fin", p: "On additionne annonces et plis. Si l'adversaire n'a rien marqué pendant que l'on atteint 30, la marque est doublée. On joue six donnes, en changeant le rôle d'aîné à chaque fois. Le total le plus haut gagne." },
  ]),

  play("lagon", "Lagon", "1", "3 min", "Une bille, deux raquettes. La tienne est en bas.", "lagon", "Déplace la raquette avec la souris, le doigt ou les flèches gauche et droite. Premier à 7."),
  play("quai", "Quai", "1", "5 min", "Des planches tombent. Une ligne pleine disparaît.", "quai", "Flèches gauche et droite pour déplacer, flèche haut pour tourner, flèche bas pour accélérer, espace pour poser d'un coup."),
  play("recif", "Récif", "1", "3 min", "Un poisson mange les perles et grandit. Les murs sont durs.", "recif", "Flèches pour tourner. Manger une perle allonge le poisson. Toucher un mur ou son propre corps arrête la partie."),
  play("bouees", "Bouées", "1", "2 min", "La bouée allumée s'éteint vite. Tape-la.", "bouees", "Clique ou touche la bouée qui s'allume. Vingt bonnes bouées, trois ratés maximum."),
  play("coquillages", "Coquillages", "1", "4 min", "Huit paires face cachée. La mémoire fait le reste.", "coquillages", "Retourne deux coquillages. S'ils vont ensemble, ils restent ouverts. Sinon ils se referment."),
  play("empile", "Empile", "1", "2 min", "Une caisse glisse. On la lâche quand elle est au-dessus de la pile.", "empile", "Espace, clic ou doigt pour lâcher la caisse. Seule la partie qui recouvre la précédente reste."),
  play("slalom", "Slalom", "1", "3 min", "Une barque descend le chenal et évite les bouées.", "slalom", "Souris, doigt ou flèches gauche et droite. Une bouée touchée arrête la descente."),
  play("bulles", "Bulles", "1", "2 min", "Les bulles montent. On les perce avant qu'elles ne s'échappent.", "bulles", "Clique les bulles. Trois bulles qui sortent par le haut terminent la partie."),
  play("cible", "Cible", "1", "1 min", "Dix tirs sur une cible qui ne tient pas en place.", "cible", "Clique pour tirer. Plus le tir est près du centre, plus il rapporte. Dix tirs en tout."),
  play("dedale", "Dédale", "1", "3 min", "Un couloir de digues. La sortie est en bas à droite.", "dedale", "Flèches pour avancer d'une case. Le temps tourne jusqu'à la sortie."),

  knot("arret", "Nœud d'arrêt", "Le plus petit nœud. Il empêche un cordage de filer dans un œil.", [
    { t: "Former une boucle", d: "Pose le cordage en U. Le brin qui travaille, le courant, passe par-dessus le brin qui ne bouge pas, le dormant.", svg: figure(rope("M30 90 C70 90 80 40 120 40", dormant) + rope("M120 40 C160 40 170 90 150 100", courant), "1") },
    { t: "Passer dans la boucle", d: "Fais entrer le courant dans la boucle, par-dessous, et ressors-le de quelques centimètres.", svg: figure(rope("M36 96 C78 96 92 48 128 48 C150 48 156 70 140 84", dormant) + rope("M140 84 C124 98 108 78 124 62", courant), "2") },
    { t: "Serrer", d: "Tire le courant et le dormant en même temps. Le nœud doit devenir un petit barillet régulier, pas une boule molle. Coupe l'excédent en laissant un centimètre.", svg: figure(rope("M40 70 H160", dormant) + `<circle cx="100" cy="70" r="16" fill="none" stroke="${courant}" stroke-width="8"/>`, "3") },
  ]),
  knot("plat", "Nœud plat", "Relie deux bouts de même grosseur. Il se défait sans s'être soudé.", [
    { t: "Premier passage", d: "Croise le brin droit par-dessus le brin gauche, puis ramène-le dans la boucle. Tu obtiens une demi-clé.", svg: figure(rope("M30 50 H170", "#c4554a") + rope("M30 90 H110 C130 90 130 50 150 50", courant), "1") },
    { t: "Deuxième passage, à l'envers", d: "Recommence dans l'autre sens : le brin qui est maintenant à droite passe par-dessus l'autre, puis dans la boucle. Droite sur gauche, puis gauche sur droite.", svg: figure(rope("M30 46 C70 46 80 94 120 94", "#c4554a") + rope("M30 94 C70 94 80 46 120 46", courant), "2") },
    { t: "Vérifier", d: "Chaque courant doit sortir du nœud du même côté que son propre dormant, parallèle à lui. Si les deux courants sortent en travers, c'est un nœud de vache : défais et recommence.", svg: figure(rope("M28 40 H78 M122 40 H172 M28 100 H78 M122 100 H172", dormant) + `<rect x="78" y="48" width="44" height="44" rx="8" fill="none" stroke="${courant}" stroke-width="8"/>`, "3") },
    { t: "Serrer", d: "Tire les quatre brins deux par deux. Le nœud plat sert à lier un paquet ou à joindre deux cordes légères. Ne l'utilise pas pour un effort violent : il peut glisser.", svg: figure(rope("M20 70 H70 M130 70 H180", dormant) + `<rect x="70" y="52" width="60" height="36" rx="8" fill="none" stroke="${courant}" stroke-width="8"/>`, "4") },
  ]),
  knot("chaise", "Nœud de chaise", "Une boucle fixe qui ne se serre pas autour de ce qu'elle entoure.", [
    { t: "Le puits", d: "Forme une petite boucle dans le dormant, le brin qui ira vers la charge. Le courant, le bout libre, arrive par-dessus cette boucle.", svg: figure(rope("M40 100 C40 40 90 30 90 70 C90 100 55 105 55 78", dormant) + rope("M120 110 C120 70 100 60 90 70", courant), "1") },
    { t: "Sortir du puits", d: "Passe le courant dans la boucle, de dessous vers dessus, et tire-le de la longueur de la boucle finale que tu veux.", svg: figure(rope("M48 104 C48 44 96 34 96 72 C96 104 58 108 58 80", dormant) + rope("M150 100 C120 100 108 88 100 74", courant), "2") },
    { t: "Faire le tour de l'arbre", d: "Passe le courant derrière le dormant, celui qui sort vers le bas, puis ramène-le devant.", svg: figure(rope("M150 108 V48", dormant) + rope("M70 90 C70 60 130 50 130 90 C130 112 90 112 90 90", courant), "3") },
    { t: "Rentrer par le même trou", d: "Réintroduis le courant dans la boucle, exactement par où il est sorti, le long de lui-même. Serre en tenant la boucle d'une main et en tirant le dormant de l'autre.", svg: figure(`<ellipse cx="100" cy="78" rx="36" ry="28" fill="none" stroke="${courant}" stroke-width="8"/>` + rope("M100 106 V128 M64 78 H28", dormant), "4") },
  ]),
  knot("noeud-huit", "Nœud en huit", "Un nœud d'arrêt plus sûr, facile à défaire, en forme de huit.", [
    { t: "Une boucle large", d: "Ramène le courant par-dessus le dormant pour dessiner une boucle plus grande que pour le nœud d'arrêt.", svg: figure(rope("M40 100 C40 40 150 40 150 80", dormant), "1") },
    { t: "Passer derrière", d: "Fais tourner le courant derrière le dormant, au-dessus du croisement.", svg: figure(rope("M36 104 C36 44 150 36 150 78", dormant) + rope("M150 78 C150 108 110 112 96 90", courant), "2") },
    { t: "Entrer dans la boucle", d: "Passe le courant dans la première boucle, dans le sens qui dessine un 8, et sors-le de quelques centimètres.", svg: figure(rope("M34 96 C34 40 150 34 154 74 C158 112 40 120 48 80", courant) + rope("M48 80 C56 50 90 48 96 70", "#c4554a"), "3") },
    { t: "Serrer en huit", d: "Tire progressivement. Tu dois voir deux boucles côte à côte, pas un nœud simple en boule. Laisse un petit bout libre.", svg: figure(rope("M30 70 H70", dormant) + `<path d="M78 70 C78 48 122 48 122 70 C122 92 78 92 78 70 C78 48 40 48 70 70" fill="none" stroke="${courant}" stroke-width="8"/>`, "4") },
  ]),
  knot("cabestan", "Nœud de cabestan", "Accroche vite une corde à un poteau, un anneau ou une barre.", [
    { t: "Premier tour", d: "Passe le courant autour du support, de l'avant vers l'arrière, et ramène-le devant en croisant le dormant.", svg: figure(`<rect x="88" y="24" width="24" height="92" rx="8" fill="#c4a574"/>` + rope("M24 46 H88 M112 46 C140 46 150 78 112 78", courant), "1") },
    { t: "Croiser", d: "Le courant passe par-dessus le dormant, bien à plat contre le support. Le croisement doit rester visible.", svg: figure(`<rect x="88" y="24" width="24" height="92" rx="8" fill="#c4a574"/>` + rope("M20 40 H100 M112 70 C150 70 150 40 112 40", courant), "2") },
    { t: "Deuxième tour", d: "Fais un second tour dans le même sens. Le courant passe sous la dernière spire en revenant devant.", svg: figure(`<rect x="88" y="24" width="24" height="92" rx="8" fill="#c4a574"/>` + rope("M18 36 H100 M112 36 C154 36 154 104 112 104", courant) + rope("M112 104 H70", "#c4554a"), "3") },
    { t: "Serrer sous charge", d: "Tire le dormant : les deux tours se plaquent. Pour un séjour long, ajoute deux demi-clés sur le dormant. Sans elles, un va-et-vient peut desserrer le cabestan.", svg: figure(`<rect x="88" y="30" width="24" height="80" rx="8" fill="#c4a574"/>` + rope("M112 42 C150 42 150 98 112 98", courant) + rope("M70 98 H112 M24 98 H70", dormant), "4") },
  ]),
  knot("ecoute", "Nœud d'écoute", "Joint deux cordages, même s'ils n'ont pas la même grosseur.", [
    { t: "La boucle du plus gros", d: "Avec le cordage le plus épais, forme une boucle fixe. Si les deux sont pareils, choisis-en un.", svg: figure(rope("M30 90 C30 40 110 40 110 78 C110 108 70 108 70 82", dormant), "1") },
    { t: "Entrer par-dessous", d: "Le cordage fin passe dans cette boucle, du dessous vers le dessus.", svg: figure(rope("M30 96 C30 46 112 44 112 80 C112 110 68 110 68 84", dormant) + rope("M150 108 C120 108 96 96 90 78", courant), "2") },
    { t: "Faire le tour des deux brins", d: "Le fin contourne les deux brins de la boucle, par derrière, et revient devant.", svg: figure(rope("M40 100 C40 48 120 46 120 82 C120 112 78 112 78 86", dormant) + rope("M160 70 C140 40 70 40 60 70 C50 100 90 112 120 96", courant), "3") },
    { t: "Se coincer sous lui-même", d: "Glisse le bout fin sous sa propre partie, celle qui entre dans la boucle, sans le faire passer dans la boucle une seconde fois. Tire les deux dormants. Le fin doit être pincé.", svg: figure(rope("M36 92 C36 48 108 46 108 80 C108 108 72 108 72 84", dormant) + rope("M150 60 C120 48 86 58 86 78 C86 98 112 98 112 82", courant), "4") },
  ]),
  knot("demi-cles", "Deux demi-clés", "Fini un amarrage après un tour mort autour d'un point fixe.", [
    { t: "Un tour mort", d: "Enroule d'abord le cordage une fois autour du point d'amarrage, sans croiser. Ce tour prend déjà une partie de la charge.", svg: figure(`<circle cx="70" cy="70" r="22" fill="#c4a574"/>` + rope("M92 70 H170", courant), "1") },
    { t: "Première demi-clé", d: "Ramène le courant sur le dormant, fais-lui faire un tour, et passe-le dans la boucle ainsi formée. Serre-la contre le point fixe.", svg: figure(`<circle cx="64" cy="70" r="20" fill="#c4a574"/>` + rope("M84 70 H150", dormant) + rope("M130 70 C130 48 108 48 108 70 C108 92 130 92 130 70", courant), "2") },
    { t: "Deuxième demi-clé", d: "Recommence la même demi-clé, dans le même sens, un peu plus loin sur le dormant. Les deux boucles se suivent comme deux anneaux.", svg: figure(rope("M24 70 H150", dormant) + rope("M70 70 C70 50 96 50 96 70 C96 90 70 90 70 70", courant) + rope("M112 70 C112 50 138 50 138 70 C138 90 112 90 112 70", courant), "3") },
    { t: "Serrer", d: "Tire le courant, puis le dormant. Les deux demi-clés seules ne portent pas une charge : elles verrouillent un tour déjà pris autour de l'anneau ou du poteau.", svg: figure(`<circle cx="46" cy="70" r="16" fill="#c4a574"/>` + rope("M62 70 H170", dormant) + rope("M86 70 C86 54 108 54 108 70 C108 86 86 86 86 70 M124 70 C124 54 146 54 146 70 C146 86 124 86 124 70", courant), "4") },
  ]),
  knot("pecheur", "Nœud de pêcheur", "Deux nœuds d'arrêt face à face. Ils se rapprochent quand on tire.", [
    { t: "Mettre les bouts en regard", d: "Pose les deux cordages l'un contre l'autre, sur une dizaine de centimètres, les bouts pointant dans des sens opposés.", svg: figure(rope("M20 58 H140", "#c4554a") + rope("M60 86 H180", courant), "1") },
    { t: "Nœud simple du premier", d: "Avec le bout du premier cordage, fais un nœud d'arrêt autour du second. Ne le serre pas encore à fond.", svg: figure(rope("M20 70 H170", dormant) + rope("M120 70 C120 46 86 46 86 70 C86 94 120 94 120 74", courant), "2") },
    { t: "Nœud simple du second", d: "Avec l'autre bout, fais le même nœud d'arrêt autour du premier cordage. Les deux nœuds se regardent.", svg: figure(rope("M16 70 H184", dormant) + rope("M70 70 C70 48 98 48 98 70 C98 92 70 92 70 70", "#c4554a") + rope("M130 70 C130 48 158 48 158 70 C158 92 130 92 130 70", courant), "3") },
    { t: "Tirer les dormants", d: "Tire les deux longs brins. Les nœuds glissent l'un vers l'autre et se bloquent. Pour un effort plus fort, fais deux tours dans chaque nœud d'arrêt : c'est le pêcheur double.", svg: figure(rope("M16 70 H70 M130 70 H184", dormant) + `<circle cx="88" cy="70" r="14" fill="none" stroke="#c4554a" stroke-width="8"/><circle cx="112" cy="70" r="14" fill="none" stroke="${courant}" stroke-width="8"/>`, "4") },
  ]),
  knot("prussik", "Nœud de Prusik", "Une anneau de cordelette qui bloque sur une corde plus grosse quand on le charge.", [
    { t: "Présenter l'anneau", d: "Ferme d'abord la cordelette en boucle avec un nœud de pêcheur double. Ouvre cette boucle derrière la corde principale.", svg: figure(rope("M100 16 V124", dormant) + rope("M70 40 C40 40 40 100 70 100", courant), "1") },
    { t: "Deux tours", d: "Passe toute la boucle autour de la corde, deux fois. Les tours sont propres, côte à côte, sans se chevaucher.", svg: figure(rope("M100 16 V124", dormant) + rope("M78 46 H122 M78 62 H122 M78 78 H122", courant), "2") },
    { t: "Sortir la boucle", d: "Passe le reste de l'anneau dans la boucle qui dépasse. C'est par là que l'on portera la charge.", svg: figure(rope("M100 16 V124", dormant) + rope("M76 50 H124 M76 68 H124", courant) + rope("M100 86 C70 86 60 112 100 112 C140 112 130 86 100 86", courant), "3") },
    { t: "Essayer", d: "Charge l'anneau vers le bas : il doit serrer et ne plus glisser. Relâche-le et pousse-le avec la main : il doit coulisser. S'il glisse sous charge, ajoute un troisième tour.", svg: figure(rope("M100 12 V128", dormant) + rope("M82 48 H118 M82 62 H118 M82 76 H118", courant) + rope("M100 96 V128", "#c4554a"), "4") },
  ]),
  knot("bois", "Nœud de bois", "Serre un rondin ou un rouleau dans le sens de sa longueur pour le tirer.", [
    { t: "Passer sous la pièce", d: "Glisse le courant sous le rondin, ou autour de l'objet, et ramène-le vers le dormant.", svg: figure(`<rect x="40" y="48" width="120" height="28" rx="14" fill="#c4a574"/>` + rope("M24 90 C40 90 40 76 70 76", courant), "1") },
    { t: "Croiser le dormant", d: "Passe le courant par-dessus le rondin puis sous le dormant, de façon à faire un demi-tour qui tient déjà un peu.", svg: figure(`<rect x="36" y="46" width="128" height="30" rx="15" fill="#c4a574"/>` + rope("M20 100 H90 C110 100 120 70 100 62", courant), "2") },
    { t: "Trois tours sur lui-même", d: "Enroule le courant au moins trois fois autour de sa propre partie, le long du rondin, pas autour du rondin. Les tours vont vers le bout de la pièce.", svg: figure(`<rect x="30" y="50" width="140" height="26" rx="13" fill="#c4a574"/>` + rope("M24 96 H70", dormant) + rope("M70 96 C78 78 96 78 104 96 C112 78 128 78 136 96 C144 78 156 78 164 96", courant), "3") },
    { t: "Charger dans l'axe", d: "Tire le dormant dans l'axe du rondin. Plus tu tires, plus les tours serrent. Ce nœud se défait dès que la charge disparaît : ne l'emploie pas pour suspendre quelque chose au-dessus de quelqu'un.", svg: figure(`<rect x="24" y="58" width="120" height="24" rx="12" fill="#c4a574"/>` + rope("M144 70 H184", dormant) + rope("M40 70 H90", courant), "4") },
  ]),
];

export function themeOf(id) {
  return themes.find((theme) => theme.id === id);
}
