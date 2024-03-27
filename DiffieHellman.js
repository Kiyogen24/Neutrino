
// Programme création d'une clé pour une discussion selon la méthode de Diffie-Hellman

import React, { useState } from 'react';

// Fonction pour calculer le modulo (g^a modulo p)
function Modulo_Calculator(a, p, g) {
  return Math.pow(g, a) % p;
}

function DiffieHellman() {
  // Paramètres p et g définis à l'avance
  const p = 23;
  const g = 5;

  // Variables , stockages des valeurs pour les deux clients A et B (alice et bob t'as vu la ref ouuu)
  const [userA, setUserA] = useState('');
  const [userB, setUserB] = useState('');
  const [sharedKeyA, setSharedKeyA] = useState('');
  const [sharedKeyB, setSharedKeyB] = useState('');
  const [clecommuneA, setA] = useState('');
  const [clecommuneB, setB] = useState('');


  const cle_partage = (userInput, setSharedKey) => {
    const a = parseInt(userInput); // Convertir la valeur entrée en nombre entier
    const sharedKey = Modulo_Calculator(a, p, g);
    setSharedKey(sharedKey);
  };

  // premier echange
  cle_partage(userA,setSharedKeyA);
  cle_partage(userB, setSharedKeyB);
  
  // second echange
  const common_key = cle_partage(clecommuneA,setA);
  cle_partage(clecommuneB, setB);



  return (common_key);
}

export default DiffieHellman;




/* Pour pouvoir intégrer le fonction DiffieHellman dans le fichier ChatContainer.js et donc utiliser la fonction pour générer la clé commune aux deux clients

import DiffieHellman from './DiffieHellman';


*/