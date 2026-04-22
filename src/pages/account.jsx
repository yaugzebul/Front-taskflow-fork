import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { User, Mail, Lock, Bell, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexte/AuthContext';

const Account = () => {
    const { user } = useAuth();

    // Fonction de soumission fictive
    const handleSave = (e) => {
        e.preventDefault();
        alert("Ceci est une page de démonstration. Les modifications ne sont pas sauvegardées.");
    };

    // Extraction des valeurs de façon sûre sans warning de linting excessif
    let firstName = "Utilisateur";
    let lastName = "Test";
    let userEmail = "test@example.com";

    if (user) {
        if (user.user_first_name || user.prenom) firstName = user.user_first_name || user.prenom;
        if (user.user_name || user.nom) lastName = user.user_name || user.nom;
        if (user.user_email || user.email) userEmail = user.user_email || user.email;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            
            {/* --- SIDEBAR GAUCHE --- */}
            <Sidebar projects={[]} />

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* --- HEADER --- */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center sticky top-0 z-10 shadow-sm">
                    <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                        Mon Compte
                    </h1>
                </header>

                {/* --- ZONE DÉFILANTE --- */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Carte Profil */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <User className="text-amber-500" size={20} />
                                <h2 className="text-lg font-bold text-slate-800 font-raleway">Informations Personnelles</h2>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Prénom</label>
                                            <input 
                                                type="text" 
                                                defaultValue={firstName} 
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Nom</label>
                                            <input 
                                                type="text" 
                                                defaultValue={lastName} 
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Mail size={16} className="text-slate-400"/> Adresse e-mail
                                            </label>
                                            <input 
                                                type="email" 
                                                defaultValue={userEmail}
                                                className="w-full px-4 py-2 border border-slate-300 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed outline-none"
                                                disabled
                                            />
                                            <p className="text-xs text-slate-500">L'adresse e-mail ne peut pas être modifiée ici.</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="amber">Sauvegarder les modifications</Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Carte Sécurité */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <Shield className="text-amber-500" size={20} />
                                <h2 className="text-lg font-bold text-slate-800 font-raleway">Sécurité</h2>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2 max-w-md">
                                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Lock size={16} className="text-slate-400"/> Mot de passe actuel
                                            </label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2 max-w-md">
                                            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <Button type="submit" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">Mettre à jour le mot de passe</Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Carte Notifications (Optionnel) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                                <Bell className="text-amber-500" size={20} />
                                <h2 className="text-lg font-bold text-slate-800 font-raleway">Préférences</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-slate-800">Notifications par e-mail</h3>
                                        <p className="text-sm text-slate-500">Recevoir des alertes pour les tâches assignées.</p>
                                    </div>
                                    {/* Un faux toggle switch pour le design */}
                                    <div className="w-11 h-6 bg-amber-500 rounded-full relative cursor-pointer" onClick={handleSave}>
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Account;