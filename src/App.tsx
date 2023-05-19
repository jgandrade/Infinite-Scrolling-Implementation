import { useState, useEffect, useCallback } from "react";
import { Button, Card } from "react-bootstrap";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import PokemonDetails from "./PokemonDetails";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";

interface PokemonData {
  name: string;
  url: string;
}

function App() {
  const [pokemons, setPokemons] = useState<PokemonData[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [next, setNext] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`
    );
    const data = await response.json();
    setPokemons(data.results);
    setNext(data.next);
    setLoading(false);
  }, []);

  const getNextFetch = useCallback(async () => {
    const response = await fetch(next);
    const data = await response.json();
    if (pokemons) {
      setPokemons([...pokemons, ...data.results]);
    }
    if (data.next) {
      setNext(data.next);
    } else {
      setHasMore(false);
    }
  }, [next, pokemons]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  if (loading) {
    return <Oval />;
  }

  return (
    <>
      <div>
        <InfiniteScroll
          dataLength={pokemons ? pokemons.length : 0}
          next={getNextFetch}
          hasMore={hasMore}
          loader={<Oval />} 
        >
          {pokemons?.map((pokemon) => {
            const linkId = pokemon.url.split("/").at(-2);
            return (
              <Card style={{ width: "20rem", border: "1px solid gray" }}>
                <Card.Body>
                  <Card.Title className="text-uppercase font-weight-bold">
                    {pokemon.name}
                  </Card.Title>
                  <Link to={`/${linkId}`}>
                    <Button variant="success">Know More</Button>
                  </Link>
                </Card.Body>
              </Card>
            );
          })}
        </InfiniteScroll>

        <Routes>
          <Route path="/:pokemonId" element={<PokemonDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
