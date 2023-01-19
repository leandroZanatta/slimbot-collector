import { MigrationProvider } from './src/context/MigrationContext';
import Routes from './src/presentation/Routes';
import { Flex } from "@react-native-material/core";


export default function App() {
  return (
    <Flex fill style={{ backgroundColor: '#CCC', paddingBottom: 20 }} >
      <MigrationProvider>
        <Routes />
      </MigrationProvider>
    </Flex>
  );
}