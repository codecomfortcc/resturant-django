import { Home, About, Contact, Menu, MenuItem } from "./pages"; 
import '../style.css'
import './css/footer.css';
import Navigo from 'navigo';
import ReservationPage from './pages/reservation-page';
import Navbar from './components/Navbar';
import LoginPage from "./pages/login-page";

const root = null;
const useHash = true;
const router = new Navigo(root, useHash);
const container = document.getElementById('root');
const navbarContainer = document.getElementById('navbar-container');

const navbar = new Navbar();
navbar.mount(navbarContainer);

const mountComponent = (ComponentClass, container, props = {}) => {
  const component = new ComponentClass({ ...props, router }); 
  component.mount(container);
  return component;
};

const updateNavbar = (path) => {
  navbar.highlightCurrentPage(path);
};

router
  .on('/', () => {
    mountComponent(Home, container, { router });
    updateNavbar('/');
  })
  .on('/menu', () => {
    mountComponent(Menu, container, { router });
    updateNavbar('/menu');
  })
  .on('/about', () => {
    mountComponent(About, container, { router });
    updateNavbar('/about');
  })
  .on('/contact', () => {
    mountComponent(Contact, container, { router });
    updateNavbar('/contact');
  })
  .on('/menu/:id', (params) => {
    mountComponent(MenuItem, container, { id: params.data.id, router });
    updateNavbar('/menu');
  })
  .on('/reservation', (params) => {
    mountComponent(ReservationPage, container, { id: params.id, router });
    updateNavbar('/reservation');
  })
  .on('/login',()=>{
    mountComponent(LoginPage,container,{router});
  })
  .notFound(() => {
    container.innerHTML = '<h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>';
    updateNavbar('/');
  })
  .resolve();

router.hooks({
  after: (match) => {
    updateNavbar(match.url);
  }
});
