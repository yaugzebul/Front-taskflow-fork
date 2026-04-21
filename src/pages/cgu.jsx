import React from 'react';
import { exportToPdf } from '../components/tools/exportPdf';


const Cgu = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div id="page" className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-100">

                <header className="mb-10 border-b border-gray-100 pb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Conditions Générales d'Utilisation
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Dernière mise à jour : 24 juillet 2024
                    </p>
                </header>

                <div className="space-y-8 text-gray-700 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                            Objet du service
                        </h2>
                        <p>
                            L'application <span className="font-semibold text-blue-600">TaskFlow</span> est une plateforme de gestion de projet type Kanban. Elle permet de créer, organiser et suivre des tâches de manière collaborative ou individuelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                            Données Personnelles (RGPD)
                        </h2>
                        <p className="mb-2">
                            Conformément au RGPD, nous collectons uniquement les données nécessaires au bon fonctionnement de votre compte :
                        </p>
                        <ul className="list-disc ml-10 space-y-1">
                            <li>Nom et Prénom</li>
                            <li>Adresse email (pour l'authentification)</li>
                            <li>Données de projets et tâches</li>
                        </ul>
                        <p className="mt-3 italic text-sm text-gray-500 border-l-4 border-gray-200 pl-4">
                            Vous pouvez demander la suppression de votre compte et de toutes vos données en nous contactant directement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                            Responsabilité
                        </h2>
                        <p>
                            TaskFlow est fourni "en l'état" dans le cadre d'un projet de formation. Bien que nous fassions de notre mieux pour assurer la stabilité, nous ne pouvons être tenus responsables d'une éventuelle perte de données ou d'une interruption de service.
                        </p>
                    </section>

                </div>

                <footer className="mt-12 pt-6 border-t border-gray-100 text-center">
                    <button onClick={() => exportToPdf('page', 'cgu-taskflow')} className="text-sm text-blue-600 hover:underline font-medium">
                        Imprimer ou télécharger en PDF
                    </button>
                </footer>

            </div>
        </div>
    );
};

export default Cgu;
