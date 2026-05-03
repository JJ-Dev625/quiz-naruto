/**
 * ARCHITECTURE DU QUIZ NARUTO PRO
 * État final optimisé
 */

// ==========================================
// 1. DONNÉES DU QUIZ
// ==========================================
const questions = [
    { question: "Iwa appartient à quel pays ?", options: ["Foudre", "Eau", "Feu", "Terre"], reponse: 3 },
    { question: "À qui attribue-t-on le nom de ...de sable rouge ?", options: ["Kakashi", "Danzo", "Sasori", "Killer Bee"], reponse: 2 },
    { question: "Qui est l'héritier du Sharingan ?", options: ["Madara", "Shisui", "Sasuke", "Itachi"], reponse: 3 },
    { question: "Qui est le maître du 4e Hokage ?", options: ["Hashirama", "Tobirama", "Kurama", "Jiraya"], reponse: 3 },
    { question: "De quelle couleur sont les cheveux des Uzumaki ?", options: ["Rouge", "Jaune", "Noir", "Bleu"], reponse: 0 },
    { question: "Quel est le nom du biju à dix queues ?", options: ["Hachibi", "Matatabi", "Jubi", "Kyubi"], reponse: 2 },
    { question: "Quel Village est dit de la 'Brume Sanglante' ?", options: ["Kiri", "Konoha", "Suna", "Kumo"], reponse: 0 },
    { question: "Combien de fois Konoha a-t-il été détruit ?", options: ["5 fois", "3 fois", "2 fois", "7 fois"], reponse: 2 },
    { question: "Quel est le nom du Kage du village de l’eau ?", options: ["Hokage", "Raikage", "Mizukage", "Kazekage"], reponse: 2 },
    { question: "Lequel de ces livres de Jiraya a eu du succès ?", options: ["Le Roman de Jiraya", "Récits Héroïques", "La légende de Naruto", "Le paradis du Batifolage"], reponse: 3 }
];

// ==========================================
// 2. ÉTAT DU JEU (Variables de contrôle)
// ==========================================
let score = 0;
let qIndex = 0;
let timerInterval;
let musiqueLancee = false;

// ==========================================
// 3. SÉLECTEURS D'ÉLÉMENTS
// ==========================================
const questionEl = document.getElementById('question');
const btns = document.querySelectorAll('.option-btn');
const progressEl = document.getElementById('progress');
const timerEl = document.getElementById('timer-fill');
const scoreEl = document.getElementById('score');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');

// ==========================================
// 4. MOTEUR DU TIMER (Temps Akatsuki)
// ==========================================
function gererTimer() {
    let temps = 10;
    clearInterval(timerInterval);
    
    // Reset de l'animation CSS
    timerEl.style.transition = "none";
    timerEl.style.width = "100%";
    
    // Déclenchement de la réduction visuelle
    setTimeout(() => {
        timerEl.style.transition = "width 10s linear";
        timerEl.style.width = "0%";
    }, 50);

    // Calcul du temps en arrière-plan
    timerInterval = setInterval(() => {
        temps--;
        if (temps <= 0) {
            clearInterval(timerInterval);
            passerSuivante();
        }
    }, 1000);
}

// ==========================================
// 5. MOTEUR DES QUESTIONS
// ==========================================
function chargerQuestion() {
    if (qIndex >= questions.length) {
        return afficherFin();
    }
    
    const q = questions[qIndex];
    questionEl.innerText = q.question;
    
    // Mise à jour de la barre de progression (orangée)
    progressEl.style.width = (qIndex / questions.length * 100) + "%";

    // Réinitialisation des boutons
    btns.forEach((btn, i) => {
        btn.innerText = q.options[i];
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
        btn.disabled = false;
    });
    
    gererTimer();
}

function passerSuivante() {
    qIndex++;
    chargerQuestion();
}

// ==========================================
// 6. GESTION DES INTERACTIONS (Actions)
// ==========================================

// Clic sur une option de réponse
btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        // Lancer la musique au premier clic de l'utilisateur
        if (!musiqueLancee && bgMusic) {
            bgMusic.play().catch(e => console.log("Audio en attente..."));
            musiqueLancee = true;
        }

        clearInterval(timerInterval);
        btns.forEach(b => b.disabled = true);

        const bonneReponse = questions[qIndex].reponse;
        if (i === bonneReponse) {
            score++;
            scoreEl.innerText = score;
            btn.style.backgroundColor = "#27ae60"; // Vert Konoha
            btn.style.color = "white";
        } else {
            btn.style.backgroundColor = "#e74c3c"; // Rouge Akatsuki
            btn.style.color = "white";
            // Montrer visuellement la bonne réponse
            btns[bonneReponse].style.backgroundColor = "#27ae60";
            btns[bonneReponse].style.color = "white";
        }

        setTimeout(passerSuivante, 1000);
    });
});

// Bouton Mute (Activer/Désactiver le son)
muteBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        muteBtn.innerText = "🔊";
    } else {
        bgMusic.pause();
        muteBtn.innerText = "🔇";
    }
});

// ==========================================
// 7. FIN DE PARTIE (Résultats)
// ==========================================
function afficherFin() {
    // A. ARRÊTS NETS (Timer et Musique)
    clearInterval(timerInterval);
    timerEl.style.transition = "none"; // Coupe l'animation CSS Akatsuki
    timerEl.style.width = "0%";
    
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0; // Remise à zéro pour la prochaine partie
    }

    // B. PROGRESSION FINALE (Force le 100%)
    progressEl.style.width = "100%";

    // C. AFFICHAGE DE LA CARTE DE SCORE
    const message = score >= 7 ? "Félicitations ! Vous êtes un Chûnin maintenant !" : "Échec... Vous restez un Genin !";

    document.getElementById('quiz-box').innerHTML = `
        <div class="final-card">
            <h2>${message}</h2>
            <p style="margin: 20px 0; font-size: 1.3rem;">Score Final : <strong>${score} / 10</strong></p>
            <button onclick="location.reload()" class="option-btn" style="width:100%; background:#ff9800; color:white; border:none;">
                Recommencer l'examen
            </button>
        </div>`;
}

// Lancement initial du Quiz
chargerQuestion();