import Link from 'next/link';
import Image from 'next/image';
import { ABOUT_POKEMON_IMG, RS_SCHOOL_COURSE_URL } from '@/constants';

function About() {
  return (
    <div className="page-wrapper">
      <div className="page-card">
        <div className="about-hero">
          <Image 
            src={ABOUT_POKEMON_IMG.URL} 
            alt={ABOUT_POKEMON_IMG.NAME} 
            className="about-pokemon"
            width={180}
            height={180}
          />
          <div className="about-text">
            <h1 className="page-title">About Pokédex Explorer</h1>
            <p className="page-subtitle">
              A fast and minimal Pokédex built with React. Search any Pokémon by name, browse stats,
              and explore the full PokéAPI catalogue - all in one place.
            </p>
            <ul className="about-features">
              <li>Instant search by Pokémon name</li>
              <li>Paginated results with URL sync</li>
              <li>Detailed stats panel via React Router Outlet</li>
              <li>Last search saved in localStorage</li>
            </ul>
            <p className="about-author">
              Built by <strong>solarsungai</strong> as part of the{' '}
              <a
                href={RS_SCHOOL_COURSE_URL}
                target="_blank"
                rel="noreferrer"
                className="about-link"
              >
                RS School React Course
              </a>
              .
            </p>
            <Link href="/" className="btn-primary">
              Go to Pokédex
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;