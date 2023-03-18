import {
  Container,
  HStack,
  Button,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../index";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";

const Coins = () => {
  const [coins, setcoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pages, setpages] = useState(1);
  const [currancy, setcurrancy] = useState("inr");

  const CurrencySymbol =
    currancy === "inr" ? "₹" : currancy === "eur" ? "€" : "$";

    // pagination page 
    const changepage=(page)=>{
      setpages(page)
      setLoading(true)
      console.log("setpages ")
    }

    // making noof page button
    const btn= new Array(132).fill(1)

  useEffect(() => {
    const fetchcoins = async () => {
      try {
        const { data } = await axios.get(
          `${server}/coins/markets?vs_currency=${currancy}&page=${pages}`
        );
        setcoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchcoins();
  }, [currancy, pages]);

  
  if (error) return <ErrorComponent message={"Error While Fetching Coins "} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>
        <RadioGroup value={currancy} onChange={setcurrancy} p={"8"}>
        <HStack spacing={"4"}> 
          <Radio value={"inr"}>INR</Radio>
          <Radio value={"eur"}>EUR</Radio>
          <Radio value={"usd"}>USD</Radio>
        </HStack>
        </RadioGroup>
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {coins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                img={i.image}
                name={i.name}
                price={i.current_price}
                rank={i.trust_score_rank}
                url={i.url}
                symbol={i.symbol}
                currencySymbol={CurrencySymbol}
              />
            ))}
          </HStack>
          <HStack w={"full"} overflowX={"auto"} p={"8"}>
            {
              btn.map((item , i)=>(
           <Button key={i} bgColor={"blackAlpha.700"} color={"white"} onClick={()=>(changepage(i+1))}>
              {i+1}
            </Button>
              ))
            }
            
          </HStack>
        </>
      )}
    </Container>
  );
};

export default Coins;
