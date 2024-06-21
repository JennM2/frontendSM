import Theme from './theme/theme';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { SnackbarProvider } from 'notistack';

function App() {

  return (
    <Theme>
      {
        <SnackbarProvider
          autoHideDuration={5000}
          maxSnack={10}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <RouterProvider router={routes}/>
        </SnackbarProvider>
      }
    </Theme>
  );
}

export default App;
