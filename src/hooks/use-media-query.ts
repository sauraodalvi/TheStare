import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update state with current value
    const updateMatches = () => setMatches(media.matches);
    
    // Set initial value
    updateMatches();
    
    // Add listener for changes
    media.addEventListener('change', updateMatches);
    
    // Cleanup
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}
