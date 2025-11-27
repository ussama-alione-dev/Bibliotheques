const prompt = require("prompt-sync")();

let livres = [];
let abonnes = [];
let emprunts = [];

// ------------------------ gestion des livres
const ajouterLivres = () => {
  const nombres_livres = Number(
    prompt("Entrez le nombre de livres que vous souhaitez ajouter : ")
  );

  for (let ndx = 0; ndx < nombres_livres; ndx++) {
    const livre = {
      id_livre: crypto.randomUUID(),
      titre: prompt(`entrer le titre du livre ${ndx + 1} : `),
      auteur: prompt("entrer le nom d'autuer  : "),
      annee_de_publication: Number(prompt("entrer l'annee de publication : ")),
      disponible: true,
    };

    livres.push(livre);
  }
};

const afficherLivres = () => {
  console.table(livres);
};

const trierLivres = (variant) => {
  if (variant === "titre") {
    const direction = prompt("ascendant ou  descendant : ");
    direction === "ascendant"
      ? livres.sort((a, b) => b.titre.localeCompare(a.titre))
      : livres.sort((a, b) => b.titre.localeCompare(a.titre)).reverse();
    afficherLivres();
  }
  if (variant === "année") {
    livres.sort((a, b) => a.annee_de_publication - b.annee_de_publication);
    afficherLivres();
  }
};

const afficherLivresDisponibles = () => {
  console.table(livres.filter((livre) => livre.disponible));
};

const rechercherParId = () => {
  const id = prompt("Donne-moi l’ID du livre que tu cherches : ");

  const livre = livres.find((element) => element.id_livre === id);
  if (!livre) {
    console.log(" aucun livre trouvé ! ");
  } else {
    console.table(livre);
  }
};

// ------------------------ gestion des abonne
const ajouterAbonnee = () => {
  const abonne = {
    id: crypto.randomUUID(),
    nom: prompt("entrer le nom : "),
    prenom: prompt("entrer le prenom : "),
    email: prompt("entrer l'email : "),
    historic_emprunts: [],
  };
  abonnes.push(abonne);
};

const afficherAbonnee = () => {
  console.table(abonnes);
};

// --------------------- gestion des enprunt

const enregisterEmprunt = (abonneId, Livre) => {
  livres = livres.map((livre) =>
    livre.id_livre === Livre.id_livre ? { ...livre, disponible: false } : livre
  );
  abonnes = abonnes.map((abonne) =>
    abonne.id === abonneId
      ? {
          ...abonne,
          historic_emprunts: [...abonne.historic_emprunts, Livre],
        }
      : abonne
  );
  emprunts.push({
    abonneId,
    id_livre: Livre,
    dateEmprunt: new Date(Date.now()).toLocaleDateString("fr-FR"),
  });
};
const nouveauEmprunt = () => {
  const titre_livre = prompt(
    "Saisis le titre du livre auquel tu veux faire un emprunt : "
  );

  const Livre = livres.find((livre) => livre.titre === titre_livre);

  if (!Livre) {
    console.log("aucun livre trouvee");
  } else if (!Livre.disponible) {
    console.log("Ce livre est déjà emprunté : ");
  } else {
    const email_abonnee = prompt(
      "Saisis l’email de l’abonné qui veut faire un emprunt : "
    );

    const isAbonnee = abonnes.find((abonne) => abonne.email === email_abonnee);

    if (!isAbonnee) {
      console.log(
        "Cet email n’existe pas, merci d’enregistrer cet abonné d’abord avant de pouvoir effectuer un emprunt"
      );
      ajouterAbonnee();
      nouveauEmprunt();
    } else {
      enregisterEmprunt(isAbonnee.id, Livre);
    }
  }
};

const enregistrerRetour = () => {
  const livre_id = prompt("livre id : ");
  const livre = livres.find((l) => l.id_livre === livre_id);

  if (!livre) {
    console.log("Livre introuvable");
    return;
  }

  livre.disponible = true;

  console.table(abonnes);
  abonnes = abonnes.map((abonne) =>
    abonne.historic_emprunts.some((el) => el.id_livre === livre.id_livre)
      ? {
          ...abonne,
          historic_emprunts: abonne.historic_emprunts.filter(
            (el) => el.id_livre !== livre.id_livre
          ),
        }
      : abonne
  );
};

const afficherLivresEmprunte = () => {
  const email = prompt("etrer l'email d'abonnee : ");

  const abonne = abonnes.find((element) => element.email === email);
  if (!abonne) {
    console.log("abonnee n'exist pas !");
    return;
  }

  !abonne.historic_emprunts.length
    ? console.log("Cet abonné n’a emprunté aucun livre.")
    : abonne.historic_emprunts.forEach((el, ndx) =>
        console.log(`livre ${ndx + 1} : ${el.titre}`)
      );
};

const menu = `
<<<<<<<<<<<< 📚 >>>>>>>>>>>>>


  * Opérations sur les livres :
    1  ○ Ajouter des livres
    2  ○ Afficher tous les livres
    3  ○ Trier les livres par titre (ascendant/descendant)
    4  ○ Trier les livres par année de publication
    5  ○ Afficher uniquement les livres disponibles
    6  ○ Rechercher un livre par ID_livre
  * Gestion des abonnés : 
    7  ○ Ajouter un abonné (ID, Nom, Prénom, Email)
    8  ○ Afficher tous les abonnés
  * Gestion des abonnés : 
    9  ○ Enregistrer un emprunt
    10 ○ Enregistrer un retour 
    11 ○ Afficher les livres empruntés par un abonné donné.

  0 -> quitter 
`;

while (true) {
  console.log(menu);
  const operation = Number(prompt("choisi une operation : "));

  if (operation === 0) {
    break;
  }

  switch (operation) {
    case 1:
      ajouterLivres();
      break;
    case 2:
      afficherLivres();
      break;
    case 3:
      trierLivres("titre");
      break;
    case 4:
      trierLivres("annee");
      break;
    case 5:
      afficherLivresDisponibles();
      break;
    case 6:
      rechercherParId();
      break;
    case 7:
      ajouterAbonnee();
      break;
    case 8:
      afficherAbonnee();
      break;
    case 9:
      nouveauEmprunt();
      break;
    case 10:
      enregistrerRetour();
      break;
    case 11:
      afficherLivresEmprunte();
      break;
    default:
      console.log("operation no valide ! ");
      break;
  }
}
