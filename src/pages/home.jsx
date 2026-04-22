import Footer from '/src/components/footer/footer.jsx';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexte/AuthContext';
// On renomme l'import pour ne pas confondre avec la fonction login de AuthContext
import { login as loginService } from '../services/authService'; 
import { toast } from 'sonner';

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth(); // login du contexte pour mettre à jour l'état global
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Veuillez remplir tous les champs.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Appel à la vraie API via le service (qui fait le fetch POST)
            const responseData = await loginService(email, password);
            
            // 2. Si succès, on passe les données utilisateur au contexte d'authentification
            // L'API renvoie { message: 'Connexion réussie', user: { id_user, user_email, user_first_name, user_name } }
            const userData = responseData.user || { email }; 
            login(userData); // Met à jour 'isAuthenticated' à true dans ProtectedRoute
            
            toast.success("Connexion réussie !");
            
            // 3. Redirection vers le dashboard
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.message || "Identifiants incorrects.");
            console.error("Échec de la connexion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-10 h-screen">
                    
                    {/* Colonne de Gauche (30%) Contenu & Formulaire */}
                    <div className="col-span-1 md:col-span-3 bg-tf-dark-bg text-amber-50 p-8 flex flex-col justify-center ">
                        <div className="max-w-sm mx-auto w-full space-y-8">
                            
                            {/* En-tête (Logo + Titre) */}
                            <div>
                                <img className="w-80 mb-12" src="/images/logo-taskflow.svg" alt="logo taskflow" />
                                <h1 className="text-4xl font-raleway font-bold text-amber-300 mb-4">Bon retour !</h1>
                                <p className="text-tf-text-light font-merriweather">
                                    Connectez-vous pour accéder à votre tableau de bord.
                                </p>
                            </div>

                            {/* Formulaire de Connexion */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-amber-50" htmlFor="email">
                                        Adresse e-mail
                                    </label>
                                    <input 
                                        id="email"
                                        type="email" 
                                        placeholder="nom@exemple.com"
                                        className="w-full px-4 py-3 rounded-lg  border border-slate-700 text-tf-dark-bg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-amber-50" htmlFor="password">
                                            Mot de passe
                                        </label>
                                        <a href="#" className="text-xs text-amber-300 hover:text-amber-200 transition-colors">
                                            Mot de passe oublié ?
                                        </a>
                                    </div>
                                    <input 
                                        id="password"
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-700 text-tf-dark-bg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Utilisation du Button Shadcn avec la variante amber */}
                                <Button 
                                    type="submit"
                                    variant="amber"
                                    className="w-full py-3 px-4 shadow-lg shadow-amber-500/20"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                                </Button>
                            </form>

                            {/* Lien Inscription */}
                            <p className="text-center text-sm text-tf-text-light pt-4">
                                Pas encore de compte ?{' '}
                                <Link to="/register" className="text-amber-300 hover:text-amber-200 font-medium hover:underline transition-all">
                                    S'inscrire
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Colonne de Droite (70%) Image d'illustration en plein écran */}
                    <div className="hidden md:block col-span-7 relative h-full">
                        {/* L'image de fond */}
                        <img 
                            src="/images/hero-home.svg" 
                            alt="Illustration Hero"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        {/* Conteneur pour le texte superposé (aligné en bas à gauche) */}
                        {/* justify-end pousse le contenu vers le bas, items-start l'aligne à gauche */}
                        <div className="absolute inset-0 flex flex-col justify-end items-start p-5 lg:p-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                            {/* Le texte */}
                            <div className="max-w-2xl">
                                <h2 className="text-left text-5xl lg:text-7xl font-raleway font-bold text-white drop-shadow-lg pb-5">
                                    Gérez vos projets avec clarté.
                                </h2>
                                <p className="text-xl lg:text-2xl text-white font-merriweather pb-5 drop-shadow-md">
                                    La solution Kanban simple et puissante pour les équipes modernes.
                                </p>
                                <ul className="text-white text-left list-disc pl-6 space-y-2 text-lg drop-shadow-md font-raleway">
                                    <li>Tableau Kanban interactif avec glisser-déposer</li>
                                    <li>Suivi du temps prévu et réel par tâche</li>
                                    <li>Collaboration en équipe en temps réél</li>
                                    <li>Export PDF du tableau de bord</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;