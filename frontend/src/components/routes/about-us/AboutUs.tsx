import React from 'react';

/**
 * AboutUs component
 * @returns {jsx}
 */
const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-brand mb-2">A propos</h1>
      <p className="text-lg mb-8">
       Bienvenue sur le site <span className='text-brand' > STAY BOOKER</span>, où nous nous engageons à vous offrir
        la meilleure expérience de réservation d'hôtels dans le monde entier. Notre 
        mission est de rendre votre voyage confortable, pratique et mémorable.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Notre Vision</h2>
      <p className="text-lg mb-8">
      Chez <span className='text-blue-600"' >STAY BOOKER</span>, nous imaginons un monde où chaque voyageur trouve l'hébergement parfait qui correspond à ses 
      besoins et à ses préférences. Notre objectif est de simplifier le processus de réservation d'hôtel, en proposant 
      un large éventail d'options pour tous les budgets.
      </p>

      <h2 className="text-3xl font-extrabold text-brand mb-2">
      Pourquoi nous choisir ?
      </h2>
      <ul className="list-disc ml-6 mb-8">
        <li className="text-lg mb-3">
        Nous proposons une gamme variée d'hôtels, des complexes de luxe aux séjours de charme,
        ce qui vous permet de trouver l'hôtel qui correspond à votre  style de voyage.
        </li>
        <li className="text-lg mb-3">
        Notre interface conviviale rend la réservation de votre séjour idéal simple et rapide. 
        En quelques clics, vous pouvez sécuriser votre réservation sans souci.
        </li>
        <li className="text-lg mb-3">
        Notre équipe d'assistance à la clientèle est disponible 24 heures sur 24, 7 jours sur 7,
         pour vous aider à répondre à  pour toute question ou problème que vous pourriez rencontrer
        au cours du processus  de réservation ou de votre séjour.
        </li>
        <li className="text-lg mb-3">
        Nous accordons la priorité à la sécurité de vos informations personnelles et de vos transaction.
         Réservez en toute confiance, sachant que vos données sont en sécurité chez nous.
        </li>
      </ul>

      <h2 className="text-3xl font-extrabold text-brand mb-2">Contactez-nous</h2>
      <p className="text-lg mb-4">
      Vous avez des questions ou besoin d'aide ? N'hésitez pas à contacter
       notre équipe d'assistance à la clientèle au{' '}
        <a
          className="text-brand hover:underline"
          href="mailto:info@staybooker.com"
        >
          gemsbossou@gmail.com
        </a>
        .  Nous sommes là pour vous aider !
      </p>
      <p className="text-lg">
      Merci d'avoir choisi <span className="text-brand">STAY BOOKER</span>.
      Nous nous réjouissons d'être votre plateforme de référence pour tous vos besoins de d'hôtel.
      </p>
    </div>
  );
};

export default AboutUs;
