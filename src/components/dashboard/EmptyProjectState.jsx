import React from 'react';
import { FolderKanban } from 'lucide-react';

const EmptyProjectState = ({ searchQuery }) => {
    return (
        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 font-raleway">Aucun projet trouvé</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                Nous n'avons pas trouvé de projet correspondant à "{searchQuery}".
                Essayez une autre recherche ou créez un nouveau projet.
            </p>
        </div>
    );
};

export default EmptyProjectState;