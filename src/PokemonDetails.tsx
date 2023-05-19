import { useState, useCallback, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Oval } from "react-loader-spinner";
import { useParams } from "react-router-dom";

interface Pokemon {
  name: string;
  sprites: { front_default: string };
}

function PokemonDetails() {
  const { pokemonId } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [loading, setLoading] = useState<boolean>(true);
  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const data = await response.json();
    setPokemon(data);
    setLoading(false);
  }, [pokemonId]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  if (loading) {
    return (
      <Oval
        wrapperStyle={{ position: "fixed", right: "12em", top: "45vh" }}
        height={80}
        width={80}
        color="#4fa94d"
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    );
  }
  return (
    <Card
      style={{
        width: "18rem",
        position: "fixed",
        right: "5em",
        top: "35vh",
      }}
    >
      <Card.Img src={pokemon?.sprites.front_default} />
      <Card.Body>
        <Card.Title className="text-uppercase font-weight-bold">
          {pokemon?.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default PokemonDetails;
