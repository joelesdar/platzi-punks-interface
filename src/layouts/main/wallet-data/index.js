import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";
import { useCallback, useEffect, useMemo, useState } from "react";

const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const { active, activate, deactivate, account, error, library } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  // El useCallback memoriza las funciones, con esto recordamos el estado de la conexion con la red escogida, incluso cuando se recarga la app.
  // Solo cambia esta informacion con el arreglo de dependencias 
  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem('previouslyConnected', 'true');
  }, [activate]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('previouslyConnected');
  }

  // El useEffect se ejecuta despues de que se renderiza el componente.
  // Se puede volver a ejecutar cuando se actualiza informacion en el arreglo de dependencias.
  useEffect(() => {
    if(localStorage.getItem('previouslyConnected') === 'true')
    connect();
  }, [connect]);

  const getBalance = useCallback(async () => {
    const balanceToSet = await library.eth.getBalance(account);
    setBalance((balanceToSet / 1e18).toFixed(4));
  }, [library?.eth, account]);

  useEffect(() => {
    if (active)
    getBalance();
  }, [active, getBalance]);

  const ShortAddressCalculator = (account) => {
    const newAddress = useMemo(() => 
    `${account?.substr(0, 5)}...${account?.substr(-4)}`,
    [account]
    );

    return newAddress;
  };

  const shortAddress = ShortAddressCalculator(account);

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to="/punks">{shortAddress}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton 
          onClick={disconnect}
          />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? 'Red no soportada' : 'Conectar Wallet'}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
