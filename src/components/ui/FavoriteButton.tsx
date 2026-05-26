import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  toolId: string;
  }

export function FavoriteButton({ toolId, }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('lumea_favorites') || '[]');
      setIsFavorite(favorites.includes(toolId));
    } catch {
      setIsFavorite(false);
    }
  }, [toolId]);

  const toggleFavorite = () => {
    try {
      let favorites = JSON.parse(localStorage.getItem('lumea_favorites') || '[]');
      if (favorites.includes(toolId)) {
        favorites = favorites.filter((id: string) => id !== toolId);
        setIsFavorite(false);
        toast('Removed from favorites', { icon: '💔' });
      } else {
        favorites.push(toolId);
        setIsFavorite(true);
        toast('Added to favorites', { icon: '❤️' });
      }
      localStorage.setItem('lumea_favorites', JSON.stringify(favorites));
      
      // Dispatch an event so index.astro can update immediately if needed
      window.dispatchEvent(new Event('lumea:favorites-updated'));
    } catch (err) {
      console.error('Failed to save favorite:', err);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-xl transition-all border ${
        isFavorite
          ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-500 border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/50'
          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-800/50'
      }`}
      aria-label="Toggle Favorite"
      title="Toggle Favorite"
    >
      <Heart
        size={20}
        className={`transition-all ${isFavorite ? 'fill-rose-500' : 'fill-transparent'}`}
      />
    </button>
  );
}
