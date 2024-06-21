import Theme from './theme/theme';
//import Login from './ui/components/login/Login';
import Admin from './ui/components/administrator/Admin';
//import Secretaries from './ui/components/secretaries/Secretaries';
//import Teachers from './ui/components/teachers/Teachers';
//import Student from './ui/components/student/Student';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { SnackbarProvider } from 'notistack';

function App() {

  return (
    <Theme>
      {//<Login />
        //<Secretaries/>
        //<Admin/>
        //<Teachers/>
        //<Student />
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
