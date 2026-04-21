import React from 'react';
import { exportToPdf } from '../components/tools/exportPdf';


const Legal = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div id="page" className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl p-8 border border-gray-100">

                <header className="mb-10 border-b border-gray-100 pb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Mentions Légales
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Dernière mise à jour : 24 juillet 2024
                    </p>
                </header>

                <div className="space-y-8 text-gray-700 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                            Éditeur du site
                        </h2>
                        <p>
                            Le site TaskFlow est édité par :
                        </p>
                        <ul className="list-disc ml-10 space-y-1">
                            <li>Nom/Prénom : Mamadou Baradji</li>
                            <li>Statut : Développeur en formation / Projet d'études</li>
                            <li>Contact : mamadou.baradji@epitech.eu</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                            Hébergement
                        </h2>
                        <p>
                            Le site est hébergé par :
                        </p>
                        <ul className="list-disc ml-10 space-y-1">
                            <li>Hébergeur : Vercel</li>
                            <li>Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                            Propriété Intellectuelle
                        </h2>
                        <p>
                            L'ensemble de ce site (code, design, logo) est la propriété exclusive de TaskFlow. Toute reproduction, même partielle, est interdite sans accord préalable.
                        </p>
                    </section>

                </div>

                <footer className="mt-12 pt-6 border-t border-gray-100 text-center">
                    <button onClick={() => exportToPdf('page', 'mentions-legales-taskflow')} className="text-sm text-blue-600 hover:underline font-medium">
                        Imprimer ou télécharger en PDF
                    </button>
                </footer>

            </div>
        </div>
    );
};

export default Legal;
