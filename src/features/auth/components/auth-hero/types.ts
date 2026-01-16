/**
 * Hero carousel slide type
 */
export interface HeroSlide {
  /**
   * Unique identifier for the slide
   */
  id: string;

  /**
   * Tagline text to display
   */
  tagline: string;

  /**
   * Background gradient colors (Tailwind classes)
   */
  gradient: string;

  /**
   * Image URL (optional - using gradients for now)
   */
  imageUrl?: string;
}
