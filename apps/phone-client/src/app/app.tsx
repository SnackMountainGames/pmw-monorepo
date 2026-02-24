// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { SharedUiLibrary } from 'shared-ui-library';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <SharedUiLibrary />
      <NxWelcome title="phone-client" />

    </div>
  );
}

export default App;
