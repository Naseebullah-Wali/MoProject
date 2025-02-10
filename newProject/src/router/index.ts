import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Import views
import HomeView from '../views/HomeView.vue';
import ProjectView from '../views/ProjectView.vue';
import AboutView from '../views/AboutView.vue';
import TopicsView from '../views/TopicsView.vue';
import CompaniesView from '../views/CompaniesView.vue';
import UsersView from '../views/UsersView.vue';
import ReviewsView from '../views/ReviewsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectDetails from '../views/ProjectDetails.vue'
import UpdateDetail from '../views/UpdateDetail.vue'
import NewsDetailsVue from '../views/NewsDetails.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView 
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectView
  },
  {
    path: '/topics',
    name: 'topics',
    component: TopicsView
  },
  {
    path: '/companies',
    name: 'companies',
    component: CompaniesView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView // Only for admin users; enforce via route guards
  },
  {
    path: '/reviews/:id',
    name: 'reviews',
    component: ReviewsView // Only for admin users; enforce via route guards
  },
  {
    path: '/news/:id',
    name: 'news',
    component: NewsDetailsVue // Only for admin users; enforce via route guards
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/projects1/:id',
    name: 'projectDetails1',
    component: ProjectDetails,
  },
  {
    path: "/updates/:id",
    name: "UpdateDetail",
    component: UpdateDetail,
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetails',
    component: ProjectDetails,
  },
  
];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
  const userType = localStorage.getItem('userType'); // Mock example; replace with actual auth logic
  if ((to.name === 'users' || to.name === 'UsersView') && userType !== 'admin') {
    next('/'); // Redirect to home if not an admin
  } else {
    next(); // Proceed to the route
  }
});


export default router;
