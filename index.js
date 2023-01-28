import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import App from './App';
import TaskCollector from './src/task/TaskCollector';

AppRegistry.registerHeadlessTask('SlimbotCollector', () => TaskCollector);

registerRootComponent(App);
